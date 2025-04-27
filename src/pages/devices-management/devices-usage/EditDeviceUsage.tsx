import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateDevice_Usages } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditDeviceUsage = ({ deviceusage, onClose }: { deviceusage: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDevice_Usages(token ?? "", deviceusage.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Device Usage updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Device Usage");
        },
    });

    useEffect(() => {
        if (deviceusage) {
            form.setFieldsValue({
                usage: deviceusage.usage,
                description: deviceusage.description,
            });
        }
    }, [deviceusage, form]);

    const handleDeviceUsageSubmit = (values: { 
        usage: string;
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
                onFinish={handleDeviceUsageSubmit}
                initialValues={{
                    usage: deviceusage?.usage,
                    description: deviceusage?.description,
                }}
            >
                <Form.Item
                    label="Device Usage"
                    name="usage"
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
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Device Usage"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditDeviceUsage;