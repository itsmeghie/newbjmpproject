import { getJail_Security_Level, deleteJailSecurityLevel } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import AddSecurityLevel from "./AddSecurityLevel"
import { GoDownload, GoPlus } from "react-icons/go"
import { useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import EditSecurityLevel from "./EditSecurityLevel"
import { ColumnsType } from "antd/es/table"
import { LuSearch } from "react-icons/lu";

type JailSecurityLevelReport = {
    key: number;
    id: number;
    category_name: string;
    description: string;
  };

const JailSecurityLevel = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [securityLevel, setSecurityLevel] = useState<JailSecurityLevelReport | null>(null);

    const { data } = useQuery({
        queryKey: ['security-level'],
        queryFn: () => getJail_Security_Level(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJailSecurityLevel(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["security-level"] });
            messageApi.success("Security Level deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Security Level");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
        
        const handleCancel = () => {
            setIsModalOpen(false);
        };

    const dataSource = data?.map((jailsecurity, index) => (
        {
            key: index + 1,
            id: jailsecurity?.id,
            category_name: jailsecurity?.category_name ?? 'N/A',
            description: jailsecurity?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((position) =>
        Object.values(position).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<JailSecurityLevelReport> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Security Level Category',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: JailSecurityLevelReport) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setSecurityLevel(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "SecurityLevel");
        XLSX.writeFile(wb, "SecurityLevel.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Category Name', 'Description']],
            body: dataSource.map(item => [item.key, item.category_name, item.description]),
        });
        doc.save('SecurityLevel.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="SecurityLevel.csv">
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
            printWindow.document.write('<h1>Security Level Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Category Name</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.category_name}</td>
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
                        Add Security Level
                    </button>
                    </div>

                </div>
                <div className="overflow-x-auto">
                    <Table
                    className="h-screen"
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddSecurityLevel onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Detention Building"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditSecurityLevel
                    securitylevel={securityLevel}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default JailSecurityLevel
