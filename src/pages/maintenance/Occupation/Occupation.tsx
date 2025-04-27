import { deleteOccupation, getOccupations } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import moment from "moment";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddOccupation from "./AddOccupation";
import EditOccupation from "./EditOccupation";

type OccupationProps = {
    id: number;
    updated_at: string;
    name: string;
    description: string;
    remarks: string;
    updated_by: number;
}
const Occupation = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [occupation, setOccupation] = useState<OccupationProps | null>(null);

    const { data } = useQuery({
        queryKey: ['occupation'],
        queryFn: () => getOccupations(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteOccupation(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["occupation"] });
            messageApi.success("Occupation deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Occupation");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((occupation, index) => (
        {
            key: index + 1,
            id: occupation?.id ?? 'N/A',
            name: occupation?.name ?? 'N/A',
            description: occupation?.description ?? 'N/A',
            remarks: occupation?.remarks ?? 'N/A',
            updated_at: occupation?.updated_at
        ? moment(occupation.updated_at).format("YYYY-MM-DD hh:mm A")
        : 'N/A',
            updated_by: occupation?.updated_by ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((occupation) =>
        Object.values(occupation).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<OccupationProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Occupation',
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
            render: (_: any, record: OccupationProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setOccupation(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "Occupation");
        XLSX.writeFile(wb, "Occupation.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Occupation', 'Description', 'Remarks', 'Updated At', 'Updated By']],
            body: dataSource.map(item => [item.key, item.name, item.description, item.remarks, item.updated_at, item.updated_by]),
        });
        doc.save('Occupation.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Occupation.csv">
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
            printWindow.document.write('<h1>Occupation Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Occupation</th><th>Description</th><th>Remarks</th><th>Updated At</th><th>Updated By</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.remarks}</td>
                    <td>${item.updated_at}</td>
                    <td>${item.updated_by}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Occupation</h1>
            <div className="w-full bg-white">
                <div className="my-4 flex justify-between items-center gap-2">
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
                                Add Occupation
                            </button>
                        </div>
                    </div>
                <Table columns={columns} dataSource={filteredData} />
                </div>
                <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddOccupation onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Occupation"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditOccupation
                    occupation={occupation}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Occupation
