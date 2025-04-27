import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { VISITOR_REQ_DOCS } from "@/lib/urls";

type AddVisitorReq = {
    document_name: string;
    description: string;
};

const AddVisitorReq = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [visitorReqDocs, setVisitorReqDocs] = useState<AddVisitorReq>({
        document_name: '',
        description: '',
    });

    async function AddVisitorReq(visitorReqDocs: AddVisitorReq) {
        const res = await fetch(VISITOR_REQ_DOCS.getVISITOR_REQ_DOCS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(visitorReqDocs),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Visitor Requirements";
    
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
        mutationKey: ['visitor-req-docs'],
        mutationFn: AddVisitorReq,
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

    const handleVisitorReqDocsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        visitorMutation.mutate(visitorReqDocs);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVisitorReqDocs(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleVisitorReqDocsSubmit}>
                <div className="w-full space-y-3">
                    <div className="flex flex-col gap-2 flex-1">
                        <p>Document Name:</p>
                        <input type="text" name="document_name" id="document_name" onChange={handleInputChange} placeholder="Document Name" className="h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddVisitorReq;