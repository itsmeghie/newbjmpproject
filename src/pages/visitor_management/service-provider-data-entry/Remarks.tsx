import { useState } from 'react';
import { Table, Modal } from 'antd';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Plus } from 'lucide-react';
import { ColumnsType } from 'antd/es/table';
import { ServiceProviderRemarksForm } from "@/lib/visitorFormDefinition";
import { UserAccounts } from "@/lib/definitions";
import { Dispatch, SetStateAction } from "react";
import RemarksForm from './RemarksForm'; // Adjust import path as needed
import { useQuery } from '@tanstack/react-query';
import { getServiceProviderRemarks } from '@/lib/additionalQueries';
import { useTokenStore } from '@/store/useTokenStore';

type Props = {
    deleteRemarksByIndex: (index: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setVisitorForm: Dispatch<SetStateAction<any>>;
    currentUser: UserAccounts | null;
}

const Remarks = ({ setVisitorForm, currentUser, deleteRemarksByIndex }: Props) => {
    const token = useTokenStore()?.token
    const [idsModalOpen, setIdsModalOpen] = useState(false);
    const [remarksTableInfo, setRemarksTableInfo] = useState<ServiceProviderRemarksForm[]>([]);
    const [editingRemark, setEditingRemark] = useState<{ index: number, data: ServiceProviderRemarksForm } | null>(null);

    const { data: spRemarks, isLoading: spRemarksLoading } = useQuery({
        queryKey: ['sp-remarks'],
        queryFn: () => getServiceProviderRemarks(token ?? "")
    })

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
            timestamp: remarks?.timestamp,
            createdBy: remarks?.created_by,
            remarks: spRemarks?.find(remark => remark?.id === remarks?.remark)?.remark ?? "N/A",
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
        })
    });

    const remarksColumn: ColumnsType<{
        timestamp: string | undefined;
        createdBy: string | undefined;
        remarks: string | null;
        actions: JSX.Element;
    }> = [
            {
                title: 'Time Stamp',
                dataIndex: 'timestamp',
                key: 'timestamp',
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
                width: '50%'
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
                        spRemarks={spRemarks || []}
                        spRemarksLoading={spRemarksLoading}
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

export default Remarks;