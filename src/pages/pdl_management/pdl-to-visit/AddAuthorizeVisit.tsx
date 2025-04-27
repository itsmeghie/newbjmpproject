import { getPDLs, getVisitor_to_PDL_Relationship, getVisitors } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { message, Select } from "antd";
import { PDL_TO_VISIT } from "@/lib/urls";

type AddAuthorizeVisit = {
    visitor: number | null,
    pdl: number | null,
    relationship_to_pdl: number | null,
    record_status_id: number | null
}

const AddAuthorizeVisit = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [relationshiptoPDL, setrelationshiptoPDL] = useState<AddAuthorizeVisit>({
        visitor: null,
        pdl: null,
        relationship_to_pdl: null,
        record_status_id: null
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['pdl'],
                queryFn: () => getPDLs(token ?? "")
            },
            {
                queryKey: ['visitor-to-pdl-relationship'],
                queryFn: () => getVisitor_to_PDL_Relationship(token ?? "")
            },
            {
                queryKey: ['visitor'],
                queryFn: () => getVisitors(token ?? "")
            },
        ]
    });

    const PDLData = results[0].data;
    const PDLLoading = results[0].isLoading;

    const VisitorRelationshiptoPDLData = results[1].data;
    const VisitorRelationshiptoPDLLoading = results[1].isLoading;

    const VisitorData = results[2].data;
    const VisitorLoading = results[2].isLoading;

    async function AddAuthorizeVisit(visitorofpdl: AddAuthorizeVisit) {
        const res = await fetch(PDL_TO_VISIT.getPDL_TO_VISIT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(visitorofpdl),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding PDL Visitor";
    
            try {
                const errorData = await res.json();
                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
    
            throw new Error(errorMessage);
        }
    
        return res.json();
    }

    const pdlvisitorMutation = useMutation({
        mutationKey: ['pdlvisitor'],
        mutationFn: AddAuthorizeVisit,
        onSuccess: (data) => {
            console.log(data);
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error);
            messageApi.error(error.message);
        },
    });

    const handleOrganizationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        pdlvisitorMutation.mutate(relationshiptoPDL);
    };

    const onPDLChange = (value: number) => {
        setrelationshiptoPDL(prevForm => ({
            ...prevForm,
            pdl: value
        }));
    };
    const onPDLVisitorChange = (value: number) => {
        setrelationshiptoPDL(prevForm => ({
            ...prevForm,
            visitor: value
        }));
    };

    const onPDLRelationshiptoVisitorChange = (value: number) => {
        setrelationshiptoPDL(prevForm => ({
            ...prevForm,
            relationship_to_pdl: value
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handleOrganizationSubmit}>
                <div className="flex flex-col gap-5">
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
                                label: pdl?.first_name,
                            }
                        ))}
                    />
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Visitor"
                        optionFilterProp="label"
                        onChange={onPDLVisitorChange}
                        loading={VisitorLoading}
                        options={VisitorData?.map(visitor => (
                            {
                                value: visitor.id,
                                label: visitor?.first_name
                            }
                        ))}
                    />
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Visitor Relationahip to PDL"
                        optionFilterProp="label"
                        onChange={onPDLRelationshiptoVisitorChange}
                        loading={VisitorRelationshiptoPDLLoading}
                        options={VisitorRelationshiptoPDLData?.map(visitor => (
                            {
                                value: visitor.id,
                                label: visitor?.relationship_name
                            }
                        ))}
                    />
                </div>

                <div className="w-full flex justify-end mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAuthorizeVisit;