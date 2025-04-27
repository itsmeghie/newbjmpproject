import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateRank, getOrganization } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditRank = {
    organization_id: number | null;
    rank_code: string;
    rank_name: string;
    category: string | null;
    class_level: number | null;
}

const EditRank = ({ rank, onClose }: { rank: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [rankForm, setRankForm] = useState<EditRank>({
        organization_id: null,
        rank_code: '',
        rank_name: '',
        category: null,
        class_level: null,
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateRank(token ?? "", rank.id, updatedData),
        onSuccess: () => {
            setIsLoading(false); 
            messageApi.success("Rank updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Rank");
        },
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

    useEffect(() => {
        if (rank) {
            form.setFieldsValue({
                organization_id: rank.organization_id,
                rank_code: rank.rank_code,
                rank_name: rank.rank_name,
                category: rank.category,
                class_level: rank.class_level,
            });
            setRankForm({
                organization_id: rank.organization_id,
                rank_code: rank.rank_code,
                rank_name: rank.rank_name,
                category: rank.category,
                class_level: rank.class_level,
            });
        }
    }, [rank, form]);

    const handleOrganizationSubmit = (values: EditRank) => {
        setIsLoading(true);
        updateMutation.mutate({ ...rankForm, ...values });
    };
    
    const onOrganizationChange = (value: number) => {
        setRankForm(prevForm => ({
            ...prevForm,
            organization_id: value
        }));
    };
    const onRankCategoryChange = (value: string) => {
        setRankForm(prevForm => ({
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
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOrganizationSubmit}
            >
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
                        options={organizationData?.map(organization => ({
                            value: organization.id,
                            label: organization?.org_name
                        }))}/>
                </Form.Item>
                <Form.Item
                    label="Rank Code"
                    name="rank_code"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rank Name"
                    name="rank_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Rank Category"
                    name="category"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Rank Category"
                        onChange={onRankCategoryChange}
                        options={rankCategories}
                    />
                </Form.Item>
                <Form.Item
                    label="Class Level"
                    name="class_level"
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button className="flex justify-end ml-auto" type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Rank"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRank;