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

export type Gender = {
  id: number;
  gender_option: string;
  description: string;
};

export type JailArea = {
  id: number;
  jail: number;
  building: number;
  floor: number;
  area_name: string;
  area_capacity: number;
  security_level: number;
  floor_latitude: string;
  floor_longitude: string;
  floor_boundary_radius_m: number;
  floor_boundary_box: string;
  floor_geom_type: "point" | "polygon" | "line";
  floor_description: string;
  object_ref_no: number;
  floor_status: "Active" | "Inactive" | "Under Maintenance";
  record_status: number;
};

export type Jail = {
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
  jail_capacity: number; // Using number to handle large values
  jail_latitude: string; // Consider changing to number if it will always be numeric
  jail_longitude: string; // Same as above
  jail_boundary_radius_m: number;
  jail_boundary_box: string;
  jail_geom_type: "point"; // Assuming this will always be "point"
  jail_description: string;
  object_ref_no: string;
  jail_status: "Active" | "Inactive"; // Adjust as necessary
  record_status: string;
};

export type Personnel = {
  personnel_reg_no: string;
  id: number;
  organization: number;
  jail: number;
  person: number;
  shortname: string;
  personnel_type: string;
  rank: number;
  position: number;
  date_joined: string;
  record_status: number;
};

export type Person = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  shortname: string;
  gender: Gender;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  civil_status: string;
  object_ref_no: string;
  record_status: string;
};

export type Affiliation = {
  id: number;
  affiliation_type: string;
  description: string;
};

export type CivilStatus = {
  id: number;
  status: string;
  description: string;
};

export type Nationality = {
  id: number;
  code: string;
  nationality: string;
};

export type DashboardCardsTypes = {
  pdls: PDLs[];
  jail: Jail[];
};

export type SocialMediaPlatforms = {
  id: number;
  platform_name: string;
  description: string;
};

export type RecordStatus = {
  id: number;
  status: string;
  description: string;
};

export type DetentionBuildings = {
  id: number;
  jail: number;
  bldg_name: string;
  security_level: number;
  bldg_latitude: string;
  bldg_longitude: string;
  bldg_boundary_radius_m: number;
  bldg_boundary_box: string;
  bldg_geom_type: "point" | "polygon" | "line";
  bldg_description: string;
  object_ref_no: number;
  bldg_status: "Active" | "Inactive" | "Under Construction";
  record_status: number;
};

export type DetentionFloor = {
  id: number;
  building: string;
  floor_number: string;
  floor_name: string;
  security_level: string;
  floor_latitude: string; // Consider changing to number if latitude is numeric
  floor_longitude: string; // Consider changing to number if longitude is numeric
  floor_boundary_radius_m: number;
  floor_boundary_box: string;
  floor_geom_type: "point"; // Assuming this is a fixed value
  floor_description: string;
  object_ref_no: number;
  floor_status: "Active" | "Inactive"; // Assuming these are the only two possible values
  record_status: string;
};

export type DetentionCell = {
  id: number;
  floor: number;
  cell_no: number;
  cell_name: string;
  cell_capacity: number;
  cell_latitude: string;
  cell_longitude: string;
  cell_boundary_radius_m: number;
  cell_boundary_box: string;
  cell_geom_type: "point" | "polygon" | "line";
  cell_description: string;
  object_ref_no: number;
  cell_status:
    | "Active"
    | "Inactive"
    | "Under Maintenance"
    | "Under Construction"
    | "Abandoned";
  record_status: number;
};

export type Media = {
  id: number;
  object_ref_no: string;
  media_type: "Picture" | "Video" | "Document";
  picture_view?: "Profile" | "Side" | "Top";
  media_binary: string;
  media_filepath: string;
  media_description: string;
  record_status: number;
};

export type JailRegion = {
  id: number;
  desc: string;
  island: string;
};

export type JailProvince = {
  region_id: number;
  id: number;
  region: number;
  desc: string;
};

export type JailMunicipality = {
  id: number;
  province: number;
  desc: string;
  type: string;
  legist_dist: string;
  councilor_dist: string;
};

export type JailMedia = {
  id: number;
  object_ref_no: string;
  media_type: "Picture" | "Video" | "Document"; // Assuming possible values
  picture_view?: "Profile" | "Side" | "Top"; // Optional, assuming possible values
  media_binary: string;
  media_filepath: string;
  media_description: string;
  record_status: number;
};

export type JailBarangay = {
  id: number;
  municipality: number;
  desc: string;
};

export type VisitorType = {
  id: number;
  visitor_type: string;
  description: string;
};

export type VisitorReqDocs = {
  id: number;
  document_name: string;
  description: string;
};

export type Rank = {
  id: number;
  organization: number;
  rank_code: string;
  rank_name: string;
  category: "Civilian" | "Military" | "Police"; // Assuming possible values
  class_level: number;
};

export type Position = {
  id: number;
  position_code: string;
  position_title: string;
  position_level: string;
  position_type: string;
  rank_required: number;
  organization: number;
  is_active: boolean;
  record_status: number;
};

export type Organization = {
  id: number;
  org_code: string;
  org_name: string;
  org_type: number;
  org_level: number;
};

export type OrganitionalType = {
  id: number;
  org_type: string;
  description: string;
};

export type OrganitionalLevel = {
  id: number;
  org_level: string;
  description: string;
};

export type JailType = {
  id: number;
  type_name: string;
  record_status: string;
  description: string;
};

export type JailSecurityLevel = {
  id: number;
  category_name: string;
  description: string;
  record_status: number;
};

export type JailCategory = {
  id: number;
  category: string;
  description: string;
};

export type IDType = {
  id: number;
  id_type: string;
  description: string;
};

export type GroupRolePermission = {
  id: number;
  name: string;
  codename: string;
  content_type: number;
};

export type GROUP_ROLE = {
  id: number;
  name: string;
  permission: GroupRolePermission[];
};

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: number;
  updated_at: number;
};

export type User = {
  email: string;
  first_name: string;
  last_name: string;
};

export type PDLtoVisit = {
  id: number;
  visitor: number;
  pdl: number;
  relationship_to_pdl: number;
  created_at: number;
  updated_at: number;
  record_status: number;
};

export type EmploymentType = {
  id: number;
  employment_type: number;
  description: number;
};

export type DeviceUsage = {
  id: number;
  usage: string;
  description: string;
  record_status: string;
};

export type Device = {
  id: number;
  device_type: string;
  jail: string;
  area: string;
  device_name: string;
  description: string;
  serial_no: string;
  date_acquired: string;
  manufacturer: string;
  supplier: string;
  record_status: string;
  device_settings: DeviceSetting[];
};

export type Device_Type = {
  id: number;
  device_type: string;
  purpose: string;
  remarks: string;
  device_usage: string;
  record_status: string;
};

export type Talent = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Skill = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Interest = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Identifier = {
  id: number;
  id_type: string;
  description: string;
};

type CaseRecord = {
  id: number;
  case_number: string;
  name: string;
  description: string;
  status: "Open" | "Closed" | "Pending" | string;
  sentence_length: number;
  record_status: string;
};

export type EmploymentType = {
  id: number;
  employment_type: string;
  description: string;
};

export type HealthConditionCategories = {
  id: number;
  category_name: string;
  description: string;
  record_status: string;
};

export type Issues = {
  id: number;
  module: string;
  sub_module: string;
  reporting_category: string;
  issue_category: string;
  issue_severity_level: string;
  risk_level: string;
  impact_level: string;
  impact: string;
  issue_status: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  module_affected: string;
  description: string;
  root_cause: string;
  date_reported: string; // ISO date string
  reported_by: string;
  resolution: string;
  resolution_date: string; // ISO date string
  notes: string;
  created_by: number;
  updated_by: number;
};

type BaseEntity = {
  id: number;
  created_at?: string;
  updated_at?: string;
};

