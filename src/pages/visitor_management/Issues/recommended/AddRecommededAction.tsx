import { getRecord_Status, getRisks } from "@/lib/queries";
import { BASE_URL} from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type AddRecommededActionProps = {
    record_status_id: number | null;
    name: string;
    description: string;
    risk: number |null;
}

const AddRecommededAction = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectRecommeded, setSelectRecommeded] = useState<AddRecommededActionProps>({
        record_status_id: null,
        name: '',
        description: '',
        risk: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
            {
                queryKey: ['risk'],
                queryFn: () => getRisks(token ?? "")
            },
        ]
    });

    const recordStatusData = results[0].data;
    const riskData = results[1].data;

    async function AddRecommededAction(recommeded_action: AddRecommededActionProps) {
        const res = await fetch(`${BASE_URL}/api/issues_v2/recommended-action/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(recommeded_action),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Recommeded Action";
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

    const RecommededActionMutation = useMutation({
        mutationKey: ['recommended-action'],
        mutationFn: AddRecommededAction,
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

    const handleRecommendedActionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        RecommededActionMutation.mutate(selectRecommeded);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setSelectRecommeded(prevForm => ({
            ...prevForm,
            [name]: value,
            }));
        };

    const onRecordStatusChange = (value: number) => {
        setSelectRecommeded(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    const onRiskChange = (value: number) => {
        setSelectRecommeded(prevForm => ({
            ...prevForm,
            risk: value
        }));
    };

    return (
        <div>
        {contextHolder}
            <form onSubmit={handleRecommendedActionSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p className="text-gray-500 font-bold">Recommended Action:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Recommended Action" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Risk:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Risk"
                        optionFilterProp="label"
                        onChange={onRiskChange}
                        options={riskData?.map(risk => (
                            {
                                value: risk.id,
                                label: risk?.name,
                            }
                        ))}
                        />
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

export default AddRecommededAction
