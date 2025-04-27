import { useTokenStore } from "@/store/useTokenStore"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from 'antd';
import { EMPLOYMENT_TYPE } from "@/lib/urls";

type EmploymentForm = {
    employment_type: string,
    description: string
};


const AddEmploymentType = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [EmploymentForm, setEmploymentForm] = useState<EmploymentForm>({
        employment_type: '',
        description: '',
    });

    const token = useTokenStore().token

    async function registerEmploymentType(employment_type: EmploymentForm) {
        const res = await fetch(EMPLOYMENT_TYPE.postEMPLOYMENT_TYPE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(employment_type)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering Employment Type');
        }

        return res.json()
    }

    const employmentTypeMutation = useMutation({
        mutationKey: ['employment-type'],
        mutationFn: registerEmploymentType,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully")
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmploymentForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleEmploymentTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        employmentTypeMutation.mutate(EmploymentForm)
    }

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleEmploymentTypeSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p>Employment Type:</p>
                            <input type="text" name="employment_type" id="employment_type" onChange={handleInputChange} placeholder="Employment Type" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        <div>
                            <p>Description:</p>
                            <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="w-full h-12 border border-gray-300 rounded-lg px-2" />
                        </div>
                        
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

export default AddEmploymentType