import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTokenStore } from "@/store/useTokenStore";
import { getVisitorSpecific } from "@/lib/queries";
import moment from "moment";
import noimg from '../../../../public/noimg.png'

const PDLVisitors = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();

    const { data } = useQuery({
        queryKey: ['visitor'],
        queryFn: async () => {
            try {
                return await getVisitorSpecific(token ?? "");
            } catch (error) {
                console.error("Error fetching visitor data:", error);
                return [];
            }
        },
        retry: false,
    });
    const dataSource = data?.map((visitor, index) => ({
        ...visitor,
        key: index + 1,
        timestamp: moment(visitor?.created_at).format("YYYY-MM-DD hh:mm A"),
    })) || [];

    const filteredData = dataSource.filter((item: any) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<any> = [
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
        },
        {
            title: "Visitor Name",
            key: "name",
            render: (_, visitor) => (
                `${visitor?.person?.first_name ?? 'N/A'} ${visitor?.person?.middle_name ?? ''} ${visitor?.person?.last_name ?? 'N/A'}`.trim()
            ),
        },
        {
            title: "Visitor Type",
            key: "visitor_type",
            render: (_, visitor) => (
                `${visitor?.visitor_type ?? 'N/A'}`
            )
        },
        {
            title: "Visitor Photo",
            key: "media_binary",
            render: (_, visitor) => {
                const profileImage = visitor?.person?.media?.find(
                    (m: any) =>
                        m.picture_view === "Front"
                );
        
                return profileImage?.media_binary ? (
                    <img
                        src={`data:image/bmp;base64,${profileImage.media_binary}`}
                        alt="Profile Picture"
                        className="w-14 h-14 object-cover rounded-md"
                    />
                ) : (
                    <img
                        src={noimg}
                        alt="No Image"
                        className="w-14 h-14 object-contain p-2 bg-gray-100 rounded-md"
                    />
                );
            }
        },        
        {
            title: "PDL Photo",
            key: "media_binary",
            render: (_, visitor) => {
                const profileImage = visitor?.pdls?.[0]?.pdl.person?.media?.find(
                    (m: any) =>
                        m.picture_view === "Front"
                );
        
                return profileImage?.media_binary ? (
                    <img
                        src={`data:image/bmp;base64,${profileImage.media_binary}`}
                        alt="Profile Picture"
                        className="w-14 h-14 object-cover rounded-md"
                    />
                ) : (
                    <img
                        src={noimg}
                        alt="No Image"
                        className="w-14 h-14 object-contain p-2 bg-gray-100 rounded-md"
                    />
                );
            }
        },
        {
            title: "PDL Name",
            key: "pdl_name",
            render: (_, visitor) => (
                `${visitor?.pdls?.[0]?.pdl.person.first_name ?? ''} ${visitor?.pdls?.[0]?.pdl.person.middle_name ?? ''} ${visitor?.pdls?.[0]?.pdl.person.last_name ?? ''}`.trim()
            ),
        },
        {
            title: "Relationship to Visitor",
            key: "relationship",
            render: (_, visitor) => (
                `${visitor?.pdls?.[0]?.relationship_to_pdl_str ?? ''}`
            ),
        },
        {
            title: "Level",
            key: "level",
            render: (_, visitor) => (
                `${visitor?.pdl?.cell?.floor?.split("(")[1]?.replace(")", "") ?? ''}`
            ),
        },
        {
            title: "Annex",
            key: "annex",
            render: (_, visitor) => (
                `${visitor?.pdls?.[0]?.relationship_to_pdl_str ?? ''}`
            ),
        },
        {
            title: "Dorm",
            key: "dorm",
            render: (_, visitor) => (
                `${visitor?.pdls?.[0]?.pdl.cell.floor ?? ''}`
            ),
        },
        {
            title: "Visitor Status",
        },
    ];

    return (
        <div className="space-y-4">
            {contextHolder}
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
                <p className="text-[#1E365D] text-3xl font-bold">PDL Visitor Logs</p>
                <div>
                    <Input
                        placeholder="Search Visitors..."
                        value={searchText}
                        className="w-full md:w-56"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            <Table
                dataSource={filteredData}
                columns={columns}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default PDLVisitors;
