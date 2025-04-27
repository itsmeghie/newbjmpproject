import { getCrimeCategories, getRecord_Status } from "@/lib/queries";
import { BASE_URL } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type LawForm = {
    name: string;           
    title: string;          
    description: string; 
    crime_category_id: number;
    record_status_id: number;
}

const AddLaw = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectLaw, setSelectedLaw] = useState<LawForm>({
        name: '',
        title: '',
        description: '',
        crime_category_id: 0,
        record_status_id: 0,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["crime-category"],
                queryFn: () => getCrimeCategories(token ?? ""),
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ],
    });

    const crimeCategoryData = results[0].data;
    const recordStatusData = results[1].data;

    const onCrimeCategoryChange = (value: number) => {
        setSelectedLaw(prevForm => ({
            ...prevForm,
            crime_category_id: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setSelectedLaw(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };

    async function addLaw(law: LawForm) {
        const res = await fetch(`${BASE_URL}/api/standards/law/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(law),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Law";
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

    const lawMutation = useMutation({
        mutationKey: ["law"],
        mutationFn: addLaw,
        onSuccess: (data) => {
            console.log(data);
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error);
            messageApi.error(error.message);
        },
    })

    const handlelawSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        lawMutation.mutate(selectLaw);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setSelectedLaw(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handlelawSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p className="text-gray-500 font-bold">Law:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Law" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Title:</p>
                        <input type="text" name="title" id="title" onChange={handleInputChange} placeholder="Title" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Crime Category:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Crime Category"
                        optionFilterProp="label"
                        onChange={onCrimeCategoryChange}
                        options={crimeCategoryData?.map(crime => (
                            {
                                value: crime.id,
                                label: crime?.crime_category_name,
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

export default AddLaw
