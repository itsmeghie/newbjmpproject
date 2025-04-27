import { getDetentionCell, deleteDetentionCell } from "@/lib/queries";
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
import EditCell from "./EditCell";
import AddCell from "./AddCell";

type Cell = {
    key: number;
    id: number;
    cell_no: number;
    cell_name: string;
    floor: number;
    cell_description: string;
};

const Dorm = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectDorm, setSelectDorm] = useState<Cell | null>(null);
    
    const { data } = useQuery({
        queryKey: ["detention-cell"],
        queryFn: () => getDetentionCell(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDetentionCell(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detention-cell"] });
            messageApi.success("Dorm deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Dorm");
        },
    });
        
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((cell, index) => ({
        key: index + 1,
        id: cell?.id,
        floor: cell?.floor,
        cell_no: cell?.cell_no,
        cell_name: cell?.cell_name,
        cell_description: cell?.cell_description,
    })) || [];

    const filteredData = dataSource?.filter((cell) =>
        Object.values(cell).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Cell> = [
        {
            title: "No.",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Floor",
            dataIndex: "floor",
            key: "floor",
        },
        {
            title: "Cell No",
            dataIndex: "cell_no",
            key: "cell_no",
        },
        {
            title: "Cell Name",
            dataIndex: "cell_name",
            key: "cell_name",
        },
        {
            title: "Cell Description",
            dataIndex: "cell_description",
            key: "cell_description",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        icon={<AiOutlineEdit />}
                        onClick={() => {
                            setSelectDorm(record);
                            setIsEditModalOpen(true);
                        }}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<AiOutlineDelete />}
                        onClick={() => deleteMutation.mutate(record.id)}
                    />
                </div>
            ),
        },
    ];

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "detentionCell");
        XLSX.writeFile(wb, "detentionCell.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.','Floor', 'Cell Name', 'Cell No.', 'Cell Description']],
            body: dataSource.map(item => [item.key, item.floor, item.cell_name, item.cell_no, item.cell_description]),
        });
        doc.save('detentionCell.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="detentionCell.csv">
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
            printWindow.document.write('<h1>Detention Cell Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Floor</th><th>Cell No.</th><th>Cell Name</th><th>Cell Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.floor}</td>
                    <td>${item.cell_no}</td>
                    <td>${item.cell_name}</td>
                    <td>${item.cell_description}</td>
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
                        Add Dentention Cell
                    </button>
                </div>
            </div>
            <div className="w-full">
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Detention Cell"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
            >
                <AddCell onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Detention Cell"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditCell
                    cell={selectDorm}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Dorm
