type RecordStatus = "string"; // You can replace with union of actual values if known
type Status = "Under Trial" | "Released" | "Convicted"; // Example values
type VisitorAppStatus = "Verified" | "Pending" | "Rejected"; // Extend as needed

// Address, Contact, Skill, etc.
interface Address {
  id: number;
  type: "Home" | string;
  province: string;
  city_municipality: string;
  region: string;
  barangay: string;
  street: string;
  postal_code: string;
  country: string;
  is_current: boolean;
  record_status: RecordStatus;
}

interface Contact {
  id: number;
  type: string;
  value: string;
  is_primary: boolean;
  record_status: RecordStatus;
}

interface NamedEntity {
  id: number;
  name: string;
  description: string;
  record_status: RecordStatus;
}

interface Identifier {
  id: number;
  id_type: string;
  id_number: string;
  issued_by: string;
  date_issued: string;
  expiry_date: string;
  place_issue: string;
  record_status: RecordStatus;
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
  record_status: RecordStatus;
}

interface EducationBackground {
  id: number;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
  honors_received: string;
  record_status: RecordStatus;
}

interface SocialMediaAccount {
  id: number;
  platform: string;
  handle: string;
  profile_url: string;
  is_primary_account: boolean;
  record_status: RecordStatus;
}

interface Affiliation {
  id: number;
  organization_name: string;
  role_or_position: string;
  start_date: string;
  end_date: string;
  affiliation_type: string;
  description: string;
  record_status: RecordStatus;
  person: number;
}

interface Diagnosis {
  id: number;
  health_condition: string;
  health_condition_category: string;
  diagnosis_date: string;
  description: string;
  treatment_plan: string;
  record_status: RecordStatus;
}

interface Gender {
  id: number;
  gender_option: string;
  description: string;
}

interface Religion {
  id: number;
  name: string;
  description: string;
  record_status: RecordStatus;
}

// Person
interface Person {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: number;
  prefix: number;
  shortname: string;
  gender: Gender;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  civil_status: string;
  object_ref_no: string;
  record_status: RecordStatus;
  addresses: Address[];
  contacts: Contact[];
  skills: NamedEntity[];
  talents: NamedEntity[];
  religion: Religion;
  interests: NamedEntity[];
  identifiers: Identifier[];
  employment_histories: EmploymentHistory[];
  education_backgrounds: EducationBackground[];
  social_media_accounts: SocialMediaAccount[];
  affiliations: Affiliation[];
  diagnoses: Diagnosis[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  biometrics: any[];
  media: string;
  multiple_birth_siblings: Sibling[];
}

export type Sibling = {
  id: number;
  person: string;
  multiple_birth_class: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  is_identical: boolean;
  is_verified: boolean;
  remarks: string;
  created_by: number;
  updated_by: number;
};

// Visitor
interface Visitor {
  id: number;
  visitor_reg_no: number;
  id_number: string;
  shortname: string;
  org: string;
  jail: string;
  person: Person; // If this is a Person object instead, change to: person: Person;
  visitor_type: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
  remarks: string;
  visitor_app_status: VisitorAppStatus;
  record_status: RecordStatus;
}

// Case
interface Case {
  id: number;
  case_number: string;
  name: string;
  description: string;
  status: "Open" | "Closed" | string;
  sentence_length: number;
  record_status: RecordStatus;
}

interface Jail {
  id: number;
  jail_name: string;
  jail_type: string;
  jail_category: string;
  email_address: string;
  contact_number: string;
  jail_province: string;
  jail_city_municipality: string;
  jail_region: string;
  jail_barangay: string;
  jail_street: string;
  jail_postal_code: string;
  security_level: string;
  jail_capacity: number;
  jail_latitude: string;
  jail_longitude: string;
  jail_boundary_radius_m: number;
  jail_boundary_box: string;
  jail_geom_type: string;
  jail_description: string;
  object_ref_no: string;
  jail_status:
    | "Active"
    | "Inactive"
    | "Under Maintenance"
    | "Under Construction"
    | "Abandoned";
  record_status: string;
}

interface Cell {
  id: number;
  floor: string;
  cell_no: string;
  cell_name: string;
  cell_capacity: number;
  cell_latitude: string;
  cell_longitude: string;
  cell_boundary_radius_m: number;
  cell_boundary_box: string;
  cell_geom_type: string;
  cell_description: string;
  object_ref_no: number;
  cell_status:
    | "Active"
    | "Inactive"
    | "Under Maintenance"
    | "Under Construction"
    | "Abandoned";
  record_status: string;
}

// Inmate
export interface PDLs {
  id: number;
  shortname: string;
  case_number: string;
  crime_committed: string;
  sentence_length: number;
  status: Status;
  date_of_admission: string;
  expected_release_date: string;
  org: string;
  jail: Jail;
  person: Person;
  cell: Cell;
  record_status: RecordStatus;
  visitor: Visitor[];
  visitation_status: string;
  cases: Case[];
}

export interface Personnel {
  id: number;
  created_by: string;
  updated_by: string;
  encrypted_personnel_reg_no: string;
  encrypted_id_number: string;
  organization: string;
  jail: string;
  person: Person; // or a more specific type if you have one
  rank: string;
  status: string;
  personnel_app_status: string;
  position: string;
  record_status: string;
  remarks: string;
  created_at: string; // or Date if parsed
  updated_at: string; // or Date if parsed
  personnel_reg_no: string;
  id_number: string;
  shortname: string;
  date_joined: string; // or Date if parsed
  personnel_type: number;
}
