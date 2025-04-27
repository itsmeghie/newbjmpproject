import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDetentionCell, getDetention_Floor } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditCellProps = {
    cell: any;
    onClose: () => void;
};

const EditCell = ({ cell, onClose }: EditCellProps) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDetentionCell(token ?? "", cell.id, updatedData),
        onSuccess: () => {
            setIsLoading(false);
            messageApi.success("Detention Cell updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false);
            messageApi.error(error.message || "Failed to update Detention Cell");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['floor'],
                queryFn: () => getDetention_Floor(token ?? "")
            },
        ]
    });

    const detentionFloorData = results[0].data;
    const detentionFloorLoading = results[0].isLoading;

    useEffect(() => {
        if (cell) {
            form.setFieldsValue({
                floor_id: cell.floor_id,
                cell_no: cell.cell_no,
                cell_name: cell.cell_name,
                cell_description: cell.cell_description,
            });
        }
    }, [cell, form]);

    const handledetentionCellSubmit = (values: any) => {
        const formattedValues = {
            ...values,
            floor_id: Number(values.floor_id),
        };

        setIsLoading(true);
        updateMutation.mutate(formattedValues);
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handledetentionCellSubmit}
            >
                <Form.Item
                    label="Floor"
                    name="floor_id"
                    rules={[{ required: true, message: "Please select a floor" }]}
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Select a floor"
                        optionFilterProp="label"
                        loading={detentionFloorLoading}
                        options={detentionFloorData?.map(floor => ({
                            value: floor.id,
                            label: floor.floor_name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Cell No"
                    name="cell_no"
                    rules={[{ required: true, message: "Please enter the cell number" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Cell Name"
                    name="cell_name"
                    rules={[{ required: true, message: "Please enter the cell name" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Cell Description"
                    name="cell_description"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Cell"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCell;
