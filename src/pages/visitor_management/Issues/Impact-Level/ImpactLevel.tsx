import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal,Table,} from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import moment from "moment";
import { GoDownload, GoPlus } from "react-icons/go";
import { deleteImpactLevel, getImpactLevels, getUser, patchImpactLevel } from "@/lib/queries";
import AddImpactLevel from "./AddImpactLevel";
import bjmp from '../../../../assets/Logo/QCJMD.png'

export type ImpactLevelProps = {
    id: number;
    updated_at: string;
    impact_level: string;
    description: string;
    updated_by: number;
};

const ImpactLevel = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectImpactLevel, setSelctedImpactLevel] = useState<ImpactLevelProps | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['impact-level'],
        queryFn: () => getImpactLevels(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteImpactLevel(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["impact-level"] });
            messageApi.success("Impact Level deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Impact Level");
        },
    });

    const { mutate: editImpact, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: ImpactLevelProps) =>
            patchImpactLevel(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["impact-level"] });
            messageApi.success("Impact Level updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Impact Level");
        },
    });

    const handleEdit = (record: ImpactLevelProps) => {
        setSelctedImpactLevel(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectImpactLevel && selectImpactLevel.id) {
            const updatedImpact: ImpactLevelProps = {
                ...selectImpactLevel,
                ...values,
            };
            editImpact(updatedImpact);
        } else {
            messageApi.error("Selected Impact Level is invalid");
        }
    };

    const dataSource = data?.map((impact_level, index) => ({
        key: index + 1,
        id: impact_level?.id ?? 'N/A',
        impact_level: impact_level?.impact_level ?? 'N/A',
        description: impact_level?.description ?? 'N/A',
        updated_at: impact_level?.updated_at ?? 'N/A',
        updated_by: impact_level?.updated_by ?? 'N/A',
        organization: impact_level?.organization ?? 'Bureau of Jail Management and Penology',
        updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];

    const filteredData = searchText
        ? dataSource.filter((impact_level) =>
            Object.values(impact_level).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        )
        : dataSource;

    const columns: ColumnsType<typeof dataSource[number]> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Impact Level',
            dataIndex: 'impact_level',
            key: 'impact_level',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Updated At",
            dataIndex: "updated_at",
            key: "updated_at",
            render: (value) =>
                value !== 'N/A' ? moment(value).format("MMMM D, YYYY h:mm A") : "N/A",
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button type="link" onClick={() => handleEdit(record)}>
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
        const exportData = dataSource.map(({ id, updated, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ImpactLevel");
        XLSX.writeFile(wb, "ImpactLevel.xlsx");
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
    
        const maxRowsPerPage = 28; 
    
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
            doc.text("Impact Level Report", 10, 15); 
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
            item.impact_level,
            item.description,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Impact Level', 'Description']],
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
                <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="ImpactLevel.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="p-4">
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Impact Level</h1>
            <div className="my-4 flex items-center justify-between mb-2">
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
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Search Impact Level..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Impact Level
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Impact Level Report"
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
                title="Impact Level"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="impact_level"
                    label="Impact Level Name"
                    rules={[{ required: true, message: "Please input the Impact Level name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input a description" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Impact Level"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
            <AddImpactLevel onClose={handleCancel} />
            </Modal>
        </div>
    );
};

export default ImpactLevel;
