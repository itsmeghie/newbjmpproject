import { getID_Type, deleteID_Type } from "@/lib/queries"
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
import AddIDType from "./Addidtype";
import EditIDType from "./EditIDType";

type ID_Types = {
    key: number | null;
    id: number;
    id_type: string;
    description: string;
};

const ID_Types = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [id_Types, setID_Types] = useState<ID_Types | null>(null);

    const { data } = useQuery({
        queryKey: ['id-types'],
        queryFn: () => getID_Type(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteID_Type(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["id-types"] });
            messageApi.success("ID Type deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete ID Type");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
    const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((id_types, index) => (
        {
            key: index + 1,
            id: id_types?.id,
            id_type: id_types?.id_type ?? 'N/A',
            description: id_types?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((id_types) =>
        Object.values(id_types).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<ID_Types> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'ID Type',
            dataIndex: 'id_type',
            key: 'id_type',
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
            render: (_: any, record: ID_Types) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setID_Types(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "IDTypes");
        XLSX.writeFile(wb, "IDTypes.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'ID Types', 'Description']],
            body: dataSource.map(item => [item.key, item.id_type, item.description]),
        });
        doc.save('IDTypes.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="IDTypes.csv">
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
            printWindow.document.write('<h1>ID Type Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>ID Type</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.id_type}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">ID Type</h1>
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
                        Add ID Type
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
                title="Add Visitor Type"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                style={{  overflowY: "auto" }} 
            >
            <AddIDType onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Visitor Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditIDType
                    idtypes={id_Types}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default ID_Types