type NamedEntity = BaseEntity & {
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

export type Address = {
  id: number;
  type: "Home" | "Work" | "Other"; // Adjust if more types exist
  province: string;
  city_municipality: string;
  region: string;
  barangay: string;
  street: string;
  postal_code: string;
  country: string;
  is_current: boolean;
  record_status: string;
  person: number;
};

export type Contact = {
  id: number;
  person_id: number;
  type: string;
  value: string;
  is_primary: boolean;
  record_status: string;
  person: number;
};

export type Talent = {
  id: number;
  name: string;
  description: string;
  record_status: string;
  person: number;
};

export type Religion = {
  id: number;
  name: string;
  description: string;
  record_status: string;
  person: number;
};

export type Interest = {
  id: number;
  name: string;
  description: string;
  record_status: string;
  person: number;
};

export type Identifier = {
  id: number;
  id_type: string;
  id_number: string;
  issued_by: string;
  date_issued: string; // Format: YYYY-MM-DD
  expiry_date: string; // Format: YYYY-MM-DD
  place_issue: string;
  record_status: string;
  person: number;
};

export type EmploymentHistory = {
  id: number;
  employer_name: string;
  job_title: string;
  employment_type: string;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  location: string;
  responsibilities: string;
  record_status: string;
  person: number;
};

export type EducationBackground = {
  id: number;
  institution_name: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
  honors_received: string;
  record_status: string;
  person: number;
};

export type SocialMediaAccount = {
  id: number;
  platform: string;
  handle: string;
  profile_url: string;
  is_primary_account: boolean;
  record_status: string;
  person: number;
};

export type Affiliation = {
  id: number;
  organization_name: string;
  role_or_position: string;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  affiliation_type: string;
  description: string;
  record_status: string;
  person: number;
};

export type Diagnosis = {
  id: number;
  health_condition: string;
  health_condition_category: string;
  diagnosis_date: string; // Format: YYYY-MM-DD
  description: string;
  treatment_plan: string;
  record_status: string;
  person: number;
};

export type Visitors = {
  id: number;
  created_at: string;
  updated_at: string;
  visitor_reg_no: number;
  id_number: string;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
  remarks: string;
  visitor_app_status: string;
  created_by: number;
  updated_by: number;
  org: number;
  jail: number;
  person: number;
  visitor_type: number;
  record_status: number;
};

export type PDLs = {
  id: number;
  created_at: string;
  updated_at: string;
  shortname: string;
  case_number: string;
  crime_committed: string;
  sentence_length: number;
  status: "Under Trial" | "Convicted" | "Released";
  date_of_admission: string;
  expected_release_date: string;
  created_by: number;
  updated_by: number;
  org: number;
  jail: number;
  person: number;
  cell: number;
  record_status: number;
};

export type Gender = BaseEntity & {
  gender_option: string;
  description: string;
};

export type LocationEntity = BaseEntity & {
  latitude: string;
  longitude: string;
  boundary_radius_m: number;
  boundary_box: string;
  geom_type: string; // Previously "point" | "polygon" | "line"
  description: string;
  object_ref_no: number;
  status: string; // Previously specific statuses
  record_status: number;
};

export type Building = LocationEntity & {
  jail: number;
  bldg_name: string;
  security_level: number;
};

export type Cell = LocationEntity & {
  floor: number;
  cell_no: string;
  cell_name: string;
  cell_capacity: number;
};

export type JailArea = LocationEntity & {
  jail: number;
  building: number;
  floor: number;
  area_name: string;
  area_capacity: number;
  security_level: number;
};

export type Jail = LocationEntity & {
  jail_name: string;
  jail_type: number;
  jail_category: number;
  email_address: string;
  contact_number: string;
  jail_province: number;
  jail_city_municipality: number;
  jail_region: number;
  jail_barangay: number;
  jail_street: string;
  jail_postal_code: string;
  jail_capacity: number;
};

export type Personnel = BaseEntity & {
  organization: number;
  jail: number;
  person: number;
  shortname: string;
  personnel_type: string;
  rank: number;
  position: number;
  date_joined: string;
  record_status: number;
};

export type Person = BaseEntity & {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  shortname: string;
  gender: Gender;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  civil_status: string;
  object_ref_no: string;
  record_status: string;
  biometric_status: {
    count: number;
    status: string;
  };
  addresses?: Address[];
  contacts?: Contact[];
  talents?: Talent[];
  religions?: Religion[];
  interests?: Interest[];
  identifiers?: Identifier[];
  employment_histories?: EmploymentHistory[];
  education_backgrounds?: EducationBackground[];
  social_media_accounts?: SocialMediaAccount[];
  affiliations?: Affiliation[];
  diagnoses?: Diagnosis[];
};

export type Affiliation = BaseEntity & {
  affiliation_type: string;
  description: string;
};

export type CivilStatus = BaseEntity & {
  status: string;
  description: string;
};

export type Nationality = BaseEntity & {
  code: string;
  nationality: string;
};

export type Biometric = BaseEntity & {
  remarks: string;
  person: number;
  person_data: Person;
  biometric_type: string;
  position: string;
  place_registered: string;
  data: string; // Assuming this is Base64-encoded biometric data
};

export type MatchData = {
  subject_id: string;
  score: number;
  biometric: Biometric;
};

export type FaceMatchSuccess = {
  message: "Match found.";
  data: MatchData[];
};

export type FaceMatchError = {
  message: string;
  status: "match_not_found";
};

export type FaceVerificationMatchState = FaceMatchSuccess | FaceMatchError;

export type DashboardCardsTypes = {
  buildings: Building[];
  cells: Cell[];
  areas: JailArea[];
  personnel: Personnel[];
  pdls: PDLs[];
  visitors: Visitors[];
};

export type SocialMediaPlatforms = {
  id: number;
  platform_name: string;
  description: string;
};

export type RecordStatus = {
  id: number;
  status: string;
  description: string;
};

export type DetentionBuildings = {
  id: number;
  jail: number;
  bldg_name: string;
  security_level: number;
  bldg_latitude: string;
  bldg_longitude: string;
  bldg_boundary_radius_m: number;
  bldg_boundary_box: string;
  bldg_geom_type: "point" | "polygon" | "line";
  bldg_description: string;
  object_ref_no: number;
  bldg_status: "Active" | "Inactive" | "Under Construction";
  record_status: number;
};

export type DetentionFloor = {
  id: number;
  building: number;
  floor_number: string;
  floor_name: string;
  security_level: number;
  floor_latitude: string;
  floor_longitude: string;
  floor_boundary_radius_m: number;
  floor_boundary_box: string;
  floor_geom_type: "point" | "polygon" | "line";
  floor_description: string;
  object_ref_no: number;
  floor_status: "Active" | "Inactive" | "Under Maintenance";
  record_status: number;
};

export type DetentionCell = {
  id: number;
  floor: number;
  cell_no: number;
  cell_name: string;
  cell_capacity: number;
  cell_latitude: string;
  cell_longitude: string;
  cell_boundary_radius_m: number;
  cell_boundary_box: string;
  cell_geom_type: "point" | "polygon" | "line";
  cell_description: string;
  object_ref_no: number;
  cell_status:
    | "Active"
    | "Inactive"
    | "Under Maintenance"
    | "Under Construction"
    | "Abandoned";
  record_status: string;
};

export type Media = {
  id: number;
  object_ref_no: string;
  media_type: "Picture" | "Video" | "Document";
  picture_view?: "Profile" | "Side" | "Top";
  media_binary: string;
  media_filepath: string;
  media_description: string;
  record_status: number;
};

export type JailRegion = {
  id: number;
  desc: string;
  island: string;
};

export type JailProvince = {
  id: number;
  region: number;
  desc: string;
};

export type JailMunicipality = {
  id: number;
  province: number;
  desc: string;
  type: string;
  legist_dist: string;
  councilor_dist: string;
};

export type JailMedia = {
  id: number;
  object_ref_no: string;
  media_type: "Picture" | "Video" | "Document"; // Assuming possible values
  picture_view?: "Profile" | "Side" | "Top"; // Optional, assuming possible values
  media_binary: string;
  media_filepath: string;
  media_description: string;
  record_status: number;
};

export type JailBarangay = {
  id: number;
  municipality: number;
  desc: string;
};

export type VisitorType = {
  id: number;
  visitor_type: string;
  description: string;
};

export type VisitortoPDLRelationship = {
  id: number;
  relationship_name: string;
  description: string;
};

export type VisitorReqDocs = {
  id: number;
  document_name: string;
  description: string;
};

export type Rank = {
  id: number;
  organization: number;
  rank_code: string;
  rank_name: string;
  category: "Civilian" | "Military" | "Police"; // Assuming possible values
  class_level: number;
};

export type Position = {
  id: number;
  position_code: string;
  position_title: string;
  position_level: string;
  position_type: string;
  rank_required: number;
  organization: number;
  is_active: boolean;
  record_status: number;
};

export type Organization = {
  id: number;
  org_code: string;
  org_name: string;
  org_type: number;
  org_level: number;
};

export type OrganitionalType = {
  id: number;
  org_type: string;
  description: string;
};

export type OrganitionalLevel = {
  id: number;
  org_level: string;
  description: string;
};

export type JailType = {
  id: number;
  type_name: string;
  record_status: string;
  description: string;
};

export type JailSecurityLevel = {
  id: number;
  category_name: string;
  description: string;
  record_status: number;
};

export type JailCategory = {
  id: number;
  category: string;
  description: string;
};

export type IDType = {
  id: number;
  id_type: string;
  description: string;
};

export type GroupRolePermission = {
  id: number;
  name: string;
  codename: string;
  content_type: number;
};

export type GROUP_ROLE = {
  id: number;
  name: string;
};

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: number;
  updated_at: number;
};

export type User = {
  email: string;
  first_name: string;
  last_name: string;
};

export type PDLtoVisit = {
  id: number;
  visitor: number;
  pdl: number;
  relationship_to_pdl: number;
  created_at: number;
  updated_at: number;
  record_status: number;
};

export type EmploymentType = {
  id: number;
  employment_type: number;
  description: number;
};

export type DeviceUsage = {
  id: number;
  usage: string;
  description: string;
  record_status: string;
};

export type Device = {
  id: number;
  device_type: string;
  jail: string;
  area: string;
  device_name: string;
  description: string;
  serial_no: string;
  date_acquired: string;
  manufacturer: string;
  supplier: string;
  record_status: string;
  device_settings: DeviceSetting[];
};

export type Device_Type = {
  id: number;
  device_type: string;
  purpose: string;
  remarks: string;
  device_usage: string;
  record_status: string;
};

export type Religion = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type EmploymentType = {
  id: number;
  employment_type: string;
  description: string;
};

export type HealthConditionCategories = {
  id: number;
  category_name: string;
  description: string;
  record_status: string;
};

export type Talent = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Skill = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Interest = {
  id: number;
  name: string;
  description: string;
  record_status: string;
};

export type Identifier = {
  id: number;
  id_type: string;
  description: string;
};

type CaseRecord = {
  id: number;
  case_number: string;
  name: string;
  description: string;
  status: "Open" | "Closed" | "Pending" | string;
  sentence_length: number;
  record_status: string;
};

export type MultiBirthType = {
  id: number;
  classification: string;
  group_size: number;
  term_for_sibling_group: string;
  description: string;
};

type BirthRecord = {
  id: number;
  person: string;
  multiple_birth_class: string;
};

export type UserAccounts = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: string[];
  user_permissions: string[];
  all_permissions: string;
};

