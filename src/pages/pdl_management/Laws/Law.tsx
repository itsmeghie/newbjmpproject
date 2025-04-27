import { getCrimeCategories, getLaws, getRecord_Status } from "@/lib/queries";
import { deleteLaw, patchLaw } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddLaw from "./AddLaw";

type LawForm = {
    id: number;                 
    crime_category: string; 
    record_status: string;  
    name: string;           
    title: string;          
    description: string; 
    crime_category_id: number;
    record_status_id: number;
};

const Law = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [ selectLaw, setSelectedLaw ] = useState<LawForm>({
        id: 0,
        crime_category: '',
        record_status: '',

        name: '',
        title: '',
        description: '',
        crime_category_id: 0,
        record_status_id: 0,
        })

    const { data } = useQuery({
        queryKey: ['law'],
        queryFn: () => getLaws(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteLaw(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["law"] });
            messageApi.success("Law deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Law");
        },
    });

    const { mutate: editLaw, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: LawForm) =>
            patchLaw(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["law"] });
            messageApi.success("Law updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Law");
        },
    });

    const handleEdit = (record: LawForm) => {
        setSelectedLaw(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectLaw && selectLaw.id) {
            const updatedLaw: LawForm = {
                ...selectLaw,
                ...values,
            };
            editLaw(updatedLaw);
        } else {
            messageApi.error("Selected Law is invalid");
        }
    };

    const dataSource = data?.map((law, index) => ({
        key: index + 1,
        id: law?.id ?? 'N/A',
        crime_category: law?.crime_category ?? '',
        name: law?.name ?? '',
        title: law?.title ?? '',
        description: law?.description ?? '',
    })) || [];

    const filteredData = dataSource?.filter((law) =>
        Object.values(law).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

        const columns: ColumnsType<LawForm> = [
            {
                title: 'No',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Law',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Crime Category',
                dataIndex: 'crime_category',
                key: 'crime_category',
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
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
        ];
    const results = useQueries({
        queries: [
            {
                queryKey: ["crime-category"],
                queryFn: () => getCrimeCategories(token ?? ""),
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ],
    });

    const crimeCategoryData = results[0].data;
    const recordStatusData = results[1].data;

    const onCrimeCategoryChange = (value: number) => {
        setSelectedLaw(prevForm => ({
            ...prevForm,
            crime_category_id: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setSelectedLaw(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Law");
        XLSX.writeFile(wb, "Law.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Law','Crime Category', 'Title', 'Description']],
            body: dataSource.map(item => [item.key, item.name, item.crime_category, item.title, item.description]),
        });
        doc.save('Law.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Law.csv">
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
            printWindow.document.write('<h1>Law Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Law</th><th>Crime Category</th><th>Title</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
                    <td>${item.crime_category}</td>
                    <td>${item.title}</td>
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
            <h1 className="text-2xl font-bold text-[#1E365D]">Law</h1>
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
                        placeholder="Search Law..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Law
                    </button>
                </div>
            </div>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
                title="Edit Law"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Law Name"
                    rules={[{ required: true, message: "Please input the Law name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: "Please input the Title" }]}
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
                    label="Crime Category"
                    name="crime_category_id"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Crime Category"
                        optionFilterProp="label"
                        onChange={onCrimeCategoryChange}
                        options={crimeCategoryData?.map(crime => (
                            {
                                value: crime.id,
                                label: crime?.crime_category_name
                            }
                        ))}/>
                </Form.Item>
                
                <Form.Item
                    label="Record Status"
                    name="record_status"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        options={recordStatusData?.map(status => (
                            {
                                value: status.id,
                                label: status?.status
                            }
                        ))}/>
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Law"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddLaw onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default Law
