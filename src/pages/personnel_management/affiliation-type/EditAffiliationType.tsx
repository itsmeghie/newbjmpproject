import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateAffiliationType } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";


const EditAffiliationType = ({ affiliationtype, onClose }: { affiliationtype: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateAffiliationType(token ?? "", affiliationtype.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Affiliation Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Affiliation Type");
        },
    });

        useEffect(() => {
            if (affiliationtype) {
                form.setFieldsValue({
                    affiliation_type: affiliationtype.affiliation_type,
                    description: affiliationtype.description,
                });
            }
        }, [affiliationtype, form]);

    const handleAffiliationTypeSubmit = (values: {
        affiliation_type: string;
        description: string;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAffiliationTypeSubmit}
                initialValues={{
                    affiliation_type: affiliationtype?.affiliation_type ?? 'N/A',
                    description: affiliationtype?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Affiliation Type"
                    name="affiliation_type"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Affiliation Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditAffiliationType;
