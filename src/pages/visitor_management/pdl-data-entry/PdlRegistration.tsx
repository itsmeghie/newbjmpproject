import { DatePicker, Input, message, Modal, Select, Table } from "antd";
import { Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import AddAddress from "../visitor-data-entry/AddAddress";
import { useEffect, useState } from "react";
import VisitorProfile from "../visitor-data-entry/visitorprofile";
import Issue from "../visitor-data-entry/Issue";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
    getCivilStatus, getCountries, getCurrentUser, getDetention_Building, getDetention_Floor, getDetentionCell, getEthnicityProvinces, getGangAffiliation, getGenders, getInterests, getJail_Barangay,
    getJail_Municipality, getJail_Province, getJailRegion, getLooks, getMultipleBirthClassTypes, getNationalities,
    getOccupations,
    getPrecincts,
    getPrefixes, getRealPerson, getReligion, getSkills, getSuffixes, getTalents
} from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { PDLForm, PersonForm } from "@/lib/visitorFormDefinition";
import { calculateAge } from "@/functions/calculateAge";
import { ColumnsType } from "antd/es/table";
import ContactForm from "../visitor-data-entry/ContactForm";
import MultipleBirthSiblings from "../visitor-data-entry/MultipleBirthSiblings";
import Remarks from "../visitor-data-entry/Remarks";
import { BiometricRecordFace } from "@/lib/scanner-definitions";
import { BASE_URL, BIOMETRIC, PERSON } from "@/lib/urls";
import EducAttainment from "./EducAttainment";
import FMC from "./FMC";
import CaseDetails from "./CaseDetails";
import PdlVisitor from "./PdlVisitor";
import { getPDLVisitStatuses } from "@/lib/additionalQueries";

const addPerson = async (payload: PersonForm, token: string) => {

    const res = await fetch(PERSON.postPERSON, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.email[0] || 'Error registering person');
    }

    return res.json()
}

