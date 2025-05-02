import { getIdTypes } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries } from "@tanstack/react-query";
import { Table, Modal } from "antd";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import RequirementsForm from "../visitor-data-entry/RequirementsForm";
import IdForm from "../visitor-data-entry/IdForm";
import { PersonForm, VisitorForm } from "@/lib/visitorFormDefinition";
import { ColumnsType } from "antd/es/table";
import { AiOutlineFullscreen } from "react-icons/ai";
import { Sibling } from "@/lib/pdl-definitions";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type Props = {
    deleteMediaRequirementByIndex: (index: number) => void;
    deleteMediaIdentifierByIndex: (index: number) => void;
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    personForm: PersonForm;
}

export type PdlToVisitForm = {
    lastName: string | null;
    firstName: string | null;
    middleName: string | null;
    relationship: number | null;
    level: string | null;
    annex: string | null;
    dorm: string | null;
    visitationStatus: string | null;
    multipleBirthClass: Sibling | null;
}

const UpdateRequirements = ({
    setPersonForm,
    personForm,
    deleteMediaIdentifierByIndex,
    deleteMediaRequirementByIndex,
}: Props) => {
    const token = useTokenStore()?.token

    const idFullscreenHandle = useFullScreenHandle()
    const requirementFullscreenHandle = useFullScreenHandle()

    const [requirementModalOpen, setRequirementModalOpen] = useState(false)
    const [idsModalOpen, setIdsModalOpen] = useState(false)

    const [requirementIndexToEdit, setRequirementIndexToEdit] = useState<number | null>(null);
    const [idIndexToEdit, setIdIndexToEdit] = useState<number | null>(null);

    const results = useQueries({
        queries: [
            {
                queryKey: ['id-types'],
                queryFn: () => getIdTypes(token ?? "")
            }
        ]
    })

    const idTypes = results?.[0]?.data

    const handleRequirementsModalOpen = () => {
        setRequirementIndexToEdit(null);
        setRequirementModalOpen(true)
    }

    const handleRequirementsModalCancel = () => {
        setRequirementIndexToEdit(null);
        setRequirementModalOpen(false)
    }

    const handleIdsModalOpen = () => {
        setIdsModalOpen(true)
    }

    const handleIdsModalCancel = () => {
        setIdsModalOpen(false)
    }

    const handleEditRequirement = (index: number) => {
        setRequirementIndexToEdit(index);
        setRequirementModalOpen(true); 
    };

    const handleIdRequirement = (index: number) => {
        setIdIndexToEdit(index);
        setIdsModalOpen(true); 
    };

    const requirementDataSources = personForm?.media_requirement_data?.map((requirement, index) => {
        return ({
            key: index,
            requirement: requirement?.name,
            description: requirement?.media_data?.media_description,
            image: (
                requirement?.media_data?.media_base64 ? (
                    <FullScreen handle={requirementFullscreenHandle} className="flex items-center justify-center">
                        <img
                            src={`data:image/bmp;base64,${requirement?.media_data?.media_base64}`}
                            alt="requirement"
                            style={{
                                width: requirementFullscreenHandle?.active ? '50%' : '50px',
                                height: requirementFullscreenHandle?.active ? '50%' : '50px',
                                objectFit: 'cover'
                            }}
                        />
                    </FullScreen>
                ) : (
                    <span>No Image Available</span>
                )
            ),
            verificationStatus: requirement?.status,
            remarks: requirement?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleEditRequirement(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={requirementFullscreenHandle?.enter}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineFullscreen />
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteMediaRequirementByIndex(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const requirementColumn: ColumnsType<{
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

    const IdentifierDataSource = personForm?.media_identifier_data?.map((identififier, index) => {
        return ({
            key: index,
            requirement: idTypes?.find(id => id?.id === identififier?.id_type_id)?.id_type || '',
            description: idTypes?.find(id => id?.id === identififier?.id_type_id)?.description || '',
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
        <div>
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Requirements"
                open={requirementModalOpen}
                onCancel={handleRequirementsModalCancel}
                footer={null}
                width="50%"
            >
                <RequirementsForm
                    editRequirement={personForm?.media_requirement_data?.[requirementIndexToEdit ?? -1] ?? null}
                    requirementIndexToEdit={requirementIndexToEdit}
                    handleRequirementsModalCancel={handleRequirementsModalCancel}
                    setPersonForm={setPersonForm}
                />
            </Modal>

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

            <div className="w-full">
                {/* Requirements */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>Requirements</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            type="button"
                            onClick={handleRequirementsModalOpen}
                        >
                            <Plus />
                            Add Requirements
                        </button>
                    </div>
                    <Table
                        className="border text-gray-200 rounded-md"
                        dataSource={requirementDataSources}
                        columns={requirementColumn}
                        scroll={{ x: 800 }}
                    />
                </div>

                {/* Identifiers */}
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
        </div>
    );
}

export default UpdateRequirements;