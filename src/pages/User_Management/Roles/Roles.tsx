import { getGroup_Role, deleteGroup_Roles } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import EditRoles from "./EditRoles";
import AddRoles from "./AddRoles";
import { LuSearch } from "react-icons/lu";

type GroupRole = {
    key: number;
    id: number;
    name: string;
};

const Roles = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roles, setRoles] = useState<GroupRole | null>(null);

    const { data } = useQuery({
        queryKey: ["group-role"],
        queryFn: () => getGroup_Role(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteGroup_Roles(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            messageApi.success("Group Roles deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Group Roles");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
        
        const handleCancel = () => {
            setIsModalOpen(false);
        };

    const dataSource = data?.map((role, index) => ({
        key: index + 1,
        id: role.id,
        name: role?.name ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((roles) =>
        Object.values(roles).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<GroupRole> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: GroupRole) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setRoles(record);
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
    ]

    
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Roles");
        XLSX.writeFile(wb, "Roles.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Document Name', 'Description']],
            body: dataSource.map(item => [item.key, item.name, ]),
        });
        doc.save('Roles.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Roles.csv">
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
            printWindow.document.write('<h1>Roles Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Roles</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
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
                        Add Roles
                    </button>
                    </div>
                    
                </div>
            <Table
                columns={columns}
                dataSource={filteredData}
            />
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Group Roles"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="20%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddRoles onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Group Roles"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditRoles
                    role={roles}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Roles
