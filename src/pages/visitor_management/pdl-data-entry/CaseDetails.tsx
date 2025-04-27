import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { SetStateAction, useState } from "react";
import { PDLForm } from "@/lib/visitorFormDefinition";
import CaseDetailsForm from "./CaseDetailsForm";
import { useQuery } from "@tanstack/react-query";
import { getCourtBranches, getCrimeCategories, getLaws, getOffenses } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";

type Props = {
    setPdlForm: React.Dispatch<SetStateAction<PDLForm>>;
    pdlForm: PDLForm;
};

const CaseDetails = ({ pdlForm, setPdlForm }: Props) => {
    const token = useTokenStore()?.token
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const { data: courtBranches, isLoading: courtBranchesLoading } = useQuery({
        queryKey: ['court-branches'],
        queryFn: () => getCourtBranches(token ?? "")
    })

    const { data: offenses, isLoading: offensesLoading } = useQuery({
        queryKey: ['offenses'],
        queryFn: () => getOffenses(token ?? "")
    })

    const { data: crimeCategories, isLoading: crimeCategoriesLoading } = useQuery({
        queryKey: ['crime-categories'],
        queryFn: () => getCrimeCategories(token ?? "")
    })

    const { data: laws, isLoading: lawsLoading } = useQuery({
        queryKey: ['laws'],
        queryFn: () => getLaws(token ?? "")
    })

    const handleModalOpen = () => {
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setEditIndex(null);
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
                    case_data: prev.case_data?.filter((_, i) => i !== index) || []
                }));
            }
        });
    };



    const contactDataSource = pdlForm?.case_data?.map((pdlCase, index) => {
        return ({
            key: index,
            caseNumber: "xxxx-xxxx",
            offense: offenses?.find(offense => offense?.id === pdlCase?.offense_id)?.offense || "N/A",
            courtBranch: `${pdlCase?.court_name} ${courtBranches?.find(branch => branch?.id === pdlCase?.court_branch_id)?.branch}`,
            judge: pdlCase?.judge,
            bailRecommended: pdlCase?.bail_recommended,
            dateCrimeCommitted: pdlCase?.date_crime_committed,
            daysInDetention: pdlCase?.days_in_detention,
            dateArrested: pdlCase?.date_arrested,
            assignmentDate: pdlCase?.assignment_date,
            remark: pdlCase?.remarks,
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
        caseNumber: string | null;
        offense: string | null;
        courtBranch: string | null;
        judge: string | null;
        bailRecommended: string | null;
        dateCrimeCommitted: string | null;
        daysInDetention: string | number | null;
        dateArrested: string | null;
        assignmentDate: string | null;
        remark: string | null;
        actions: JSX.Element
    }> = [
            {
                title: 'Case No.',
                dataIndex: 'caseNumber',
                key: 'caseNumber',
            },
            {
                title: 'Offense',
                dataIndex: 'offense',
                key: 'offense',
            },
            {
                title: 'Court/Branch',
                dataIndex: 'courtBranch',
                key: 'courtBranch',
            },
            {
                title: 'Judge',
                dataIndex: 'judge',
                key: 'judge',
            },
            {
                title: 'Bail Recommended',
                dataIndex: 'bailRecommended',
                key: 'bailRecommended',
            },
            {
                title: 'Date Crime Committed',
                dataIndex: 'dateCrimeCommitted',
                key: 'dateCrimeCommitted',
            },
            {
                title: 'Days in Detention',
                dataIndex: 'daysInDetention',
                key: 'daysInDetention',
            },
            {
                title: 'Date Arrested',
                dataIndex: 'dateArrested',
                key: 'dateArrested',
            },
            {
                title: 'Assignment Date',
                dataIndex: 'assignmentDate',
                key: 'assignmentDate',
            },
            {
                title: 'Remarks',
                dataIndex: 'remark',
                key: 'remark',
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
                <h1 className='font-bold text-xl'>Case(s) Details</h1>
                <button
                    type="button"
                    onClick={handleModalOpen}
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                >
                    <Plus />
                    Add Case Details
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
                title={editIndex !== null ? "Edit Case Details" : "Add Case Details"}
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="70%"
            >
                <CaseDetailsForm
                    pdlForm={pdlForm}
                    crimeCategories={crimeCategories || []}
                    crimeCategoriesLoading={crimeCategoriesLoading}
                    laws={laws || []}
                    lawsLoading={lawsLoading}
                    offenses={offenses || []}
                    offensesLoading={offensesLoading}
                    handleModalClose={handleModalClose}
                    setPdlForm={setPdlForm}
                    courtBranches={courtBranches || []}
                    courtBranchesLoading={courtBranchesLoading}
                    editIndex={editIndex}
                />
            </Modal>
        </div>
    )
}

export default CaseDetails