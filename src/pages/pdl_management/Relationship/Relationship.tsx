import { deleteRelationship, getRelationship, patchRelationship } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Table } from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddRelationship from "./AddRelationship";

type RelationshipForm = {
    id: number;
    updated_by: string;
    record_status: string;
    updated_at: string;
    relationship_name: string;
    description: string;
};

const Relationship = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectRelationship, setSelctedRelationship] = useState<RelationshipForm | null>(null);

    const { data } = useQuery({
        queryKey: ['relationship'],
        queryFn: () => getRelationship(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRelationship(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["relationship"] });
            messageApi.success("Relationship deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Relationship");
        },
    });

    const { mutate: editRelationship, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: RelationshipForm) =>
            patchRelationship(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["relationship"] });
            messageApi.success("Relationship updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Relationship");
        },
    });

    const handleEdit = (record: RelationshipForm) => {
        setSelctedRelationship(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectRelationship && selectRelationship.id) {
            const updatedRelationship: RelationshipForm = {
                ...selectRelationship,
                ...values,
            };
            editRelationship(updatedRelationship);
        } else {
            messageApi.error("Selected Relationship is invalid");
        }
    };

    const dataSource = data?.map((relationship, index) => ({
        key: index + 1,
        id: relationship?.id ?? 'N/A',
        relationship_name: relationship?.relationship_name ?? 'N/A',
        description: relationship?.description ?? 'N/A',
        updated_at: moment(relationship?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        updated_by: relationship?.updated_by ?? 'N/A',
    })) || [];

    const filteredData = dataSource?.filter((relationship) =>
        Object.values(relationship).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns = [
        {
        title: "No",
        dataIndex: "key",
        key: "key",
        },
        {
        title: "Relationship Name",
        dataIndex: "relationship_name",
        key: "relationship_name",
        },
        {
        title: "Description",
        dataIndex: "description",
        key: "description",
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
        title: "Actions",
        key: "actions",
        render: (_: any, record: RelationshipForm) => (
            <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
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
        XLSX.utils.book_append_sheet(wb, ws, "Relationship");
        XLSX.writeFile(wb, "Relationship.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Relationship', 'Description' ]],
            body: dataSource.map(item => [item.key, item.relationship_name, item.description]),
        });
        doc.save('Relationship.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Relationship.csv">
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
            printWindow.document.write('<h1>Relationship Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Relationship</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.relationship_name}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Relationship</h1>
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
                        placeholder="Search Relationship..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Relationship
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Relationship"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="relationship_name"
                    label="Relationship Name"
                    rules={[{ required: true, message: "Please input the Relationship name" }]}
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
                title="Add Relationship"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddRelationship onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default Relationship
