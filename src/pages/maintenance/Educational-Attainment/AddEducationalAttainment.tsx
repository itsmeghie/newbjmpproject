import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";
import { BASE_URL } from "@/lib/urls";

type EducationalAttainmentProps = {
    record_status_id: number | null;
    name: string;
    description: string;
}

const AddEducationalAttainment = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [educationalAttainmentForm, setEducationalAttainmentForm] = useState<EducationalAttainmentProps>({
        record_status_id: null,
        name: '',
        description: '',
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

    async function AddEducationalAttainment(educational_attainment: EducationalAttainmentProps) {
        const res = await fetch(`${BASE_URL}/api/standards/educational-attainment/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(educational_attainment),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Educational Attainment";
    
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

    const educationalAttainmentMutation = useMutation({
        mutationKey: ['educational-attainment'],
        mutationFn: AddEducationalAttainment,
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

    const handleEducationalAttainmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        educationalAttainmentMutation.mutate(educationalAttainmentForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEducationalAttainmentForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setEducationalAttainmentForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleEducationalAttainmentSubmit}>
                <h1 className="text-xl font-semibold">Educational Attainment</h1>
                <div className="flex flex-col gap-5">
                    <div>
                        <p>Educational Attainment:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Educational Attainments" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddEducationalAttainment
