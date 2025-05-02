import { getProvidedServices, getServiceProviderTypes } from "@/lib/additionalQueries";
import { getPerson } from "@/lib/queries";
import { deleteServiceProvider, getService_Provider } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

export interface ServiceProviderPayload {
    key: number;
    id: number;
    sp_reg_no: string;
    serv_prov_type: number;
    provided_service: number;
    visitor_type: string;
    group_affiliation: string;
    person: number;
}
const ServiceProvider = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: ServicerProviderData } = useQuery({
        queryKey: ['service-provider'],
        queryFn: () => getService_Provider(token ?? ""),
    });

    const { data: PersonsData } = useQuery({
        queryKey: ['person'],
        queryFn: () => getPerson(token ?? ""),
    });

    const { data: SPTypeData } = useQuery({
        queryKey: ['sptype-data'],
        queryFn: () => getServiceProviderTypes(token ?? ""),
    });

    const { data: ProvidedServiceData } = useQuery({
        queryKey: ['ps-data'],
        queryFn: () => getProvidedServices(token ?? ""),
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
    const dataSource = ServicerProviderData?.map((provider, index) => {
        const matchedPerson = PersonsData?.find(person => person.id === provider.person);

        const matchedServiceProviderType = SPTypeData?.find(serv_prov_type => serv_prov_type.id === provider.serv_prov_type);

        const PSmatchData = ProvidedServiceData?.find(provided_service => provided_service.id === provider.provided_service);
    
        return {
            key: index + 1,
            id: provider?.id,
            sp_reg_no: provider?.sp_reg_no,
            serv_prov_type: matchedServiceProviderType?.serv_prov_type,
            provided_service: PSmatchData?.service_provided,
            visitor_type: provider?.visitor_type,
            group_affiliation: provider?.group_affiliation,
            person: `${matchedPerson?.first_name || ''} ${matchedPerson?.middle_name || ''} ${matchedPerson?.last_name || ''}` || "", 
        };
    }) || [];    

    const filteredData = dataSource?.filter((provider) =>
        Object.values(provider).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<ServiceProviderPayload> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'SP Type',
            dataIndex: 'serv_prov_type',
            key: 'serv_prov_type'
        },
        {
            title: 'Provided Service',
            dataIndex: 'provided_service',
            key: 'provided_service'
        },
        {
            title: 'SP No.',
            dataIndex: 'sp_reg_no',
            key: 'sp_reg_no',
        },
        {
            title: 'Person',
            dataIndex: 'person',
            key: 'person'
        },
        {
            title: 'Visitor Type',
            dataIndex: 'visitor_type',
            key: 'visitor_type'
        },
        {
            title: 'Group Affiliation',
            dataIndex: 'group_affiliation',
            key: 'group_affiliation'
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
            <h1 className="text-2xl font-bold text-[#1E365D]">Service Provider</h1>
            <div className="flex items-center justify-between my-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search Service Provider..."
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

export default ServiceProvider
