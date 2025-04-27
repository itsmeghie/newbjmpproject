import { getPersonnelTypes } from "@/lib/additionalQueries"
import { PersonnelForm } from "@/lib/issues-difinitions"
import { getPersonnel, getPositions, getRank } from "@/lib/queries"
import { deletePersonnel, patchPersonnel } from "@/lib/query"
import { useTokenStore } from "@/store/useTokenStore"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Form, Input, message, Modal, Select, Table } from "antd"
import { ColumnType } from "antd/es/table"
import { useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { GoPlus } from "react-icons/go"

type PersonnelFormValue = {
    id: number;
    organization_id: number,
    jail_id: number,
    person_id: number,
    rank_id: number,
    personnel_type_id: number,
    status_id: number,
    position_id: number,
    record_status_id: number,
    personnel_app_status_id: number,
    remarks_data: [
        {
        record_status_id: number,
        personnel: number,
        remarks: string
        }
    ],
    person_relationship_data: [
        {
        record_status_id: number,
        person_id: number,
        relationship_id: number,
        is_contact_person: string,
        remarks: string
        }
    ],
    id_number: string,
    shortname: string,
    date_joined: string
}
const Personnel = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectPersonnel, setSelctedPersonnel] = useState<PersonnelForm | null>(null);
    const [selectEditPersonnel, setEditSelectedPersonnel] = useState<PersonnelFormValue | null>(null);

    const { data } = useQuery({
        queryKey: ['personnel'],
        queryFn: () => getPersonnel(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
            organization: personnel?.organization ?? 'N/A',
            personnel_reg_no: personnel?.personnel_reg_no ?? 'N/A',
            person: `${personnel?.person?.first_name ?? 'N/A'} ${personnel?.person?.middle_name ?? ''} ${personnel?.person?.last_name ?? 'N/A'}`,
            shortname: personnel?.person?.shortname ?? 'N/A',
            personnel_type: personnel?.personnel_type ?? 'N/A',
            rank: personnel?.rank ?? 'N/A',
            gender: personnel?.person?.gender?.gender_option ?? 'N/A',
            position: personnel?.position ?? 'N/A',
            date_joined: personnel?.date_joined ?? 'N/A',
            record_status: personnel?.record_status ?? 'N/A',
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
            title: 'Person',
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
    
    return (
        <div>
            {contextHolder}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-[#1E365D]">Personnel</h1>
                <div className="flex gap-2 items-center">
                    <Input placeholder="Search Personnel..." value={searchText} className="py-2 md:w-64 w-full" onChange={(e) => setSearchText(e.target.value)} />
                </div>
            </div>
            <Table dataSource={filteredData} columns={columns} />
            <Modal open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} onOk={() => form.submit()} width="40%" confirmLoading={isUpdating} style={{overflowY: "auto" }} >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <h1 className="text-xl font-bold">Personnel Information</h1>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Form.Item name="personnel_reg_no" label="Registration No.">
                        <Input disabled className="h-12 w-full border border-gray-300 rounded-lg px-2"/>
                    </Form.Item>
                    <Form.Item
                    label="Personnel Type"
                    name="personnel_type_id"
                    >
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
                    <Form.Item
                    label="Rank"
                    name="rank_id"
                    >
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
                <Form.Item
                    label="Position"
                    name="position_id"
                    >
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Position"
                        optionFilterProp="label"
                        onChange={onPositionChange}
                        options={PositionData?.map(positiob => (
                            {
                                value: positiob.id,
                                label: positiob?.position_title,
                            }
                        ))}
                        />
                </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default Personnel
