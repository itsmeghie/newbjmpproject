import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateCivil_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditCivilStatus = ({ cilvilstatus, onClose }: { cilvilstatus: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateCivil_Status(token ?? "", cilvilstatus.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Civil Status updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Civil Status");
        },
    });

        useEffect(() => {
            if (cilvilstatus) {
                form.setFieldsValue({
                    status: cilvilstatus.status,
                    description: cilvilstatus.description,
                });
            }
        }, [cilvilstatus, form]);

    const handleSubmit = (values: { status: string; description: string }) => {
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
                    status: cilvilstatus?.status,
                    description: cilvilstatus?.description,
                }}
            >
                <Form.Item
                    label="Civil Status"
                    name="status"
                    rules={[{ required: true, message: "Please input the Civil Status!" }]}
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
                    <Button type="primary" className="flex justify-end ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Civil Status"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCivilStatus;