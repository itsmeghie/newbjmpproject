import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { TALENTS } from "@/lib/urls";
import { getRecord_Status} from "@/lib/queries";

type AddTalents = {
    name: string;
    description: string;
    record_status: string | null;
};

const AddTalents = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [talentForm, setTalentForm] = useState<AddTalents>({
        name: '',
        description: '',
        record_status: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['status'],
                queryFn: () => getRecord_Status(token ?? "")
            }
        ]
    });

    const recordStatusData = results[0].data;

    async function addTalents(talent: AddTalents) {
        const res = await fetch(TALENTS.getTALENTS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(talent),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Talents";
            try {
                const errorData = await res.json();
                errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
            throw new Error(errorMessage);
        }
        return res.json();
    }

    const talentMutation = useMutation({
        mutationKey: ['talent'],
        mutationFn: addTalents,
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

    const handleTalentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!talentForm.name || !talentForm.description) {
            messageApi.error("Please fill out all fields.");
            return;
        }

        talentMutation.mutate(talentForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTalentForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const recordStatusChange = (value: string) => {
        setTalentForm(prevForm => ({
            ...prevForm,
            record_status: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleTalentSubmit}>
                <div className="space-y-2 flex flex-col">
                    <div>
                        <p>Talents:</p>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                            placeholder="Talent"
                            className="w-full h-12 border border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="w-full h-12 border border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div>
                        <p>Record Status:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={recordStatusChange}
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTalents;