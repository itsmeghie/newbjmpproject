import { deleteVisitors, getUser,  getVisitorSpecific, getVisitorSpecificById } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message, Table, Modal, Button, Image, Menu, Dropdown } from "antd"
import Fuse from "fuse.js";
import { useEffect, useState } from "react"
import { ColumnsType } from "antd/es/table"
import { VisitorRecord } from "@/lib/definitions"
import { calculateAge } from "@/functions/calculateAge"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useRef } from "react";
import noimg from '../../../public/noimg.png'
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import html2canvas from 'html2canvas';
import { GoDownload } from "react-icons/go";
import bjmp from '../../assets/Logo/QCJMD.png'
import EditVisitor from "./EditVisitor.tsx/EditVisitor";
import { useNavigate } from "react-router-dom";

type Visitor = VisitorRecord;

interface VisitorProps {
    handlePrintPDF: () => void;
}

const Visitor: React.FC<VisitorProps> = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const queryClient = useQueryClient();
    const token = useTokenStore().token;
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectEditVisitor, setEditSelectedVisitor] = useState<Visitor | null>(null);
    const [visitorVisits, setVisitorVisits] = useState(selectedVisitor?.visits || []);
    const [showAllVisits, setShowAllVisits] = useState(false);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedVisitor?.visits) {
            setVisitorVisits(selectedVisitor.visits);
            }
        }, [selectedVisitor]);

    const { data } = useQuery({
        queryKey: ['visitor'],
        queryFn: async () => {
            try {
                return await getVisitorSpecific(token ?? "");
            } catch (error) {
                console.error("Error fetching visitor data:", error);
                return [];
            }
        },
        retry: false,
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })


    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVisitors(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitors"] });
            messageApi.success("Visitor deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Visitor");
        },
    });

    const leftSideImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Left"
    );
    const ProfileImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Front"
    );
    const RightImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Right"
    );
    const Signature = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === null
    );
    const RightThumb = selectedVisitor?.person?.biometrics?.find(
        (m: any) => m.position === "finger_right_thumb"
    );
    
    const requirements = selectedVisitor?.person?.media_requirements || [];

    const fuse = new Fuse(requirements, {
      keys: ["name"],
      threshold: 0.4,
    });
    
    const waiverResults = fuse.search("waiver");
    
    const waiverData = waiverResults?.[0]?.item || null;
    const CohabitationData = selectedVisitor?.person?.media_requirements?.find(
        (m: any) => m.name?.toLowerCase() === "cohabitation"
    );
    

    const dataSource = data?.map((visitor, index) => ({
        ...visitor,
        key: index + 1,
        visitor_reg_no: visitor?.visitor_reg_no,
        visitor_type: visitor?.visitor_type,
        nationality: visitor?.person?.nationality,
        organization: visitor?.organization ?? 'Bureau of Jail Management and Penology',
        updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];
    
    const filteredData = dataSource?.filter((visitor:any) =>
        Object.values(visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );
    
    const columns: ColumnsType<Visitor> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Visitor No.',
            dataIndex: 'visitor_reg_no',
            key: 'visitor_reg_no',
        },
        {
            title: 'Visitor Name',
            key: 'name',
            render: (_, visitor) => (
                `${visitor?.person?.first_name ?? 'N/A'} ${visitor?.person?.middle_name ?? ''} ${visitor?.person?.last_name ?? 'N/A'}`.trim()
            ),
        },
        {
            title: 'Gender',
            key: 'gender',
            render: (_, visitor) => visitor?.person?.gender?.gender_option ?? 'N/A',
        },
        {
            title: 'Visitor Type',
            dataIndex: 'visitor_type',
            key: 'visitor_type',
        },
        {
            title: 'Approved By',
            dataIndex: 'approved_by',
            key: 'approved_by',
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("update-visitor", {
                                state: { visitor: record },
                            });
                        }}
                    >
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(record.id);
                        }}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        }
        
    ];

    const handleRowClick = async (record: Visitor) => {
        setSelectedVisitor(null); 
        try {
            const visitorDetails = await getVisitorSpecificById(record.id, token);
            setSelectedVisitor(visitorDetails);
        } catch (error) {
            console.error("Error fetching visitor details:", error);
            messageApi.error("Failed to load visitor details.");
        }
    };

    const closeModal = () => {
        setSelectedVisitor(null); 
    };

    const Info = ({ title, info }: { title: string; info: string | null }) => (
        <div className="flex items-center">
            <label className="w-28 text-[10px] text-[#8E8E8E]">{title}</label>
            <p className="mt-1 w-full bg-[#F9F9F9] rounded-md px-2 py-[1px] text-sm">{info || ""}</p>
        </div>
    );

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const headerHeight = 48;
        const footerHeight = 32;
        const organizationName = dataSource[0]?.organization || ""; 
        const PreparedBy = dataSource[0]?.updated || ''; 
    
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const reportReferenceNo = `TAL-${formattedDate}-XXX`;
    
        const maxRowsPerPage = 27; 
    
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
            doc.text("Visitor Report", 10, 15); 
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Organization Name: ${organizationName}`, 10, 25);
            doc.text("Report Date: " + formattedDate, 10, 30);
            doc.text("Prepared By: " + PreparedBy, 10, 35);
            doc.text("Department/ Unit: IT", 10, 40);
            doc.text("Report Reference No.: " + reportReferenceNo, 10, 45);
        };
        
    
        addHeader(); 
    
        const tableData = dataSource.map((item, index) => {
            const fullName = `${item?.person?.first_name ?? 'N/A'} ${item?.person?.middle_name ?? ''} ${item?.person?.last_name ?? 'N/A'}`.trim();
            return [
                index + 1,
                item.visitor_reg_no,
                fullName,
                item.visitor_type,
                item.approved_by,
            ];
        });
        
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Visitor Registration No.', 'Name', 'Visitor Type', 'Approved By']],
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
    
    const handleExportExcel = () => {
        const exportData = dataSource.map(({ id, updated, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visitor");
        XLSX.writeFile(wb, "Visitor.xlsx");
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="Visitors.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );
    
    const handleDownloadPDF = async () => {
        if (!modalContentRef.current) return;
        
            const canvas = await html2canvas(modalContentRef.current, {
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY,
            });
        
            const imgData = canvas.toDataURL("image/png");
        
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
        
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        
            let finalImgHeight = imgHeight;
            let finalImgWidth = imgWidth;
        
            if (imgHeight > pdfHeight) {
            const scaleRatio = pdfHeight / imgHeight;
            finalImgHeight = pdfHeight;
            finalImgWidth = imgWidth * scaleRatio;
            }
        
            const x = (pdfWidth - finalImgWidth) / 2;
            const y = 0; 
        
            pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
            pdf.save('visitor-profile.pdf');
        };
    return (
        <div>
            <div className="h-[90vh] flex flex-col">
                {contextHolder}
                <h1 className="text-3xl font-bold text-[#1E365D]">Visitor</h1>
                <div className="flex my-4 justify-between">
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
                    <div className="md:max-w-64 w-full bg-white pb-2">
                        <input
                        type="text"
                        placeholder="Search visitors..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full p-2 outline-none border bg-gray-100 rounded-md"
                        />
                    </div>
                </div>
                
                <div className="flex-grow overflow-y-auto overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    scroll={{ x: 800, y: 'calc(100vh - 200px)' }} 
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    />
                </div>
                </div>
                <Modal
                title="Visitor Report"
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
                open={selectedVisitor !== null}
                onCancel={closeModal}
                footer={null}
                className="top-0 pt-5"
                width={'45%'}
            >
                {selectedVisitor && (
                    <div  className="flex flex-col items-center justify-center min-h-screen">
                        <div ref={modalContentRef} className="w-full max-w-xl space-y-3">
                            <div className="w-full text-center py-1 bg-[#2F3237] text-[#FFEFEF]">
                                <h1 className="text-xs font-medium">QUEZON CITY JAIL MALE DORM</h1>
                                <h2 className="font-bold">VISITORS CODE IDENTIFICATION</h2>
                            </div>
                            <div className="md:px-3 space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-3">
                                    <div className="space-y-3 w-full flex flex-col">
                                    <div className="border border-[#EAEAEC] rounded-xl p-2 flex shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                                            <div className="bg-[#C4C4C4] w-full h-56 rounded-xl">
                                            {ProfileImage?.media_binary ? (
                                                <img
                                                    src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                    alt="Profile Picture"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                ) : (
                                                    <img
                                                    src={noimg}
                                                    alt="No Image"
                                                    className="w-full h-full object-contain p-5 bg-gray-100 rounded-lg"
                                                    />
                                            )}
                                            </div>
                                        </div>
                                        <div className="border shadow-md shadow-[#8E8E8E]/20 h-fit border-[#EAEAEC] rounded-xl py-2 px-3 overflow-hidden">
                                            <p className="text-[#404958] text-sm">Visitor History</p>
                                            <div className="overflow-y-auto h-full">
                                            
                                                <div>
                                                    <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                        <th className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Date</th>
                                                        <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Duration</th>
                                                        <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Login</th>
                                                        <th className="rounded-r-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Logout</th>
                                                        </tr>
                                                    </thead>
                                                    {selectedVisitor?.visits?.length > 0 && (
                                                    <tbody>
                                                        {(showAllVisits
                                                            ? [...visitorVisits].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                                            : [...visitorVisits]
                                                                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                                                .slice(0, 3)
                                                        ).map((visit, index, arr) => {
                                                            const login = new Date(visit.created_at);
                                                            const logout = arr[index + 1] ? new Date(arr[index + 1].created_at) : new Date(visit.updated_at);
                                                            const durationMs = logout.getTime() - login.getTime();
                                                            const durationMins = Math.floor(durationMs / 60000);
                                                            const hours = Math.floor(durationMins / 60);
                                                            const minutes = durationMins % 60;
                                                            return (
                                                            <tr key={index}>
                                                                <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                {login.toLocaleDateString()}
                                                                </td>
                                                                <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                {`${hours}h ${minutes}m`}
                                                                </td>
                                                                <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                {login.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                </td>
                                                                <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                {logout
                                                                    ? logout.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                                                    : "-"}
                                                                </td>
                                                            </tr>
                                                            );
                                                        })}
                                                        {selectedVisitor.visits.length > 4 && (
                                                            <div className="text-center mt-2">
                                                                <button
                                                                onClick={() => setShowAllVisits(!showAllVisits)}
                                                                className="text-xs text-blue-600 hover:underline"
                                                                >
                                                                {showAllVisits ? "Show Less" : "Show More"}
                                                                </button>
                                                            </div>
                                                        )}
                                                        
                                                        </tbody>
                                                    )}
                                                    </table>
                                                    
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                            <p className="text-[#404958] text-sm">Visitors/Dalaw Basic Info</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                <Info title="Type of Visitor:" info={selectedVisitor?.visitor_type ?? "N/A"} />
                                                <Info title="Surname:" info={selectedVisitor?.person?.last_name || "N/A"}/>
                                                <Info title="First Name:" info={selectedVisitor?.person?.first_name || "N/A"}/>
                                                <Info title="Middle Name:" info={selectedVisitor?.person?.middle_name || "N/A"} />
                                                <Info title="Address:" info={selectedVisitor?.person?.addresses?.[0]
                                                ? `${selectedVisitor?.person.addresses[0].street}, ${selectedVisitor?.person.addresses[0].barangay}, ${selectedVisitor?.person.addresses[0].municipality}, ${selectedVisitor?.person.addresses[0].province}, ${selectedVisitor?.person.addresses[0].region}, ${selectedVisitor?.person.addresses[0].postal_code}`
                                                : "N/A"
                                                } />
                                                <Info title="Gender:" info={selectedVisitor?.person?.gender?.gender_option || "N/A"} />
                                                <Info title="Age:" info={selectedVisitor?.person?.date_of_birth ? String(calculateAge(selectedVisitor?.person.date_of_birth)) : null} />
                                                <Info title="Birthday:" info={selectedVisitor?.person?.date_of_birth || "N/A"} />
                                                <div className="flex items-center">
                                                    <label className="w-48 text-[10px] text-[#8E8E8E]">Relationship to PDL:</label>
                                                    <p className="mt-1 block w-full bg-[#F9F9F9] rounded-md text-xs px-2 py-[1px]">
                                                        {selectedVisitor?.pdls?.[0]?.relationship_to_pdl_str || "No PDL relationship"}
                                                    </p>
                                                </div>
                                                <Info
                                                    title="Requirements:"
                                                    info={
                                                        selectedVisitor?.person?.media_requirements
                                                        ?.map((req: any) => req.name)
                                                        .join(", ") || "N/A"
                                                    }
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                    <div className="w-full flex flex-col">
                                        <div className="flex text-center mb-1">
                                            <div className="flex-grow">
                                                <h1 className="text-[#404958] text-sm">PDL Basic Info</h1>
                                            </div>
                                            <div className="flex-grow">
                                                <h1 className="text-[#404958] text-sm">Cell Assigned</h1>
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-[#2F3237] text-white text-xs">
                                                        <th className="py-1 px-2">PDL NO.</th>
                                                        <th className="py-1 px-2">Surname</th>
                                                        <th className="py-1 px-2">First Name</th>
                                                        <th className="py-1 px-2">Middle Name</th>
                                                        <th className="py-1 px-2">Level</th>
                                                        <th className="py-1 px-2">Annex</th>
                                                        <th className="py-1 px-2">Dorm</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedVisitor?.pdls?.length > 0 ? (
                                                        selectedVisitor.pdls.map((pdlItem, index) => (
                                                        <tr key={index}>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.person.id || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.person.last_name || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.person.first_name || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.person.middle_name || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.cell.cell_name || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.cell.floor?.split("(")[1]?.replace(")", "") || "N/A"}
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                            {pdlItem.pdl.cell.floor || "N/A"}
                                                            </td>
                                                        </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                        <td colSpan={7} className="text-center text-[9px] text-gray-500 py-2">
                                                            No PDL records found.
                                                        </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:mx-3 border border-[#EAEAEC] rounded-xl p-2 flex flex-col space-y-2 shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                                <div className="w-full flex flex-wrap gap-2 text-center"> 
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            {/* Waiver */}
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                    Waiver
                                                </div>
                                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Waiver 1</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {waiverData?.direct_image ? (
                                                        <div className="w-[7.6rem]">
                                                            <Image
                                                            src={`data:image/png;base64,${waiverData.direct_image}`}
                                                            alt="Waiver"
                                                            className="w-full md:w-[7.6rem] h-full object-cover rounded-b-lg"
                                                            />
                                                        </div>
                                                        ) : (
                                                        <img
                                                            className="w-full md:max-w-[7.75rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg"
                                                            src={noimg}
                                                            alt="No Image"
                                                        />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                    Requirement
                                                </div>
                                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Cohabitation</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                        {CohabitationData?.direct_image ? (
                                                            <div>
                                                                <Image
                                                                src={`data:image/png;base64,${CohabitationData.direct_image}`}
                                                                alt="Waiver"
                                                                className="w-full md:max-w-[7.76rem] h-full object-cover rounded-b-lg"
                                                                />
                                                            </div>
                                                            ) : (
                                                            <img className="w-full md:max-w-[7.75rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                Identification Marking
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                                <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Thumbmark</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {RightThumb?.data ? (
                                                            <Image
                                                                src={`data:image/bmp;base64,${RightThumb.data}`}
                                                                alt="Right Thumb"
                                                                className="w-full md:max-w-[7.76rem] h-full object-cover rounded-b-lg"
                                                            />
                                                            ) : (
                                                            <img className="w-full md:max-w-[7.75rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                            )}
                                                    </div>
                                                </div>
                                                <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Signature</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                        {Signature?.media_binary ? (
                                                            <Image
                                                            src={`data:image/bmp;base64,${Signature.media_binary}`}
                                                            alt="Signature"
                                                            className="w-full md:max-w-[7.76rem] h-full object-cover rounded-b-lg"
                                                            />
                                                        ) : (
                                                            <img
                                                            src={noimg}
                                                            alt="No Image"
                                                            className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2 text-center">
                                        <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                        Identification Pictures
                                        </div>
                                        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                                        <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Close Up Front</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                {ProfileImage?.media_binary ? (
                                                        <Image
                                                            src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Full Body Front</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {ProfileImage?.media_binary ? (
                                                        <Image
                                                            src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Left Side</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {leftSideImage?.media_binary ? (
                                                        <Image
                                                            src={`data:image/bmp;base64,${leftSideImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                            <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Side</div>
                                            <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                {RightImage?.media_binary ? (
                                                <Image
                                                    src={`data:image/bmp;base64,${RightImage.media_binary}`}
                                                    alt="Right side"
                                                    className="w-full h-full object-cover rounded-b-lg"
                                                />
                                                ) : (
                                                <img
                                                    src={noimg}
                                                    alt="No Image"
                                                    className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg"
                                                />
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-5 print:hidden">
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 py-1 bg-[#2F3237] text-white rounded-md text-sm"
                            >
                                Print PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                title="Edit Visitor"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width="80%"
            >
                <EditVisitor
                    editvisitor={selectEditVisitor}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Visitor;
