import { getPdl_to_Visit, deleteAuthorizeVisitor } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddAuthorizeVisit from "./AddAuthorizeVisit";

type AuthorizeVisitors = {
    key: number;
    id: number;
    visitor: number;
    pdl: number;
    relationship_to_pdl: number;
};

const AuthorizeVisitors = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [authorizetovisit, setauthorizetoVisit] = useState<AuthorizeVisitors | null>(null)
;
    const { data } = useQuery({
        queryKey: ["authorize-visitor"],
        queryFn: () => getPdl_to_Visit(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAuthorizeVisitor(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authorize-visitor"] });
            messageApi.success("Authorize to Visitor PDL deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Authorize to Visitor PDL");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((pdl_to_visit, index) => ({
        key: index + 1,
        id: pdl_to_visit.id,
        visitor: pdl_to_visit?.visitor ?? "N/A",
        pdl: pdl_to_visit?.pdl ?? "N/A",
        relationship_to_pdl: pdl_to_visit?.relationship_to_pdl ?? "N/A",
    })) || [];

    const filteredData = dataSource?.filter((pdl_to_visit) =>
        Object.values(pdl_to_visit).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<AuthorizeVisitors> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
        },
        {
            title: 'Visitor',
            dataIndex: 'visitor',
            key: 'visitor',
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
        },
        {
            title: 'PDL',
            dataIndex: 'pdl',
            key: 'pdl',
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
        },
        {
            title: 'Relation to PDL',
            dataIndex: 'relationship_to_pdl',
            key: 'relationship_to_pdl',
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
        },
        {
            title: 'Record Status',
            dataIndex: 'record_status',
            key: 'record_status',
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: '#1E365D', color: '#fff' },
            }),
            render: (_: any, record: AuthorizeVisitors) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setauthorizetoVisit(record);
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
        XLSX.utils.book_append_sheet(wb, ws, "AuthorizetoVisit");
        XLSX.writeFile(wb, "AuthorizetoVisit.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Visitor','PDL', 'Visitor Relationship to PDL' ]],
            body: dataSource.map(item => [item.key, item.visitor, item.pdl, item.relationship_to_pdl]),
        });
        doc.save('AuthorizetoVisit.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="AuthorizetoVisit.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
            <Menu.Item>
                <a onClick={handleExportPDF}>Export PDF</a>
            </Menu.Item>
        </Menu>
    );
    return (
        <div>
            {contextHolder}
            <div className="mb-4 flex justify-between gap-2">
                    <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload /> Export
                        </a>
                    </Dropdown>
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
                        Add Authorize Visitor
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
              title="Add Visitor Type"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              style={{  overflowY: "auto" }} 
            >
            <AddAuthorizeVisit onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default AuthorizeVisitors
