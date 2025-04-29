import { getMainGate, getPDLStation, getVisitorStation } from '@/lib/query';
import { useTokenStore } from '@/store/useTokenStore';
import { useQuery } from '@tanstack/react-query';
import { Input, Button, Table } from 'antd';
import { useState } from 'react';

const VisitLog = () => {
  const [searchText, setSearchText] = useState('');
  const [view, setView] = useState<'Main Gate' | 'Visitor' | 'PDL'>('Main Gate');
  const token = useTokenStore().token;

  const { data: mainGateData } = useQuery({
    queryKey: ['main-gate'],
    queryFn: () => getMainGate(token ?? ''),
    refetchInterval: 10000,
    enabled: view === 'Main Gate',
  });

  const { data: receptionData } = useQuery({
    queryKey: ['reception-log'],
    queryFn: () => getVisitorStation(token ?? ''),
    refetchInterval: 10000,
    enabled: view === 'Visitor',
  });

  const { data: pdlData } = useQuery({
    queryKey: ['pdl-log'],
    queryFn: () => getPDLStation(token ?? ''),
    refetchInterval: 10000,
    enabled: view === 'PDL',
  });

  const activeData =
    view === 'Main Gate'
      ? mainGateData
      : view === 'Visitor'
      ? receptionData
      : pdlData;

  const dataSource =
    activeData?.map((entry, index) => ({
      key: index + 1,
      id: entry?.id ?? 'N/A',
      timestamp: entry?.tracking_logs?.[0]?.created_at ?? '',
      visitor: entry?.person || '',
      visitor_type: entry?.visitor?.visitor_type || '',
      pdl_name: `${entry?.visitor?.pdls?.[0]?.pdl?.person?.first_name || ''} ${entry?.visitor?.pdls?.[0]?.pdl?.person?.last_name || ''}`,
      pdl_type: entry?.visitor?.pdls?.[0]?.pdl?.pdl_type || '',
    })) || [];

  const filteredData = dataSource.filter((log) =>
    Object.values(log).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { title: 'No.', dataIndex: 'key', key: 'key' },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: 'Visitor Name', dataIndex: 'visitor', key: 'visitor' },
    { title: 'Visitor Type', dataIndex: 'visitor_type', key: 'visitor_type' },
    { title: 'PDL Name', dataIndex: 'pdl_name', key: 'pdl_name' },
    { title: 'PDL Type', dataIndex: 'pdl_type', key: 'pdl_type' },
  ];

  return (
  <div className="p-4 h-full flex flex-col">
    {/* Header & Buttons */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <div>
        <h1 className="text-3xl font-bold text-[#1E365D]">
          {view === 'Main Gate'
            ? 'Main Gate Visitor Logs'
            : view === 'Visitor'
            ? 'Visitor Logs'
            : 'PDL Visitor Logs'}
        </h1>
        <div className="flex gap-2 mt-2">
          <Button
            type={view === 'Main Gate' ? 'primary' : 'default'}
            onClick={() => setView('Main Gate')}
          >
            Main Gate Logs
          </Button>
          <Button
            type={view === 'Visitor' ? 'primary' : 'default'}
            onClick={() => setView('Visitor')}
          >
            Visitor Logs
          </Button>
          <Button
            type={view === 'PDL' ? 'primary' : 'default'}
            onClick={() => setView('PDL')}
          >
            PDL Visitor Logs
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Search logs..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="py-2 w-full md:w-64"
      />
    </div>

    {/* Scrollable Table Container */}
    <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ y: '72vh' }}
      />
    </div>
  </div>

  );
};

export default VisitLog;
