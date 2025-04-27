import { updateTalents } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation} from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const EditTalents = ({ talents, onClose }: { talents: any; onClose: () => void }) => {
  const token = useTokenStore().token;
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateTalents(token ?? "", talents.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Talents updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Talents");
        },
    });

    useEffect(() => {
        if (talents) {
            form.setFieldsValue({
                name: talents.name,
                description: talents.description,
            });
        }
    }, [talents, form]);

    const handleTalentsSubmit = (values: {
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
                onFinish={handleTalentsSubmit}
                initialValues={{
                    name: talents?.name ?? 'N/A',
                    description: talents?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Talents"
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
                        {isLoading ? "Updating..." : "Update Talents"}
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
  )
}

export default EditTalents
