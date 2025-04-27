import { Table } from "antd";
import { title } from "process";

type BJMPPersonnelProps = {
    id: number;
    name: string;
    description: string;
    updated_at: string;
    updated_by: string;
}
const BJMPPersonnel = () => {

    const columns = [
        {
            title: 'No.',
        },
        {
            title: 'BJMP Personnel',
        },
        {
            title: 'Description',
        },
        {
            title: 'Updated At',
        },
        {
            title: 'Updated By',
        },
    ]
    return (
        <div>
            <Table columns={columns} />
        </div>
    )
}

export default BJMPPersonnel
