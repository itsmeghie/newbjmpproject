import { VISITOR_TYPE } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, Button, message } from "antd";

const AddVisitorType = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const addVisitorTypeMutation = useMutation({
        mutationFn: async (newVisitorType: { visitor_type: string; description: string }) => {
            const res = await fetch(VISITOR_TYPE.postVISITOR_TYPE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(newVisitorType),
            });

            if (!res.ok) {
                throw new Error("Failed to add Visitor Type");
            }

            return res.json();
        },
        onSuccess: () => {
            messageApi.success("Visitor Type added successfully");
            form.resetFields();
            onClose();
        },
        onError: (error: any) => {
            messageApi.error(error.message);
        },
    });

    const handleSubmit = (values: { visitor_type: string; description: string }) => {
        addVisitorTypeMutation.mutate(values);
    };

    return (
        <div>
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Visitor Type"
                    name="visitor_type"
                    rules={[{ required: true, message: "Please input the Visitor Type!" }]}
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
                    <Button type="primary" className="flex ml-auto" htmlType="submit">
                        Add Visitor Type
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddVisitorType;