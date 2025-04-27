import { Person } from "@/lib/definitions";
import { FACE, BIOMETRIC } from "@/lib/urls"
import { useMutation } from '@tanstack/react-query';
import { useState } from "react";

type FaceResponse = {
    result: string;
    images: {
        icao: string
        original: string,
    };

}

type BiometricRecordFace = {
    remarks: string;
    person: number | null;
    biometric_type: string;
    position: string;
    place_registered: string;
    upload_data: string;
};

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

const enrollBiometric = async (enrollForm: BiometricRecordFace): Promise<any> => {
    const response = await fetch(BIOMETRIC.ENROLL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollForm),
    });

    if (!response.ok) {
        throw new Error('Failed to enroll biometric data');
    }

    return response.json();
};



const FaceRegistrationForm = ({ person }: { person: Person | null }) => {
    const [icao, setIcao] = useState("")
    const [enrollForm, setEnrollForm] = useState<BiometricRecordFace>(
        {
            remarks: "Test",
            person: person?.id ?? null,
            biometric_type: "face",
            position: "face",
            place_registered: "Quezon City",
            upload_data: icao,
        }
    )

    const faceRegistrationMutation = useMutation({
        mutationKey: ['visitor-registration'],
        mutationFn: captureFace,
        onSuccess: (data) => {
            setIcao(data?.images?.icao)
            setEnrollForm(prevStates => (
                { ...prevStates, upload_data: data?.images?.icao }
            ))
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleCaptureFace = () => {
        faceRegistrationMutation.mutate()
    };

    const enrollBiometricMutation = useMutation({
        mutationKey: ['biometric-enrollment'],
        mutationFn: enrollBiometric,
        onSuccess: (data) => {
            console.log("Biometric enrollment successful:", data);
        },
        onError: (error) => {
            console.error("Biometric enrollment failed:", error);
        },
    });

    const handleEnrollBiometric = () => {
        enrollBiometricMutation.mutate(enrollForm)
    };

    return (
        <div>
            {person && (
                <div className="flex gap-5 mt-10">
                    <div className="flex-1">
                        <img
                            src={icao ? `data:image/png;base64,${icao}` :
                                "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"}
                            className="w-[413px] h-[531px]"
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-full flex-1">
                        <p className="text-lg bg-gray-200 p-3 rounded-lg"><strong>First Name:</strong> {person.first_name}</p>
                        <p className="text-lg bg-gray-200 p-3 rounded-lg"><strong>Person ID:</strong> {person.id}</p>
                        <p className="text-lg bg-gray-200 p-3 rounded-lg"><strong>Last Name:</strong> {person.last_name}</p>
                        <p className="text-lg bg-gray-200 p-3 rounded-lg"><strong>Biometric Type:</strong> {enrollForm.biometric_type}</p>
                        <p className="text-lg bg-gray-200 p-3 rounded-lg"><strong>Place Registered:</strong> {enrollForm.place_registered}</p>

                        <div className="w-full flex flex-col items-center justify-center gap-5 mt-20">
                            <div className="w-52 bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                                <button onClick={handleCaptureFace}>Capture Face</button>
                            </div>
                            {
                                icao ? (
                                    <div className="w-52 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                                        <button onClick={handleEnrollBiometric}>Enroll Face</button>
                                    </div>
                                ) : (
                                    <div className="w-52 bg-gray-200 text-white font-semibold px-3 py-1.5 rounded-lg flex justify-center items-center">
                                        <button>Enroll Face</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FaceRegistrationForm