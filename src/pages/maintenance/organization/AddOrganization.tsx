import { getOrganizational_Type, getOrganizational_Level } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { ORGANIZATION } from "@/lib/urls";

type AddOrganization = {
    org_code: string;
    org_name: string;
    org_type_id: number | null;
    org_level_id: number | null;
}

const AddOrganization = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [organizationForm, setOrganizationForm] = useState<AddOrganization>({
        org_code: '',
        org_name: '',
        org_type_id: null,
        org_level_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['organizational-level'],
                queryFn: () => getOrganizational_Level(token ?? "")
            },
            {
                queryKey: ['organizational-type'],
                queryFn: () => getOrganizational_Type(token ?? "")
            },
        ]
    });

    const organizationalLevelData = results[0].data;
    const organizationalLevelLoading = results[0].isLoading;

    const organizationTypeData = results[1].data;
    const organizationTypeLoading = results[1].isLoading;

    async function addOrganization(organization: AddOrganization) {
        const res = await fetch(ORGANIZATION.getORGANIZATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(organization),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Organization";
    
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

    const organizationMutation = useMutation({
        mutationKey: ['organization'],
        mutationFn: addOrganization,
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

    const handleOrganizationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        organizationMutation.mutate(organizationForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrganizationForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onOrganizationalLevelChange = (value: number) => {
        setOrganizationForm(prevForm => ({
            ...prevForm,
            org_level_id: value
        }));
    };
    const onOrganizationalTypeChange = (value: number) => {
        setOrganizationForm(prevForm => ({
            ...prevForm,
            org_type_id: value
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleOrganizationSubmit}>
                <div className="flex flex-col gap-5">
                        <input type="text" name="org_code" id="org_code" onChange={handleInputChange} placeholder="Organization Code" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="org_name" id="org_name" onChange={handleInputChange} placeholder="Organization Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Organizational Level"
                        optionFilterProp="label"
                        onChange={onOrganizationalLevelChange}
                        loading={organizationalLevelLoading}
                        options={organizationalLevelData?.map(organizational_level => (
                            {
                                value: organizational_level.id,
                                label: organizational_level?.org_level,
                            }
                        ))}
                    />
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Organizational Type"
                        optionFilterProp="label"
                        onChange={onOrganizationalTypeChange}
                        loading={organizationTypeLoading}
                        options={organizationTypeData?.map(organizational_type => (
                            {
                                value: organizational_type.id,
                                label: organizational_type?.org_type
                            }
                        ))}
                    />
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

export default AddOrganization;