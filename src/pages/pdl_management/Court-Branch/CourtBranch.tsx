import { deleteBranch, getBranch, getCourt, getJail_Province, getJailRegion } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import moment from "moment";
import AddCourtBranch from "./AddCourtBranch";
import { patchCourtBranch } from "@/lib/query";

type BranchProps = {
    id: number;
    updated_by: string;
    province: string;
    region: string;
    court: string;
    updated_at: string;
    branch: string;
    judge: string;
};

const CourtBranch = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [branch, setBranch] = useState<BranchProps>({
        id: 0,
        updated_by: '',
        province: '',
        region: '',
        court: '',
        updated_at: '',
        branch: '',
        judge: '',
    });

    const { data } = useQuery({
        queryKey: ['branch'],
        queryFn: () => getBranch(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBranch(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branch"] });
            messageApi.success("Court Branch deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Court Branch");
        },
    });

    const { mutate: editCourtBranch, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: BranchProps) =>
            patchCourtBranch(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court-branch"] });
            messageApi.success("Court Branch updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Court Branch");
        },
    });

    const handleEdit = (record: BranchProps) => {
        setBranch(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    }
    const handleUpdate = (values: any) => {
        if (branch && branch.id) {
            const updatedCourtBranch: BranchProps = {
                ...branch,
                ...values,
            };
            editCourtBranch(updatedCourtBranch);
        } else {
            messageApi.error("Selected Court Branch is invalid");
        }
    };

    const dataSource = data?.map((court_branch, index) => (
        {
            key: index + 1,
            id: court_branch?.id ?? 'N/A',
            court: court_branch?.court ?? 'N/A',
            region: court_branch?.region ?? 'N/A',
            province: court_branch?.province ?? 'N/A',
            branch: court_branch?.branch ?? 'N/A',
            judge: court_branch?.judge ?? 'N/A',
            updated_by: court_branch?.updated_by ?? 'N/A',
            updated_at: moment(court_branch?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        }
    )) || [];

    const filteredData = dataSource?.filter((court_branch) =>
        Object.values(court_branch).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<BranchProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Court',
            dataIndex: 'court',
            key: 'court',
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
        },
        {
            title: 'Judge',
            dataIndex: 'judge',
            key: 'judge',
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: BranchProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <AiOutlineEdit />
                    </Button>
                    <Button type="link" danger onClick={() => deleteMutation.mutate(record.id)}>
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ];

    const results = useQueries({
        queries: [
            {
                queryKey: ["court"],
                queryFn: () => getCourt(token ?? ""),
            },
            {
                queryKey: ["region"],
                queryFn: () => getJailRegion(token ?? ""),
            },
            {
                queryKey: ["province"],
                queryFn: () => getJail_Province(token ?? ""),
            },
        ],
    });

    const CourtData = results[0].data;
    const RegionData = results[1].data;
    const ProvinceData = results[2].data;

    const onCourtChange = (value: string) => {
        setBranch(prevForm => ({
            ...prevForm,
            court: value,
        }));
    }; 

    const onRegionChange = (value: string) => {
        setBranch(prevForm => ({
            ...prevForm,
            region: value,
            province: '', 
        }));
    };

    const onProvinceChange = (value: string) => {
        setBranch(prevForm => ({
            ...prevForm,
            province: value,
        }));
    };

    const filteredProvinces = ProvinceData?.filter(
        (province) => province.region
    );

    console.log("Selected Region:", branch.region);
    console.log("Filtered Provinces:", filteredProvinces);
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CourtBranch");
        XLSX.writeFile(wb, "CourtBranch.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Court', 'Branch', 'Judge', 'Region', 'Province']],
            body: dataSource.map(item => [item.key, item.court, item.branch, item.judge, item.region, item.province]),
        });
        doc.save('CourtBranch.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="CourtBranch.csv">
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
            printWindow.document.write('<h1>Court Branch Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Court</th><th>Branch</th><th>Judge</th><th>Region</th><th>Province</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.court}</td>
                    <td>${item.branch}</td>
                    <td>${item.judge}</td>
                    <td>${item.region}</td>
                    <td>${item.province}</td>

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
            <h1 className="text-3xl font-bold text-[#1E365D]">Court Branch</h1>
            <div className="flex justify-between items-center gap-2 my-4">
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
                <div className="flex-1 relative flex items-center justify-end">
                    <input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border border-gray-400 h-10 w-80 rounded-md px-2 active:outline-none focus:outline-none"
                    />
                    <LuSearch className="absolute right-[1%] text-gray-400" />
                </div>
                <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center" onClick={showModal}>
                    <GoPlus />
                    Add Court Branch
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Court Branch"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddCourtBranch onClose={handleCancel} />
            </Modal>
            <Modal
                title="Court Branch"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="court"
                    label="Court"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Court"
                        optionFilterProp="label"
                        onChange={onCourtChange}
                        options={CourtData?.map(court => (
                            {
                                value: court.id,
                                label: court?.court
                            }
                        ))}
                    />
                </Form.Item>
                <Form.Item
                    name="branch"
                    label="Court Branch"
                    rules={[{ required: true, message: "Please input the Court Branch" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="judge"
                    label="Judge"
                    rules={[{ required: true, message: "Please input a Judge" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="Region"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Region"
                        optionFilterProp="label"
                        onChange={onRegionChange}
                        options={RegionData?.map(region => ({
                            value: region.id,
                            label: region?.desc,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="province"
                    label="Province"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Province"
                        optionFilterProp="label"
                        onChange={onProvinceChange}
                        options={filteredProvinces?.map(province => ({
                            value: province.id,
                            label: province?.desc,
                        }))}
                        disabled={!branch.region}
                    />
                </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourtBranch;
