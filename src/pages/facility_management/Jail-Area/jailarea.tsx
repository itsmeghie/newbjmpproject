import { getJail_Area, deleteJail_Area } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react"
import AddArea from "./addarea"
import { GoDownload, GoPlus } from "react-icons/go"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { ColumnsType } from "antd/es/table"
import EditJailArea from "./EditJailArea"
import { LuSearch } from "react-icons/lu";

type jailAreaReport = {
    key: number;
    id: number;
    building: number;
    jail: number;
    floor: number;
    area_name: string;
    floor_status: string;
  };

const JailArea = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [jailArea, setJailArea] = useState<jailAreaReport | null>(null);

    const { data } = useQuery({
        queryKey: ['jailarea'],
        queryFn: () => getJail_Area(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJail_Area(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jail-area"] });
            messageApi.success("Jail Area deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Jail Area");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((jailarea, index) => (
        {
            key: index + 1,
            id: jailarea?.id,
            building: jailarea?.building ?? 'N/A',
            jail: jailarea?.jail ?? 'N/A',
            floor: jailarea?.floor ?? 'N/A',
            area_name: jailarea?.area_name ?? 'N/A',
            floor_status: jailarea?.floor_status ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((jail_area) =>
        Object.values(jail_area).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<jailAreaReport> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Jail',
            dataIndex: 'jail',
            key: 'jail',
        },
        {
            title: 'Building ID',
            dataIndex: 'building',
            key: 'building',
        },
        
        {
            title: 'Floor ID',
            dataIndex: 'floor',
            key: 'floor',
        },
        {
            title: 'Area Name',
            dataIndex: 'area_name',
            key: 'area_name',
        },
        {
            title: 'Floor Status',
            dataIndex: 'floor_status',
            key: 'floor_status',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: jailAreaReport) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setJailArea(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "JailArea");
        XLSX.writeFile(wb, "JailArea.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Building', 'Jail', 'Floor', 'Area', 'Floor Status']],
            body: dataSource.map(item => [item.key, item.building, item.jail, item.floor, item.area_name, item.floor_status]),
        });
        doc.save('JailArea.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="JailArea.csv">
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
            printWindow.document.write('<div className="flex items-center justify-between"><h1>Jail Area Report</h1></div>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Building</th><th>Jail</th><th>Floor</th><th>Area</th><th>Floor Status</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.building}</td>
                    <td>${item.jail}</td>
                    <td>${item.floor}</td>
                    <td>${item.area_name}</td>
                    <td>${item.floor_status}</td>
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
            <div className="w-full bg-white">
            <div className="mb-4 flex justify-between gap-2">
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
                        Add Jail Area
                    </button>
                    </div>
                    
                </div>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="50%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddArea onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Jail Area"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditJailArea
                    jailarea={jailArea}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default JailArea
