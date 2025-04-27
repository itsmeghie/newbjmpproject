import { BASE_URL, NATIONALITY } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { message, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";

type NationalityProps = {
  id?: string;
  code: string;
  nationality: string;
};

const EditNationality = ({ nationality, onClose }: { nationality: any; onClose: () => void }) => {
  const token = useTokenStore().token;
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (nationality) {
      form.setFieldsValue({
        code: nationality.code,
        nationality: nationality.nationality,
      });
    }
  }, [nationality, form]);

  const updateNationality = async (token: string, id: number, updatedData: NationalityProps) => {
    const res = await fetch(`${BASE_URL}/api/codes/nationalities/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!res.ok) {
      let errorMessage = "Error updating nationality";
  
      try {
        const errorData = await res.json();
        errorMessage =
          errorData?.message || errorData?.error || JSON.stringify(errorData);
      } catch {
        errorMessage = "Unexpected error occurred";
      }
  
      throw new Error(errorMessage);
    }
  
    const json = await res.json();
    console.log("✅ Update success:", json);
    return json;
  };
  

  const updateMutation = useMutation({
    mutationFn: (updatedData: NationalityProps) => updateNationality(token ?? "", nationality.id, updatedData),
    onSuccess: () => {
      messageApi.success("Nationality updated successfully");
      setIsLoading(false);
      setTimeout(() => {
        onClose(); 
      }, 300);
    },
    
    onError: (error: any) => {
      setIsLoading(false);
      messageApi.error(error.message || "Failed to update nationality");
    },
  });

  const handleNationalitySubmit = () => {
    const updatedData = {
      ...form.getFieldsValue(),
      id: nationality.id,
    };
    setIsLoading(true);
    updateMutation.mutate(updatedData);
  };

  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleNationalitySubmit}
      >
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Please input the code!" }]}
        >
          <Input placeholder="Enter nationality code" />
        </Form.Item>

        <Form.Item
          label="Nationality"
          name="nationality"
          rules={[{ required: true, message: "Please input the nationality!" }]}
        >
          <Input placeholder="Enter nationality" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" className="flex ml-auto" htmlType="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Nationality"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditNationality;
