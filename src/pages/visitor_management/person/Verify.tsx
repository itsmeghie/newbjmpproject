import { FACE } from "@/lib/urls"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BIOMETRIC } from "@/lib/urls"

type FaceResponse = {
    result: string;
    images: {
        icao: string
        original: string,
    };
}


const captureFace = async (): Promise<FaceResponse> => {
    const response = await fetch(FACE.CAPTURE_FACE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: "start" }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const verifyFace = async (verificationPayload: { template: string, type: string }): Promise<any> => {
    const response = await fetch(BIOMETRIC.IDENTIFY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationPayload),
    });

    if (!response.ok) {
        throw new Error('Failed to enroll biometric data');
    }

    return response.json();
};

const Verify = () => {
    const [icao, setIcao] = useState("")
    const [verificationPayload, setVerificationPayload] = useState({ template: '', type: 'face' })
    const [verificationResult, setVerificationResult] = useState({ message: '', first_name: '', last_name: '' })

    const faceRegistrationMutation = useMutation({
        mutationKey: ['visitor-registration'],
        mutationFn: captureFace,
        onSuccess: (data) => {
            setIcao(data?.images?.icao)
            setVerificationPayload(prevState => ({ ...prevState, template: data.images.icao }))
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleCaptureFace = () => {
        faceRegistrationMutation.mutate()
    };

    const verifyFaceMutation = useMutation({
        mutationKey: ['biometric-enrollment'],
        mutationFn: verifyFace,
        onSuccess: (data) => {
            setVerificationResult(data)
        },
        onError: (error) => {
            console.error("Biometric enrollment failed:", error);
        },
    });

    const handleVerifyFace = () => {
        verifyFaceMutation.mutate(verificationPayload)
    };

    return (
        <div className="flex gap-5 mt-10">
            <div className="flex-1">
                <img
                    src={icao ? `data:image/png;base64,${icao}` :
                        "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"}
                    className="w-[413px] h-[531px]"
                />
            </div>
            <div className="flex flex-col gap-3 w-full flex-1">
                <h1 className="font-semibold text-3xl pl-5">{verificationResult.message}</h1>
                <h1 className="font-semibold text-xl pl-5">
                    {verificationResult?.data?.[0]?.biometric?.person_data?.first_name} &nbsp;
                    {verificationResult?.data?.[0]?.biometric?.person_data?.middle_name} &nbsp;
                    {verificationResult?.data?.[0]?.biometric?.person_data?.last_name}

                </h1>
                <div className="w-full flex flex-col items-center justify-center gap-5 mt-20">
                    <div className="w-52 bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                        <button onClick={handleCaptureFace}>Capture Face</button>
                    </div>
                    {
                        icao ? (
                            <div className="w-52 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                                <button onClick={handleVerifyFace}>Verify Face</button>
                            </div>
                        ) : (
                            <div className="w-52 bg-gray-200 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                                <button>Verify Face</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Verify