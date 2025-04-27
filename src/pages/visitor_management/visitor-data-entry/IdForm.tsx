import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Input, Select, Upload, UploadFile, message } from 'antd';
import { IdentifierForm, PersonForm } from '@/lib/visitorFormDefinition';
import { Identifier } from '@/lib/definitions';

type Props = {
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    idTypes: Identifier[]
    handleIdsModalCancel: () => void;
    editRequirement: IdentifierForm | null;
    idIndexToEdit: number | null;
}

const IdForm = ({ setPersonForm, idTypes, handleIdsModalCancel, editRequirement, idIndexToEdit }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [idForm, setIdForm] = useState<IdentifierForm>({
        id_type_id: null,
        id_number: "",
        issued_by: "",
        date_issued: "",
        expiry_date: "",
        place_issued: "",
        remarks: "",
        record_status_id: 1,
        media_data: {
            media_type: "Picture",
            media_base64: "",
            media_description: "",
            record_status_id: 1,
        },
        status: "Under Review",
        direct_image: ""
    });

    const handlePreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as Blob);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const imgWindow = window.open(src);
        imgWindow?.document.write(`<img src='${src}' style='max-width: 100%;' />`);
    };

    const handleChange = async ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        const slicedList = newFileList.slice(-1);
        const updatedList = await Promise.all(
            slicedList.map(async (file) => {
                if (!file.thumbUrl && file.originFileObj) {
                    file.thumbUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj as Blob);
                        reader.onload = () => resolve(reader.result as string);
                    });
                }
                // Extract base64 string and update idForm.media_data
                if (file.thumbUrl) {
                    const base64String = file.thumbUrl.replace(/^data:image\/\w+;base64,/, "");
                    setIdForm((prev) => ({
                        ...prev,
                        media_data: {
                            ...prev.media_data,
                            media_base64: base64String,
                        },
                        direct_image: base64String
                    }));
                }
                return file;
            })
        );
        setFileList(updatedList);
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(`${file.name} is not an image`);
        }
        return false; // block auto upload
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Check required fields (marked with red asterisks)
        if (!idForm.id_type_id) newErrors.id_type_id = "ID Type is required";
        if (!idForm.id_number || idForm.id_number.trim() === "") newErrors.id_number = "ID Number is required";
        if (!idForm.media_data?.media_description || idForm.media_data.media_description.trim() === "") {
            newErrors.media_description = "Description is required";
        }

        setErrors(newErrors);

        // If there are any errors
        if (Object.keys(newErrors).length > 0) {
            const errorMessage = Object.values(newErrors).join(', ');
            message.error({
                content: `Please fill in all required fields: ${errorMessage}`,
                duration: 5
            });
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setPersonForm((prev) => {
            const updatedIdentifiers = [...(prev.media_identifier_data || [])];

            if (typeof idIndexToEdit === 'number') {
                updatedIdentifiers[idIndexToEdit] = idForm;
            } else {
                updatedIdentifiers.push(idForm);
            }

            return {
                ...prev,
                media_identifier_data: updatedIdentifiers,
            };
        });

        message.success(
            typeof idIndexToEdit === 'number'
                ? 'Identifier updated successfully!'
                : 'Identifier added successfully!'
        );

        // Reset form
        setIdForm({
            id_type_id: null,
            id_number: "",
            issued_by: "",
            date_issued: "",
            expiry_date: "",
            place_issued: "",
            remarks: "",
            record_status_id: 1,
            media_data: {
                media_type: "Picture",
                media_base64: "",
                media_description: "",
                record_status_id: 1,
            },
            status: "Under Review",
            direct_image: ""
        });

        setFileList([]);
        handleIdsModalCancel();
    };

    const handleCancel = () => {
        setIdForm({
            id_type_id: null,
            id_number: "",
            issued_by: "",
            date_issued: "",
            expiry_date: "",
            place_issued: "",
            remarks: "",
            record_status_id: 1,
            media_data: {
                media_type: "Picture",
                media_base64: "",
                media_description: "",
                record_status_id: 1,
            },
            status: "Under Review",
            direct_image: ""
        });
        setFileList([]);
        handleIdsModalCancel();
    };

    useEffect(() => {
        if (editRequirement) {
            setIdForm(editRequirement);
            if (editRequirement.media_data.media_base64) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'uploaded.png',
                        status: 'done',
                        url: `data:image/png;base64,${editRequirement.media_data.media_base64}`,
                    },
                ]);
            }
        }
    }, [editRequirement]);

    return (
        <div className='w-full mt-5'>
            <form className='w-full flex flex-col gap-6 px-10'>
                <div className='w-full flex gap-6 justify-between'>
                    <div className='flex flex-col w-full justify-between gap-1 flex-1'>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>ID Type <span className='text-red-500'>*</span></span>
                            <Select
                                value={idForm?.id_type_id}
                                status={errors.id_type_id ? "error" : undefined}
                                showSearch
                                optionFilterProp="label"
                                className='h-12 rounded-md outline-gray-300 !bg-gray-100'
                                options={idTypes?.map(id => ({
                                    value: id?.id,
                                    label: id?.id_type
                                }))}
                                onChange={value => {
                                    setIdForm(prev => ({
                                        ...prev,
                                        id_type_id: value
                                    }));
                                    if (errors.id_type_id) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.id_type_id;
                                            return newErrors;
                                        });
                                    }
                                }}
                            />
                        </label>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>ID Number <span className='text-red-500'>*</span></span>
                            <Input
                                value={idForm?.id_number}
                                status={errors.id_number ? "error" : undefined}
                                className='h-12'
                                onChange={(e) => {
                                    setIdForm(prev => ({ ...prev, id_number: e.target.value }));
                                    if (errors.id_number && e.target.value.trim() !== "") {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.id_number;
                                            return newErrors;
                                        });
                                    }
                                }}
                            />
                        </label>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Date Issued</span>
                            <Input
                                value={idForm?.date_issued}
                                className='h-12'
                                type='date'
                                onChange={(e) => setIdForm(prev => ({ ...prev, date_issued: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Expiry Date</span>
                            <Input
                                value={idForm?.expiry_date}
                                className='h-12'
                                type='date'
                                onChange={(e) => setIdForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Issued by</span>
                            <Input
                                value={idForm?.issued_by}
                                className='h-12'
                                onChange={(e) => setIdForm(prev => ({ ...prev, issued_by: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Place Issued</span>
                            <Input
                                value={idForm?.place_issued}
                                className='h-12'
                                onChange={(e) => setIdForm(prev => ({ ...prev, place_issued: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Description <span className='text-red-500'>*</span></span>
                            <Input
                                value={idForm?.media_data?.media_description}
                                status={errors.media_description ? "error" : undefined}
                                className='h-12'
                                onChange={(e) => {
                                    setIdForm((prev) => ({
                                        ...prev,
                                        media_data: {
                                            ...prev.media_data,
                                            media_description: e.target.value,
                                        },
                                    }));
                                    if (errors.media_description && e.target.value.trim() !== "") {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.media_description;
                                            return newErrors;
                                        });
                                    }
                                }}
                            />
                        </label>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Verification Status <span className='text-red-500'>*</span></span>
                            <Select
                                value={idForm?.status}
                                showSearch
                                optionFilterProp="label"
                                className='h-12 rounded-md outline-gray-300 !bg-gray-100'
                                options={[
                                    {
                                        label: "Under Review",
                                        value: "Under Review"
                                    },
                                    {
                                        label: "Rejected",
                                        value: "Rejected"
                                    },
                                    {
                                        label: "Approved",
                                        value: "Approved"
                                    },
                                    {
                                        label: "Pending",
                                        value: "Pending"
                                    },
                                ]}
                                onChange={value => (
                                    setIdForm(prev => ({
                                        ...prev,
                                        status: value
                                    }))
                                )}
                            />
                        </label>

                    </div>

                    <div className='flex-1 flex flex-col gap-4 items-center justify-center w-full'>
                        {/* Upload component */}
                        <Upload
                            id='requirements'
                            className="custom-upload-card-big"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            accept="image/*"
                            maxCount={1}
                        >
                            {fileList.length >= 1 ? null : (
                                <div>Upload</div>
                            )}
                        </Upload>
                        <label className='flex flex-col gap-1 w-full'>
                            <span className='font-semibold'>Notes / Remarks</span>
                            <Input.TextArea
                                className='!h-48'
                                value={idForm?.remarks || ""}
                                onChange={e => setIdForm(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </label>
                    </div>
                </div>

                <div className='w-[30%] flex gap-4 ml-[70%]'>
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
                        {typeof idIndexToEdit === 'number' ? 'Save' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IdForm;