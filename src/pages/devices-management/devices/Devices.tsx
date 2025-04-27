import { getDevice, deleteDevice } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddDevices from "./AddDevices";
import EditDevices from "./EditDevices";
import { LuSearch } from "react-icons/lu";

type Device = {
    key: number;
    id: number ;
    device_type: string;
    jail: string;
    area: string;
    device_name: string;
    description: string;
    serial_no: string;
    manufacturer: string;
    supplier: string;
};

const Device = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [devices, setDevices] = useState<Device | null>(null);

    const { data } = useQuery({
        queryKey: ["devices"],
        queryFn: () => getDevice(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDevice(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] });
            messageApi.success("Devices deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Devices");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((devices, index) => ({
        key: index + 1,
        id: devices.id,
        device_type: devices?.device_type ?? "N/A",
        jail: devices?.jail ?? "N/A",
        area: devices?.area ?? "N/A",
        device_name: devices?.device_name ?? "N/A",
        description: devices?.description ?? "N/A",
        serial_no: devices?.serial_no ?? "N/A",
        manufacturer: devices?.manufacturer ?? "N/A",
        supplier: devices?.supplier ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((devices) =>
        Object.values(devices).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Device> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Device Type',
            dataIndex: 'device_type',
            key: 'device_type',
        },
        
        {
            title: 'Device Name',
            dataIndex: 'device_name',
            key: 'device_name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Jail',
            dataIndex: 'jail',
            key: 'jail',
        },
        {
            title: 'Jail Area',
            dataIndex: 'area',
            key: 'area',
        },
        {
            title: 'Serial No.',
            dataIndex: 'serial_no',
            key: 'serial_no',
        },
        {
            title: 'Manufacturer',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            fixed: 'right',
            render: (_: any, record: Device) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setDevices(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Devices");
        XLSX.writeFile(wb, "Devices.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Device Type','Device Name', 'Manufacturer', 'Supplier' ]],
            body: dataSource.map(item => [item.key, item.device_type, item.device_name, item.manufacturer, item.supplier]),
        });
        doc.save('Devices.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Devices.csv">
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
            printWindow.document.write('<tr><th>No.</th><th>Device</th><th>Device Type</th><th>Manufacturer</th><th>Supplier</th><th>Serial No.</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.device_name}</td>
                    <td>${item.device_type}</td>
                    <td>${item.manufacturer}</td>
                    <td>${item.supplier}</td>
                    <td>${item.serial_no}</td>
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
            <div className="mb-4 flex justify-between gap-2">
            <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload /> Export
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
                        Add Devices
                    </button>
                    </div>
                    
                </div>
            <Table
                className="overflow-x-auto"
                columns={columns}
                dataSource={filteredData}
                scroll={{ x: 'max-content' }} 
            />
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="50%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddDevices onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Devices"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditDevices
                    devices={devices}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Device
