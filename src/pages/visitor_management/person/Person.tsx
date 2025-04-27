import { getPerson } from '@/lib/queries'
import { useTokenStore } from "@/store/useTokenStore"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { ColumnsType } from "antd/es/table";
import { Button, Modal, Table } from "antd"
import { GoCheck, GoPlus } from 'react-icons/go'
import { AiOutlineEdit } from 'react-icons/ai'
import { AiOutlineDelete } from 'react-icons/ai'
import { LuSearch } from "react-icons/lu";
import PersonForm from './PersonForm';
import FaceRegistrationForm from './FaceRegistrationForm';
import { Person as PersonType } from '@/lib/definitions';
import Verify from './Verify';

const Person = () => {
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalForFaceOpen, setIsModalForFaceOpen] = useState(false);
    const [isModalForVerificationOpen, setModalForVerificationOpen] = useState(false)
    const [selectedPerson, setSelectedPerson] = useState<PersonType | null>(null);
    const token = useTokenStore().token

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showFaceRegistrationModal = (person: PersonType | null) => {
        setSelectedPerson(person);
        setIsModalForFaceOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setSelectedPerson(null);
    };

    const handleFaceRegistrationModalOk = () => {
        setIsModalForFaceOpen(false);
        setSelectedPerson(null);
    };

    const handleFaceRegistrationModalCancel = () => {
        setIsModalForFaceOpen(false);
        setSelectedPerson(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedPerson(null);
    };

    const handleVerificationModalOk = () => {
        setModalForVerificationOpen(false)
    }

    const handleVerificationModalCancel = () => {
        setModalForVerificationOpen(false)
    }

    const showVerificationModal = () => {
        setModalForVerificationOpen(true)
    }

    const { data } = useQuery({
        queryKey: ['person'],
        queryFn: () => getPerson(token ?? "")
    })

    const dataSource = data?.map((person, index) => (
        {
            key: index,
            id: person.id,
            firstName: person?.first_name ?? 'N/A',
            middleName: person?.middle_name ?? 'N/A',
            lastName: person?.last_name ?? 'N/A',
            suffix: person?.suffix ?? 'N/A',
            shortName: person?.shortname ?? 'N/A',
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded-full w-10 h-10 flex items-center justify-center">
                        <AiOutlineEdit />
                    </button>
                    <button className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded-full flex w-10 h-10 items-center justify-center">
                        <AiOutlineDelete />
                    </button>
                </div>
            ),
            profile: (
                <div className="flex flex-col gap-1.5 font-semibold transition-all ease-in-out duration-200">
                    <button
                        onClick={() => showFaceRegistrationModal(person)}
                        className="bg-blue-500 text-white px-8 py-2 rounded-md flex gap-1 items-center justify-center"
                    >
                        <GoPlus />
                        Register Face
                    </button>
                </div>
            ),
        }
    ))

    const filteredData = dataSource?.filter((visitor) =>
        Object.values(visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<{
        key: number;
        id: number;
        firstName: string;
        middleName: string;
        lastName: string;
        suffix: string;
        shortName: string;
        actions: JSX.Element;
        profile: JSX.Element;
    }> = [
            {
                title: "Person ID",
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Middle Name',
                dataIndex: 'middleName',
                key: 'middleName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Suffix',
                dataIndex: 'suffix',
                key: 'suffix',
            },
            {
                title: 'Short Name',
                dataIndex: 'shortName',
                key: 'shortName',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                align: 'center'
            },
            {
                title: 'Profile',
                dataIndex: 'profile',
                key: 'profile',
                align: 'center',
            },
        ];

    return (
        <>
            <div className="mt-10 flex flex-col gap-5 item-center">
                <div className="w-full flex gap-5">
                    <div className="flex-1 relative flex items-center">
                        <input
                            placeholder="Search"
                            type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-400 h-10 w-full rounded-md px-2 active:outline-none focus:outline-none"
                        />
                        <LuSearch className="absolute right-[1%] text-gray-400" />
                    </div>
                    <button
                        onClick={() => showModal()}
                        className="bg-blue-500 text-white px-8 py-2 rounded-md flex gap-1 items-center justify-center"
                    >
                        <GoPlus />
                        Add Person
                    </button>
                    <button
                        onClick={showVerificationModal}
                        className="bg-green-500 text-white px-8 py-2 rounded-md flex gap-1 items-center justify-center"
                    >
                        <GoCheck />
                        Verify
                    </button>
                </div>
                <Table dataSource={filteredData} columns={columns} />
            </div>

            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title={selectedPerson ? "Edit Person" : "Add Person"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '70%',
                    xl: '70%',
                    xxl: '55%',
                }}
                height={"80%"}
            >
                <PersonForm />
            </Modal>

            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Register Face"
                open={isModalForFaceOpen}
                onOk={handleFaceRegistrationModalOk}
                onCancel={handleFaceRegistrationModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleFaceRegistrationModalCancel}>
                        Cancel
                    </Button>,
                ]}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '70%',
                    xl: '70%',
                    xxl: '55%',
                }}
                height={"80%"}
            >
                <FaceRegistrationForm person={selectedPerson} />
            </Modal>

            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Verify"
                open={isModalForVerificationOpen}
                onOk={handleVerificationModalOk}
                onCancel={handleVerificationModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleVerificationModalCancel}>
                        Cancel
                    </Button>,
                ]}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '70%',
                    xl: '70%',
                    xxl: '55%',
                }}
                height={"80%"}
            >
                <Verify />
            </Modal>

        </>
    )
}

export default Person