export type VisitorAppStatus = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  status: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Prefix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  prefix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Suffix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  suffix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type MultipleBirthClassType = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  classification: string;
  group_size: number;
  term_for_sibling_group: string;
  description: string;
  created_by: number;
  updated_by: number;
};

type VisitorSpecific = {
  id: number;
  org: string;
  jail: string;
  verified_by: string;
  approved_by: string;
  person: {
    id: number;
    biometrics: string;
    gender: {
      id: number;
      gender_option: string;
      description: string;
    };
    nationality: string;
    civil_status: string;
    object_ref_no: string;
    record_status: string;
    multiple_birth_class: string;
    addresses: {
      id: number;
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
      created_by: number;
      updated_by: number;
      person: number;
    }[];
    contacts: {
      id: number;
      record_status: string;
      created_at: string;
      updated_at: string;
      type: string;
      value: string;
      is_primary: boolean;
      mobile_imei: string;
      remarks: string;
      contact_status: boolean;
      created_by: number;
      updated_by: number;
      person: number;
    }[];
    talents: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    skills: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    religion: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    };
    interests: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    identifiers: {
      id: number;
      id_type: string;
      id_number: string;
      issued_by: string;
      date_issued: string;
      expiry_date: string;
      place_issued: string;
      record_status: string;
    }[];
    employment_histories: {
      id: number;
      employer_name: string;
      job_title: string;
      employment_type: string;
      start_date: string;
      end_date: string;
      location: string;
      responsibilities: string;
      record_status: string;
    }[];
    education_backgrounds: {
      id: number;
      institution_name: string;
      degree: string;
      field_of_study: string;
      start_year: number;
      end_year: number;
      honors_received: string;
      record_status: string;
    }[];
    social_media_accounts: {
      id: number;
      platform: string;
      handle: string;
      profile_url: string;
      is_primary_account: boolean;
      record_status: string;
    }[];
    affiliations: {
      id: number;
      organization_name: string;
      role_or_position: string;
      start_date: string;
      end_date: string;
      affiliation_type: string;
      description: string;
      record_status: string;
      person: number;
    }[];
    diagnosis: {
      id: number;
      health_condition: string;
      health_condition_category: string;
      diagnosis_date: string;
      description: string;
      treatment_plan: string;
      record_status: string;
    }[];
    media: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    shortname: string;
    date_of_birth: string;
    place_of_birth: string;
    object_ref_no2: string;
    created_by: number;
    updated_by: number;
    prefix: number;
    suffix: number;
    interest: number[];
    skill: number[];
    talent: number[];
  };
  visitor_app_status: string;
  visitor_type: string;
  record_status: string;
  remarks: {
    id: number;
    record_status: string;
    visitor: number;
    created_at: string;
    updated_at: string;
    remarks: string;
    created_by: number;
    updated_by: number;
  }[];
  pdl: {
    id: number;
    pdl: number;
    visitor: number;
    relationship_to_pdl: number;
    record_status: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
  }[];
  created_at: string;
  updated_at: string;
  verified_at: string;
  approved_at: string;
  visitor_reg_no: string;
  id_number: string;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
  created_by: number;
  updated_by: number;
};

export type UserAccounts = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: string[];
  user_permissions: string[];
  all_permissions: string;
};

export type VisitorAppStatus = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  status: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Prefix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  prefix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Suffix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  suffix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type MultipleBirthClassType = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  classification: string;
  group_size: number;
  term_for_sibling_group: string;
  description: string;
  created_by: number;
  updated_by: number;
};

type VisitorRecord = {
  organization: string;
  visits: any;
  id: number;
  org: string;
  jail: string;
  verified_by: string;
  approved_by: string;
  person: {
    media_requirements: any;
    id: number;
    biometrics: string;
    gender: {
      id: number;
      gender_option: string;
      description: string;
    };
    nationality: string;
    civil_status: string;
    object_ref_no: string;
    record_status: string;
    multiple_birth_class: string;
    addresses: {
      id: number;
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
      created_by: number;
      updated_by: number;
      person: number;
    }[];
    contacts: {
      id: number;
      record_status: string;
      created_at: string;
      updated_at: string;
      type: string;
      value: string;
      is_primary: boolean;
      mobile_imei: string;
      remarks: string;
      contact_status: boolean;
      created_by: number;
      updated_by: number;
      person: number;
    }[];
    talents: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    skills: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    religion: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    };
    interests: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    identifiers: {
      id: number;
      id_type: string;
      id_number: string;
      issued_by: string;
      date_issued: string;
      expiry_date: string;
      place_issued: string;
      record_status: string;
    }[];
    employment_histories: {
      id: number;
      employer_name: string;
      job_title: string;
      employment_type: string;
      start_date: string;
      end_date: string;
      location: string;
      responsibilities: string;
      record_status: string;
    }[];
    education_backgrounds: {
      id: number;
      institution_name: string;
      degree: string;
      field_of_study: string;
      start_year: number;
      end_year: number;
      honors_received: string;
      record_status: string;
    }[];
    social_media_accounts: {
      id: number;
      platform: string;
      handle: string;
      profile_url: string;
      is_primary_account: boolean;
      record_status: string;
    }[];
    affiliations: {
      id: number;
      organization_name: string;
      role_or_position: string;
      start_date: string;
      end_date: string;
      affiliation_type: string;
      description: string;
      record_status: string;
      person: number;
    }[];
    diagnosis: {
      id: number;
      health_condition: string;
      health_condition_category: string;
      diagnosis_date: string;
      description: string;
      treatment_plan: string;
      record_status: string;
    }[];
    media: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    shortname: string;
    date_of_birth: string;
    place_of_birth: string;
    object_ref_no2: string;
    created_by: number;
    updated_by: number;
    prefix: number;
    suffix: number;
    interest: number[];
    skill: number[];
    talent: number[];
  };
  visitor_app_status: string;
  visitor_type: string;
  record_status: string;
  remarks: string;
  pdls: string;
  created_at: string;
  updated_at: string;
  verified_at: string;
  approved_at: string;
  visitor_reg_no: string;
  id_number: string;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
  created_by: number;
  updated_by: number;
  pdl: number[];
};

export type ImpactLevel = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  impact_level: string;
  description: string;
  created_by: number;
  updated_by: number;
  impact_level: string;
};

export type Impact = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  name: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type RiskLevel = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  name: string;
  risk_severity: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Risk = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  description: string;
  created_by: number;
  updated_by: number;
  risk_level: number; // Adding risk_level as a number
};

export type RecommendedAction = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  description: string;
  created_by: number;
  updated_by: number;
  risk: number; // Changed 'risk_level' to 'risk'
};

export type IssueStatus = {
  id: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Issue = {
  id: number;
  module: string;
  sub_module: string;
  reporting_category: string;
  issue_category: string;
  issue_severity_level: string;
  risk_level: string;
  impact_level: string;
  impact: string;
  issue_status: string;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  module_affected: string;
  description: string;
  root_cause: string;
  date_reported: string; // ISO 8601 date string
  reported_by: string;
  resolution: string;
  resolution_date: string; // ISO 8601 date string
  notes: string;
  created_by: number;
  updated_by: number;
};

type IssueCategory = {
  id: number;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  description: string;
  created_by: number;
  updated_by: number;
};

type IssueData = {
  id: number;
  issue_category: IssueCategory;
  record_status: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  name: string;
  remarks: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type VisitorRecord = {
  id: number;
  org: string;
  jail: string;
  verified_by: string;
  approved_by: string;
  person: {
    id: number;
    biometrics: any[];
    gender: {
      id: number;
      gender_option: string;
      description: string;
    };
    nationality: string;
    civil_status: string;
    object_ref_no: string | null;
    record_status: string;
    addresses: any[];
    contacts: any[];
    talents: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    skills: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    religion: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    };
    interests: {
      id: number;
      name: string;
      description: string;
      record_status: string;
    }[];
    identifiers: any[];
    employment_histories: any[];
    education_backgrounds: any[];
    social_media_accounts: any[];
    affiliations: any[];
    diagnosis: any[];
    media: any[];
    created_at: string;
    updated_at: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    shortname: string;
    date_of_birth: string;
    place_of_birth: string;
    object_ref_no2: string;
    created_by: number;
    updated_by: number;
    prefix: number;
    suffix: number;
    interest: number[];
    skill: number[];
    talent: number[];
  };
  visitor_app_status: string;
  visitor_type: string;
  record_status: string;
  remarks: any[];
  pdls: {
    id: number;
    pdl: {
      id: number;
      org: string;
      jail: {
        id: number;
        jail_name: string;
        jail_type: string;
        jail_category: string;
        email_address: string;
        contact_number: string | null;
        jail_province: string | null;
        jail_city_municipality: string | null;
        jail_region: string | null;
        jail_barangay: string | null;
        jail_street: string;
        jail_postal_code: string | null;
        security_level: string;
        jail_capacity: number | null;
        jail_latitude: string | null;
        jail_longitude: string | null;
        jail_boundary_radius_m: number | null;
        jail_boundary_box: any;
        jail_geom_type: string | null;
        jail_description: string | null;
        object_ref_no: string | null;
        jail_status: string;
        record_status: string;
      };
      person: {
        id: number;
        biometric_status: {
          count: number;
          status: string;
        };
        gender: {
          id: number;
          gender_option: string;
          description: string;
        };
        nationality: string;
        civil_status: string;
        record_status: string;
        addresses: {
          id: number;
          record_status: string;
          province: string;
          municipality: string | null;
          region: string;
          barangay: string;
          country: string;
          address_type: string | null;
          created_at: string;
          updated_at: string;
          type: string;
          street: string;
          postal_code: string;
          is_current: boolean;
          is_active: boolean;
          street_number: string;
          bldg_subdivision: string | null;
          latitude: string;
          longitude: string;
          remarks: string;
          created_by: number | null;
          updated_by: number | null;
          person: number;
        }[];
        contacts: {
          id: number;
          record_status: string;
          created_at: string;
          updated_at: string;
          type: string;
          value: string;
          is_primary: boolean;
          mobile_imei: string;
          remarks: string;
          contact_status: boolean;
          created_by: number | null;
          updated_by: number | null;
          person: number;
        }[];
        talents: any[];
        skills: any[];
        religion: {
          id: number;
          name: string;
          description: string;
          record_status: string;
        };
        interests: any[];
        identifiers: any[];
        employment_histories: any[];
        education_backgrounds: any[];
        social_media_accounts: any[];
        affiliations: any[];
        diagnoses: any[];
        media_requirements: {
          id: number;
          record_status: string;
          created_at: string;
          updated_at: string;
          object_ref_no: string | null;
          name: string;
          direct_image: string | null;
          issued_by: string;
          date_issued: string;
          expiry_date: string;
          place_issued: string;
          remarks: string;
          status: string;
          created_by: number | null;
          updated_by: number | null;
          person: number;
        }[];
        media_identifiers: {
          id: number;
          record_status: string;
          created_at: string;
          updated_at: string;
          object_ref_no: string | null;
          id_number: string;
          direct_image: string | null;
          issued_by: string;
          date_issued: string;
          expiry_date: string;
          place_issued: string;
          remarks: string;
          status: string;
          created_by: number | null;
          updated_by: number | null;
          idtype: number;
          person: number;
        }[];
        multiple_birth_siblings: {
          id: number;
          person: string;
          multiple_birth_class: string;
          record_status: string;
          created_at: string;
          updated_at: string;
          is_identical: boolean;
          is_verified: boolean;
          remarks: string;
          created_by: number | null;
          updated_by: number | null;
        }[];
        created_at: string;
        updated_at: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        shortname: string;
        date_of_birth: string;
        place_of_birth: string;
        object_ref_no2: string;
        created_by: number;
        updated_by: number;
        prefix: number;
        suffix: number;
        object_ref_no: string | null;
        interest: number[];
        skill: number[];
        talent: number[];
      };
      cell: any;
      record_status: string;
      visitation_status: string;
      visitor: {
        id: number;
        org: string;
        jail: string;
        person: string;
        visitor_type: string;
        record_status: string;
        created_at: string;
        updated_at: string;
        verified_at: string;
        approved_at: string;
        visitor_reg_no: string;
        id_number: string;
        shortname: string | null;
        visitor_have_twins: boolean;
        visitor_twin_name: string | null;
        visited_pdl_have_twins: boolean;
        visited_pdl_twin_name: string | null;
        remarks: string;
        created_by: number;
        updated_by: number;
        verified_by: number;
        approved_by: number;
        visitor_app_status: number;
        pdl: number[];
      }[];
      cases: any[];
      created_at: string;
      updated_at: string;
      shortname: string;
      case_number: string | null;
      crime_committed: string;
      sentence_length: number | null;
      status: string;
      date_of_admission: string;
      expected_release_date: string | null;
      created_by: number;
      updated_by: number;
    };
    visitor: number;
    relationship_to_pdl: number;
    record_status: number;
    created_at: string;
    updated_at: string;
    created_by: number | null;
    updated_by: number | null;
  }[];
  media: string;
  created_at: string;
  updated_at: string;
  verified_at: string;
  approved_at: string;
  visitor_reg_no: string;
  id_number: string;
  shortname: string | null;
  visitor_have_twins: boolean;
  visitor_twin_name: string | null;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string | null;
  created_by: number;
  updated_by: number;
  pdl: PDLs[];
};

type VisitorApplicationPayload = {
  org_id: number | null;
  jail_id: number | null;
  verified_by_id: number | null;
  approved_by_id: number | null;
  person_id: number | null;
  visitor_app_status_id: number | null;
  visitor_type_id: number | null;
  record_status_id: number | null;
  remarks_data: Remark[];
  pdl_data: PdlData[];
  verified_at: string; 
  approved_at: string; 
  id_number: string;
  shortname: string;
  visitor_have_twins: boolean;
  visitor_twin_name: string;
  visited_pdl_have_twins: boolean;
  visited_pdl_twin_name: string;
}

type Remark = {
  record_status_id: number | null;
  visitor: number | null;
  remarks: string;
}

type PdlData = {
  visitor: number | null;
  relationship_to_pdl: number | null;
  record_status: number | null;
}


type Ethnicities = {
  id: number;
  record_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  created_by: number | null;
  updated_by: number | null;
};

type EthnicityProvince = {
  id: number;
  ethnicity: string;
  region: string;
  province: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  description: string;
  created_by: number;
  updated_by: number;
};

type Look = {
  id: number;
  record_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  remarks: string;
  created_by: number;
  updated_by: number;
};

type CourtRecord = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // You can use `Date` if you want to parse it as a Date object.
  updated_at: string; // Same as above, use `Date` if desired.
  court: string;
  description: string;
  code: string;
  jurisdiction: string;
  example_offenses: string;
  relevance_to_pdl: string;
  court_level: string;
};

type CourtDetails = {
  id: number;
  created_by: string;
  updated_by: string;
  province: string;
  region: string;
  court: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  branch: string;
  judge: string;
};

export type Occupation = {
  id: number;
  record_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  remarks: string;
  created_by: number;
  updated_by: number;
};

export type Prefix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  prefix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type Suffix = {
  id: number;
  record_status: string;
  created_at: string; // ISO string representation of the date
  updated_at: string; // ISO string representation of the date
  suffix: string;
  full_title: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type ContactType = {
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
};

type AddressData = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  address_type: AddressType; // Using the AddressType enum here
  description: string;
};

export type IssueType = {
  id: number;
  issue_category: IssueCategory;
  record_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  remarks: string;
  description: string;
  created_by: number;
  updated_by: number;
};

export type CourtBranch = {
  id: number;
  created_by: string | null;
  updated_by: string | null;
  province: string;
  region: string;
  court: string;
  record_status: string;
  created_at: string | null; // ISO datetime string
  updated_at: string | null;
  branch: string;
  judge: string;
};

export type Law = {
  id: number;
  created_by: string | null;
  updated_by: string | null;
  crime_category: string;
  record_status: string;
  created_at: string | null;
  updated_at: string | null;
  name: string;
  title: string;
  description: string;
};

export type CrimeCategory = {
  organization: string;
  id: number;
  created_by: string | null;
  updated_by: string | null;
  record_status: string;
  created_at: string | null;
  updated_at: string | null;
  crime_category_name: string;
  description: string;
};

export type Precinct = {
  id: number;
  region: string;
  province: string;
  city_municipality: string;
  record_status: string;
  created_at: string; // or Date if parsed
  updated_at: string; // or Date if parsed
  precinct_id: string;
  precinct_name: string;
  coverage_area: string;
  created_by: number;
  updated_by: number;
};

export type Offense = {
  id: number;
  created_by: string | null;
  updated_by: string | null;
  crime_category: string;
  law: string;
  record_status: string;
  created_at: string | null; // ISO timestamp as string
  updated_at: string | null;
  offense: string;
  description: string;
  crime_severity: string;
  punishment: string;
};

export type GangAffiliation = {
  id: number;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  name: string;
  description: string; // typo? should be "description"?
  remarks: string;
  created_by: number;
  updated_by: number;
};

export type PersonnelAppStatus = {
  id: number;
  record_status: string;
  created_at: string;
  updated_at: string;
  status: string;
  description: string;
  remarks: string;
  created_by: number;
  updated_by: number;
};

export type Backup = {
  folder_name: string;
  created_date: string;
};

export type BackupResponse = {
  success: string;
  backups: Backup[];
};


type IssueCategory = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; 
  updated_at: string; 
  name: string;
  description: string;
};

type IssueType = {
  id: number;
  created_by: string;
  updated_by: string;
  issue_category: IssueCategory;
  record_status: string;
  created_at: string; 
  updated_at: string; 
  name: string;
  remarks: string;
  description: string;
};

type RiskProps = {
  id: number;
  updated_by: string;
  updated_at: string;
  name: string;
  description: string;
  risk_level: number;
};

export type PersonnelType = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};
 
export type PersonnelStatus = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string;
  updated_at: string;
  key: string;
  value: string;
  description: string;
  device: number;
};
 
export type NonPdlVisitorReasonVisit = {
  id: number;
  created_by: string;
  updated_by: string;
  risk_level: string;
  impact_level: string;
  threat_level: string;
  record_status: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  reason_visit: string;
  description: string;
  risks: string;
  impacts: string;
  threats: string;
  mitigation: string;
};
 
export type Relationship = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  relationship_name: string;
  description: string;
};
 
export type ProvidedService = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  service_provided: string;
  description: string;
  priority_level: "Low" | "Medium" | "High";
  service_frequency:
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Annually"
    | "As Needed";
};
 
export type ServiceProviderType = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  serv_prov_type: string;
  description: string;
};
 
export type ServiceProviderRemarks = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  remark: string;
  description: string;
};
 
export type Affiliation = {
  id: number;
  organization_name: string;
  role_or_position: string;
  start_date: string; // ISO date string for YYYY-MM-DD
  end_date: string; // ISO date string for YYYY-MM-DD
  affiliation_type: string;
  description: string;
  record_status: string;
  person: number;
};
 
export type GroupAffiliation = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  name: string;
  description: string;
};
 
export type PDLVisitStatus = {
  id: number;
  created_by: string;
  updated_by: string;
  record_status: string;
  created_at: string; // ISO 8601 Date-Time string
  updated_at: string; // ISO 8601 Date-Time string
  name: string;
  description: string;
};