/* eslint-disable @typescript-eslint/no-explicit-any */
import { IrisCapturePayload, IrisCaptureResponse } from "@/lib/scanner-definitions"
import { captureIris, getIrisScannerInfo, uninitIrisScanner, verifyIris } from "@/lib/scanner-queries"
import { useMutation } from "@tanstack/react-query"
import { Checkbox, message, Select } from "antd"
import { useEffect, useState, useRef } from "react"
import noImg from "@/assets/no-img.webp"
import check from "@/assets/Icons/check-mark.png"
import ex from "@/assets/Icons/close.png"
import { useVisitorLogStore } from '@/store/useVisitorLogStore'
import { useTokenStore } from '@/store/useTokenStore'
import { BASE_URL } from '@/lib/urls'
import { Device } from '@/lib/definitions'

type Props = {
  devices: Device[];
  deviceLoading: boolean;
  selectedArea: string;
}

const Iris = ({ devices, deviceLoading, selectedArea }: Props) => {
  const [lastScanned, setLastScanned] = useState<any | null>(null);
  const token = useTokenStore()?.token;
  const addOrRemoveVisitorLog = useVisitorLogStore((state) => state.addOrRemoveVisitorLog);

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [irisCapturePayload, setIrisCapturePayload] = useState<IrisCapturePayload>({ TimeOut: 50, IrisSide: 0 })
  const [irsCaptureResponse, setIrisCaptureResponse] = useState<IrisCaptureResponse | null>(null)
  const [irisScannerReady, setIrisScannerReady] = useState(false)
  const [irisVerificationResponse, setIrisVerificationResponse] = useState<any>(null)

  // Add this ref to track if processing is in progress to prevent duplicate API calls
  const processingRef = useRef(false);

  // Function to process visitor log and make API calls
  const processVisitorLog = async (verificationData: any) => {
    if (processingRef.current) return;

    if (!selectedDeviceId) {
      message.warning("Please select a device.");
      return;
    }

    const idNumber = verificationData?.data?.[0]?.biometric?.person_data?.visitor?.id_number;
    if (selectedArea !== "PDL Station") {
      if (!idNumber) {
        message.warning("No ID number found.");
        return;
      }
    }

    // Determine URLs based on selectedArea
    let visitsUrl = "";
    let trackingUrl = "";

    switch (selectedArea?.toLowerCase()) {
      case "main gate":
        visitsUrl = `${BASE_URL}/api/visit-logs/main-gate-visits/`;
        trackingUrl = `${BASE_URL}/api/visit-logs/main-gate-tracking/`;
        break;
      case "visitor station":
        visitsUrl = `${BASE_URL}/api/visit-logs/visitor-station-visits/`;
        trackingUrl = `${BASE_URL}/api/visit-logs/visitor-station-tracking/`;
        break;
      case "pdl station":
        visitsUrl = `${BASE_URL}/api/visit-logs/pdl-station-visits/`;
        trackingUrl = `${BASE_URL}/api/visit-logs/pdl-station-tracking/`;
        break;
      default:
        message.error("Unknown area. Cannot post visit.");
        return;
    }

    processingRef.current = true;
    setIsFetching(true);
    setError(null);

    try {
      let visitorData = verificationData;

      // Skip fetch if selectedArea is "pdl station"
      if (selectedArea?.toLowerCase() !== "pdl station") {
        const res = await fetch(`${BASE_URL}/api/visit-logs/visitor-specific/?id_number=${idNumber}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch visitor log. Status: ${res.status}`);
        visitorData = await res.json();

        try {
          addOrRemoveVisitorLog(visitorData);
        } catch (storeErr) {
          console.error("Failed to update visitor log store:", storeErr);
        }

        setLastScanned(visitorData);
      }

      // Post to visit log endpoint
      const postRes = await fetch(visitsUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          device_id: selectedDeviceId,
          id_number: idNumber,
          binary_data: visitorData?.encrypted_id_number_qr,
          person_id: visitorData?.person?.id || verificationData?.data?.[0]?.biometric?.person_data?.id
        })
      });

      if (!postRes.ok) throw new Error(`Failed to log visit. Status: ${postRes.status}`);

      const visitLogResponse = await postRes.json();
      message.success("Visit logged successfully!");

      // Post to tracking endpoint
      if (visitLogResponse?.id) {
        const trackingRes = await fetch(trackingUrl, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify({ visit_id: visitLogResponse.id })
        });

        if (!trackingRes.ok) throw new Error(`Failed to log visit tracking. Status: ${trackingRes.status}`);

        message.success("Visit tracking created successfully!");
        message.success("Process Complete!");
      } else {
        message.warning("Missing visit ID for tracking");
      }

    } catch (err: any) {
      message.warning("No id number provided.");
      message.error(`Error: ${err.message}`);
      setError(err);
    } finally {
      setIsFetching(false);
      setTimeout(() => {
        processingRef.current = false;
      }, 1000);
    }
  };


  // New function to handle verification that prevents duplicate processing
  const handleVerificationSuccess = (data: any) => {
    message.info(data?.message === "Match found." ? "Match Found" : "No Matches Found");

    // Only process the data if a match was found AND we're not already processing
    if (data?.message === "Match found." && !processingRef.current) {
      processVisitorLog(data);
      setIrisVerificationResponse(data)
    }
  };

  const verifyIrisMutation = useMutation({
    mutationKey: ['iris-verification'],
    mutationFn: verifyIris,
    onSuccess: handleVerificationSuccess,
    onError: () => {
      message.info("Match Not Found");
    },
  });

  const handleVerifyIris = () => {
    if (!selectedDeviceId) {
      message.warning("Please select a device.");
      return;
    }

    // Only verify one iris at a time, prioritizing left
    if (irsCaptureResponse?.ImgDataLeft) {
      verifyIrisMutation.mutate({ template: irsCaptureResponse?.ImgDataLeft ?? "", type: "iris" });
    } else if (irsCaptureResponse?.ImgDataRight) {
      verifyIrisMutation.mutate({ template: irsCaptureResponse?.ImgDataRight ?? "", type: "iris" });
    } else {
      message.warning("No iris scan data available");
    }
  }

  const irisScannerUninitThenInitMutation = useMutation({
    mutationKey: ['iris-scanner-uninit'],
    mutationFn: uninitIrisScanner,
    onSuccess: () => {
      irisScannerInitMutation.mutate();
    },
    onError: (error) => {
      console.error(error.message);
    }
  });

  const irisScannerInitMutation = useMutation({
    mutationKey: ['iris-scanner-init'],
    mutationFn: getIrisScannerInfo,
    onSuccess: () => {
      setIrisScannerReady(true);
      message.info("Iris Scanner Ready")
    },
    onError: (error) => {
      console.error(error.message);
      message.info("Error Initializing Iris Scanner")
    }
  });


  const irisScannerCaptureMutation = useMutation({
    mutationKey: ['iris-scanner-capture'],
    mutationFn: () => captureIris(irisCapturePayload),
    onSuccess: (data) => {
      setIrisCaptureResponse(data)
      if (data?.ErrorDescription === "Success") {
        message.success(data?.ErrorDescription)
      } else {
        message.error(data?.ErrorDescription)
      }
    },
    onError: (error) => {
      console.error(error.message);
      message.error("Error scanning iris: " + error?.message)
    }
  });

  let imageSrc = "";

  if (lastScanned?.person?.media) {
    const frontPicture = lastScanned?.person?.media?.find(
      (media: { picture_view: string; }) => media?.picture_view === "Front"
    )?.media_binary;

    if (frontPicture) {
      imageSrc = `data:image/jpeg;base64,${frontPicture}`;
    }
  }

  if (isFetching) {
    message.info("Processing scan...");
  }

  if (error) {
    message.error(`Error: ${error.message}`);
  }

  useEffect(() => {
    irisScannerUninitThenInitMutation.mutate();
  }, []);

  console.log(irisVerificationResponse)

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center mt-5">
      <div className="w-full flex gap-10">
        <div className="w-full flex items-center justify-center flex-1">
          <div className="w-[90%] border border-black flex items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center gap-5 p-5">
              <div className="w-full relative flex items-center justify-center">
                <div className="flex absolute left-2">
                  <p className="me-4">Exclude: </p>
                  <Checkbox
                    checked={irisCapturePayload?.IrisSide === 1}
                    onChange={(e) => {
                      setIrisCapturePayload(prevPayload => (
                        {
                          ...prevPayload,
                          IrisSide: e.target.checked ? 1 : 0
                        }
                      ))
                    }}
                  >
                    Left Iris
                  </Checkbox>
                  <Checkbox
                    checked={irisCapturePayload?.IrisSide === 2}
                    onChange={(e) => {
                      setIrisCapturePayload(prevPayload => (
                        {
                          ...prevPayload,
                          IrisSide: e.target.checked ? 2 : 0
                        }
                      ))
                    }}
                  >
                    Right Iris
                  </Checkbox>
                </div>
                <h2 className="text-center font-semibold">Iris</h2>
              </div>
              <div className="w-full flex gap-5 justify-between">
                <div className={`flex-1 border border-black ${irisCapturePayload?.IrisSide === 1 ? "opacity-20" : ""}`}>
                  <p className="w-full bg-[#1E365D] text-white text-center">Left Iris</p>
                  <div className="h-52">
                    <img
                      src={`data:image/bmp;base64,${irsCaptureResponse?.ImgDataRight}`}
                      className={`w-full h-full object-contain`}
                    />
                  </div>
                </div>
                <div className={`flex-1 border border-black ${irisCapturePayload?.IrisSide === 2 ? "opacity-20" : ""}`}>
                  <p className="w-full bg-[#1E365D] text-white text-center">Right Iris</p>
                  <div className="h-52">
                    <img src={`data:image/bmp;base64,${irsCaptureResponse?.ImgDataLeft}`} className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => irisScannerCaptureMutation.mutate()}
                  type="button"
                  className="bg-[#1976D2] text-white px-10 py-2 rounded-md w-52">
                  Capture Iris
                </button>
                {
                  irsCaptureResponse?.ImgDataLeft || irsCaptureResponse?.ImgDataRight ? (
                    <button
                      onClick={handleVerifyIris}
                      type="button"
                      disabled={processingRef.current || isFetching} // Disable while processing
                      className={`bg-[#1976D2] text-white px-10 py-2 rounded-md w-52 ${(irisScannerReady && !processingRef.current && !isFetching) ? "opacity-100" : "opacity-20"}`}>
                      Verify Iris
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-[#1976D2] text-white px-10 py-2 rounded-md w-52 opacity-20">
                      Verify Iris
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        </div>

        {
          selectedArea?.toLowerCase() === "pdl station" ? (
            <div className='flex-1'>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-center flex-col gap-10">
                  <div className="w-[60%] rounded-md overflow-hidden object-cover">
                    {
                      irisVerificationResponse ? (
                        <img src={`data:image/jpeg;base64,${irisVerificationResponse?.data?.[0]?.additional_biometrics?.find((bio: { position: string }) => bio?.position === "face")?.data}`} alt="Image of a person" className="w-full" />
                      ) : (
                        <img src={noImg} alt="Image of a person" className="w-full" />
                      )
                    }
                  </div>
                  <h1 className="text-4xl">{`${irisVerificationResponse?.data?.[0]?.biometric?.person_data?.first_name ?? ""} ${irisVerificationResponse?.data?.[0]?.biometric?.person_data?.middle_name ?? ""} ${irisVerificationResponse?.data?.[0]?.biometric?.person_data?.last_name ?? ""}`}</h1>
                </div>
                {
                  lastScanned && (
                    <div className="w-full flex items-center justify-center">
                      <div className="w-[80%] text-4xl flex">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-[4] flex gap-8">

                            <>
                              <span>STATUS:</span>
                              <span>ALLOWED VISIT</span>
                            </>

                          </div>
                          <div className="flex justify-end flex-1 gap-4">
                            <div className="w-16">
                              <img src={check} alt="check icon" />
                            </div>
                            <div className="w-16">
                              <img src={ex} alt="close icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          ) : (
            <div className='flex-1'>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-center flex-col gap-10">
                  <div className="w-[60%] rounded-md overflow-hidden object-cover">
                    <img src={imageSrc || noImg} alt="Image of a person" className="w-full" />
                  </div>
                  <h1 className="text-4xl">{`${lastScanned?.person?.first_name ?? ""} ${lastScanned?.person?.last_name ?? ""}`}</h1>
                </div>
                {
                  lastScanned && (
                    <div className="w-full flex items-center justify-center">
                      <div className="w-[80%] text-4xl flex">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-[4] flex gap-8">

                            <>
                              <span>STATUS:</span>
                              <span>ALLOWED VISIT</span>
                            </>

                          </div>
                          <div className="flex justify-end flex-1 gap-4">
                            <div className="w-16">
                              <img src={check} alt="check icon" />
                            </div>
                            <div className="w-16">
                              <img src={ex} alt="close icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )
        }

      </div>
      <div className="w-full flex gap-3 items-center">
        <span className="font-semibold">DEVICE ID:</span>
        <Select
          loading={deviceLoading}
          showSearch
          optionFilterProp="label"
          className="h-10 w-72"
          options={devices?.map(device => ({
            label: device?.device_name,
            value: device?.id
          }))}
          value={selectedDeviceId || undefined}
          onChange={value => {
            setSelectedDeviceId(value)
          }}
          placeholder="Select a device"
        />
      </div>
    </div>
  )
}

export default Iris