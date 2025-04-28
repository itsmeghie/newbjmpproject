import { getCrimeCategories, getUser } from "@/lib/queries";
import { deleteCrimeCategory, patchCrimeCategory } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddCrimeCategory from "./AddCrimeCategory";
import bjmp from '../../../assets/Logo/QCJMD.png'

type CrimeForm = {
    id: number;
    record_status: string;
    crime_category_name: string;
    description: string;
}

const CrimeCategory = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectCrimeCategory, setSelectedCrimeCategory] = useState<CrimeForm | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['crime-category'],
        queryFn: () => getCrimeCategories(token ?? ""),
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
        mutationFn: (id: number) => deleteCrimeCategory(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crime-category"] });
            messageApi.success("Crime Category deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Crime Category");
        },
    });

    const { mutate: editCrimeCategory, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: CrimeForm) =>
            patchCrimeCategory(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crime-category"] });
            messageApi.success("Crime Category updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Crime Category");
        },
    });

    const handleEdit = (record: CrimeForm) => {
        setSelectedCrimeCategory(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectCrimeCategory && selectCrimeCategory.id) {
            const updatedCrimeCategory: CrimeForm = {
                ...selectCrimeCategory,
                ...values,
            };
            editCrimeCategory(updatedCrimeCategory);
        } else {
            messageApi.error("Selected Crime Category is invalid");
        }
    };
    const dataSource = data?.map((item, index) => ({
        key: index + 1,
        id: item?.id ?? '',
        crime_category_name: item?.crime_category_name ?? '',
        description: item?.description ?? '',
        organization: item?.organization ?? 'Bureau of Jail Management and Penology',
        updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];

    const filteredData = dataSource?.filter((crime_category) =>
        Object.values(crime_category).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<CrimeForm> = [
        {
        title: 'No',
        dataIndex: 'key',
        key: 'key',
        },
        {
        title: 'Crime Category Name',
        dataIndex: 'crime_category_name',
        key: 'crime_category_name',
        },
        {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
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
]

const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CrimeCategory");
    XLSX.writeFile(wb, "CrimeCategory.xlsx");
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

    const maxRowsPerPage = 25; 

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
        doc.text("Crime Category Report", 10, 15); 
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
        item.crime_category_name,
        item.description,
    ]);

    for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
        const pageData = tableData.slice(i, i + maxRowsPerPage);

        autoTable(doc, { 
            head: [['No.', 'Crime Category', 'Description']],
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
            <CSVLink data={dataSource} filename="CrimeCategory.csv">
                Export CSV
            </CSVLink>
        </Menu.Item>
    </Menu>
);

    return (
        <div className="p-4">
            {contextHolder}
            <h1 className="text-2xl font-bold text-[#1E365D]">Crime Category</h1>
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
                        placeholder="Search Crime Category..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Crime Category
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Crime Category Report"
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
                title="Crime Category"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="crime_category_name"
                    label="Crime Category Name"
                    rules={[{ required: true, message: "Please input the Crime Category name" }]}
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
                title="Add Crime Category"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddCrimeCategory onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default CrimeCategory
