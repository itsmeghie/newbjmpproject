import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateSocialMediaPlatforms } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditPlatform = ({ platform, onClose }: { platform: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateSocialMediaPlatforms(token ?? "", platform.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Social Media Platform updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Social Media Platform");
        },
    });

    useEffect(() => {
        if (platform) {
            form.setFieldsValue({
                platform_name: platform.platform_name,
                description: platform.description,
            });
        }
    }, [platform, form]);

    const handleplatformSubmit = (values: { 
        platform_name: string;
        description: string; }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleplatformSubmit}
                initialValues={{
                    platform_name: platform?.platform_name,
                    description: platform?.description,
                }}
            >
                <Form.Item
                    label="Social Media Name"
                    name="platform_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="description"
                    name="description"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="flex justify-end ml-auto py-2" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Social Media Platform"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditPlatform;