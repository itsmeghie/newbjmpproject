import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { AFFILIATION_TYPES } from "@/lib/urls";

type AddAffiliationType = {
    affiliation_type: string;
    description: string;
}

const AddAffiliationType = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [affiliationType, setAffiliationType] = useState<AddAffiliationType>({
        affiliation_type: '',
        description: '',
    });

    async function AddAffiliationType(affiliation_type: AddAffiliationType) {
        const res = await fetch(AFFILIATION_TYPES.getAFFILIATION_TYPES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(affiliation_type),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Affiliation Type";
    
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

    const affiliationTypeMutation = useMutation({
        mutationKey: ['affiliation-type'],
        mutationFn: AddAffiliationType,
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

    const handleAffiliationTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        affiliationTypeMutation.mutate(affiliationType);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAffiliationType(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleAffiliationTypeSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <p>Affiliation Type:</p>
                        <input type="text" name="affiliation_type" id="affiliation_type" onChange={handleInputChange} placeholder="Affiliation Type" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                        
                </div>

                <div className="w-full flex justify-end mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAffiliationType;