import { getVisitor_Type, deleteVisitor_Type, getUser } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, message, Menu, Dropdown } from "antd";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import AddVisitorType from "./AddVisitorType";
import EditVisitorType from "./EditVisitorType";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { ColumnsType } from "antd/es/table";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import bjmp from '../../../assets/Logo/QCJMD.png'

type VisitorTypeRecord = {
    key: number;
    id: number;
    visitor_type: string;
    description: string;
};

const VisitorType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVisitorType, setSelectedVisitorType] = useState<VisitorTypeRecord | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["visitor-type"],
        queryFn: () => getVisitor_Type(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVisitor_Type(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitor-type"] });
            messageApi.success("Visitor Type deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Visitor Type");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
        };
    
        const handleCancel = () => {
        setIsModalOpen(false);
        };

    const dataSource = data?.map((visitor_type, index) => (
        {
        key: index + 1,
        id: visitor_type.id,
        visitor_type: visitor_type?.visitor_type ?? "N/A",
        description: visitor_type?.description ?? "N/A",
        organization: visitor_type?.organization ?? 'Bureau of Jail Management and Penology',
        updated_by: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];

    const filteredData = dataSource?.filter((visitortype) =>
        Object.values(visitortype).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<VisitorTypeRecord> = [
        {
            title: "No.",
            dataIndex: "key", 
            key: "key",
        },
        {
            title: "Visitor Type",
            dataIndex: "visitor_type",
            key: "visitor_type",
        },
        {
            title: "Description",
            dataIndex: "description", 
            key: "description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: VisitorTypeRecord) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedVisitorType(record);
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
        const exportData = dataSource.map(({ id, updated_by, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "VisitorType");
        XLSX.writeFile(wb, "VisitorType.xlsx");
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
            doc.text("Visitor Type Report", 10, 15); 
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
            item.visitor_type,
            item.description,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Visitor Type', 'Description']],
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
                <CSVLink data={dataSource.map(({ id, organization,updated_by, ...rest }) => rest)} filename="VisitorType.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );
    return (
        <div className="h-screen">
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Visitor Type</h1>
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
                        Add Visitor Type
                    </button>
                    </div>
                    
                </div>
            <div className="w-full bg-white">
                <div id="printable-table" className="overflow-auto h-full">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{x: 800}}
                        tableLayout="fixed"
                    />
                </div>
            </div>
            <Modal
                title="Visitor Type Report"
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
                title="Add Visitor Type"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                style={{  overflowY: "auto" }} 
            >
            <AddVisitorType onClose={handleCancel} />
            </Modal>

            <Modal
                title="Edit Visitor Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditVisitorType
                    visitorType={selectedVisitorType}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default VisitorType;