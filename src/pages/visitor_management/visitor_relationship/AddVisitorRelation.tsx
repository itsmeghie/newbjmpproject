import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { VISITOR_TO_PDL_RELATIONSHIP } from "@/lib/urls";

type AddVisitorRelation = {
    relationship_name: string;
    description: string;
};

const AddVisitorRelation = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [visitorrelation, setVisitorRelation] = useState<AddVisitorRelation>({
        relationship_name: '',
        description: '',
    });

    async function AddVisitorRelation(visitorrelation: AddVisitorRelation) {
        const res = await fetch(VISITOR_TO_PDL_RELATIONSHIP.getVISITOR_TO_PDL_RELATIONSHIP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(visitorrelation),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Visitor Relationship to PDL";
    
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

    const visitorMutation = useMutation({
        mutationKey: ['visitor-of-pdl'],
        mutationFn: AddVisitorRelation,
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

    const handleplatformSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        visitorMutation.mutate(visitorrelation);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVisitorRelation(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleplatformSubmit}>
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <p>Relationship:</p>
                        <input type="text" name="relationship_name" id="relationship_name" onChange={handleInputChange} placeholder="Relationship Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                </div>

                <div className="w-full flex justify-end ml-auto mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVisitorRelation;