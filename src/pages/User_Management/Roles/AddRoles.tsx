import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { GROUP_ROLE } from "@/lib/urls";

type AddRoles = {
    name: string;
};

const AddRoles = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [roles, setRoles] = useState<AddRoles>({
        name: '',
    });

    async function AddRoles(platform: AddRoles) {
        const res = await fetch(GROUP_ROLE.getGROUP_ROLE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(platform),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Group Roles";
    
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

    const platformMutation = useMutation({
        mutationKey: ['roles'],
        mutationFn: AddRoles,
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
        platformMutation.mutate(roles);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoles(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleplatformSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Role Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                </div>

                <div className="w-full flex justify-center mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoles;