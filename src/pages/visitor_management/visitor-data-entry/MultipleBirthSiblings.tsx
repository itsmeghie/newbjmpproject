import { MultiBirthSiblingForm as MultiBirthSiblingFormType, PersonForm } from "@/lib/visitorFormDefinition"
import { Modal, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import { Plus } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import MultiBirthSiblingForm from "./MultiBirthSiblingForm"
import { Gender, Person } from "@/lib/pdl-definitions"
import { MultipleBirthClassType, Prefix, Suffix } from "@/lib/definitions"

type Props = {
    handleDeleteMultipleBirthSibling: (index: number) => void;
    persons: Person[];
    genders: Gender[]
    personsLoading: boolean;
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    personForm: PersonForm;
    birthClassTypes: MultipleBirthClassType[];
    birthClassTypesLoading: boolean;
    prefixes: Prefix[];
    suffixes: Suffix[];
}

export type TableInfo = {
    sibling_group: string;
    short_name: string;
    gender: string;
    identical: string;
    verified: string;
}

export type MultiBirthSibling = TableInfo[] | null;

const MultipleBirthSiblings = ({
    handleDeleteMultipleBirthSibling,
    setPersonForm,
    persons,
    birthClassTypes,
    birthClassTypesLoading,
    genders,
    personsLoading,
    prefixes,
    suffixes,
    personForm
}: Props) => {
    const [idsModalOpen, setIdsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)

    const handleModalOpen = (index?: number) => {
        if (index !== undefined) {
            setIsEditing(true)
            setEditIndex(index)
        } else {
            setIsEditing(false)
            setEditIndex(null)
        }
        setIdsModalOpen(true)
    }

    const handleModalClose = () => {
        setIdsModalOpen(false)
        setIsEditing(false)
        setEditIndex(null)
    }

    const [tableInfo, setTableInfo] = useState<MultiBirthSibling>([])

    const handleEditMultipleBirthSibling = (index: number, updatedData: MultiBirthSiblingFormType) => {
        // Update the personForm
        setPersonForm(prev => {
            const updatedSiblings = [...(prev.multiple_birth_sibling_data || [])];
            updatedSiblings[index] = updatedData;
            return {
                ...prev,
                multiple_birth_sibling_data: updatedSiblings
            };
        });

        // Update the table info
        setTableInfo(prev => {
            const updatedTableInfo = [...(prev || [])];
            const chosenSibling = persons?.find(person => person?.id === updatedData.person_id);
            updatedTableInfo[index] = {
                sibling_group: chosenSibling?.multiple_birth_siblings?.[0]?.multiple_birth_class || "",
                short_name: chosenSibling?.shortname || "",
                gender: chosenSibling?.gender?.gender_option || "",
                identical: updatedData?.is_identical ? "Yes" : "No",
                verified: updatedData?.is_verified ? "Yes" : "No",
            };
            return updatedTableInfo;
        });
    };

    const IdentifierDataSource = tableInfo?.map((info, index) => {
        return ({
            key: index,
            siblingGroup: info?.sibling_group ?? "N/A",
            shortName: info?.short_name ?? "N/A",
            gender: info?.gender ?? "N/A",
            identical: info?.identical ?? "N/A",
            verified: info?.verified ?? "N/A",
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                        onClick={() => handleModalOpen(index)}
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        onClick={() => {
                            setTableInfo(prev => (prev ? prev.filter((_, i) => i !== index) : []));
                            handleDeleteMultipleBirthSibling(index)
                        }}
                        type="button"
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const identifierColumn: ColumnsType<{
        siblingGroup: string;
        shortName: string;
        gender: string;
        identical: string;
        verified: string;
        actions: JSX.Element;
    }> = [
            {
                title: 'Sibling Group',
                dataIndex: 'siblingGroup',
                key: 'siblingGroup',
            },
            {
                title: 'Short Name',
                dataIndex: 'shortName',
                key: 'shortName',
            },
            {
                title: 'Gender',
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: 'Identical (Y/N)',
                dataIndex: 'identical',
                key: 'identical',
            },
            {
                title: 'Verified (Y/N)',
                dataIndex: 'verified',
                key: 'verified',
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
                title={isEditing ? "Edit Sibling" : "Add Sibling"}
                open={idsModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="50%"
            >
                <MultiBirthSiblingForm
                    personForm={personForm}
                    personLoading={personsLoading}
                    prefixes={prefixes}
                    suffixes={suffixes}
                    setTableInfo={setTableInfo}
                    birthClassTypesLoading={birthClassTypesLoading}
                    genders={genders}
                    birthClassTypes={birthClassTypes}
                    persons={persons}
                    setPersonForm={setPersonForm}
                    handleIdsModalCancel={handleModalClose}
                    isEditing={isEditing}
                    editIndex={editIndex}
                    handleEditMultipleBirthSibling={handleEditMultipleBirthSibling}
                />
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className='font-bold text-xl'>Multiple Birth Sibling(s)</h1>
                <button
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                    type="button"
                    onClick={() => handleModalOpen()}
                >
                    <Plus />
                    Add Sibling
                </button>
            </div>
            <Table
                className="border text-gray-200 rounded-md"
                dataSource={IdentifierDataSource}
                columns={identifierColumn}
                scroll={{ x: 800 }}
            />
        </div>
    )
}

export default MultipleBirthSiblings