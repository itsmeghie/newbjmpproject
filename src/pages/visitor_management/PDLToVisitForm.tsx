import { VisitortoPDLRelationship } from '@/lib/definitions';
import { PDLs } from '@/lib/pdl-definitions';
import { VisitorForm } from '@/lib/visitorFormDefinition';
import { Input, Select, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PdlToVisitForm } from './PDLtovisit';


type Props = {
    visitorForm: VisitorForm;
    editPdlToVisitIndex: number | null;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    visitorToPdlRelationship: VisitortoPDLRelationship[] | null;
    setPdlToVisitTableInfo: Dispatch<SetStateAction<PdlToVisitForm[] | null>>
    pdlToVisitTableInfo: PdlToVisitForm[]
    pdls: PDLs[];
    pdlsLoading: boolean;
    handlePdlToVisitModalCancel: () => void;
}

const PDLToVisitForm = ({
    setVisitorForm,
    visitorToPdlRelationship,
    pdls,
    pdlsLoading,
    setPdlToVisitTableInfo,
    pdlToVisitTableInfo,
    handlePdlToVisitModalCancel,
    editPdlToVisitIndex,
    visitorForm
}: Props) => {
    const [pdlToVisitID, setPdlToVisitID] = useState<number | null>(() => {
        if (editPdlToVisitIndex !== null && visitorForm?.pdl?.[editPdlToVisitIndex]) {
            return visitorForm.pdl[editPdlToVisitIndex].pdl
        }
        return null
    })

    const [selectedPdl, setSelectedPdl] = useState<PDLs | null>(null);

    const [helperForm, setHelperForm] = useState<PdlToVisitForm>(() => {
        if (editPdlToVisitIndex !== null && pdlToVisitTableInfo?.[editPdlToVisitIndex]) {
            // We're editing, use the existing data
            return { ...pdlToVisitTableInfo?.[editPdlToVisitIndex ?? 0] };
        }

        return {
            lastName: null,
            firstName: null,
            middleName: null,
            relationship: null,
            level: null,
            annex: null,
            dorm: null,
            visitationStatus: null,
            multipleBirthClass: null,
        }
    })

    useEffect(() => {
        if (editPdlToVisitIndex !== null && pdlToVisitTableInfo && pdlToVisitTableInfo[editPdlToVisitIndex]) {
            setHelperForm({ ...pdlToVisitTableInfo[editPdlToVisitIndex] });
        } else {
            // Reset to default values for new address
            setHelperForm({
                lastName: null,
                firstName: null,
                middleName: null,
                relationship: null,
                level: null,
                annex: null,
                dorm: null,
                visitationStatus: null,
                multipleBirthClass: null,
            });
        }
    }, [editPdlToVisitIndex, pdlToVisitTableInfo]);

    useEffect(() => {
        if (pdlToVisitID !== null) {
            const pdl = pdls?.find(pdl => pdl?.id === pdlToVisitID) ?? null;
            setSelectedPdl(pdl);
            setHelperForm(prev => ({
                ...prev,
                lastName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.last_name ?? null,
                firstName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.first_name ?? null,
                middleName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.middle_name ?? null,
                annex: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.cell?.floor ?? null,
                multipleBirthClass: selectedPdl?.person?.multiple_birth_siblings?.[0] ?? null,
                dorm: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.cell?.cell_name ?? null,
                level: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.jail?.jail_name ?? null,
                visitationStatus: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.visitation_status ?? null,
            }));
        } else {
            setSelectedPdl(null);
        }
    }, [pdlToVisitID, pdls, selectedPdl]);


    const insertHelperForm = () => {
        const isEdit = editPdlToVisitIndex !== null;

        const exists = pdlToVisitTableInfo.some((entry, index) => {
            // Skip the current index if editing
            if (isEdit && index === editPdlToVisitIndex) return false;

            return (
                entry.lastName === helperForm.lastName &&
                entry.firstName === helperForm.firstName &&
                entry.middleName === helperForm.middleName &&
                entry.relationship === helperForm.relationship &&
                entry.level === helperForm.level &&
                entry.annex === helperForm.annex &&
                entry.dorm === helperForm.dorm &&
                entry.visitationStatus === helperForm.visitationStatus &&
                entry.multipleBirthClass === helperForm.multipleBirthClass
            );
        });

        if (exists) {
            message.error("This PDL is already in the list.");
            return;
        }

        if (isEdit) {
            setPdlToVisitTableInfo(prev => {
                const updated = [...(prev || [])];
                updated[editPdlToVisitIndex!] = helperForm;
                return updated;
            });
        } else {
            setPdlToVisitTableInfo(prevState => [...(prevState || []), helperForm]);
        }
    };


    const handleAddPdlToVisit = () => {
        if (selectedPdl === null) {
            message.error("Please select a PDL to visit");
            return;
        }

        if (!helperForm?.relationship) {
            message.error("Please select a relationship");
            return;
        }

        const newPdlId = pdlToVisitID as number;
        const isEdit = editPdlToVisitIndex !== null;

        const newEntry = {
            pdl: newPdlId,
            relationship_to_pdl: helperForm.relationship as number,
        };

        // Prevent duplicates
        const isAlreadyInVisitorForm = visitorForm?.pdl?.some((item, idx) => {
            if (isEdit && idx === editPdlToVisitIndex) return false;
            return item.pdl === newPdlId;
        });

        if (isAlreadyInVisitorForm) {
            message.warning("This PDL has already been added.");
            return;
        }

        setVisitorForm(prev => {
            const updated = [...(prev.pdl || [])];

            if (isEdit) {
                updated[editPdlToVisitIndex!] = newEntry;
            } else {
                updated.push(newEntry);
            }

            return {
                ...prev,
                pdl: updated,
            };
        });

        message.success(isEdit ? "PDL to visit updated successfully!" : "PDL to visit added successfully!");
        insertHelperForm();

        // Reset
        setPdlToVisitID(null);
        setSelectedPdl(null);
        setHelperForm({
            lastName: null,
            firstName: null,
            middleName: null,
            relationship: null,
            level: null,
            annex: null,
            dorm: null,
            visitationStatus: null,
            multipleBirthClass: null,
        });

        handlePdlToVisitModalCancel();
    };



    return (
        <div className='w-full'>
            <form
                className='w-full flex flex-col gap-4 p-4'
            >
                <div className='flex gap-8'>
                    <div className='flex-1'>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="last-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Last Name <span className='text-red-500'>*</span></span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.last_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                            <label htmlFor="first-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>First Name <span className='text-red-500'>*</span></span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.first_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="middle-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Middle Name </span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.middle_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                            <label htmlFor="mbc" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Multiple Birth Classification </span>
                                <Input
                                    value={helperForm?.multipleBirthClass?.multiple_birth_class ?? ""}
                                    className='h-12 rounded-md outline-gray-300'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="level" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Level <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.level ?? ""}
                                    id='level'
                                    className='h-12'
                                />
                            </label>
                            <label htmlFor="annex" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Annex </span>
                                <Input
                                    value={helperForm?.annex ?? ""}
                                    id='annex'
                                    className='h-12'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="dorm" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Dorm <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.dorm ?? ""}
                                    id='dorm'
                                    className='h-12'
                                />
                            </label>
                            <label htmlFor="pdl-visitation-status" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>PDL Visitation Status <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.visitationStatus ?? ""}
                                    id='pdl-visitation-status'
                                    className='h-12'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="relationship" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Relationship <span className='text-red-500'>*</span></span>
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    value={helperForm?.relationship}
                                    className='h-12 rounded-md outline-gray-300 !bg-gray-100'
                                    options={visitorToPdlRelationship?.map(relationship => ({
                                        value: relationship?.id,
                                        label: relationship?.relationship_name
                                    }))}
                                    onChange={value => setHelperForm(prev => ({
                                        ...prev,
                                        relationship: value
                                    }))}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div className="border border-gray-100 bg-gray-200 rounded w-full h-full">
                            {
                                !selectedPdl ? (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <h2 className='text-3xl font-bold text-gray-600'>Select a PDL to visit</h2>
                                    </div>
                                ) : selectedPdl?.person?.biometrics?.find(bio => bio.type === "face")?.image ? (
                                    <img
                                        src={selectedPdl?.person?.biometrics.find(bio => bio.type === "face")?.image}
                                        alt="pdl image"
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <h2 className='text-3xl font-bold text-gray-600'>No Image Available</h2>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className='w-[30%] flex gap-4 ml-[70%]'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={() => {
                            setPdlToVisitID(null)
                            setSelectedPdl(null)
                            setHelperForm({
                                lastName: null,
                                firstName: null,
                                middleName: null,
                                relationship: null,
                                level: null,
                                annex: null,
                                dorm: null,
                                visitationStatus: null,
                                multipleBirthClass: null,
                            })
                            handlePdlToVisitModalCancel()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={handleAddPdlToVisit}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PDLToVisitForm