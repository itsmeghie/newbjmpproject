import { getPDLs, getVisitor_to_PDL_Relationship } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries } from "@tanstack/react-query";
import { Table, Modal } from "antd";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import PDLToVisitForm from "../../visitor_management/visitor-data-entry/PDLToVisitForm";
import { VisitorForm } from "@/lib/visitorFormDefinition";
import { ColumnsType } from "antd/es/table";
import { Sibling } from "@/lib/pdl-definitions";
import { getVisitor } from "@/lib/query";

type Props = {
    deletePdlToVisit: (index: number) => void;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    editPdlToVisitIndex: number | null;
    setEditPdlToVisitIndex: Dispatch<SetStateAction<number | null>>;
    visitorForm: VisitorForm;
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

type PdlToVisitTable = PdlToVisitForm[] | null

const UpdatePDLtoVisit = ({
    setVisitorForm,
    deletePdlToVisit,
    editPdlToVisitIndex,
    setEditPdlToVisitIndex,
    visitorForm
}: Props) => {
    const token = useTokenStore()?.token
    const [pdlToVisitModalOpen, setPdlToVisitModalOpen] = useState(false)
    const [pdlToVisitTableInfo, setPdlToVisitTableInfo] = useState<PdlToVisitTable>([])

    const results = useQueries({
        queries: [
            {
                queryKey: ['pdls'],
                queryFn: () => getPDLs(token ?? "")
            },
            {
                queryKey: ['realtionship-to-pdl'],
                queryFn: () => getVisitor_to_PDL_Relationship(token ?? "")
            },
            {
                queryKey: ['visitor', visitorForm.person_id],
                queryFn: () => getVisitor(token),
                enabled: !!visitorForm.person_id && !!token,
            },
        ]
    })

    const pdls = results?.[0]?.data
    const pdlsLoading = results?.[0]?.isLoading
    const visitorToPdlRelationship = results?.[1]?.data

    const handlePdlToVisitModalOpen = () => {
        setPdlToVisitModalOpen(true)
    }

    const handlePdlToVisitModalCancel = () => {
        setPdlToVisitModalOpen(false)
    }

    const handleEditAddress = (index: number) => {
        setEditPdlToVisitIndex(index);
        setPdlToVisitModalOpen(true);
    };

    const handleDeletePdl = (index: number) => {
        setPdlToVisitTableInfo(prev => prev?.filter((_, i) => i !== index) || []);
        deletePdlToVisit(index)
    };
    
    const pdlToVisitDataSource = pdlToVisitTableInfo?.map((pdl, index) => {
        return ({
            key: index,
            lastname: pdl?.lastName,
            firstName: pdl?.firstName,
            middleName: pdl?.middleName,
            relationship: visitorToPdlRelationship?.find(relation => relation?.id === pdl?.relationship)?.relationship_name ?? "N/A",
            level: pdl?.level,
            annex: pdl?.annex,
            dorm: pdl?.dorm,
            visitationStatus: pdl?.visitationStatus,
            birthClassClassification: pdl?.multipleBirthClass?.multiple_birth_class,
            action: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleEditAddress(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                        onClick={() => handleDeletePdl(index)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const visitorToPdlRelationshipColumns: ColumnsType<{
        key: number;
        lastname: string | null;
        firstName: string | null;
        middleName: string | null;
        relationship: string | null;
        level: string | null;
        annex: string | null;
        dorm: string | null;
        visitationStatus: string | null;
        birthClassClassification: string | undefined;
        action: JSX.Element;
    }> = [
            {
                title: 'Last Name',
                dataIndex: 'lastname',
                key: 'lastname',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Middle Name',
                dataIndex: 'middleName',
                key: 'middleName',
            },
            {
                title: 'Relationship to PDL',
                dataIndex: 'relationship',
                key: 'relationship',
            },
            {
                title: 'Level',
                dataIndex: 'level',
                key: 'level',
            },
            {
                title: 'Annex',
                dataIndex: 'annex',
                key: 'annex',
            },
            {
                title: 'Dorm',
                dataIndex: 'dorm',
                key: 'dorm',
            },
            {
                title: 'PDL Visitation Status',
                dataIndex: 'visitationStatus',
                key: 'visitationStatus',
            },
            {
                title: 'Multiple Birth Classification',
                dataIndex: 'birthClassClassification',
                key: 'multipleBirthClass',
            },
            {
                title: "Actions",
                key: "actions",
                align: 'center',
                dataIndex: 'action'
            },
        ];


    return (
        <div>
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add PDL To Visit"
                open={pdlToVisitModalOpen}
                onCancel={handlePdlToVisitModalCancel}
                footer={null}
                width="70%"
            >
                <PDLToVisitForm
                    visitorForm={visitorForm}
                    editPdlToVisitIndex={editPdlToVisitIndex}
                    handlePdlToVisitModalCancel={handlePdlToVisitModalCancel}
                    pdlToVisitTableInfo={pdlToVisitTableInfo || []}
                    setPdlToVisitTableInfo={setPdlToVisitTableInfo}
                    setVisitorForm={setVisitorForm}
                    visitorToPdlRelationship={visitorToPdlRelationship || []}
                    pdls={pdls || []}
                    pdlsLoading={pdlsLoading}
                />
            </Modal>
            <div className="w-full">
                {/* PDL to Visit */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>PDL to Visit</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            type="button"
                            onClick={handlePdlToVisitModalOpen}
                        >
                            <Plus />
                            Add PDL To Visit
                        </button>
                    </div>
                    <Table
                        className="border text-gray-200 rounded-md"
                        dataSource={pdlToVisitDataSource}
                        columns={visitorToPdlRelationshipColumns}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default UpdatePDLtoVisit;