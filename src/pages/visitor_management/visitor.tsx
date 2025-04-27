import { deleteVisitors, getVisitor_Type, getVisitorSpecific, getVisitorSpecificById } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { message, Table, Modal, Button, Image, Form, Input, Select, Menu, Dropdown } from "antd"
import Fuse from "fuse.js";
import { useState } from "react"
import { ColumnsType } from "antd/es/table"
import { VisitorApplicationPayload, VisitorRecord } from "@/lib/definitions"
import { calculateAge } from "@/functions/calculateAge"
import html2canvas from "html2canvas";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useRef } from "react";
import noimg from '../../../public/noimg.png'
import moment from "moment"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { patchVisitor } from "@/lib/query";
import { GoDownload } from "react-icons/go";

type Visitor = VisitorRecord;

const Visitor = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const queryClient = useQueryClient();
    const token = useTokenStore().token;
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectEditVisitor, setEditSelectedVisitor] = useState<VisitorApplicationPayload | null>(null);

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

    const { mutate: editVisitor, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: VisitorApplicationPayload) =>
            patchVisitor(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitor"] });
            messageApi.success("Visitor updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Visitor");
        },
    });

    const handleEdit = (record: VisitorApplicationPayload) => {
        setEditSelectedVisitor(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectEditVisitor && selectEditVisitor.id) {
            const updatedVisitor: VisitorApplicationPayload = {
                ...selectEditVisitor,
                ...values,
            };
            editVisitor(updatedVisitor);
        } else {
            messageApi.error("Selected Visitor is invalid");
        }
    };

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
    const CohabitationData = waiverResults?.[1]?.item || null;
    
    

    const dataSource = data?.map((visitor, index) => ({
        ...visitor,
        key: index + 1,
    })) || [];
    
    const filteredData = dataSource?.filter((visitor:any) =>
        Object.values(visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const getStatusBadge = (status:any) => {
        switch (status?.toLowerCase()) { 
            case 'verified':
                return { color: 'bg-green-500', text: 'Verified' };
            case 'pending approval':
                return { color: 'bg-yellow-500', text: 'Pending Approval' };
            case 'not verified':
                return { color: 'bg-red-500', text: 'Not Verified' };
            case 'incomplete':
                return { color: 'bg-orange-500', text: 'Incomplete' };
            case 'under review':
                return { color: 'bg-blue-500', text: 'Under Review' };
            case 'rejected':
                return { color: 'bg-gray-500', text: 'Rejected' };
            case 'banned':
                return { color: 'bg-black', text: 'Banned' };
            case 'flagged':
                return { color: 'bg-purple-500', text: 'Flagged' };
            case 'resubmitted required':
                return { color: 'bg-pink-500', text: 'Resubmitted Required' };
            case 'escorted':
                return { color: 'bg-teal-500', text: 'Escorted' };
            case 'pre-registered':
                return { color: 'bg-indigo-500', text: 'Pre-Registered' };
            default:
                return { color: 'bg-gray-300', text: 'Unknown' };
        }
    };
    
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
                            handleEdit(record);
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

    const handlePrintPDF = async () => {
        if (!modalContentRef.current) return;
    
        const canvas = await html2canvas(modalContentRef.current, {
            scale: 2,
            useCORS: true,
        });
    
        const imgData = canvas.toDataURL("image/png");
    
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
    
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Visitor Profile</title>
                    <style>
                        @media print {
                            body, html {
                                margin: 0;
                                padding: 0;
                            }
                            img {
                                width: 100%;
                                height: auto;
                            }
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgData}" onload="window.print(); window.close();" />
                </body>
            </html>
        `);
        printWindow.document.close();
    };
    
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Visitors");
        XLSX.writeFile(wb, "Visitors.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
    
        autoTable(doc, { 
            head: [['No.', 'Visitor Registration No.', 'Visitor Name', 'Visitor Type', 'Approved By']],
            body: dataSource.map(item => [
                item.key,
                item.visitor_reg_no ?? 'N/A',
                `${item.person?.first_name ?? ''} ${item.person?.middle_name ?? ''} ${item.person?.last_name ?? ''}`.trim(),
                item.visitor_type ?? 'N/A',
                item.approved_by ?? 'N/A'
            ]),
        });
    
        doc.save('Visitors.pdf');
    };    

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Visitors.csv">
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
            printWindow.document.write('<h1>Visitor Relationship to PDL Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Visitor Registration No.</th><th>Visitor Name</th><th>Visitor Type</th><th>Approved By</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.visitor_reg_no}</td>
                    <td>${item.person?.first_name} ${item.person?.middle_name} ${item.person?.last_name}</td>
                    <td>${item.visitor_type}</td>
                    <td>${item.approved_by}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const results = useQueries({
        queries: [
            {
                queryKey: ['visitor-type'],
                queryFn: () => getVisitor_Type(token ?? "")
            },
        ]
    });

    const visitorTypeData = results[0].data;
    
    const onVisitorTypeChange = (value: number) => {
        setEditSelectedVisitor(prevForm => ({
            ...prevForm,
            visitor_type_id: value
        }));
    };
    return (
        <div>
            <div className="h-[90vh] flex flex-col">
                {contextHolder}
                <h1 className="text-3xl font-bold text-[#1E365D]">Visitor</h1>
                <div className="flex my-4 justify-between">
                    <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload /> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] px-5 rounded-md text-white">
                    <a onClick={handlePrintReport}>Print Report</a>
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
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Date</th>
                                                            <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Duration</th>
                                                            <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Login</th>
                                                            <th className="rounded-r-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Logout</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                0
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">0
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                0
                                                            </td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">
                                                                0
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
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
                                        <div className="overflow-y-auto h-10">
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
                                                    <tr>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.person.id || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.person.last_name || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.person.first_name || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.person.middle_name || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.cell.cell_name || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl?.cell?.floor?.split("(")[1]?.replace(")", "") || "N/A"}
                                                    </td>
                                                    <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">
                                                        {selectedVisitor?.pdls?.[0]?.pdl.cell.floor || "N/A"}
                                                    </td>
                                                    </tr>
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
                        <div className="flex justify-end ml-auto pr-10 mt-5 print:hidden">
                            <button
                                onClick={handlePrintPDF}
                                className="px-4 py-1 bg-[#2F3237] text-white rounded-md text-sm"
                            >
                                Print PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
    open={isEditModalOpen}
    title="Edit Visitor Information"
    onCancel={() => setIsEditModalOpen(false)}
    onOk={() => form.submit()}
    confirmLoading={isUpdating}
>
    <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
    >
        <Form.Item label="First Name" name={['person', 'first_name']}>
            <Input />
        </Form.Item>
        <Form.Item label="Middle Name" name={['person', 'middle_name']}>
            <Input />
        </Form.Item>
        <Form.Item label="Last Name" name={['person', 'last_name']}>
            <Input />
        </Form.Item>
        <Form.Item label="Visitor Type" name="visitor_type">
            <Select className="h-[3rem] w-full"
                showSearch
                placeholder="Visitor Type"
                optionFilterProp="label"
                onChange={onVisitorTypeChange}
                options={visitorTypeData?.map(visitor_type => ({
                    value: visitor_type.id,
                    label: visitor_type?.visitor_type
                }))}/>
        </Form.Item>
    </Form>
</Modal>

        </div>
    );
};

export default Visitor;
