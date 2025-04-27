import { updateInterest } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const EditInterest = ({ interest, onClose }: { interest: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateInterest(token ?? "", interest.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Interest updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Interest");
        },
    });

    useEffect(() => {
        if (interest) {
            form.setFieldsValue({
                name: interest.name,
                description: interest.description,
            });
        }
    }, [interest, form]);
    
        const handleInterestSubmit = (values: {
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
                onFinish={handleInterestSubmit}
                initialValues={{
                    name: interest?.name ?? 'N/A',
                    description: interest?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Interest"
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
                        {isLoading ? "Updating..." : "Update Interest"}
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
    )
}

export default EditInterest
