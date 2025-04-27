import { VisitortoPDLRelationship } from '@/lib/definitions';
import { Visitor } from '@/lib/pdl-definitions';
import { PDLForm } from '@/lib/visitorFormDefinition';
import { Input, Select, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PdlVisitorForm } from './PdlVisitor';


type Props = {
    pdlForm: PDLForm;
    editPdlToVisitIndex: number | null;
    setEditPdlToVisitIndex: Dispatch<SetStateAction<number | null>>;
    setPdlForm: Dispatch<SetStateAction<PDLForm>>;
    visitorToPdlRelationship: VisitortoPDLRelationship[] | null;
    visitorToPdlRelationshipLoading: boolean;
    setPdlVisitorTableInfo: Dispatch<SetStateAction<PdlVisitorForm[] | null>>
    pdlVisitorTableInfo: PdlVisitorForm[] | null;
    handlePdlToVisitModalCancel: () => void;
    pdlVisitors: Visitor[];
    pdlVisitorsLoading: boolean;
}

const PDLVisitorForm = ({
    visitorToPdlRelationshipLoading,
    setEditPdlToVisitIndex,
    pdlForm,
    pdlVisitorTableInfo,
    setPdlForm,
    setPdlVisitorTableInfo,
    visitorToPdlRelationship,
    handlePdlToVisitModalCancel,
    editPdlToVisitIndex,
    pdlVisitors,
    pdlVisitorsLoading,
}: Props) => {
    const [pdlToVisitID, setPdlToVisitID] = useState<number | null>(() => {
        if (editPdlToVisitIndex !== null && pdlForm?.visitor?.[editPdlToVisitIndex]) {
            return pdlForm.visitor[editPdlToVisitIndex].visitor;
        }
        return null;
    });

    const [selectedPdl, setSelectedPdl] = useState<Visitor | null>(null);

    const [helperForm, setHelperForm] = useState<PdlVisitorForm>(() => {
        if (editPdlToVisitIndex !== null && pdlVisitorTableInfo?.[editPdlToVisitIndex]) {
            // We're editing, use the existing data
            return { ...pdlVisitorTableInfo?.[editPdlToVisitIndex ?? 0] };
        }

        return {
            lastName: null,
            firstName: null,
            middleName: null,
            relationship: null,
            visitationStatus: null,
            multipleBirthClass: null,
        }
    })

    useEffect(() => {
        if (editPdlToVisitIndex !== null) {
            // Get the visitor ID from pdlForm
            const visitorId = pdlForm?.visitor?.[editPdlToVisitIndex]?.visitor;
            setPdlToVisitID(visitorId);

            // Set the relationship value
            if (pdlVisitorTableInfo && pdlVisitorTableInfo[editPdlToVisitIndex]) {
                setHelperForm(prev => ({
                    ...prev,
                    relationship: pdlVisitorTableInfo[editPdlToVisitIndex].relationship,
                    visitationStatus: pdlVisitorTableInfo[editPdlToVisitIndex].visitationStatus
                }));
            }
        } else {
            // Reset to default values for new address
            setHelperForm({
                lastName: null,
                firstName: null,
                middleName: null,
                relationship: null,
                visitationStatus: null,
                multipleBirthClass: null,
            });
            setPdlToVisitID(null);
        }
    }, [editPdlToVisitIndex, pdlVisitorTableInfo, pdlForm]);

    useEffect(() => {
        if (pdlToVisitID !== null) {
            const pdl = pdlVisitors?.find(pdl => pdl?.id === pdlToVisitID) ?? null;
            setSelectedPdl(pdl);

            // Update form with the found PDL data
            if (pdl) {
                setHelperForm(prev => ({
                    ...prev,
                    lastName: pdl.person?.last_name ?? null,
                    firstName: pdl.person?.first_name ?? null,
                    middleName: pdl.person?.middle_name ?? null,
                    multipleBirthClass: pdl.person?.multiple_birth_siblings?.[0] ?? null,
                }));
            }
        } else {
            setSelectedPdl(null);
        }
    }, [pdlToVisitID, pdlVisitors]);


    const insertHelperForm = () => {
        const isEdit = editPdlToVisitIndex !== null;

        const exists = pdlVisitorTableInfo?.some((entry, index) => {
            // Skip the current index if editing
            if (isEdit && index === editPdlToVisitIndex) return false;

            return (
                entry.lastName === helperForm.lastName &&
                entry.firstName === helperForm.firstName &&
                entry.middleName === helperForm.middleName &&
                entry.relationship === helperForm.relationship &&
                entry.multipleBirthClass === helperForm.multipleBirthClass
            );
        });

        if (exists) {
            message.error("This PDL is already in the list.");
            return;
        }

        if (isEdit) {
            setPdlVisitorTableInfo(prev => {
                const updated = [...(prev || [])];
                updated[editPdlToVisitIndex!] = helperForm;
                return updated;
            });
        } else {
            setPdlVisitorTableInfo(prevState => [...(prevState || []), helperForm]);
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
            visitor: newPdlId,
            relationship_to_visitor: helperForm.relationship as number,
        };

        // Prevent duplicates
        const isAlreadyInVisitorForm = pdlForm?.visitor?.some((item, idx) => {
            if (isEdit && idx === editPdlToVisitIndex) return false;
            return item.visitor === newPdlId;
        });

        if (isAlreadyInVisitorForm) {
            message.warning("This PDL has already been added.");
            return;
        }

        setPdlForm(prev => {
            const updated = [...(prev.visitor || [])];

            if (isEdit) {
                updated[editPdlToVisitIndex!] = newEntry;
            } else {
                updated.push(newEntry);
            }

            return {
                ...prev,
                visitor: updated,
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
            visitationStatus: null,
            multipleBirthClass: null,
        });
        setEditPdlToVisitIndex(null);
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
                                    loading={pdlVisitorsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdlVisitors?.map(pdl => ({
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
                                    loading={pdlVisitorsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdlVisitors?.map(pdl => ({
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
                                    loading={pdlVisitorsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdlVisitors?.map(pdl => ({
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
                        </div>
                        {/* <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="pdl-visitation-status" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>PDL Visitation Status <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.visitationStatus ?? ""}
                                    id='pdl-visitation-status'
                                    className='h-12'
                                />
                            </label>
                        </div> */}
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="relationship" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Relationship <span className='text-red-500'>*</span></span>
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    value={helperForm?.relationship}
                                    loading={visitorToPdlRelationshipLoading}
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
                    {/* <div className='flex-1'>
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
                    </div> */}
                </div>

                <div className='w-[30%] flex gap-4 ml-[70%] '>
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
                                visitationStatus: null,
                                multipleBirthClass: null,
                            })
                            setEditPdlToVisitIndex(null);
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

export default PDLVisitorForm;