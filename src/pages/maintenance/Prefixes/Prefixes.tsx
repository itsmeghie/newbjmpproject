import { deletePrefixes, getPrefixes } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddPrefixes from "./AddPrefixes";
import EditPrefixes from "./EditPrefixes";

export type PrefixesProps = {
    id: number;
    updated_by: string;
    updated_at: string; 
    prefix: string;
    full_title: string;
    description: string;
};

const Prefixes = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [prefixes, setPrefixes] = useState<PrefixesProps | null>(null);

    const { data } = useQuery({
        queryKey: ['prefixes'],
        queryFn: () => getPrefixes(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePrefixes(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prefixes"] });
            messageApi.success("Prefixes deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Prefixes");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((prefixes, index) => (
        {
            key: index + 1,
            id: prefixes?.id ?? 'N/A',
            prefix: prefixes?.prefix ?? 'N/A',
            description: prefixes?.description ?? 'N/A',
            full_title: prefixes?.full_title ?? 'N/A',
            updated_at: prefixes?.updated_at
        ? moment(prefixes.updated_at).format("YYYY-MM-DD hh:mm A")
        : 'N/A',
            updated_by: prefixes?.updated_by ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((prefixes) =>
        Object.values(prefixes).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<PrefixesProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Prefix',
            dataIndex: 'prefix',
            key: 'prefix',
        },
        {
            title: 'Title',
            dataIndex: 'full_title',
            key: 'full_title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
        title: "Actions",
        key: "actions",
        align: "center",
        render: (_: any, record: PrefixesProps) => (
            <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                <Button
                    type="link"
                    onClick={() => {
                        setPrefixes(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Prefixes");
        XLSX.writeFile(wb, "Prefixes.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Prefix','Full Title', 'Description', 'Updated At','Updated By' ]],
            body: dataSource.map(item => [item.key, item.prefix, item.full_title, item.description, item.updated_at,  item.updated_by]),
        });
        doc.save('Prefixes.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Prefixes.csv">
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
            printWindow.document.write('<h1>Prefix Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Prefix</th><th>Full Title</th><th>Description</th><th>Updated At</th><th>Updated By</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.prefix}</td>
                    <td>${item.full_title}</td>
                    <td>${item.description}</td>
                    <td>${item.updated_at}</td>
                    <td>${item.updated_by}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Prefixes</h1>
            <div className="py-4 flex justify-between items-center gap-2">
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
                    className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center" onClick={showModal}
                    >
                    <GoPlus />
                    Add Prefixes
                </button>
                </div>

            </div>
            <Table dataSource={filteredData} columns={columns} />
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Prefix"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddPrefixes onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Prefix"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditPrefixes
                    prefixes={prefixes}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Prefixes
