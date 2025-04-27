import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updatePosition, getRank, getOrganization } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type Position = {
    position_code: string,
    position_title: string,
    position_level: string,
    position_type: string,
    rank_required_id: number | null,
    organization_id: number | null,
};

const EditPosition = ({ position, onClose }: { position: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [positionForm, setPositionForm] = useState<Position>({
        position_code: '',
        position_title: '',
        position_level: '',
        position_type: '',
        rank_required_id: null,
        organization_id: null,
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updatePosition(token ?? "", position.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Position updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Position");
        },
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

        useEffect(() => {
            if (position) {
                form.setFieldsValue({
                    position_code: position.position_code,
                    position_title: position.position_title,
                    position_level: position.position_level,
                    position_type: position.position_type,
                    rank_required_id: position.rank_required_id,
                    organization_id: position.organization_id,
                });
            }
        }, [position, form]);

    const handlePositionSubmit = (values: {
        position_code: string;
        position_title: string;
        position_level: string;
        position_type: string;
        rank_required_id: number | null;
        organization_id: number | null;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };
    
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
            <Form
                form={form}
                layout="vertical"
                onFinish={handlePositionSubmit}
                initialValues={{
                    position_code: position?.position_code ?? 'N/A',
                    position_title: position?.position_title ?? 'N/A',
                    position_level: position?.position_level ?? 'N/A',
                    position_type: position?.position_type ?? 'N/A',
                    rank_required_id: position?.rank_required_id ?? 'N/A',
                    organization_id: position?.organization_id ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Position Code"
                    name="position_code"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Position Title"
                    name="position_title"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Position Level"
                    name="position_level"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Position Type"
                    name="position_type"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rank Required"
                    name="rank_required_id"
                >
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
                                label: rank?.rank_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Organization"
                    name="organization_id"
                >
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
                        ))}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Position"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditPosition;
