import { getPersonnelTypes } from "@/lib/additionalQueries";
import { PersonnelForm } from "@/lib/issues-difinitions";
import { getPersonnel, getPositions, getRank, getUser } from "@/lib/queries";
import { deletePersonnel, patchPersonnel } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select, Table } from "antd";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload } from "react-icons/go";
import bjmp from '../../../assets/Logo/QCJMD.png'

type PersonnelFormValue = {
    id: number;
    organization_id: number;
    jail_id: number;
    person_id: number;
    rank_id: number;
    personnel_type_id: number;
    status_id: number;
    position_id: number;
    record_status_id: number;
    personnel_app_status_id: number;
    remarks_data: [
        {
            record_status_id: number;
            personnel: number;
            remarks: string;
        }
    ];
    person_relationship_data: [
        {
            record_status_id: number;
            person_id: number;
            relationship_id: number;
            is_contact_person: string;
            remarks: string;
        }
    ];
    id_number: string;
    shortname: string;
    date_joined: string;
};

const Personnel = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectPersonnel, setSelctedPersonnel] = useState<PersonnelForm | null>(null);
    const [selectEditPersonnel, setEditSelectedPersonnel] = useState<PersonnelFormValue | null>(null);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['personnel'],
        queryFn: () => getPersonnel(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePersonnel(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personnel"] });
            messageApi.success("Personnel deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Personnel");
        },
    });

    const { mutate: editPersonnel, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: PersonnelFormValue) =>
            patchPersonnel(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personnel"] });
            messageApi.success("Personnel updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Personnel");
        },
    });

    const handleEdit = (record: any, original: PersonnelFormValue) => {
        setSelctedPersonnel(original);
        setEditSelectedPersonnel(original);
        form.setFieldsValue({
            personnel_reg_no: original.personnel_reg_no,
            personnel_type_id: original.personnel_type_id,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectEditPersonnel?.id) {
            const updatedPersonnel: PersonnelFormValue = {
                ...selectEditPersonnel,
                ...values,
            };
            console.log("Updating personnel with:", updatedPersonnel);
            editPersonnel(updatedPersonnel);
        } else {
            messageApi.error("Selected personnel is invalid");
        }
    };

    const dataSource = data?.map((personnel, index) => (
        {
            key: index + 1,
            organization: personnel?.organization ?? '',
            personnel_reg_no: personnel?.personnel_reg_no ?? '',
            person: `${personnel?.person?.first_name ?? ''} ${personnel?.person?.middle_name ?? ''} ${personnel?.person?.last_name ?? ''}`,
            shortname: personnel?.person?.shortname ?? '',
            personnel_type: personnel?.personnel_type ?? '',
            rank: personnel?.rank ?? '',
            gender: personnel?.person?.gender?.gender_option ?? '',
            position: personnel?.position ?? '',
            date_joined: personnel?.date_joined ?? '',
            record_status: personnel?.record_status ?? '',
            updated_by: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
        }
    )) || [];

    const filteredData = dataSource?.filter((personnel) =>
        Object.values(personnel).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnType<PersonnelForm> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Personnel No.',
            dataIndex: 'personnel_reg_no',
            key: 'personnel_reg_no',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Personnel',
            dataIndex: 'person',
            key: 'person',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Personnel Type',
            dataIndex: 'personnel_type',
            key: 'personnel_type',
        },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Date Joined',
            dataIndex: 'date_joined',
            key: 'date_joined',
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any, index) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        onClick={() => {
                            const original = data?.[index];
                            if (original) handleEdit(record, original);
                        }}
                    >
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteMutation.mutate(data?.[index]?.id)}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ];

    const results = useQueries({
        queries: [
            {
                queryKey: ["rank"],
                queryFn: () => getRank(token ?? ""),
            },
            {
                queryKey: ["position"],
                queryFn: () => getPositions(token ?? ""),
            },
            {
                queryKey: ["personnel-type"],
                queryFn: () => getPersonnelTypes(token ?? ""),
            },
        ],
    });

    const RankData = results[0].data;
    const PositionData = results[1].data;
    const PersonnelTypeData = results[2].data;

    const onRankChange = (value: number) => {
        setEditSelectedPersonnel(prevForm => ({
            ...prevForm,
            rank_id: value,
        }));
    };

    const onPositionChange = (value: number) => {
        setEditSelectedPersonnel(prevForm => ({
            ...prevForm,
            position_id: value,
        }));
    };

    const onPersonnelTypeChange = (value: number) => {
        setEditSelectedPersonnel(prevForm => ({
            ...prevForm,
            personnel_type_id: value,
        }));
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Personnel");
        XLSX.writeFile(wb, "Personnel.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const headerHeight = 48;
        const footerHeight = 32;
        const organizationName = dataSource[0]?.organization || ""; 
        const PreparedBy = dataSource[0]?.updated_by || ''; 
    
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const reportReferenceNo = `TAL-${formattedDate}-XXX`;
    
        const availableHeight = doc.internal.pageSize.height - headerHeight - footerHeight;
        const maxRowsPerPage = 29; 
    
        let startY = headerHeight;
    
        const addHeader = () => {
            const pageWidth = doc.internal.pageSize.getWidth(); 
            const imageWidth = 30;
            const imageHeight = 30; 
            const margin = 10; 
            const imageX = pageWidth - imageWidth - margin;
            const imageY = 12;
        
            doc.addImage(bjmp, 'PNG', imageX, imageY, imageWidth, imageHeight);
        
            doc.setTextColor(0, 102, 204);
            doc.setFontSize(16);
            doc.text("Personnel Report", 10, 15); 
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Organization Name: ${organizationName}`, 10, 25);
            doc.text("Report Date: " + formattedDate, 10, 30);
            doc.text("Prepared By: " + PreparedBy, 10, 35);
            doc.text("Department/ Unit: IT", 10, 40);
            doc.text("Report Reference No.: " + reportReferenceNo, 10, 45);
        };
        
    
        addHeader(); 
    
        const tableData = dataSource.map(item => [
            item.key,
            item.personnel_reg_no,
            item.person,
            item.rank,
            item.position,
            item.date_joined,
        ]);
    
        for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
            const pageData = tableData.slice(i, i + maxRowsPerPage);
    
            autoTable(doc, { 
                head: [['No.', 'Personnel Reg. No.', 'Personnel','Rank', 'Position', 'Date Joined']],
                body: pageData,
                startY: startY,
                margin: { top: 0, left: 10, right: 10 },
                didDrawPage: function (data) {
                    if (doc.internal.getCurrentPageInfo().pageNumber > 1) {
                        addHeader(); 
                    }
                },
            });
    
            if (i + maxRowsPerPage < tableData.length) {
                doc.addPage();
                startY = headerHeight;
            }
        }
    
        const pageCount = doc.internal.getNumberOfPages();
        for (let page = 1; page <= pageCount; page++) {
            doc.setPage(page);
            const footerText = [
                "Document Version: Version 1.0",
                "Confidentiality Level: Internal use only",
                "Contact Info: " + PreparedBy,
                `Timestamp of Last Update: ${formattedDate}`
            ].join('\n');
            const footerX = 10;
            const footerY = doc.internal.pageSize.height - footerHeight + 15;
            const pageX = doc.internal.pageSize.width - doc.getTextWidth(`${page} / ${pageCount}`) - 10;
            doc.setFontSize(8);
            doc.text(footerText, footerX, footerY);
            doc.text(`${page} / ${pageCount}`, pageX, footerY);
        }
    
        const pdfOutput = doc.output('datauristring');
        setPdfDataUrl(pdfOutput);
        setIsPdfModalOpen(true);
    };

    const handleClosePdfModal = () => {
        setIsPdfModalOpen(false);
        setPdfDataUrl(null); 
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="GangAffiliation.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            {contextHolder}
            <h1 className="text-2xl font-bold text-[#1E365D]">Personnel</h1>
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                    <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                            <GoDownload /> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white" onClick={handleExportPDF}>
                        Print Report
                    </button>
                </div>
                <div className="flex gap-2 items-center">
                    <Input placeholder="Search Personnel..." value={searchText} className="py-2 md:w-64 w-full" onChange={(e) => setSearchText(e.target.value)} />
                </div>
            </div>
            <Table dataSource={filteredData} columns={columns} />
            <Modal
                title="Position Report"
                open={isPdfModalOpen}
                onCancel={handleClosePdfModal}
                footer={null}
                width="80%"
            >
                {pdfDataUrl && (
                    <iframe
                        src={pdfDataUrl}
                        title="PDF Preview"
                        style={{ width: '100%', height: '80vh', border: 'none' }}
                    />
                )}
            </Modal>

            <Modal open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onOk={() => form.submit()} width="40%" confirmLoading={isUpdating} style={{ overflowY: "auto" }}>
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <h1 className="text-xl font-bold">Personnel Information</h1>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item name="personnel_reg_no" label="Registration No.">
                            <Input disabled className="h-12 w-full border border-gray-300 rounded-lg px-2" />
                        </Form.Item>
                        <Form.Item label="Personnel Type" name="personnel_type_id">
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Personnel Type"
                                optionFilterProp="label"
                                onChange={onPersonnelTypeChange}
                                options={PersonnelTypeData?.map(personnel_type => (
                                    {
                                        value: personnel_type.id,
                                        label: personnel_type?.name,
                                    }
                                ))}
                            />
                        </Form.Item>
                        <Form.Item label="Rank" name="rank_id">
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Rank"
                                optionFilterProp="label"
                                onChange={onRankChange}
                                options={RankData?.map(rank => (
                                    {
                                        value: rank.id,
                                        label: rank?.rank_name,
                                    }
                                ))}
                            />
                        </Form.Item>
                        <Form.Item label="Position" name="position_id">
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Position"
                                optionFilterProp="label"
                                onChange={onPositionChange}
                                options={PositionData?.map(position => (
                                    {
                                        value: position.id,
                                        label: position?.position_title,
                                    }
                                ))}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Personnel;