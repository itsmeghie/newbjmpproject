import { deleteReligion, getReligion } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddReligion from "./AddReligion";
import EditReligion from "./EditReligion";

type Religion = {
    id: number;
    name: string;
    description: string;
}

const Religion = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectReligion, setSelectReligion] = useState<Religion | null>(null);

    const { data } = useQuery({
        queryKey: ['religion'],
        queryFn: () => getReligion(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteReligion(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["religion"] });
            messageApi.success("Religion deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Religion");
        },
    });

    const dataSource = data?.map((religion, index) => (
        {
            key: index + 1,
            id: religion?.id ?? 'N/A',
            name: religion?.name ?? 'N/A',
            description: religion?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((religion) =>
        Object.values(religion).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Religion> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Religion',
            dataIndex: 'name',
            key: 'name',
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
            render: (_: any, record: Religion) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="link" onClick={() => {
                    setSelectReligion(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Religion");
        XLSX.writeFile(wb, "Religion.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Religion', 'Description']],
            body: dataSource.map(item => [item.key, item.name, item.description]),
        });
        doc.save('Religion.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Religion.csv">
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
            printWindow.document.write('<h1>Religion Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Religion</th><th>Description</th></tr>');
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Religion</h1>
            <div className="flex justify-between items-center gap-2 my-4">
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
                <div className="flex-1 relative flex items-center justify-end">
                    <input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border border-gray-400 h-10 w-80 rounded-md px-2 active:outline-none focus:outline-none"
                    />
                    <LuSearch className="absolute right-[1%] text-gray-400" />
                </div>
                <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center" onClick={showModal}>
                    <GoPlus />
                    Add Religion
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData}/>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Religion"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddReligion onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Religion"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditReligion
                    religion={selectReligion}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Religion
