import { Button, Modal, Table } from "antd";
import { Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useState } from "react";
import IssueForm from "./IssueForm"; // Make sure to import IssueFormData
import { ColumnsType } from "antd/es/table"; // Import ColumnsType for type safety
import { useQueries } from "@tanstack/react-query";
import { getImpactLevels, getImpacts, getIssueCategories, getIssueStatuses, getIssueTypes, getRecommendedActions, getRiskLevels, getRisks } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";

export type IssueFormData = {
    issue: string;
    risks: string;
    riskLevel: string;
    impactLevel: string;
    impact: string;
    recommendedAction: string;
    status: string;
};

const Issue = () => {
    const token = useTokenStore()?.token

    const [openModal, setOpenModal] = useState(false);
    const [issueTable, setIssueTable] = useState<IssueFormData[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<IssueFormData | null>(null);

    const results = useQueries({
        queries: [
            {
                queryKey: ['get-issue-types'],
                queryFn: () => getIssueTypes(token ?? "")
            },
            {
                queryKey: ['get-issue-statuses'],
                queryFn: () => getIssueStatuses(token ?? "")
            },
            {
                queryKey: ['get-risks'],
                queryFn: () => getRisks(token ?? "")
            },
            {
                queryKey: ['get-risk-levels'],
                queryFn: () => getRiskLevels(token ?? "")
            },
            {
                queryKey: ['get-impacts'],
                queryFn: () => getImpacts(token ?? "")
            },
            {
                queryKey: ['get-impact-levels'],
                queryFn: () => getImpactLevels(token ?? "")
            },
            {
                queryKey: ['get-recommended-actions'],
                queryFn: () => getRecommendedActions(token ?? "")
            },
            {
                queryKey: ['get-issue-categories'],
                queryFn: () => getIssueCategories(token ?? "")
            },
        ]
    })

    const issueTypes = results?.[0]?.data
    const issueTypesLoading = results?.[0]?.isLoading

    const issueStatuses = results?.[1]?.data
    const issueStatusesLoading = results?.[1]?.isLoading

    const risks = results?.[2]?.data
    const risksLoading = results?.[2]?.isLoading

    const riskLevels = results?.[3]?.data
    const riskLevelsLoading = results?.[3]?.isLoading

    const impact = results?.[4]?.data
    const impactLoading = results?.[4]?.isLoading

    const impactLevels = results?.[5]?.data
    const impactLevelsLoading = results?.[5]?.isLoading

    const recommendedActions = results?.[6]?.data
    const recommendedActionsLoading = results?.[6]?.isLoading

    const issueCategories = results?.[7]?.data
    const issueCategoriesLoading = results?.[7]?.isLoading

    const handleOpenModal = (index?: number) => {
        if (index !== undefined) {
            setEditIndex(index);
            setEditData(issueTable[index]);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditIndex(null);
        setEditData(null);
    };

    // Function to delete the issue by index
    const deleteIssue = (index: number) => {
        setIssueTable((prevTable) => prevTable.filter((_, idx) => idx !== index));
    };

    // Function to update an issue at a specific index
    const updateIssue = (index: number, updatedData: IssueFormData) => {
        setIssueTable((prevTable) =>
            prevTable.map((item, idx) => (idx === index ? updatedData : item))
        );
    };

    // Typing columns as ColumnsType<IssueFormData> for type safety
    const columns: ColumnsType<IssueFormData> = [
        {
            title: "Issue",
            dataIndex: "issue",
            key: "issue",
        },
        {
            title: "Risks",
            dataIndex: "risks",
            key: "risks",
        },
        {
            title: "Risk Level",
            dataIndex: "riskLevel",
            key: "riskLevel",
        },
        {
            title: "Impact Level",
            dataIndex: "impactLevel",
            key: "impactLevel",
        },
        {
            title: "Impact",
            dataIndex: "impact",
            key: "impact",
        },
        {
            title: "Recommended Action",
            dataIndex: "recommendedAction",
            key: "recommendedAction",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, _record: IssueFormData, index: number) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary" onClick={() => handleOpenModal(index)}>
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => deleteIssue(index)} // Call deleteIssue function
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ];

    console.log(issueTable)

    return (
        <div>
            <div>
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-xl">Finding / Issues / Risks</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            onClick={() => handleOpenModal()}
                        >
                            <Plus />
                            Add Issue
                        </button>
                    </div>
                    <div>
                        <Table
                            className="border text-gray-200 rounded-md"
                            dataSource={issueTable} // Using the state issueTable as the data source
                            columns={columns} // Correctly typed columns
                            rowKey="issue" // Ensure each row has a unique key (can be based on issue ID or similar)
                            scroll={{ x: 800 }}
                        />
                    </div>
                </div>
            </div>
            <Modal footer={null} open={openModal} onCancel={handleCloseModal} width={"40%"}>
                <IssueForm
                    issueCategories={issueCategories ?? []}
                    issueCategoriesLoading={issueCategoriesLoading}
                    issueTypes={issueTypes ?? []}
                    issueTypesLoading={issueTypesLoading}
                    issueStatuses={issueStatuses ?? []}
                    issueStatusesLoading={issueStatusesLoading}
                    risks={risks ?? []}
                    risksLoading={risksLoading}
                    riskLevels={riskLevels ?? []}
                    riskLevelsLoading={riskLevelsLoading}
                    impact={impact ?? []}
                    impactLoading={impactLoading}
                    impactLevels={impactLevels ?? []}
                    impactLevelsLoading={impactLevelsLoading}
                    recommendedActions={recommendedActions ?? []}
                    recommendedActionsLoading={recommendedActionsLoading}
                    setIssueTable={setIssueTable}
                    onCancel={handleCloseModal}
                    initialData={editData}
                    updateIssue={updateIssue}
                    editIndex={editIndex}
                />
            </Modal>
        </div>
    );
};

export default Issue;
