import { getCivilStatus, deleteCivil_Status } from "@/lib/queries"
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
import AddCivilStatus from "./AddCivilStatus";
import EditCivilStatus from "./EditCilvilStatus";

type CivilStatus = {
    key: number | null;
    id: number;
    status: string;
    description: string;
};

const CivilStatus = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [civilStatus, setCivilStatus] = useState<CivilStatus | null>(null);

    const { data } = useQuery({
        queryKey: ['civil-status'],
        queryFn: () => getCivilStatus(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCivil_Status(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["civil-status"] });
            messageApi.success("Civil Status deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Civil Status");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((civil_status, index) => (
        {
            key: index + 1,
            id: civil_status?.id,
            status: civil_status?.status ?? 'N/A',
            description: civil_status?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((civil_status) =>
        Object.values(civil_status).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<CivilStatus> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Civil Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: CivilStatus) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setCivilStatus(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "CivilStatus");
        XLSX.writeFile(wb, "CivilStatus.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Document Name', 'Description']],
            body: dataSource.map(item => [item.key, item.status, item.description]),
        });
        doc.save('CivilStatus.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="CivilStatus.csv">
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
            printWindow.document.write('<h1>Civil Status Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Civil Status</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.status}</td>
                    <td>${item.description}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div className="h-screen">
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Civil Status</h1>
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
                        Add Civil Status
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
              title="Add Civil Status"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              style={{  overflowY: "auto" }} 
            >
            <AddCivilStatus onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Civil Status"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditCivilStatus
                    cilvilstatus={civilStatus}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default CivilStatus
