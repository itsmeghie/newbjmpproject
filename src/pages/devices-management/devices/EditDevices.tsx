import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDevice, getDevice_Types, getJail } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditDevices = {
    device_type_id: number | null;
    jail_id: number | null;
    device_name: string;
    description: string;
    serial_no: string;
    date_acquired: string | null;
    manufacturer: string;
    supplier: string;
}

const EditDevices = ({ devices, onClose }: { devices: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDevice(token ?? "", devices.id, updatedData),
        onSuccess: () => {
            setIsLoading(false); 
            messageApi.success("Devices updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Devices");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['device-type'],
                queryFn: () => getDevice_Types(token ?? "")
            },
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
        ]
    });

    const deviceTypeData = results[0].data;
    const deviceTypeLoading = results[0].isLoading;

    const jailData = results[1].data;
    const jailLoading = results[1].isLoading;

    useEffect(() => {
        if (devices) {
            const initialValues = {
                device_type_id: devices.device_type_id,
                jail_id: devices.jail_id,
                device_name: devices.device_name,
                description: devices.description,
                serial_no: devices.serial_no,
                date_acquired: devices.date_acquired || "", // Ensure it's a string
                manufacturer: devices.manufacturer,
                supplier: devices.supplier,
            };
            
            form.setFieldsValue(initialValues); // Set form values
        }
    }, [devices, form]);

    const handledevicesSubmit = (values: EditDevices) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    const onDeviceTypeChange = (value: number) => {
        form.setFieldsValue({ device_type_id: value });
    };

    const onJailChange = (value: number) => {
        form.setFieldsValue({ jail_id: value });
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handledevicesSubmit}
                initialValues={{
                    device_type_id: devices?.device_type_id ?? null,
                    jail_id: devices?.jail_id ?? null,
                    device_name: devices?.device_name ?? "",
                    description: devices?.description ?? "",
                    serial_no: devices?.serial_no ?? "",
                    date_acquired: devices?.date_acquired || "", // Ensure correct format
                    manufacturer: devices?.manufacturer ?? "",
                    supplier: devices?.supplier ?? "",
                }}
            >
                <Form.Item
                    label="Device Type"
                    name="device_type_id"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Device Type"
                        optionFilterProp="label"
                        onChange={onDeviceTypeChange}
                        loading={deviceTypeLoading}
                        options={deviceTypeData?.map(devicetype => ({
                            value: devicetype.id,
                            label: devicetype.device_type
                        }))}/>
                </Form.Item>
                <Form.Item
                    label="Jail"
                    name="jail_id"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail"
                        optionFilterProp="label"
                        onChange={onJailChange}
                        loading={jailLoading}
                        options={jailData?.map(jail => ({
                            value: jail.id,
                            label: jail.jail_name
                        }))}/>
                </Form.Item>
                <Form.Item
                    label="Device Name"
                    name="device_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Serial Number"
                    name="serial_no"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Date Acquired"
                    name="date_acquired"
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Manufacturer"
                    name="manufacturer"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Supplier"
                    name="supplier"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Device"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditDevices;