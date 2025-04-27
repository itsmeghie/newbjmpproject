import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/urls";

type EducationalAttainmentProps = {
  record_status_id: number | null;
  name: string;
  description: string;
};

const EditEducationalAttainment = ({
  educational_attainments,
  onClose,
}: {
  educational_attainments: any;
  onClose: () => void;
}) => {
  const token = useTokenStore().token;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const [educationalAttainmentForm, setEducationalAttainmentForm] =
    useState<EducationalAttainmentProps>({
      record_status_id: null,
      name: "",
      description: "",
    });

  useEffect(() => {
    if (educational_attainments) {
      const { name, description, record_status_id } = educational_attainments;
      setEducationalAttainmentForm({
        name: name ?? "",
        description: description ?? "",
        record_status_id: record_status_id ?? null,
      });
      form.setFieldsValue({
        name: name ?? "",
        description: description ?? "",
        record_status_id: record_status_id ?? null,
      });
    }
  }, [educational_attainments, form]);

  const updateEducationalAttainment = async (
    token: string,
    id: number,
    updatedData: any
  ) => {
    const response = await fetch(
      `${BASE_URL}/api/standards/educational-attainment/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update Educational Attainment");
    }

    return response.json();
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["record-status"],
        queryFn: () => getRecord_Status(token ?? ""),
      },
    ],
  });

  const recordStatusData = results[0].data;

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) =>
      updateEducationalAttainment(token ?? "", educational_attainments.id, updatedData),
    onSuccess: () => {
      messageApi.success("Educational Attainment updated successfully");
      setIsLoading(false);
      onClose();
    },
    onError: (error: any) => {
      setIsLoading(false);
      messageApi.error(error.message || "Failed to update Educational Attainment");
    },
  });

  const handleEducationalAttainmentSubmit = () => {
    setIsLoading(true);
    updateMutation.mutate(educationalAttainmentForm);
  };

  return (
    <div>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleEducationalAttainmentSubmit}>
        <Form.Item
          label="Educational Attainment"
          name="name"
          rules={[{ required: true, message: "Please enter the educational attainment name" }]}
        >
          <Input
            value={educationalAttainmentForm.name}
            onChange={(e) =>
              setEducationalAttainmentForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input
            value={educationalAttainmentForm.description}
            onChange={(e) =>
              setEducationalAttainmentForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </Form.Item>

        <Form.Item label="Record Status" name="record_status_id">
          <Select
            className="h-[3rem] w-full"
            showSearch
            placeholder="Select Record Status"
            optionFilterProp="label"
            value={educationalAttainmentForm.record_status_id ?? undefined}
            onChange={(value) =>
              setEducationalAttainmentForm((prev) => ({
                ...prev,
                record_status_id: value,
              }))
            }
            options={recordStatusData?.map((status: any) => ({
              value: status.id,
              label: status.status,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" className="flex ml-auto" htmlType="submit" loading={isLoading}>
            {isLoading ? "Updating..." : "Update Educational Attainment"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditEducationalAttainment;
