import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type SuffixProps = {
    record_status_id: number | null,
    suffix: string,
    full_title: string,
    description: string
}

const AddSuffix = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [suffixForm, setSuffixForm] = useState<SuffixProps>({
        record_status_id: null,
        suffix: '',
        description: '',
        full_title: '',
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

    async function addSuffix(suffix: SuffixProps) {
        const res = await fetch(`${BASE_URL}/api/standards/suffix/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(suffix),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Suffix";
    
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

    const suffixMutation = useMutation({
        mutationKey: ['suffix'],
        mutationFn: addSuffix,
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

    const handleSuffixSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        suffixMutation.mutate(suffixForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSuffixForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setSuffixForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
<div>
            {contextHolder}
            <form onSubmit={handleSuffixSubmit}>
                <h1 className="text-xl font-semibold">Suffixes</h1>
                <div className="flex mt-2 flex-col gap-5">
                    <div>
                        <p>Suffix:</p>
                        <input type="text" name="suffix" id="suffix" onChange={handleInputChange} placeholder="Suffix" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Title:</p>
                        <input type="text" name="full_title" id="full_title" onChange={handleInputChange} placeholder="Full Title" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddSuffix
