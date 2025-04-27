import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PrefixProps = {
    record_status_id: number | null,
    prefix: string,
    full_title: string,
    description: string
}

const AddPrefixes = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [prefixForm, setPrefixForm] = useState<PrefixProps>({
        record_status_id: null,
        prefix: "",
        description: "",
        full_title: "",
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            }
        ]
    });

    const recordStatusData = results[0].data;

    async function addPrefix(prefix: PrefixProps) {
        const res = await fetch(`${BASE_URL}/api/standards/prefix/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(prefix),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Prefix";
    
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

    const prefixMutation = useMutation({
        mutationKey: ['prefix'],
        mutationFn: addPrefix,
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

    const handlePrefixSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        prefixMutation.mutate(prefixForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrefixForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setPrefixForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handlePrefixSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="font-medium">Prefix:</p>
                        <input type="text" name="prefix" id="prefix" onChange={handleInputChange} placeholder="Prefix" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="font-medium">Full Title:</p>
                        <input type="text" name="full_title" id="full_title" onChange={handleInputChange} placeholder="Full Title" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="font-medium">Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="font-medium">Record Status:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Record Status"
                            optionFilterProp="label"
                            onChange={onRecordStatusChange}
                            options={recordStatusData?.map(status => (
                                {
                                    value: status.id,
                                    label: status?.status,
                                }
                            ))}
                        />
                    </div>
                        
                    
                </div>
                <div className="w-full flex justify-end mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPrefixes
