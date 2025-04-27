import { useTokenStore } from "@/store/useTokenStore"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from 'antd';
import { ID_TYPE } from "@/lib/urls";

type IDType = {
    id_type: string;
    description: string;
};


const AddIDType = ({ onClose }: { onClose: () => void }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [IDTypeForm, setIDTypeForm] = useState<IDType>({
        id_type: '',
        description: '',
    });

    const token = useTokenStore().token

    async function registerIDType(idtype: IDType) {
        const res = await fetch(ID_TYPE.postID_TYPE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(idtype)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering ID Type');
        }

        return res.json()
    }

    const idTypeMutation = useMutation({
        mutationKey: ['id-type'],
        mutationFn: registerIDType,
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
        setIDTypeForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleGenderSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        idTypeMutation.mutate(IDTypeForm)
    }

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleGenderSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p>ID Type</p>
                            <input type="text" name="id_type" id="id_type" onChange={handleInputChange} placeholder="ID Type" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                        </div>
                        <div>
                            <p>Description</p>
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

export default AddIDType