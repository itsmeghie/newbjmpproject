import { getVisitor_to_PDL_Relationship, deleteVisitor_RelationShip } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Dropdown, Menu, message, Button, Modal } from "antd";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EditVisitorRelation from "./EditVisitorRelation";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddVisitorRelation from "./AddVisitorRelation";

type VisitortoPDLRelationship = {
    key: number;
    id: number;
    relationship_name: string;
    description: string;
  };
  
const VisitorRelationship = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage()
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [visitorRelation, setVisitorRelation] = useState<VisitortoPDLRelationship | null>(null);

    const { data } = useQuery({
        queryKey: ['visitor-relation'],
        queryFn: () => getVisitor_to_PDL_Relationship(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVisitor_RelationShip(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitor-relation"] });
            messageApi.success("Visitor Relationship to PDL deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Visitor Relationship to PDL");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
        const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((visit, index) => (
        {
            key: index + 1,
            id: visit?.id,
            relationship_name: visit?.relationship_name ?? 'N/A',
            description: visit?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((visitor) =>
        Object.values(visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );
    const columns: ColumnsType<VisitortoPDLRelationship> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Relationship Name',
            dataIndex: 'relationship_name',
            key: 'relationship_name',
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
            render: (_: any, record: VisitortoPDLRelationship) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setVisitorRelation(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Visitors");
        XLSX.writeFile(wb, "Visitors.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Visitor Name', 'Description']],
            body: dataSource.map(item => [item.key, item.relationship_name, item.description]),
        });
        doc.save('Visitors.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Visitors.csv">
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
            printWindow.document.write('<h1>Visitor Relationship to PDL Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Visitor</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.relationship_name}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Relationship to PDL</h1>
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
                        Add Relationship to PDL
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
                title="Add Visitor Relationship to PDL"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                style={{  overflowY: "auto" }} 
            >
            <AddVisitorRelation onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Visitor Relationship to PDL"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditVisitorRelation
                    visitorrelation={visitorRelation}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default VisitorRelationship;