import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateGender } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditGender = ({ gender, onClose }: { gender: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateGender(token ?? "", gender.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Gender updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Gender");
        },
    });

        useEffect(() => {
            if (gender) {
                form.setFieldsValue({
                    gender_option: gender.gender_option,
                    description: gender.description,
                });
            }
        }, [gender, form]);

    const handleGenderSubmit = (values: { 
      gender_option: string;
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
                onFinish={handleGenderSubmit}
                initialValues={{
                  gender_option: gender?.gender_option ?? 'N/A',
                  description: gender?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Gender Option"
                    name="gender_option"
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
                    <Button type="primary" className="flex justify-end py-2 ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Gender"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditGender;