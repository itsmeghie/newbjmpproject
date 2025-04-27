import { getRecord_Status } from "@/lib/queries";
import { BASE_URL} from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type AddRiskLevelProps = {
    record_status_id: number | null;
    name: string;
    description: string;
}

const AddRiskLevel = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectRiskLevel, setSelectRiskLevel] = useState<AddRiskLevelProps>({
        record_status_id: null,
        name: '',
        description: '',
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ]
    });

    const recordStatusData = results[0].data;

    async function AddRiskLevel(risk_level: AddRiskLevelProps) {
        const res = await fetch(`${BASE_URL}/api/issues/risk-levels/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(risk_level),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Risk Level";
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

    const RiskLevelMutation = useMutation({
        mutationKey: ['risk-level'],
        mutationFn: AddRiskLevel,
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

    const handleRiskLevelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        RiskLevelMutation.mutate(selectRiskLevel);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setSelectRiskLevel(prevForm => ({
            ...prevForm,
            [name]: value,
            }));
        };

    const onRecordStatusChange = (value: number) => {
        setSelectRiskLevel(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
        {contextHolder}
            <form onSubmit={handleRiskLevelSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p className="text-gray-500 font-bold">Risk Level:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Risk Level" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Record Status:</p>
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

export default AddRiskLevel
