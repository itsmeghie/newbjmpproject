import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDetention_Building, getJail, getJail_Security_Level } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useState } from "react";

type EditDetentionBuilding = {
    bldg_name: string,
    jail_id: number | null,
    security_level_id: number | null,
}

const EditDetentionBuilding = ({ detentionBuilding, onClose }: { detentionBuilding: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [jail, setJail] = useState<EditDetentionBuilding>({
        bldg_name: '',
        jail_id: null,
        security_level_id: null,
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDetention_Building(token ?? "", detentionBuilding.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Detention Building updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Detention Building");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
            {
                queryKey: ['security-level'],
                queryFn: () => getJail_Security_Level(token ?? "")
            },
        ]
    });

    const jailData = results[0].data;
    const jailLoading = results[0].isLoading;

    const securityLevelData = results[1].data;
    const securityLevelLoading = results[1].isLoading;

    const handleDetentionBuildingSubmit = (values: { 
        bldg_name: string;
        jail_id: number;
        security_level_id: number;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };

    const onJailChange = (value: number) => {
        setJail(prevForm => ({
            ...prevForm,
            jail_id: value
        }));
    };

    const onSecurityLevelChange = (value: number) => {
        setJail(prevForm => ({
            ...prevForm,
            security_level_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleDetentionBuildingSubmit}
                initialValues={{
                    bldg_name: detentionBuilding?.bldg_name,
                    jail_id: detentionBuilding?.jail_id,
                    security_level_id: detentionBuilding?.security_level_id,
                }}
            >
                <Form.Item
                    label="Building Name"
                    name="bldg_name"
                >
                    <Input />
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
                            options={jailData?.map(jail => (
                                {
                                    value: jail.id,
                                    label: jail?.jail_name,
                                }
                            ))}
                        />
                </Form.Item>
                <Form.Item
                    label="Jail Security Level"
                    name="security_level_id"
                >
                    <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Security Level"
                            optionFilterProp="label"
                            onChange={onSecurityLevelChange}
                            loading={securityLevelLoading}
                            options={securityLevelData?.map(securitylevel => (
                                {
                                    value: securitylevel.id,
                                    label: securitylevel?.category_name,
                                }
                            ))}
                        />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Detention Building"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditDetentionBuilding;