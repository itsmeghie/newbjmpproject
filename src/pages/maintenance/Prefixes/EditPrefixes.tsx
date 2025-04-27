import { useTokenStore } from "@/store/useTokenStore";
import { useMutation} from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PrefixesProps = {
    record_status_id: number | null,
    prefix: string,
    full_title: string,
    description: string
}
const EditPrefixes = ({ prefixes, onClose }: { prefixes: any; onClose: () => void;}) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const [prefixForm, setPrefixForm] = useState<PrefixesProps>({
        record_status_id: null,
        prefix: "",
        description: "",
        full_title: "",
    });

    useEffect(() => {
        if (prefixes) {
        setPrefixForm({
            record_status_id: prefixes.record_status_id,
            prefix: prefixes.prefix,
            description: prefixes.description,
            full_title: prefixes.full_title,
        });
        }
    }, [prefixes]);

    const updatePrefix = async (
        token: string,
        id: number,
        updatedData: any
    ) => {
        const response = await fetch(`${BASE_URL}/api/standards/prefix/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
        throw new Error("Failed to update Prefix");
        }

        return response.json();
    };


    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
        updatePrefix(token ?? "", prefixes.id, updatedData),
        onSuccess: () => {
        messageApi.success("Prefix updated successfully");
        setIsLoading(false);
        onClose();
        },
        onError: (error: any) => {
        setIsLoading(false);
        messageApi.error(error.message || "Failed to update Prefix");
        },
    });

    const handlePrefixSubmit = () => {
        setIsLoading(true);
        updateMutation.mutate(prefixForm);
    };

    return (
        <div>
        {contextHolder}
        <Form form={form} layout="vertical" onFinish={handlePrefixSubmit}>
            <Form.Item label="Prefix" required>
            <Input
                value={prefixForm.prefix}
                onChange={(e) =>
                setPrefixForm((prev) => ({ ...prev, name: e.target.value }))
                }
            />
            </Form.Item>
            <Form.Item label="Full Title">
            <Input
                value={prefixForm.full_title}
                onChange={(e) =>
                setPrefixForm((prev) => ({
                    ...prev,
                    full_title: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item label="Description">
            <Input
                value={prefixForm.description}
                onChange={(e) =>
                setPrefixForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Prefix"}
            </Button>
            </Form.Item>
        </Form>
        </div>
    )
}

export default EditPrefixes
