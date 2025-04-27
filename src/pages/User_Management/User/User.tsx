import { getUser, getUsers } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";


type UsersProps = {
    id: number | null,
    email: string,
    first_name: string,
    last_name: string,
    all_permissions: string
  }

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const token = useTokenStore().token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [setUser, setSelectedUser] = useState<UsersProps | null>(null);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token ?? ""),
  });

const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dataSource = data?.map((user, index) => ({
    key: index + 1,
    id: user.id,
    email: user?.email ?? "N/A",
    first_name: user?.first_name ?? "N/A",
    last_name: user?.last_name ?? "N/A",
    all_permissions: user?.all_permissions ?? "N/A",
  })) || [];

  const filteredData = dataSource?.filter((roles) =>
    Object.values(roles).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<UsersProps> = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name'
    },
    {
      title: 'All Permission',
      dataIndex: 'all_permissions',
      key: 'all_permissions'
    },
  ]

  return (
    <div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  )
}

export default Users
