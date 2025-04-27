import { Modal, Table } from 'antd';
import React, { SetStateAction, useState } from 'react'
import IdForm from './IdForm';
import { useTokenStore } from '@/store/useTokenStore';
import { useQuery } from '@tanstack/react-query';
import { getIdTypes } from '@/lib/queries';
import { Plus } from 'lucide-react';
import { PersonForm } from '@/lib/visitorFormDefinition';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFullscreen } from 'react-icons/ai';
import { ColumnsType } from 'antd/es/table';

type Props = {
    personForm: PersonForm
    setPersonForm: React.Dispatch<SetStateAction<PersonForm>>
}

const Identifiers = ({ personForm, setPersonForm }: Props) => {
    const token = useTokenStore()?.token

    const idFullscreenHandle = useFullScreenHandle()

    const [idIndexToEdit, setIdIndexToEdit] = useState<number | null>(null);
    const [idsModalOpen, setIdsModalOpen] = useState(false)

    const { data: idTypes } = useQuery({
        queryKey: ['id-types'],
        queryFn: () => getIdTypes(token ?? "")
    })

    const handleIdsModalOpen = () => {
        setIdsModalOpen(true)
    }

    const handleIdsModalCancel = () => {
        setIdsModalOpen(false)
    }

    const handleIdRequirement = (index: number) => {
        setIdIndexToEdit(index);
        setIdsModalOpen(true); // or however you open the modal
    };

    const IdentifierDataSource = personForm?.media_identifier_data?.map((identififier, index) => {
        return ({
            key: index,
            requirement: idTypes?.find(id => id?.id === identififier?.id_type_id)?.id_type,
            description: identififier?.media_data?.media_description,
            image: (
                identififier?.media_data?.media_base64 ? (
                    <FullScreen handle={idFullscreenHandle} className="flex items-center justify-center">
                        <img
                            src={`data:image/bmp;base64,${identififier?.media_data?.media_base64}`}
                            alt="Identifier"
                            style={{
                                width: idFullscreenHandle?.active ? '50%' : '50px',
                                height: idFullscreenHandle?.active ? '50%' : '50px',
                                objectFit: 'cover'
                            }}
                        />
                    </FullScreen>
                ) : (
                    <span>No Image Available</span>
                )
            ),
            verificationStatus: identififier?.status,
            remarks: identififier?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleIdRequirement(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={idFullscreenHandle?.enter}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineFullscreen />
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteMediaIdentifierByIndex(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const identifierColumn: ColumnsType<{
        key: number;
        requirement: string | undefined;
        description: string | undefined;
        image: JSX.Element;
        verificationStatus: "Under Review" | "Rejected" | "Approved" | "Pending";
        remarks: string;
        actions: JSX.Element;
    }> = [
            {
                title: 'Requirement',
                dataIndex: 'requirement',
                key: 'requirement',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Scanned Image',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
            },
            {
                title: 'Verification Status',
                dataIndex: 'verificationStatus',
                key: 'verificationStatus',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Actions",
                key: "actions",
                dataIndex: "actions",
                align: 'center',
            },
        ];


    return (
        <div className='w-full'>
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add an ID"
                open={idsModalOpen}
                onCancel={handleIdsModalCancel}
                footer={null}
                width="50%"
            >
                <IdForm
                    editRequirement={personForm?.media_identifier_data?.[idIndexToEdit ?? -1] ?? null}
                    idIndexToEdit={idIndexToEdit}
                    setPersonForm={setPersonForm}
                    idTypes={idTypes || []}
                    handleIdsModalCancel={handleIdsModalCancel}
                />
            </Modal>

            <div className="flex flex-col gap-5 mt-10">
                <div className="flex justify-between items-center">
                    <h1 className='font-bold text-xl'>Identifiers</h1>
                    <button
                        className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                        type="button"
                        onClick={handleIdsModalOpen}
                    >
                        <Plus />
                        Add Indentifiers
                    </button>
                </div>
                <Table
                    className="border text-gray-200 rounded-md"
                    dataSource={IdentifierDataSource}
                    columns={identifierColumn}
                    scroll={{ x: 800 }}
                />
            </div>
        </div>
    )
}

export default Identifiers