const registerPdl = async (visitor: PDLForm, token: string) => {
    const res = await fetch(`${BASE_URL}/api/pdls/pdl/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(visitor)
    })

    if (!res.ok) {
        const errorData = await res.json();
        // Throw the whole thing as a stringified object
        throw new Error(JSON.stringify(errorData));
    }

    return res.json()
}

const enrollBiometrics = async (
    enrollForm: BiometricRecordFace
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    const response = await fetch(BIOMETRIC.ENROLL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollForm),
    });

    if (!response.ok) {
        throw new Error("Failed to enroll biometric data");
    }

    return response.json();
};


const PdlRegistration = () => {
    const token = useTokenStore()?.token
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const [editAddressIndex, setEditAddressIndex] = useState<number | null>(null);
    const [editContactIndex, setEditContactIndex] = useState<number | null>(null);

    const [personForm, setPersonForm] = useState<PersonForm>({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: null,
        prefix: null,
        shortname: "",
        gender_id: null,
        date_of_birth: "",
        place_of_birth: "",
        nationality_id: null,
        civil_status_id: null,
        address_data: [],
        contact_data: [],
        employment_history_data: [],
        education_background_data: [],
        social_media_account_data: [],
        skill_id: [],
        talent_id: [],
        interest_id: [],
        media_identifier_data: [],
        media_requirement_data: [],
        diagnosis_data: [],
        religion_id: 1,
        media_data: [],
        multiple_birth_sibling_data: [],
    })
    const [pdlForm, setPdlForm] = useState<PDLForm>({
        date_of_admission: "2025-04-10",
        case_data: [],
        gang_affiliation_id: null,
        jail_id: 1,
        org_id: 1,
        occupation: null,
        person_id: null,
        status: "Under Trial",
        visitor_ids: [],
        pdl_alias: "",
        time_arrested: "",
        remarks_data: [],
        look_id: null,
        person_relationship_data: [],
        visitor: [],
        precinct_id: null,
        building_id: null,
        cell_id: null,
        floor_id: null,
        visitation_status_id: null,
    })

    const [icao, setIcao] = useState("")

    const [enrollFormFace, setEnrollFormFace] = useState<BiometricRecordFace>(
        {
            remarks: "Test",
            person: 0,
            biometric_type: "face",
            position: "face",
            place_registered: "Quezon City",
            upload_data: icao ?? "",
        }
    )

    const [enrollFormLeftIris, setEnrollFormLeftIris] = useState<BiometricRecordFace>(
        {
            remarks: "",
            person: 0,
            biometric_type: "iris",
            position: "iris_left",
            place_registered: "Quezon City",
            upload_data: "",
        }
    )

    const [enrollFormRightIris, setEnrollFormRightIris] = useState<BiometricRecordFace>(
        {
            remarks: "",
            person: 0,
            biometric_type: "iris",
            position: "iris_right",
            place_registered: "Quezon City",
            upload_data: "",
        }
    )

    const [enrollLeftLittleFinger, setEnrollLeftLittleFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint", // Always face for this case
        position: "finger_left_little", // Position for left little finger
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollLeftRingFinger, setEnrollLeftRingFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_left_ring",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollLeftMiddleFinger, setEnrollLeftMiddleFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_left_middle",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollLeftIndexFinger, setEnrollLeftIndexFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_left_index",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollRightLittleFinger, setEnrollRightLittleFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_right_little",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollRightRingFinger, setEnrollRightRingFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_right_ring",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollRightMiddleFinger, setEnrollRightMiddleFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_right_middle",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollRightIndexFinger, setEnrollRightIndexFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_right_index",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollLeftThumbFinger, setEnrollLeftThumbFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_left_thumb",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const [enrollRightThumbFinger, setEnrollRightThumbFinger] = useState<BiometricRecordFace>({
        remarks: "",
        person: 0,
        biometric_type: "fingerprint",
        position: "finger_right_thumb",
        place_registered: "Quezon City",
        upload_data: "",
    });

    const showAddressModal = () => {
        setIsAddressModalOpen(true);
    };

    const handleAddressCancel = () => {
        setIsAddressModalOpen(false);
    };

    const showContactModal = () => {
        setIsContactModalOpen(true);
    };

    const handleContactCancel = () => {
        setIsContactModalOpen(false);
    };

    //Edit Handlers
    const handleEditAddress = (index: number) => {
        setEditAddressIndex(index);
        setIsAddressModalOpen(true);
    };

    const handleEditContact = (index: number) => {
        setEditContactIndex(index);
        setIsContactModalOpen(true);
    };

    //Delete Handlers
    const handleDeleteAddress = (indexToDelete: number) => {
        setPersonForm(prev => ({
            ...prev,
            address_data: prev?.address_data?.filter((_, i) => i !== indexToDelete),
        }));
    };

    const handleDeleteContact = (indexToDelete: number) => {
        setPersonForm(prev => ({
            ...prev,
            contact_data: prev?.contact_data?.filter((_, i) => i !== indexToDelete),
        }));
    };

    const handleDeleteMultipleBirthSibling = (indexToDelete: number) => {
        setPersonForm(prev => ({
            ...prev,
            multiple_birth_sibling_data: prev?.multiple_birth_sibling_data?.filter((_, i) => i !== indexToDelete),
        }));
    };

    // const deletePdlToVisit = (index: number) => {
    //     setVisitorForm(prev => ({
    //         ...prev,
    //         pdl: prev?.pdl?.filter((_, i) => i !== index)
    //     }));
    // };

    // const deleteMediaIdentifierByIndex = (index: number) => {
    //     setPersonForm(prev => ({
    //         ...prev,
    //         media_identifier_data: prev?.media_identifier_data?.filter((_, i) => i !== index),
    //     }));
    // };

    // const deleteMediaRequirementByIndex = (index: number) => {
    //     setPersonForm(prev => ({
    //         ...prev,
    //         media_requirement_data: prev?.media_requirement_data?.filter((_, i) => i !== index),
    //     }));
    // };

    const deleteRemarksByIndex = (index: number) => {
        setPdlForm(prev => ({
            ...prev,
            remarks_data: prev?.remarks_data?.filter((_, i) => i !== index),
        }))
    }

    const dropdownOptions = useQueries({
        queries: [
            {
                queryKey: ['detention-cell-dorm'],
                queryFn: () => getDetentionCell(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['person-gender'],
                queryFn: () => getGenders(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['person-nationality'],
                queryFn: () => getNationalities(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['person-civil-status'],
                queryFn: () => getCivilStatus(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['religion'],
                queryFn: () => getReligion(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['regions'],
                queryFn: () => getJailRegion(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['provinces'],
                queryFn: () => getJail_Province(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['city/municipality'],
                queryFn: () => getJail_Municipality(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['barangays'],
                queryFn: () => getJail_Barangay(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['countries'],
                queryFn: () => getCountries(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['persons'],
                queryFn: () => getRealPerson(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['talents'],
                queryFn: () => getTalents(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['skills'],
                queryFn: () => getSkills(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['current-user'],
                queryFn: () => getCurrentUser(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['prefix'],
                queryFn: () => getPrefixes(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['suffix'],
                queryFn: () => getSuffixes(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['multiple-birth-class-types'],
                queryFn: () => getMultipleBirthClassTypes(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['interests'],
                queryFn: () => getInterests(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['detention-building-level'],
                queryFn: () => getDetention_Building(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
            {
                queryKey: ['detention-floor-annex'],
                queryFn: () => getDetention_Floor(token ?? ""),
                staleTime: 10 * 60 * 1000
            },
        ]
    })

    const { data: ethnicitiesProvinces, isLoading: ethnicitiesProvincesLoading } = useQuery({
        queryKey: ['enthinicity'],
        queryFn: () => getEthnicityProvinces(token ?? ""),
        staleTime: 10 * 60 * 1000
    })

    const { data: gangAffiliation, isLoading: gangAffiliationLoading } = useQuery({
        queryKey: ['gang-affiliation'],
        queryFn: () => getGangAffiliation(token ?? ""),
        staleTime: 10 * 60 * 1000
    })

    const { data: occupations, isLoading: occupationsLoading } = useQuery({
        queryKey: ['gang-occupations'],
        queryFn: () => getOccupations(token ?? ""),
        staleTime: 10 * 60 * 1000
    })

    const { data: looks, isLoading: looksLoading } = useQuery({
        queryKey: ['looks'],
        queryFn: () => getLooks(token ?? ""),
        staleTime: 10 * 60 * 1000
    })

    const { data: precincts, isLoading: precinctsLoading } = useQuery({
        queryKey: ['precincts'],
        queryFn: () => getPrecincts(token ?? ""),
        staleTime: 10 * 60 * 1000
    })

    const { data: pdlVisitStatuses, isLoading: pdlVisitStatusesLoading } = useQuery({
        queryKey: ['visitation-statuses'],
        queryFn: () => getPDLVisitStatuses(token ?? "")
    })

    const enrollFaceMutation = useMutation({
        mutationKey: ['enroll-face-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollFormFace, person: id }),
        onSuccess: () => message.success('Successfully enrolled Face'),
        onError: () => message.error("Failed to Enroll Face")
    })

    const enrollLeftMutation = useMutation({
        mutationKey: ['enroll-left-iris-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollFormLeftIris, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Iris'),
        onError: () => message.error("Failed to Enroll Left Iris")
    })

    const enrollRightMutation = useMutation({
        mutationKey: ['enroll-right-iris-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollFormRightIris, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Iris'),
        onError: () => message.error("Failed to Enroll Right Iris")
    })

    const enrollLeftLittleMutation = useMutation({
        mutationKey: ['enroll-left-little-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollLeftLittleFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Little Finger'),
        onError: () => message.error("Failed to Enroll Left Little Finger")
    })

    const enrollLeftRingMutation = useMutation({
        mutationKey: ['enroll-left-ring-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollLeftRingFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Ring Finger'),
        onError: () => message.error("Failed to Enroll Left Ring Finger")
    })

    const enrollLeftMiddleMutation = useMutation({
        mutationKey: ['enroll-left-middle-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollLeftMiddleFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Middle Finger'),
        onError: () => message.error("Failed to Enroll Left Middle Finger")
    })

    const enrollLeftIndexMutation = useMutation({
        mutationKey: ['enroll-left-index-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollLeftIndexFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Index Finger'),
        onError: () => message.error("Failed to Enroll Left Index Finger")
    })

    const enrollRightLittleMutation = useMutation({
        mutationKey: ['enroll-right-little-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollRightLittleFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Little Finger'),
        onError: () => message.error("Failed to Enroll Right Little Finger")
    })

    const enrollRightRingMutation = useMutation({
        mutationKey: ['enroll-right-ring-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollRightRingFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Ring Finger'),
        onError: () => message.error("Failed to Enroll Right Ring Finger")
    })

    const enrollRightMiddleMutation = useMutation({
        mutationKey: ['enroll-right-middle-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollRightMiddleFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Middle Finger'),
        onError: () => message.error("Failed to Enroll Right Middle Finger")
    })

    const enrollRightIndexMutation = useMutation({
        mutationKey: ['enroll-right-index-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollRightIndexFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Index Finger'),
        onError: () => message.error("Failed to Enroll Right Index Finger")
    })

    const enrollLeftThumbMutation = useMutation({
        mutationKey: ['enroll-left-thuumb-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollLeftThumbFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Left Thumb Finger'),
        onError: () => message.error("Failed to Enroll Left Thumb Finger")
    })

    const enrollRightThumbMutation = useMutation({
        mutationKey: ['enroll-right-thumb-mutation'],
        mutationFn: (id: number) => enrollBiometrics({ ...enrollRightThumbFinger, person: id }),
        onSuccess: () => message.success('Successfully enrolled Right Thumb Finger'),
        onError: () => message.error("Failed to Enroll Right Thumb Finger")
    })

    const addPdlMutation = useMutation({
        mutationKey: ['add-visitor'],
        mutationFn: (id: number) => registerPdl({ ...pdlForm, person_id: id }, token ?? ""),
        onSuccess: () => message.success('Successfully registered PDL'),
        onError: (err) => message.error(err.message)
    })


    const addPersonMutation = useMutation({
        mutationKey: ['add-person-visitor'],
        mutationFn: async () => {
            if (!personForm.first_name ||
                !personForm.last_name ||
                // !visitorForm.visitor_type_id ||
                !personForm.gender_id ||
                !personForm.date_of_birth ||
                !personForm.place_of_birth ||
                !personForm.civil_status_id
            ) {
                throw new Error("Please fill out all required fields");
            }

            return await addPerson(personForm, token ?? "");
        },
        onSuccess: async (data) => {
            const id = data?.id;

            try {
                await Promise.all([
                    addPdlMutation.mutateAsync(id),
                    ...(enrollFormFace?.upload_data ? [enrollFaceMutation.mutateAsync(id)] : []),
                    ...(enrollFormLeftIris?.upload_data ? [enrollLeftMutation.mutateAsync(id)] : []),
                    ...(enrollFormRightIris?.upload_data ? [enrollRightMutation.mutateAsync(id)] : []),
                    ...(enrollLeftLittleFinger?.upload_data ? [enrollLeftLittleMutation.mutateAsync(id)] : []),
                    ...(enrollLeftRingFinger?.upload_data ? [enrollLeftRingMutation.mutateAsync(id)] : []),
                    ...(enrollLeftMiddleFinger?.upload_data ? [enrollLeftMiddleMutation.mutateAsync(id)] : []),
                    ...(enrollLeftIndexFinger?.upload_data ? [enrollLeftIndexMutation.mutateAsync(id)] : []),
                    ...(enrollLeftThumbFinger?.upload_data ? [enrollLeftThumbMutation.mutateAsync(id)] : []),
                    ...(enrollRightLittleFinger?.upload_data ? [enrollRightLittleMutation.mutateAsync(id)] : []),
                    ...(enrollRightRingFinger?.upload_data ? [enrollRightRingMutation.mutateAsync(id)] : []),
                    ...(enrollRightMiddleFinger?.upload_data ? [enrollRightMiddleMutation.mutateAsync(id)] : []),
                    ...(enrollRightIndexFinger?.upload_data ? [enrollRightIndexMutation.mutateAsync(id)] : []),
                    ...(enrollRightThumbFinger?.upload_data ? [enrollRightThumbMutation.mutateAsync(id)] : []),
                ]);

                message?.success("Successfully Registered Person");
            } catch (err) {
                console.error("Enrollment error:", err);
                message?.error("Some enrollment steps failed");
            }
        },
        onError: (err) => {
            message?.error(err.message || "Something went wrong!");
        },
    });

    const dorms = dropdownOptions?.[0]?.data
    const genders = dropdownOptions?.[1]?.data
    const nationalities = dropdownOptions?.[2]?.data
    const nationalitiesLoading = dropdownOptions?.[2]?.isLoading
    const civilStatuses = dropdownOptions?.[3]?.data
    const religions = dropdownOptions?.[4]?.data
    const religionsLoading = dropdownOptions?.[4]?.isLoading
    const regions = dropdownOptions?.[5]?.data
    const provinces = dropdownOptions?.[6]?.data
    const municipalities = dropdownOptions?.[7]?.data
    const barangays = dropdownOptions?.[8]?.data
    const countries = dropdownOptions?.[9]?.data
    const persons = dropdownOptions?.[10]?.data
    const personsLoading = dropdownOptions?.[10]?.isLoading
    const talents = dropdownOptions?.[11]?.data
    const talentsLoading = dropdownOptions?.[11]?.isLoading
    const skills = dropdownOptions?.[12]?.data
    const skillsLoading = dropdownOptions?.[12]?.isLoading
    const currentUser = dropdownOptions?.[13]?.data
    const prefixes = dropdownOptions?.[14]?.data
    const prefixesLoading = dropdownOptions?.[14]?.isLoading
    const suffixes = dropdownOptions?.[15]?.data
    const suffixesLoading = dropdownOptions?.[15]?.isLoading
    const birthClassTypes = dropdownOptions?.[16]?.data
    const birthClassTypesLoading = dropdownOptions?.[16]?.isLoading
    const interests = dropdownOptions?.[17]?.data
    const interestsLoading = dropdownOptions?.[17]?.isLoading
    const levels = dropdownOptions?.[18]?.data
    const levelsLoading = dropdownOptions?.[18]?.isLoading
    const annex = dropdownOptions?.[19]?.data
    const annexLoading = dropdownOptions?.[19]?.isLoading

    const addressDataSource = personForm?.address_data?.map((address, index) => {
        return ({
            key: index,
            type: address?.type,
            region: regions?.find(region => region?.id === address?.region_id)?.desc,
            province: provinces?.find(province => province?.id === address?.province_id)?.desc,
            municipality: municipalities?.find(municipality => municipality?.id === address?.city_municipality_id)?.desc,
            barangay: barangays?.find(barangay => barangay?.id === address?.barangay_id)?.desc,
            zip: address?.postal_code,
            country: countries?.find(country => country?.id === address?.country_id)?.country,
            current: address?.is_current ? "Yes" : "No",
            active: address?.is_active ? "Yes" : "No",
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleEditAddress(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDeleteAddress(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const addressColumn: ColumnsType<{
        key: number;
        type: "Home" | "Work" | "Other";
        region: string | undefined;
        province: string | undefined;
        municipality: string | undefined;
        barangay: string | undefined;
        zip: string | null;
        country: string | undefined;
        current: string;
        active: string;
        actions: JSX.Element;
    }> = [
            {
                title: 'Types',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: 'Region',
                dataIndex: 'region',
                key: 'region',
            },
            {
                title: 'Province',
                dataIndex: 'province',
                key: 'province',
            },
            {
                title: 'City/Mun',
                dataIndex: 'municipality',
                key: 'municipality',
            },
            {
                title: 'Barangay',
                dataIndex: 'barangay',
                key: 'barangay',
            },
            {
                title: 'Zip Code',
                dataIndex: 'zip',
                key: 'zip',
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
            },
            {
                title: 'Current (Y/N)',
                dataIndex: 'current',
                key: 'current',
            },
            {
                title: 'Active (Y/N)',
                dataIndex: 'active',
                key: 'active',
            },
            {
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                align: 'center',
            },
        ];

    const contactDataSource = personForm?.contact_data?.map((contact, index) => {
        return ({
            key: index,
            contact_type: contact?.type,
            details: contact?.value,
            imei: contact?.mobile_imei,
            is_primary: contact?.is_primary ? "Yes" : "No",
            active: contact?.contact_status ? "Yes" : "No",
            remarks: contact?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        onClick={() => handleEditContact(index)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDeleteContact(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })
    const contactColumn: ColumnsType<{
        key: number;
        contact_type: string | null;
        details: string | null;
        imei: string | null;
        is_primary: string | null;
        active: string | null;
        remarks: string | null;
        actions: JSX.Element
    }> = [
            {
                title: 'Contact Type',
                dataIndex: 'contact_type',
                key: 'contact_type',
            },
            {
                title: 'Details',
                dataIndex: 'details',
                key: 'details',
            },
            {
                title: 'SIM Card IMEI',
                dataIndex: 'imei',
                key: 'imei',
            },
            {
                title: 'Primary (Y/N)',
                dataIndex: 'is_primary',
                key: 'is_primary',
            },
            {
                title: 'Active (Y/N)',
                dataIndex: 'active',
                key: 'active',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Actions",
                dataIndex: 'actions',
                key: "actions",
                align: 'center',
            },
        ];

    useEffect(() => {
        const short = `${personForm?.first_name?.[0] ?? ""}${personForm?.last_name?.[0] ?? ""}`;
        setPersonForm((prev) => ({ ...prev, shortname: short.toUpperCase() }));
    }, [personForm.first_name, personForm.last_name]);


    // console.log("PDL Form: ", pdlForm)
    // console.log("Person Form: ", personForm)

    return (
        <div className='bg-white rounded-md shadow border border-gray-200 py-5 px-7 w-full mb-5'>
            <h2 className='font-extrabold text-2xl'>PDL Registration</h2>
            <form>
                <div className='mt-5 text-gray-700'>
                    <h3 className='font-bold text-xl'>PDL Information</h3>
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex justify-end">
                            <div className="flex gap-2 w-[30%] items-end">
                                <div className='flex flex-col mt-2 w-full'>
                                    <div className='flex gap-1 font-semibold'>Level</div>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        loading={levelsLoading}
                                        className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                        options={levels?.map(level => ({
                                            value: level?.id,
                                            label: level?.bldg_name
                                        }))}
                                        onChange={value => {
                                            setPdlForm(prev => ({
                                                ...prev,
                                                building_id: value
                                            }))
                                        }}
                                    />
                                </div>
                                {/*Select Input Field */}
                                <div className='flex flex-col mt-2 w-full'>
                                    <div className='flex gap-1 font-semibold'>Annex</div>
                                    <Select
                                        showSearch
                                        loading={annexLoading}
                                        optionFilterProp="label"
                                        className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                        options={annex?.map(annex => ({
                                            value: annex?.id,
                                            label: annex?.floor_name
                                        }))}
                                        onChange={value => {
                                            setPdlForm(prev => ({
                                                ...prev,
                                                floor_id: value
                                            }))
                                        }}
                                    />
                                </div>
                                <div className='flex flex-col mt-2 w-full'>
                                    <div className='flex gap-1 font-semibold'>Dorm</div>
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                        options={dorms?.map(dorm => ({
                                            value: dorm?.id,
                                            label: dorm?.cell_name
                                        }))}
                                        onChange={value => {
                                            setPdlForm(prev => ({
                                                ...prev,
                                                cell_id: value
                                            }))
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>PDL No.<span className='text-red-600'>*</span></div>
                                <Input
                                    readOnly
                                    placeholder="YYYY-MM-DD-XXXXXXX"
                                    className='mt-2 h-10 rounded-md outline-gray-300'
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>File No.<p className='text-red-600'>*</p></div>
                                <Input
                                    readOnly
                                    placeholder="YYYY-MM-DD-XXXXXXX"
                                    className='mt-2 h-10 rounded-md outline-gray-300'
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Date Arrested</div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300'
                                    type="date"
                                    name="fname"
                                    placeholder="First Name"
                                    required
                                    onChange={(e) => setPdlForm(prev => ({ ...prev, time_arrested: e.target.value }))}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Jail Origin</div>
                                <Select
                                    loading={precinctsLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={precincts?.map(precinct => ({
                                        value: precinct?.id,
                                        label: precinct?.precinct_name
                                    }))}
                                    onChange={(value) => {
                                        setPdlForm(prev => (
                                            {
                                                ...prev,
                                                precinct_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Gang Affiliation</div>
                                <Select
                                    loading={gangAffiliationLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={gangAffiliation?.map(gang => ({
                                        value: gang?.id,
                                        label: gang?.name
                                    }))}
                                    onChange={(value) => {
                                        setPdlForm(prev => (
                                            {
                                                ...prev,
                                                gang_affiliation_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Visitation Status</div>
                                <Select
                                    loading={pdlVisitStatusesLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={pdlVisitStatuses?.map(status => ({
                                        value: status?.id,
                                        label: status?.name
                                    }))}
                                    onChange={(value) => {
                                        setPdlForm(prev => (
                                            {
                                                ...prev,
                                                visitation_status_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Prefix</div>
                                <Select
                                    loading={prefixesLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={prefixes?.map(prefix => ({
                                        value: prefix?.id,
                                        label: prefix?.prefix
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                prefix: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>Last Name<p className='text-red-600'>*</p></div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md'
                                    type="text" name="lname"
                                    placeholder="Last Name"
                                    required
                                    onChange={(e) => setPersonForm(prev => ({ ...prev, last_name: e.target.value }))}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>First Name<p className='text-red-600'>*</p></div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300'
                                    type="text"
                                    name="fname"
                                    placeholder="First Name"
                                    required
                                    onChange={(e) => setPersonForm(prev => ({ ...prev, first_name: e.target.value }))}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>Middle Name</div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300'
                                    type="text"
                                    name="middle-name"
                                    placeholder="Middle Name"
                                    required
                                    onChange={(e) => setPersonForm(prev => ({ ...prev, middle_name: e.target.value }))}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Suffix</div>
                                <Select
                                    loading={suffixesLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={suffixes?.map(suffix => ({
                                        value: suffix?.id,
                                        label: suffix?.suffix
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                suffix: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>Gender<p className='text-red-600'>*</p></div>
                                <Select
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={genders?.map(gender => ({
                                        value: gender?.id,
                                        label: gender?.gender_option
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                gender_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>Short Name</div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300'
                                    type="text"
                                    name="short-name"
                                    placeholder="Short Name"
                                    required
                                    value={personForm.shortname ?? ""}
                                    readOnly
                                />

                            </div>
                            <div className='flex flex-col mt-2 flex-[2]'>
                                <div className='flex gap-1 font-semibold'>Date of Birth<p className='text-red-600'>*</p></div>
                                <DatePicker
                                    placeholder="YYYY-MM-DD"
                                    className="mt-2 h-10 rounded-md outline-gray-300"
                                    onChange={(date) =>
                                        setPersonForm((prev) => ({
                                            ...prev,
                                            date_of_birth: date?.format("YYYY-MM-DD") ?? "",
                                        }))
                                    }
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Age<p className='text-red-600'>*</p></div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300 bg-gray-100'
                                    type="text" name="middle-name"
                                    placeholder="Age"
                                    disabled
                                    value={calculateAge(personForm?.date_of_birth)}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[3]'>
                                <div className='flex gap-1 font-semibold'>Place of Birth<p className='text-red-600'>*</p></div>
                                <Input
                                    className='mt-2 px-3 py-2 rounded-md outline-gray-300'
                                    type="text" name="birth-date"
                                    placeholder="Date of Birth"
                                    required
                                    onChange={(e) => setPersonForm(prev => ({ ...prev, place_of_birth: e.target.value }))}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[1.5]'>
                                <div className='flex gap-1 font-semibold'>Civil Status<p className='text-red-600'>*</p></div>
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={civilStatuses?.map(civilStatus => ({
                                        value: civilStatus?.id,
                                        label: civilStatus?.status
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                civil_status_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-[2]'>
                                <div className='flex gap-1 font-semibold'>Religion</div>
                                <Select
                                    loading={religionsLoading}
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={religions?.map(religion => ({
                                        value: religion?.id,
                                        label: religion?.name
                                    }))}
                                    onChange={value => {
                                        setPersonForm(prev => ({
                                            ...prev,
                                            religion_id: value
                                        }))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Occupation<span className='text-red-600'>*</span></div>
                                <Select
                                    loading={occupationsLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={occupations?.map(occupation => ({
                                        value: occupation?.id,
                                        label: occupation?.name
                                    }))}
                                    onChange={(value) => {
                                        setPdlForm(prev => (
                                            {
                                                ...prev,
                                                occupation: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Ethnicity<p className='text-red-600'>*</p></div>
                                <Select
                                    loading={ethnicitiesProvincesLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={ethnicitiesProvinces?.map(ethnicity => ({
                                        value: ethnicity?.id,
                                        label: `${ethnicity?.ethnicity}`
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                ethnicity_province: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Skill<p className='text-red-600'>*</p></div>
                                <Select
                                    loading={skillsLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={skills?.map(skill => ({
                                        value: skill?.id,
                                        label: skill?.name
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                skill_id: value ? [value] : []
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Talent<span className="text-red-600">*</span></div>
                                <Select
                                    loading={talentsLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={talents?.map(talent => ({
                                        value: talent?.id,
                                        label: talent?.name
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                talent_id: value ? [value] : []
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Interest<span className="text-red-600">*</span></div>
                                <Select
                                    loading={interestsLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={interests?.map(interest => ({
                                        value: interest?.id,
                                        label: interest?.name
                                    }))}
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                interest_id: value ? [value] : []
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Looks<span className="text-red-600">*</span></div>
                                <Select
                                    loading={looksLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={looks?.map(look => ({
                                        value: look?.id,
                                        label: look?.name
                                    }))}
                                    onChange={(value) => {
                                        setPdlForm(prev => (
                                            {
                                                ...prev,
                                                look_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                            <div className='flex flex-col mt-2 flex-1'>
                                <div className='flex gap-1 font-semibold'>Nationality <span className="text-red-600">*</span></div>
                                <Select
                                    loading={nationalitiesLoading}
                                    showSearch
                                    optionFilterProp="label"
                                    className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                                    options={nationalities?.map(nationality => ({
                                        value: nationality?.id,
                                        label: nationality?.nationality
                                    }))
                                        .sort((a, b) => {
                                            if (a.label === "Filipino") return -1;
                                            if (b.label === "Filipino") return 1;
                                            return 0;
                                        })
                                    }
                                    onChange={(value) => {
                                        setPersonForm(prev => (
                                            {
                                                ...prev,
                                                nationality_id: value
                                            }
                                        ))
                                    }}
                                />
                            </div>
                        </div>

                        <MultipleBirthSiblings
                            handleDeleteMultipleBirthSibling={handleDeleteMultipleBirthSibling}
                            prefixes={prefixes || []}
                            suffixes={suffixes || []}
                            genders={genders || []}
                            setPersonForm={setPersonForm}
                            personForm={personForm}
                            birthClassTypes={birthClassTypes || []}
                            birthClassTypesLoading={birthClassTypesLoading}
                            persons={persons || []}
                            personsLoading={personsLoading}
                        />

                        <div className="flex flex-col gap-5 mt-10">
                            <div className="flex justify-between">
                                <h1 className='font-bold text-xl'>Addresses</h1>
                                <button
                                    onClick={showAddressModal}
                                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                                    type="button"
                                >
                                    <Plus />
                                    Add Address
                                </button>
                            </div>
                            <div>
                                <Table
                                    className="border text-gray-200 rounded-md"
                                    dataSource={addressDataSource}
                                    columns={addressColumn}
                                    scroll={{ x: 800 }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 mt-10">
                            <div className="flex justify-between">
                                <h1 className='font-bold text-xl'>Contact Details</h1>
                                <button
                                    type="button"
                                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                                    onClick={showContactModal}
                                >
                                    <Plus />
                                    Add Contact
                                </button>
                            </div>
                            <div>
                                <Table
                                    className="border text-gray-200 rounded-md"
                                    dataSource={contactDataSource}
                                    columns={contactColumn}
                                    scroll={{ x: 800 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <EducAttainment
                setPersonForm={setPersonForm}
                personForm={personForm}
            />

            <FMC
                prefixes={prefixes || []}
                suffixes={suffixes || []}
                persons={persons || []}
                personsLoading={personsLoading}
                pdlForm={pdlForm}
                setPdlForm={setPdlForm}
            />

            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={editAddressIndex !== null ? "Edit Address" : "Add Address"}
                open={isAddressModalOpen}
                onCancel={handleAddressCancel}
                footer={null}
                width="70%"
            >
                <AddAddress
                    handleAddressCancel={handleAddressCancel}
                    setPersonForm={setPersonForm}
                    barangay={barangays || []}
                    countries={countries || []}
                    municipality={municipalities || []}
                    provinces={provinces || []}
                    regions={regions || []}
                    editAddressIndex={editAddressIndex}
                    personForm={personForm}
                />
            </Modal>

            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={editContactIndex !== null ? "Edit Contact" : "Add Contact"}
                open={isContactModalOpen}
                onCancel={handleContactCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
                <ContactForm
                    setPersonForm={setPersonForm}
                    handleContactCancel={handleContactCancel}
                    editContactIndex={editContactIndex}
                    personForm={personForm}
                />
            </Modal>

            {/**Biometrics */}
            <VisitorProfile
                icao={icao}
                setIcao={setIcao}
                setPersonForm={setPersonForm}
                enrollFormLeftIris={enrollFormLeftIris}
                enrollFormRightIris={enrollFormRightIris}
                setEnrollFormFace={setEnrollFormFace}
                setEnrollFormLeftIris={setEnrollFormLeftIris}
                setEnrollFormRightIris={setEnrollFormRightIris}
                setEnrollLeftIndexFinger={setEnrollLeftIndexFinger}
                setEnrollLeftLittleFinger={setEnrollLeftLittleFinger}
                setEnrollLeftMiddleFinger={setEnrollLeftMiddleFinger}
                setEnrollLeftRingFinger={setEnrollLeftRingFinger}
                setEnrollLeftThumbFinger={setEnrollLeftThumbFinger}
                setEnrollRightIndexFinger={setEnrollRightIndexFinger}
                setEnrollRightLittleFinger={setEnrollRightLittleFinger}
                setEnrollRightMiddleFinger={setEnrollRightMiddleFinger}
                setEnrollRightRingFinger={setEnrollRightRingFinger}
                setEnrollRightThumbFinger={setEnrollRightThumbFinger}
            />

            <CaseDetails
                pdlForm={pdlForm}
                setPdlForm={setPdlForm}
            />

            <PdlVisitor
                pdlForm={pdlForm}
                setPdlForm={setPdlForm}
            />

            <Issue />

            <Remarks
                deleteRemarksByIndex={deleteRemarksByIndex}
                currentUser={currentUser ?? null}
                setVisitorForm={setPdlForm}
            />

            <form>
                <div className="flex gap-2 mt-5">
                    <div className="flex flex-col gap-5 w-full">

                        <div className="flex items-center justify-end w-full gap-5">

                            <div className="flex gap-4 w-[30%] h-full items-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                                >
                                    View Profile
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                                    onClick={() => {
                                        addPersonMutation.mutate()
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PdlRegistration;