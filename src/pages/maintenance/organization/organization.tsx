import { deleteOrganization, getOrganization } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message,Modal,Table } from "antd"
import { useState } from "react"
import { GoDownload, GoPlus } from "react-icons/go"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { ColumnsType } from "antd/es/table"
import { LuSearch } from "react-icons/lu";
import AddOrganization from "./AddOrganization";
import EditOrganization from "./editorganization";

type Organization = {
    id: number;
    org_code: string;
    org_name: string;
    org_type: number;
    org_level: number;
}

const Organization = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [organization, setOrganization] = useState<Organization | null>(null);

    const { data } = useQuery({
        queryKey: ['organization'],
        queryFn: () => getOrganization(token ?? ""),
    })

        const deleteMutation = useMutation({
            mutationFn: (id: number) => deleteOrganization(token ?? "", id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["organization"] });
                messageApi.success("Organization deleted successfully");
            },
            onError: (error: any) => {
                messageApi.error(error.message || "Failed to delete Organization");
            },
        });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((organization, index) => (
        {
            key: index + 1,
            id: organization?.id ?? 'N/A',
            org_code: organization?.org_code ?? 'N/A',
            org_name: organization?.org_name ?? 'N/A',
            org_type: organization?.org_type ?? 'N/A',
            org_level: organization?.org_level ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((organization) =>
        Object.values(organization).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Organization> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Organization Code',
            dataIndex: 'org_code',
            key: 'org_code',
        },
        {
            title: 'Organization Name',
            dataIndex: 'org_name',
            key: 'org_name',
        },
        {
            title: 'Organization Type',
            dataIndex: 'org_type',
            key: 'org_type',
        },
        {
            title: 'Organization Level',
            dataIndex: 'org_level',
            key: 'org_level',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: Organization) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setOrganization(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Organization");
        XLSX.writeFile(wb, "Organization.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Organization Code', 'Organization Name', 'Organization Type', 'Organization Level']],
            body: dataSource.map(item => [item.key, item.org_code, item.org_name, item.org_type, item.org_level]),
        });
        doc.save('Organization.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Organization.csv">
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
            printWindow.document.write('<h1>Organization Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Organization Code</th><th>Organization Name</th><th>Organizational Level</th><th>Organizational Type</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.org_code}</td>
                    <td>${item.org_name}</td>
                    <td>${item.org_level}</td>
                    <td>${item.org_type}</td>
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
                        Add Organization
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
                title="Add Organization"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddOrganization onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Organization"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditOrganization
                    organization={organization}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Organization
