import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Select, message } from "antd";
import { JAIL_TYPE } from "@/lib/urls";

type AddJailType = {
    type_name: string;
    record_status: number | null;
    description: string;
};

const AddJailType = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [jailTypeForm, setJailTypeForm] = useState<AddJailType>({
        type_name: '',
        record_status: null,
        description: '',
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? ""),
            },
        ],
    });

    const recordStatusData = results[0].data;
    const recordStatusLoading = results[0].isLoading;

    async function registerjailType(jailType: AddJailType) {
        const res = await fetch(JAIL_TYPE.getJAIL_TYPE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(jailType),
        });
    
        if (!res.ok) {
            let errorMessage = "Error registering Detention Floor";
    
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

    const jailTypeMutation = useMutation({
        mutationKey: ['jail-type'],
        mutationFn: registerjailType,
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

    const handlejailTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        jailTypeMutation.mutate(jailTypeForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJailTypeForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setJailTypeForm(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handlejailTypeSubmit}>
                <h1 className="text-xl font-semibold">Jail Type</h1>
                <div className="flex gap-5 mt-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p>Type Name:</p>
                            <input type="text" name="type_name" id="type_name" onChange={handleInputChange} placeholder="Jail Type Name" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Description:</p>
                            <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Record Status:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Record Status"
                                optionFilterProp="label"
                                onChange={onRecordStatusChange}
                                loading={recordStatusLoading}
                                options={recordStatusData?.map(record_status => (
                                    {
                                        value: record_status.id,
                                        label: record_status?.status,
                                    }
                                ))}
                            />
                        </div>
                        
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

export default AddJailType;