import { getRecord_Status, updateMultiBirth } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";

type MultiBirthProps = {
    record_status_id: number | null,
    classification: string,
    group_size: number| null,
    term_for_sibling_group: string,
    description: string
}
const EditMultiBirth = ({ multibirth, onClose }: { multibirth: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [ selectjail, setSelectJail] = useState<MultiBirthProps>(
        {
            record_status_id: null,
            classification: '',
            group_size: null,
            term_for_sibling_group: '',
            description: ''
        }
    )

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateMultiBirth(token ?? "", multibirth.id, updatedData),
        onSuccess: () => {
            setIsLoading(false);
            messageApi.success("Multi Birth Classification updated successfully");
            onClose();
        },        
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Multi Birth Classification");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["record-status"],
                queryFn: () => getRecord_Status(token ?? ""),
            },
            ],
        });
        
        const recordStatusData = results[0].data;

    useEffect(() => {
        if (multibirth) {
            form.setFieldsValue({
                record_status_id: multibirth.record_status_id ,
                classification: multibirth.classification ,
                group_size: multibirth.group_size ,
                term_for_sibling_group: multibirth.term_for_sibling_group ,
                description: multibirth.description
            });
        }
    }, [multibirth, form]);

    const handleMultiBirthSubmit = (values: any) => {
        const payload = {
            record_status_id: values.record_status_id ,
            classification: values.classification ,
            group_size: values.group_size ,
            term_for_sibling_group: values.term_for_sibling_group ,
            description: values.description
        };
            const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== null)
            );
        
            setIsLoading(true);
            updateMutation.mutate(cleanedPayload);
        };

        const onRecordStatusChange = (value: number) => {
            setSelectJail(prevForm => ({
                ...prevForm,
                record_status_id: value,
            }));
        }; 

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleMultiBirthSubmit}
                initialValues={{
                    record_status_id: multibirth?.record_status_id ?? 'N/A',
                    classification: multibirth?.classification ?? 'N/A',
                    group_size: multibirth?.group_size ?? 'N/A',
                    term_for_sibling_group: multibirth?.term_for_sibling_group ?? 'N/A',
                    description: multibirth?.description ?? 'N/A',
                }}
            >
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                <Form.Item label="Classification" name="classification">
                    <Input className="h-12 border border-gray-300 rounded-lg px-2"/>
                </Form.Item>
                <Form.Item label="Group Size" name="group_size">
                    <Input type="number" className="h-12 border border-gray-300 rounded-lg px-2"/>
                </Form.Item>
                <Form.Item label="Term for Sibling Group" name="term_for_sibling_group">
                    <Input className="h-12 border border-gray-300 rounded-lg px-2"/>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input className="h-12 border border-gray-300 rounded-lg px-2"/>
                </Form.Item>
                <Form.Item name="record_status_id" label="Record Status" rules={[{ required: true, message: 'Please select a record status' }]}>
                    <Select className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        options={recordStatusData?.map(record_status => (
                                {
                                    value: record_status.id,
                                    label: record_status?.status,
                                }
                            ))}
                        />
                    </Form.Item>
            </div>
            <Form.Item>
                    <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Multi Birth Classification"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default EditMultiBirth
