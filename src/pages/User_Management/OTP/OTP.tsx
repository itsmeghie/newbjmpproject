import { OTPAccount } from "@/lib/issues-difinitions"
import { deleteOTP, getOTP } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

type OTPForm = OTPAccount

const OTP = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const { data } = useQuery({
        queryKey: ['OTP'],
        queryFn: () => getOTP(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteOTP(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["otp"] });
            messageApi.success("OTP deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete OTP");
        },
    });

    const dataSource = data?.map((otp, index) => ({
        key: index + 1,
        id: otp?.id ?? 'N/A',
        failed_attempts: otp?.failed_attempts ?? '',
        last_failed_at: otp?.last_failed_at ?? '',
        locked_until: otp?.locked_until ?? '',
        user: otp?.user ?? '',
    })) || [];

    const filteredData = dataSource?.filter((otp) =>
        Object.values(otp).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<OTPForm> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Failed Attempt',
            dataIndex: 'failed_attempts',
            key: 'failed_attempts',
        },
        {
            title: 'Last Failed At',
            dataIndex: 'last_failed_at',
            key: 'last_failed_at',
        },
        {
            title: 'Locked Until',
            dataIndex: 'locked_until',
            key: 'locked_until',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteMutation.mutate(record.id)}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ]
    
    return (
        <div>
            {contextHolder}
            <div className="flex justify-between items-center my-4">
                <h1 className="text-2xl font-bold text-[#1E365D]">User OTP Account Lockout</h1>
                <Input
                        placeholder="Search OTP..."
                        value={searchText}
                        className="py-2 md:w-64 w-full"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
            </div>
            
            <Table columns={columns} dataSource={filteredData}/>
        </div>
    )
}

export default OTP
