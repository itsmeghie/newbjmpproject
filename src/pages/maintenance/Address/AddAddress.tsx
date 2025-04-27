import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { message, Select } from "antd";
import { useState } from "react";
import { BASE_URL } from "@/lib/urls";

type AddressProps = {
    record_status_id: number | null;
    address_type: string;
    description: string;
}

const AddAddress = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [addressForm, setAddressForm] = useState<AddressProps>({
        record_status_id: null,
        address_type: '',
        description: '',
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            }
        ]
    });

    const recordStatusData = results[0].data;

    async function addAddress(address: AddressProps) {
        const res = await fetch(`${BASE_URL}/api/standards/address-type/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(address),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Address";
    
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

    const addressMutation = useMutation({
        mutationKey: ['address'],
        mutationFn: addAddress,
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

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addressMutation.mutate(addressForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setAddressForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <h1 className="font-semibold text-xl">Add Contact</h1>
            <form onSubmit={handleAddressSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <p>Address Type:</p>
                        <input type="text" name="address_type" id="address_type" onChange={handleInputChange} placeholder="Address Type" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Description:</p>
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                    <div>
                        <p>Record Status:</p>
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

export default AddAddress
