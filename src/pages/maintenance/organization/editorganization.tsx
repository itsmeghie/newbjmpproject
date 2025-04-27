import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateOrganization, getOrganizational_Type, getOrganizational_Level } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditOrganization = {
    org_code: string;
    org_name: string;
    org_type_id: number | null;
    org_level_id: number | null;
}

const EditOrganization = ({ organization, onClose }: { organization: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [organizationForm, setOrganizationForm] = useState<EditOrganization>({
        org_code: '', 
        org_name: '',
        org_type_id: null,
        org_level_id: null,
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateOrganization(token ?? "", organization.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Organization updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Organization");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['organizational-type'],
                queryFn: () => getOrganizational_Type(token ?? "")
            },
            {
                queryKey: ['organizational-level'],
                queryFn: () => getOrganizational_Level(token ?? "")
            },
        ]
    });

    const organizationalTypeData = results[0].data;
    const organizationalTypeLoading = results[0].isLoading;

    const organizationalLevelData = results[1].data;
    const organizationalLevelLoading = results[1].isLoading;

        useEffect(() => {
            if (organization) {
                form.setFieldsValue({
                    org_code: organization.org_code,
                    org_name: organization.org_name,
                    org_type_id: organization.org_type,
                    org_level_id: organization.org_level,
                });
            }
        }, [organization, form]);

    const handleOrganizationSubmit = (values: {
        org_code: string;
        org_name: string;
        org_type_id: number | null;
        org_level_id: number | null;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };
    
    const onOrganizationalTypeChange = (value: number) => {
        setOrganizationForm(prevForm => ({
            ...prevForm,
            org_type_id: value
        }));
    };

    const onOrganizationalLevelChange = (value: number) => {
        setOrganizationForm(prevForm => ({
            ...prevForm,
            org_level_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOrganizationSubmit}
                initialValues={{
                    org_code: organization?.org_code ?? 'N/A',
                    org_name: organization?.org_name ?? 'N/A',
                    org_type_id: organization?.org_type_id ?? 'N/A',
                    org_level_id: organization?.org_level_id ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Organization Code"
                    name="org_code"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Organization Name"
                    name="org_name"
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="Organization Type"
                    name="org_type_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Organizational Type"
                        optionFilterProp="label"
                        onChange={onOrganizationalTypeChange}
                        loading={organizationalTypeLoading}
                        options={organizationalTypeData?.map(organizational_type => (
                            {
                                value: organizational_type.id,
                                label: organizational_type?.org_type
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Organization Level"
                    name="org_level_id"
                >
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
                                label: organizational_level?.org_level
                            }
                        ))}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Organization"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditOrganization;
