import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { DEVICE_USAGE } from "@/lib/urls";

type AddDeviceUsage = {
    usage: string;
    description: string;
};

const AddDeviceUsage = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [devicesUsage, setDevicesUsage] = useState<AddDeviceUsage>({
        usage: '',
        description: '',
    });

    async function AddDeviceUsage(devicesUsage: AddDeviceUsage) {
        const res = await fetch(DEVICE_USAGE.getDEVICE_USAGE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(devicesUsage),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Devices Usage";
    
            try {
                const errorData = await res.json();
                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
    
            throw new Error(errorMessage);
        }
    
        return res.json();
    }

    const devicesUsageMutation = useMutation({
        mutationKey: ['devices-usage'],
        mutationFn: AddDeviceUsage,
        onSuccess: (data) => {
            console.log(data);
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error);
            messageApi.error(error.message);
        },
    });

    const handleDevicesUsageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        devicesUsageMutation.mutate(devicesUsage);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDevicesUsage(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleDevicesUsageSubmit}>
                <div className="flex flex-col gap-3">
                    <div>
                        <p>Device Usage:</p>
                        <input type="text" name="usage" id="usage" onChange={handleInputChange} placeholder="Device Usage" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                </div>
                <div className="w-full flex justify-end mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDeviceUsage;