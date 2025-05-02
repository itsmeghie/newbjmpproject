import { Button, Dropdown, Form, Input, Menu, message, Modal, Table } from "antd"
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { GoDownload, GoPlus } from "react-icons/go";
import AddCourt from "./AddCourt";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCourt, getCourt, getUser } from "@/lib/queries";
import { patchCourt } from "@/lib/query";
import moment from "moment";
import { ColumnType } from "antd/es/table";
import bjmp from '../../../assets/Logo/QCJMD.png'

type EditCourt = {
    id: number
    court: string;
    description: string;
    code: string;
    jurisdiction: string;
    example_offenses: string;
    relevance_to_pdl: string;
    court_level: string;
};

const Court = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectEditCourt, setSelectedEditCourt] = useState<EditCourt>({
        id: 0,
        court: '',
        description: '',
        code: '',
        jurisdiction: '',
        example_offenses: '',
        relevance_to_pdl: '',
        court_level: '',
    })
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['court'],
        queryFn: () => getCourt(token ?? ""),
    })

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCourt(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court"] });
            messageApi.success("Court deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Court");
        },
    });

    const { mutate: editCourt, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: EditCourt) =>
            patchCourt(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court"] });
            messageApi.success("Court updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Court");
        },
    });

    const handleEdit = (record: EditCourt) => {
        setSelectedEditCourt(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectEditCourt && selectEditCourt.id) {
            const updateCourt: EditCourt = {
                ...selectEditCourt,
                ...values,
            };
            editCourt(updateCourt);
        } else {
            messageApi.error("Selected Court is invalid");
        }
    };
    const dataSource = data?.map((court, index) => (
        {
            key: index + 1,
            id: court?.id ?? 'N/A',
            court: court?.court ?? 'N/A',
            description: court?.description ?? 'N/A',
            updated_by: court?.updated_by ?? 'N/A',
            updated_at: moment(court?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
            organization: court?.organization ?? 'Bureau of Jail Management and Penology',
            updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
        }
    )) || [];

    const filteredData = dataSource?.filter((court) =>
        Object.values(court).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnType<EditCourt> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Court',
            dataIndex: 'court',
            key: 'court',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Last Updated',
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
            fixed: "right",
            render: (_: any, record: EditCourt) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                        <Button type="link" onClick={() => handleEdit(record)}>
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
        const exportData = dataSource.map(({ id, updated, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Court");
        XLSX.writeFile(wb, "Court.xlsx");
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
            doc.text("Judicial Court Report", 10, 15); 
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
            item.court,
            item.description,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Court', 'Description']],
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
                <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="Court.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Judicial Court</h1>
            <div className="flex justify-between items-center gap-2 my-4">
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
                <div>
                    <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center" onClick={showModal}>
                    <GoPlus />
                    Add Judicial Court
                </button>
                </div>
                
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                scroll={{ x: "max-content" }}
            />
            <Modal
                title="Judicial Court Report"
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
                title="Add Judicial Court"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                >
                <AddCourt onClose={handleCancel}/>
            </Modal>
            <Modal
                title="Judicial Court"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="court"
                    label="Judicial Court Name"
                    rules={[{ required: true, message: "Please input the Judicial Court name" }]}
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
        </div>
    )
}

export default Court
