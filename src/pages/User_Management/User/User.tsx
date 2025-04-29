import { getUser, getUsers } from "@/lib/queries";
import { patchUsers } from "@/lib/query";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, Menu, message, Modal } from "antd";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import bjmp from '../../../assets/Logo/QCJMD.png'

type UsersProps = {
    id: number | null,
    password: string,
    email: string,
    first_name: string,
    last_name: string,
    group: string[];
}

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const token = useTokenStore().token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersProps | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token ?? ""),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const { mutate: editUser, isLoading: isUpdating } = useMutation({
      mutationFn: (updated: UsersProps) =>
        patchUsers(token ?? "", updated),
      
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          messageApi.success("User updated successfully");
          setIsEditModalOpen(false);
      },
      onError: () => {
          messageApi.error("Failed to update User");
      },
  });

  const handleEdit = (record: UsersProps) => {
    setSelectedUser(record);
    form.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (values: any) => {
    if (selectedUser && selectedUser.id) {
      const updateUser = {
        ...selectedUser,
        ...values, 
        email: selectedUser.email, 
      };
      editUser(updateUser);
    } else {
      messageApi.error("Selected User is invalid");
    }
  };

  const dataSource = data?.map((user, index) => ({
    key: index + 1,
    id: user.id,
    email: user?.email ?? "N/A",
    first_name: user?.first_name ?? "N/A",
    last_name: user?.last_name ?? "N/A",
    group: user?.groups ?? [], 
    organization: user?.organization ?? 'Bureau of Jail Management and Penology',
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
      title: 'Groups', 
      dataIndex: 'group',
      key: 'group',
      render: (group: string[]) => group.length ? group.join(", ") : "N/A", 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
          <div className="flex gap-2">
              <Button type="link" onClick={() => handleEdit(record)}>
                  <AiOutlineEdit />
              </Button>
          </div>
      ),
    },
  ];

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User");
    XLSX.writeFile(wb, "User.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const headerHeight = 48;
    const footerHeight = 32;
    const organizationName = dataSource[0]?.organization || ""; 
    const PreparedBy = dataSource[0]?.first_name || ''; 

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const reportReferenceNo = `TAL-${formattedDate}-XXX`;

    const maxRowsPerPage = 29; 

    let startY = headerHeight;

    const addHeader = () => {
        const pageWidth = doc.internal.pageSize.getWidth(); 
        const imageWidth = 30;
        const imageHeight = 30; 
        const margin = 10; 
        const imageX = pageWidth - imageWidth - margin;
        const imageY = 12;
    
        doc.addImage(bjmp, 'PNG', imageX, imageY, imageWidth, imageHeight);
    
        doc.setTextColor(0, 102, 204);
        doc.setFontSize(16);
        doc.text("User Report", 10, 15); 
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Organization Name: ${organizationName}`, 10, 25);
        doc.text("Report Date: " + formattedDate, 10, 30);
        doc.text("Prepared By: " + PreparedBy, 10, 35);
        doc.text("Department/ Unit: IT", 10, 40);
        doc.text("Report Reference No.: " + reportReferenceNo, 10, 45);
    };
    

    addHeader(); 

    const tableData = dataSource.map(item => [
        item.key,
        item.email,
        item.first_name,
        item.last_name
    ]);

    for (let i = 0; i < tableData.length; i += maxRowsPerPage) {
        const pageData = tableData.slice(i, i + maxRowsPerPage);

        autoTable(doc, { 
            head: [['No.', 'Email', 'First Name', 'Last Name']],
            body: pageData,
            startY: startY,
            margin: { top: 0, left: 10, right: 10 },
            didDrawPage: function (data) {
                if (doc.internal.getCurrentPageInfo().pageNumber > 1) {
                    addHeader(); 
                }
            },
        });

        if (i + maxRowsPerPage < tableData.length) {
            doc.addPage();
            startY = headerHeight;
        }
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);
        const footerText = [
            "Document Version: Version 1.0",
            "Confidentiality Level: Internal use only",
            "Contact Info: " + PreparedBy,
            `Timestamp of Last Update: ${formattedDate}`
        ].join('\n');
        const footerX = 10;
        const footerY = doc.internal.pageSize.height - footerHeight + 15;
        const pageX = doc.internal.pageSize.width - doc.getTextWidth(`${page} / ${pageCount}`) - 10;
        doc.setFontSize(8);
        doc.text(footerText, footerX, footerY);
        doc.text(`${page} / ${pageCount}`, pageX, footerY);
    }

    const pdfOutput = doc.output('datauristring');
    setPdfDataUrl(pdfOutput);
    setIsPdfModalOpen(true);
};

const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    setPdfDataUrl(null); 
};

  const menu = (
    <Menu>
        <Menu.Item>
            <a onClick={handleExportExcel}>Export Excel</a>
        </Menu.Item>
        <Menu.Item>
            <CSVLink data={dataSource} filename="User.csv">
                Export CSV
            </CSVLink>
        </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {contextHolder}
      <h1 className="text-2xl font-bold text-[#1E365D]">User</h1>
      <div className="flex items-center justify-between my-4">
      <div className="flex gap-2">
          <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
              <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                  <GoDownload /> Export
              </a>
          </Dropdown>
          <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white" onClick={handleExportPDF}>
              Print Report
          </button>
      </div>
        <div className="flex gap-2 items-center">
          <Input
              placeholder="Search User..."
              value={searchText}
              className="py-2 md:w-64 w-full"
              onChange={(e) => setSearchText(e.target.value)}
          />
          <button
              className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
              onClick={showModal}
          >
              <GoPlus />
              Add User
          </button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
                title="User Report"
                open={isPdfModalOpen}
                onCancel={handleClosePdfModal}
                footer={null}
                width="80%"
            >
                {pdfDataUrl && (
                    <iframe
                        src={pdfDataUrl}
                        title="PDF Preview"
                        style={{ width: '100%', height: '80vh', border: 'none' }}
                    />
                )}
            </Modal>
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please input the User's first name" }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please input the User's last name" }]}
          >
              <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Users;