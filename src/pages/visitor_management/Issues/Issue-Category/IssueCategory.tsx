import { deleteIssue_Category, getIssueCategories, patchIssue_Category } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddIssueCategory from "./AddIssueCategory";

type IssueCategory = {
    id: number;
    updated_by: string;
    updated_at: string; 
    name: string;
    description: string;
};

const IssueCategory = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectIssueCategory, setSelctedIssueCategory] = useState<IssueCategory | null>(null);

    const { data } = useQuery({
        queryKey: ['issue-categories'],
        queryFn: () => getIssueCategories(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteIssue_Category(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issue-category"] });
            messageApi.success("Issue Category deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Issue Category");
        },
    });

const { mutate: editIssueCategory, isLoading: isUpdating } = useMutation({
    mutationFn: (updated: IssueCategory) =>
    patchIssue_Category(token ?? "", updated.id, updated),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["issue-category"] });
    messageApi.success("Issue Category updated successfully");
    setIsEditModalOpen(false);
    },
    onError: () => {
    messageApi.error("Failed to update Issue Category");
    },
});

const handleEdit = (record: IssueCategory) => {
    setSelctedIssueCategory(record);
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
};

const handleUpdate = (values: any) => {
    if (selectIssueCategory && selectIssueCategory.id) {
    const updatedRisk: IssueCategory = {
        ...selectIssueCategory,
        ...values,
    };
    editIssueCategory(updatedRisk);
    } else {
    messageApi.error("Selected Issue Type is invalid");
    }
};

    const dataSource = data?.map((issue_category, index) => (
        {
            key: index + 1,
            id: issue_category?.id ?? 'N/A',
            name: issue_category?.name ?? 'N/A',
            description: issue_category?.description ?? 'N/A',
            updated_at: issue_category?.updated_at ?? 'N/A',
            updated_by: issue_category?.updated_by ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((issue_category) =>
        Object.values(issue_category).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<IssueCategory> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Issue Category',
            dataIndex: 'name',
            key: 'name',
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
            render: (value) => moment(value).format("MMMM D, YYYY h:mm A"),
        },
        {
            title: 'Update By',
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
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "IssueCategory");
        XLSX.writeFile(wb, "IssueCategory.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Device Type','Device Name', 'Manufacturer', 'Supplier','Jail' ]],
            body: dataSource.map(item => [item.key, item.name, item.description]),
        });
        doc.save('IssueCategory.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="IssueCategory.csv">
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
            printWindow.document.write('<h1>Issue Category Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Issue Category</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };
    return (
        <div>
        {contextHolder}
        <h1 className="text-3xl font-bold text-[#1E365D]">Issue Category</h1>
        <div className="flex items-center justify-between my-4">
                <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload/> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white">
                    <a onClick={handlePrintReport}>Print Report</a>
                    </button>
                    </div>
            <div className="flex gap-2 items-center">
                <Input
                    placeholder="Search Issue Category..."
                    value={searchText}
                    className="py-2 md:w-64 w-full"
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                    onClick={showModal}
                        >
                    <GoPlus />
                        Add Issue Category
                </button>
            </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
            <Modal
                title="Edit Issue Category"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Issue Type Name"
                    rules={[{ required: true, message: "Please input the issue type name" }]}
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
                title="Add Issue Category"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
            <AddIssueCategory onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default IssueCategory
