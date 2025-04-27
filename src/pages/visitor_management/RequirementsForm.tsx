import { Dispatch, SetStateAction, useState } from 'react';
import { Input, Select, Upload, UploadFile, message, } from 'antd';
import { PersonForm, RequirementForm } from '@/lib/visitorFormDefinition';

type Props = {
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    handleRequirementsModalCancel: () => void;
}

const RequirementsForm = ({ handleRequirementsModalCancel, setPersonForm }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [requirementForm, setRequirementForm] = useState<RequirementForm>({
        name: "",
        date_issued: "",
        expiry_date: "",
        issued_by: "",
        place_issued: "",
        media_data: {
            media_type: "Picture",
            media_base64: "",
            media_description: "",
            record_status_id: 1
        },
        record_status_id: 1,
        remarks: "",
        status: "Under Review"
    })

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
                    setRequirementForm((prev) => ({
                        ...prev,
                        media_data: {
                            ...prev.media_data,
                            media_base64: base64String,
                        },
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
        return false;
    };

    return (
        <div className='w-full mt-5'>
            <form className='w-full flex flex-col gap-6 px-10' onSubmit={e => e.preventDefault()}>
                <div className='w-full flex gap-6 justify-between'>
                    <div className='flex flex-col w-full justify-between gap-1 flex-1'>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Requirement <span className='text-red-500'>*</span></span>
                            <Input
                                value={requirementForm?.name}
                                onChange={e => setRequirementForm(prev => ({ ...prev, name: e.target.value }))}
                                className='h-12'
                                required
                            />
                        </label>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Date Issued</span>
                            <Input
                                value={requirementForm?.date_issued}
                                className='h-12'
                                type='date'
                                onChange={(e) => setRequirementForm(prev => ({ ...prev, date_issued: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Expiry Date</span>
                            <Input
                                value={requirementForm?.expiry_date}
                                className='h-12'
                                type='date'
                                onChange={(e) => setRequirementForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Issued by</span>
                            <Input
                                value={requirementForm?.issued_by}
                                className='h-12'
                                onChange={(e) => setRequirementForm(prev => ({ ...prev, issued_by: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Place Issued</span>
                            <Input
                                value={requirementForm?.place_issued}
                                className='h-12'
                                onChange={(e) => setRequirementForm(prev => ({ ...prev, place_issued: e.target.value }))}
                            />
                        </label>

                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Description <span className='text-red-500'>*</span></span>
                            <Input
                                value={requirementForm?.media_data?.media_description}
                                className='h-12'
                                onChange={(e) =>
                                    setRequirementForm((prev) => ({
                                        ...prev,
                                        media_data: {
                                            ...prev.media_data,
                                            media_description: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </label>
                        <label className='flex flex-col gap-1'>
                            <span className='font-semibold'>Verification Status <span className='text-red-500'>*</span></span>
                            <Select
                                value={requirementForm?.status}
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
                                    setRequirementForm(prev => ({
                                        ...prev,
                                        status: value
                                    }))
                                )}
                            />
                        </label>
                    </div>

                    <div className='flex-1 flex flex-col gap-4 items-center justify-center w-full'>
                        {/* Hidden Upload component */}
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
                                value={requirementForm?.remarks}
                                className='!h-36'
                                onChange={e => setRequirementForm(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </label>
                    </div>
                </div>

                <div className='w-[30%] flex gap-4 ml-[70%]'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={() => {
                            setRequirementForm({
                                name: "",
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
                            })
                            setFileList([])
                            handleRequirementsModalCancel()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={() => {

                            if (!requirementForm.name || !requirementForm.media_data.media_description || !requirementForm.status) {
                                message.error('Please fill in all required fields!');
                                return; // Prevent submission
                            }
                            
                            setPersonForm((prev) => ({
                                ...prev,
                                media_requirement_data: [
                                    ...(prev.media_requirement_data || []),
                                    requirementForm,
                                ],
                            }));
                            message.success("Requirement added successfully!");
                            setRequirementForm({
                                name: "",
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
                            })
                            setFileList([])
                            handleRequirementsModalCancel()
                        }}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequirementsForm;
