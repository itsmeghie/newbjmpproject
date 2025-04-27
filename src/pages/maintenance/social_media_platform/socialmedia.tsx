import { getSocialMediaPlatforms, deleteSocialMediaPlatforms } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import EditPlatform from "./EditPlatform"
import AddPlatform from "./AddPlatform"
import { GoDownload, GoPlus } from "react-icons/go"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { ColumnsType } from "antd/es/table"
import { useState } from "react"
import { LuSearch } from "react-icons/lu";

type SocialMediaPlatform = {
    key: number;
    id: number;
    platform_name: string;
    description: string;
};

const SocialMedia = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [platform, setPlatform] = useState<SocialMediaPlatform | null>(null);

    const { data } = useQuery({
        queryKey: ['social-media-platform'],
        queryFn: () => getSocialMediaPlatforms(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteSocialMediaPlatforms(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["social-media-platform"] });
            messageApi.success("Social Media Platforms deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Social Media Platforms");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

    const dataSource = data?.map((socialmedia, index) => (
        {
            key: index + 1,
            id: socialmedia?.id,
            platform_name: socialmedia?.platform_name ?? 'N/A',
            description: socialmedia?.description ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((visitor_req_docs) =>
        Object.values(visitor_req_docs).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<SocialMediaPlatform> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Platforms',
            dataIndex: 'platform_name',
            key: 'platform_name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: SocialMediaPlatform) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setPlatform(record);
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
            XLSX.utils.book_append_sheet(wb, ws, "SocialMediaPlatform");
            XLSX.writeFile(wb, "SocialMediaPlatform.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            autoTable(doc, { 
                head: [['No.', 'Document Name', 'Description']],
                body: dataSource.map(item => [item.key, item.platform_name, item.description]),
            });
            doc.save('SocialMediaPlatform.pdf');
        };
    
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={handleExportExcel}>Export Excel</a>
                </Menu.Item>
                <Menu.Item>
                    <CSVLink data={dataSource} filename="SocialMediaPlatform.csv">
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
                printWindow.document.write('<h1>Social Media Report</h1>');
                printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
                printWindow.document.write('<tr><th>No.</th><th>Platform</th><th>Description</th></tr>');
                filteredData.forEach(item => {
                    printWindow.document.write(`<tr>
                        <td>${item.key}</td>
                        <td>${item.platform_name}</td>
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
            <h1 className="text-3xl font-bold text-[#1E365D]">Social Media Platform</h1>
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
                        Add Social Media Platform
                    </button>
                    </div>
                    
                </div>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 700 }}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Social Media Platforms"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddPlatform onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Social Media Platforms"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditPlatform
                    platform={platform}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default SocialMedia
