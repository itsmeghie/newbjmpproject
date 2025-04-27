import { getJail_Category, deleteJail_Category } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, message, Modal, Dropdown, Menu } from "antd";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { GoDownload, GoPlus } from "react-icons/go";
import AddJailCategory from "./AddJailCategory";
import EditJailCategories from "./EditJailCategories";
import { LuSearch } from "react-icons/lu";

type JailCategoryReport = {
    key: number;
    id: number;
    description: string;
    category: string;
};

const JailCategory = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedJailCategories, setSelectedJailCategories] = useState<JailCategoryReport | null>(null);

    const { data } = useQuery({
        queryKey: ["jail-category"],
        queryFn: () => getJail_Category(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJail_Category(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jail-category"] });
            messageApi.success("Jail Category deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Jail Category");
        },
    });

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const dataSource = data?.map((category, index) => ({
        key: index + 1,
        id: category.id,
        description: category?.description ?? "N/A",
        category: category?.category ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((jail_category) =>
        Object.values(jail_category).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<JailCategoryReport> = [
        {
            title: "No.",
            dataIndex: "key", 
            key: "key",
            align: "center",
        },
        {
            title: "Jail Category",
            dataIndex: "category",
            key: "category",
            align: "center",
        },
        {
            title: "Description",
            dataIndex: "description", 
            key: "description",
            align: "center",
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: JailCategoryReport) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedJailCategories(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "JailCategory");
        XLSX.writeFile(wb, "JailCategory.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Jail Category', 'Description']],
            body: dataSource.map(item => [item.key, item.category, item.description]),
        });
        doc.save('JailCategory.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="JailCategory.csv">
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
            printWindow.document.write('<h1>Category Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Category</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.category}</td>
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
                        Add Category
                    </button>
                    </div>
                    
                </div>
            <div className="w-full">
                <div id="printable-table">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{x: 800}}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddJailCategory onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Detention Building"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditJailCategories
                    category={selectedJailCategories}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default JailCategory;