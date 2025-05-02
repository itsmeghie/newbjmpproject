import { getJail_Municipality, getJail_Province, getJailRegion, getPrecincts, getRecord_Status, getUser } from "@/lib/queries";
import { deletePrecincts, patchPrecinct } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import AddPrecinct from "./AddPrecinct";
import bjmp from '../../../assets/Logo/QCJMD.png'

export type PolicePrecinct = {
    id: number;
    region: string;
    province: string;
    city_municipality: string;
    record_status: string;
    updated_at: string;
    precinct_id: string;
    precinct_name: string;
    coverage_area: string;
    updated_by: number | null;

    region_id: number | null;
    province_id: number | null;
    city_municipality_id: number | null;
    record_status_id: number | null;
};

const Precinct = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectPrecinct, setSelectedPrecinct] = useState<PolicePrecinct>({
        id: 0,
        region: '',
        province: '',
        city_municipality: '',
        record_status: '',
        updated_at: '',
        precinct_id: '',
        precinct_name: '',
        coverage_area: '',
        updated_by: null,

        region_id: null,
        province_id: null,
        city_municipality_id: null,
        record_status_id: null,
    });
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ['precinct'],
        queryFn: () => getPrecincts(token ?? ""),
    });

    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deletePrecincts(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["precincts"] });
            messageApi.success("Precincts deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Precincts");
        },
    });

    const { mutate: editPrecincts, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: PolicePrecinct) =>
            patchPrecinct(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["precinct"] });
            messageApi.success("Precinct updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Precinct");
        },
    });

    const handleEdit = (record: PolicePrecinct) => {
        setSelectedPrecinct(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectPrecinct && selectPrecinct.id) {
            const updatedGangAffiliation: PolicePrecinct = {
                ...selectPrecinct,
                ...values,
            };
            editPrecincts(updatedGangAffiliation);
        } else {
            messageApi.error("Selected Precinct is invalid");
        }
    };

    const dataSource = data?.map((precincts, index) => ({
        key: index + 1,
        id: precincts?.id,
        precinct_id: precincts?.precinct_id ?? 'N/A',
        precinct_name: precincts?.precinct_name ?? 'N/A',
        region: precincts?.region ?? 'N/A',
        province: precincts?.province ?? 'N/A',
        city_municipality: precincts?.city_municipality ?? 'N/A',
        coverage_area: precincts?.coverage_area ?? 'N/A',
        updated_at: moment(precincts?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        updated_by: precincts?.updated_by ?? 'N/A',
        organization: precincts?.organization ?? 'Bureau of Jail Management and Penology',
        updated: `${UserData?.first_name ?? ''} ${UserData?.last_name ?? ''}`,
    })) || [];

    const filteredData = dataSource?.filter((gang_affiliation) =>
        Object.values(gang_affiliation).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

        const columns: ColumnsType<PolicePrecinct> = [
            {
                title: 'No.',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Precinct ID',
                dataIndex: 'precinct_id',
                key: 'precinct_id',
            },
            {
                title: 'Precinct Name',
                dataIndex: 'precinct_name',
                key: 'precinct_name',
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
                title: 'City /Municipality',
                dataIndex: 'city_municipality',
                key: 'city_municipality',
            },
            {
                title: 'Coverage Area',
                dataIndex: 'coverage_area',
                key: 'coverage_area',
            },
            {
                title: "Updated At",
                dataIndex: "updated_at",
                key: "updated_at",
                render: (value) =>
                    value !== 'N/A' ? moment(value).format("MMMM D, YYYY h:mm A") : "N/A",
            },
            {
                title: 'Updated By',
                dataIndex: 'updated_by',
                key: 'updated_by',
            },
            {
                title: "Action",
                key: "action",
                render: (_, record) => (
                    <div className="flex gap-2">
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
        ];
        const handleExportExcel = () => {
            const exportData = dataSource.map(({ id, updated, organization, ...rest }) => rest); 
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Precinct");
            XLSX.writeFile(wb, "Precinct.xlsx");
        };
    
        const handleExportPDF = () => {
            const doc = new jsPDF();
            const headerHeight = 48;
            const footerHeight = 32;
            const organizationName = dataSource[0]?.organization || ""; 
            const PreparedBy = dataSource[0]?.updated || ''; 
        
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const reportReferenceNo = `TAL-${formattedDate}-XXX`;
        
            const maxRowsPerPage = 28; 
        
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
                doc.text("Police Precinct Report", 10, 15); 
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
                item.precinct_id,
                item.precinct_name,
            ]);
        
            for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
                const pageData = tableData.slice(i, i + maxRowsPerPage);
        
                autoTable(doc, { 
                    head: [['No.','Precinct No.', 'Police Precinct']],
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
                    <CSVLink data={dataSource.map(({ id, organization,updated, ...rest }) => rest)} filename="Precinct.csv">
                        Export CSV
                    </CSVLink>
                </Menu.Item>
            </Menu>
        );
    
        const results = useQueries({
            queries: [
                {
                    queryKey: ["region"],
                    queryFn: () => getJailRegion(token ?? ""),
                },
                {
                    queryKey: ["province"],
                    queryFn: () => getJail_Province(token ?? ""),
                },
                {
                    queryKey: ["municipality"],
                    queryFn: () => getJail_Municipality(token ?? ""),
                },
                {
                    queryKey: ['record-status'],
                    queryFn: () => getRecord_Status(token ?? "")
                },
            ],
        });
    
        const regionData = results[0].data;
        const provinceData = results[1].data;
        const municipalityData = results[2].data;
        const recordStatusData = results[3].data;

        useEffect(() => {
            if (selectPrecinct) {
                form.setFieldsValue({
                    region: selectPrecinct.region || '',
                    province: selectPrecinct.province || '',
                    city_municipality: selectPrecinct.city_municipality || '',
                    record_status: selectPrecinct.record_status || '',
                    updated_at: selectPrecinct.updated_at || '',
                    precinct_id: selectPrecinct.precinct_id || '',
                    precinct_name: selectPrecinct.precinct_name || '',
                    coverage_area: selectPrecinct.coverage_area || '',
                    updated_by: selectPrecinct.updated_by ?? null,
                    region_id: selectPrecinct.region_id ?? null,
                    province_id: selectPrecinct.province_id ?? null,
                    city_municipality_id: selectPrecinct.city_municipality_id ?? null,
                    record_status_id: selectPrecinct.record_status_id ?? null,
                });
            }
        }, [selectPrecinct, form]);
        

        const onRegionChange = (value: number) => {
            setSelectedPrecinct(prevForm => ({
                ...prevForm,
                region_id: value,
                province_id: null, 
                city_municipality_id: null,
            }));
        };
    
        const onProvinceChange = (value: number) => {
            setSelectedPrecinct(prevForm => ({
                ...prevForm,
                province_id: value,
                city_municipality_id: null
            }));
        };
    
        const onMunicipalityChange = (value: number) => {
            setSelectedPrecinct(prevForm => ({
                ...prevForm,
                city_municipality_id: value,
            }));
        };
        const onRecordStatusChange = (value: number) => {
            setSelectedPrecinct(prevForm => ({
                ...prevForm,
                record_status_id: value,
            }));
        };
    
        const filteredProvinces = provinceData?.filter(
            (province) => province.region === selectPrecinct.region_id
        );
    
        const filteredMunicipality = municipalityData?.filter(
            (city_municipality) => city_municipality.province === selectPrecinct.province_id
        );

    return (
        <div>
            {contextHolder}
            <h1 className="text-2xl font-bold text-[#1E365D]">Precinct</h1>
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
                    <Input
                        placeholder="Search Precinct..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                            >
                        <GoPlus />
                            Add Precinct
                    </button>
                </div>
            </div>
            <Table dataSource={filteredData} columns={columns} />
            <Modal
                title="Police Precinct Report"
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
            <Modal
                title="Precinct"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" className="grid grid-cols-1 md:grid-cols-2 md:space-x-2" onFinish={handleUpdate}>
                <Form.Item
                    name="precinct_id"
                    label="Precinct ID"
                    rules={[{ required: true, message: "Please input the Precinct ID" }]}
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="precinct_name"
                    label="Precinct Name"
                    rules={[{ required: true, message: "Please input the Precinct name" }]}
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="coverage_area"
                    label="Coverage Area"
                    rules={[{ required: true, message: "Please input the Coverage Area" }]}
                >
                    <Input className="h-[3rem] w-full"/>
                </Form.Item>
                <Form.Item
                    name="region_id"
                    label="Region"
                    rules={[{ required: true, message: "Please input the Region" }]}
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Region"
                        optionFilterProp="label"
                        onChange={onRegionChange}
                        options={regionData?.map(region => ({
                            value: region.id,
                            label: region?.desc,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="province_id"
                    label="Province"
                    rules={[{ required: true, message: "Please input the Province" }]}
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Province"
                        optionFilterProp="label"
                        value={selectPrecinct.province_id ?? undefined}
                        onChange={onProvinceChange}
                        options={filteredProvinces?.map(province => ({
                            value: province.id,
                            label: province?.desc,
                        }))}
                        disabled={!selectPrecinct.region_id}
                    />
                </Form.Item>
                <Form.Item
                    name="city_municipality_id"
                    label="City / Municipality"
                    rules={[{ required: true, message: "Please input the City / Municipality" }]}
                >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="City / Municipality"
                        optionFilterProp="label"
                        value={selectPrecinct.city_municipality_id ?? undefined}
                        onChange={onMunicipalityChange}
                        options={filteredMunicipality?.map(municipality => ({
                            value: municipality.id,
                            label: municipality?.desc,
                        }))}
                        disabled={!selectPrecinct.province_id}
                    />
                </Form.Item>
                <Form.Item
                    label="Record Status"
                    name="record_status"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        options={recordStatusData?.map(status => (
                            {
                                value: status.id,
                                label: status?.status
                            }
                        ))}/>
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Precinct"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddPrecinct onClose={handleCancel} />
            </Modal>
        </div>
    )
}

export default Precinct
