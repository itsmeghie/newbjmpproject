import { getOrganization } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { RANK } from "@/lib/urls";

type AddRank = {
    organization_id: number | null;
    rank_code: string;
    rank_name: string;
    category: string | null;
    class_level: number | null;
}

const AddRank = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [selectrank, setSelectRank] = useState<AddRank>({
        organization_id: null,
        rank_code: '',
        rank_name: '',
        category: null,
        class_level: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['organization'],
                queryFn: () => getOrganization(token ?? "")
            },
        ]
    });

    const organizationData = results[0].data;
    const organizationLoading = results[0].isLoading;

    async function AddRank(rank: AddRank) {
        const res = await fetch(RANK.getRANK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(rank),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Rank";
    
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

    const rankMutation = useMutation({
        mutationKey: ['rank'],
        mutationFn: AddRank,
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

    const handleRankSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        rankMutation.mutate(selectrank);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectRank(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onOrganizationChange = (value: number) => {
        setSelectRank(prevForm => ({
            ...prevForm,
            organization_id: value
        }));
    };

    const onRankCategoryChange = (value: string) => {
        setSelectRank(prevForm => ({
            ...prevForm,
            category: value
        }));
    };

    const rankCategories = [
        { value: 'Civilian', label: 'Civilian' },
        { value: 'Non-Commissioned', label: 'Non-Commissioned' },
        { value: 'Commissioned', label: 'Commissioned' },
        { value: 'Executive', label: 'Executive' },
    ];

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleRankSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <p>Organization:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Organization"
                            optionFilterProp="label"
                            onChange={onOrganizationChange}
                            loading={organizationLoading}
                            options={organizationData?.map(organization => (
                                {
                                    value: organization.id,
                                    label: organization?.org_name,
                                }
                            ))}
                        />
                    </div>
                    <div>
                        <p>Rank Code:</p>
                        <input type="text" name="rank_code" id="rank_code" onChange={handleInputChange} placeholder="Rank Code" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Rank Name:</p>
                        <input type="text" name="rank_name" id="rank_name" onChange={handleInputChange} placeholder="Rank Name" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Rank Category:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Rank Category"
                            onChange={onRankCategoryChange}
                            options={rankCategories}
                        />
                    </div>
                    <div>
                        <p>Class Level:</p>
                        <input type="text" name="class_level" id="class_level" onChange={handleInputChange} placeholder="Class Level" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
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

export default AddRank;