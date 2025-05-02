import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Plus } from 'lucide-react';
import { ColumnsType } from 'antd/es/table';
import { RemarksForm as RemarksFormType, VisitorForm } from "@/lib/visitorFormDefinition";
import { UserAccounts } from "@/lib/definitions";
import { Dispatch, SetStateAction } from "react";
import RemarksForm from '../visitor-data-entry/RemarksForm'; 
import moment from 'moment'; // Import moment

type Props = {
    deleteRemarksByIndex: (index: number) => void;
    setVisitorForm: Dispatch<SetStateAction<any>>;
    currentUser: UserAccounts | null;
    visitorForm: VisitorForm;
}

const UpdateRemarks = ({ visitorForm, setVisitorForm, currentUser, deleteRemarksByIndex }: Props) => {
    const [idsModalOpen, setIdsModalOpen] = useState(false);
    const [remarksTableInfo, setRemarksTableInfo] = useState<RemarksFormType[]>([]);
    const [editingRemark, setEditingRemark] = useState<{ index: number, data: RemarksFormType } | null>(null);

    useEffect(() => {
        if (visitorForm?.remarks_data) {
            setRemarksTableInfo(visitorForm?.remarks_data);
        }
    }, [visitorForm?.remarks_data]);

    const handleModalOpen = () => {
        setIdsModalOpen(true);
    }

    const handleModalClose = () => {
        setIdsModalOpen(false);
        setEditingRemark(null);
    }

    const deleteRemark = (index: number) => {
        const updatedRemarks = [...remarksTableInfo];
        updatedRemarks.splice(index, 1);
        setRemarksTableInfo(updatedRemarks);
    }

    const remarksDataSource = remarksTableInfo?.map((remarks, index) => {
        return ({
            key: index,
            createdAt: moment(remarks?.created_at).format('YYYY-MM-DD HH:mm:ss'), // Format using moment
            createdBy: remarks?.created_by,
            remarks: remarks?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingRemark({ index, data: remarks });
                            handleModalOpen();
                        }}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            deleteRemarksByIndex(index);
                            deleteRemark(index);
                        }}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        });
    });

    const remarksColumn: ColumnsType<{
        createdAt: string | undefined;
        createdBy: string | undefined;
        remarks: string | null;
        actions: JSX.Element;
    }> = [
        {
            title: 'Time Stamp',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Created by',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'Notes/ Remarks',
            align: 'center',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '50%',
        },
        {
            title: "Actions",
            key: "actions",
            dataIndex: "actions",
            align: 'center',
        },
    ];

    return (
        <div className="flex flex-col gap-5 mt-10">
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={editingRemark ? "Edit Remarks" : "Add Remarks"}
                open={idsModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="50%"
            >
                {currentUser && (
                    <RemarksForm
                        setRemarksTableInfo={setRemarksTableInfo}
                        setVisitorForm={setVisitorForm}
                        currentUser={currentUser}
                        handleModalCancel={handleModalClose}
                        editingRemark={editingRemark}
                        setEditingRemark={setEditingRemark}
                    />
                )}
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className='font-bold text-xl'>Remarks</h1>
                <button
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                    type="button"
                    onClick={() => {
                        setEditingRemark(null); // Ensure we're not in edit mode
                        handleModalOpen();
                    }}
                >
                    <Plus />
                    Add Remarks
                </button>
            </div>
            <Table
                className="border text-gray-200 rounded-md"
                dataSource={remarksDataSource}
                columns={remarksColumn}
                scroll={{ x: 800 }}
            />
        </div>
    );
}

export default UpdateRemarks;