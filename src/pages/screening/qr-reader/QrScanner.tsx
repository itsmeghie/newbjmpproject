/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useEffect, useRef } from 'react';
import { useTokenStore } from '@/store/useTokenStore';
import { useVisitorLogStore } from '@/store/useVisitorLogStore';
import { BASE_URL } from '@/lib/urls';
import { message } from 'antd';

const QrScanner = ({
    setLastScanned,
    selectedDeviceId,
    selectedArea
}: {
    setLastScanned: React.Dispatch<React.SetStateAction<any>>;
    selectedDeviceId: string | number;
    selectedArea: string;
}) => {
    const token = useTokenStore()?.token;
    const { addOrRemoveVisitorLog, pruneOldLogs } = useVisitorLogStore();

    const [scannedQR, setScannedQR] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Add this ref to track the last processed QR code
    const lastProcessedQR = useRef<string | null>(null);
    // Add this ref to track scan cooldown
    const scanCooldown = useRef<boolean>(false);

    // Check and clean storage if needed when component mounts
    useEffect(() => {
        // Try to free up space if needed
        pruneOldLogs();
    }, [pruneOldLogs]);

    useEffect(() => {
        const fetchVisitorLog = async () => {
            if (!scannedQR) return;
            if (!selectedDeviceId) {
                message.warning("Please select a device.")
                return
            };

            // Update the last processed QR value
            lastProcessedQR.current = scannedQR;

            setIsFetching(true);
            setError(null);

            try {
                // First API call - GET visitor log
                const res = await fetch(`${BASE_URL}/api/visit-logs/visitor-specific/?encrypted_id_number=${scannedQR}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch visitor log. Status: ${res.status}`);
                }

                const data = await res.json();

                // Set last scanned regardless of storage issues
                setLastScanned(data);

                // Store visitor data - catch storage issues but continue with API calls
                if (selectedArea?.toLowerCase() === "main gate") {
                    try {
                        const storeSuccess = addOrRemoveVisitorLog(data);
                        if (!storeSuccess) {
                            console.warn("Could not persist to local storage - continuing with API calls");
                            // Try to free up space for next time
                            pruneOldLogs();
                        }
                    } catch (storeErr) {
                        console.error("Error updating visitor log store:", storeErr);
                        // Continue with API calls despite store error
                    }
                }

                // 2. Determine API endpoints based on selectedArea
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

                // Second API call - POST to visits endpoint
                if (data && selectedDeviceId) {
                    const postRes = await fetch(visitsUrl, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        },
                        body: JSON.stringify({
                            device_id: selectedDeviceId,
                            id_number: data.id_number,
                            binary_data: data.encrypted_id_number_qr,
                            person_id: data?.person?.id
                        })
                    });

                    if (!postRes.ok) {
                        throw new Error(`Failed to log visit. Status: ${postRes.status}`);
                    }

                    const visitLogResponse = await postRes.json();
                    message.success("Visit logged successfully!");

                    // Third API call - POST to visits-tracking endpoint
                    if (visitLogResponse?.id) {
                        const trackingRes = await fetch(trackingUrl, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Token ${token}`
                            },
                            body: JSON.stringify({
                                visit_id: visitLogResponse.id
                            })
                        });

                        if (!trackingRes.ok) {
                            throw new Error(`Failed to log visit tracking. Status: ${trackingRes.status}`);
                        }

                        message.success("Visit tracking created successfully!");
                        message.success("Process Complete!");
                    } else {
                        message.warning("Missing visit ID for tracking");
                    }
                } else {
                    message.warning("Please select a device.");
                }

            } catch (err: any) {
                message.error(`Error: ${err.message}`);
                setError(err);
            } finally {
                setIsFetching(false);
                setScannedQR(null);

                // Set a cooldown period before allowing the same QR code to be scanned again
                scanCooldown.current = true;
                setTimeout(() => {
                    // After 2 seconds, reset the cooldown and last processed QR
                    scanCooldown.current = false;
                    lastProcessedQR.current = null;
                }, 2000);
            }
        };

        fetchVisitorLog();
    }, [scannedQR, token, addOrRemoveVisitorLog, setLastScanned, selectedDeviceId, pruneOldLogs, selectedArea]);

    const handleScan = (codes: IDetectedBarcode[]) => {
        if (!isFetching && codes.length > 0 && !scanCooldown.current) {
            const firstCode = codes[0];
            const qrValue = firstCode.rawValue || null;

            // Only set scannedQR if it's different from the last processed QR
            // or if we're not in a cooldown period
            if (qrValue && (qrValue !== lastProcessedQR.current || lastProcessedQR.current === null)) {
                setScannedQR(qrValue);
            }
        }
    };

    const handleError = (err: unknown) => {
        message.error(`Scanner error: ${String(err)}`);
    };

    useEffect(() => {
        if (isFetching) {
            message.info("Processing scan...");
        }
    }, [isFetching]);

    // handle showing message when error happens
    useEffect(() => {
        if (error) {
            message.error(`Error: ${error.message}`);
        }
    }, [error]);

    return (
        <div className="w-[35%] mb-5">
            <Scanner
                onScan={handleScan}
                onError={handleError}
                scanDelay={1000}
                allowMultiple={false}
            />
        </div>
    );
};

export default QrScanner;