import { updateSkills } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const EditSkill = ({ skill, onClose }: { skill: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateSkills(token ?? "", skill.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Skills updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Skills");
        },
    });

    useEffect(() => {
        if (skill) {
            form.setFieldsValue({
                name: skill.name,
                description: skill.description,
            });
        }
    }, [skill, form]);
    
        const handleSkillsSubmit = (values: {
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
                onFinish={handleSkillsSubmit}
                initialValues={{
                    name: skill?.name ?? 'N/A',
                    description: skill?.description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Skill"
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
                        {isLoading ? "Updating..." : "Update Skills"}
                    </Button>
                </Form.Item>
                
            </Form>
        </div>
    )
}

export default EditSkill
