import { CourtBranch, CrimeCategory, Law, Offense } from "@/lib/definitions";
import { CasesDetailsForm, PDLForm } from "@/lib/visitorFormDefinition";
import { DatePicker, Input, message, Select } from "antd";
import { SetStateAction, useEffect, useState } from "react";
import dayjs from 'dayjs';

type Props = {
    handleModalClose: () => void;
    setPdlForm: React.Dispatch<SetStateAction<PDLForm>>;
    pdlForm: PDLForm;
    courtBranchesLoading: boolean;
    courtBranches: CourtBranch[] | null;
    offenses: Offense[] | null;
    offensesLoading: boolean;
    crimeCategories: CrimeCategory[];
    crimeCategoriesLoading: boolean;
    laws: Law[];
    lawsLoading: boolean;
    editIndex: number | null;
};


const CaseDetailsForm = ({
    setPdlForm,
    pdlForm,
    courtBranches,
    courtBranchesLoading,
    handleModalClose,
    offenses,
    offensesLoading,
    crimeCategories,
    crimeCategoriesLoading,
    laws,
    lawsLoading,
    editIndex
}: Props) => {
    const [casesForm, setCasesForm] = useState<CasesDetailsForm>({
        case_number: "",
        assignment_date: null,
        bail_recommended: "",
        court_branch_id: null,
        date_arrested: null,
        date_crime_committed: null,
        judge: "",
        offense_id: null,
        remarks: "",
        days_in_detention: null,
        court_name: "",
        crime_category_id: null,
        law_id: null
    })

    useEffect(() => {
        if (casesForm?.court_branch_id) {
            setCasesForm(prev => ({
                ...prev,
                judge: courtBranches?.find(branch => branch?.id === casesForm?.court_branch_id)?.judge ?? "Vacant",
                court_name: courtBranches?.find(branch => branch?.id === casesForm?.court_branch_id)?.court ?? "N/A",
            }))
        }
    }, [casesForm?.court_branch_id, courtBranches])

    useEffect(() => {
        if (casesForm?.offense_id && offenses && crimeCategories, laws) {
            const matchedOffense = offenses?.find(offense => offense.id === casesForm.offense_id);
            const matchedCategory = crimeCategories?.find(
                category => category.crime_category_name === matchedOffense?.crime_category
            );
            const matchedLaw = laws?.find(
                law => law.name === matchedOffense?.law
            );



            if (matchedCategory && matchedLaw) {
                setCasesForm(prev => ({
                    ...prev,
                    crime_category_id: matchedCategory.id,
                    law_id: matchedLaw?.id
                }));
            }
        }
    }, [casesForm?.offense_id, offenses, crimeCategories, laws]);

    useEffect(() => {
        if (casesForm?.date_arrested) {
            const today = new Date();
            const arrestedDate = new Date(casesForm.date_arrested);

            const diffTime = today.getTime() - arrestedDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            setCasesForm(prev => ({
                ...prev,
                days_in_detention: diffDays.toString()
            }));
        }
    }, [casesForm.date_arrested]);

    useEffect(() => {
        if (editIndex !== null && pdlForm?.case_data?.[editIndex]) {
            setCasesForm(pdlForm.case_data[editIndex]);
        }
    }, [editIndex, pdlForm]);


    const handleSubmit = () => {
        setPdlForm(prev => {
            const newCaseData = [...(prev.case_data ?? [])];

            if (editIndex !== null) {
                newCaseData[editIndex] = casesForm; // update existing case
            } else {
                newCaseData.push(casesForm); // add new case
            }

            return {
                ...prev,
                case_data: newCaseData,
            };
        });

        setCasesForm({
            case_number: "",
            assignment_date: "",
            bail_recommended: "",
            court_branch_id: null,
            date_arrested: "",
            date_crime_committed: "",
            judge: "",
            offense_id: null,
            remarks: "",
            days_in_detention: null,
            court_name: "",
            crime_category_id: null,
            law_id: null
        });

        message.success(editIndex ? "Successfully Updated Case Details" : "Successfully Added Case Details")

        handleModalClose();
    };

    const handleCancel = () => {
        setCasesForm({
            case_number: "",
            assignment_date: "",
            bail_recommended: "",
            court_branch_id: null,
            date_arrested: "",
            date_crime_committed: "",
            judge: "",
            offense_id: null,
            remarks: "",
            days_in_detention: null,
            court_name: "",
            crime_category_id: null,
            law_id: null
        })

        handleModalClose()
    }


    console.log(casesForm)

    return (
        <div className="w-full p-5 flex justify-center items-center">
            <form className="w-full flex flex-col justify-center items-center gap-1">
                <div className="flex justify-between gap-2 w-full items-center">
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Case Number</span>
                        <Input
                            onChange={e => setCasesForm(prev => ({ ...prev, case_number: e.target.value }))}
                            className="h-12"
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Offense</span>
                        <Select
                            value={casesForm?.offense_id}
                            loading={offensesLoading}
                            className="h-12"
                            options={offenses?.map(offense => ({
                                value: offense?.id,
                                label: offense?.offense
                            }))}
                            onChange={value => {
                                setCasesForm(prev => ({
                                    ...prev,
                                    offense_id: value
                                }))
                            }}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Crime Category</span>
                        <Select
                            value={casesForm?.crime_category_id}
                            loading={crimeCategoriesLoading}
                            className="h-12"
                            options={crimeCategories?.map(crime => ({
                                value: crime?.id,
                                label: crime?.crime_category_name
                            }))}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Philippine Law</span>
                        <Select
                            value={casesForm?.law_id}
                            loading={lawsLoading}
                            className="h-12"
                            options={laws?.map(law => ({
                                value: law?.id,
                                label: law?.name
                            }))}
                        />
                    </label>
                </div>
                <div className="flex justify-between gap-2 w-full items-center">
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Branch</span>
                        <Select
                            value={casesForm?.court_branch_id}
                            loading={courtBranchesLoading}
                            className="h-12"
                            options={courtBranches?.map(branch => ({
                                value: branch?.id,
                                label: `${branch?.branch}`
                            }))}
                            onChange={value => {
                                setCasesForm(prev => ({
                                    ...prev,
                                    court_branch_id: value
                                }))
                            }}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Court</span>
                        <Input
                            value={casesForm?.court_name}
                            readOnly
                            className="h-12"
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Judge</span>
                        <Input
                            value={casesForm?.judge}
                            readOnly
                            className="h-12"
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Bail Recommended</span>
                        <Input
                            className="h-12"
                            value={casesForm?.bail_recommended}
                            onChange={e => setCasesForm(prev => ({ ...prev, bail_recommended: e.target.value }))}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Date Crime Committed</span>
                        <DatePicker
                            className="h-12"
                            value={casesForm?.date_crime_committed ? dayjs(casesForm.date_crime_committed) : null}
                            onChange={(date) => {
                                setCasesForm(prev => ({
                                    ...prev,
                                    date_crime_committed: date ? date.format('YYYY-MM-DD') : null
                                }))
                            }}
                        />
                    </label>
                </div>
                <div className="flex justify-between gap-2 w-full items-center">
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Date Arrested</span>
                        <DatePicker
                            className="h-12"
                            value={casesForm?.date_arrested ? dayjs(casesForm.date_arrested) : null}
                            onChange={(date) => {
                                setCasesForm(prev => ({
                                    ...prev,
                                    date_arrested: date ? date.format('YYYY-MM-DD') : null
                                }))
                            }}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <span className="font-semibold">Date Assignment</span>
                        <DatePicker
                            className="h-12"
                            value={casesForm?.assignment_date ? dayjs(casesForm.assignment_date) : null}
                            onChange={(date) => {
                                setCasesForm(prev => ({
                                    ...prev,
                                    assignment_date: date ? date.format('YYYY-MM-DD') : null
                                }))
                            }}
                        />
                    </label>
                    <label className="flex flex-col flex-[3]">
                        <span className="font-semibold">Remarks</span>
                        <Input
                            value={casesForm?.remarks}
                            className="h-12"
                            onChange={e => setCasesForm(prev => ({ ...prev, remarks: e.target.value }))}
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
            </form>
        </div>
    )
}

export default CaseDetailsForm