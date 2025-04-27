import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

type WebcamCaptureProps = {
    onCapture: (image: string) => void;
    setCameraModalOpen: (val: boolean) => void;
};

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, setCameraModalOpen }) => {
    const webcamRef = useRef<Webcam>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [captured, setCaptured] = useState(false);

    const handleCapture = useCallback(() => {
        const screenshot = webcamRef.current?.getScreenshot();
        if (screenshot) {
            onCapture(screenshot);
            setCaptured(true);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [onCapture, stream]);

    const handleUserMedia = (mediaStream: MediaStream) => {
        setStream(mediaStream);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {!captured && (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        onUserMedia={handleUserMedia}
                        videoConstraints={{
                            width: 500,
                            height: 520,
                            facingMode: 'user',
                        }}
                        className="rounded-xl shadow"
                    />
                    <button
                        onClick={() => {
                            handleCapture()
                            setCameraModalOpen(false)
                        }}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Capture
                    </button>
                </>
            )}
        </div>
    );
};

export default WebcamCapture;
