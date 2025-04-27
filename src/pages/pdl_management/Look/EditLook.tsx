import { updateLook } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const EditLook = ({ look, onClose }: { look: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateLook(token ?? "", look.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Look updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Look");
        },
    });

    useEffect(() => {
        if (look) {
            form.setFieldsValue({
                name: look.name,
                description: look.description,
            });
        }
    }, [look, form]);
    
        const handleLookSubmit = (values: {
            name: string;
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
                onFinish={handleLookSubmit}
                initialValues={{
                    name: look?.name ?? 'N/A',
                    description: look?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Look"
                    name="name"
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
                        {isLoading ? "Updating..." : "Update Look"}
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
    )
}

export default EditLook
