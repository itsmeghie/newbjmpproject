import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";
import { updateVisitor_Req_Docs } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditVisitorReq = ({ visitorreqdocs, onClose }: { visitorreqdocs: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateVisitor_Req_Docs(token ?? "", visitorreqdocs.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Visitor Requirements updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Visitor Requirements");
        },
    });

        useEffect(() => {
            if (visitorreqdocs) {
                form.setFieldsValue({
                    document_name: visitorreqdocs.document_name,
                    description: visitorreqdocs.description,
                });
            }
        }, [visitorreqdocs, form]);

    const handlevisitorreqdocsSubmit = (values: { 
      document_name: string;
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
                onFinish={handlevisitorreqdocsSubmit}
                initialValues={{
                  document_name: visitorreqdocs?.document_name ?? 'N/A',
                  description: visitorreqdocs?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Document Name"
                    name="document_name"
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
                        {isLoading ? "Updating..." : "Update Visitor Requirements"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditVisitorReq;