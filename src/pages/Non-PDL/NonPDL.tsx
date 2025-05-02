import { getProvidedServices, getServiceProviderTypes } from "@/lib/additionalQueries";
import { getPerson } from "@/lib/queries";
import { deleteServiceProvider, getNonPDL_Visitor, getService_Provider } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

export interface NonPDLVisitorPayload {
    key: number;
    id: number;
    reg_no: string;
    person: string;
    personnel: string;
    non_pdl_visitor_type: string;
    non_pdl_visitor_reason: string;
}
const NonPDL = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const { data:  NonPDLVisitorData } = useQuery({
        queryKey: ['non-pdl-visitor'],
        queryFn: () => getNonPDL_Visitor(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteServiceProvider(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service-provider"] });
            messageApi.success("Service Provider deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Service Provider");
        },
    });
    const dataSource = NonPDLVisitorData?.map((non_pdl_visitor, index) => {

        // const matchedServiceProviderType = SPTypeData?.find(serv_prov_type => serv_prov_type.id === provider.serv_prov_type);
    
        return {
            key: index + 1,
            id: non_pdl_visitor?.id,
            reg_no: non_pdl_visitor?.reg_no,
            person: non_pdl_visitor?.person,
            personnel: non_pdl_visitor?.personnel,
            non_pdl_visitor_type: non_pdl_visitor?.non_pdl_visitor_type,
            non_pdl_visitor_reason: non_pdl_visitor?.non_pdl_visitor_reason,
        };
    }) || [];    

    const filteredData = dataSource?.filter((non_pdl_visitor) =>
        Object.values(non_pdl_visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<NonPDLVisitorPayload> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Non-PDL Visitor No.',
            dataIndex: 'reg_no',
            key: 'reg_no'
        },
        {
            title: 'Person',
            dataIndex: 'person',
            key: 'person'
        },
        {
            title: 'Personnel',
            dataIndex: 'personnel',
            key: 'personnel'
        },
        {
            title: 'Non-PDL Visitor Type',
            dataIndex: 'non_pdl_visitor_type',
            key: 'non_pdl_visitor_type'
        },
        {
            title: 'Non-PDL Visitor Reason',
            dataIndex: 'non_pdl_visitor_reason',
            key: 'non_pdl_visitor_reason'
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteMutation.mutate(record.id)}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ]
    return (
        <div>
            {contextHolder}
            <h1 className="text-2xl font-bold text-[#1E365D]">NON-PDL Visitor</h1>
            <div className="flex items-center justify-between my-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search NON-PDL Visitor..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            <Table dataSource={filteredData} columns={columns}/>
        </div>
    )
}

export default NonPDL
