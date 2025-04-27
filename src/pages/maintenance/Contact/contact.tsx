import { deleteContact, getContact } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import EditContact from "./EditContact";

type ContactProps = {
    id: number;
    type: string;
    value: string;
    mobile_imei: string;
    is_primary: boolean;
    contact_status: boolean;
    remarks: string;
}

const ContactType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [contact, setContact] = useState<ContactProps | null>(null);

    const { data } = useQuery({
        queryKey: ['contact'],
        queryFn: () => getContact(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteContact(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
            messageApi.success("Contact deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Contact");
        },
    });

    const dataSource = data?.map((contact, index) => (
        {
            key: index + 1,
            id: contact?.id ?? 'N/A',
            type: contact?.type ?? 'N/A',
            value: contact?.value ?? 'N/A',
            remarks: contact?.remarks ?? 'N/A',
            mobile_imei: contact?.mobile_imei ?? 'N/A',
            is_primary: contact?.is_primary ?? 'N/A',
            contact_status: contact?.contact_status ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((contact) =>
        Object.values(contact).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<ContactProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Contact Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Mobile Imei',
            dataIndex: 'mobile_imei',
            key: 'mobile_imei',
        },
        {
            title: 'Primary (Y/N)',
            dataIndex: 'is_primary',
            key: 'is_primary',
            render: (value: boolean) => (value ? 'Yes' : 'No'),
            },
            {
                title: 'Active (Y/N)',
                dataIndex: 'contact_status',
                key: 'contact_status',
                render: (value: boolean) => (value ? 'Yes' : 'No'),
            },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: ContactProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setContact(record);
                            setIsEditModalOpen(true);
                        }}
                    >
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
        XLSX.utils.book_append_sheet(wb, ws, "Contact");
        XLSX.writeFile(wb, "Contact.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Contact Type','Value', 'Remarks', 'Mobile IMEI' ]],
            body: dataSource.map(item => [item.key, item.type, item.value, item.remarks, item.mobile_imei]),
        });
        doc.save('Contact.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Contact.csv">
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
            printWindow.document.write('<h1>Contact Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Contact</th><th>Value</th><th>Remarks</th><th>Mobile Imei</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.type}</td>
                    <td>${item.value}</td>
                    <td>${item.remarks}</td>
                    <td>${item.mobile_imei}</td>
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
            <h1 className="text-[#1E365D] text-3xl font-bold">Contact Type</h1>
                <div className="my-4 flex justify-between items-center gap-2">
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
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center">
                        <input
                            placeholder="Search"
                            type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-400 h-10 w-96 rounded-md px-2 active:outline-none focus:outline-none"
                        />
                        <LuSearch className="absolute right-[1%] text-gray-400" />
                    </div>
                    </div>
                </div>
            <div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
        <Modal
            title="Edit Contact"
            open={isEditModalOpen}
            onCancel={() => setIsEditModalOpen(false)}
            footer={null}
            >
            <EditContact
                contact={contact}
                onClose={() => setIsEditModalOpen(false)}
            />
        </Modal>
        </div>
    )
}

export default ContactType
