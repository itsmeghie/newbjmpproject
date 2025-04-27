import React, { useEffect, useState } from "react";
import { Button, Select, Row, Col, Typography, Space, message } from "antd";
import { IssueFormData } from "./Issue";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { Impact, ImpactLevel, IssueCategory, IssueStatus, IssueType, RecommendedAction, Risk, RiskLevel } from "@/lib/definitions";
import { useTokenStore } from "@/store/useTokenStore";
import { BASE_URL } from "@/lib/urls";

const { Option } = Select;

interface IssueFormProps {
    issueCategories: IssueCategory[];
    issueCategoriesLoading: boolean;
    setIssueTable: React.Dispatch<React.SetStateAction<IssueFormData[]>>;
    onCancel: () => void;
    initialData: IssueFormData | null;
    updateIssue: (index: number, updatedData: IssueFormData) => void;
    editIndex: number | null;
    issueTypes: IssueType[];
    issueTypesLoading: boolean;
    issueStatuses: IssueStatus[];
    issueStatusesLoading: boolean;
    risks: Risk[];
    risksLoading: boolean;
    riskLevels: RiskLevel[];
    riskLevelsLoading: boolean;
    impact: Impact[];
    impactLoading: boolean;
    impactLevels: ImpactLevel[];
    impactLevelsLoading: boolean;
    recommendedActions: RecommendedAction[];
    recommendedActionsLoading: boolean;
}

const IssueForm: React.FC<IssueFormProps> = ({
    setIssueTable,
    onCancel,
    initialData,
    updateIssue,
    editIndex,
    impact,
    impactLevels,
    impactLevelsLoading,
    impactLoading,
    issueStatuses,
    issueStatusesLoading,
    recommendedActions,
    recommendedActionsLoading,
    riskLevels,
    riskLevelsLoading,
    risks,
    risksLoading,
    // issueCategories,
    // issueCategoriesLoading,
    issueTypes,
    issueTypesLoading
}) => {
    // State to store form values
    const token = useTokenStore()?.token
    const [formValues, setFormValues] = useState<IssueFormData>({
        issueType: null,
        issue_category_id: null,
        risks: null,
        risk_level_id: null,
        impact_level_id: null,
        impact_id: null,
        recommendedAction: "",
        issue_status_id: null
    });

    // Effect to set initial form values if there's initial data
    useEffect(() => {
        if (initialData) {
            setFormValues({
                ...initialData,
                risks: initialData.risks || null,  // Ensure it's always a string
                risk_level_id: initialData.risk_level_id || null,  // Ensure it's always a string
                impact_level_id: initialData.impact_level_id || null,  // Ensure it's always a string
                impact_id: initialData.impact_id || null,  // Ensure it's always a string
                recommendedAction: String(initialData.recommendedAction) || "",  // Ensure it's always a string
            });
        } else {
            setFormValues({
                issueType: null,
                issue_category_id: null,
                risks: null,
                risk_level_id: null,
                impact_level_id: null,
                impact_id: null,
                recommendedAction: "",
                issue_status_id: null
            });
        }
    }, [initialData]);

    // Handle form input changes
    const handleInputChange = (fieldName: string, value: string | number) => {
        setFormValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if all required fields are filled
        const requiredFields = ['issueType', 'risks', 'risk_level_id', 'impact_level_id', 'impact_id', 'recommendedAction', 'issue_status_id'];
        const missingFields = requiredFields.filter(field => !formValues[field as keyof IssueFormData]);

        if (missingFields.length > 0) {
            message.warning(`Please fill in the required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Mapping IDs to names before saving
        const updatedValues = {
            ...formValues,
            issueType: formValues?.issueType,
            risks: risks.find(risk => risk?.id === formValues?.risks)?.id || null,
            risk_level_id: riskLevels.find(level => level.id === formValues?.risk_level_id)?.id || null,
            impact_level_id: impactLevels.find(level => level.id === formValues?.impact_level_id)?.id || null,
            impact_id: impact.find(impactItem => impactItem.id === formValues?.impact_id)?.id || null,
            recommendedAction: recommendedActions.find(action => action.id === +formValues?.recommendedAction)?.name || 'N/A',
            issue_status_id: formValues?.issue_status_id
        };

        // Make the API request to submit the issue
        try {
            const response = await fetch(`${BASE_URL}/api/issues_v2/issues/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}` // If authentication is needed
                },
                body: JSON.stringify(updatedValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                message.error(`Error submitting issue: ${JSON.stringify(errorData) || 'Unknown error'}`);
                return;
            }

            // Handle successful submission
            // const responseData = await response.json();
            message.success('Issue successfully submitted!');

            // Add the new issue to the table or update it
            if (editIndex !== null) {
                updateIssue(editIndex, updatedValues);
            } else {
                setIssueTable(prevTable => [...prevTable, updatedValues]);
            }

            // Reset form and close
            setFormValues({
                issueType: null,
                issue_category_id: null,
                risks: null,
                risk_level_id: null,
                impact_level_id: null,
                impact_id: null,
                recommendedAction: "",
                issue_status_id: null
            });
            onCancel();
        } catch (error) {
            message.error(JSON.stringify(error));
        }
    };


    useEffect(() => {
        if (formValues?.issueType) {
            const issueType = issueTypes?.find(type => type?.id === formValues?.issueType);
            console.log("This issue:", issueType)

            if (issueType) {
                setFormValues(prev => ({
                    ...prev,
                    issue_category_id: issueType?.issue_category?.id ?? null,
                    risks: risks?.find(risk => risk?.name === issueType?.risk)?.id ?? 2,
                }));
            }
        }
    }, [formValues?.issueType, issueTypes, risks]); // Added `risks` as a dependency for the effect

    return (
        <div className="issue-form-container" style={{ padding: "16px 8px" }}>
            <Typography.Title level={4} style={{ marginBottom: "20px" }}>
                {editIndex !== null ? "Edit Issue" : "Add New Issue"}
            </Typography.Title>

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label className="block mb-2 font-medium">Issue Type *</label>
                    <Select
                        placeholder="Select Type"
                        loading={issueTypesLoading}
                        className="w-full h-12"
                        value={formValues.issueType || undefined}
                        onChange={(value) => handleInputChange('issueType', value)}
                    >
                        {issueTypes.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </div>

                <div className="form-group mb-4">
                    <label className="block mb-2 font-medium">Risks *</label>
                    <Select
                        placeholder="Select level"
                        loading={risksLoading}
                        className="w-full h-12"
                        value={formValues.risks || undefined}
                        onChange={(value) => handleInputChange('risks', value)}
                    >
                        {risks.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </div>

                <Row gutter={24}>
                    <Col span={12}>
                        <div className="form-group mb-4">
                            <label className="block mb-2 font-medium">Risk Level *</label>
                            <Select
                                placeholder="Select level"
                                loading={riskLevelsLoading}
                                className="w-full h-12"
                                value={formValues.risk_level_id || undefined}
                                onChange={(value) => handleInputChange('risk_level_id', value)}
                            >
                                {riskLevels.map(option => (
                                    <Option key={option?.id} value={option?.id}>{option?.risk_severity}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="form-group mb-4">
                            <label className="block mb-2 font-medium">Impact Level *</label>
                            <Select
                                placeholder="Select level"
                                loading={impactLevelsLoading}
                                className="w-full h-12"
                                value={formValues.impact_level_id || undefined}
                                onChange={(value) => handleInputChange('impact_level_id', value)}
                            >
                                {impactLevels.map(option => (
                                    <Option key={option?.id} value={option?.id}>{option?.impact_level}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                </Row>

                <div className="form-group mb-4">
                    <label className="block mb-2 font-medium">Impact *</label>
                    <Select
                        placeholder="Select impact"
                        loading={impactLoading}
                        className="w-full h-12"
                        value={formValues.impact_id || undefined}
                        onChange={(value) => handleInputChange('impact_id', value)}
                    >
                        {impact.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </div>

                <div className="form-group mb-4">
                    <label className="block mb-2 font-medium">Recommended Action *</label>
                    <Select
                        placeholder="Recommend an action"
                        loading={recommendedActionsLoading}
                        className="w-full h-12"
                        value={formValues.recommendedAction || undefined}
                        onChange={(value) => handleInputChange('recommendedAction', value)}
                    >
                        {recommendedActions.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </div>

                <div className="form-group mb-4">
                    <label className="block mb-2 font-medium">Status *</label>
                    <Select
                        placeholder="Select current status"
                        loading={issueStatusesLoading}
                        className="w-full h-12"
                        value={formValues.issue_status_id || undefined}
                        onChange={(value) => handleInputChange('issue_status_id', value)}
                    >
                        {issueStatuses.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.description}</Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
                    <Space size="middle">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                        >
                            {editIndex !== null ? "Update Issue" : "Save Issue"}
                        </Button>
                        <Button
                            onClick={onCancel}
                            icon={<CloseOutlined />}
                        >
                            Cancel
                        </Button>
                    </Space>
                </div>
            </form>
        </div>
    );
};

export default IssueForm;