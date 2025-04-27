import { getGenders, getNationalities, getCivilStatus } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { Select, message } from "antd";
import { PERSON } from "@/lib/urls";

type PersonForm = {
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    shortname: string;
    gender_id: number | null;
    date_of_birth: string;
    place_of_birth: string;
    nationality_id: number | null;
    civil_status_id: number | null;
};

const PersonForm = () => {
    const token = useTokenStore().token
    const [messageApi, contextHolder] = message.useMessage();
    const [personForm, setPersonForm] = useState<PersonForm>({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        shortname: "",
        gender_id: null,
        date_of_birth: "",
        place_of_birth: "",
        nationality_id: null,
        civil_status_id: null,
    })

    // console.log(personForm)

    const results = useQueries({
        queries: [
            {
                queryKey: ['person-gender'],
                queryFn: () => getGenders(token ?? "")
            },
            {
                queryKey: ['person-nationality'],
                queryFn: () => getNationalities(token ?? "")
            },
            {
                queryKey: ['person-civil-status'],
                queryFn: () => getCivilStatus(token ?? "")
            }
        ]
    });

    const genderData = results[0].data;
    const genderLoading = results[0].isLoading;

    const nationalityData = results[1].data;
    const nationalityLoading = results[1].isLoading;

    const civilStatusData = results[2].data;
    const civilStatusLoading = results[2].isLoading;

    async function registerPerson(person: PersonForm) {
        const res = await fetch(PERSON.getPERSON, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(person),
        });

        if (!res.ok) {
            let errorMessage = "Error registering visitor";

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


    const personRegistrationMutation = useMutation({
        mutationKey: ['visitor-registration'],
        mutationFn: registerPerson,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully")
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handlePersonFormRegistrationSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        personRegistrationMutation.mutate(personForm)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const onGenderChange = (value: number) => {
        setPersonForm(prevForm => ({
            ...prevForm,
            gender_id: value
        }));
    };

    const onCivilStatusChange = (value: number) => {
        setPersonForm(prevForm => ({
            ...prevForm,
            civil_status_id: value
        }));
    };

    const onNationalityChange = (value: number) => {
        setPersonForm(prevForm => ({
            ...prevForm,
            nationality_id: value
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handlePersonFormRegistrationSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <input type="text" name="first_name" id="fname" onChange={handleInputChange} placeholder="First Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="middle_name" id="mname" onChange={handleInputChange} placeholder="Middle Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="last_name" id="lname" onChange={handleInputChange} placeholder="Last Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="suffix" id="suffix" onChange={handleInputChange} placeholder="Suffix" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="shortname" id="shortname" onChange={handleInputChange} placeholder="Short Name" className="h-12 border border-gray-300 rounded-lg px-2" />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <input type="date" name="date_of_birth" id="date_of_birth" onChange={handleInputChange} className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="place_of_birth" id="pob" onChange={handleInputChange} placeholder="place of birth" className="h-12 border border-gray-300 rounded-lg px-2" />

                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Gender"
                            optionFilterProp="label"
                            onChange={onGenderChange}
                            loading={genderLoading}
                            options={genderData?.map(gender => (
                                {
                                    value: gender.id,
                                    label: gender?.gender_option,
                                }
                            ))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Civil Status"
                            optionFilterProp="label"
                            onChange={onCivilStatusChange}
                            loading={civilStatusLoading}
                            options={civilStatusData?.map(status => (
                                {
                                    value: status.id,
                                    label: status?.status
                                }
                            ))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Nationality"
                            optionFilterProp="label"
                            onChange={onNationalityChange}
                            loading={nationalityLoading}
                            options={nationalityData?.map(nationality => (
                                {
                                    value: nationality.id,
                                    label: nationality?.nationality,
                                }
                            ))}
                        />
                    </div>
                </div>

                <div className="w-full flex justify-center mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm