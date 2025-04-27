import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EducAttainmentForm from "./EducAttainmentForm";
import { SetStateAction, useState } from "react";
import { PersonForm } from "@/lib/visitorFormDefinition";
import { useQuery } from "@tanstack/react-query";
import { getEducationalAttainments } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";

type Props = {
    setPersonForm: React.Dispatch<SetStateAction<PersonForm>>;
    personForm: PersonForm;
};

interface EducationRow {
    key: number;
    educationalAttainment: string | null;
    degree: string | null;
    remarks: string | null;
    institutionName: string | null;
    institutionAddress: string | null;
    dateGraduated: string | null;
    actions: JSX.Element;
}

const EducAttainment = ({ setPersonForm, personForm }: Props) => {
    const token = useTokenStore()?.token;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const { data: attainments } = useQuery({
        queryKey: ["education-attainment"],
        queryFn: () => getEducationalAttainments(token ?? ""),
    });

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditIndex(null);
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setIsModalOpen(true);
    };

    const handleDelete = (index: number) => {
        const updatedEducation = [...(personForm.education_background_data || [])];
        updatedEducation.splice(index, 1);
        setPersonForm((prev) => ({
            ...prev,
            education_background_data: updatedEducation,
        }));
    };

    const contactDataSource: EducationRow[] =
        personForm?.education_background_data?.map((educ, index) => ({
            key: index,
            educationalAttainment:
                attainments?.find(
                    (attainment) => attainment?.id === educ?.educational_attainment_id
                )?.name ?? null,
            degree: educ?.degree ?? null,
            remarks: educ?.remarks ?? null,
            institutionName: educ?.institution_name ?? null,
            institutionAddress: educ?.institution_address ?? null,
            dateGraduated: educ?.end_year ?? null,
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
            ),
        })) ?? [];

    const contactColumn: ColumnsType<EducationRow> = [
        {
            title: "Educational Attainment",
            dataIndex: "educationalAttainment",
            key: "educationalAttainment",
        },
        {
            title: "Particulars",
            dataIndex: "degree",
            key: "degree",
        },
        {
            title: "Notes/ Remarks",
            dataIndex: "remarks",
            key: "remarks",
        },
        {
            title: "Name of School",
            dataIndex: "institutionName",
            key: "institutionName",
        },
        {
            title: "Address of School",
            dataIndex: "institutionAddress",
            key: "institutionAddress",
        },
        {
            title: "Date Graduated",
            dataIndex: "dateGraduated",
            key: "dateGraduated",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            align: "center",
        },
    ];

    return (
        <div className="flex flex-col gap-5 mt-10">
            <div className="flex justify-between">
                <h1 className="font-bold text-xl">Educational Attainment</h1>
                <button
                    type="button"
                    onClick={handleModalOpen}
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                >
                    <Plus />
                    Add Educational Attainment
                </button>
            </div>

            <Table
                className="border text-gray-200 rounded-md"
                dataSource={contactDataSource}
                columns={contactColumn}
                scroll={{ x: 800 }}
            />

            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={
                    editIndex !== null
                        ? "Edit Educational Attainment"
                        : "Add Educational Attainment"
                }
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="70%"
            >
                <EducAttainmentForm
                    attainments={attainments || []}
                    editIndex={editIndex}
                    setPersonForm={setPersonForm}
                    handleModalClose={handleModalClose}
                />
            </Modal>
        </div>
    );
};

export default EducAttainment;
