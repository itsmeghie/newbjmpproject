import { getGangAffiliation } from "@/lib/queries";
import { deleteGangAffiliation, patchGangAffiliation } from "@/lib/query";
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
import AddGangAffiliation from "./AddGangAffiliation";

type GangAffiliationProps = {
    key: number;
    id: number;
    record_status: string;
    name: string;
    description: string;
    created_by: number;
    updated_by: number;
};

const GangAffiliation = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectAffiliation, setSelctedAffiliation] = useState<GangAffiliationProps | null>(null);

    const { data } = useQuery({
        queryKey: ['gang-affiliation'],
        queryFn: () => getGangAffiliation(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteGangAffiliation(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gang-affiliation"] });
            messageApi.success("Gang Affiliation deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Gang Affiliation");
        },
    });

    const { mutate: editGangAffiliation, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: GangAffiliationProps) =>
            patchGangAffiliation(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gang-affiliation"] });
            messageApi.success("Gang Affiliation updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Gang Affiliation");
        },
    });

    const handleEdit = (record: GangAffiliationProps) => {
        setSelctedAffiliation(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectAffiliation && selectAffiliation.id) {
            const updatedGangAffiliation: GangAffiliationProps = {
                ...selectAffiliation,
                ...values,
            };
            editGangAffiliation(updatedGangAffiliation);
        } else {
            messageApi.error("Selected Gang Affiliation is invalid");
        }
    };

    const dataSource = data?.map((gang_affiliation, index) => ({
        key: index + 1,
        id: gang_affiliation?.id ?? 'N/A',
        name: gang_affiliation?.name ?? 'N/A',
        description: gang_affiliation?.description ?? 'N/A',
        remarks: gang_affiliation?.remarks ?? 'N/A',
        updated_at: moment(gang_affiliation?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        updated_by: gang_affiliation?.updated_by ?? 'N/A',
    })) || [];

    const filteredData = dataSource?.filter((gang_affiliation) =>
        Object.values(gang_affiliation).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

        const columns: ColumnsType<GangAffiliationProps> = [
            {
                title: 'No.',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Gang Affiliation',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Updated At",
                dataIndex: "updated_at",
                key: "updated_at",
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
            XLSX.utils.book_append_sheet(wb, ws, "GangAffiliation");
            XLSX.writeFile(wb, "GangAffiliation.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            autoTable(doc, { 
                head: [['No.', 'Gang Affiliation','Description', 'Remarks']],
                body: dataSource.map(item => [item.key, item.name, item.description, item.remarks]),
            });
            doc.save('GangAffiliation.pdf');
        };
    
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={handleExportExcel}>Export Excel</a>
                </Menu.Item>
                <Menu.Item>
                    <CSVLink data={dataSource} filename="GangAffiliation.csv">
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
                printWindow.document.write('<h1>Gang Affiliation Report</h1>');
                printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
                printWindow.document.write('<tr><th>No.</th><th>Gang Affiliation</th><th>Description</th><th>Remarks</th></tr>');
                filteredData.forEach(item => {
                    printWindow.document.write(`<tr>
                        <td>${item.key}</td>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>${item.remarks}</td>
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
            <h1 className="text-2xl font-bold text-[#1E365D]">Gang Affiliation</h1>
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
                        placeholder="Search Gang Affiliation..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Gang Affiliation
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Edit Gang Affiliation"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Gang Affiliation Name"
                    rules={[{ required: true, message: "Please input the Gang Affiliation name" }]}
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
                    name="remarks"
                    label="Remarks"
                    rules={[{ required: true, message: "Please input a remarks" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Gang Affiliation"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddGangAffiliation onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default GangAffiliation
