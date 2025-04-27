import { getCrimeCategories, getLaws, getOffenses, getRecord_Status } from "@/lib/queries";
import { deleteOffense, patchOffenses } from "@/lib/query";
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
import AddOffenses from "./AddOffenses";
import CrimeCategory from "../Crime-Category/CrimeCategory";

type OffenseProps = {
    id: number; 
    updated_by: string; 
    crime_category: string; 
    law: string; 
    record_status: string;
    updated_at: string;
    offense: string;
    description: string; 
    crime_severity: string; 
    punishment: string; 

    crime_category_id?: number;
    law_id?: number; 
    record_status_id?: number; 
};

const Offenses = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [ selectOffenses, setSelectedOffenses ] = useState<OffenseProps>({
    id: 0,
    updated_by: '', 
    crime_category: '', 
    law: '', 
    record_status: '',
    updated_at: '', 
    offense: '', 
    description: '',
    crime_severity: '',
    punishment: '',

    crime_category_id: 0,
    law_id: 0,
    record_status_id: 0,
    })

    const { data } = useQuery({
        queryKey: ['offenses'],
        queryFn: () => getOffenses(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteOffense(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offenses"] });
            messageApi.success("Offenses deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Offenses");
        },
    });

    const { mutate: editOffenses, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: OffenseProps) =>
            patchOffenses(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offenses"] });
            messageApi.success("Offenses updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Offenses");
        },
    });

    const handleEdit = (record: OffenseProps) => {
        setSelectedOffenses(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectOffenses && selectOffenses.id) {
            const updatedOffenses: OffenseProps = {
                ...selectOffenses,
                ...values,
            };
            editOffenses(updatedOffenses);
        } else {
            messageApi.error("Selected Offenses is invalid");
        }
    };

    const dataSource = data?.map((offense, index) => ({
        key: index + 1,
        id: offense?.id ?? 'N/A',
        crime_category: offense?.crime_category ?? 'N/A',
        description: offense?.description ?? 'N/A',
        law: offense?.law ?? 'N/A',
        offense: offense?.offense ?? 'N/A',
        crime_severity: offense?.crime_severity ?? 'N/A',
        punishment: offense?.punishment ?? 'N/A',
        updated_at: moment(offense?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        updated_by: offense?.updated_by ?? 'N/A',
    })) || [];

    const filteredData = dataSource?.filter((offense) =>
        Object.values(offense).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<OffenseProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Offense',
            dataIndex: 'offense',
            key: 'offense',
        },
        {
            title: 'Crime Category',
            dataIndex: 'crime_category',
            key: 'crime_category',
        },
        {
            title: 'Crime Severity',
            dataIndex: 'crime_severity',
            key: 'crime_severity',
        },
        {
            title: 'Law',
            dataIndex: 'law',
            key: 'law',
        },
        {
            title: 'Punishment',
            dataIndex: 'punishment',
            key: 'punishment',
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

    const results = useQueries({
        queries: [
            {
                queryKey: ["crime-category"],
                queryFn: () => getCrimeCategories(token ?? ""),
            },
            {
                queryKey: ["law"],
                queryFn: () => getLaws(token ?? ""),
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ],
    });

    const crimeCategoryData = results[0].data;
    const lawData = results[1].data;
    const recordStatusData = results[2].data;

    const onCrimeCategoryChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            crime_category_id: value,
        }));
    };

    const onLawChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            law_id: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setSelectedOffenses(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Offenses");
        XLSX.writeFile(wb, "Offenses.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Offense', 'Crime Category', 'Crime Severity', 'Law', 'Punishment', 'Description']],
            body: dataSource.map(item => [item.key, item.offense, item.crime_category, item.crime_severity, item.law, item.punishment, item.description ]),
        });
        doc.save('Offenses.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Offenses.csv">
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
            printWindow.document.write('<h1>Offenses Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Offenses</th><th>Crime Category</th><th>Crime Severity</th><th>Law</th><th>Punishment</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.offense}</td>
                    <td>${item.crime_category}</td>
                    <td>${item.crime_severity}</td>
                    <td>${item.law}</td>
                    <td>${item.punishment}</td>
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
            <h1 className="text-2xl font-bold text-[#1E365D]">Offenses</h1>
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
                        placeholder="Search Offenses..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Offenses
                    </button>
                </div>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
            />
            <Modal
                title="Offense"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="offense"
                    label="Offense Name"
                    rules={[{ required: true, message: "Please input the Offense name" }]}
                >
                    <Input />
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
                    label="Law"
                    name="law_id"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Law"
                        optionFilterProp="label"
                        onChange={onLawChange}
                        options={lawData?.map(law => (
                            {
                                value: law.id,
                                label: law?.name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input a description" }]}
                >
                    <Input.TextArea rows={3} />
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
                title="Add Offenses"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
            <AddOffenses onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default Offenses
