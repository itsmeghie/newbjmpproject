import { getDevice_Usage } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { DEVICE_TYPE } from "@/lib/urls";

type AddDeviceType = {
    device_type: string;
    purpose: string;
    remarks: string;
    device_usage_id: number | null;
};

const AddDeviceType = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [devicesType, setDevicesType] = useState<AddDeviceType>({
        device_type: '',
        purpose: '',
        remarks: '',
        device_usage_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['device-usage'],
                queryFn: () => getDevice_Usage(token ?? "")
            },
        ]
    });

    const deviceUsageData = results[0].data;
    const deviceUsageLoading = results[0].isLoading;




    async function AddDeviceType(devicesType: AddDeviceType) {
        const res = await fetch(DEVICE_TYPE.getDEVICE_TYPE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(devicesType),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Devices Type";
    
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

    const devicesTypeMutation = useMutation({
        mutationKey: ['devices-type'],
        mutationFn: AddDeviceType,
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

    const handleDevicesTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        devicesTypeMutation.mutate(devicesType);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDevicesType(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onDeviceUsageChange = (value: number) => {
        setDevicesType(prevForm => ({
            ...prevForm,
            device_usage_id: value
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleDevicesTypeSubmit}>
                <h1 className="text-xl font-semibold">Add Device Type</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
                    <div>
                        <p>Device Type:</p>
                        <input type="text" name="device_type" id="device_type" onChange={handleInputChange} placeholder="Device Type" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Purpose:</p>
                        <input type="text" name="purpose" id="purpose" onChange={handleInputChange} placeholder="Purpose" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Remarks:</p>
                        <input type="text" name="remarks" id="remarks" onChange={handleInputChange} placeholder="Remarks" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Device Usage:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Device Usage"
                        optionFilterProp="label"
                        onChange={onDeviceUsageChange}
                        loading={deviceUsageLoading}
                        options={deviceUsageData?.map(deviceusage => (
                            {
                                value: deviceusage.id,
                                label: deviceusage?.usage,
                            }
                        ))}
                    />
                    </div>
                    
                </div>
                <div className="w-full flex justify-end ml-auto mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDeviceType;