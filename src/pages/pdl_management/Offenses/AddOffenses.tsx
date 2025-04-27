import { getCrimeCategories, getLaws, getRecord_Status } from "@/lib/queries";
import { BASE_URL } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type OffenseFormValues = {
    crime_category_id: number;  
    law_id: number;             
    record_status_id: number;   
    offense: string;           
    description: string;       
    crime_severity: string;    
    punishment: string;        
}; 

const AddOffenses = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectOffenses, setSelectedOffenses] = useState<OffenseFormValues>({
        crime_category_id: 0,
        law_id: 0,
        record_status_id: 0,
        offense: '',
        description: '',
        crime_severity: '',
        punishment: '',
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["crime-category"],
                queryFn: () => getCrimeCategories(token ?? ""),
            },
            {
                queryKey: ["law"],
                queryFn: () => getLaws(token ?? ""),
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ],
    });

    const crimeCategoryData = results[0].data;
    const lawData = results[1].data;
    const recordStatusData = results[2].data;

    const onCrimeCategoryChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            crime_category_id: value,
        }));
    };

    const onLawChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            law_id: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };

    async function addOffenses(offense: OffenseFormValues) {
        const res = await fetch(`${BASE_URL}/api/standards/offense/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(offense),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Offenses";
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

    const OffensesMutation = useMutation({
        mutationKey: ["offenses"],
        mutationFn: addOffenses,
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

    const handleOffensesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        OffensesMutation.mutate(selectOffenses);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setSelectedOffenses(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div>
                {contextHolder}
            <form onSubmit={handleOffensesSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p className="text-gray-500 font-bold">Offense:</p>
                        <input type="text" name="offense" id="offense" onChange={handleInputChange} placeholder="Offense" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Crime Severity:</p>
                        <input type="text" name="crime_severity" id="crime_severity" onChange={handleInputChange} placeholder="Crime Severity" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Punishment:</p>
                        <input type="text" name="punishment" id="punishment" onChange={handleInputChange} placeholder="Punishment" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
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
                        <p className="text-gray-500 font-bold">Law:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Law"
                        optionFilterProp="label"
                        onChange={onLawChange}
                        options={lawData?.map(law => (
                            {
                                value: law.id,
                                label: law?.name,
                            }
                        ))}
                        />
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

export default AddOffenses
