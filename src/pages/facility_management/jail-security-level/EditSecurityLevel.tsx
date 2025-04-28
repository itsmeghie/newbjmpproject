import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateSecurity_Level } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditSecurityLevel = ({ securitylevel, onClose }: { securitylevel: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateSecurity_Level(token ?? "", securitylevel.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Jail Security updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Jail Security");
        },
    });

    useEffect(() => {
        if (securitylevel) {
            form.setFieldsValue({
            category_name: securitylevel.category_name,
            description: securitylevel.description,
            });
        }
    }, [securitylevel, form]);

    const handleSecuritylevelSubmit = (values: { category_name: string; description: string }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSecuritylevelSubmit}
                initialValues={{
                    category_name: securitylevel?.category_name,
                    description: securitylevel?.description,
                }}
            >
                <Form.Item
                    label="Security Level"
                    name="category_name"
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
                        {isLoading ? "Updating..." : "Update Security Level"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditSecurityLevel;