/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceProviderRemarks, UserAccounts } from "@/lib/definitions";
import { ServiceProviderRemarksForm } from "@/lib/visitorFormDefinition";
import { Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

type Props = {
    spRemarks: ServiceProviderRemarks[]
    spRemarksLoading: boolean;
    setRemarksTableInfo: Dispatch<SetStateAction<ServiceProviderRemarksForm[]>>;
    handleModalCancel: () => void;
    setVisitorForm: Dispatch<SetStateAction<any>>;
    currentUser: UserAccounts;
    editingRemark: { index: number, data: ServiceProviderRemarksForm } | null;
    setEditingRemark: Dispatch<SetStateAction<{ index: number, data: ServiceProviderRemarksForm } | null>>;
}

const RemarksForm = ({
    currentUser,
    setVisitorForm,
    setRemarksTableInfo,
    handleModalCancel,
    editingRemark,
    setEditingRemark,
    spRemarks,
    spRemarksLoading
}: Props) => {
    const [remarksForm, setRemarksForm] = useState<ServiceProviderRemarksForm>({
        timestamp: "",
        created_by: "",
        remark: null
    });

    // Initialize form with editing data if available
    useEffect(() => {
        if (editingRemark) {
            setRemarksForm(editingRemark.data);
        } else if (currentUser) {
            setRemarksForm(prev => ({
                ...prev,
                created_by: `${currentUser.first_name} ${currentUser.last_name}`,
                timestamp: getCurrentTimestamp()
            }));
        }
    }, [currentUser, editingRemark]);

    const handleSubmit = () => {
        if (remarksForm?.remark) {
            if (editingRemark !== null) {
                // Handle edit mode
                const updatedRemark: ServiceProviderRemarksForm = {
                    ...remarksForm,
                    // We can choose to update the timestamp on edit or keep the original
                    timestamp: getCurrentTimestamp(), // Update timestamp to show when it was edited
                };

                // Update the remarks table info
                setRemarksTableInfo(prev => {
                    const updated = [...prev];
                    updated[editingRemark.index] = updatedRemark;
                    return updated;
                });

                // Update the visitorForm remarks_data
                setVisitorForm((prev: { remarks_many_data: any; }) => {
                    const updatedRemarks = [...(prev.remarks_many_data || [])];
                    updatedRemarks[editingRemark.index] = { remarks: remarksForm.remark };
                    return {
                        ...prev,
                        remarks_many_data: updatedRemarks
                    };
                });
            } else {
                // Handle create mode (existing functionality)
                const newRemark: ServiceProviderRemarksForm = {
                    ...remarksForm,
                    timestamp: getCurrentTimestamp(),
                    created_by: `${currentUser.first_name} ${currentUser.last_name}`
                };

                setVisitorForm((prev: { remarks_many_data: any; }) => ({
                    ...prev,
                    remarks_many_data: [
                        ...(prev.remarks_many_data || []),
                        { remark: remarksForm?.remark }
                    ]
                }));

                setRemarksTableInfo(prev => ([...prev, newRemark]));
            }

            // Reset form and editing state
            setRemarksForm({
                timestamp: "",
                created_by: "",
                remark: null
            });
            setEditingRemark(null);
            handleModalCancel();
        }
    }

    const handleCancel = () => {
        setRemarksForm({
            timestamp: "",
            created_by: "",
            remark: null
        });
        setEditingRemark(null);
        handleModalCancel();
    }

    return (
        <div className="w-full p-5">
            <form className="w-full">
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <label htmlFor="visitor-remarks" className="flex flex-col gap-2">
                            <span className="font-semibold">Remarks</span>
                            <Select
                                optionFilterProp="label"
                                showSearch
                                value={remarksForm?.remark}
                                id="visitor-remarks"
                                className="h-12"
                                loading={spRemarksLoading}
                                options={[
                                    ...(spRemarks?.map((remark) => ({
                                        label: remark.remark,
                                        value: remark.id,
                                    })) ?? []),
                                ]}
                                onChange={value => {
                                    setRemarksForm(prev => ({
                                        ...prev,
                                        remark: value
                                    }))
                                }}
                            />
                        </label>
                    </div>
                    <div className="w-full flex justify-end">
                        <div className="flex gap-4 w-[30%] h-full items-end">
                            <button
                                onClick={handleCancel}
                                type="button"
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                                onClick={handleSubmit}
                            >
                                {editingRemark ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RemarksForm;