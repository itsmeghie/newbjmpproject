import { ContactForm as ContactFormType, PersonForm } from '@/lib/visitorFormDefinition'
import { Input, message, Select } from 'antd'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
    handleContactCancel: () => void;
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    personForm: PersonForm;
    editContactIndex: number | null;
}

const ContactForm = ({ handleContactCancel, setPersonForm, editContactIndex, personForm }: Props) => {
    const [contactForm, setContactForm] = useState<ContactFormType>(() => {
        if (editContactIndex !== null && personForm?.contact_data?.[editContactIndex]) {
            // We're editing, use the existing data
            return { ...personForm?.contact_data[editContactIndex] };
        }

        return {
            type: "",
            value: "",
            record_status_id: 1,
            contact_status: true,
            is_primary: false,
            mobile_imei: "",
            remarks: ""
        }
    })

    useEffect(() => {
        if (editContactIndex !== null && personForm.contact_data && personForm.contact_data[editContactIndex]) {
            setContactForm({ ...personForm.contact_data[editContactIndex] });
        } else {
            // Reset to default values for new address
            setContactForm({
                type: "",
                value: "",
                record_status_id: 1,
                contact_status: true,
                is_primary: false,
                mobile_imei: "",
                remarks: ""
            });
        }
    }, [editContactIndex, personForm.contact_data]);

    const handleSubmit = () => {

        if (!contactForm?.value) {
            message.warning("Contact Value is Required!")
            return
        }

        if (!contactForm?.type) {
            message.warning("Contact Type is Required!")
            return
        }

        setPersonForm(prev => {
            const currentContactData = Array.isArray(prev.contact_data) ? [...prev.contact_data] : []

            if (editContactIndex !== null) {
                // Edit existing address
                currentContactData[editContactIndex] = contactForm;
                return {
                    ...prev,
                    contact_data: currentContactData,
                };
            } else {
                // Add new address
                return {
                    ...prev,
                    contact_data: [...currentContactData, contactForm],
                };
            }

        })

        setContactForm({
            type: "",
            value: "",
            record_status_id: 1,
            contact_status: true,
            is_primary: false,
            mobile_imei: "",
            remarks: ""
        });

        message.success(editContactIndex !== null ? "Contact updated successfully" : "Contact added successfully");
        handleContactCancel()
    };

    const handleCancel = () => {
        setContactForm({
            type: "",
            value: "",
            record_status_id: 1,
            contact_status: true,
            is_primary: false,
            mobile_imei: "",
            remarks: ""
        });
        handleContactCancel()
    }

    return (
        <div className='mt-5'>
            <form className='flex flex-col gap-4'>
                <div className='flex items-end gap-4'>
                    <label htmlFor="contact-type" className="flex flex-col gap-1 flex-[4]">
                        <span>Contact Type <span className='text-red-500'>*</span></span>
                        <Select
                            showSearch
                            optionFilterProp="label"
                            className='h-12 rounded-md outline-gray-300 !bg-gray-100'
                            options={[
                                { value: "Phone", label: "Phone" },
                                { value: "Telephone", label: "Telephone" },
                                { value: "Email", label: "Email" },
                                { value: "Emergency Contact", label: "Emergency Contact" },
                            ]}
                            onChange={value => {
                                setContactForm(prev => ({
                                    ...prev,
                                    type: value
                                }))
                            }}
                        />
                    </label>
                    <label htmlFor="is-primary" className="flex items-center gap-2 flex-1">
                        <span>Active</span>
                        <input
                            id='is-primary'
                            className='w-5 h-5'
                            type='checkbox'
                            checked={contactForm?.contact_status ?? false}
                            onChange={() => setContactForm(prev => ({ ...prev, contact_status: !prev.contact_status }))}
                        />
                    </label>
                    <label htmlFor="is-active" className="flex items-center gap-2 flex-1">
                        <span>Primary</span>
                        <input
                            id='is-active'
                            className='w-5 h-5'
                            type='checkbox'
                            checked={contactForm?.is_primary ?? false}
                            onChange={() => setContactForm(prev => ({ ...prev, is_primary: !prev.is_primary }))}
                        />
                    </label>

                </div>
                <label htmlFor="contact-value" className="flex flex-col gap-1">
                    <span>Value <span className='text-red-500'>*</span></span>
                    <Input
                        value={contactForm?.value ?? ""}
                        id='Contact Information'
                        className='h-12'
                        placeholder=''
                        required
                        aria-required
                        onChange={e => setContactForm(prev => ({ ...prev, value: e.target.value }))}
                    />
                </label>
                <label htmlFor="mobile-imei" className="flex flex-col gap-1">
                    <span>Mobile IMEI</span>
                    <Input
                        value={contactForm?.mobile_imei ?? ""}
                        id='mobile-imei'
                        className='h-12'
                        placeholder='Mobile IMEI'
                        onChange={e => setContactForm(prev => ({ ...prev, mobile_imei: e.target.value }))}
                    />
                </label>
                <label htmlFor="remarks" className="flex flex-col gap-1">
                    <span>Remarks</span>
                    <Input.TextArea
                        value={contactForm?.remarks ?? ""}
                        id='remarks'
                        className='!h-20'
                        onChange={e => setContactForm(prev => ({ ...prev, remarks: e.target.value }))}
                    />
                </label>

                <div className='w-full flex gap-4'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={handleSubmit}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ContactForm