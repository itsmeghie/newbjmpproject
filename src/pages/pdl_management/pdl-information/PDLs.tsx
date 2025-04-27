import { PDLs } from "@/lib/pdl-definitions";
import { getPDLs } from "@/lib/queries";
import { deletePDL, patchPDL } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload } from "react-icons/go";

const PDLtable = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectPDL, setSelectedPDL] = useState<PDLs | null>(null);

    const { data } = useQuery({
        queryKey: ['pdl'],
        queryFn: () => getPDLs(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePDL(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pdl"] });
            messageApi.success("PDL deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete PDL");
        },
    });

    const { mutate: editPDL, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: PDLs) =>
        patchPDL(token ?? "", updated.id, updated),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pdl"] });
        messageApi.success("PDL updated successfully");
        setIsEditModalOpen(false);
        },
        onError: () => {
        messageApi.error("Failed to update PDL");
        },
    });

    const handleEdit = (record: PDLs) => {
        setSelectedPDL(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectPDL?.id) {
            const updatedPDL: PDLs = {
                ...selectPDL,
                ...values,
            };
            editPDL(updatedPDL);
        } else {
            messageApi.error("Selected PDL is invalid");
        }
    };

    const dataSource = data?.map((pdl, index) => ({
        key: index + 1,
        id: pdl?.id ?? 'N/A',
        pdl_reg_no: pdl?.pdl_reg_no ?? 'N/A',
        first_name: pdl?.person?.first_name ?? 'N/A',
        middle_name: pdl?.person?.middle_name ?? '',
        last_name: pdl?.person?.last_name ?? '',
        name: `${pdl?.person?.first_name ?? 'N/A'} ${pdl?.person?.middle_name ?? ''} ${pdl?.person?.last_name ?? 'N/A'}`,
        cell_no: pdl?.cell?.cell_no ?? 'N/A',
        cell_name: pdl?.cell?.cell_name ?? 'N/A',
        gang_affiliation: pdl?.gang_affiliation ?? 'N/A',
        look: pdl?.look ?? 'N/A',
        date_of_admission: pdl?.date_of_admission ?? 'N/A',
    })) || [];

    const filteredData = dataSource?.filter((pdl) =>
        Object.values(pdl).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

        const columns: ColumnsType<PDLs> = [
            {
                title: 'No.',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'PDL Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Cell No.',
                dataIndex: 'cell_no',
                key: 'cell_no',
            },
            {
                title: 'Cell Name',
                dataIndex: 'cell_name',
                key: 'cell_name',
            },
            {
                title: 'Gang Affiliation',
                dataIndex: 'gang_affiliation',
                key: 'gang_affiliation',
            },
            {
                title: 'Look',
                dataIndex: 'look',
                key: 'look',
            },
            {
                title: "Action",
                key: "action",
                render: (_: any, record: any, index) => (
                    <div className="flex gap-2">
                        <Button
                            type="link"
                            onClick={() => {
                                const original = data?.[index];
                                if (original) handleEdit(record, original);
                            }}
                        >
                            <AiOutlineEdit />
                        </Button>
                        <Button
                            type="link"
                            danger
                            onClick={() => deleteMutation.mutate(data?.[index]?.id)}
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
            XLSX.utils.book_append_sheet(wb, ws, "PDL");
            XLSX.writeFile(wb, "PDL.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            autoTable(doc, { 
                head: [['No.', 'PDL Name', 'Cell No.', 'Cell Name', 'Gang Affiliation' ]],
                body: dataSource.map(item => [item.key, item.name, item.cell_no, item.cell_name, item.gang_affiliation ]),
            });
            doc.save('PDL.pdf');
        };
    
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={handleExportExcel}>Export Excel</a>
                </Menu.Item>
                <Menu.Item>
                    <CSVLink data={dataSource} filename="PDL.csv">
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
                printWindow.document.write('<h1>PDL Report</h1>');
                printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
                printWindow.document.write('<tr><th>No.</th><th>PDL Name</th><thCell No.</th><th>Cell Name</th><th>Gang Affiliation</th></tr>');
                filteredData.forEach(item => {
                    printWindow.document.write(`<tr>
                        <td>${item.key}</td>
                        <td>${item.name}</td>
                        <td>${item.cell_no}</td>
                        <td>${item.cell_name}</td>
                        <td>${item.gang_affiliation}</td>
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
            <h1 className="text-2xl font-bold text-[#1E365D]">PDL</h1>
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
                    <Input placeholder="Search Personnel..." value={searchText} className="py-2 md:w-64 w-full" onChange={(e) => setSearchText(e.target.value)} />
                </div>
            </div>
            <Table dataSource={filteredData} columns={columns} />
            <Modal open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onOk={() => form.submit()} width="40%" confirmLoading={isUpdating} style={{overflowY: "auto" }} >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <h1 className="text-xl font-bold">PDL Information</h1>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item className="text-[#374151] font-semibold text-lg" name="pdl_reg_no" label="Registration No.">
                            <Input disabled className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                        </Form.Item>
                        <Form.Item name="date_of_admission" className="text-[#374151] font-semibold text-lg" label="Date Arrested">
                            <Input type="date" className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                        </Form.Item>
                        <Form.Item name="first_name" className="text-[#374151] font-semibold text-lg" label="First Name">
                            <Input className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                        </Form.Item>
                        <Form.Item name="middle_name" className="text-[#374151] font-semibold text-lg" label="Middle Name">
                            <Input className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                        </Form.Item>
                        <Form.Item name="last_name" className="text-[#374151] font-semibold text-lg" label="Last Name">
                            <Input className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default PDLtable
