import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import moment from "moment";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import { deleteEducationalAttainments, getEducationalAttainments } from "@/lib/queries";
import AddEducationalAttainment from "./AddEducationalAttainment";
import EditEducationalAttainment from "./EditEducationalAttainment";

type EducationalAttainmentProps = {
    key: number;
    id: number;
    updated_at: string;
    name: string;
    description: string;
    updated_by: number;
}

const EducationalAttainment = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [educationalAttainment, setEducationalAttainment] = useState<EducationalAttainmentProps | null>(null);


    const { data } = useQuery({
        queryKey: ['educational-attainment'],
        queryFn: () => getEducationalAttainments(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteEducationalAttainments(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["educational-attainment"] });
            messageApi.success("Educational Attainment deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Educational Attainment");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((educational_attainments, index) => (
        {
            key: index + 1,
            id: educational_attainments?.id ?? 'N/A',
            name: educational_attainments?.name ?? 'N/A',
            description: educational_attainments?.description ?? 'N/A',
            updated_at: educational_attainments?.updated_at
        ? moment(educational_attainments.updated_at).format("YYYY-MM-DD hh:mm A")
        : 'N/A',
            updated_by: educational_attainments?.updated_by ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((educational_attainments) =>
        Object.values(educational_attainments).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<EducationalAttainmentProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Educational Attainment',
            dataIndex: 'name',
            key: 'name',
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
            render: (_: any, record: EducationalAttainmentProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setEducationalAttainment(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "EducationalAttainment");
        XLSX.writeFile(wb, "EducationalAttainment.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Educational Attainment', 'Description']],
            body: dataSource.map(item => [item.key, item.name, item.description]),
        });
        doc.save('EducationalAttainment.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="EducationalAttainment.csv">
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
            printWindow.document.write('<h1>Edicational Attainment Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Edicational Attainment</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.name}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Educational Attainment</h1>
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
                        Add Educational Attainments
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
                <AddEducationalAttainment onClose={handleCancel} />
            </Modal>
            <Modal
                title="EditOrganization"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width="40%"
            >
                <EditEducationalAttainment
                    educational_attainments={educationalAttainment}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default EducationalAttainment
