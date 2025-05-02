import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/lib/queries";
import { Table } from "antd";

const AlphaLIst = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);


    const { data: UserData } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(token ?? "")
    })

    const dataSource = ((index: any)=> ({
        key: index + 1,
    }))

    const columns = [
        {
            title: 'No',
            key: 'key',
        },
        {
            title: 'Duration of stay in Jail'
        },
        {
            title: 'Crime Category'
        },
        {
            title: 'Nature of Offense'
        },
        {
            title: 'Gender'
        },
        {
            title: 'Action',
            key: 'action'
        }
    ]

    const handleExportExcel = () => {
        const exportData = dataSource.map(({ id, ...rest }) => rest); 
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "AlphaList");
        XLSX.writeFile(wb, "AlphaList.xlsx");
    };

    return (
        <div>
            <Table columns={columns} />
        </div>
    )
}

export default AlphaLIst
