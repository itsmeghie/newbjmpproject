import { getIssueCategories, getRecord_Status } from "@/lib/queries";
import { ISSUE_TYPE } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type AddIssueType = {
    record_status_id: number | null;
    name: string;
    description: string;
    remarks: string;
    issue_category_id: number | null;
}

const AddIssueType = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectIssueType, setSelectIssueType] = useState<AddIssueType>({
        record_status_id: null,
        name: '',
        description: '',
        remarks: '',
        issue_category_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
            {
                queryKey: ['issue_category'],
                queryFn: () => getIssueCategories(token ?? "")
            }
        ]
    });

    const recordStatusData = results[0].data;
    const issueCategoryData = results[1].data;

    async function AddIssueType(issue_type: AddIssueType) {
        const res = await fetch(ISSUE_TYPE.getISSUE_TYPE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(issue_type),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Issue Type";
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

    const issueTypekMutation = useMutation({
        mutationKey: ['issue-category'],
        mutationFn: AddIssueType,
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

    const handleIssueTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        issueTypekMutation.mutate(selectIssueType);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setSelectIssueType(prevForm => ({
            ...prevForm,
            [name]: value,
            }));
        };

    const onRecordStatusChange = (value: number) => {
        setSelectIssueType(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    const onIssueCategoryChange = (value: number) => {
        setSelectIssueType(prevForm => ({
            ...prevForm,
            issue_category_id: value
        }));
    };

    return (
        <div>
        {contextHolder}
            <form onSubmit={handleIssueTypeSubmit}>
                <div className="grid grid-cols-1 w-full gap-3">
                    <div>
                        <p className="text-gray-500 font-bold">Issue Type:</p>
                        <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Issue Type" className="h-12 border w-full border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold">Remarks:</p>
                        <textarea name="remarks" id="remarks" onChange={handleInputChange} placeholder="Description" className="h-14 py-2 outline-none border border-gray-300 rounded-lg px-2 w-full" />
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
                    <div>
                        <p className="text-gray-500 font-bold">Issue Type:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Issue Category"
                        optionFilterProp="label"
                        onChange={onIssueCategoryChange}
                        options={issueCategoryData?.map(issue_category => (
                            {
                                value: issue_category.id,
                                label: issue_category?.name,
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

export default AddIssueType
