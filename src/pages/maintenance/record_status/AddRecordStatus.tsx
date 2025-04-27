import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { RECORD_STATUS } from "@/lib/urls";

type AddRecordStatus = {
    status: string;
    description: string;
};

const AddRecordStatus = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [recordStatusForm, setRecordStatusForm] = useState<AddRecordStatus>({
        status: '',
        description: '',
    });

    async function addRecordStatus(recordStatus: AddRecordStatus) {
        const res = await fetch(RECORD_STATUS.getRECORD_STATUS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(recordStatus),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Record Status";
    
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

    const recordStatusMutation = useMutation({
        mutationKey: ['record-status'],
        mutationFn: addRecordStatus,
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

    const handleRecordStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        recordStatusMutation.mutate(recordStatusForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRecordStatusForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-5">
            {contextHolder}
            <form onSubmit={handleRecordStatusSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p>Record Status:</p>
                            <input type="text" name="status" id="status" onChange={handleInputChange} placeholder="Record Status" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Description:</p>
                            <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        
                    </div>
                </div>
                <div className="w-full flex gap-3 justify-end mt-10">
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1.5 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRecordStatus;