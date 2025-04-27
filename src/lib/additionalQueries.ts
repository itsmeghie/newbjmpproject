import {
  GroupAffiliation,
  NonPdlVisitorReasonVisit,
  PDLVisitStatus,
  PersonnelStatus,
  PersonnelType,
  ProvidedService,
  Relationship,
  ServiceProviderRemarks,
  ServiceProviderType,
} from "./definitions";
import { BASE_URL } from "./urls";

export async function getPersonnelTypes(
  token: string
): Promise<PersonnelType[]> {
  const res = await fetch(`${BASE_URL}/api/codes/personnel-type/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel Type data.");
  }

  return res.json();
}

export async function getPersonnelStatuses(
  token: string
): Promise<PersonnelStatus[]> {
  const res = await fetch(`${BASE_URL}/api/codes/personnel-status/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Personnel Status data.");
  }

  return res.json();
}

export async function getNonPdlVisitorReasons(
  token: string
): Promise<NonPdlVisitorReasonVisit[]> {
  const res = await fetch(
    `${BASE_URL}/api/non-pdl-visitor/non-pdl-reason-visits/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Reasons data.");
  }

  return res.json();
}

export async function getRelationships(token: string): Promise<Relationship[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/relationship/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Relationships data.");
  }

  return res.json();
}

export async function getProvidedServices(
  token: string
): Promise<ProvidedService[]> {
  const res = await fetch(
    `${BASE_URL}/api/service-providers/provided-services/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Provided Service data.");
  }

  return res.json();
}

export async function getServiceProviderTypes(
  token: string
): Promise<ServiceProviderType[]> {
  const res = await fetch(
    `${BASE_URL}/api/service-providers/service-provider-visitor-types/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Service Provider Types data.");
  }

  return res.json();
}

export async function getServiceProviderRemarks(
  token: string
): Promise<ServiceProviderRemarks[]> {
  const res = await fetch(
    `${BASE_URL}/api/service-providers/service-provider-remarks-many/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Service Provider Remarks data.");
  }

  return res.json();
}

export async function getGroupAffiliations(
  token: string
): Promise<GroupAffiliation[]> {
  const res = await fetch(
    `${BASE_URL}/api/service-providers/service-provider-group-affiliations/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Affiliations data.");
  }

  return res.json();
}

export async function getPDLVisitStatuses(
  token: string
): Promise<PDLVisitStatus[]> {
  const res = await fetch(`${BASE_URL}/api/pdls/pdl-visitation-statuses/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch PDL Visit Statuses data.");
  }

  return res.json();
}
