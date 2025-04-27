import { getJail, getJail_Security_Level, getRecord_Status } from "@/lib/queries";
import { DETENTION_BUILDING } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type Building = {
    jail: number | null;
    bldg_name: string;
    security_level: number | null;
    bldg_description: string;
    bldg_status: string;
    record_status_id: number | null;
};

const AddAnnex = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();

    const [formData, setFormData] = useState<Building>({
        jail: null,
        bldg_name: "",
        security_level: null,
        bldg_description: "",
        bldg_status: "",
        record_status_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["jail"],
                queryFn: () => getJail(token ?? ""),
            },
            {
                queryKey: ["security-level"],
                queryFn: () => getJail_Security_Level(token ?? ""),
            },
            {
                queryKey: ["record-status"],
                queryFn: () => getRecord_Status(token ?? ""),
            },
        ],
    });

    const jailData = results[0].data;
    const securityLevelData = results[1].data;
    const recordStatusData = results[2].data;

    async function addBuilding(building: Building) {
        const payload = {
            jail_id: building.jail,
            bldg_name: building.bldg_name,
            security_level_id: building.security_level,
            bldg_description: building.bldg_description,
            bldg_status: building.bldg_status,
            record_status_id: building.record_status_id,
        };

        const res = await fetch(DETENTION_BUILDING.getDETENTION_BUILDING, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Detention Building";
            try {
                const errorData = await res.json();
                errorMessage = errorData?.message || JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
            throw new Error(errorMessage);
        }

        return res.json();
    }

    const annexMutation = useMutation({
        mutationKey: ['annex'],
        mutationFn: addBuilding,
        onSuccess: () => {
            messageApi.success("Annex added successfully");
            onClose();
        },
        onError: (error: any) => {
            console.error(error);
            messageApi.error(error.message);
        },
    });

    const handleAnnexSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        annexMutation.mutate(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onJailChange = (value: number) => {
        setFormData(prev => ({ ...prev, jail: value }));
    };

    const onSecurityLevelChange = (value: number) => {
        setFormData(prev => ({ ...prev, security_level: value }));
    };

    const onRecordStatusChange = (value: number) => {
        setFormData(prev => ({ ...prev, record_status_id: value }));
    };

    const onStatusChange = (value: string) => {
        setFormData(prev => ({ ...prev, bldg_status: value }));
    };

    return (
        <div className="space-y-4">
            {contextHolder}
            <form onSubmit={handleAnnexSubmit}>
                <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
                    <div>
                        <p>Jail Facility:</p>
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Select Jail Facility"
                            optionFilterProp="label"
                            onChange={onJailChange}
                            value={formData.jail ?? undefined}
                            options={jailData?.map(jail => ({
                                value: jail.id,
                                label: jail.jail_name,
                            }))}
                            />
                    </div>
                    <div>
                        <p>Building Name:</p>
                        <input
                        type="text"
                        name="bldg_name"
                        value={formData.bldg_name}
                        onChange={handleInputChange}
                        placeholder="Building Name"
                        className="h-12 border border-gray-300 rounded-lg px-2 w-full"
                        required
                    />
                    </div>
                    <div>
                        <p>Security Level:</p>
                        <Select
                            className="h-[3rem] w-full"
                            placeholder="Security Level"
                            onChange={onSecurityLevelChange}
                            value={formData.security_level ?? undefined}
                            options={securityLevelData?.map(level => ({
                                value: level.id,
                                label: level.category_name,
                            }))}
                        />
                    </div>
                    <div>
                    <p>Building Description:</p>
                        <textarea
                            name="bldg_description"
                            value={formData.bldg_description}
                            onChange={handleInputChange}
                            placeholder="Building Description"
                            className="border border-gray-300 rounded-lg px-2 py-2 w-full"
                            rows={3}
                        />
                    </div>
                    <div>
                    <p>Building Status:</p>
                        <Select
                            className="h-[3rem] w-full"
                            placeholder="Building Status"
                            onChange={onStatusChange}
                            value={formData.bldg_status || undefined}
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" },
                            ]}
                        />
                    </div>
                    <div>
                    <p>Record Status:</p>
                        <Select
                            className="h-[3rem] w-full"
                            placeholder="Record Status"
                            onChange={onRecordStatusChange}
                            value={formData.record_status_id ?? undefined}
                            options={recordStatusData?.map(status => ({
                                value: status.id,
                                label: status.status,
                            }))}
                        />
                    </div>
                </div>
                <div className="flex mt-5 justify-end ml-auto">
                    <button
                    type="submit"
                    className="w-full max-w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Submit
                </button>
                </div>
                
            </form>
        </div>
    );
};

export default AddAnnex;
