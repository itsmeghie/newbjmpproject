export type PersonForm = {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix?: number | null;
  prefix?: number | null;
  shortname: string;
  gender_id: number | null;
  date_of_birth: string;
  place_of_birth: string;
  nationality_id: number | string | null;
  civil_status_id: number | string | null;
  address_data?: AddressForm[];
  contact_data?: ContactForm[];
  employment_history_data?: EmploymentHistoryForm[];
  education_background_data?: EducationBackgroundForm[];
  social_media_account_data?: SocialMediaAccountForm[];
  diagnosis_data?: DiagnosisForm[];
  talent_id?: number[];
  skill_id?: number[];
  interest_id?: number[];
  media_identifier_data?: IdentifierForm[];
  media_requirement_data?: RequirementForm[];
  religion_id?: number;
  media_data?: MediaForm[];
  multiple_birth_class?: number;
  multiple_birth_sibling_data?: MultiBirthSiblingForm[];
  ethnicity_province?: number;
  family_contact_relatives_data?: FamilyRelativesContactsForm[];
  affiliation_id?: number[];
};

export type EducationalAttainmentForm = {
  educ_attainment_id: number | null;
  particulars: string;
  remarks: string;
  school_name: string;
  address_school: string;
  date_graduation: string;
};

export type MultiBirthSiblingForm = {
  person_id: number | null;
  is_identical: boolean;
  is_verified: boolean;
  remarks: string;
  multiple_birth_class_id: number | null;
};

export type DiagnosisForm = {
  health_condition: string;
  health_condition_category_id: number;
  diagnosis_date: string;
  description: string;
  treatment_plan: string;
  record_status_id: number;
};

export type RemarksForm = {
  timestamp: string;
  created_by: string;
  remarks: string;
};

export type ServiceProviderRemarksForm = {
  timestamp: string;
  created_by: string;
  remark: number | null;
};

export type RequirementForm = {
  name: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  record_status_id: number;
  remarks: string;
  status: "Under Review" | "Rejected" | "Approved" | "Pending";
  media_data: MediaForm;
  direct_image: string;
};

export type IdentifierForm = {
  id_type_id: number | null;
  id_number: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  record_status_id: number;
  remarks: string;
  status: "Under Review" | "Rejected" | "Approved" | "Pending";
  media_data: MediaForm;
  direct_image: string;
};

export type AddressForm = {
  type: "Home" | "Work" | "Other";
  province_id: number | null;
  city_municipality_id: number | null;
  region_id: number | null;
  barangay_id: number | null;
  street: string | null;
  street_number: string | null;
  postal_code: string | null;
  country_id: number | null;
  is_current: boolean | null;
  is_active: boolean | null;
  record_status_id: number;
  building_subdivision: string | null;
  longitude?: number | string;
  latitude?: number | string;
  remarks: string | null;
};

export type ContactForm = {
  type: string | null;
  value: string | null;
  is_primary: boolean | null;
  contact_status: boolean | null;
  record_status_id: number;
  mobile_imei: string | null;
  remarks: string | null;
};

export type MediaForm = {
  media_type: "Picture" | "Video" | "Document" | "Text File" | "Logo";
  picture_view?:
    | "Profile"
    | "Front"
    | "Back"
    | "Left"
    | "Right"
    | "Top"
    | "Bottom";
  media_description?: string;
  media_base64?: string;
  record_status_id?: number;
};

export type EmploymentHistoryForm = {
  employer_name: string;
  job_title: string;
  employment_type_id: number;
  start_date: string;
  end_date: string;
  location: string;
  responsibilities: string;
};

export type EducationBackgroundForm = {
  institution_name?: string;
  educational_attainment_id: number | null;
  institution_address?: string;
  degree?: string;
  field_of_study: string;
  start_year?: number;
  end_year?: string;
  honors_recieved?: string;
  remarks?: string;
};

export type SocialMediaAccountForm = {
  platform_id: number;
  handle: string;
  profile_url: string;
  is_primary: boolean;
};

export type VisitorForm = {
  visitor_reg_no: number;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
  remarks: string;
  visitor_app_status_id: number | null;
  org_id?: number;
  jail_id?: number;
  person_id: number;
  visitor_type_id: number;
  record_status_id: number;
  pdl_data: VisitorPdl[];
  verified_by: number;
  approved_by: number;
  remarks_data: RemarksData[];
  id_number: number | null;
};

type RemarksData = {
  remarks: string;
};

type ServiceProviderRemarksData = {
  remark: number | null;
};

export type VisitorPdl = {
  pdl_id: number;
  relationship_to_pdl_id: number;
};

export type PdlVisitor = {
  visitor: number;
  relationship_to_visitor: number;
};

export type PDLForm = {
  person_id: number | null;
  org_id: number | null;
  jail_id: number | null;
  pdl_alias?: string;
  file_no?: string;
  case_number?: string;
  crime_committed?: string;
  visitor_ids: number[];
  visitor: PdlVisitor[];
  status:
    | "Under Trial"
    | "Convicted"
    | "Released"
    | "Hospitalized"
    | "Commited";
  expected_release_date?: string;
  look_id: number | null;
  date_of_admission?: string;
  gang_affiliation_id: number | null;
  occupation: number | null;
  time_arrested?: string;
  case_data: CasesDetailsForm[];
  remarks_data?: RemarksData[];
  person_relationship_data: FamilyRelativesContactsForm[];
  precinct_id: number | null;
  cell_id: number | null;
  floor_id: number | null;
  building_id: number | null;
  date_of_admission: string | null;
  visitation_status_id: number | null;
};

export type CasesDetailsForm = {
  case_number: string | null;
  offense_id: number | null;
  court_branch_id: number | null;
  court_name?: string;
  judge: string;
  bail_recommended: string;
  date_crime_committed: string | null;
  date_arrested: string | null;
  days_in_detention: number | string | null;
  assignment_date: string | null;
  remarks: string;
  crime_category_id: number | null;
  law_id: number | null;
};

export type EducationalAttainment = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  description: string;
};

export type FamilyRelativesContactsForm = {
  relationship_id: number | null;
  prefix: string;
  suffix: string;
  person_id: number | null;
  last_name: string;
  first_name: string;
  middle_name: string;
  address: string;
  mobile_number: string;
  contact_person: boolean;
  remarks: string;
};

export type PersonnelForm = {
  organization_id: number | null;
  jail_id: number | null;
  person_id: number | null;
  region_origin_id: number | null;
  rank_id: number | null;
  status_id?: number | null;
  personnel_app_status_id: number | null;
  position_id: number | null;
  remarks_data: RemarksData[];
  person_relationship_data: FamilyRelativesContactsForm[];
  personnel_reg_no: string | null;
  id_number: string | null;
  shortname: string;
  date_joined: string;
  personnel_type: number | null;
  verified_by: number | null;
  approved_by: number | null;
};

export type NonPdlVisitorForm = {
  person_id: number | null;
  personnel_id: number | null;
  non_pdl_visitor_type_id: number | null;
  non_pdl_visitor_reason_id: number | null;
  visitor_rel_personnel_id: number | null;
  visitor_status_id?: number | null;
  reg_no: string;
  id_number: string;
  reason_notes?: string;
  verified_by?: string;
  verified_at?: string;
  approved_by?: string;
  approved_at?: string;
  remarks_data?: RemarksData[];
};

export type ServiceProviderForm = {
  record_status_id: number | null;
  visitor_type_id: number | null;
  service_type_id: number | null;
  group_affiliation_id: number | null;
  sp_reg_no: string;
  id_number: string;
  verified_at?: string; // ISO date string
  approved_at?: string; // ISO date string
  person: number | null;
  visitor_status: number | null;
  verified_by: number | null;
  approved_by: number | null;
  remarks_data?: RemarksData[];
  remarks_many_data: ServiceProviderRemarksData[];
};
