import { getVisitor_Type, deleteVisitor_Type } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, message, Menu, Dropdown } from "antd";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import AddVisitorType from "./AddVisitorType";
import EditVisitorType from "./EditVisitorType";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { ColumnsType } from "antd/es/table";
import './css/print.css'
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";

type VisitorTypeRecord = {
    key: number;
    id: number;
    visitor_type: string;
    description: string;
};

const VisitorType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVisitorType, setSelectedVisitorType] = useState<VisitorTypeRecord | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const { data } = useQuery({
        queryKey: ["visitor-type"],
        queryFn: () => getVisitor_Type(token ?? ""),
    });

    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVisitor_Type(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitor-type"] });
            messageApi.success("Visitor Type deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Visitor Type");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
        const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((visitor_type, index) => (
        {
        key: index + 1,
        id: visitor_type.id,
        visitor_type: visitor_type?.visitor_type ?? "N/A",
        description: visitor_type?.description ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((visitortype) =>
        Object.values(visitortype).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<VisitorTypeRecord> = [
        {
            title: "No.",
            dataIndex: "key", 
            key: "key",
        },
        {
            title: "Visitor Type",
            dataIndex: "visitor_type",
            key: "visitor_type",
        },
        {
            title: "Description",
            dataIndex: "description", 
            key: "description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: VisitorTypeRecord) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedVisitorType(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "VisitorType");
        XLSX.writeFile(wb, "VisitorType.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Visitor Type', 'Description']],
            body: dataSource.map(item => [item.key, item.visitor_type, item.description]),
        });
        doc.save('VisitorType.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="VisitorType.csv">
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
            printWindow.document.write('<h1>Visitor Type Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Visitor Type</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.visitor_type}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Visitor Type</h1>
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
                        Add Visitor Type
                    </button>
                    </div>
                    
                </div>
            <div className="w-full bg-white">
                <div id="printable-table" className="overflow-auto h-full">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{x: 800}}
                        tableLayout="fixed"
                    />
                </div>
            </div>
            <Modal
              className="overflow-y-auto rounded-lg scrollbar-hide"
              title="Add Visitor Type"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              style={{  overflowY: "auto" }} 
            >
            <AddVisitorType onClose={handleCancel} />
            </Modal>

            <Modal
                title="Edit Visitor Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditVisitorType
                    visitorType={selectedVisitorType}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default VisitorType;