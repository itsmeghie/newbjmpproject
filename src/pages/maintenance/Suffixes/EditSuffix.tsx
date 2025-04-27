import { useTokenStore } from "@/store/useTokenStore";
import { useMutation} from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type SuffixesProps = {
    record_status_id: number | null,
    suffix: string,
    full_title: string,
    description: string
}
const EditSuffix = ({ suffix, onClose }: { suffix: any; onClose: () => void;}) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const [suffixForm, setsuffixForm] = useState<SuffixesProps>({
        record_status_id: null,
        suffix: "",
        description: "",
        full_title: "",
    });

    useEffect(() => {
        if (suffix) {
        setsuffixForm({
            record_status_id: suffix.record_status_id,
            suffix: suffix.suffix,
            description: suffix.description,
            full_title: suffix.full_title,
        });
        }
    }, [suffix]);

    const updateSuffix = async (
        token: string,
        id: number,
        updatedData: any
    ) => {
        const response = await fetch(`${BASE_URL}/api/standards/suffix/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
        throw new Error("Failed to update Suffix");
        }

        return response.json();
    };


    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
        updateSuffix(token ?? "", suffix.id, updatedData),
        onSuccess: () => {
        messageApi.success("Suffix updated successfully");
        setIsLoading(false);
        onClose();
        },
        onError: (error: any) => {
        setIsLoading(false);
        messageApi.error(error.message || "Failed to update Suffix");
        },
    });

    const handleSuffixSubmit = () => {
        setIsLoading(true);
        updateMutation.mutate(suffixForm);
    };

    return (
        <div>
        {contextHolder}
        <Form form={form} layout="vertical" onFinish={handleSuffixSubmit}>
            <Form.Item label="Suffix" required>
            <Input
                value={suffixForm.suffix}
                onChange={(e) =>
                setsuffixForm((prev) => ({
                    ...prev,
                    suffix: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item label="Full Title">
            <Input
                value={suffixForm.full_title}
                onChange={(e) =>
                setsuffixForm((prev) => ({
                    ...prev,
                    full_title: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item label="Description">
            <Input
                value={suffixForm.description}
                onChange={(e) =>
                setsuffixForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Suffix"}
            </Button>
            </Form.Item>
        </Form>
        </div>
    )
}

export default EditSuffix
