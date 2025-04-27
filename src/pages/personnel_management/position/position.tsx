import { getPosition, deletePosition } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddPosition from "./AddPosition";
import EditPosition from "./EditPosition";

type Position = {
    key: number | null;
    id: number;
    position_code: string;
    position_title: string;
    position_level: string;
    position_type: string;
    rank_required: number;
    organization: number;
    is_active: boolean;
};

const Position = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [position, setPosition] = useState<Position | null>(null);

    const { data } = useQuery({
        queryKey: ['position'],
        queryFn: () => getPosition(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePosition(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["position"] });
            messageApi.success("Position deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Position");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((position, index) => (
        {
            key: index + 1,
            id: position?.id,
            position_code: position?.position_code ?? 'N/A',
            position_title: position?.position_title ?? 'N/A',
            position_level: position?.position_level ?? 'N/A',
            position_type: position?.position_type ?? 'N/A',
            rank_required: position?.rank_required ?? 'N/A',
            organization: position?.organization ?? 'N/A',
            is_active: position?.is_active ?? 'N/A',
        }
    )) || [];

    
    const filteredData = dataSource?.filter((position) =>
        Object.values(position).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Position> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Position Code',
            dataIndex: 'position_code',
            key: 'position_code',
        },
        {
            title: 'Position Title',
            dataIndex: 'position_title',
            key: 'position_title',
        },
        {
            title: 'Position Level',
            dataIndex: 'position_level',
            key: 'position_level',
        },
        {
            title: 'Position Type',
            dataIndex: 'position_type',
            key: 'position_type',
        },
        {
            title: 'Rank Required',
            dataIndex: 'rank_required',
            key: 'rank_required',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: Position) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setPosition(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <AiOutlineEdit />
                    </Button>
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
    ];

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Position");
        XLSX.writeFile(wb, "Position.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Document Name', 'Description']],
            body: dataSource.map(item => [item.key, item.position_title, item.position_type, item.position_level, item.position_code, item.organization, item.rank_required, item.is_active]),
        });
        doc.save('Position.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Position.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
            <Menu.Item>
                <a onClick={handleExportPDF}>Export PDF</a>
            </Menu.Item>
        </Menu>
    );

    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Position Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Organization</th><th>Position Code</th><th>Position Title</th><th>Position Level</th><th>Position Type</th><th>Rank Required</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.organization}</td>
                    <td>${item.position_code}</td>
                    <td>${item.position_title}</td>
                    <td>${item.position_level}</td>
                    <td>${item.position_type}</td>
                    <td>${item.rank_required}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Position</h1>
            <div className="w-full bg-white">
                <div className="my-4 flex justify-between gap-2">
                <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload /> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white">
                    <a onClick={handlePrintReport}>Print Report</a>
                    </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center">
                        <input
                            placeholder="Search"
                            type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-400 h-10 w-96 rounded-md px-2 active:outline-none focus:outline-none"
                        />
                        <LuSearch className="absolute right-[1%] text-gray-400" />
                    </div>
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                        >
                        <GoPlus />
                        Add Position
                    </button>
                    </div>
                    
                </div>
                <div className="overflow-x-auto overflow-y-auto h-full">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Position"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                style={{  overflowY: "auto" }} 
            >
            <AddPosition onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Position"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditPosition
                    position={position}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Position
