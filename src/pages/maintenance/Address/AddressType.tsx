import { deleteAddressType, getAddressType } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";

type AddressData = {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    address_type: string;
    description: string;
  }

const AddressType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [address, setAddress] = useState<AddressData | null>(null);

    const { data } = useQuery({
        queryKey: ['address'],
        queryFn: () => getAddressType(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAddressType(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["address"] });
            messageApi.success("Address deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Address");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((address, index) => (
        {
            key: index + 1,
            id: address?.id ?? 'N/A',
            address_type: address?.address_type ?? 'N/A',
            description: address?.description ?? 'N/A',
            updated_at: address?.updated_at
            ? moment(address.updated_at).format("YYYY-MM-DD hh:mm A")
                    : 'N/A',
            updated_by: address?.updated_by ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((address) =>
        Object.values(address).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnType<AddressData>[] = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Address Type',
            dataIndex: 'address_type',
            key: 'address_type',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: AddressData) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setAddress(record);
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
    ]
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Address");
        XLSX.writeFile(wb, "Address.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Address', 'Description' ]],
            body: dataSource.map(item => [item.key, item.address_type, item.description]),
        });
        doc.save('Address.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Address.csv">
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
            printWindow.document.write('<h1>Device Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Address Type</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.address_type}</td>
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
        <div className="h-screen">
            {contextHolder}
            <h1 className="text-[#1E365D] text-3xl font-bold">Address Type</h1>
            <div className="w-full bg-white">
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
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                        >
                        <GoPlus />
                        Add Address Type
                    </button>
                    </div>

                </div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Address Type"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddAddress onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Address Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditAddress
                    address={address}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default AddressType
