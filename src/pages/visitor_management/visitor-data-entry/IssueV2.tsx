import { Button, Table, Input, Select } from "antd"
import { Plus } from "lucide-react"
import { AiOutlineDelete } from "react-icons/ai"
import { useState } from "react"

const Issue = () => {
    const [dataSources, setDataSources] = useState([
        {
            key: '1',
            issue: 'Data Entry Issue',
            risk: 'Incorrect data',
            riskLevel: 'Unreadable Visitor Form',
            impactLevel: 'Low',
            impact: 'Low',
            impact_level: 'Low',
            recommendedActions: 'Inaccurate reports',
            status: 'Open',
        },
    ])

    const handleAddRow = () => {
        const newRow = {
            key: `${dataSources.length + 1}`, // Dynamically set a new key
            issue: '',
            risk: '',
            riskLevel: '',
            impactLevel: '',
            impact: '',
            impact_level: '',
            recommendedActions: '',
            status: 'Open',
        }
        setDataSources([...dataSources, newRow]) // Add new row to data
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, column: string) => {
        const updatedData = dataSources.map((row) =>
            row.key === key ? { ...row, [column]: e.target.value } : row
        )
        setDataSources(updatedData)
    }

    // For Select components
    const handleSelectChange = (value: string, key: string, column: string) => {
        const updatedData = dataSources.map((row) =>
            row.key === key ? { ...row, [column]: value } : row
        )
        setDataSources(updatedData)
    }

    const columns = [
        {
            title: 'Issue',
            dataIndex: 'issue',
            key: 'issue',
            width: '15%',
            ellipsis: false,
            render: (text: string, record: any) => (
                <Input
                    value={record.issue}
                    onChange={(e) => handleInputChange(e, record.key, 'issue')}
                    style={{ padding: '2px 4px', height: '32px' }}
                />
            ),
        },
        {
            title: 'Risks',
            dataIndex: 'risk',
            key: 'risk',
            width: '15%',
            ellipsis: false,
            render: (text: string, record: any) => (
                <Input
                    value={record.risk}
                    onChange={(e) => handleInputChange(e, record.key, 'risk')}
                    style={{ padding: '2px 4px', height: '32px' }}
                />
            ),
        },
        {
            title: 'Risk Level',
            dataIndex: 'riskLevel',
            key: 'riskLevel',
            width: '10%',
            render: (text: string, record: any) => (
                <Select
                    value={record.riskLevel}
                    onChange={(value) => handleSelectChange(value, record.key, 'riskLevel')}
                    style={{ width: '100%', height: '32px' }}
                    options={[
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' }
                    ]}
                />
            ),
        },
        {
            title: 'Impact Level',
            dataIndex: 'impactLevel',
            key: 'impactLevel',
            width: '10%',
            render: (text: string, record: any) => (
                <Select
                    value={record.impactLevel}
                    onChange={(value) => handleSelectChange(value, record.key, 'impactLevel')}
                    style={{ width: '100%', height: '32px' }}
                    options={[
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' }
                    ]}
                />
            ),
        },
        {
            title: 'Impact',
            dataIndex: 'impact',
            key: 'impact',
            width: '15%',
            ellipsis: false,
            render: (text: string, record: any) => (
                <Input
                    value={record.impact}
                    onChange={(e) => handleInputChange(e, record.key, 'impact')}
                    style={{ padding: '2px 4px', height: '32px' }}
                />
            ),
        },
        {
            title: 'Recommended Action',
            dataIndex: 'recommendedActions',
            key: 'recommendedActions',
            width: '20%',
            ellipsis: false,
            render: (text: string, record: any) => (
                <Input.TextArea
                    value={record.recommendedActions}
                    onChange={(e) => handleInputChange(e, record.key, 'recommendedActions')}
                    style={{ padding: '2px 4px' }}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (text: string, record: any) => (
                <Select
                    value={record.status}
                    onChange={(value) => handleSelectChange(value, record.key, 'status')}
                    style={{ width: '100%', height: '32px' }}
                    options={[
                        { value: 'Open', label: 'Open' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Resolved', label: 'Resolved' },
                        { value: 'Closed', label: 'Closed' }
                    ]}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: '5%',
            align: 'center',
            render: (text: string, record: any) => (
                <div className="flex gap-1 font-semibold justify-center">
                    <Button
                        type="primary"
                        danger
                        onClick={() => handleDeleteRow(record.key)}
                        style={{ padding: '0px 4px', height: '32px' }}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ]

    const handleDeleteRow = (key: string) => {
        setDataSources(dataSources.filter(row => row.key !== key))
    }

    return (
        <div>
            <div>
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between">
                        <h1 className='font-bold text-xl'>Finding /Issues /Risks</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            onClick={handleAddRow}
                        >
                            <Plus />
                            Add Issue
                        </button>
                    </div>
                    <div>
                        <Table
                            className="border rounded-md"
                            dataSource={dataSources}
                            columns={columns}
                            pagination={false}
                            rowClassName="compact-row"
                            size="small"
                            bordered
                            tableLayout="fixed"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Issue