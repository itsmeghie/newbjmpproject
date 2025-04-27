import { Look } from "@/lib/definitions"
import { deleteLook, getLook } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { LuSearch } from "react-icons/lu";
import { MdOutlineFileOpen } from "react-icons/md";
import AddLook from "./AddLook";
import EditLook from "./EditLook";

type LookProps = {
    id: number;
    updated_at: string;
    name: string;
    description: string;
    updated_by: number | null;
};

const Looks = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [look, setLook] = useState< LookProps | null>(null);
    
    const { data } = useQuery({
        queryKey: ['look'],
        queryFn: () => getLook(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLook(token ?? "", id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["look"] });
        messageApi.success("Look deleted successfully");
    },
    onError: (error: any) => {
        messageApi.error(error.message || "Failed to delete Look");
    },
    });

    const dataSource = data?.map((look, index) => (
        {
            key: index + 1,
            id: look?.id ?? 'N/A',
            name: look?.name ?? 'N/A',
            description: look?.description ?? 'N/A',
            updated_by: look?.updated_by ?? 'N/A',
            updated_at: look?.updated_at ?? 'N/A'
        }
    )) || [];

    const filteredData = dataSource?.filter((look) =>
        Object.values(look).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );
    const columns: ColumnsType<LookProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Look',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
        title: 'Last Updated by',
        dataIndex: 'updated_by',
        key: 'updated_by',
        },
        {
        title: "Actions",
        key: "actions",
        render: (_: any, record: LookProps) => (
            <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                <Button type="link" onClick={() => {
                        setLook(record);
                        setIsEditModalOpen(true);
                        }}>
                    <AiOutlineEdit />
                </Button>
                <Button type="link" danger onClick={() => deleteMutation.mutate(record.id)}>
                    <AiOutlineDelete />
                </Button>
            </div>
        ),
    },
    ]
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Look");
        XLSX.writeFile(wb, "Look.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Look', 'Description' ]],
            body: dataSource.map(item => [item.key, item.name, item.description]),
        });
        doc.save('Look.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Look.csv">
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
            printWindow.document.write('<h1>Look Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Look</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
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
        <h1 className="text-3xl font-bold text-[#1E365D]">Look</h1>
        <div className="flex gap-2 flex-col mt-2">
            <div className="flex justify-between items-center">
            <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload/> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white">
                    <a onClick={handlePrintReport}>Print Report</a>
                    </button>
                    </div>
            <div className="flex gap-2 items-center">
                <div className="flex-1 relative flex items-center justify-end">
                    <input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border border-gray-400 h-10 w-80 rounded-md px-2 active:outline-none focus:outline-none"
                    />
                    <LuSearch className="absolute right-[1%] text-gray-400" />
                </div>
                <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center text-sm md:text-[16px] justify-center" onClick={showModal}>
                <GoPlus />
                Add Look
                </button>
            </div>
            </div>
            <div>
            <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
            className="rounded-lg scrollbar-hide"
            title="Add Look"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
                width="30%"
            >
                <AddLook onClose={handleCancel}/>
            </Modal>
            <Modal
                title="Edit Look"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditLook
                    look={look}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
        </div>
    )
}

export default Looks
