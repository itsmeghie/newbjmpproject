import { useTokenStore } from "@/store/useTokenStore"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from 'antd';
import { PDL } from "@/lib/urls"

type PDLForm = {
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    phone_no?: string | null;
    address?: string | null;
    telephone?: string | null;
    email?: string | null;
};


const PDLRegistration = ({ onClose }: { onClose: () => void }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [PDLForm, setPDLForm] = useState<PDLForm>({
        first_name: '',
        last_name: '',
        middle_name: '',
        phone_no: null,
        address: '',
        telephone: null,
        email: '',
    });

    const token = useTokenStore().token

    async function registerPDL(visitor: PDLForm) {
        const res = await fetch(PDL.getPDL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(visitor)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering PDL');
        }

        return res.json()
    }

    const pdlRegistrationMutation = useMutation({
        mutationKey: ['visitor-registration'],
        mutationFn: registerPDL,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPDLForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleVisitorFormRegistrationSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        pdlRegistrationMutation.mutate(PDLForm)
    }

    return (
        <div>
            {contextHolder}
            <form
                className="flex flex-col items-start
                "
                onSubmit={handleVisitorFormRegistrationSubmit}
            >
                <span className="flex gap-2">
                    <label htmlFor="fname">First Name</label>
                    <input
                        id="fname"
                        name="first_name"
                        type="text"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                        required
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="lname">Last Name</label>
                    <input
                        id="lname"
                        name="last_name"
                        type="text"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                        required
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="mname">Middle Name</label>
                    <input
                        id="mname"
                        name="middle_name"
                        type="text"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="phoneNo">Phone No.</label>
                    <input
                        id="phoneNo"
                        name="phone_no"
                        type="number"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="telephone">Telephone No.</label>
                    <input
                        id="telephone"
                        name="telephone"
                        type="number"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                    />
                </span>

                <span className="flex gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleInputChange}
                        className="border rounded border-gray-300"
                    />
                </span>

                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default PDLRegistration