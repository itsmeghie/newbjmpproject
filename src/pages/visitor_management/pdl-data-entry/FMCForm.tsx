import { Prefix, Suffix, VisitortoPDLRelationship } from "@/lib/definitions";
import { Person } from "@/lib/pdl-definitions";
import { FamilyRelativesContactsForm } from "@/lib/visitorFormDefinition";
import { Input, message, Select } from "antd"
import { SetStateAction, useEffect, useState } from "react";
import { HasPersonRelationships } from "./FMC";

type Props<T extends HasPersonRelationships> = {
    handleModalClose: () => void;
    editIndex: number | null;
    prefixes: Prefix[] | null;
    suffixes: Suffix[] | null;
    setPdlForm: React.Dispatch<SetStateAction<T>>;
    pdlForm: T;
    persons: Person[] | null;
    personsLoading: boolean;
    relationships: VisitortoPDLRelationship[] | null;
    relationshipsLoading: boolean;
    setEditIndex: React.Dispatch<SetStateAction<number | null>>;
};

const FMCForm = <T extends HasPersonRelationships>({
    editIndex,
    handleModalClose,
    pdlForm,
    persons,
    personsLoading,
    relationships,
    relationshipsLoading,
    setPdlForm,
    prefixes,
    suffixes,
    setEditIndex,
}: Props<T>) => {
    const [form, setForm] = useState<FamilyRelativesContactsForm>({
        address: "",
        contact_person: true,
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile_number: "",
        person_id: null,
        relationship_id: null,
        remarks: "",
        prefix: "",
        suffix: "",
    });

    const handlePersonSelect = (personId: string | number) => {
        const selectedPerson = persons?.find(p => p.id === personId);
        if (selectedPerson) {
            setForm(prev => ({
                ...prev,
                person_id: selectedPerson.id,
                first_name: selectedPerson.first_name,
                last_name: selectedPerson.last_name,
                middle_name: selectedPerson.middle_name,
                mobile_number: selectedPerson?.contacts?.find(type => type?.type === "Phone")?.value ?? "N/A",
                // Assuming prefix and suffix are strings in the object
                prefix: prefixes?.find(prefix => prefix?.id === selectedPerson?.prefix)?.prefix ?? "N/A",
                suffix: suffixes?.find(suffix => suffix?.id === selectedPerson?.suffix)?.suffix ?? "N/A"
            }));
        }
    };

    const handleSave = () => {
        if (!form?.person_id) {
            message.warning("Please select a person.");
            return;
        }

        if (!form?.relationship_id) {
            message.warning("Please select a relationship.");
            return;
        }

        if (editIndex !== null) {
            const updatedList = [...(pdlForm.person_relationship_data || [])];
            updatedList[editIndex] = form;

            setPdlForm(prev => ({
                ...prev,
                person_relationship_data: updatedList,
            }));
        } else {
            setPdlForm(prev => ({
                ...prev,
                person_relationship_data: [...(prev.person_relationship_data || []), form],
            }));
        }

        setForm({
            address: "",
            contact_person: true,
            first_name: "",
            last_name: "",
            middle_name: "",
            mobile_number: "",
            person_id: null,
            relationship_id: null,
            remarks: "",
            prefix: "",
            suffix: "",
        });

        setEditIndex(null);
        handleModalClose();
    };


    const handleCancel = () => {
        setForm({
            address: "",
            contact_person: true,
            first_name: "",
            last_name: "",
            middle_name: "",
            mobile_number: "",
            person_id: null,
            relationship_id: null,
            remarks: "",
            prefix: "",
            suffix: "",
        })

        setEditIndex(null);
        handleModalClose();
    }

    useEffect(() => {
        if (editIndex !== null && pdlForm?.person_relationship_data?.[editIndex]) {
            setForm(pdlForm.person_relationship_data[editIndex]);
        }
    }, [editIndex, pdlForm]);

    return (
        <div className="w-full p-5 flex justify-center items-center">
            <form className="w-full flex justify-center items-center">
                <div className="flex flex-col gap-2 w-full justify-center items-center">
                    <div className="flex gap-2 w-full">
                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Relationship <span className="text-red-600">*</span></span>
                            <Select
                                showSearch
                                className="h-12  flex-1"
                                optionFilterProp="label"
                                loading={relationshipsLoading}
                                options={relationships?.map(relationship => ({
                                    value: relationship?.id,
                                    label: relationship?.relationship_name,
                                }))}
                                onChange={(val) => setForm(prev => ({ ...prev, relationship_id: val }))}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold">Prefix</span>
                            <Input className="h-12" value={form.prefix || ""} readOnly />
                        </label>

                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Last Name <span className="text-red-600">*</span></span>
                            <Select
                                showSearch
                                loading={personsLoading}
                                className="h-12  flex-1"
                                optionFilterProp="label"
                                value={form?.person_id}
                                options={persons?.map(person => ({
                                    value: person?.id,
                                    label: person?.last_name,
                                }))}
                                onChange={handlePersonSelect}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">First Name <span className="text-red-600">*</span></span>
                            <Select
                                showSearch
                                className="h-12  flex-1"
                                optionFilterProp="label"
                                value={form?.person_id}
                                loading={personsLoading}
                                options={persons?.map(person => ({
                                    value: person?.id,
                                    label: person?.first_name,
                                }))}
                                onChange={handlePersonSelect}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-[2]">
                            <span className="font-semibold">Middle Name <span className="text-red-600">*</span></span>
                            <Input className="h-12" value={form.middle_name || ""} readOnly />
                        </label>

                        <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold">Suffix <span className="text-red-600">*</span></span>
                            <Input className="h-12" value={form.suffix || ""} readOnly />
                        </label>
                    </div>

                    <div className="flex gap-2 w-full">
                        <label className="flex gap-2 items-center mt-8">
                            <span className="font-semibold">Contact Person</span>
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                checked={form?.contact_person}
                                onChange={() => setForm(prev => ({ ...prev, contact_person: !prev.contact_person }))}
                            />
                        </label>

                        <label className="flex flex-col gap-2 flex-1">
                            <span className="font-semibold">Mobile Number</span>
                            <Input className="h-12" value={form.mobile_number} onChange={(e) => setForm(prev => ({ ...prev, mobile_number: e.target.value }))} />
                        </label>

                        <label className="flex flex-col gap-2 flex-[3]">
                            <span className="font-semibold">Notes/ Remarks</span>
                            <Input className="h-12" value={form.remarks} onChange={(e) => setForm(prev => ({ ...prev, remarks: e.target.value }))} />
                        </label>
                    </div>

                    <div className="flex gap-2 w-full justify-end mt-5">
                        <div className="flex gap-4 w-[30%] h-full items-end">
                            <button
                                type="button" className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                type="button" className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default FMCForm