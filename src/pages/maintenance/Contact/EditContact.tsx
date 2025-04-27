import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/urls";

type ContactProps = {
    type: string;
    value: string;
    is_primary: boolean;
    mobile_imei: string;
    remarks: string;
    contact_status: boolean;
};

    const EditContact = ({ contact, onClose }: { contact: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const [contactForm, setContactForm] = useState<ContactProps>({
        type: "",
        value: "",
        remarks: "",
        is_primary: false,
        mobile_imei: "",
        contact_status: false,
    });

    useEffect(() => {
        if (contact) {
        setContactForm({
            type: contact.type ?? "",
            value: contact.value ?? "",
            remarks: contact.remarks ?? "",
            is_primary: contact.is_primary ?? false,
            mobile_imei: contact.mobile_imei ?? "",
            contact_status: contact.contact_status ?? false,
        });
        }
    }, [contact]);

    const updateContact = async (token: string, id: number, updatedData: ContactProps) => {
        const response = await fetch(`${BASE_URL}/api/standards/contacts/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
        throw new Error("Failed to update contact");
        }

        return response.json();
    };

    const updateMutation = useMutation({
        mutationFn: (updatedData: ContactProps) => updateContact(token ?? "", contact.id, updatedData),
        onSuccess: () => {
        messageApi.success("Contact updated successfully");
        setIsLoading(false);
        onClose();
        },
        onError: (error: any) => {
        setIsLoading(false);
        messageApi.error(error.message || "Failed to update contact");
        },
    });

    const handleSubmit = () => {
        setIsLoading(true);
        updateMutation.mutate(contactForm);
    };

    return (
        <div>
        {contextHolder}
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item label="Type" required>
            <Input
                value={contactForm.type}
                onChange={(e) => setContactForm((prev) => ({ ...prev, value: e.target.value }))}/>
            </Form.Item>
            <Form.Item label="Details" required>
            <Input
                value={contactForm.value}
                onChange={(e) => setContactForm((prev) => ({ ...prev, value: e.target.value }))}
            />
            </Form.Item>

            <Form.Item label="Mobile IMEI">
            <Input
                value={contactForm.mobile_imei}
                onChange={(e) => setContactForm((prev) => ({ ...prev, mobile_imei: e.target.value }))}
            />
            </Form.Item>

            <Form.Item label="Remarks">
            <Input
                value={contactForm.remarks}
                onChange={(e) => setContactForm((prev) => ({ ...prev, remarks: e.target.value }))}
            />
            </Form.Item>

            <Form.Item label="Is Primary" required>
            <Select
                value={contactForm.is_primary ? "Yes" : "No"}
                onChange={(value) =>
                setContactForm((prev) => ({ ...prev, is_primary: value === "Yes" }))
                }
            >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
            </Select>
            </Form.Item>

            <Form.Item label="Contact Active" required>
            <Select
                value={contactForm.contact_status ? "Yes" : "No"}
                onChange={(value) =>
                setContactForm((prev) => ({ ...prev, contact_status: value === "Yes" }))
                }
            >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
            </Select>
            </Form.Item>

            <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
                {isLoading ? "Updating..." : "Update Contact"}
            </Button>
            </Form.Item>
        </Form>
        </div>
    );
    };

export default EditContact;
