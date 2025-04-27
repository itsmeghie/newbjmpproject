import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateVisitor_Type } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditVisitorType = ({ visitorType, onClose }: { visitorType: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateVisitor_Type(token ?? "", visitorType.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Visitor Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Visitor Type");
        },
    });

        useEffect(() => {
            if (visitorType) {
                form.setFieldsValue({
                    visitor_type: visitorType.visitor_type,
                    description: visitorType.description,
                });
            }
        }, [visitorType, form]);

    const handleSubmit = (values: { visitor_type: string; description: string }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    visitor_type: visitorType?.visitor_type,
                    description: visitorType?.description,
                }}
            >
                <Form.Item
                    label="Visitor Type"
                    name="visitor_type"
                    rules={[{ required: true, message: "Please input the Visitor Type!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please input the Description!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Visitor Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditVisitorType;