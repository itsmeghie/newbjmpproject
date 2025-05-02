type BaseCategory = {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    name: string;
    description: string;
};

type ReportingCategory = BaseCategory;
type SeverityLevel = BaseCategory;

type Relationship = {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    relationship_name: string;
    description: string;
};

type VisitorToPDLForm = {
    id: number;
    visitor: Visitors[];               
    pdl: PDLs[];                   
    relationship_to_pdl: VisitortoPDLRelationship[];  
    created_at: string;           
    updated_at: string;           
    record_status: string;       
};

export type Visitors = {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    phone_no?: string | null;
    address?: string | null;
    telephone?: string | null;
    email?: string | null;
    created_by: number;
    updated_by: number;
    record_status: number;
};

export type PDLs = {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    phone_no?: string | null;
    address?: string | null;
    telephone?: string | null;
    email?: string | null;
    created_by: number;
    updated_by: number;
};

export type VisitortoPDLRelationship = {
    id: number;
    relationship_name: string;
    description: string;
};

export interface PersonnelForm {
    id: number;
    created_by: string;
    updated_by: string;
    encrypted_personnel_reg_no: string;
    encrypted_id_number: string;
    organization: string;
    jail: string;
    person: Person;
    rank: string;
    personnel_type: string;
    status: string;
    position: string;
    record_status: string;
    personnel_app_status: string;
    remarks: string;
    person_relationships: PersonRelationship[];
    created_at: string;
    updated_at: string;
    personnel_reg_no: string;
    id_number: string;
    shortname: string;
    date_joined: string;
  }
  
  export interface Person {
    id: number;
    created_by: string;
    updated_by: string;
    biometric_status: string;
    gender: Gender;
    nationality: string;
    civil_status: string;
    record_status: string;
    addresses: Address[];
    contacts: Contact[];
    talents: Talent[];
    skills: Skill[];
    religion: Religion;
    interests: Interest[];
    identifiers: Identifier[];
    employment_histories: EmploymentHistory[];
    education_backgrounds: EducationBackground[];
    social_media_accounts: SocialMediaAccount[];
    affiliations: Affiliation[];
    diagnoses: Diagnosis[];
    media_requirements: MediaRequirement[];
    media_identifiers: MediaIdentifier[];
    multiple_birth_siblings: MultipleBirthSibling[];
    created_at: string;
    updated_at: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    shortname: string;
    date_of_birth: string;
    place_of_birth: string;
    object_ref_no2: string;
    prefix: number;
    suffix: number;
    object_ref_no: number;
    ethnicity_province: number;
    interest: number[];
    skill: number[];
    talent: number[];
  }
  
  export interface Gender {
    id: number;
    gender_option: string;
    description: string;
  }
  
  export interface Address {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    province: string;
    municipality: string;
    region: string;
    barangay: string;
    country: string;
    address_type: string;
    created_at: string;
    updated_at: string;
    type: string;
    street: string;
    postal_code: string;
    is_current: boolean;
    is_active: boolean;
    street_number: string;
    bldg_subdivision: string;
    latitude: string;
    longitude: string;
    remarks: string;
    person: number;
  }
  
  export interface Contact {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    type: string;
    value: string;
    is_primary: boolean;
    mobile_imei: string;
    remarks: string;
    contact_status: boolean;
    person: number;
  }
  
  export interface Talent {
    id: number;
    name: string;
    description: string;
    record_status: string;
  }
  
  export interface Skill {
    id: number;
    name: string;
    description: string;
    record_status: string;
  }
  
  export interface Religion {
    id: number;
    name: string;
    description: string;
    record_status: string;
  }
  
  export interface Interest {
    id: number;
    name: string;
    description: string;
    record_status: string;
  }
  
  export interface Identifier {
    id: number;
    id_type: string;
    id_number: string;
    issued_by: string;
    date_issued: string;
    expiry_date: string;
    place_issued: string;
    record_status: string;
  }
  
  export interface EmploymentHistory {
    id: number;
    employer_name: string;
    job_title: string;
    employment_type: string;
    start_date: string;
    end_date: string;
    location: string;
    responsibilities: string;
    record_status: string;
  }
  
  export interface EducationBackground {
    id: number;
    created_by: string;
    updated_by: string;
    educational_attainment: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    institution_name: string;
    degree: string;
    field_of_study: string;
    start_year: string;
    end_year: string;
    institution_address: string;
    honors_received: string;
    remarks: string;
    person: number;
  }
  
  export interface SocialMediaAccount {
    id: number;
    platform: string;
    handle: string;
    profile_url: string;
    is_primary_account: boolean;
    record_status: string;
  }
  
  export interface Affiliation {
    id: number;
    organization_name: string;
    role_or_position: string;
    start_date: string;
    end_date: string;
    affiliation_type: string;
    description: string;
    record_status: string;
    person: number;
  }
  
  export interface Diagnosis {
    id: number;
    health_condition: string;
    health_condition_category: string;
    diagnosis_date: string;
    description: string;
    treatment_plan: string;
    record_status: string;
  }
  
  export interface MediaRequirement {
    id: number;
    record_status: string;
    created_at: string;
    updated_at: string;
    object_ref_no: string;
    name: string;
    direct_image: string;
    issued_by: string;
    date_issued: string;
    expiry_date: string;
    place_issued: string;
    remarks: string;
    status: string;
    created_by: number;
    updated_by: number;
    person: number;
  }
  
  export interface MediaIdentifier {
    id: number;
    id_type: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    object_ref_no: string;
    id_number: string;
    direct_image: string;
    issued_by: string;
    date_issued: string;
    expiry_date: string;
    place_issued: string;
    remarks: string;
    status: string;
    created_by: number;
    updated_by: number;
    idtype: number;
    person: number;
  }
  
  export interface MultipleBirthSibling {
    id: number;
    created_by: string;
    updated_by: string;
    person: string;
    multiple_birth_class: string;
    record_status: string;
    created_at: string;
    updated_at: string;
    is_identical: boolean;
    is_verified: boolean;
    remarks: string;
  }
  
  export interface PersonRelationship {
    id: number;
    created_by: string;
    updated_by: string;
    record_status: string;
    person: string;
    relationship: string;
    created_at: string;
    updated_at: string;
    is_contact_person: boolean;
    remarks: string;
    personnel: number;
  }

export interface Role {
    id: number; 
    name: string;
    permissions: Permission[]; 
}

export interface Permission {
  id: number;         
  name: string;       
  codename: string;  
  content_type: number; 
}

interface VisitLogForm {
  id: number;
  device: string;
  record_status: string;
  created_at: string; 
  updated_at: string; 
  id_number: string;
  binary_data: string;
  created_by: number;
  updated_by: number;
}
export interface VisitorApplicationPayload {
  id: number;
  created_by: string;
  updated_by: string;
  biometric_status: string;
  gender: {
    id: number;
    gender_option: string;
    description: string;
  };
  nationality: string;
  civil_status: string;
  record_status: string;
  addresses: Address[];
  contacts: Contact[];
  talents: Talent[];
  skills: Skill[];
  religion: Religion;
  interests: Interest[];
  identifiers: Identifier[];
  employment_histories: EmploymentHistory[];
  education_backgrounds: EducationBackground[];
  social_media_accounts: SocialMediaAccount[];
  affiliations: Affiliation[];
  diagnoses: Diagnosis[];
  media_requirements: MediaRequirement[];
  media_identifiers: MediaIdentifier[];
  multiple_birth_siblings: MultipleBirthSibling[];
  created_at: string;
  updated_at: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  shortname: string;
  date_of_birth: string;
  place_of_birth: string;
  object_ref_no2: string;
  prefix: number;
  suffix: number;
  object_ref_no: number;
  ethnicity_province: number;
  interest: number[];
  skill: number[];
  talent: number[];
}

interface Address {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  province: string;
  municipality: string;
  region: string;
  barangay: string;
  country: string;
  address_type: string;
  created_at: string;
  updated_at: string;
  type: string;
  street: string;
  postal_code: string;
  is_current: boolean;
  is_active: boolean;
  street_number: string;
  bldg_subdivision: string;
  latitude: string;
  longitude: string;
  remarks: string;
  person: number;
}

interface Contact {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  type: string;
  value: string;
  is_primary: boolean;
  mobile_imei: string;
  remarks: string;
  contact_status: boolean;
  person: number;
}

interface Talent {
  id: number;
  name: string;
  description: string;
  record_status: string;
}

interface Skill {
  id: number;
  name: string;
  description: string;
  record_status: string;
}

interface Religion {
  id: number;
  name: string;
  description: string;
  record_status: string;
}

interface Interest {
  id: number;
  name: string;
  description: string;
  record_status: string;
}

interface Identifier {
  id: number;
  id_type: string;
  id_number: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  record_status: string;
}

interface EmploymentHistory {
  id: number;
  employer_name: string;
  job_title: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  location: string;
  responsibilities: string;
  record_status: string;
}

interface EducationBackground {
  id: number;
  created_by: string;
  updated_by: string;
  educational_attainment: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  institution_address: string;
  honors_received: string;
  remarks: string;
  person: number;
}

interface SocialMediaAccount {
  id: number;
  platform: string;
  handle: string;
  profile_url: string;
  is_primary_account: boolean;
  record_status: string;
}

interface Affiliation {
  id: number;
  organization_name: string;
  role_or_position: string;
  start_date: string;
  end_date: string;
  affiliation_type: string;
  description: string;
  record_status: string;
  person: number;
}

interface Diagnosis {
  id: number;
  health_condition: string;
  health_condition_category: string;
  diagnosis_date: string;
  description: string;
  treatment_plan: string;
  record_status: string;
}

interface MediaRequirement {
  id: number;
  record_status: string;
  created_at: string;
  updated_at: string;
  object_ref_no: string;
  name: string;
  direct_image: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  remarks: string;
  status: string;
  created_by: number;
  updated_by: number;
  person: number;
}

interface MediaIdentifier {
  id: number;
  id_type: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  object_ref_no: string;
  id_number: string;
  direct_image: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  remarks: string;
  status: string;
  created_by: number;
  updated_by: number;
  idtype: number;
  person: number;
}

interface MultipleBirthSibling {
  id: number;
  created_by: string;
  updated_by: string;
  person: string;
  multiple_birth_class: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  is_identical: boolean;
  is_verified: boolean;
  remarks: string;
}

export interface TrackingLog {
  id: number;
  created_by: string;
  updated_by: string;
  visit: string;
  record_status: string;
  created_at: string;
  updated_at: string;
}

export interface MainGateLog {
  id: number;
  created_by: string;
  updated_by: string;
  device: string;
  record_status: string;
  tracking_logs: TrackingLog[];
  visitor: Visitors[];
  created_at: string;
  updated_at: string;
  id_number: string;
  binary_data: string;
  person: number;
}

export interface PersonFormPayload {
  gender_id: number;
  nationality_id: number;
  civil_status_id: number;
  religion_id: number;
  record_status_id: number;

  address_id: number[];
  contact_id: number[];
  talent_id: number[];
  skill_id: number[];
  interest_id: number[];
  identifier_id: number[];
  employment_history_id: number[];
  education_background_id: number[];
  social_media_account_id: number[];
  affiliation_id: number[];
  diagnosis_id: number[];

  address_data: AddressData[];
  contact_data: ContactData[];
  employment_history_data: EmploymentHistoryData[];
  education_background_data: EducationBackgroundData[];
  social_media_account_data: SocialMediaAccountData[];
  diagnosis_data: DiagnosisData[];
  media_data: MediaData[];
  identifier_data: IdentifierData[];
  media_requirement_data: MediaRequirementData[];
}

export interface AddressData {
  record_status_id: number;
  province_id: number;
  municipality_id: number;
  region_id: number;
  barangay_id: number;
  country_id: number;
  address_type_id: number;
  type: string;
  street: string;
  postal_code: string;
  is_current: boolean;
  is_active: boolean;
  street_number: string;
  bldg_subdivision: string;
  latitude: string;
  longitude: string;
  remarks: string;
}

export interface ContactData {
  record_status_id: number;
  type: string;
  value: string;
  is_primary: boolean;
  mobile_imei: string;
  remarks: string;
  contact_status: boolean;
}

export interface EmploymentHistoryData {
  employer_name: string;
  job_title: string;
  employment_type_id: number;
  start_date: string;
  end_date: string;
  location: string;
  responsibilities: string;
  record_status_id: number;
}

export interface EducationBackgroundData {
  educational_attainment_id: number;
  record_status_id: number;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  institution_address: string;
  honors_received: string;
  remarks: string;
}

export interface SocialMediaAccountData {
  platform_id: number;
  handle: string;
  profile_url: string;
  is_primary_account: boolean;
  record_status_id: number;
}

export interface DiagnosisData {
  health_condition: string;
  health_condition_category_id: number;
  diagnosis_date: string;
  description: string;
  treatment_plan: string;
  record_status_id: number;
}

export interface MediaData {
  media_type: string; // e.g., "Picture"
  picture_view: string; // e.g., "Profile"
  media_description: string;
  media_base64: string;
  record_status_id: number;
}

export interface IdentifierData {
  id_type_id: number;
  id_number: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
  record_status_id: number;
}

export interface MediaRequirementData {
  record_status_id: number;
  name: string;
  direct_image: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issued: string;
}

export type OTPAccount = {
  id: number;
  record_status: string;
  created_at: string;        // ISO date string
  updated_at: string;        // ISO date string
  failed_attempts: number;
  last_failed_at: string;    // ISO date string
  locked_until: string;      // ISO date string
  created_by: number;
  updated_by: number;
  user: number;
};

export type VisitorUpdatePayload = {
  org_id: number;
  jail_id: number;
  verified_by_id: number;
  approved_by_id: number;
  person_id: number;
  visitor_app_status_id: number;
  visitor_type_id: number;
  record_status_id: number;
  remarks_data: {
    record_status_id: number;
    visitor: number;
    remarks: string;
  }[];
  pdl_data: {
    relationship_to_pdl_id: number;
    pdl_id: number;
    record_status_id: number;
  }[];
  verified_at: string; // ISO date string
  approved_at: string; // ISO date string
  id_number: string;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
};

export interface ServiceProviderPayload {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  visitor_type: string;
  group_affiliation: string;
  remarks: string;
  remarks_many: string;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
  sp_reg_no: string;
  id_number: string;
  verified_at: string; // ISO string format
  approved_at: string; // ISO string format
  person: number;
  visitor_status: number;
  verified_by: number;
  approved_by: number;
  serv_prov_type: number;
  provided_service: number;
}

export interface NonPDLVisitorPayload {
  id: number;
  created_by: string;
  updated_by: string;
  person: string;
  personnel: string;
  non_pdl_visitor_type: string;
  non_pdl_visitor_reason: string;
  visitor_rel_personnel: string;
  visitor_status: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  reg_no: string;
  id_number: string;
  reason_notes: string;
  verified_by: string;
  verified_at: string; // ISO date string
  approved_by: string;
  approved_at: string; // ISO date string
}
