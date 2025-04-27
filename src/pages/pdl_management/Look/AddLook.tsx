import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { LOOK } from "@/lib/urls";


type LookProps = {
    name: string;
    description: string;
};

const AddLook = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectLook, setSelectLook] = useState<LookProps>({
        name: '',
        description: '',
    });

    async function addLook(look: LookProps) {
        const res = await fetch(LOOK.postLOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(look),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Look";
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

    const lookMutation = useMutation({
        mutationKey: ['look'],
        mutationFn: addLook,
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

    const handleLookSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectLook.name || !selectLook.description) {
            messageApi.error("Please fill out all fields.");
            return;
        }

        lookMutation.mutate(selectLook);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectLook(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleLookSubmit}>
                <div className="space-y-2 flex flex-col">
                    <div>
                        <p>Look:</p>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange}
                        placeholder="Look"
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
    )
}

export default AddLook
