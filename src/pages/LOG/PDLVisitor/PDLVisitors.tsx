import { getMainGate, getPDLStation } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { Image, Input, Table } from "antd";
import { useState } from "react";
import noimg from "../../../../public/noimg.png";
import { MainGateLog } from "@/lib/issues-difinitions";

const PDLVisitors = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;

    const { data: visitLogData } = useQuery({
        queryKey: ["pdl-station"],
        queryFn: () => getPDLStation(token ?? ""),
        refetchInterval: 60000, 
    });


    const dataSource: MainGateLog[] = visitLogData?.map((pdlstation, index) => {

        const profileImage = pdlstation?.visitor?.person?.media?.find(
            (m: any) => m.picture_view === "Front"
        );

        const pdlImage = pdlstation?.visitor?.pdls[0]?.pdl.person?.media?.find(
            (m: any) => m.picture_view === "Front"
        );

        return {
            key: index + 1,
            id: pdlstation?.id ?? "N/A",
            timestamp: pdlstation?.tracking_logs?.[0]?.created_at ?? '',
            visitor: pdlstation?.person,
            visitorPhoto: profileImage
                    ? {
                        media_binary: profileImage.media_binary,
                        media_filepath: profileImage.media_filepath,
                    }
                    : null,
            pdlPhoto: pdlImage
                    ? {
                        media_binary: pdlImage.media_binary,
                        media_filepath: pdlImage.media_filepath,
                    }
                    : null,
            visitorType: pdlstation?.visitor?.visitor_type ?? "",
            pdlName: pdlstation
                    ? `${pdlstation.visitor?.pdls[0]?.pdl.person?.first_name || ''} ${pdlstation.visitor?.pdls[0]?.pdl.person.last_name || ''}`
                    : "",
            relationshipToPDL: pdlstation?.visitor?.pdls[0]?.relationship_to_pdl || "No PDL relationship",
            level: pdlstation?.visitor?.pdls?.[0]?.pdl.cell.cell_name,
            annex: pdlstation?.visitor?.pdls?.[0]?.pdl?.cell?.floor?.split("(")[1]?.replace(")", ""),
            dorm: pdlstation?.visitor?.pdls?.[0]?.pdl?.cell?.floor,
        }
    }) || [];

    const filteredData = dataSource.filter((visit) =>
        Object.values(visit).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<MainGateLog> = [
        {
            title: "No.",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Visitor Name",
            dataIndex: "visitor",
            key: "visitor",
        },
        {
            title: "Visitor Type",
            dataIndex: "visitorType",
            key: "visitorType",
        },
        {
            title: "Visitor Photo",
            dataIndex: "visitorPhoto",
            key: "visitorPhoto",
            render: (photo) => (
                <div className="w-[90px] h-[90px] rounded-xl overflow-hidden flex items-center justify-center">
                    {photo?.media_binary ? (
                        <Image
                            src={`data:image/bmp;base64,${photo.media_binary}`}
                            alt="Visitor"
                            className="w-full h-full object-cover"
                        />
                    ) : photo?.media_filepath ? (
                        <Image
                            src={photo.media_filepath}
                            alt="Visitor"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={noimg}
                            alt="No Image"
                            className="w-2/3 h-2/3 object-contain p-2 bg-gray-100 rounded-lg"
                        />
                    )}
                </div>
            ),
        },
        {
            title: "PDL Photo",
            dataIndex: "pdlPhoto",
            key: "pdlPhoto",
            render: (photo) => (
                <div className="w-[90px] h-[90px] rounded-xl overflow-hidden flex items-center justify-center">
                    {photo?.media_binary ? (
                        <Image
                            src={`data:image/bmp;base64,${photo.media_binary}`}
                            alt="PDL"
                            className="w-full h-full object-cover"
                        />
                    ) : photo?.media_filepath ? (
                        <img
                            src={photo.media_filepath}
                            alt="PDL"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={noimg}
                            alt="No Image"
                            className="w-2/3 h-2/3 object-contain p-2 bg-gray-100 rounded-lg"
                        />
                    )}
                </div>
            ),
        },
        {
            title: "PDL Name",
            dataIndex: "pdlName",
            key: "pdlName",
        },
        {
            title: "Relationship to Visitor",
            dataIndex: "relationshipToPDL",
            key: "relationshipToPDL",
        },
        {
            title: "Level",
            dataIndex: "level",
            key: "level",
        },
        {
            title: "Annex",
            dataIndex: "annex",
            key: "annex",
        },
        {
            title: "Dorm",
            dataIndex: "dorm",
            key: "dorm",
        },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-[#1E365D]">PDL Visitor</h1>
                <Input
                    placeholder="Search logs..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="mb-4 py-2 w-full md:w-64"
                />
            </div>
            
            <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
            />
        </div>
    );
};

export default PDLVisitors;
