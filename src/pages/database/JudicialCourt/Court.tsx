import { Button, Form, Input, message, Modal, Table } from "antd"
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import { MdOutlineFileOpen } from "react-icons/md"
import AddCourt from "./AddCourt";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCourt, getCourt } from "@/lib/queries";
import { patchCourt } from "@/lib/query";
import moment from "moment";
import { ColumnType } from "antd/es/table";

type EditCourt = {
    id: number
    court: string;
    description: string;
    code: string;
    jurisdiction: string;
    example_offenses: string;
    relevance_to_pdl: string;
    court_level: string;
};

const Court = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectEditCourt, setSelectedEditCourt] = useState<EditCourt>({
        id: 0,
        court: '',
        description: '',
        code: '',
        jurisdiction: '',
        example_offenses: '',
        relevance_to_pdl: '',
        court_level: '',
    })

    const { data } = useQuery({
        queryKey: ['court'],
        queryFn: () => getCourt(token ?? ""),
    })

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCourt(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court"] });
            messageApi.success("Court deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Court");
        },
    });

    const { mutate: editCourt, isLoading: isUpdating } = useMutation({
        mutationFn: (updated: EditCourt) =>
            patchCourt(token ?? "", updated.id, updated),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court"] });
            messageApi.success("Court updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => {
            messageApi.error("Failed to update Court");
        },
    });

    const handleEdit = (record: EditCourt) => {
        setSelectedEditCourt(record);
        form.setFieldsValue(record);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (values: any) => {
        if (selectEditCourt && selectEditCourt.id) {
            const updateCourt: EditCourt = {
                ...selectEditCourt,
                ...values,
            };
            editCourt(updateCourt);
        } else {
            messageApi.error("Selected Court is invalid");
        }
    };
    const dataSource = data?.map((court, index) => (
        {
            key: index + 1,
            id: court?.id ?? 'N/A',
            court: court?.court ?? 'N/A',
            description: court?.description ?? 'N/A',
            updated_by: court?.updated_by ?? 'N/A',
            updated_at: moment(court?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        }
    )) || [];

    const filteredData = dataSource?.filter((court) =>
        Object.values(court).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnType<EditCourt> = [
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            fixed: "right",
            render: (_: any, record: EditCourt) => (
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
    ]

    return (
        <div>
            {contextHolder}
            <div className="flex justify-end items-center gap-2 mb-2">
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
                    Add Judicial Court
                </button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                scroll={{ x: "max-content" }}
            />
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Judicial Court"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                >
                <AddCourt onClose={handleCancel}/>
            </Modal>
            <Modal
                title="Judicial Court"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={isUpdating}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                    name="court"
                    label="Judicial Court Name"
                    rules={[{ required: true, message: "Please input the Judicial Court name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input a description" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Court
