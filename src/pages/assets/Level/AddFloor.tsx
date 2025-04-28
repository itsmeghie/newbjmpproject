import { getDetention_Building, getJail_Security_Level, getRecord_Status } from "@/lib/queries";
import { BASE_URL } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";

type AddFloorValue = {
  building_id: number | null,
  floor_number: "",
  floor_name: "",
  floor_description: "",
  security_level_id: number | null,
  record_status_id: number | null,
}
const AddFloor = ({ onClose }: { onClose: () => void }) => {
  const token = useTokenStore().token;
  const [messageApi, contextHolder] = message.useMessage();
  const [selectDetentionFloor, setSelectDetentionFloor] = useState<AddFloorValue>({
    building_id: null,
    floor_number: "",
    floor_name: "",
    floor_description: "",
    security_level_id: null,
    record_status_id: null,
  });

  const results = useQueries({
    queries: [
          {
            queryKey: ['record-status'],
            queryFn: () => getRecord_Status(token ?? "")
          },
          {
            queryKey: ['building'],
            queryFn: () => getDetention_Building(token ?? "")
          },
          {
            queryKey: ['security-level'],
            queryFn: () => getJail_Security_Level(token ?? "")
          },
      ]
  });

  const recordStatusData = results[0].data;
  const buildingData = results[1].data;
  const securityLevelData = results[2].data;

    async function AddFloor(floor: AddFloorValue) {
        const res = await fetch(`${BASE_URL}/api/jail/detention-floors/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(floor),
        });
        if (!res.ok) {
            let errorMessage = "Error Adding Detention Floor";
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
    const FloorMutation = useMutation({
      mutationKey: ['floor'],
      mutationFn: AddFloor,
      onSuccess: (data) => {
          console.log(data);
          messageApi.success("Added successfully");
          onClose();
      },
      onError: (error) => {
          console.error(error);
          messageApi.error(error.message);
      },
  });

  const handleFloorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    FloorMutation.mutate(selectDetentionFloor);
  };

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
          const { name, value } = e.target;
          setSelectDetentionFloor(prevForm => ({
          ...prevForm,
          [name]: value,
          }));
      };

  const onRecordStatusChange = (value: number) => {
      setSelectDetentionFloor(prevForm => ({
          ...prevForm,
          record_status_id: value
      }));
  };

  const onBuildingChange = (value: number) => {
    setSelectDetentionFloor(prevForm => ({
        ...prevForm,
        building_id: value
    }));
  };

  const onSecurityLevelChange = (value: number) => {
    setSelectDetentionFloor(prevForm => ({
        ...prevForm,
        security_level_id: value
    }));
  };
  return (
    <div>
    {contextHolder}
        <form onSubmit={handleFloorSubmit}>
          <h1 className="font-semibold">Add Annex</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <div>
                    <p className="text-gray-500 font-bold">Building:</p>
                    <Select
                    className="h-[3rem] w-full"
                    showSearch
                    placeholder="Building"
                    optionFilterProp="label"
                    onChange={onBuildingChange}
                    options={buildingData?.map(building => (
                        {
                            value: building.id,
                            label: building?.bldg_name,
                        }
                    ))}
                    />
                </div>
                <div>
                    <p className="text-gray-500 font-bold">Floor Number:</p>
                    <input type="number" name="floor_number" id="floor_number" onChange={handleInputChange} placeholder="Floor Number" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                </div>
                <div>
                    <p className="text-gray-500 font-bold">Floor Name:</p>
                    <input type="text" name="floor_name" id="floor_name" onChange={handleInputChange} placeholder="Floor Name" className="h-12 border border-gray-300 rounded-lg px-2 w-full" />
                </div>
                <div>
                    <p className="text-gray-500 font-bold">Floor Description:</p>
                    <textarea name="floor_description" id="floor_description" onChange={handleInputChange} placeholder="Floor Description" className="h-12 border outline-none border-gray-300 rounded-lg px-2 w-full" />
                </div>
                <div>
                    <p className="text-gray-500 font-bold">Security Level:</p>
                    <Select
                    className="h-[3rem] w-full"
                    showSearch
                    placeholder="Security Level"
                    optionFilterProp="label"
                    onChange={onSecurityLevelChange}
                    options={securityLevelData?.map(level => (
                        {
                            value: level.id,
                            label: level?.category_name,
                        }
                    ))}
                    />
                </div>
                <div>
                    <p className="text-gray-500 font-bold">Record Status:</p>
                    <Select
                    className="h-[3rem] w-full"
                    showSearch
                    placeholder="Record Status"
                    optionFilterProp="label"
                    onChange={onRecordStatusChange}
                    options={recordStatusData?.map(status => (
                        {
                            value: status.id,
                            label: status?.status,
                        }
                    ))}
                    />
                </div>
            </div>
            <div className="w-full flex justify-end mt-10">
                <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                Submit
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddFloor
