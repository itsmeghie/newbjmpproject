import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateAuthorizeVisitor, getPDLs, getVisitors, getVisitor_to_PDL_Relationship } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditPDLtoVisit = {
    visitor: number | null,
    pdl: number | null,
    relationship_to_pdl: number | null,
    record_status_id: number | null
}

const EditPDLtoVisit = ({ pdlvisitor, onClose }: { pdlvisitor: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [PDLVisitor, setPDLVisitor] = useState<EditPDLtoVisit>({
        visitor: null,
        pdl: null,
        relationship_to_pdl: null,
        record_status_id: null
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateAuthorizeVisitor(token ?? "", pdlvisitor.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("PDL Visitor updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update PDL Visitor");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['pdl'],
                queryFn: () => getPDLs(token ?? "")
            },
            {
                queryKey: ['visitor'],
                queryFn: () => getVisitors(token ?? "")
            },
            {
                queryKey: ['pdlrelationship-to-visitor'],
                queryFn: () => getVisitor_to_PDL_Relationship(token ?? "")
            },
        ]
    });

    const PDLData = results[0].data;
    const PDLLoading = results[0].isLoading;

    const visitorData = results[1].data;
    const visitorLoading = results[1].isLoading;

    const pdlrelationshiptoPDLData = results[2].data;
    const pdlrelationshiptoPDLLoading = results[2].isLoading;

        useEffect(() => {
            if (pdlvisitor) {
                form.setFieldsValue({
                    pdl: pdlvisitor.pdl,
                    visitor: pdlvisitor.visitor,
                    relation_to_pdl: pdlvisitor.relation_to_pdl,
                    record_status_id: pdlvisitor.record_status_id,
                });
            }
        }, [pdlvisitor, form]);

    const handlePDLRelationtoVisitorSubmit = (values: {
        visitor: number | null,
        pdl: number | null,
        relationship_to_pdl: number | null,
        record_status_id: number | null
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };
    
    const onPDLChange = (value: number) => {
        setPDLVisitor(prevForm => ({
            ...prevForm,
            pdl: value
        }));
    };

    const onVisitorChange = (value: number) => {
        setPDLVisitor(prevForm => ({
            ...prevForm,
            visitor: value
        }));
    };

    const onRelationshiptoPDLChange = (value: number) => {
        setPDLVisitor(prevForm => ({
            ...prevForm,
            relationship_to_pdl: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handlePDLRelationtoVisitorSubmit}
                initialValues={{
                    pdl: pdlvisitor?.pdl ?? 'N/A',
                    visitor: pdlvisitor?.visitor ?? 'N/A',
                    relationship_to_pdl: pdlvisitor?.relationship_to_pdl ?? 'N/A',
                }}
            >
                
                <Form.Item
                    label="PDL"
                    name="pdl"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="PDL"
                        optionFilterProp="label"
                        onChange={onPDLChange}
                        loading={PDLLoading}
                        options={PDLData?.map(pdl => (
                            {
                                value: pdl.id,
                                label: pdl?.first_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Visitor"
                    name="visitor"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Visitor"
                        optionFilterProp="label"
                        onChange={onVisitorChange}
                        loading={visitorLoading}
                        options={visitorData?.map(visitor => (
                            {
                                value: visitor.id,
                                label: visitor?.first_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Relation to PDL"
                    name="relattionship_to_pdl"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Relationship to PDL"
                        optionFilterProp="label"
                        onChange={onRelationshiptoPDLChange}
                        loading={pdlrelationshiptoPDLLoading}
                        options={pdlrelationshiptoPDLData?.map(relationshiptopdl => (
                            {
                                value: relationshiptopdl.id,
                                label: relationshiptopdl?.relationship_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Relationship to PDL"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditPDLtoVisit;
