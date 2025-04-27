import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { getRank, getOrganization } from "@/lib/queries";
import { message, Select } from 'antd';
import { POSITION } from "@/lib/urls";

type Position = {
    position_code: string,
    position_title: string,
    position_level: string,
    position_type: string,
    rank_required_id: number | null,
    organization_id: number | null,
};


const AddPosition = ({ onClose }: { onClose: () => void }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [PositionForm, setPositionForm] = useState<Position>({
        position_code: '',
        position_title: '',
        position_level: '',
        position_type: '',
        rank_required_id: null,
        organization_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['rank'],
                queryFn: () => getRank(token ?? "")
            },
            {
                queryKey: ['organization'],
                queryFn: () => getOrganization(token ?? "")
            },
        ]
    });

    const rankData = results[0].data;
    const rankLoading = results[0].isLoading;

    const organizationData = results[1].data;
    const organizationLoading = results[1].isLoading;


    const token = useTokenStore().token

    async function registerPosition(position: Position) {
        const res = await fetch(POSITION.postPOSITION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(position)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering Position');
        }

        return res.json()
    }

    const PositionMutation = useMutation({
        mutationKey: ['position'],
        mutationFn: registerPosition,
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
        setPositionForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handlePositionSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        PositionMutation.mutate(PositionForm)
    }

    const onRankChange = (value: number) => {
        setPositionForm(prevForm => ({
            ...prevForm,
            rank_required_id: value
        }));
    };

    const onOrganizationChange = (value: number) => {
        setPositionForm(prevForm => ({
            ...prevForm,
            organization_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handlePositionSubmit}>
                <div className="flex mt-5 flex-col gap-5">
                    <div>
                        <p>Position Code:</p>
                        <input type="text" name="position_code" id="position_code" onChange={handleInputChange} placeholder="Position Code" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Position Title:</p>
                        <input type="text" name="position_title" id="position_title" onChange={handleInputChange} placeholder="Position Title" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Position Level:</p>
                        <input type="text" name="position_level" id="position_level" onChange={handleInputChange} placeholder="Position Level" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Position Type:</p>
                        <input type="text" name="position_type" id="position_type" onChange={handleInputChange} placeholder="Position Type" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Rank Required:</p>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Rank Required"
                        optionFilterProp="label"
                        onChange={onRankChange}
                        loading={rankLoading}
                        options={rankData?.map(rank => (
                            {
                                value: rank.id,
                                label: rank?.rank_name,
                            }
                        ))}
                    />
                    </div>
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
                                label: organization?.org_name
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

export default AddPosition