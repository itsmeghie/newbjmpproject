import { updateReligion } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const EditReligion = ({ religion, onClose }: { religion: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateReligion(token ?? "", religion.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Religion updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Religion");
        },
    });

    useEffect(() => {
        if (religion) {
            form.setFieldsValue({
                name: religion.name,
                description: religion.description,
            });
        }
    }, [religion, form]);
    
        const handleReligionSubmit = (values: {
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
                onFinish={handleReligionSubmit}
                initialValues={{
                    name: religion?.name ?? 'N/A',
                    description: religion?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Religion"
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
                    <Button type="primary" className="flex justify-end ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Religion"}
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
    )
}

export default EditReligion
