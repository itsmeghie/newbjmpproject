import { deleteDetention_Floor, getDetention_Floor } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ColumnsType } from "antd/es/table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useState } from "react";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import EditFloor from "./EditFloor";
import AddFloor from "./AddFloor";

type Floor = {
    id: number;
    building: string;
    floor_number: string;
    floor_name: string;
    security_level: string;
    floor_description: string;
    floor_status: string | null;
    record_status: string;
};

const Level = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDetentionFloor, setSelectedDetentionFloor] = useState<Floor | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const { data } = useQuery({
        queryKey: ['detentionfloor'],
        queryFn: () => getDetention_Floor(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteDetention_Floor(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detention-floor"] });
            messageApi.success("Detention Floor deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Detention Floor");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((floor, index) => ({
        key: index + 1,
        id: floor?.id,
        building: floor?.building,
        floor_number: floor?.floor_number,
        floor_name: floor?.floor_name,
        security_level: floor?.security_level,
        floor_description: floor?.floor_description,
        floor_status: floor?.floor_status,
        record_status: floor?.record_status
    })) || [];

    const filteredData = dataSource?.filter((detention_floor) =>
        Object.values(detention_floor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Floor> = [
        {
            title: "No.",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Building",
            dataIndex: "building",
            key: "building",
        },
        {
            title: "Floor Number",
            dataIndex: "floor_number",
            key: "floor_number",
        },
        {
            title: "Floor Name",
            dataIndex: "floor_name",
            key: "floor_name",
        },
        {
            title: "Security Level",
            dataIndex: "security_level",
            key: "security_level",
        },
        {
            title: "Floor Description",
            dataIndex: "floor_description",
            key: "floor_description",
        },
        {
            title: "Floor Status",
            dataIndex: "floor_status",
            key: "floor_status",
        },
        {
            title: "Record Status",
            dataIndex: "record_status",
            key: "record_status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Floor) => (
            <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                <Button
                    type="link"
                    onClick={() => {
                        setSelectedDetentionFloor(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Floor");
        XLSX.writeFile(wb, "Floor.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Floor Name', 'Floor Number', 'Floor Status', 'Floor Description']],
            body: dataSource.map(item => [item.key, item.floor_name, item.floor_number, item.floor_status, item.floor_description]),
        });
        doc.save('Floor.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Floor.csv">
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
            printWindow.document.write('<h1>Detention Floor Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Building</th><th>Floor No.</th><th>Floor Name</th><th>Security Level</th><th>Floor Description</th><th>Floor Status</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.building}</td>
                    <td>${item.floor_number}</td>
                    <td>${item.floor_name}</td>
                    <td>${item.security_level}</td>
                    <td>${item.floor_description}</td>
                    <td>${item.floor_status}</td>
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
            <div className="flex justify-between my-5">
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
                        Add Detention Floor
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    />
            </div>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                >
                <AddFloor
                    onClose={() => {
                    setIsModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["detentionfloor"] });
                    }}
                />
                </Modal>
            <Modal
                title="Edit Detention Floor"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditFloor
                    detentionFloor={selectedDetentionFloor}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Level
