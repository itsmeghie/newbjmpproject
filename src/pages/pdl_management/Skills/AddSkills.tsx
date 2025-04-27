import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { SKILLS } from "@/lib/urls";
import { getRecord_Status } from "@/lib/queries";

type AddSkills = {
    name: string;
    description: string;
    record_status: string | null;
};

const AddSkills = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [skillsForm, setSkillsForm] = useState<AddSkills>({
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

    async function addSkills(skills: AddSkills) {
        const res = await fetch(SKILLS.postSKILLS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(skills),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Skills";
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

    const skillsMutation = useMutation({
        mutationKey: ['skills'],
        mutationFn: addSkills,
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

    const handleSkillsSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!skillsForm.name || !skillsForm.description) {
            messageApi.error("Please fill out all fields.");
            return;
        }

        skillsMutation.mutate(skillsForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSkillsForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const recordStatusChange = (value: string) => {
        setSkillsForm(prevForm => ({
            ...prevForm,
            record_status: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleSkillsSubmit}>
                <div className="space-y-2 flex flex-col">
                    <div>
                        <p>Skill:</p>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange}
                        placeholder="Skill"
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

export default AddSkills;