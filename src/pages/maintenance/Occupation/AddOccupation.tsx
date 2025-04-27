import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";
import { BASE_URL } from "@/lib/urls";

type OccupationProps = {
    record_status_id: number | null;
    name: string;
    description: string;
    remarks: string;
}

const AddOccupation = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [occupationForm, setOccupationForm] = useState<OccupationProps>({
        record_status_id: null,
        name: '',
        description: '',
        remarks: '',
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

    async function addOccupation(occupation: OccupationProps) {
        const res = await fetch(`${BASE_URL}/api/pdls/occupations/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(occupation),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Occupation";
    
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

    const occupationMutation = useMutation({
        mutationKey: ['occupation'],
        mutationFn: addOccupation,
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

    const handleOccupationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        occupationMutation.mutate(occupationForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOccupationForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setOccupationForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleOccupationSubmit}>
                <h1 className="font-semibold text-xl">Add Occupation</h1>
                <div className="flex mt-3 flex-col gap-5">
                    <div>
                        <p>Occupation:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Occupation" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Remarks:</p>
                        <input type="text" name="remarks" id="remarks" onChange={handleInputChange} placeholder="Remarks" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddOccupation
