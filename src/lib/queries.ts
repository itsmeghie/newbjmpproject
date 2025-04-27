/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PDL,
  GENDER_CODE,
  JAIL_AREA,
  PERSONNEL,
  AFFILIATION_TYPES,
  JAIL,
  CIVIL_STATUS,
  NATIONALITY,
  PERSON,
  RECORD_STATUS,
  SOCIAL_MEDIA_PLATFORMS,
  DETENTION_BUILDING,
  DETENTION_FLOOR,
  DETENTION_CELL,
  MEDIA,
  JAIL_REGION,
  JAIL_PROVINCE,
  JAIL_MUNICIPALITY,
  JAIL_MEDIA,
  JAIL_BARANGAY,
  VISITOR_TYPE,
  VISITOR_TO_PDL_RELATIONSHIP,
  VISITOR_REQ_DOCS,
  RANK,
  POSITION,
  ORGANIZATION,
  ORGANIZATIONAL_TYPE,
  ORGANIZATIONAL_LEVEL,
  JAIL_TYPE,
  JAIL_CATEGORY,
  JAIL_SECURITY_LEVEL,
  ID_TYPE,
  SYSTEM_SETTING,
  USER,
  PDL_TO_VISIT,
  EMPLOYMENT_TYPE,
  GROUP_ROLE,
  DEVICE,
  DEVICE_TYPE,
  DEVICE_USAGE,
  SUMMARYCARD,
  SKILLS,
  TALENTS,
  RELIGION,
  INTEREST,
  ETHNICITY,
  ETHNICITYPROVINCE,
  LOOK,
  COURT,
  BRANCH,
  BASE_URL,
  BACKUP,
  ISSUE_TYPE,
  ISSUE_CATEGORIES,
  RISK,
} from "@/lib/urls";
import {
  Gender,
  PDLs,
  Visitors,
  JailArea,
  Personnel,
  Affiliation,
  Jail,
  CivilStatus,
  Nationality,
  RecordStatus,
  SocialMediaPlatforms,
  DetentionBuildings,
  DetentionCell,
  DetentionFloor,
  Media,
  JailBarangay,
  JailCategory,
  JailMedia,
  JailMunicipality,
  JailProvince,
  JailRegion,
  JailType,
  VisitorReqDocs,
  VisitorType,
  VisitortoPDLRelationship,
  Rank,
  Position,
  OrganitionalLevel,
  OrganitionalType,
  Organization,
  IDType,
  GroupRolePermission,
  SystemSetting,
  User,
  PDLtoVisit,
  EmploymentType,
  Device,
  DeviceUsage,
  Device_Type,
  DashboardCardsTypes,
  CaseRecord,
  Identifier,
  Interest,
  Skill,
  Talent,
  HealthConditionCategories,
  VisitorSpecific,
  MultipleBirthClassType,
  Suffix,
  Prefix,
  VisitorAppStatus,
  UserAccounts,
  VisitorRecord,
  ImpactLevel,
  Impact,
  RiskLevel,
  Risk,
  RecommendedAction,
  Issue,
  IssueStatus,
  Ethnicities,
  EthnicityProvince,
  Look,
  CourtRecord,
  CourtDetails,
  Occupation,
  ContactType,
  AddressData,
  BirthRecord,
  IssueCategory,
  IssueType,
  CourtBranch,
  CrimeCategory,
  Precinct,
  Law,
  GangAffiliation,
  PersonnelAppStatus,
  Offense,
  BackupResponse,
  RiskProps,
  VisitorApplicationPayload,
} from "./definitions";
import { Religion, Person as NewPerson } from "./pdl-definitions";
import { EducationalAttainment } from "./visitorFormDefinition";
import { ReportingCategory, SeverityLevel } from "./issues-difinitions";

