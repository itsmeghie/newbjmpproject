import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateID_Type } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditIDType = ({ idtypes, onClose }: { idtypes: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateID_Type(token ?? "", idtypes.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("ID Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update ID Type");
        },
    });

        useEffect(() => {
            if (idtypes) {
                form.setFieldsValue({
                    id_type: idtypes.id_type,
                    description: idtypes.description,
                });
            }
        }, [idtypes, form]);

    const handleSubmit = (values: { id_type: string; description: string }) => {
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
                    id_type: idtypes?.id_type,
                    description: idtypes?.description,
                }}
            >
                <Form.Item
                    label="ID Type"
                    name="id_type"
                    rules={[{ required: true, message: "Please input the ID Type!" }]}
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
                    <Button type="primary" htmlType="submit" className="flex justify-end ml-auto" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update ID Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditIDType;