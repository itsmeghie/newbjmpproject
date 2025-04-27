import { useTokenStore } from "@/store/useTokenStore"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from 'antd';
import { CIVIL_STATUS } from "@/lib/urls";

type CivilStatus = {
    status: string;
    description: string;
};


const AddCivilStatus = ({ onClose }: { onClose: () => void }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [CivilStatusForm, setCivilStatusForm] = useState<CivilStatus>({
        status: '',
        description: '',
    });

    const token = useTokenStore().token

    async function registerCivilStatus(civil_status: CivilStatus) {
        const res = await fetch(CIVIL_STATUS.postCIVIL_STATUS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(civil_status)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering Civil Status');
        }

        return res.json()
    }

    const CivilStatusMutation = useMutation({
        mutationKey: ['civil-status'],
        mutationFn: registerCivilStatus,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCivilStatusForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleCivilStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        CivilStatusMutation.mutate(CivilStatusForm)
    }

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleCivilStatusSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="w-full">
                            <p>Civil Status:</p>
                            <input type="text" name="status" id="status" onChange={handleInputChange} placeholder="Civil Status" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                        </div>
                        <div className="w-full">
                            <p>Description:</p>
                            <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                        </div>
                        
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

export default AddCivilStatus