import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateJail_Category } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditJailCategories = ({ category, onClose }: { category: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateJail_Category(token ?? "", category.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Jail Category updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Jail Category");
        },
    });

    
    useEffect(() => {
        if (category) {
            form.setFieldsValue({
            category_name: category.category_name,
            description: category.description,
            });
        }
    }, [category, form]);

    const handlejailtypeSubmit = (values: { category: string; description: string }) => {
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
                    category_name: category?.category_name,
                    description: category?.description,
                }}
            >
                <Form.Item
                    label="Jail Category Name"
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
                    <Button type="primary" className="flex ml-auto" htmlType="submit">
                        {isLoading ? "Updating..." : "Update Jail Category"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditJailCategories;