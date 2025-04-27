import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDetention_Floor, getDetention_Building, getJail_Security_Level, getRecord_Status} from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

const EditFloor = ({ detentionFloor, onClose }: { detentionFloor: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [floor, setFloor] = useState({
        building_id: null,
        floor_number: "",
        floor_name: "",
        floor_description: "",
        security_level_id: null,
        record_status_id: null,
    });

    const updateDetentionFloorMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDetention_Floor(token ?? "", detentionFloor.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Detention Floor updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Detention Floor");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['detention-building'],
                queryFn: () => getDetention_Building(token ?? "")
            },
            {
                queryKey: ['security-level'],
                queryFn: () => getJail_Security_Level(token ?? "")
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ]
    });

    const detentionBuildingData = results[0].data;
    const detentionBuildingLoading = results[0].isLoading;

    const SecurityLevelData = results[1].data;
    const SecurityLevelLoading = results[1].isLoading;

    const RecordStatusData = results[2].data;
    const RecordStatusLoading = results[2].isLoading;

        useEffect(() => {
            if (detentionFloor) {
                form.setFieldsValue({
                    building_id: detentionFloor?.building_id,
                    floor_number: detentionFloor?.floor_number,
                    floor_name: detentionFloor?.floor_name,
                    floor_description: detentionFloor?.floor_description,
                    security_level_id: detentionFloor?.security_level_id,
                    record_status_id: detentionFloor?.record_status_id,
                });
            }
        }, [detentionFloor, form]);

    const handleSubmit = (values: { 
        building_id: number | null;
        floor_number: string;
        floor_name: string;
        floor_description: string;
        security_level_id: number | null;
        record_status_id: number | null;
    }) => {
        setIsLoading(true);
        updateDetentionFloorMutation.mutate(values);
    };

    const onDetentionBuildingChange = (value: null) => {
        setFloor(prevForm => ({
            ...prevForm,
            building_id: value
        }));
    };

    const onSecurityLevelChange = (value: null) => {
        setFloor(prevForm => ({
            ...prevForm,
            security_level_id: value
        }));
    };

    const onRecordStatusChange = (value: null) => {
        setFloor(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    building_id: detentionFloor?.building_id,
                    floor_number: detentionFloor?.floor_number,
                    floor_name: detentionFloor?.floor_name,
                    floor_description: detentionFloor?.floor_description,
                    security_level_id: detentionFloor?.security_level_id,
                    record_status_id: detentionFloor?.record_status_id,
                }}
            >
                <Form.Item
                    label="Detention Building"
                    name="building_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Detention Building"
                        optionFilterProp="label"
                        onChange={onDetentionBuildingChange}
                        loading={detentionBuildingLoading}
                        options={detentionBuildingData?.map(building => (
                            {
                                value: building.id,
                                label: building?.bldg_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Floor Name"
                    name="floor_name"
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Floor Number"
                    name="floor_number"
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Security Level"
                    name="security_level_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Security Level"
                        optionFilterProp="label"
                        onChange={onSecurityLevelChange}
                        loading={SecurityLevelLoading}
                        options={SecurityLevelData?.map(security_level => (
                            {
                                value: security_level.id,
                                label: security_level?.category_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Record Status"
                    name="record_status_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Security Level"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        loading={RecordStatusLoading}
                        options={RecordStatusData?.map(record_status => (
                            {
                                value: record_status.id,
                                label: record_status?.status
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Floor Description"
                    name="floor_description"
                    rules={[{ required: true, message: "Please input the Floor Description!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Detention Floor"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditFloor;