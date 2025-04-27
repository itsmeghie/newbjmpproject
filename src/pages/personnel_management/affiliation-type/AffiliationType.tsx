import { getAffiliationTypes, deleteAffiliationType } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { ColumnsType } from "antd/es/table";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { GoDownload, GoPlus } from 'react-icons/go'
import { AiOutlineEdit } from 'react-icons/ai'
import { AiOutlineDelete } from 'react-icons/ai'
import Spinner from "@/components/loaders/Spinner";
import { LuSearch } from "react-icons/lu";
import AddAffiliationType from "./AddAffiliationType";
import EditAffiliationType from "./EditAffiliationType";

type AffiliationType = {
    key: number;
    id: number;
    affiliation_type: string;
    description: string;
};

const AffiliationType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [affiliationType, setAffiliationType] = useState<AffiliationType | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['affiliation-types'],
        queryFn: () => getAffiliationTypes(token ?? "")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAffiliationType(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["affiliation-type"] });
            messageApi.success("Affiliation Type deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Affiliation Type");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((affiliation, index) => (
        {
            key: index + 1,
            id: affiliation?.id,
            affiliation_type: affiliation?.affiliation_type ?? 'N/A',
            description: affiliation?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((affiliation) =>
        Object.values(affiliation).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<AffiliationType> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Affiliation Type',
            dataIndex: 'affiliation_type',
            key: 'affiliation_type',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: AffiliationType) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setAffiliationType(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "AffiliationType");
        XLSX.writeFile(wb, "AffiliationType.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Document Name', 'Description']],
            body: dataSource.map(item => [item.key, item.affiliation_type, item.description]),
        });
        doc.save('AffiliationType.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="AffiliationType.csv">
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
            printWindow.document.write('<h1>Affiliation Type Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Affiliation Type</th><th>Description</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.affiliation_type}</td>
                    <td>${item.description}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };


    if (isLoading) return <Spinner />
    if (error) return <div>{error.message}</div>

    return (
        <>
            {contextHolder}
            <h1 className="text-3xl font-bold text-[#1E365D]">Affiliation Type</h1>
            <div className="w-full bg-white">
                <div className="my-4 flex justify-between gap-2">
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
                        Add Affilation Type
                    </button>
                    </div>
                    
                </div>
                <div className="overflow-x-auto overflow-y-auto h-full">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            <Modal
              className="overflow-y-auto rounded-lg scrollbar-hide"
              title="Add Affiliation Type"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              style={{  overflowY: "auto" }} 
            >
            <AddAffiliationType onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit AAffiliation Type"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditAffiliationType
                    affiliationtype={affiliationType}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </>
    )
}

export default AffiliationType