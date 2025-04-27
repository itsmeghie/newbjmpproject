/* eslint-disable @typescript-eslint/no-explicit-any */
import QCJMD_logo from "@/assets/Logo/QCJMD.png"
import { useEffect, useState } from "react";
import QrScanner from "./QrScanner";
import noImg from "@/assets/no-img.webp"
import check from "@/assets/Icons/check-mark.png"
import ex from "@/assets/Icons/close.png"
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getDevice } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";

const QrReader = () => {
  const [lastScanned, setLastScanned] = useState<any>({});
  const [dateTime, setDateTime] = useState<string>("");
  const token = useTokenStore()?.token

  const { data, isLoading } = useQuery({
    queryKey: ['get-devices', 'qr-reader'],
    queryFn: () => getDevice(token ?? "")
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setDateTime(now.toLocaleString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);


  let imageSrc = "";

  if (lastScanned?.person?.media) {
    const frontPicture = lastScanned?.person?.media?.find(
      ( media: { picture_view: string; }) => media?.picture_view === "Front"
    )?.media_binary;

    if (frontPicture) {
      imageSrc = `data:image/jpeg;base64,${frontPicture}`;
    }
  }


  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full flex flex-col items-center gap-4">
            <div>
              <img src={QCJMD_logo} alt="QCJMD Logo" />
            </div>
            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-4xl font-semibold">VISITOR CHECK-IN / CHECK-OUT</h1>
              <p>{dateTime}</p>
            </div>
            <div className="w-full flex flex-col items-center gap-10">
              <h2 className="text-3xl font-semibold">Align your QR code within the box to scan</h2>
              <QrScanner setLastScanned={setLastScanned} />
            </div>
          </div>
        </div>
        <div className="flex-1 text-gray-500">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-center flex-col gap-10">
              <div className="w-[75%] rounded-md overflow-hidden object-cover">
                <img src={imageSrc || noImg} alt="Image of a person" className="w-full"/>
              </div>
              <h1 className="text-4xl">{`${lastScanned?.person?.first_name ?? ""} ${lastScanned?.person?.last_name ?? ""}`}</h1>
            </div>
            <div className="w-full flex items-center justify-center">
              <div className="w-[80%] text-4xl flex">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-[4] flex gap-8">
                    <span>STATUS:</span>
                    <span>ALLOWED VISIT</span>
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
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <span className="font-semibold">DEVICE ID:</span>
          <Select
            loading={isLoading}
            showSearch
            optionFilterProp="label"
            className="h-10 w-72"
            options={data?.map(device => ({
              label: device?.device_name,
              value: device?.id
            }))}
          />
        </div>
        <div className="mr-24">
          <button className="bg-blue-200 py-1 px-10 font-semibold rounded hover:bg-blue-500 hover:text-white">Clear</button>
        </div>
      </div>
    </div>
  )
}

export default QrReader