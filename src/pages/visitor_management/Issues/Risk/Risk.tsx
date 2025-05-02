import { RiskProps } from "@/lib/definitions";
import { deleteRisk, getRiskLevels, getRisks, getUser, patchRisk } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useQueryClient, useMutation, useQueries } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Form, Input, Menu, Modal, Select, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import { GoDownload, GoPlus } from "react-icons/go";
import AddRisk from "./AddRisk";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import bjmp from '../../../../assets/Logo/QCJMD.png'


const Risk = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<RiskProps | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["risk"],
        queryFn: () => getRisks(token ?? ""),
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
            mutationFn: (id: number) => deleteRisk(token ?? "", id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["risk"] });
                messageApi.success("Risk deleted successfully");
            },
            onError: (error: any) => {
                messageApi.error(error.message || "Failed to delete Risk");
            },
        });

    const { mutate: editRisk, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: RiskProps) =>
        patchRisk(token ?? "", updated.id, updated),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["risk"] });
        messageApi.success("Risk updated successfully");
        setIsEditModalOpen(false);
        },
        onError: () => {
        messageApi.error("Failed to update risk");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["risk-level"],
                queryFn: () => getRiskLevels(token ?? ""),
            },
            ],
        });
        
    const riskLevelData = results[0].data;

    const handleEdit = (record: RiskProps) => {
        setSelectedRisk(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectedRisk && selectedRisk.id) {
        const updatedRisk: RiskProps = {
            ...selectedRisk,
            ...values,
        };
        editRisk(updatedRisk);
        } else {
        messageApi.error("Selected risk is invalid");
        }
    };

    const onRiskLevelChange = (value: number) => {
        setSelectedRisk(prevForm => ({
            ...prevForm,
            risk_level: value,
        }));
    }; 

    const dataSource =
        data?.map((risk, index) => ({
        key: index + 1,
        ...risk,
        organization: risk?.organization ?? 'Bureau of Jail Management and Penology',
        updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
        })) || [];

    const filteredData = dataSource.filter((item) =>
        Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

const columns: ColumnsType<RiskProps & { key: number }> = [
    { title: "No.", dataIndex: "key", key: "key" },
    { title: "Risk", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
        title: "Updated At",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (value) => moment(value).format("MMMM D, YYYY h:mm A"),
    },

    { title: "Updated By", dataIndex: "updated_by", key: "updated_by" },
    { title: "Risk Level", dataIndex: "risk_level", key: "risk_level" },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <div>
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
    XLSX.utils.book_append_sheet(wb, ws, "Risk");
    XLSX.writeFile(wb, "Risk.xlsx");
};

const handleExportPDF = () => {
    const doc = new jsPDF();
    const headerHeight = 48;
    const footerHeight = 32;
    const organizationName = dataSource[0]?.organization || ""; 
    const PreparedBy = dataSource[0]?.updated || ''; 

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
        doc.text("Risk Report", 10, 15); 
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
        item.name,
        item.risk_level,
    ]);

    for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
        const pageData = tableData.slice(i, i + maxRowsPerPage);

        autoTable(doc, { 
            head: [['No.', 'Risk', 'Risk Level']],
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
            <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="Risk.csv">
                Export CSV
            </CSVLink>
        </Menu.Item>
    </Menu>
);

    return (
        <div>
        {contextHolder}
        <h1 className="text-2xl font-bold text-[#1E365D]">Risk</h1>
        <div className="flex items-center justify-between my-4">
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
                    placeholder="Search risk..."
                    value={searchText}
                    className="py-2 md:w-64 w-full"
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                    onClick={showModal}
                        >
                    <GoPlus />
                        Add Risk
                </button>
            </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
        <Modal
                title="Risk Report"
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
                title="Edit Risk"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Risk Name"
                    rules={[{ required: true, message: "Please input the risk name" }]}
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
                <Form.Item
                    name="risk_level"
                    label="Risk Level"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Risk Level"
                        optionFilterProp="label"
                        onChange={onRiskLevelChange}
                        options={riskLevelData?.map(risklevel => (
                            {
                                value: risklevel.id,
                                label: risklevel?.name
                            }
                        ))}
                    />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Risk"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddRisk onClose={handleCancel} />
            </Modal>
        </div>
    );
};

export default Risk;
