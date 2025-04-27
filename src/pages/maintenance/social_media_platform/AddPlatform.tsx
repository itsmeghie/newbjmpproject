import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { SOCIAL_MEDIA_PLATFORMS } from "@/lib/urls";

type AddPlatform = {
    platform_name: string;
    description: string;
};

const AddPlatform = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [platformForm, setPlatformForm] = useState<AddPlatform>({
        platform_name: '',
        description: '',
    });

    async function AddPlatform(platform: AddPlatform) {
        const res = await fetch(SOCIAL_MEDIA_PLATFORMS.getSOCIALMEDIAPLATFORMS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(platform),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Social Media Platform";
    
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
        mutationKey: ['platform'],
        mutationFn: AddPlatform,
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
        platformMutation.mutate(platformForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlatformForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-5">
            {contextHolder}
            <form onSubmit={handleplatformSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p>Platform:</p>
                            <input type="text" name="platform_name" id="platform_name" onChange={handleInputChange} placeholder="Social Media Name" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Description:</p>
                            <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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
    );
};

export default AddPlatform;