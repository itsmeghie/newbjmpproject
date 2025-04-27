import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateGroup_Roles } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditRoles = ({ role, onClose }: { role: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateGroup_Roles(token ?? "", role.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Role updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Role");
        },
    });

    useEffect(() => {
        if (role) {
            form.setFieldsValue({
                name: role.name,
            });
        }
    }, [role, form]);

    const handleRoleSubmit = (values: { 
        name: string; }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleRoleSubmit}
                initialValues={{
                    name: role?.name,
                }}
            >
                <Form.Item
                    label="Group Role Name"
                    name="name"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Role"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRoles;