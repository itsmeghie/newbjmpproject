import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJail, deleteJail, getUser } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddJailFacility from "./AddJailFacility";
import EditJail from "./EditJail";
import bjmp from '../../../assets/Logo/QCJMD.png'

type Jail = {
    key: number;
    id: number;
    jail_name: string;
    jail_type: string;
    jail_category: string;
    email_address: string;
    contact_number: string;
    jail_province: string;
    jail_city_municipality: string;
    jail_barangay: string;
    jail_region: string;
    jail_postal_code: string;
    jail_street: string;
    security_level: string;
    jail_description: string;
    record_status: string;
};

const jailfacility = () => {
    const [searchText, setSearchText] = useState("");
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useTokenStore().token;
    const [selectjail, setSelectJail] = useState<Jail | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["jail"],
        queryFn: () => getJail(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJail(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jail"] });
            messageApi.success("Jail Facility deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Jail Facility");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((jail: Jail, index: any) => ({
        key: index + 1,
        id: jail?.id,
        jail_name: jail?.jail_name ?? "N/A",
        jail_type: jail?.jail_type ?? "N/A",
        jail_category: jail?.jail_category ?? "N/A",
        email_address: jail?.email_address ?? "N/A",
        contact_number: jail?.contact_number ?? "N/A",
        jail_province: jail?.jail_province ?? "N/A",
        jail_city_municipality: jail?.jail_city_municipality ?? "N/A",
        jail_barangay: jail?.jail_barangay ?? "N/A",
        jail_region: jail?.jail_region ?? "N/A",
        jail_postal_code: jail?.jail_postal_code ?? "N/A",
        jail_street: jail?.jail_street ?? "N/A",
        security_level: jail?.security_level ?? "N/A",
        jail_description: jail?.jail_description ?? "N/A",
        record_status: jail?.record_status ?? "N/A",
        organization: jail?.organization ?? 'Bureau of Jail Management and Penology',
        updated_by: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];

    const filteredData = dataSource?.filter((jail:any) =>
        Object.values(jail).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns = [
        {
            title: "No.",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Jail Name",
            dataIndex: "jail_name",
            key: "jail_name",
        },
        {
            title: "Jail Type",
            dataIndex: "jail_type",
            key: "jail_type",
        },
        {
            title: "Jail Category",
            dataIndex: "jail_category",
            key: "jail_category",
        },
        {
            title: "Email Address",
            dataIndex: "email_address",
            key: "email_address",
        },
        {
            title: "Contact Number",
            dataIndex: "contact_number",
            key: "contact_number",
        },
        {
            title: "Province",
            dataIndex: "jail_province",
            key: "jail_province",
        },
        {
            title: "City/Municipality",
            dataIndex: "jail_city_municipality",
            key: "jail_city_municipality",
        },
        {
            title: "Barangay",
            dataIndex: "jail_barangay",
            key: "jail_barangay",
        },
        {
            title: "Region",
            dataIndex: "jail_region",
            key: "jail_region",
        },
        {
            title: "Postal Code",
            dataIndex: "jail_postal_code",
            key: "jail_postal_code",
        },
        {
            title: "Street",
            dataIndex: "jail_street",
            key: "jail_street",
        },
        {
            title: "Security Level",
            dataIndex: "security_level",
            key: "security_level",
        },
        {
            title: "Description",
            dataIndex: "jail_description",
            key: "jail_description",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Jail) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectJail(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <AiOutlineEdit/>
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
        XLSX.utils.book_append_sheet(wb, ws, "JailFacility");
        XLSX.writeFile(wb, "JailFacility.xlsx");
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
            doc.text("Employment Type Report", 10, 15); 
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Organization Name: ${organizationName}`, 10, 25);
            doc.text("Report Date: " + formattedDate, 10, 30);
            doc.text("Prepared By: " + PreparedBy, 10, 35);
            doc.text("Department/ Unit: IT", 10, 40);
            doc.text("Report Reference No.: " + reportReferenceNo, 10, 45);
        };
        
    
        addHeader(); 
    
        const tableData = dataSource.map((item: { key: any; jail_name: any; email_address: any; contact_number: any;}) => [
            item.key,
            item.jail_name,
            item.email_address,
            item.contact_number,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Jail', 'Email', 'Contact No.']],
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
                <CSVLink data={dataSource} filename="JailFacility.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Jail Facility</h1>
            <div className="my-5 flex justify-between">
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
                        Add Jail Facility
                    </button>
                </div>
                </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                scroll={{x: 800}}
            />
                        <Modal
                title="Jail Facility Report"
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
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
            >
                <AddJailFacility onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Jail Facility"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditJail
                    jail={selectjail}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default jailfacility
