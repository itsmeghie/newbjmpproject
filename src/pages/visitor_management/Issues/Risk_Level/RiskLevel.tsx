import {
    deleteRiskLevels,
    getRiskLevel,
    patchRisk_level,
} from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
    Button,
    Dropdown,
    Form,
    Input,
    Menu,
    message,
    Modal,
    Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import moment from "moment";
import { GoDownload, GoPlus } from "react-icons/go";
import AddRiskLevel from "./AddRiskLevel";

export type RiskLevelProps = {
    id: number;
    updated_at: string;
    name: string;
    description: string;
    updated_by: number;
};

const RiskLevel = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectRiskLevel, setSelctedRiskLevel] = useState<RiskLevelProps | null>(null);

    const { data } = useQuery({
        queryKey: ['risk-level'],
        queryFn: () => getRiskLevel(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRiskLevels(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["risk-level"] });
            messageApi.success("Risk Level deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Risk Level");
        },
    });

    const { mutate: editRiskLevel, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: RiskLevelProps) =>
            patchRisk_level(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["risk-level"] });
            messageApi.success("Risk Level updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Risk Level");
        },
    });

    const handleEdit = (record: RiskLevelProps) => {
        setSelctedRiskLevel(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectRiskLevel && selectRiskLevel.id) {
            const updatedRisk: RiskLevelProps = {
                ...selectRiskLevel,
                ...values,
            };
            editRiskLevel(updatedRisk);
        } else {
            messageApi.error("Selected Risk Level is invalid");
        }
    };

    const dataSource = data?.map((risk_level, index) => ({
        key: index + 1,
        id: risk_level?.id ?? 'N/A',
        name: risk_level?.name ?? 'N/A',
        description: risk_level?.description ?? 'N/A',
        updated_at: risk_level?.updated_at ?? 'N/A',
        updated_by: risk_level?.updated_by ?? 'N/A',
    })) || [];

    const filteredData = searchText
        ? dataSource.filter((risk_level) =>
            Object.values(risk_level).some((value) =>
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
            title: 'Risk Level',
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
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RiskLevel");
        XLSX.writeFile(wb, "RiskLevel.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Risk Level', 'Description' ]],
            body: dataSource.map(item => [item.key, item.name, item.description]),
        });
        doc.save('RiskLevel.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="RiskLevel.csv">
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
            printWindow.document.write('<h1>Risk Level Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Risk Level</th><th>Description</th></tr>');
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
        <div className="p-4">
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Risk Level</h1>
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
                        placeholder="Search Risk Level..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Risk Level
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Risk Level"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Risk Level Name"
                    rules={[{ required: true, message: "Please input the Risk Level name" }]}
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
                title="Add Risk Level"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
            <AddRiskLevel onClose={handleCancel} />
            </Modal>
        </div>
    );
};

export default RiskLevel;
