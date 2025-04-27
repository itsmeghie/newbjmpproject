import { getJail_Barangay, getJail_Category, getJail_Municipality, getJail_Province, getJail_Security_Level, getJail_Type, getJailRegion, getRecord_Status, updateJail } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";

type EditJailFacility = {
    jail_name: string;
    jail_type_id: number | null;
    jail_category_id: number | null;
    email_address: string;
    contact_number: string;
    jail_province_id: number| null;
    jail_city_municipality_id: number | null;
    jail_region_id: number| null;
    jail_barangay_id: number| null;
    jail_postal_code: number| null;
    security_level_id: number | null;
    record_status_id: number | null;
};

const EditJail = ({ jail, onClose }: { jail: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [ selectjail, setSelectJail] = useState<EditJailFacility>(
        {
        jail_name: '',
        jail_type_id: null,
        jail_category_id: null,
        email_address: '',
        contact_number: '',
        jail_province_id: null,
        jail_city_municipality_id: null,
        jail_region_id: null,
        jail_barangay_id: null,
        jail_postal_code: null,
        security_level_id: null,
        record_status_id: null,
        }
    )

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateJail(token ?? "", jail.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Jail Facility updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Jail Facility");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail-type'],
                queryFn: () => getJail_Type(token ?? "")
            },
            {
                queryKey: ['jail-category'],
                queryFn: () => getJail_Category(token ?? "")
            },
            {
                queryKey: ['jail-province'],
                queryFn: () => getJail_Province(token ?? "")
            },
            {
                queryKey: ['city-municipality'],
                queryFn: () => getJail_Municipality(token ?? "")
            },
            {
                queryKey: ['jail-region'],
                queryFn: () => getJailRegion(token ?? "")
            },
            {
                queryKey: ['jail-barangay'],
                queryFn: () => getJail_Barangay(token ?? "")
            },
            {
                queryKey: ['security-level'],
                queryFn: () => getJail_Security_Level(token ?? "")
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ]
    });

    const jailTypeData = results[0].data;
    const jailCategoryData = results[1].data;
    const jailProvinceData = results[2].data;
    const jailMunicipalityData = results[3].data;
    const jailRegionData = results[4].data;
    const jailBarangayData = results[5].data;
    const securityLevelData = results[6].data;
    const recordStatusData = results[7].data;

    useEffect(() => {
        if (jail) {
            form.setFieldsValue({
                jail_name: jail.jail_name,
                jail_type_id: jail.jail_type_id,
                jail_category_id: jail.jail_category_id,
                email_address: jail.email_address,
                contact_number: jail.contact_number,
                jail_province_id: jail.jail_province_id,
                jail_city_municipality_id: jail.jail_city_municipality_id,
                jail_region_id: jail.jail_region_id,
                jail_barangay_id: jail.jail_barangay_id,
                jail_postal_code: jail.jail_postal_code,
                security_level_id: jail.security_level_id,
                record_status_id: jail.record_status_id,
            });
        }
    }, [jail, form]);

    const handleJailSubmit = (values: any) => {
        const payload = {
            jail_name: values.jail_name,
            jail_type_id: values.jail_type_id, 
            jail_category_id: values.jail_category_id, 
            email_address: values.email_address,
            contact_number: values.contact_number,
            jail_province_id: values.jail_province_id,
            jail_city_municipality_id: values.jail_city_municipality_id,
            jail_region_id: values.jail_region_id,
            jail_barangay_id: values.jail_barangay_id,
            jail_postal_code: values.jail_postal_code,
            security_level_id: values.security_level_id,
            record_status_id: values.record_status_id,
        };
        
        
            const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== null)
            );
        
            setIsLoading(true);
            updateMutation.mutate(cleanedPayload);

            if (!values.jail_type_id || !values.jail_category_id) {
            message.error("Jail Type and Jail Category are required.");
            return;
            }
        };

    const onJailTypeChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_type_id: value
        }));
    };

    const onJailCategoryChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_category_id: value
        }));
    };

    const onRegionChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_region_id: value,
            jail_province_id: null,
            jail_city_municipality_id: null,
            jail_barangay_id: null,
        }));
        form.setFieldValue("jail_region_id", value);
    };
    
    const onJailProvinceChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_province_id: value,
            jail_city_municipality_id: null,
            jail_barangay_id: null,
        }));
        form.setFieldValue("jail_province_id", value);
    };
    
    const onMunicipalityChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_city_municipality_id: value,
            jail_barangay_id: null,
        }));
        form.setFieldValue("jail_city_municipality_id", value);
    };
    
    const onJailBarangayChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            jail_barangay_id: value,
        }));
        form.setFieldValue("jail_barangay_id", value);
    };    

    const onSecurityLevelChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            security_level_id: value,
        }));
    };  

    const onRecordStatusChange = (value: number) => {
        setSelectJail(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    }; 

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleJailSubmit}
                initialValues={{
                    jail_name: jail?.jail_name ?? 'N/A',
                    jail_type_id: jail?.jail_type_id ?? 'N/A',
                    jail_category_id: jail.jail_category_id ?? 'N/A',
                    email_address: jail.email_address ?? 'N/A',
                    contact_number: jail.contact_number ?? 'N/A',
                    jail_province_id: jail.jail_province_id ?? 'N/A',
                    jail_city_municipality_id: jail.jail_city_municipality_id ?? 'N/A',
                    jail_region_id: jail.jail_region_id ?? 'N/A',
                    jail_barangay_id: jail.jail_barangay_id ?? 'N/A',
                    jail_postal_code: jail.jail_postal_code ?? 'N/A',
                    security_level_id: jail.security_level_id ?? 'N/A',
                    record_status_id: jail.record_status_id ?? 'N/A',
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                    <Form.Item
                        label="Jail Name"
                        name="jail_name"
                    >
                        <Input className="h-12 border border-gray-300 rounded-lg px-2"/>
                    </Form.Item>
                    <Form.Item name="jail_type_id" label="Jail Type" rules={[{ required: true, message: 'Please select a jail type' }]}>
                        <Select className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Type"
                            optionFilterProp="label"
                            onChange={onJailTypeChange}
                            options={jailTypeData?.map(jail_type => (
                                {
                                    value: jail_type.id,
                                    label: jail_type?.type_name,
                                }
                            ))}
                        />
                    </Form.Item>
                    <Form.Item
                    name="jail_category_id"
                    label="Jail Category"
                    rules={[{ required: true, message: 'Please select a jail type' }]}
                    >
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail Category"
                        optionFilterProp="label"
                        onChange={onJailCategoryChange}
                        options={jailCategoryData?.map(jail_category => (
                            {
                                value: jail_category.id,
                                label: jail_category?.description,
                            }
                        ))}
                    />
                    </Form.Item>
                    <Form.Item
                        label="Email Address"
                        name="email_address"
                    >
                        <Input className="h-12 border border-gray-300 rounded-lg px-2"/>
                    </Form.Item>
                    <Form.Item
                        label="Contact Number"
                        name="contact_number"
                    >
                        <Input type="number" className="h-12 border border-gray-300 rounded-lg px-2"/>
                    </Form.Item>
                    <div className="flex flex-col gap-2">
                        <p>Region</p>
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail Region"
                        onChange={onRegionChange}
                        options={jailRegionData?.map(region => ({
                            value: region.id,
                            label: region?.desc,
                        }))}
                    />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Province</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Province"
                            onChange={onJailProvinceChange}
                            options={jailProvinceData?.filter(province => province.region === selectjail.jail_region_id).map(province => ({
                                value: province.id,
                                label: province?.desc,
                            }))}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>City/ Municipality</p>
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail Municipality"
                        onChange={onMunicipalityChange}
                        options={jailMunicipalityData?.filter(municipality => municipality.province === selectjail.jail_province_id).map(municipality => ({
                            value: municipality.id,
                            label: municipality?.desc,
                        }))}
                    />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Barangay</p>
                    <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail Barangay"
                        onChange={onJailBarangayChange}
                        options={jailBarangayData?.filter(barangay => barangay.municipality === selectjail.jail_city_municipality_id).map(barangay => ({
                            value: barangay.id,
                            label: barangay?.desc,
                        }))}
                    />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Security Level</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Security Level"
                            optionFilterProp="label"
                            onChange={onSecurityLevelChange}
                            options={securityLevelData?.map(security_level => (
                                {
                                    value: security_level.id,
                                    label: security_level?.category_name,
                                }
                            ))}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Record Status</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Record Status"
                            optionFilterProp="label"
                            onChange={onRecordStatusChange}
                            options={recordStatusData?.map(record_status => (
                                {
                                    value: record_status.id,
                                    label: record_status?.status,
                                }
                            ))}
                        />
                    </div>
                </div>
                <Form.Item>
                    <Button type="primary" className="mt-2 py-2 flex ml-auto" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Jail Facility"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default EditJail
