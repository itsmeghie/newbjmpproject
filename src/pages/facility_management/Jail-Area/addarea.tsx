import { getJail_Security_Level, getJail, getRecord_Status, getDetention_Building, getDetention_Floor } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { Select, message } from "antd";
import { JAIL_AREA } from "@/lib/urls";

type AddJailArea = {
    jail_id: number | null;
    building_id : number | null;
    security_level: number | null;
    record_status_id: number | null;
    floor_id: number | null;
    area_name: string;
};

const AddJailArea = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token
    const [messageApi, contextHolder] = message.useMessage();
    const [jailAreaForm, setJailAreaForm] = useState<AddJailArea>({
        jail_id: null,
        building_id :null,
        security_level: null,
        record_status_id: null,
        floor_id: null,
        area_name: '',
    })

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
            {
                queryKey: ['jail-security-level'],
                queryFn: () => getJail_Security_Level(token ?? "")
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
            {
                queryKey: ['detention-building'],
                queryFn: () => getDetention_Building(token ?? "")
            },
            {
                queryKey: ['detention-floor'],
                queryFn: () => getDetention_Floor(token ?? "")
            },
        ]
    });

    const jailData = results[0].data;
    const jailLoading = results[0].isLoading;

    const jailSecurityLevelData = results[1].data;
    const jailSecurityLevelLoading = results[1].isLoading;

    const recordStatusData = results[2].data;
    const recordStatusLoading = results[2].isLoading;

    const detentionBuildingData = results[3].data;
    const detentionBuildingLoading = results[3].isLoading;

    const detentionFloorData = results[4].data;
    const detentionFloorLoading = results[4].isLoading;

    async function registerJailArea(jailarea: AddJailArea) {
        const res = await fetch(JAIL_AREA.getJAIL_AREA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(jailarea),
        });

        if (!res.ok) {
            let errorMessage = "Error registering Jail Area";

            try {
                const errorData = await res.json();
                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }

            throw new Error(errorMessage);
        }

        return res.json();
    }


    const jailAreaMutation = useMutation({
        mutationKey: ['jail-area'],
        mutationFn: registerJailArea,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully")
            onClose();
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handleJailAreaSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        jailAreaMutation.mutate(jailAreaForm)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJailAreaForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const onJailChange = (value: number) => {
        setJailAreaForm(prevForm => ({
            ...prevForm,
            jail_id: value
        }));
    };

    const onJailSecurityLevelChange = (value: number) => {
        setJailAreaForm(prevForm => ({
            ...prevForm,
            security_level: value
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setJailAreaForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    const onDetentionBuildingChange = (value: number) => {
        setJailAreaForm(prevForm => ({
            ...prevForm,
            building_id: value
        }));
    };

    const onDetentionFloorChange = (value: number) => {
        setJailAreaForm(prevForm => ({
            ...prevForm,
            floor_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleJailAreaSubmit}>
                <h1 className="text-xl font-semibold">Add Jail Area</h1>
                <div className="flex gap-5 mt=3 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                        <div>
                            <p>Area Name:</p>
                            <input type="text" name="area_name" id="area_name" onChange={handleInputChange} placeholder="Area Name" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Jail:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Jail"
                                optionFilterProp="label"
                                onChange={onJailChange}
                                loading={jailLoading}
                                options={jailData?.map(jail => (
                                    {
                                        value: jail.id,
                                        label: jail?.jail_name,
                                    }
                                ))}
                            />
                        </div>
                        <div>
                            <p>Security Level:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Security Level"
                                optionFilterProp="label"
                                onChange={onJailSecurityLevelChange}
                                loading={jailSecurityLevelLoading}
                                options={jailSecurityLevelData?.map(security_level => (
                                    {
                                        value: security_level.id,
                                        label: security_level?.category_name
                                    }
                                ))}
                            />
                        </div>
                        <div>
                            <p>Record Status:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Record Status"
                                optionFilterProp="label"
                                onChange={onRecordStatusChange}
                                loading={recordStatusLoading}
                                options={recordStatusData?.map(record => (
                                    {
                                        value: record.id,
                                        label: record?.status,
                                    }
                                ))}
                            />
                        </div>
                        <div>
                            <p>Building:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Building"
                                optionFilterProp="label"
                                onChange={onDetentionBuildingChange}
                                loading={detentionBuildingLoading}
                                options={detentionBuildingData?.map(building => (
                                    {
                                        value: building.id,
                                        label: building?.bldg_name
                                    }
                                ))}
                            />
                        </div>
                        <div>
                            <p>Floor:</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Floor"
                                optionFilterProp="label"
                                onChange={onDetentionFloorChange}
                                loading={detentionFloorLoading}
                                options={detentionFloorData?.map(floor => (
                                    {
                                        value: floor.id,
                                        label: floor?.floor_name,
                                    }
                                ))}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end ml-auto mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddJailArea