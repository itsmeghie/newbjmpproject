
import { deleteIssue_Type, getIssueCategories, getIssueType, patchIssue_Type } from "@/lib/queries";
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
import AddIssueType from "./AddIssueType";

type IssueCategory = {
    id: number;
    name: string;
};

type IssueTypes = {
    id: number;
    updated_by: string;
    issue_category: IssueCategory;
    record_status: string;
    updated_at: string; 
    name: string;
    description: string;
};

const IssueType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectIssueType, setSelctedIssueType] = useState<IssueTypes | null>(null);

    const { data } = useQuery({
        queryKey: ['issue-type'],
        queryFn: () => getIssueType(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
            mutationFn: (id: number) => deleteIssue_Type(token ?? "", id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["risk"] });
                messageApi.success("Issue Type deleted successfully");
            },
            onError: (error: any) => {
                messageApi.error(error.message || "Failed to delete Issue Type");
            },
        });

    const { mutate: editIssueType, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: IssueTypes) =>
        patchIssue_Type(token ?? "", updated.id, updated),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["issue-type"] });
        messageApi.success("Issue Type updated successfully");
        setIsEditModalOpen(false);
        },
        onError: () => {
        messageApi.error("Failed to update Issue Type");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["issue-category"],
                queryFn: () => getIssueCategories(token ?? ""),
            },
            ],
        });
        
    const IssueCategoryData = results[0].data;

    const handleEdit = (record: IssueTypes) => {
        setSelctedIssueType(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectIssueType && selectIssueType.id) {
        const updatedRisk: IssueTypes = {
            ...selectIssueType,
            ...values,
        };
        editIssueType(updatedRisk);
        } else {
        messageApi.error("Selected Issue Type is invalid");
        }
    };

    const onIssueTypeChange = (value: string) => {
        setSelctedIssueType(prevForm => ({
            ...prevForm,
            issue_category: value,
        }));
    }; 

    const dataSource = data?.map((issue_type, index) => (
        {
            key: index + 1,
            id: issue_type?.id ?? 'N/A',
            name: issue_type?.name ?? 'N/A',
            description: issue_type?.description ?? 'N/A',
            updated_at: issue_type?.updated_at ?? 'N/A',
            updated_by: issue_type?.updated_by ?? 'N/A',
            issue_category: issue_type?.issue_category?.name ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((issue_type) =>
        Object.values(issue_type).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<IssueTypes> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Issue Type',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Issue Category',
            dataIndex: 'issue_category',
            key: 'issue_category',
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
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "IssueType");
        XLSX.writeFile(wb, "IssueType.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Issue Type Name','Issue Category', 'Description' ]],
            body: dataSource.map(item => [item.key, item.name, item.issue_category, item.description]),
        });
        doc.save('IssueType.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="IssueType.csv">
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
            printWindow.document.write('<h1>Issue Type Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Issue Type</th><th>Issue Category</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
                    <td>${item.issue_category}</td>
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
        <h1 className="text-3xl font-bold text-[#1E365D]">Issue Type</h1>
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
                    placeholder="Search Issue Type..."
                    value={searchText}
                    className="py-2 md:w-64 w-full"
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                    onClick={showModal}
                        >
                    <GoPlus />
                        Add Issue Type
                </button>
            </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
            <Modal
                title="Edit Issue Type"
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
                <Form.Item
                    name="issue_category"
                    label="Issue Category"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Issue Category"
                        optionFilterProp="label"
                        onChange={onIssueTypeChange}
                        options={IssueCategoryData?.map(issue_category => (
                            {
                                value: issue_category.id,
                                label: issue_category?.name
                            }
                        ))}
                    />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Issue Type"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddIssueType onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default IssueType
