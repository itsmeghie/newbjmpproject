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
import { deleteImpactLevel, getImpactLevels, patchImpactLevel } from "@/lib/queries";
import AddImpactLevel from "./AddImpactLevel";

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

    const { data } = useQuery({
        queryKey: ['impact-level'],
        queryFn: () => getImpactLevels(token ?? ""),
    });

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
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ImpactLevel");
        XLSX.writeFile(wb, "ImpactLevel.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Impact Level','Description', ]],
            body: dataSource.map(item => [item.key, item.impact_level, item.description]),
        });
        doc.save('ImpactLevel.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="ImpactLevel.csv">
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
            printWindow.document.write('<h1>Impact Level Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Impact Level</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.impact_level}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Impact Level</h1>
            <div className="my-4 flex items-center justify-between mb-2">
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
