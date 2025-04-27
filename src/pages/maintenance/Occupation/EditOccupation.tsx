import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/urls";

type OccupationProps = {
    record_status_id: number | null;
    name: string;
    description: string;
    remarks: string;
};

    const EditOccupation = ({occupation, onClose }: { occupation: any; onClose:() => void;}) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const [occupationForm, setOccupationForm] = useState<OccupationProps>({
        record_status_id: null,
        name: "",
        description: "",
        remarks: "",
    });

    useEffect(() => {
        if (occupation) {
        setOccupationForm({
            record_status_id: occupation.record_status_id,
            name: occupation.name,
            description: occupation.description,
            remarks: occupation.remarks,
        });
        }
    }, [occupation]);

    const updateOccupation = async (
        token: string,
        id: number,
        updatedData: any
    ) => {
        const response = await fetch(`${BASE_URL}/api/pdls/occupations/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
        throw new Error("Failed to update Occupation");
        }

        return response.json();
    };

    const results = useQueries({
        queries: [
        {
            queryKey: ["record-status"],
            queryFn: () => getRecord_Status(token ?? ""),
        },
        ],
    });

    const recordStatusData = results[0].data;

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
        updateOccupation(token ?? "", occupation.id, updatedData),
        onSuccess: () => {
        messageApi.success("Occupation updated successfully");
        setIsLoading(false);
        onClose();
        },
        onError: (error: any) => {
        setIsLoading(false);
        messageApi.error(error.message || "Failed to update Occupation");
        },
    });

    const handleOccupationSubmit = () => {
        setIsLoading(true);
        updateMutation.mutate(occupationForm);
    };

    return (
        <div>
        {contextHolder}
        <Form form={form} layout="vertical" onFinish={handleOccupationSubmit}>
            <Form.Item label="Occupation Name" required>
            <Input
                value={occupationForm.name}
                onChange={(e) =>
                setOccupationForm((prev) => ({ ...prev, name: e.target.value }))
                }
            />
            </Form.Item>
            <Form.Item label="Description">
            <Input
                value={occupationForm.description}
                onChange={(e) =>
                setOccupationForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item label="Remarks">
            <Input
                value={occupationForm.remarks}
                onChange={(e) =>
                setOccupationForm((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                }))
                }
            />
            </Form.Item>
            <Form.Item label="Record Status">
            <Select
                className="h-[3rem] w-full"
                showSearch
                placeholder="Record Status"
                optionFilterProp="label"
                value={occupationForm.record_status_id ?? undefined}
                onChange={(value) =>
                setOccupationForm((prev) => ({
                    ...prev,
                    record_status_id: value,
                }))
                }
                options={recordStatusData?.map((status) => ({
                value: status.id,
                label: status?.status,
                }))}
            />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Occupation"}
            </Button>
            </Form.Item>
        </Form>
        </div>
    );
};

export default EditOccupation;
