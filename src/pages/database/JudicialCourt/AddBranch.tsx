import { getCourt, getJail_Province, getJailRegion } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries } from "@tanstack/react-query";
import { Input, message, Select } from "antd";
import { useState } from "react";

type BranchProps = {
  court_id: number;
  region_id: number;
  province_id: number;
  record_status_id: number;
  branch: string;
  judge: string;
};

type AddBranchProps = {
  courtId: number;
  courtName: string;
  onAddBranch: (branch: BranchProps) => void;
  onCancel: () => void;
};

const AddBranch = ({ courtId, courtName, onAddBranch, onCancel }: AddBranchProps) => {
  const token = useTokenStore().token;
  const [messageApi, contextHolder] = message.useMessage();

  const [form, setForm] = useState<{
    region_id: number | null;
    province_id: number | null;
    branch: string;
    judge: string;
  }>({
    region_id: null,
    province_id: null,
    branch: "",
    judge: "",
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
    ],
  });

  const RegionData = results[0].data || [];
  const ProvinceData = results[1].data || [];

  const handleChange = (field: "branch" | "judge", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onRegionChange = (value: number) => {
    setForm((prev) => ({
      ...prev,
      region_id: value,
      province_id: null,
    }));
  };

  const onProvinceChange = (value: number) => {
    setForm((prev) => ({
      ...prev,
      province_id: value,
    }));
  };

  const filteredProvinces = ProvinceData?.filter(
    (province) => province.region === form.region_id
);

  const handleSubmit = () => {
    const { region_id, province_id, branch, judge } = form;

    if (!region_id || !province_id || !branch || !judge) {
      messageApi.error("Please fill in all required fields.");
      return;
    }

    const newBranch: BranchProps = {
      court_id: courtId,
      region_id,
      province_id,
      branch,
      judge,
      record_status_id: 1,
    };

    onAddBranch(newBranch);
    messageApi.success("Branch added successfully.");

    setForm({
      region_id: null,
      province_id: null,
      branch: "",
      judge: "",
    });
  };

  return (
    <div>
      {contextHolder}
      <form>
        <div className="flex w-full gap-2 mt-5">
          <div className="w-full">
            <p className="text-[#1E365D] font-bold text-lg">Judicial Court</p>
            <Input className="h-12 w-full" value={courtName} disabled />
          </div>

          <div className="w-full">
            <p className="flex gap-[1px] text-[#1E365D] text-lg font-bold">
              Region <span className="text-red-600">*</span>
            </p>
            <Select
                className="h-[3rem] w-full"
                showSearch
                placeholder="Region"
                optionFilterProp="label"
                onChange={onRegionChange}
                options={RegionData?.map(region => ({
                    value: region.id,
                    label: region?.desc,
                }))}
            />
          </div>
          <div className="w-full">
            <p className="flex gap-[1px] text-[#1E365D] font-bold text-lg">
              Province <span className="text-red-600">*</span>
            </p>
            <Select
                className="h-[3rem] w-full"
                showSearch
                placeholder="Province"
                optionFilterProp="label"
                value={form.province_id ?? undefined}
                onChange={onProvinceChange}
                options={filteredProvinces?.map(province => ({
                    value: province.id,
                    label: province?.desc,
                }))}
                disabled={!form.region_id}
            />
          </div>
        </div>

        <div className="w-full flex gap-2 mt-5">
          <div className="flex flex-col w-full">
            <p className="text-[#1E365D] font-bold text-lg">Branch Name</p>
            <Input
              className="h-12 w-full"
              placeholder="Branch Name"
              value={form.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <p className="text-[#1E365D] font-bold text-lg">Judge's Name</p>
            <Input
              className="h-12 w-full"
              placeholder="Judge's Name"
              value={form.judge}
              onChange={(e) => handleChange("judge", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border border-[#1e365d] text-[#1e365d] px-3 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#1E365D] text-white px-3 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBranch;
