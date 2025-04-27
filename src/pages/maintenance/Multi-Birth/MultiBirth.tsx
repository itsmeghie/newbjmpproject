import { deleteMultiBirthType, getMultipleBirthClassTypes } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddMultiBirth from "./AddMultiBirth";
import EditMultiBirth from "./EditMultiBirth";

type MultiBirthType = {
    id: number;
    classification: string;
    group_size: number;
    term_for_sibling_group: string;
    description: string;
};

const MultiBirth = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectMultiBirth, setselectMultiBirth] = useState<MultiBirthType | null>(null);

    const { data } = useQuery({
        queryKey: ['sibling-group'],
        queryFn: () => getMultipleBirthClassTypes(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMultiBirthType(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["multibirth"] });
            messageApi.success("Multi Birth deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Multi Birth");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
        setselectMultiBirth(null);
    };

    const dataSource =
    data?.map((multibirth, index) => ({
        key: index + 1,
        id: multibirth?.id ?? "N/A",
        classification: multibirth?.classification ?? "N/A",
        group_size: multibirth?.group_size ?? "N/A",
        term_for_sibling_group: multibirth?.term_for_sibling_group ?? "N/A",
        description: multibirth?.description ?? "N/A",
    })) || [];

    const filteredData = dataSource.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );

        const columns: ColumnsType<MultiBirthType> = [
                {
                title: "No.",
                dataIndex: "key",
                key: "key",
                },
                {
                title: "Classification",
                dataIndex: "classification",
                key: "classification",
                },
                {
                title: "Group Size",
                dataIndex: "group_size",
                key: "group_size",
                },
                {
                    title: "Term for Sibling Group",
                    dataIndex: "term_for_sibling_group",
                    key: "term_for_sibling_group",
                },
                {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                },
                {
                title: "Actions",
                key: "actions",
                render: (_: any, record: MultiBirthType) => (
                    <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                        setselectMultiBirth(record);
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
            XLSX.utils.book_append_sheet(wb, ws, "MultiBirthClassification");
            XLSX.writeFile(wb, "MultiBirthClassification.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            autoTable(doc, { 
                head: [['No.', 'Classification','Group Size', 'Term for Sibling Group', 'Description' ]],
                body: dataSource.map(item => [item.key, item.classification, item.group_size, item.term_for_sibling_group, item.description]),
            });
            doc.save('MultiBirthClassification.pdf');
        };
    
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={handleExportExcel}>Export Excel</a>
                </Menu.Item>
                <Menu.Item>
                    <CSVLink data={dataSource} filename="MultiBirthClassification.csv">
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
                printWindow.document.write('<h1>Multi Birth Classification Report</h1>');
                printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
                printWindow.document.write('<tr><th>No.</th><th> Classification</th><th>Group Size</th><th>Term for Sibling Group</th><th>Description</th></tr>');
                filteredData.forEach(item => {
                    printWindow.document.write(`<tr>
                        <td>${item.key}</td>
                        <td>${item.classification}</td>
                        <td>${item.group_size}</td>
                        <td>${item.term_for_sibling_group}</td>
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
            <h1 className="text-[#1E365D] text-3xl font-bold">Multi Birth Classification</h1>
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
                            Add Multi Birth Classification
                            </button>
                    </div>
                </div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Multi Birth Classification"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
                <AddMultiBirth onClose={handleCancel} />
            </Modal>

            {selectMultiBirth && (
                <Modal
                title="Edit Multi Birth Classification"
                open={isEditModalOpen}
                onCancel={handleEditClose}
                footer={null}
                width="30%"
                >
                <EditMultiBirth multibirth={selectMultiBirth} onClose={handleEditClose} />
                </Modal>
            )}
        </div>
    )
}

export default MultiBirth
