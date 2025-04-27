import { Table } from "antd";

const VisitLog = () => {
    const columns = [
        {
            title: 'Timestamp',
        },
        {
            title: 'Visitor Name',
        },
        {
            title: 'Visitor Category',
        },
        {
            title: 'Person to Visit',
        },
        {
            title: 'Person  Category',
        },
    ];

    return (
        <div>
            <Table columns={columns} />
        </div>
    )
}

export default VisitLog
