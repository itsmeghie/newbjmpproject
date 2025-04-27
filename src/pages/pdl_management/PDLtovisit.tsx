import { Table, Button } from "antd";
import {  Plus } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFileSearch } from "react-icons/ai";

const PDLtovisit = () => {
    const dataSource = [
            {   
                lname: 'Santos',
                fname: 'Rose',
                mname: 'Cruz',
                relationship: 'Spouse',
            },
        ];
    
        const columns = [
            {
                title: 'Last Name',
                dataIndex: 'lname',
                key: 'lname',
            },
            {
                title: 'First Name',
                dataIndex: 'fname',
                key: 'fname',
            },
            {
                title: 'Middle Name',
                dataIndex: 'mname',
                key: 'mname',
            },
            {
                title: 'Relationship to PDL',
                dataIndex: 'relationship',
                key: 'relationship',
            },
            {
                title: 'Level',
                dataIndex: 'level',
                key: 'level',
            },
            {
                title: 'Annex',
                dataIndex: 'annex',
                key: 'annex',
            },
            {
                title: 'Dorm',
                dataIndex: 'dorm',
                key: 'dorm',
            },
            {
                title: 'PDL Visitation Status',
                dataIndex: 'pdl-visitation-status',
                key: 'pdl-visitation-status',
            },
            {
                title: 'Multiple Birth Classification',
                dataIndex: 'birth-class',
                key: 'birth-class',
            },
            {
                title: "Actions",
                key: "actions",
                AlignCenter: 'center',
                render: () => (
                    <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                        <Button
                            type="primary"
                        >
                            <AiOutlineEdit />
                        </Button>
                        <Button
                            type="primary"
                            danger
                        >
                            <AiOutlineDelete />
                        </Button>
                        <Button
                            type="primary"
                            ghost
                        >
                            <AiOutlineFileSearch />
                        </Button>
                    </div>
                ),
            },
        ];

        const dataSources = [
            {   
                requirement: 'Birth Certificate',
                scannedimage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3xty01LPbLtTQ1HxU_vks9wHuYC5bX49HBg&s',
                status: 'Under Review'
            },
        ];
    
        const column = [
            {
                title: 'Requiement',
                dataIndex: 'requirement',
                key: 'requirement',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Scanned Image',
                dataIndex: 'scannedimage',
                key: 'scannedimage',
                render: (text: any) => (
                    <img src={text} alt="Scanned" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ),
            },
            {
                title: 'Verification Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'notes',
                key: 'notes',
            },
            {
                title: "Actions",
                key: "actions",
                AlignCenter: 'center',
                render: () => (
                    <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                        <Button
                            type="primary"
                        >
                            <AiOutlineEdit />
                        </Button>
                        <Button
                            type="primary"
                            danger
                        >
                            <AiOutlineDelete />
                        </Button>
                        <Button
                            type="primary"
                            ghost
                        >
                            <AiOutlineFileSearch />
                        </Button>
                    </div>
                ),
            },
        ];

        const data = [
            {   
                requirement: 'Quezon City ID',
                scannedimage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6w-c01PvBlyGaBExFZYJcV9eLjlvIXAnoiQ&s',
                status: 'Under Review'
            },
        ];
    
        const col = [
            {
                title: 'Requiement',
                dataIndex: 'requirement',
                key: 'requirement',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Scanned Image',
                dataIndex: 'scannedimage',
                key: 'scannedimage',
                render: (text: any) => (
                    <img src={text} alt="Scanned" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ),
            },
            {
                title: 'Verification Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'notes',
                key: 'notes',
            },
            {
                title: "Actions",
                key: "actions",
                AlignCenter: 'center',
                render: () => (
                    <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                        <Button
                            type="primary"
                        >
                            <AiOutlineEdit />
                        </Button>
                        <Button
                            type="primary"
                            danger
                        >
                            <AiOutlineDelete />
                        </Button>
                        <Button
                            type="primary"
                            ghost
                        >
                            <AiOutlineFileSearch />
                        </Button>
                    </div>
                ),
            },
        ];

    return (
        <div>
            <div className="w-full">
                {/* PDL to Visit */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>PDL to Visit</h1>
                        <button className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400">
                            <Plus />
                            Add PDL to Visit
                        </button>
                    </div>
                    <Table className="border text-gray-200 rounded-md" dataSource={dataSource} columns={columns} scroll={{x: 800}} />
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>Requirements</h1>
                        <button className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400">
                            <Plus />
                            Add Requirements
                        </button>
                    </div>
                    <Table className="border text-gray-200 rounded-md" dataSource={dataSources} columns={column} scroll={{x: 800}} />
                </div>

                {/* Identifiers */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>Identifiers</h1>
                        <button className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400">
                            <Plus />
                            Add Identifiers
                        </button>
                    </div>
                    <Table className="border text-gray-200 rounded-md" dataSource={data} columns={col} scroll={{x: 800}} />
                </div>
            </div>
        </div>
    );
}

export default PDLtovisit;