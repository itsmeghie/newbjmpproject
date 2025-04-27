import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateVisitor_Relationship } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditVisitorRelation = ({ visitorrelation, onClose }: { visitorrelation: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateVisitor_Relationship(token ?? "", visitorrelation.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Visitor Relation updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Visitor Relation");
        },
    });

        useEffect(() => {
            if (visitorrelation) {
                form.setFieldsValue({
                    relationship_name: visitorrelation.relationship_name,
                    description: visitorrelation.description,
                });
            }
        }, [visitorrelation, form]);

    const handleVisitorrelationSubmit = (values: { 
      relationship_name: string;
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
                onFinish={handleVisitorrelationSubmit}
                initialValues={{
                  relationship_name: visitorrelation?.relationship_name ?? 'N/A',
                  description: visitorrelation?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Visitor Relation to PDL Name"
                    name="relationship_name"
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
                        {isLoading ? "Updating..." : "Update Visitor Relationship to PDL"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditVisitorRelation;