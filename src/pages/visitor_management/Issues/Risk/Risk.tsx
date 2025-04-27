import { RiskProps } from "@/lib/definitions";
import { deleteRisk, getRiskLevels, getRisks, patchRisk } from "@/lib/queries";
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

const Risk = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<RiskProps | null>(null);

    const { data } = useQuery({
        queryKey: ["risk"],
        queryFn: () => getRisks(token ?? ""),
    });

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
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Risk");
    XLSX.writeFile(wb, "Risk.xlsx");
};

const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { 
        head: [['No.', 'Risk','Risk Level', 'Description' ]],
        body: dataSource.map(item => [item.key, item.name, item.risk_level, item.description]),
    });
    doc.save('Risk.pdf');
};

const menu = (
    <Menu>
        <Menu.Item>
            <a onClick={handleExportExcel}>Export Excel</a>
        </Menu.Item>
        <Menu.Item>
            <CSVLink data={dataSource} filename="Risk.csv">
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
        printWindow.document.write('<h1>Risk Report</h1>');
        printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
        printWindow.document.write('<tr><th>No.</th><th>Risk</th><th>Risk Level</th><th>Description</th></tr>');
        filteredData.forEach(item => {
            printWindow.document.write(`<tr>
                <td>${item.key}</td>
                <td>${item.name}</td>
                <td>${item.risk_level}</td>
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
        <h1 className="text-2xl font-bold text-[#1E365D]">Risk</h1>
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
