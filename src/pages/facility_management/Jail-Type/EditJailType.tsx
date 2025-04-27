import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateJail_Type } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditJailType = ({ jailtype, onClose }: { jailtype: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateJail_Type(token ?? "", jailtype.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Jail Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Jail Type");
        },
    });

    
    useEffect(() => {
        if (jailtype) {
            form.setFieldsValue({
                type_name: jailtype.type_name,
                description: jailtype.description,
            });
        }
    }, [jailtype, form]);

    const handlejailtypeSubmit = (values: { type_name: string; description: string }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handlejailtypeSubmit}
                initialValues={{
                    type_name: jailtype?.type_name,
                    description: jailtype?.description,
                }}
            >
                <Form.Item
                    label="Jail Type Name"
                    name="type_name"
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
                        {isLoading ? "Updating..." : "Update Visitor Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditJailType;