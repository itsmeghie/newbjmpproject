import { getDetentionCell, deleteDetentionCell, getUser } from "@/lib/queries";
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
import bjmp from '../../../assets/Logo/QCJMD.png'

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
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    
    const { data } = useQuery({
        queryKey: ["detention-cell"],
        queryFn: () => getDetentionCell(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

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
        organization: cell?.organization ?? 'Bureau of Jail Management and Penology',
        updated_by: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
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
        const exportData = dataSource.map(({ id, updated_by, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dorm");
        XLSX.writeFile(wb, "Dorm.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const headerHeight = 48;
        const footerHeight = 32;
        const organizationName = dataSource[0]?.organization || ""; 
        const PreparedBy = dataSource[0]?.updated_by || ''; 
    
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const reportReferenceNo = `TAL-${formattedDate}-XXX`;
    
        const maxRowsPerPage = 29; 
    
        let startY = headerHeight;
    
        const addHeader = () => {
            const pageWidth = doc.internal.pageSize.getWidth(); 
            const imageWidth = 30;
            const imageHeight = 30; 
            const margin = 10; 
            const imageX = pageWidth - imageWidth - margin;
            const imageY = 12;
        
            doc.addImage(bjmp, 'PNG', imageX, imageY, imageWidth, imageHeight);
        
            doc.setTextColor(0, 102, 204);
            doc.setFontSize(16);
            doc.text("Dorm Report", 10, 15); 
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Organization Name: ${organizationName}`, 10, 25);
            doc.text("Report Date: " + formattedDate, 10, 30);
            doc.text("Prepared By: " + PreparedBy, 10, 35);
            doc.text("Department/ Unit: IT", 10, 40);
            doc.text("Report Reference No.: " + reportReferenceNo, 10, 45);
        };
        
    
        addHeader(); 
    
        const tableData = dataSource.map(item => [
            item.key,
            item.cell_no,
            item.cell_name,
            item.floor,
            item.cell_description
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.','Cell No.', 'Cell', 'Floor', 'Description']],
                body: pageData,
                startY: startY,
                margin: { top: 0, left: 10, right: 10 },
                didDrawPage: function (data) {
                    if (doc.internal.getCurrentPageInfo().pageNumber > 1) {
                        addHeader(); 
                    }
                },
            });
    
            if (i + maxRowsPerPage < tableData.length) {
                doc.addPage();
                startY = headerHeight;
            }
        }
    
        const pageCount = doc.internal.getNumberOfPages();
        for (let page = 1; page <= pageCount; page++) {
            doc.setPage(page);
            const footerText = [
                "Document Version: Version 1.0",
                "Confidentiality Level: Internal use only",
                "Contact Info: " + PreparedBy,
                `Timestamp of Last Update: ${formattedDate}`
            ].join('\n');
            const footerX = 10;
            const footerY = doc.internal.pageSize.height - footerHeight + 15;
            const pageX = doc.internal.pageSize.width - doc.getTextWidth(`${page} / ${pageCount}`) - 10;
            doc.setFontSize(8);
            doc.text(footerText, footerX, footerY);
            doc.text(`${page} / ${pageCount}`, pageX, footerY);
        }
    
        const pdfOutput = doc.output('datauristring');
        setPdfDataUrl(pdfOutput);
        setIsPdfModalOpen(true);
    };

    const handleClosePdfModal = () => {
        setIsPdfModalOpen(false);
        setPdfDataUrl(null); 
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource.map(({ id, organization,updated_by, ...rest }) => rest)} filename="Dorm.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );
    
    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Dorm</h1>
            <div className="my-4 flex justify-between gap-2">
            <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                            <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                                <GoDownload /> Export
                            </a>
                        </Dropdown>
                        <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white" onClick={handleExportPDF}>
                            Print Report
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
                        Add Dorm
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
                title="Dorm Report"
                open={isPdfModalOpen}
                onCancel={handleClosePdfModal}
                footer={null}
                width="80%"
            >
                {pdfDataUrl && (
                    <iframe
                        src={pdfDataUrl}
                        title="PDF Preview"
                        style={{ width: '100%', height: '80vh', border: 'none' }}
                    />
                )}
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Dorm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
            >
                <AddCell onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Dorm"
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
