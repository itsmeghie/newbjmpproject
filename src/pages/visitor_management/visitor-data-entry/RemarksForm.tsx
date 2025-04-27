/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAccounts } from "@/lib/definitions";
import { RemarksForm as RemarksFormType } from "@/lib/visitorFormDefinition";
import { Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

type Props = {
    setRemarksTableInfo: Dispatch<SetStateAction<RemarksFormType[]>>;
    handleModalCancel: () => void;
    setVisitorForm: Dispatch<SetStateAction<any>>;
    currentUser: UserAccounts;
    editingRemark: { index: number, data: RemarksFormType } | null;
    setEditingRemark: Dispatch<SetStateAction<{ index: number, data: RemarksFormType } | null>>;
}

const RemarksForm = ({
    currentUser,
    setVisitorForm,
    setRemarksTableInfo,
    handleModalCancel,
    editingRemark,
    setEditingRemark
}: Props) => {
    const [remarksForm, setRemarksForm] = useState<RemarksFormType>({
        timestamp: "",
        created_by: "",
        remarks: ""
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
        if (remarksForm?.remarks) {
            if (editingRemark !== null) {
                // Handle edit mode
                const updatedRemark: RemarksFormType = {
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
                setVisitorForm((prev: { remarks_data: any; }) => {
                    const updatedRemarks = [...(prev.remarks_data || [])];
                    updatedRemarks[editingRemark.index] = { remarks: remarksForm.remarks };
                    return {
                        ...prev,
                        remarks_data: updatedRemarks
                    };
                });
            } else {
                // Handle create mode (existing functionality)
                const newRemark: RemarksFormType = {
                    ...remarksForm,
                    timestamp: getCurrentTimestamp(),
                    created_by: `${currentUser.first_name} ${currentUser.last_name}`
                };

                setVisitorForm((prev: { remarks_data: any; }) => ({
                    ...prev,
                    remarks_data: [
                        ...(prev.remarks_data || []),
                        { remarks: remarksForm?.remarks }
                    ]
                }));

                setRemarksTableInfo(prev => ([...prev, newRemark]));
            }

            // Reset form and editing state
            setRemarksForm({
                timestamp: "",
                created_by: "",
                remarks: ""
            });
            setEditingRemark(null);
            handleModalCancel();
        }
    }

    const handleCancel = () => {
        setRemarksForm({
            timestamp: "",
            created_by: "",
            remarks: ""
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
                            <Input.TextArea
                                value={remarksForm?.remarks}
                                id="visitor-remarks"
                                className="!h-72"
                                onChange={e => setRemarksForm(prev => ({ ...prev, remarks: e.target.value }))}
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