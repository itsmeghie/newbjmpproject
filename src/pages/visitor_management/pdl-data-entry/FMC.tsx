import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import React, { SetStateAction, useState } from "react";
import FMCForm from "./FMCForm";
import { FamilyRelativesContactsForm } from "@/lib/visitorFormDefinition";
import { Person } from "@/lib/pdl-definitions";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery } from "@tanstack/react-query";
import { getVisitor_to_PDL_Relationship } from "@/lib/queries";
import { Prefix, Suffix } from "@/lib/definitions";

export type HasPersonRelationships = {
    person_relationship_data: FamilyRelativesContactsForm[];
};

type Props<T extends HasPersonRelationships> = {
    prefixes: Prefix[] | null;
    suffixes: Suffix[] | null;
    persons: Person[] | null;
    personsLoading: boolean;
    pdlForm: T;
    setPdlForm: React.Dispatch<SetStateAction<T>>;
};

const FMC = <T extends HasPersonRelationships>({
    persons,
    personsLoading,
    pdlForm,
    setPdlForm,
    prefixes,
    suffixes
}: Props<T>) => {

    const token = useTokenStore()?.token

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)

    const { data: relationships, isLoading: relationshipsLoading } = useQuery({
        queryKey: ['relationships'],
        queryFn: () => getVisitor_to_PDL_Relationship(token ?? "")
    })

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
    }

    const handleEdit = (index: number) => {
        setEditIndex(index)
        setIsModalOpen(true)
    }

    const handleDelete = (index: number) => {
        Modal.confirm({
            title: "Are you sure you want to delete this case?",
            content: "This action cannot be undone.",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                setPdlForm(prev => ({
                    ...prev,
                    person_relationship_data: prev.person_relationship_data?.filter((_, i) => i !== index) || []
                }));
            }
        });
    };


    const contactDataSource = pdlForm?.person_relationship_data.map((item, index) => {
        const specificPerson = persons?.find(person => person?.id === item?.person_id)

        return ({
            key: index,
            relationship: relationships?.find(relationship => relationship?.id === item?.relationship_id)?.relationship_name,
            lastName: specificPerson?.last_name,
            firsName: specificPerson?.first_name,
            middleName: specificPerson?.middle_name,
            address: `${specificPerson?.addresses[0]?.street ?? ""} ${specificPerson?.addresses[0]?.barangay ?? ""} ${specificPerson?.addresses[0]?.city_municipality ?? ""} ${specificPerson?.addresses[0]?.province ?? ""}`,
            mobileNumber: specificPerson?.contacts[0]?.value,
            contactPerson: item?.contact_person ? "Yes" : "No",
            remarks: item?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })
    const contactColumn: ColumnsType<{
        key: number;
        relationship: string | undefined;
        lastName: string | undefined;
        firsName: string | undefined;
        middleName: string | undefined;
        address: string | undefined;
        mobileNumber: string | undefined;
        contactPerson: string | null;
        remarks: string | null;
        actions: JSX.Element
    }> = [
            {
                title: 'Relationship',
                dataIndex: 'relationship',
                key: 'relationship',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'First Name',
                dataIndex: 'firsName',
                key: 'firsName',
            },
            {
                title: 'Middle Name',
                dataIndex: 'middleName',
                key: 'middleName',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Mobile Number',
                dataIndex: 'mobileNumber',
                key: 'mobileNumber',
            },
            {
                title: 'Contact Person',
                dataIndex: 'contactPerson',
                key: 'contactPerson',
            },
            {
                title: 'Notes/ Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Actions",
                dataIndex: 'actions',
                key: "actions",
                align: 'center',
            },
        ];


    return (
        <div className="flex flex-col gap-5 mt-10">
            <div className="flex justify-between">
                <h1 className='font-bold text-xl'>Family, Relatives, & Contacts</h1>
                <button
                    type="button"
                    onClick={handleModalOpen}
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                >
                    <Plus />
                    Add Family, Relatives, & Contacts
                </button>
            </div>
            <div>
                <Table
                    className="border text-gray-200 rounded-md"
                    dataSource={contactDataSource}
                    columns={contactColumn}
                    scroll={{ x: 800 }}
                />
            </div>

            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={editIndex !== null ? "Edit Family, Relatives & Contacts" : "Add Family, Relatives & Contacts"}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="70%"
            >
                <FMCForm
                    setEditIndex={setEditIndex}
                    handleModalClose={handleModalClose}
                    editIndex={editIndex}
                    prefixes={prefixes}
                    suffixes={suffixes}
                    persons={persons}
                    personsLoading={personsLoading}
                    relationships={relationships || []}
                    relationshipsLoading={relationshipsLoading}
                    pdlForm={pdlForm}
                    setPdlForm={setPdlForm}
                />
            </Modal>
        </div>
    )
}

export default FMC;