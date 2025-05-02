import { deleteRecommendedAction, getRecommendedActions, getRisks, getUser, patchRecommendedAction } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddRecommededAction from "./AddRecommededAction";
import bjmp from '../../../../assets/Logo/QCJMD.png'


type RecommendedActionProps = {
    id: number;
    updated_by: string;
    updated_at: string; 
    name: string;
    description: string;
    risk: number,
};

const RecommendedAction = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectRecommended, setSelectedRecommended] = useState<RecommendedActionProps | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['recommended-action'],
        queryFn: () => getRecommendedActions(token ?? ""),
    })

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
        mutationFn: (id: number) => deleteRecommendedAction(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recommended-action"] });
            messageApi.success("Recommeded Action deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Recommeded Action");
        },
    });

    const { mutate: editRecommendedAction, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: RecommendedActionProps) =>
        patchRecommendedAction(token ?? "", updated.id, updated),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recommended-action"] });
        messageApi.success("Recommended Action updated successfully");
        setIsEditModalOpen(false);
        },
        onError: () => {
        messageApi.error("Failed to update Recommended Action");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["risk"],
                queryFn: () => getRisks(token ?? ""),
            },
            ],
        });
        
    const RiskData = results[0].data;

    const handleEdit = (record: RecommendedActionProps) => {
        setSelectedRecommended(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectRecommended && selectRecommended.id) {
        const updatedRisk: RecommendedActionProps = {
            ...selectRecommended,
            ...values,
        };
        editRecommendedAction(updatedRisk);
        } else {
        messageApi.error("Selected Recommended Action is invalid");
        }
    };

    const onRiskChange = (value: number) => {
        setSelectedRecommended(prevForm => ({
            ...prevForm,
            risk: value,
        }));
    }; 

    const dataSource = data?.map((recommeded, index) => (
        {
            key: index + 1,
            id: recommeded?.id ?? 'N/A',
            name: recommeded?.name ?? 'N/A',
            description: recommeded?.description ?? 'N/A',
            updated_at: recommeded?.updated_at ?? 'N/A',
            updated_by: recommeded?.updated_by ?? 'N/A',
            risk: recommeded?.risk ?? 'N/A',
            organization: recommeded?.organization ?? 'Bureau of Jail Management and Penology',
            updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
        }
    )) || [];

    const filteredData = dataSource?.filter((recommeded_action) =>
        Object.values(recommeded_action).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<RecommendedActionProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Recommeded Action',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Risk',
            dataIndex: 'risk',
            key: 'risk',
        },
    {
        title: "Updated At",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (value) => moment(value).format("MMMM D, YYYY h:mm A"),
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
    ]

    const handleExportExcel = () => {
        const exportData = dataSource.map(({ id, updated, organization, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RecommendedAction");
        XLSX.writeFile(wb, "RecommendedAction.xlsx");
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
            doc.text("Recommended Action Report", 10, 15); 
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
            item.risk,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Recommended Action','Risk']],
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
                <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="RecommendedAction.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
        {contextHolder}
        <h1 className="text-3xl font-bold text-[#1E365D]">Recommended Action</h1>
        <div className="flex my-4 items-center justify-between mb-2">
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
                    placeholder="Search Recommeded Action..."
                    value={searchText}
                    className="py-2 md:w-64 w-full"
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                    onClick={showModal}
                        >
                    <GoPlus />
                        Add Recommeded Action
                </button>
            </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
        <Modal
                title="Recommended Action Report"
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
                title="Edit Recommeded Action"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Recommeded Action Name"
                    rules={[{ required: true, message: "Please input the Recommeded Action name" }]}
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
                    name="risk"
                    label="Risk"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Risk"
                        optionFilterProp="label"
                        onChange={onRiskChange}
                        options={RiskData?.map(risk => (
                            {
                                value: risk.id,
                                label: risk?.name
                            }
                        ))}
                    />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Recommeded Action"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddRecommededAction onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default RecommendedAction
