import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/urls";

type AddressProps = {
    record_status_id: number | null;
    address_type: string;
    description: string;
}

const EditAddress = ({address, onClose }: { address: any; onClose:() => void;}) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressProps>({
            record_status_id: null,
            address_type: '',
            description: '',
        });

    useEffect(() => {
            if (address) {
            setAddressForm({
                record_status_id: address.record_status_id,
                address_type: address.address_type,
                description: address.description,
            });
            }
        }, [address]);


        const updateAddress = async (
            token: string,
            id: number,
            updatedData: any
        ) => {
            const response = await fetch(`${BASE_URL}/api/standards/address-type/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(updatedData),
            });
    
            if (!response.ok) {
            throw new Error("Failed to update Address Type");
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
            updateAddress(token ?? "", address.id, updatedData),
            onSuccess: () => {
            messageApi.success("Address updated successfully");
            setIsLoading(false);
            onClose();
            },
            onError: (error: any) => {
            setIsLoading(false);
            messageApi.error(error.message || "Failed to update Address");
            },
        });
    
        const handleAddressSubmit = () => {
            setIsLoading(true);
            updateMutation.mutate(addressForm);
        };

    return (
        <div>
        {contextHolder}
        <Form form={form} layout="vertical" onFinish={handleAddressSubmit}>
            <Form.Item label="Address Type" required>
            <Input
                value={addressForm.address_type}
                onChange={(e) =>
                setAddressForm((prev) => ({ ...prev, name: e.target.value }))
                }
            />
            </Form.Item>
            <Form.Item label="Description">
            <Input
                value={addressForm.description}
                onChange={(e) =>
                setAddressForm((prev) => ({
                    ...prev,
                    description: e.target.value,
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
                value={addressForm.record_status_id ?? undefined}
                onChange={(value) =>
                setAddressForm((prev) => ({
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
                {isLoading ? "Updating..." : "Update Address Type"}
            </Button>
            </Form.Item>
        </Form>
        </div>
    )
}

export default EditAddress
