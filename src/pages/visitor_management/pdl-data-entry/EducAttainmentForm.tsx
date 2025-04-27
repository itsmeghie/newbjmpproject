import { EducationalAttainment, EducationBackgroundForm, PersonForm } from "@/lib/visitorFormDefinition"
import { DatePicker, Input, message, Select } from "antd"
import { SetStateAction, useEffect, useState } from "react"
import dayjs from 'dayjs'; // Import dayjs for date handling
import type { Dayjs } from 'dayjs';

// Extended interface to handle both string and Dayjs types for internal component state
interface FormState extends Omit<EducationBackgroundForm, 'end_year'> {
    end_year: string | Dayjs | null;
}

type Props = {
    setPersonForm: React.Dispatch<SetStateAction<PersonForm>>
    handleModalClose: () => void;
    editIndex: number | null;
    attainments: EducationalAttainment[]
}

const EducAttainmentForm = ({ setPersonForm, handleModalClose, editIndex, attainments }: Props) => {
    const initialFormState: FormState = {
        educational_attainment_id: null,
        degree: "", // this is the particulars column
        remarks: "",
        institution_name: "",
        institution_address: "",
        end_year: null, //Date Graduated
        field_of_study: "",
    };

    const [educ, setEduc] = useState<FormState>(initialFormState);

    const handleSubmit = () => {
        if (!educ?.educational_attainment_id) {
            message.warning("Educational Attainment is Required!")
            return
        }

        if (!educ?.degree) {
            message.warning("Particulars is Required!")
            return
        }

        if (!educ?.institution_name) {
            message.warning("School Name is Required!")
            return
        }

        // Create a formatted copy of the educ object, ensuring end_year is a string
        const formattedEduc: EducationBackgroundForm = {
            ...educ,
            // Format the date as needed for your backend
            end_year: educ.end_year ?
                (typeof educ.end_year === 'string' ?
                    educ.end_year :
                    educ.end_year.format('YYYY-MM-DD'))
                : '',
        };

        setPersonForm(prev => {
            const currentEducationBackgroundData = Array.isArray(prev.education_background_data) ? [...prev.education_background_data] : []

            if (editIndex !== null) {
                // Edit existing address
                currentEducationBackgroundData[editIndex] = formattedEduc;
                return {
                    ...prev,
                    education_background_data: currentEducationBackgroundData,
                };
            } else {
                // Add new address
                return {
                    ...prev,
                    education_background_data: [...currentEducationBackgroundData, formattedEduc],
                };
            }
        })

        resetForm();
        message.success(editIndex !== null ? "Educational Attainment updated successfully" : "Educational Attainment added successfully");
        handleModalClose();
    };

    const resetForm = () => {
        setEduc({ ...initialFormState });
    };

    const handleCancel = () => {
        resetForm();
        handleModalClose();
    };

    // Effect for loading data when editing
    useEffect(() => {
        if (editIndex !== null) {
            setPersonForm((prev) => {
                const item = prev.education_background_data?.[editIndex];
                if (item) {
                    // Make a copy of the item and convert to our FormState type
                    const editedItem: FormState = {
                        ...item,
                        // Convert string date to dayjs object if it exists
                        end_year: item.end_year ? dayjs(item.end_year) : null
                    };

                    setEduc(editedItem);
                }
                return prev;
            });
        } else {
            // Reset form when not editing (when adding a new record)
            resetForm();
        }
    }, [editIndex, setPersonForm]);

    // Effect to handle form cleanup when component unmounts or modal closes
    useEffect(() => {
        // Return cleanup function
        return () => {
            resetForm();
        };
    }, []);

    return (
        <div className="w-full p-5 flex justify-center items-center">
            <form className="w-full flex justify-center items-center">
                <div className="flex flex-col gap-2 w-full justify-center items-center">
                    <div className="flex gap-2 w-full">
                        <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold">Educational Attainment <span className="text-red-600">*</span></span>
                            <Select
                                showSearch
                                className="h-12  flex-1"
                                optionFilterProp="label"
                                value={educ.educational_attainment_id}
                                options={attainments?.map(attainment => ({
                                    label: attainment?.name,
                                    value: attainment?.id
                                }))}
                                onChange={value => {
                                    setEduc(prev => ({
                                        ...prev,
                                        educational_attainment_id: value
                                    }))
                                }}
                            />
                        </label>
                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Name of School <span className="text-red-600">*</span></span>
                            <Input
                                className="h-12"
                                value={educ?.institution_name ?? ""}
                                onChange={e => setEduc(prev => ({ ...prev, institution_name: e.target.value }))}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Address of School <span className="text-red-600">*</span></span>
                            <Input
                                className="h-12"
                                value={educ?.institution_address ?? ""}
                                onChange={e => setEduc(prev => ({ ...prev, institution_address: e.target.value }))}
                            />
                        </label>
                    </div>
                    <div className="flex gap-2 w-full">
                        <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold">Date Graduated<span className="text-red-600">*</span></span>
                            <DatePicker
                                className="h-12 w-full"
                                value={educ.end_year && typeof educ.end_year !== 'string' ? educ.end_year : null}
                                onChange={(date) =>
                                    setEduc((prev) => ({
                                        ...prev,
                                        end_year: date
                                    }))
                                }
                            />
                        </label>
                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Particulars <span className="text-red-600">*</span></span>
                            <Input
                                className="h-12"
                                value={educ?.degree ?? ""}
                                onChange={e => setEduc(prev => ({ ...prev, degree: e.target.value }))}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Notes/ Remarks</span>
                            <Input
                                className="h-12"
                                value={educ?.remarks ?? ""}
                                onChange={e => setEduc(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </label>
                    </div>

                    <div className="flex gap-2 w-full justify-end mt-5">
                        <div className="flex gap-4 w-[30%] h-full items-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EducAttainmentForm