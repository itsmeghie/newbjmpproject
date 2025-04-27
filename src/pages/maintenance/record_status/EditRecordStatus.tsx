import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditRecordStatus = ({ recordstatus, onClose }: { recordstatus: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateRecord_Status(token ?? "", recordstatus.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Record Status updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Record Status");
        },
    });

    useEffect(() => {
        if (recordstatus) {
            form.setFieldsValue({
                status: recordstatus.status,
                description: recordstatus.description,
            });
        }
    }, [recordstatus, form]);

    const handleRecordstatusSubmit = (values: { status: string; description: string }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleRecordstatusSubmit}
                initialValues={{
                    status: recordstatus?.status,
                    description: recordstatus?.description,
                }}
            >
                <Form.Item
                    label="Record Status"
                    name="status"
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
                    <Button className="float-right" type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Record Status"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRecordStatus;