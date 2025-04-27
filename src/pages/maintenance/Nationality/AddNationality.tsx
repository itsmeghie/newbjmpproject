import { NATIONALITY } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { message, Form, Input, Button } from "antd";

type NationalityProps = {
  code: string;
  nationality: string;
};

const AddNationality = ({ onClose }: { onClose: () => void }) => {
  const token = useTokenStore().token;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const addNationality = async (nationality: NationalityProps) => {
    const res = await fetch(NATIONALITY.postNATIONALITY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(nationality),
    });

    if (!res.ok) {
      let errorMessage = "Error Adding Nationality";

      try {
        const errorData = await res.json();
        errorMessage =
          errorData?.message || errorData?.error || JSON.stringify(errorData);
      } catch {
        errorMessage = "Unexpected error occurred";
      }

      throw new Error(errorMessage);
    }

    return res.json();
  };

  const nationalityMutation = useMutation({
    mutationKey: ["nationality"],
    mutationFn: addNationality,
    onSuccess: (data) => {
      messageApi.success("Nationality added successfully");
      form.resetFields();
      onClose();
    },
    onError: (error: any) => {
      messageApi.error(error.message);
    },
  });

  const handleSubmit = (values: NationalityProps) => {
    nationalityMutation.mutate(values);
  };

  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ code: "", nationality: "" }}
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
          <div className="flex items-center justify-end ml-auto gap-3">
            <Button onClick={onClose}>
            Cancel
          </Button>{" "}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          </div>
          
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNationality;