export async function getVisitors(token: string): Promise<Visitors[]> {
  const res = await fetch(`${BASE_URL}/api/visitors/visitor/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitors data.");
  }

  return res.json();
}

export async function getPDLs(token: string): Promise<PDLs[]> {
  const res = await fetch(PDL.getPDL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDLs data.");
  }

  return res.json();
}

export async function getPerson(token: string): Promise<NewPerson[]> {
  const res = await fetch(PERSON.getPERSON, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Person data.");
  }

  return res.json();
}

export async function getGenders(token: string): Promise<Gender[]> {
  const res = await fetch(GENDER_CODE.getGENDER_CODE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Gender data.");
  }

  return res.json();
}

export const deleteGENDER_CODE = async (token: string, id: number) => {
  const response = await fetch(
    `${GENDER_CODE.deleteGENDER_CODE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Gender");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getCivilStatus(token: string): Promise<CivilStatus[]> {
  const res = await fetch(CIVIL_STATUS.getCIVIL_STATUS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Civil Status data.");
  }

  return res.json();
}

export async function getNationalities(token: string): Promise<Nationality[]> {
  const res = await fetch(NATIONALITY.getNATIONALITY, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Nationalities data.");
  }

  return res.json();
}

export async function getAffiliationTypes(
  token: string
): Promise<Affiliation[]> {
  const res = await fetch(AFFILIATION_TYPES.getAFFILIATION_TYPES, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Affiliation Types data.");
  }

  return res.json();
}

export async function getJail(token: string) {
  const res = await fetch(JAIL.getJAIL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jails data.");
  }

  return res.json();
}

export const deleteJail = async (token: string, id: number) => {
  const response = await fetch(
    `${JAIL.deleteJAIL.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Jail");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateJail = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${JAIL.putJAIL.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Jail");
  }

  return response.json();
};

export async function getSocialMediaPlatforms(
  token: string
): Promise<SocialMediaPlatforms[]> {
  const res = await fetch(SOCIAL_MEDIA_PLATFORMS.getSOCIALMEDIAPLATFORMS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDLs data.");
  }

  return res.json();
}

export const updateSocialMediaPlatforms = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${SOCIAL_MEDIA_PLATFORMS.putSOCIALMEDIAPLATFORMS.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Social Media Platforms");
  }

  return response.json();
};

export const deleteSocialMediaPlatforms = async (token: string, id: number) => {
  const response = await fetch(
    `${SOCIAL_MEDIA_PLATFORMS.deleteSOCIALMEDIAPLATFORMS.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Social Media Platform");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getRecord_Status(token: string): Promise<RecordStatus[]> {
  const res = await fetch(RECORD_STATUS.getRECORD_STATUS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Record Status data.");
  }

  return res.json();
}

export const updateRecord_Status = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${RECORD_STATUS.putRECORD_STATUS.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Record Status");
  }

  return response.json();
};

export const deleteRecord_Status = async (token: string, id: number) => {
  const response = await fetch(
    `${RECORD_STATUS.deleteRECORD_STATUS.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Record Status");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getDetention_Building(
  token: string
): Promise<DetentionBuildings[]> {
  const res = await fetch(DETENTION_BUILDING.getDETENTION_BUILDING, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Detention Building data.");
  }

  return res.json();
}

export const updateDetention_Building = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${DETENTION_BUILDING.putDETENTION_BUILDING.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Detention Building");
  }

  return response.json();
};

export const deleteDetention_Building = async (token: string, id: number) => {
  const response = await fetch(
    `${DETENTION_BUILDING.deleteDETENTION_BUILDING.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Detention Building");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getDetention_Floor(
  token: string
): Promise<DetentionFloor[]> {
  const res = await fetch(DETENTION_FLOOR.getDETENTION_FLOOR, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Detention Floor data.");
  }

  return res.json();
}

export const deleteDetention_Floor = async (token: string, id: number) => {
  const response = await fetch(
    `${DETENTION_FLOOR.deleteDETENTION_FLOOR.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Detention Floor");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateDetention_Floor = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${DETENTION_FLOOR.putDETENTION_FLOOR.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Detention Floor");
  }

  return response.json();
};

export async function getDetentionCell(
  token: string
): Promise<DetentionCell[]> {
  const res = await fetch(DETENTION_CELL.getDETENTION_CELL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Detention Cell data.");
  }

  return res.json();
}

export async function getMedia(token: string): Promise<Media[]> {
  const res = await fetch(MEDIA.getMEDIA, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Media data.");
  }

  return res.json();
}

export async function getJailRegion(token: string): Promise<JailRegion[]> {
  const res = await fetch(JAIL_REGION.getJAILREGION, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Region data.");
  }

  return res.json();
}

export async function getJail_Province(token: string): Promise<JailProvince[]> {
  const res = await fetch(JAIL_PROVINCE.getJAIL_PROVINCE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Province data.");
  }

  return res.json();
}

export async function getJail_Municipality(
  token: string
): Promise<JailMunicipality[]> {
  const res = await fetch(JAIL_MUNICIPALITY.getJAIL_MUNICIPALITY, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Municipality data.");
  }

  return res.json();
}

export async function getJail_Barangay(token: string): Promise<JailBarangay[]> {
  const res = await fetch(JAIL_BARANGAY.getJAIL_BARANGAY, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Barangay data.");
  }

  return res.json();
}

export async function getVisitor_Type(token: string): Promise<VisitorType[]> {
  const res = await fetch(VISITOR_TYPE.getVISITOR_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor Type data.");
  }

  return res.json();
}

export const deleteVisitor_Type = async (token: string, id: number) => {
  const response = await fetch(
    `${VISITOR_TYPE.deleteVISITOR_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Visitor Type");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateVisitor_Type = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${VISITOR_TYPE.putVISITOR_TYPE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Visitor Type");
  }

  return response.json();
};

export async function getVisitor_to_PDL_Relationship(
  token: string
): Promise<VisitortoPDLRelationship[]> {
  const res = await fetch(
    VISITOR_TO_PDL_RELATIONSHIP.getVISITOR_TO_PDL_RELATIONSHIP,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor to PDL Relationship data.");
  }

  return res.json();
}

export const updateVisitor_Relationship = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${VISITOR_TO_PDL_RELATIONSHIP.putVISITOR_TO_PDL_RELATIONSHIP.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Visitor relationship to PDL");
  }

  return response.json();
};

export const deleteVisitor_RelationShip = async (token: string, id: number) => {
  const response = await fetch(
    `${VISITOR_TO_PDL_RELATIONSHIP.deleteVISITOR_TO_PDL_RELATIONSHIP.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Visitor relationship to PDL");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getVisitor_Req_Docs(
  token: string
): Promise<VisitorReqDocs[]> {
  const res = await fetch(VISITOR_REQ_DOCS.getVISITOR_REQ_DOCS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor Request Documents data.");
  }

  return res.json();
}

export const updateVisitor_Req_Docs = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${VISITOR_REQ_DOCS.putVISITOR_REQ_DOCS.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Visitor Document");
  }

  return response.json();
};

export const deleteVisitor_Req_Docs = async (token: string, id: number) => {
  const response = await fetch(
    `${VISITOR_REQ_DOCS.deleteVISITOR_REQ_DOCS.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Visitor Document");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getRank(token: string): Promise<Rank[]> {
  const res = await fetch(RANK.getRANK, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Rank data.");
  }

  return res.json();
}

export async function getPosition(token: string): Promise<Position[]> {
  const res = await fetch(POSITION.getPOSITION, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Position data.");
  }

  return res.json();
}

export async function getOrganization(token: string): Promise<Organization[]> {
  const res = await fetch(ORGANIZATION.getORGANIZATION, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Organization data.");
  }

  return res.json();
}

export async function getOrganizational_Type(
  token: string
): Promise<OrganitionalType[]> {
  const res = await fetch(ORGANIZATIONAL_TYPE.getORGANIZATIONAL_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Organization Type data.");
  }

  return res.json();
}

export async function getOrganizational_Level(
  token: string
): Promise<OrganitionalLevel[]> {
  const res = await fetch(ORGANIZATIONAL_LEVEL.getORGANIZATIONAL_LEVEL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Organization Level data.");
  }

  return res.json();
}

export async function getJail_Type(token: string): Promise<JailType[]> {
  const res = await fetch(JAIL_TYPE.getJAIL_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Type data.");
  }

  return res.json();
}

export const deleteJail_Type = async (token: string, id: number) => {
  const response = await fetch(
    `${JAIL_TYPE.deleteJAIL_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Jail Type");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateJail_Type = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${JAIL_TYPE.putJAIL_TYPE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Jail Type");
  }

  return response.json();
};

export async function getJail_Security_Level(token: string) {
  const res = await fetch(JAIL_SECURITY_LEVEL.getJAIL_SECURITY_LEVEL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Security Level data.");
  }

  return res.json();
}

export const updateSecurity_Level = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${JAIL_SECURITY_LEVEL.putJAIL_SECURITY_LEVEL.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Jail Security Level");
  }

  return response.json();
};

export const deleteJailSecurityLevel = async (token: string, id: number) => {
  const response = await fetch(
    `${JAIL_SECURITY_LEVEL.deleteJAIL_SECURITY_LEVEL.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Jail Security Level");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getJail_Category(token: string): Promise<JailCategory[]> {
  const res = await fetch(JAIL_CATEGORY.getJAIL_CATEGORY, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Category data.");
  }

  return res.json();
}

export const deleteJail_Category = async (token: string, id: number) => {
  const response = await fetch(
    `${JAIL_CATEGORY.deleteJAIL_CATEGORY.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Jail Category");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateJail_Category = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${JAIL_CATEGORY.putJAIL_CATEGORY.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Jail Category");
  }

  return response.json();
};

export async function getID_Type(token: string): Promise<IDType[]> {
  const res = await fetch(ID_TYPE.getID_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ID Type data.");
  }

  return res.json();
}

export async function getJail_Area(token: string): Promise<JailArea[]> {
  const res = await fetch(JAIL_AREA.getJAIL_AREA, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Area data.");
  }

  return res.json();
}

export async function getJail_Media(token: string): Promise<JailMedia[]> {
  const res = await fetch(JAIL_MEDIA.getJAIL_MEDIA, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Jail Media data.");
  }

  return res.json();
}

export const deleteJail_Area = async (token: string, id: number) => {
  const response = await fetch(
    `${JAIL_AREA.deleteJAIL_AREA.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Jail Area");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateJailArea = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${JAIL_AREA.putJAIL_AREA.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Jail Area");
  }

  return response.json();
};

export async function getPersonnel(token: string): Promise<Personnel[]> {
  const res = await fetch(PERSONNEL.getPersonnel, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel data.");
  }

  return res.json();
}

export async function getGroup_Role(
  token: string
): Promise<GroupRolePermission[]> {
  const res = await fetch(GROUP_ROLE.getGROUP_ROLE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Group Role data.");
  }

  return res.json();
}

export const updateGroup_Roles = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${GROUP_ROLE.putGROUP_ROLE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Group Roles");
  }

  return response.json();
};

export const deleteGroup_Roles = async (token: string, id: number) => {
  const response = await fetch(
    `${GROUP_ROLE.deleteGROUP_ROLE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Group Roles");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getSystem_Setting(
  token: string
): Promise<SystemSetting[]> {
  const res = await fetch(SYSTEM_SETTING.getSYSTEM_SETTING, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Group Role Permission data.");
  }

  return res.json();
}

export async function getUser(token: string): Promise<User[]> {
  const res = await fetch(USER.getUSER, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch User data.");
  }

  return res.json();
}

export async function getPdl_to_Visit(token: string): Promise<PDLtoVisit[]> {
  const res = await fetch(PDL_TO_VISIT.getPDL_TO_VISIT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDL to Visit data.");
  }

  return res.json();
}

export async function getEmployment_Type(
  token: string
): Promise<EmploymentType[]> {
  const res = await fetch(EMPLOYMENT_TYPE.getEMPLOYMENT_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDL to Employment Type.");
  }

  return res.json();
}

export async function getDevice(token: string): Promise<Device[]> {
  const res = await fetch(DEVICE.getDEVICE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDL to Device.");
  }

  return res.json();
}

export const updateDevice = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${BASE_URL}/api/codes/devices/${id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Devices");
  }

  return response.json();
};

export const deleteDevice = async (token: string, id: number) => {
  const response = await fetch(
    `${DEVICE.deleteDEVICE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Devices");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getDevice_Types(token: string): Promise<Device_Type[]> {
  const res = await fetch(DEVICE_TYPE.getDEVICE_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Device Type.");
  }

  return res.json();
}

export const updateDevice_Types = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${DEVICE_TYPE.putDEVICE_TYPE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Devices Types");
  }

  return response.json();
};

export const deleteDevice_Types = async (token: string, id: number) => {
  const response = await fetch(
    `${DEVICE_TYPE.deleteDEVICE_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Devices Types");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getDevice_Usage(token: string): Promise<DeviceUsage[]> {
  const res = await fetch(DEVICE_USAGE.getDEVICE_USAGE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Device uSAGE.");
  }

  return res.json();
}

export const updateDevice_Usages = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${DEVICE_USAGE.putDEVICE_USAGE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Devices Usages");
  }

  return response.json();
};

export const deleteDevice_Usage = async (token: string, id: number) => {
  const response = await fetch(
    `${DEVICE_USAGE.deleteDEVICE_USAGE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Devices Usage");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

//newquery

export const updateAuthorizeVisitor = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${PDL_TO_VISIT.putPDL_TO_VISIT.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Authorize Visitor");
  }

  return response.json();
};

export const deleteAuthorizeVisitor = async (token: string, id: number) => {
  const response = await fetch(
    `${PDL_TO_VISIT.deletePDL_TO_VISIT.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Authorize Visitor");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateDetentionCell = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${DETENTION_CELL.putDETENTION_CELL.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Detention Cell");
  }

  return response.json();
};

export const deleteDetentionCell = async (token: string, id: number) => {
  const response = await fetch(
    `${DETENTION_CELL.deleteDETENTION_CELL.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Detention Cell");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateEmployment_Type = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${EMPLOYMENT_TYPE.putEMPLOYMENT_TYPE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Employment Type");
  }

  return response.json();
};

export const deleteEmployment_Type = async (token: string, id: number) => {
  const response = await fetch(
    `${EMPLOYMENT_TYPE.deleteEMPLOYMENT_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Employment Type");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateID_Type = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${ID_TYPE.putID_TYPE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update ID Type");
  }

  return response.json();
};

export const deleteID_Type = async (token: string, id: number) => {
  const response = await fetch(
    `${ID_TYPE.deleteID_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete ID Type");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateCivil_Status = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${CIVIL_STATUS.putCIVIL_STATUS.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Civil Status");
  }

  return response.json();
};

export const deleteCivil_Status = async (token: string, id: number) => {
  const response = await fetch(
    `${CIVIL_STATUS.deleteCIVIL_STATUS.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Civil Status");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateAffiliationType = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${AFFILIATION_TYPES.putAFFILIATION_TYPES.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Affiliation Type");
  }

  return response.json();
};

export const deleteAffiliationType = async (token: string, id: number) => {
  const response = await fetch(
    `${AFFILIATION_TYPES.deleteAFFILIATION_TYPES.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Position");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updatePosition = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${POSITION.putPOSITION.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Position");
  }

  return response.json();
};

export const deletePosition = async (token: string, id: number) => {
  const response = await fetch(
    `${POSITION.deletePOSITION.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Position");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateRank = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${RANK.putRANK.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Rank");
  }

  return response.json();
};

export const deleteRank = async (token: string, id: number) => {
  const response = await fetch(
    `${RANK.deleteRANK.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Rank");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateOrganization = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${ORGANIZATION.putORGANIZATION.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Organization");
  }

  return response.json();
};

export const deleteOrganization = async (token: string, id: number) => {
  const response = await fetch(
    `${ORGANIZATION.deleteORGANIZATION.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Organization");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateGender = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${GENDER_CODE.putGENDER_CODE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Gender");
  }

  return response.json();
};

export async function fetchDashboardCardsData(
  token: string
): Promise<DashboardCardsTypes> {
  const endpoints: Record<keyof DashboardCardsTypes, string> = {
    pdls: PDL.getPDL,
    jail: JAIL.getJAIL,
  };

  const initialResult: DashboardCardsTypes = {
    pdls: [],
    jail: [],
  };

  const responses = await Promise.allSettled(
    (Object.keys(endpoints) as (keyof DashboardCardsTypes)[]).map(
      async (key) => {
        try {
          const res = await fetch(endpoints[key], {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          });

          if (!res.ok) {
            console.error(`Failed to fetch ${key}`);
            return { key, data: [] };
          }

          const data = await res.json();
          return { key, data };
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          return { key, data: [] };
        }
      }
    )
  );

  return responses.reduce(
    (acc, result) => {
      if (result.status === "fulfilled") {
        const { key, data } = result.value;
        switch (key) {
          case "pdls":
            acc.pdls = data as PDLs[];
            break;
          case "jail":
            acc.jail = data as Jail[];
            break;
        }
      }
      return acc;
    },
    { ...initialResult }
  ) as DashboardCardsTypes;
}

export async function getSummary_Card(token: string) {
  const res = await fetch(SUMMARYCARD.getSUMMARYCARD, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Summary Card Data");
  }

  return res.json();
}

export async function getDaily_Logs(token: string) {
  const res = await fetch(SUMMARYCARD.getDAILY_LOGS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Daily Logs Data");
  }

  return res.json();
}

export async function getMonthly_Logs(token: string) {
  const res = await fetch(SUMMARYCARD.getMONTHLY_LOGS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Monthly Logs Data");
  }

  return res.json();
}

export async function getDaily_Count(token: string) {
  const res = await fetch(SUMMARYCARD.getDAILY_PERSON_COUNT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Daily Count Data");
  }

  return res.json();
}

export async function getMonthly_Count(token: string) {
  const res = await fetch(SUMMARYCARD.getMONTLY_PERSON_COUNT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Monthly Count Data");
  }

  return res.json();
}

export async function getReligion(token: string): Promise<Religion[]> {
  const res = await fetch(`${BASE_URL}/api/standards/religions/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Religion data.");
  }

  return res.json();
}

export const updateReligion = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${RELIGION.putRELIGION.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Religion");
  }

  return response.json();
};

export const deleteReligion = async (token: string, id: number) => {
  const response = await fetch(
    `${RELIGION.deleteRELIGION.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Religion");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getEmploymentTypes(
  token: string
): Promise<EmploymentType[]> {
  const res = await fetch(`${BASE_URL}/api/codes/employment-types/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Employment Type data.");
  }

  return res.json();
}

export async function getHealthConditionCategories(
  token: string
): Promise<HealthConditionCategories[]> {
  const res = await fetch(
    `${BASE_URL}/api/standards/health-condition-categories/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Health Condition Categories data.");
  }

  return res.json();
}

export async function getTalents(token: string): Promise<Talent[]> {
  const res = await fetch(TALENTS.getTALENTS, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Talents data.");
  }

  return res.json();
}

export const updateTalents = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${TALENTS.putTALENTS.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Talents");
  }

  return response.json();
};

export const deleteTalent = async (token: string, id: number) => {
  const response = await fetch(`${BASE_URL}/api/standards/talents/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete Talent");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getSkills(token: string): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/api/standards/skills/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Skills data.");
  }

  return res.json();
}

export const updateSkills = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${SKILLS.putSKILLS.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Skills");
  }

  return response.json();
};

export const deleteSKILLS = async (token: string, id: number) => {
  const response = await fetch(
    `${SKILLS.deleteSKILLS.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Skills");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getInterests(token: string): Promise<Interest[]> {
  const res = await fetch(`${BASE_URL}/api/standards/interests/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Interests data.");
  }

  return res.json();
}

export const updateInterest = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${INTEREST.putINTEREST.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Interest");
  }

  return response.json();
};

export const deleteINTEREST = async (token: string, id: number) => {
  const response = await fetch(
    `${INTEREST.deleteINTEREST.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Interest");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getIdTypes(token: string): Promise<Identifier[]> {
  const res = await fetch(`${BASE_URL}/api/codes/id-types/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch ID Types data.");
  }

  return res.json();
}

export async function getCases(token: string): Promise<CaseRecord[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/cases/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Cases data.");
  }

  return res.json();
}

export async function getCountries(
  token: string
): Promise<{ id: number; code: string; country: string }[]> {
  const res = await fetch(`${BASE_URL}/api/codes/countries/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitors data.");
  }

  return res.json();
}

export async function getVisitorSpecific(
  token: string
): Promise<VisitorRecord[]> {
  const res = await fetch(`${BASE_URL}/api/visitors/visitor/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor data.");
  }

  return res.json();
}

export async function getVisitorSpecificById(
  id: string,
  token: string
): Promise<VisitorRecord> {
  const res = await fetch(`${BASE_URL}/api/visitors/visitor/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor data.");
  }

  return res.json();
}

export async function deleteVisitors(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/visitors/visitor/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Visitor.");
  }

  return true;
}

export const patchVisitor= async (
  token: string,
  id: number,
  data: Partial<VisitorApplicationPayload>
): Promise<VisitorApplicationPayload> => {
  const url = `{BASE_URL}/api/visitors/visitor/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update visitor");
  return res.json();
};

export async function getUsers(token: string): Promise<UserAccounts[]> {
  const res = await fetch(`${BASE_URL}/api/user/users/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Users data.");
  }

  return res.json();
}

export async function getCurrentUser(token: string): Promise<UserAccounts> {
  const res = await fetch(`${BASE_URL}/api/user/me/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch User data.");
  }

  return res.json();
}

export async function getVisitorAppStatus(
  token: string
): Promise<VisitorAppStatus[]> {
  const res = await fetch(
    `${BASE_URL}/api/visitors/visitor-application-status/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Visitor Registration Status data.");
  }

  return res.json();
}

export async function getPrefixes(token: string): Promise<Prefix[]> {
  const res = await fetch(`${BASE_URL}/api/standards/prefix/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Prefixes data.");
  }

  return res.json();
}

export async function getSuffixes(token: string): Promise<Suffix[]> {
  const res = await fetch(`${BASE_URL}/api/standards/suffix/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Suffixes data.");
  }

  return res.json();
}

export async function getMultipleBirthClassTypes(
  token: string
): Promise<MultipleBirthClassType[]> {
  const res = await fetch(`${BASE_URL}/api/standards/multiple-birth-class/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Multiple Birth Class Types data.");
  }

  return res.json();
}

export async function getMultipleBirthSibling(
  token: string
): Promise<BirthRecord[]> {
  const res = await fetch(`${BASE_URL}/api/standards/multiple-birth-sibling/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Multiple Birth Sibling data.");
  }

  return res.json();
}

export async function getRealPerson(token: string): Promise<NewPerson[]> {
  const res = await fetch(PERSON.getPERSON, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Person data.");
  }

  return res.json();
}

export async function getImpactLevels(token: string): Promise<ImpactLevel[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/impact-levels/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Impact Levels data.");
  }

  return res.json();
}

export async function getImpacts(token: string): Promise<Impact[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/impact/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Impact Levels data.");
  }

  return res.json();
}

export async function getRiskLevels(token: string): Promise<RiskLevel[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/risk-levels/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Risk Levels data.");
  }

  return res.json();
}

export async function getRisks(token: string): Promise<Risk[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/risk/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Risk Levels data.");
  }

  return res.json();
}

export async function getRecommendedActions(
  token: string
): Promise<RecommendedAction[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/recommended-action/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Recommended Actions data.");
  }

  return res.json();
}

export async function getIssues(token: string): Promise<Issue[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/issues/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issues data.");
  }

  return res.json();
}

export async function getIssueStatuses(token: string): Promise<IssueStatus[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/issue-statuses/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issue Statuses data.");
  }

  return res.json();
}

export async function getEthnicity(token: string): Promise<Ethnicities[]> {
  const res = await fetch(ETHNICITY.getETHNICITY, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Ethnicity data.");
  }

  return res.json();
}

export const updateEthnicity = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${ETHNICITY.putETHNICITY.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Ethnicity");
  }

  return response.json();
};

export const deleteEthnicity = async (token: string, id: number) => {
  const response = await fetch(
    `${ETHNICITY.deleteETHNICITY.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Ethnicity");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getEthnicityProvince(
  token: string
): Promise<EthnicityProvince[]> {
  const res = await fetch(ETHNICITYPROVINCE.getETHNICITYPROVINCE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Ethnicity Province data.");
  }

  return res.json();
}

export async function getEthnicityProvinces(
  token: string
): Promise<EthnicityProvince[]> {
  const res = await fetch(ETHNICITYPROVINCE.getETHNICITYPROVINCE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Ethnicity Province data.");
  }

  return res.json();
}

export const updateEthnicityProvince = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${ETHNICITYPROVINCE.putETHNICITYPROVINCE.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Ethnicity Province");
  }

  return response.json();
};

export const deleteEthnicityProvince = async (token: string, id: number) => {
  const response = await fetch(
    `${ETHNICITYPROVINCE.deleteETHNICITYPROVINCE.replace(
      "{id}",
      id.toString()
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Ethnicity Province");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getLook(token: string): Promise<Look[]> {
  const res = await fetch(LOOK.getLOOK, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Look data.");
  }

  return res.json();
}

export async function getLooks(token: string): Promise<Look[]> {
  const res = await fetch(LOOK.getLOOK, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Look data.");
  }

  return res.json();
}

export const updateLook = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${LOOK.putLOOK.replace("{id}", id.toString())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Look");
  }

  return response.json();
};

export const deleteLook = async (token: string, id: number) => {
  const response = await fetch(
    `${LOOK.deleteLOOK.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Look");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getCourt(token: string): Promise<CourtRecord[]> {
  const res = await fetch(COURT.getCOURT, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Judicial Court data.");
  }

  return res.json();
}

export const deleteCourt = async (token: string, id: number) => {
  const response = await fetch(
    `${COURT.deleteCOURT.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Court");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getBranch(token: string): Promise<CourtDetails[]> {
  const res = await fetch(BRANCH.getBRANCH, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Judicial Court Branch data.");
  }

  return res.json();
}

export const deleteBranch = async (token: string, id: number) => {
  const response = await fetch(
    `${BRANCH.deleteBRANCH.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Court Branch");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export async function getOccupations(token: string): Promise<Occupation[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/occupations/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Occupations data.");
  }

  return res.json();
}

export async function deleteOccupation(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/pdls/occupations/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete occupation.");
  }

  return true;
}

export async function getEducationalAttainments(
  token: string
): Promise<EducationalAttainment[]> {
  const res = await fetch(`${BASE_URL}/api/standards/educational-attainment/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Educational Attainment data.");
  }

  return res.json();
}

export async function deleteEducationalAttainments(token: string, id: number) {
  const res = await fetch(
    `${BASE_URL}/api/standards/educational-attainment/${id}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete Educational Attainments.");
  }

  return true;
}

export async function deletePrefixes(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/standards/prefix/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Prefixes.");
  }

  return true;
}

export async function deleteSuffixes(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/standards/suffix/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Suffixes.");
  }

  return true;
}

export async function getContact(token: string): Promise<ContactType[]> {
  const res = await fetch(`${BASE_URL}/api/standards/contacts/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Contact data.");
  }

  return res.json();
}

export async function deleteContact(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/standards/contacts/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Contact.");
  }

  return true;
}

export async function getAddressType(token: string): Promise<AddressData[]> {
  const res = await fetch(`${BASE_URL}/api/standards/address-type/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Address Type data.");
  }

  return res.json();
}

export async function deleteAddressType(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/standards/address-type/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Address Type.");
  }

  return true;
}

export const deleteNationality = async (token: string, id: number) => {
  const response = await fetch(
    `${NATIONALITY.deleteNATIONALITY.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Nationality");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const updateMultiBirth = async (
  token: string,
  id: number,
  updatedData: any
) => {
  const response = await fetch(
    `${BASE_URL}/api/standards/multiple-birth-class/${id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Multi Birth Classification");
  }

  return response.json();
};

export async function deleteMultiBirthType(token: string, id: number) {
  const res = await fetch(
    `${BASE_URL}/api/standards/multiple-birth-class/${id}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete Multi Birth Type.");
  }
  return true;
}

export async function getIssueCategories(
  token: string
): Promise<IssueCategory[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/issue-categories/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issue Categories data.");
  }

  return res.json();
}

export async function getIssueTypes(token: string): Promise<IssueType[]> {
  const res = await fetch(`${BASE_URL}/api/issues_v2/issue-types/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issue Types data.");
  }

  return res.json();
}

export async function getCourtBranches(token: string): Promise<CourtBranch[]> {
  const res = await fetch(`${BASE_URL}/api/standards/court-branch/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Court Branches data.");
  }

  return res.json();
}

export async function getCrimeCategories(
  token: string
): Promise<CrimeCategory[]> {
  const res = await fetch(`${BASE_URL}/api/standards/crime-category/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Crime Categories data.");
  }

  return res.json();
}

export async function getLaws(token: string): Promise<Law[]> {
  const res = await fetch(`${BASE_URL}/api/standards/law/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Laws data.");
  }

  return res.json();
}

export async function getPrecincts(token: string): Promise<Precinct[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/precinct/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Precinct data.");
  }

  return res.json();
}

export async function getOffenses(token: string): Promise<Offense[]> {
  const res = await fetch(`${BASE_URL}/api/standards/offense/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Offenses data.");
  }

  return res.json();
}

export async function getGangAffiliation(
  token: string
): Promise<GangAffiliation[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/gang-affiliations/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Gang Affiliations data.");
  }

  return res.json();
}

export async function getPersonnelAppStatus(
  token: string
): Promise<PersonnelAppStatus[]> {
  const res = await fetch(
    `${BASE_URL}/api/pdls/personnel-application-statuses/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel Application Status data.");
  }

  return res.json();
}

export async function getPositions(token: string): Promise<Position[]> {
  const res = await fetch(POSITION.getPOSITION, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Position data.");
  }

  return res.json();
}

export async function getRanks(token: string): Promise<Rank[]> {
  const res = await fetch(`${BASE_URL}/api/codes/ranks/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Ranks data.");
  }

  return res.json();
}

export async function getBackup(token: string): Promise<BackupResponse[]> {
  const res = await fetch(BACKUP.getBACKUP, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Backup.");
  }

  return res.json();
}


export async function getIssueType(token: string): Promise<IssueType[]> {
  const res = await fetch(ISSUE_TYPE.getISSUE_TYPE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issue Type.");
  }

  return res.json();
}

export async function getIssueCategory(token: string): Promise<IssueCategory[]> {
  const res = await fetch(ISSUE_CATEGORIES.getISSUE_CATEGORIES, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Issue Category.");
  }

  return res.json();
}

export const patchRisk = async (
  token: string,
  id: number,
  data: Partial<RiskProps>
): Promise<RiskProps> => {
  const url = RISK.patchRISK.replace("{id}", String(id));
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update risk");
  return res.json();
};

export const deleteRisk = async (token: string, id: number) => {
  const response = await fetch(
    `${RISK.deleteRISK.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Risk");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const deleteIssue_Type = async (token: string, id: number) => {
  const response = await fetch(
    `${ISSUE_TYPE.deleteISSUE_TYPE.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Issue Type");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchIssue_Type = async (
  token: string,
  id: number,
  data: Partial<IssueType>
): Promise<IssueType> => {
  const url = ISSUE_TYPE.patchISSUE_TYPE.replace("{id}", String(id));
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Issue Type");
  return res.json();
};

export const deleteIssue_Category = async (token: string, id: number) => {
  const response = await fetch(
    `${ISSUE_CATEGORIES.deleteISSUE_CATEGORIES.replace("{id}", id.toString())}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Issue Category");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchIssue_Category = async (
  token: string,
  id: number,
  data: Partial<IssueCategory>
): Promise<IssueCategory> => {
  const url = ISSUE_CATEGORIES.patchISSUE_CATEGORIES.replace("{id}", String(id));
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Issue Category");
  return res.json();
};
export async function getRiskLevel(token: string): Promise<RiskLevel[]> {
  const res = await fetch(`${BASE_URL}/api/issues/risk-levels/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Risk Levels data.");
  }

  return res.json();
}

export const deleteRiskLevels = async (token: string, id: number) => {
  const response = await fetch(
    `${BASE_URL}/api/issues/risk-levels/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Risk Level");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchRisk_level = async (
  token: string,
  id: number,
  data: Partial<RiskLevel>
): Promise<RiskLevel> => {
  const url = `${BASE_URL}/api/issues/risk-levels/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Risk Level");
  return res.json();
};

export const deleteImpact = async (token: string, id: number) => {
  const response = await fetch(
    `${BASE_URL}/api/issues_v2/impact/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Impact");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchImpact = async (
  token: string,
  id: number,
  data: Partial<Impact>
): Promise<Impact> => {
  const url = `${BASE_URL}/api/issues_v2/impact/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Impact");
  return res.json();
};

export const deleteImpactLevel = async (token: string, id: number) => {
  const response = await fetch(
    `${BASE_URL}/api/issues_v2/impact-levels/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Impact Level");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchImpactLevel = async (
  token: string,
  id: number,
  data: Partial<Impact>
): Promise<Impact> => {
  const url = `${BASE_URL}/api/issues_v2/impact-levels/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Impact Level");
  return res.json();
};

export const deleteRecommendedAction = async (token: string, id: number) => {
  const response = await fetch(
    `${BASE_URL}/api/issues_v2/recommended-action/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Recommended Action");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchRecommendedAction = async (
  token: string,
  id: number,
  data: Partial<RecommendedAction>
): Promise<RecommendedAction> => {
  const url = `${BASE_URL}/api/issues_v2/recommended-action/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Recommended Action");
  return res.json();
};

export const deleteIssues = async (token: string, id: number) => {
  const response = await fetch(
    `${BASE_URL}/api/issues_v2/issues/${id}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Issues");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const patchIssues = async (
  token: string,
  id: number,
  data: Partial<Issue>
): Promise<Issue> => {
  const url = `${BASE_URL}/api/issues_v2/issues/${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Issues");
  return res.json();
};

export async function getReportingCategory(token: string): Promise<ReportingCategory[]> {
  const res = await fetch(`${BASE_URL}/api/issues/reporting-categories/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Reporting Category data.");
  }

  return res.json();
}

export async function getSeverityLevel(token: string): Promise<SeverityLevel[]> {
  const res = await fetch(`${BASE_URL}/api/issues/incident-severity-levels/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Incident Severity Level data.");
  }

  return res.json();
}