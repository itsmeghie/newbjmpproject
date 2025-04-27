import { deleteIssues, getImpactLevels, getImpacts, getIssueCategory, getIssues, getIssueStatuses, getReportingCategory, getRiskLevels, getSeverityLevel, patchIssues } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";

export type IssuesProps = {
    id: number | null;
    module: string;
    sub_module: string;
    reporting_category: string;
    issue_category: string;
    issue_severity_level: string;
    risk_level: string;
    impact_level: string;
    impact: string;
    issue_status: string;
    record_status: string;
    updated_at: string;
    module_affected: string;
    description: string;
    root_cause: string;
    date_reported: string; 
    reported_by: string;
    resolution: string;
    resolution_date: string; 
    notes: string;
    updated_by: number | null;
};

const Issues = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [issues, setIssues] = useState<IssuesProps>(
        {id: null,
        module: '',
        sub_module: '',
        reporting_category: '',
        issue_category: '',
        issue_severity_level: '',
        risk_level: '',
        impact_level: '',
        impact: '',
        issue_status: '',
        record_status: '',
        updated_at: '',
        module_affected: '',
        description: '',
        root_cause: '',
        date_reported: '', 
        reported_by: '',
        resolution: '',
        resolution_date: '', 
        notes: '',
        updated_by: null,}
    );

    const { data } = useQuery({
        queryKey: ['issues'],
        queryFn: () => getIssues(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteIssues(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
            messageApi.success("Issues deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Issues");
        },
    });

    const { mutate: editIssues, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: IssuesProps) =>
        patchIssues(token ?? "", updated.id, updated),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["issues"] });
        messageApi.success("Issues updated successfully");
        setIsEditModalOpen(false);
        },
        onError: () => {
        messageApi.error("Failed to update Issues");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["reporting-category"],
                queryFn: () => getReportingCategory(token ?? ""),
            },
            {
                queryKey: ["issue-category"],
                queryFn: () => getIssueCategory(token ?? ""),
            },
            {
                queryKey: ["issue-severity-level"],
                queryFn: () => getSeverityLevel(token ?? ""),
            },
            {
                queryKey: ["risk-level"],
                queryFn: () => getRiskLevels(token ?? ""),
            },
            {
                queryKey: ["impact-level"],
                queryFn: () => getImpactLevels(token ?? ""),
            },
            {
                queryKey: ["impact"],
                queryFn: () => getImpacts(token ?? ""),
            },
            {
                queryKey: ["issue-status"],
                queryFn: () => getIssueStatuses(token ?? ""),
            },
        ],
    });
        
    const ReportingCategoryData = results[0].data;
    const IssueCategoryData = results[1].data;
    const SeverityLevelData = results[2].data;
    const RiskLevelData = results[3].data;
    const ImpactLevelData = results[4].data;
    const ImpactData = results[5].data;
    const IssueStatusData = results[6].data;

    const handleEdit = (record: IssuesProps) => {
        setIssues(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (issues && issues.id) {
        const updatedIssues: IssuesProps = {
            ...issues,
            ...values,
        };
        editIssues(updatedIssues);
        } else {
        messageApi.error("Selected Issues is invalid");
        }
    };

    const onReportingCategoryChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            reporting_category: value,
        }));
    }; 

    const onIssueCateogryChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            issue_category: value,
        }));
    }; 

    const onSeverityLevelChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            issue_severity_level: value,
        }));
    }; 

    const onRiskLevelChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            risk_level: value,
        }));
    }; 

    const onImpactLevelChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            impact_level: value,
        }));
    }; 

    const onImpactChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            impact: value,
        }));
    }; 

    const onIssueStatusChange = (value: string) => {
        setIssues(prevForm => ({
            ...prevForm,
            issue_status: value,
        }));
    }; 

    const dataSource = data?.map((issues, index) => (
        {
            key: index + 1,
            id: issues?.id ?? 'N/A',
            issue_type: issues?.issue_type?.name ?? 'N/A',
            issue_category: issues?.issue_category?.name ?? 'N/A',
            risk: issues?.issue_type?.risk ?? 'N/A',
            status: issues?.status?.name ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((issues) =>
        Object.values(issues).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<IssuesProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Issue Type',
            dataIndex: 'issue_type',
            key: 'issue_type',
        },
        {
            title: 'Issue Category',
            dataIndex: 'issue_category',
            key: 'issue_category',
        },
        {
            title: 'Risk',
            dataIndex: 'risk',
            key: 'risk',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="link" onClick={() => handleEdit(record)}>
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
        XLSX.utils.book_append_sheet(wb, ws, "Issues");
        XLSX.writeFile(wb, "Issues.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Issue Type','Issue Category', 'Risk', 'Status' ]],
            body: dataSource.map(item => [item.key, item.issue_type, item.issue_category, item.risk, item.status]),
        });
        doc.save('Issues.pdf');
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Issues.csv">
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
            printWindow.document.write('<h1>Issues Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Issue Type</th><th>Issue Category</th><th>Risk</th><th>Status</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.issue_type}</td>
                    <td>${item.issue_category}</td>
                    <td>${item.risk}</td>
                    <td>${item.status}</td>
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
        {contextHolder}<h1 className="text-2xl font-bold text-[#1E365D]">Issues</h1>
        <div className="flex items-center justify-between my-4">
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
            <div className="flex gap-2 items-center">
                <Input
                    placeholder="Search Issues..."
                    value={searchText}
                    className="py-2 md:w-72 w-full"
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
            <Modal
                title="Edit Issues"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" className="grid grid-cols-1 md:grid-cols-2 md:space-x-2" onFinish={handleUpdate}>
                <Form.Item
                    name="name"
                    label="Issues Name"
                    rules={[{ required: true, message: "Please input the Issues name" }]}
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input a description" }]}
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="reporting_category"
                    label="Reporting Category"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Reporting Category"
                        optionFilterProp="label"
                        onChange={onReportingCategoryChange}
                        options={ReportingCategoryData?.map(reporting_cateogry => (
                            {
                                value: reporting_cateogry.id,
                                label: reporting_cateogry?.name
                            }
                        ))}
                    />
                </Form.Item>
                <Form.Item
                    name="issue_category"
                    label="Issue Category"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Issue Category"
                        optionFilterProp="label"
                        onChange={onIssueCateogryChange}
                        options={IssueCategoryData?.map(issue_category => ({
                            value: issue_category.id,
                            label: issue_category?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="issue_severity_level"
                    label="Severity Level"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Severity Level"
                        optionFilterProp="label"
                        onChange={onSeverityLevelChange}
                        options={SeverityLevelData?.map(level => ({
                            value: level.id,
                            label: level?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="risk_level"
                    label="Risk Level"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Risk Level"
                        optionFilterProp="label"
                        onChange={onRiskLevelChange}
                        options={RiskLevelData?.map(risk => ({
                            value: risk.id,
                            label: risk?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="impact_level"
                    label="Impact Level"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Impact Level"
                        optionFilterProp="label"
                        onChange={onImpactLevelChange}
                        options={ImpactLevelData?.map(impact => ({
                            value: impact.id,
                            label: impact?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="impact"
                    label="Impact"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Impact"
                        optionFilterProp="label"
                        onChange={onImpactChange}
                        options={ImpactData?.map(impact => ({
                            value: impact.id,
                            label: impact?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="issue_status"
                    label="Issue Status"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Issue Status"
                        optionFilterProp="label"
                        onChange={onIssueStatusChange}
                        options={IssueStatusData?.map(status => ({
                            value: status.id,
                            label: status?.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="notes"
                    label="Notes"
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="issue_status"
                    label="Issues Status"
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Issues Status"
                        optionFilterProp="label"
                        onChange={onIssueStatusChange}
                        options={IssueStatusData?.map(issue_status => (
                            {
                                value: issue_status.id,
                                label: issue_status?.name
                            }
                        ))}
                    />
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Issues"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
            </Modal>
        </div>
    )
}

export default Issues
