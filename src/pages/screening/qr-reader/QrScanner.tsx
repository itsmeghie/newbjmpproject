/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useEffect } from 'react';
import { useTokenStore } from '@/store/useTokenStore';
import { useVisitorLogStore } from '@/store/useVisitorLogStore';
import { BASE_URL } from '@/lib/urls';
import { message } from 'antd';

const QrScanner = ({ setLastScanned }: { setLastScanned: React.Dispatch<React.SetStateAction<any>> }) => {
    const token = useTokenStore()?.token;
    const addOrRemoveVisitorLog = useVisitorLogStore((state) => state.addOrRemoveVisitorLog);

    const logs = useVisitorLogStore()?.visitorLogs
    console.log(logs)

    const [scannedQR, setScannedQR] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchVisitorLog = async () => {
            if (!scannedQR) return;

            setIsFetching(true);
            setError(null);

            try {
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

                addOrRemoveVisitorLog(data);
                setLastScanned(data);

            } catch (err: any) {
                message.error('Error fetching visitor log:', err);
                setError(err);
            } finally {
                setIsFetching(false);
                setScannedQR(null);
            }
        };

        fetchVisitorLog();
    }, [scannedQR, token, addOrRemoveVisitorLog, setLastScanned]);

    const handleScan = (codes: IDetectedBarcode[]) => {
        if (!isFetching && codes.length > 0) {
            const firstCode = codes[0];
            const qrValue = firstCode.rawValue || null;

            if (qrValue) {
                setScannedQR(qrValue);
            }
        }
    };

    const handleError = (err: unknown) => {
        message.error(`Scanner error: ${String(err)}`);
    };

    return (
        <div className="w-[35%] mb-5">
            <Scanner
                onScan={handleScan}
                onError={handleError}
                scanDelay={1000}
            />

            {isFetching && <p className="mt-4 text-blue-500">Fetching visitor log...</p>}
            {error && <p className="mt-4 text-red-500">Error fetching visitor log: {error.message}</p>}
        </div>
    );
};

export default QrScanner;
