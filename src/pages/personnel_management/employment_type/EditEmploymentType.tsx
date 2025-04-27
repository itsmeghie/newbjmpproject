import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateEmployment_Type } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useState, useEffect } from "react";

type EditEmploymentType = {
    employment_type: string,
    description: string
}

const EditEmploymentType = ({ employmenttype, onClose }: { employmenttype: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateEmployment_Type(token ?? "", employmenttype.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Employment Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Employment Type");
        },
    });

    useEffect(() => {
        if (employmenttype) {
            form.setFieldsValue({
                employment_type: employmenttype.employment_type,
                description: employmenttype.description,
            });
        }
    }, [employmenttype, form]);

    const handleDeviceTypeSubmit = (values: { 
        employment_type: string;
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
                onFinish={handleDeviceTypeSubmit}
            >
                <Form.Item
                    label="Employment Type"
                    name="employment_type"
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
                        {isLoading ? "Updating..." : "Update Employment Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditEmploymentType;