import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDevice_Types, getDevice_Usage } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useState, useEffect } from "react";

type EditDevicesTypes = {
    device_type: string;
    purpose: string;
    remarks: string;
    device_usage_id: number | null;
}

const EditDevicesTypes = ({ devicetype, onClose }: { devicetype: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [deviceTypes, setDeviceTypes] = useState<EditDevicesTypes>({
        device_type: '',
        purpose: '',
        remarks: '',
        device_usage_id: null,
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDevice_Types(token ?? "", devicetype.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Device Type updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Device Type");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['device-usage'],
                queryFn: () => getDevice_Usage(token ?? "")
            },
        ]
    });

    const deviceUsageData = results[0].data;
    const deviceUsageLoading = results[0].isLoading;

    useEffect(() => {
        if (devicetype) {
            form.setFieldsValue({
                device_type: devicetype.device_type,
                purpose: devicetype.purpose,
                remarks: devicetype.remarks,
                device_usage: devicetype.device_usage_id,
            });
        }
    }, [devicetype, form]);

    const handleDeviceTypeSubmit = (values: { 
        device_type: string;
        purpose: string;
        remarks: string;
        device_usage_id: null;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    const onDeviceUsageChange = (value: number) => {
        setDeviceTypes(prevForm => ({
            ...prevForm,
            device_usage_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleDeviceTypeSubmit}
                initialValues={{
                    device_type: devicetype?.device_type ?? 'N/A',
                    purpose: devicetype?.purpose ?? 'N/A',
                    remarks: devicetype?.remarks ?? 'N/A',
                    device_usage_id: devicetype?.device_usage_id ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Device Type"
                    name="device_type"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Purpose"
                    name="purpose"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Remarks"
                    name="remarks"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Device Usage"
                    name="device_usage_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Device Usage"
                        optionFilterProp="label"
                        onChange={onDeviceUsageChange}
                        loading={deviceUsageLoading}
                        options={deviceUsageData?.map(device_usage => (
                            {
                                value: device_usage.id,
                                label: device_usage?.usage
                            }
                        ))}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Device Type"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditDevicesTypes;