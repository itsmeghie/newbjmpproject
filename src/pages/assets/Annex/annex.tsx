import { getDetention_Building, deleteDetention_Building } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, message, Modal, Menu, Dropdown } from "antd";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import EditDetentionBuilding from "./editDetentionBuilding";
import AddAnnex from "./AddAnnex";

type detentionBuildingReport = {
    key: number;
    id: number;
    jail: number;
    bldg_name: string;
    bldg_status: string;
  };

const Annex = () => {        
    const [searchText, setSearchText] = useState("");
        const token = useTokenStore().token;
        const [isModalOpen, setIsModalOpen] = useState(false);
        const queryClient = useQueryClient();
        const [messageApi, contextHolder] = message.useMessage();
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [selectedDetentionBuilding, setSelectedDetentionBuilding] = useState<detentionBuildingReport | null>(null);

    const { data } = useQuery({
            queryKey: ["detention-building"],
            queryFn: () => getDetention_Building(token ?? ""),
        });
    
        const deleteMutation = useMutation({
            mutationFn: (id: number) => deleteDetention_Building(token ?? "", id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["detention-building"] });
                messageApi.success("ANNEX deleted successfully");
            },
            onError: (error: any) => {
                messageApi.error(error.message || "Failed to delete ANNEX");
            },
        });
    
        const showModal = () => {
          setIsModalOpen(true);
        };
      
        const handleCancel = () => {
          setIsModalOpen(false);
        };
    
        const dataSource = data?.map((building, index) => ({
            key: index + 1,
            id: building?.id,
            jail: building?.jail ?? "N/A",
            bldg_name: building?.bldg_name ?? "N/A",
            bldg_status: building?.bldg_status ?? "N/A",
        })) || [];
    
        const filteredData = dataSource?.filter((detention_building) =>
            Object.values(detention_building).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
    
        const columns: ColumnsType<detentionBuildingReport> = [
            {
                title: "No.",
                dataIndex: "key", 
                key: "key",
            },
            {
                title: "Jail",
                dataIndex: "jail",
                key: "jail",
            },
            {
                title: "Building Name",
                dataIndex: "bldg_name", 
                key: "bldg_name",
            },
            {
                title: "Building Status",
                dataIndex: "bldg_status", 
                key: "bldg_status",
            },
            {
                title: "Actions",
                key: "actions",
                render: (_: any, record: detentionBuildingReport) => (
                    <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                        <Button
                            type="link"
                            onClick={() => {
                                setSelectedDetentionBuilding(record);
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
            XLSX.utils.book_append_sheet(wb, ws, "DetentionBuilding");
            XLSX.writeFile(wb, "DetentionBuilding.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            autoTable(doc, { 
                head: [['No.', 'Building Name', 'Building Status']],
                body: dataSource.map(item => [item.key, item.bldg_name, item.bldg_status, item.jail]),
            });
            doc.save('DetentionBuilding.pdf');
        };
    
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={handleExportExcel}>Export Excel</a>
                </Menu.Item>
                <Menu.Item>
                    <CSVLink data={dataSource} filename="DetentionBuilding.csv">
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
                printWindow.document.write('<h1>Detention Building Report</h1>');
                printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
                printWindow.document.write('<tr><th>No.</th><th>Jail</th><th>Building Name</th><th>Building Status</th></tr>');
                filteredData.forEach(item => {
                    printWindow.document.write(`<tr>
                        <td>${item.key}</td>
                        <td>${item.jail}</td>
                        <td>${item.bldg_name}</td>
                        <td>${item.bldg_status}</td>
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
            <div className="my-5 flex justify-between">
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
                        Add Detention Building
                    </button>
                </div>
                </div>
            <div className="w-full">
                
                <div id="printable-table">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{x: 800}}
                    />
                </div>
                <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Annex"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="50%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddAnnex onClose={handleCancel} />
            </Modal>
                    <Modal
                        title="Edit Detention Building"
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        footer={null}
                    >
                        <EditDetentionBuilding
                            detentionBuilding={selectedDetentionBuilding}
                            onClose={() => setIsEditModalOpen(false)}
                        />
                    </Modal>
            </div>
        </div>
    )
}

export default Annex
