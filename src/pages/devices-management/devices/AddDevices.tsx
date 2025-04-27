import { getJail, getJail_Area, getDevice_Types } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { DEVICE } from "@/lib/urls";

type AddDevices = {
    device_type_id: number | null;
    jail_id: number | null;
    area_id: number | null;
    device_name: string;
    description: string;
    serial_no: string;
    date_acquired: string | null; 
    manufacturer: string;
    supplier: string;
};

const AddDevices = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [devices, setDevices] = useState<AddDevices>({
        device_type_id: null,
        jail_id: null,
        area_id: null,
        device_name: '',
        description: '',
        serial_no: '',
        date_acquired: null, 
        manufacturer: '',
        supplier: '',
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
            {
                queryKey: ['jail-area'],
                queryFn: () => getJail_Area(token ?? "")
            },
            {
                queryKey: ['device-type'],
                queryFn: () => getDevice_Types(token ?? "")
            },
        ]
    });

    const jailData = results[0].data;
    const jailLoading = results[0].isLoading;

    const jailAreaData = results[1].data;
    const jailAreaLoading = results[1].isLoading;

    const deviceTypeData = results[2].data;
    const deviceTypeLoading = results[2].isLoading;



    async function AddDevices(devices: AddDevices) {
        const res = await fetch(DEVICE.getDEVICE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(devices),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Devices";
    
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

    const devicesMutation = useMutation({
        mutationKey: ['devices'],
        mutationFn: AddDevices,
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

    const handleDevicesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        devicesMutation.mutate(devices);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDevices(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onJailChange = (value: number) => {
        setDevices(prevForm => ({
            ...prevForm,
            jail_id: value
        }));
    };

    const onJailAreaChange = (value: number) => {
        setDevices(prevForm => ({
            ...prevForm,
            area_id: value
        }));
    };

    const onDeviceTypeChange = (value: null) => {
        setDevices(prevForm => ({
            ...prevForm,
            device_type_id: value
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleDevicesSubmit}>
                <h1 className="text-xl font-semibold">Add Device</h1>
                <div className="grid grid-cols-2 mt-5 gap-5">
                    <div>
                        <p>Device Type:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Device Type"
                            optionFilterProp="label"
                            onChange={onDeviceTypeChange}
                            loading={deviceTypeLoading}
                            options={deviceTypeData?.map(device_type => (
                                {
                                    value: device_type.id,
                                    label: device_type?.device_type,
                                }
                            ))}
                        />
                    </div>
                    <div>
                        <p>Device Name:</p>
                        <input type="text" name="device_name" id="device_name" onChange={handleInputChange} placeholder="Device Name" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Jail:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail"
                            optionFilterProp="label"
                            onChange={onJailChange}
                            loading={jailLoading}
                            options={jailData?.map(jail => (
                                {
                                    value: jail.id,
                                    label: jail?.jail_name,
                                }
                            ))}
                        />
                    </div>
                    <div>
                        <p>Jail Type:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Area"
                            optionFilterProp="label"
                            onChange={onJailAreaChange}
                            loading={jailAreaLoading}
                            options={jailAreaData?.map(jailarea => (
                                {
                                    value: jailarea.id,
                                    label: jailarea?.area_name
                                }
                            ))}
                        />
                    </div>
                    <div>
                        <p>Serial No:</p>
                        <input type="number" name="serial_no" id="serial_no" onChange={handleInputChange} placeholder="Serial Number" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Manufacturer:</p>
                        <input type="text" name="manufacturer" id="manufacturer" onChange={handleInputChange} placeholder="Manufacturer" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Supplier:</p>
                        <input type="text" name="supplier" id="supplier" onChange={handleInputChange} placeholder="Supplier" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Date Acquired:</p>
                        <input type="date" name="date_acquired" id="date_acquired" onChange={handleInputChange} placeholder="Date Acquired" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddDevices;