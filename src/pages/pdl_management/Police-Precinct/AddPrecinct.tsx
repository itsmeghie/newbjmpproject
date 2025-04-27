import { getJail_Municipality, getJail_Province, getJailRegion, getRecord_Status } from "@/lib/queries";
import { BASE_URL } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Input, message, Select } from "antd";
import { useState } from "react";

export type AddPolicePrecinct = {
    precinct_id: string;
    precinct_name: string;
    coverage_area: string;
    region_id: number | null;
    province_id: number | null;
    city_municipality_id: number | null;
    record_status_id: number | null;
};

const AddPrecinct = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [precinctForm, setPrecinctForm] = useState<AddPolicePrecinct>({
        precinct_id: '',
        precinct_name: '',
        coverage_area: '',
        province_id: null,
        region_id: null,
        city_municipality_id: null,
        record_status_id: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["region"],
                queryFn: () => getJailRegion(token ?? ""),
            },
            {
                queryKey: ["province"],
                queryFn: () => getJail_Province(token ?? ""),
            },
            {
                queryKey: ["municipality"],
                queryFn: () => getJail_Municipality(token ?? ""),
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
        ],
    });

    const regionData = results[0].data;
    const provinceData = results[1].data;
    const municipalityData = results[2].data;
    const recordStatusData = results[3].data;

    async function addPrecinct(branch: AddPolicePrecinct) {
        const res = await fetch(`${BASE_URL}/api/pdls/precinct/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(branch),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Police Precinct";
            try {
                const errorData = await res.json();
                errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
            throw new Error(errorMessage);
        }
        return res.json();
    }

    const PrecinctMutation = useMutation({
        mutationKey: ["precinct"],
        mutationFn: addPrecinct,
        onSuccess: (data) => {
            console.log(data);
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error);
            messageApi.error(error.message);
        },
    })
    const handleBranchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedProvince = provinceData?.find(p => p.id === precinctForm.province_id);
        if (!selectedProvince) {
            messageApi.error("Selected province is invalid or does not exist.");
            return;
        }

        PrecinctMutation.mutate(precinctForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrecinctForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRegionChange = (value: number) => {
        setPrecinctForm(prevForm => ({
            ...prevForm,
            region_id: value,
            province_id: null, 
            city_municipality_id: null,
        }));
    };

    const onProvinceChange = (value: number) => {
        setPrecinctForm(prevForm => ({
            ...prevForm,
            province_id: value,
            city_municipality_id: null
        }));
    };

    const onMunicipalityChange = (value: number) => {
        setPrecinctForm(prevForm => ({
            ...prevForm,
            city_municipality_id: value,
        }));
    };
    const onRecordStatusChange = (value: number) => {
        setPrecinctForm(prevForm => ({
            ...prevForm,
            record_status_id: value,
        }));
    };

    const filteredProvinces = provinceData?.filter(
        (province) => province.region === precinctForm.region_id
    );

    const filteredMunicipality = municipalityData?.filter(
        (city_municipality) => city_municipality.province === precinctForm.province_id
    );

    return (
        <div>
                    {contextHolder}
            <form onSubmit={handleBranchSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="w-full">
                            <p>Precinct ID</p>
                            <Input
                                className="h-12 w-full"
                                id="precinct_id"
                                name="precinct_id"
                                placeholder="Precinct ID"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full">
                            <p>Precinct Name</p>
                            <Input
                                className="h-12 w-full"
                                id="precinct_name"
                                name="precinct_name"
                                placeholder="Precinct Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full">
                            <p>Coverage Area</p>
                            <Input
                                className="h-12 w-full"
                                id="coverage_area"
                                name="coverage_area"
                                placeholder="Coverage Area"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full">
                            <p>Region</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Region"
                                optionFilterProp="label"
                                onChange={onRegionChange}
                                options={regionData?.map(region => ({
                                    value: region.id,
                                    label: region?.desc,
                                }))}
                            />
                        </div>
                        <div className="w-full">
                            <p>Province</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Province"
                                optionFilterProp="label"
                                value={precinctForm.province_id ?? undefined}
                                onChange={onProvinceChange}
                                options={filteredProvinces?.map(province => ({
                                    value: province.id,
                                    label: province?.desc,
                                }))}
                                disabled={!precinctForm.region_id}
                            />
                        </div>
                        <div className="w-full">
                            <p>City / Municipality</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="City / Municipality"
                                optionFilterProp="label"
                                value={precinctForm.city_municipality_id ?? undefined}
                                onChange={onMunicipalityChange}
                                options={filteredMunicipality?.map(municipality => ({
                                    value: municipality.id,
                                    label: municipality?.desc,
                                }))}
                                disabled={!precinctForm.province_id}
                            />
                        </div>
                        <div className="w-full">
                            <p>Record Status</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Record Status"
                                optionFilterProp="label"
                                onChange={onRecordStatusChange}
                                options={recordStatusData?.map(status => ({
                                    value: status.id,
                                    label: status?.status,
                                }))}
                            />
                        </div>
                </div>
                <div className="w-full flex justify-end mt-10">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPrecinct
