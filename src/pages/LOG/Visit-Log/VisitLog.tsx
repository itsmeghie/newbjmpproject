import { getVisitorSpecific } from "@/lib/queries";
import { getVisitLog } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { Input, Table } from "antd";
import { useState } from "react";

type VisitLogForm = {
  key: number;
  id: number;
  timestamp: string;
  visitorName: string;
  visitorCategory: string;
};

const VisitLog = () => {
  const [searchText, setSearchText] = useState("");
  const token = useTokenStore().token;
  const queryClient = useQueryClient();

  const { data: visitLogData } = useQuery({
    queryKey: ['visit-log'],
    queryFn: () => getVisitLog(token ?? ""),
  });

  const { data: visitorData } = useQuery({
    queryKey: ['visitor'],
    queryFn: () => getVisitorSpecific(token ?? ""),
  });

  const dataSource: VisitLogForm[] = visitLogData?.map((visit, index) => {
    const matchedVisitor = visitorData?.find((visitor) => visitor.id_number === visit.id_number);

    return {
      key: index + 1,
      id: visit?.id ?? 0,
      timestamp: visit?.created_at ?? '',
      visitorName: matchedVisitor 
        ? `${matchedVisitor.person?.first_name} ${matchedVisitor.person?.last_name}`
        : 'Unknown Visitor',
      visitorType: matchedVisitor?.visitor_type ?? 'Unknown Visitor Type',
    };
  }) || [];

  const filteredData = dataSource.filter((visit) =>
    Object.values(visit).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<VisitLogForm> = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Visitor Name',
      dataIndex: 'visitorName',
      key: 'visitorName',
    },
    {
      title: 'Visitor Type',
      dataIndex: 'visitorType',
      key: 'visitorType',
    },
  ];

  return (
    <div className="p-4">
      <Input 
        placeholder="Search logs..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />
      <Table 
        dataSource={filteredData} 
        columns={columns} 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default VisitLog;
