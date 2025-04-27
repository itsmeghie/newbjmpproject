import { deleteRecommendedAction, getRecommendedActions, getRisks, patchRecommendedAction } from "@/lib/queries";
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

    const { data } = useQuery({
        queryKey: ['recommended-action'],
        queryFn: () => getRecommendedActions(token ?? ""),
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
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "RecommendedAction");
        XLSX.writeFile(wb, "RecommendedAction.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Recommended Action','Risk',  ]],
            body: dataSource.map(item => [item.key, item.name, item.risk]),
        });
        doc.save('RecommendedAction.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="RecommendedAction.csv">
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
            printWindow.document.write('<h1>Recommended Action Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Recommended Action</th><th>Risk</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
                    <td>${item.risk}</td>
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
        <h1 className="text-3xl font-bold text-[#1E365D]">Recommended Action</h1>
        <div className="flex my-4 items-center justify-between mb-2">
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
