import { getDevice_Types, deleteDevice_Types} from "@/lib/queries"
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
import EditDevicesTypes from "./EditDeviceType";
import AddDeviceType from "./AddDeviceTypes";
import { LuSearch } from "react-icons/lu";

type DeviceTypes = {
    key: number;
    id: number ;
    device_type: string;
    purpose: string;
    remarks: string;
    device_usage: string;
};

const DeviceType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [devicesType, setDevicesType] = useState<DeviceTypes | null>(null);

    const { data } = useQuery({
        queryKey: ["devices-type"],
        queryFn: () => getDevice_Types(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDevice_Types(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices-type"] });
            messageApi.success("Devices Type deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Devices Type");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

    const dataSource = data?.map((devicestypes, index) => ({
        key: index + 1,
        id: devicestypes.id,
        device_type: devicestypes?.device_type ?? "N/A",
        purpose: devicestypes?.purpose ?? "N/A",
        remarks: devicestypes?.remarks ?? "N/A",
        device_usage: devicestypes?.device_usage ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((devicetypes) =>
        Object.values(devicetypes).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<DeviceTypes> = [
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
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Device Usage',
            dataIndex: 'device_usage',
            key: 'device_usage',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: DeviceTypes) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setDevicesType(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "DeviceType");
        XLSX.writeFile(wb, "DeviceType.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Device Type','Purpose','Device Usage','Remark']],
            body: dataSource.map(item => [item.key, item.device_type, item.purpose, item.device_usage, item.remarks]),
        });
        doc.save('DeviceType.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="DeviceType.csv">
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
            printWindow.document.write('<h1>Device Type Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Device Type</th><th>Device Usage</th><th>Purpose</th><th>Remarks</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.device_type}</td>
                    <td>${item.device_usage}</td>
                    <td>${item.purpose}</td>
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
                        Add Device Type
                    </button>
                    </div>
                    
                </div>
            <Table
                className="overflow-x-auto"
                columns={columns}
                dataSource={filteredData}
                scroll={{x: 900}}
            />
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddDeviceType onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Device Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditDevicesTypes
                    devicetype={devicesType}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default DeviceType
