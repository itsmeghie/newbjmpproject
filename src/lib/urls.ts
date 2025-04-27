// export const BASE_URL_BIOMETRIC: string = "http://192.168.50.204:8004";
// export const BASE_URL: string = "http://192.168.50.204:8002";
// const BASE_URL = "http://localhost:8001"
// const BASE_URL_BIOMETRIC = "http://localhost:8002"
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL_BIOMETRIC = import.meta.env.VITE_API_BASE_URL_BIOMETRIC;

export const BASE_URL_BIOMETRIC: string = "http://192.168.50.204:8006";
export const BASE_URL: string = "http://192.168.50.204:8001";

export const PDL = {
  getPDL: `${BASE_URL}/api/pdls/pdl/`,
  postPDL: `${BASE_URL}/api/pdls/pdl/`,
  putPDL: `${BASE_URL}/api/pdls/pdl/{id}/`,
  patchPDL: `${BASE_URL}/api/pdls/pdl/{id}/`,
  deletePDL: `${BASE_URL}/api/pdls/pdl/{id}/`,
};

export const PDL_CATEGORY = {
  getPDL_CATEGORY: `${BASE_URL}/api/pdls/pdl-category/`,
  postPDL_CATEGORY: `${BASE_URL}/api/pdls/pdl-category/`,
  putPDL_CATEGORY: `${BASE_URL}/api/pdls/pdl-category/{id}/`,
  patchPDL_CATEGORY: `${BASE_URL}/api/pdls/pdl-category/{id}/`,
  deletePDL_CATEGORY: `${BASE_URL}/api/pdls/pdl-category/{id}/`,
};

export const PERSONNEL = {
  getPersonnel: `${BASE_URL}/api/codes/personnel/`,
  postPersonnel: `${BASE_URL}/api/codes/personnel/`,
  putPersonnel: `${BASE_URL}/api/codes/personnel/{id}/`,
  patchPersonnel: `${BASE_URL}/api/codes/personnel/{id}/`,
  deletePersonnel: `${BASE_URL}/api/codes/personnel/{id}/`,
};

export const USER = {
  getUSER: `${BASE_URL}/api/user/me/`,
  postUSER: `${BASE_URL}/api/user/create/`,
  putUSER: `${BASE_URL}/api/user/me/`,
  patchUSER: `${BASE_URL}/api/user/me/`,
  getToken: `${BASE_URL}/api/user/token/`,
};

export const VISITOR_PASS = {
  getVISITOR_PASS: `${BASE_URL}/api/visitorpasses/visitorpass/`,
  postVISITOR_PASS: `${BASE_URL}/api/visitorpasses/visitorpass/`,
  putVISITOR_PASS: `${BASE_URL}/api/visitorpasses/visitorpass/`,
  patchVISITOR_PASS: `${BASE_URL}/api/visitorpasses/visitorpass/`,
  deleteVISITOR_PASS: `${BASE_URL}/api/visitorpasses/visitorpass/`,
};

export const VISITOR_PASS_CATEGORY = {
  getVISITOR_PASS_CATEGORY: `${BASE_URL}/api/visitorpasses/visitorpass-category/`,
  postVISITOR_PASS_CATEGORY: `${BASE_URL}/api/visitorpasses/visitorpass-category/`,
  putVISITOR_PASS_CATEGORY: `${BASE_URL}/api/visitorpasses/visitorpass-category/{id}/`,
  patchVISITOR_PASS_CATEGORY: `${BASE_URL}/api/visitorpasses/visitorpass-category/{id}/`,
  deleteVISITOR_PASS_CATEGORY: `${BASE_URL}/api/visitorpasses/visitorpass-category/{id}/`,
};

export const DORMITORY = {
  getDORMITORY: `${BASE_URL}/api/visitors/dormitory/`,
  postDORMITORY: `${BASE_URL}/api/visitors/dormitory/`,
  putDORMITORY: `${BASE_URL}/api/visitors/dormitory/{id}/`,
  patchDORMITORY: `${BASE_URL}/api/visitors/dormitory/{id}/`,
  deleteDORMITORY: `${BASE_URL}/api/visitors/dormitory/{id}/`,
};

export const FLOOR = {
  getFLOOR: `${BASE_URL}/api/visitors/floor/`,
  postFLOOR: `${BASE_URL}/api/visitors/floor/`,
  putFLOOR: `${BASE_URL}/api/visitors/floor/{id}/`,
  patchFLOOR: `${BASE_URL}/api/visitors/floor/{id}/`,
  deleteFLOOR: `${BASE_URL}/api/visitors/floor/{id}/`,
};

export const GENDER_CODE = {
  getGENDER_CODE: `${BASE_URL}/api/codes/genders/`,
  postGENDER_CODE: `${BASE_URL}/api/codes/genders/`,
  putGENDER_CODE: `${BASE_URL}/api/codes/genders/{id}/`,
  patchGENDER_CODE: `${BASE_URL}/api/codes/genders/{id}/`,
  deleteGENDER_CODE: `${BASE_URL}/api/codes/genders/{id}/`,
};

export const GENDER_TYPE = {
  getGENDER_TYPE: `${BASE_URL}/api/visitors/gender-type/`,
  postGENDER_TYPE: `${BASE_URL}/api/visitors/gender-type/`,
  putGENDER_TYPE: `${BASE_URL}/api/visitors/gender-type/{id}/`,
  patchGENDER_TYPE: `${BASE_URL}/api/visitors/gender-type/{id}/`,
  deleteGENDER_TYPE: `${BASE_URL}/api/visitors/gender-type/{id}/`,
};

export const JAIL = {
  getJAIL: `${BASE_URL}/api/jail/jails/`,
  postJAIL: `${BASE_URL}/api/jail/jails/`,
  putJAIL: `${BASE_URL}/api/jail/jails/{id}/`,
  patchJAIL: `${BASE_URL}/api/jail/jails/{id}/`,
  deleteJAIL: `${BASE_URL}/api/jail/jails/{id}/`,
};

export const JAIL_AREA = {
  getJAIL_AREA: `${BASE_URL}/api/jail/jail-areas/`,
  postJAIL_AREA: `${BASE_URL}/api/jail/jail-areas/`,
  putJAIL_AREA: `${BASE_URL}/api/jail/jail-areas/{id}/`,
  patchJAIL_AREA: `${BASE_URL}/api/jail/jail-areas/{id}/`,
  deleteJAIL_AREA: `${BASE_URL}/api/jail/jail-areas/{id}/`,
};

export const SECURITY_LEVEL = {
  getSECURITY_LEVEL: `${BASE_URL}/api/visitors/security-level/`,
  postSECURITY_LEVEL: `${BASE_URL}/api/visitors/security-level/`,
  putSECURITY_LEVEL: `${BASE_URL}/api/visitors/security-level/{id}/`,
  patchSECURITY_LEVEL: `${BASE_URL}/api/visitors/security-level/{id}/`,
  deleteSECURITY_LEVEL: `${BASE_URL}/api/visitors/security-level/{id}/`,
};

export const VISITOR = {
  getVISITOR: `${BASE_URL}/api/visitors/visitor/`,
  getVISITORS: `${BASE_URL}/api/visitors/visitor/{id}/`,
  postVISITOR: `${BASE_URL}/api/visitors/visitor/`,
  putVISITOR: `${BASE_URL}/api/visitors/visitor/{id}/`,
  patchVISITOR: `${BASE_URL}/api/visitors/visitor/{id}/`,
  deleteVISITOR: `${BASE_URL}/api/visitors/visitor/{id}/`,
};

export const VISITOR_CATEGORY = {
  getVISITOR_CATEGORY: `${BASE_URL}/api/visitors/visitor-category/`,
  postVISITOR_CATEGORY: `${BASE_URL}/api/visitors/visitor-category/`,
  putVISITOR_CATEGORY: `${BASE_URL}/api/visitors/visitor-category/{id}/`,
  patchVISITOR_CATEGORY: `${BASE_URL}/api/visitors/visitor-category/{id}/`,
  deleteVISITOR_CATEGORY: `${BASE_URL}/api/visitors/visitor-category/{id}/`,
};

export const AFFILIATION_TYPES = {
  getAFFILIATION_TYPES: `${BASE_URL}/api/codes/affiliation-types/`,
  postAFFILIATION_TYPES: `${BASE_URL}/api/codes/affiliation-types/`,
  putAFFILIATION_TYPES: `${BASE_URL}/api/codes/affiliation-types/{id}/`,
  patchAFFILIATION_TYPES: `${BASE_URL}/api/codes/affiliation-types/{id}/`,
  deleteAFFILIATION_TYPES: `${BASE_URL}/api/codes/affiliation-types/{id}/`,
};

export const CIVIL_STATUS = {
  getCIVIL_STATUS: `${BASE_URL}/api/codes/civil-statuses/`,
  postCIVIL_STATUS: `${BASE_URL}/api/codes/civil-statuses/`,
  putCIVIL_STATUS: `${BASE_URL}/api/codes/civil-statuses/{id}/`,
  patchCIVIL_STATUS: `${BASE_URL}/api/codes/civil-statuses/{id}/`,
  deleteCIVIL_STATUS: `${BASE_URL}/api/codes/civil-statuses/{id}/`,
};

export const NATIONALITY = {
  getNATIONALITY: `${BASE_URL}/api/codes/nationalities/`,
  postNATIONALITY: `${BASE_URL}/api/codes/nationalities/`,
  putNATIONALITY: `${BASE_URL}/api/codes/nationalities/{id}/`,
  patchNATIONALITY: `${BASE_URL}/api/codes/nationalities/{id}/`,
  deleteNATIONALITY: `${BASE_URL}/api/codes/nationalities/{id}/`,
};

export const PERSON = {
  getPERSON: `${BASE_URL}/api/standards/persons/`,
  postPERSON: `${BASE_URL}/api/standards/persons/`,
  putPERSON: `${BASE_URL}/api/standards/persons/{id}/`,
  patchPERSON: `${BASE_URL}/api/standards/persons/{id}/`,
  deletePERSON: `${BASE_URL}/api/standards/persons/{id}/`,
};

export const BIOMETRIC = {
  ENROLL: `${BASE_URL_BIOMETRIC}/api/biometric/enroll/`,
  EXTRACT: `${BASE_URL_BIOMETRIC}/api/biometric/extract/`,
  IDENTIFY: `${BASE_URL_BIOMETRIC}/api/biometric/identify/`,
  deleteBIOMETRIC: `${BASE_URL_BIOMETRIC}/api/biometric/delete/`,
};

export const FACE = {
  CAPTURE_FACE: "http://localhost:5005/command",
};

export const SOCIAL_MEDIA_PLATFORMS = {
  getSOCIALMEDIAPLATFORMS: `${BASE_URL}/api/codes/social-media-platforms/`,
  postSOCIALMEDIAPLATFORMS: `${BASE_URL}/api/codes/social-media-platforms/`,
  putSOCIALMEDIAPLATFORMS: `${BASE_URL}/api/codes/social-media-platforms/{id}/`,
  patchSOCIALMEDIAPLATFORMS: `${BASE_URL}/api/codes/social-media-platforms/{id}/`,
  deleteSOCIALMEDIAPLATFORMS: `${BASE_URL}/api/codes/social-media-platforms/{id}/`,
};

export const RECORD_STATUS = {
  getRECORD_STATUS: `${BASE_URL}/api/codes/record-statuses/`,
  postRECORD_STATUS: `${BASE_URL}/api/codes/record-statuses/`,
  putRECORD_STATUS: `${BASE_URL}/api/codes/record-statuses/{id}/`,
  patchRECORD_STATUS: `${BASE_URL}/api/codes/record-statuses/{id}/`,
  deleteRECORD_STATUS: `${BASE_URL}/api/codes/record-statuses/{id}/`,
};

export const DETENTION_BUILDING = {
  getDETENTION_BUILDING: `${BASE_URL}/api/jail/detention-buildings/`,
  postDETENTION_BUILDING: `${BASE_URL}/api/jail/detention-buildings/`,
  putDETENTION_BUILDING: `${BASE_URL}/api/jail/detention-buildings/{id}/`,
  patchDETENTION_BUILDING: `${BASE_URL}/api/jail/detention-buildings/{id}/`,
  deleteDETENTION_BUILDING: `${BASE_URL}/api/jail/detention-buildings/{id}/`,
};

export const DETENTION_FLOOR = {
  getDETENTION_FLOOR: `${BASE_URL}/api/jail/detention-floors/`,
  postDETENTION_FLOOR: `${BASE_URL}/api/jail/detention-floors/`,
  putDETENTION_FLOOR: `${BASE_URL}/api/jail/detention-floors/{id}/`,
  patchDETENTION_FLOOR: `${BASE_URL}/api/jail/detention-floors/{id}/`,
  deleteDETENTION_FLOOR: `${BASE_URL}/api/jail/detention-floors/{id}/`,
};

export const DETENTION_CELL = {
  getDETENTION_CELL: `${BASE_URL}/api/jail/detention-cells/`,
  postDETENTION_CELL: `${BASE_URL}/api/jail/detention-cells/`,
  putDETENTION_CELL: `${BASE_URL}/api/jail/detention-cells/{id}/`,
  patchDETENTION_CELL: `${BASE_URL}/api/jail/detention-cells/{id}/`,
  deleteDETENTION_CELL: `${BASE_URL}/api/jail/detention-cells/{id}/`,
};

export const MEDIA = {
  getMEDIA: `${BASE_URL}/api/standards/media/`,
  postMEDIA: `${BASE_URL}/api/standards/media/`,
  putMEDIA: `${BASE_URL}/api/standards/media/{id}/`,
  patchMEDIA: `${BASE_URL}/api/standards/media/{id}/`,
  deleteMEDIA: `${BASE_URL}/api/standards/media/{id}/`,
};

export const JAIL_REGION = {
  getJAILREGION: `${BASE_URL}/api/jail/jail-regions/`,
  postJAILREGION: `${BASE_URL}/api/jail/jail-regions/`,
  putJAILREGION: `${BASE_URL}/api/jail/jail-regions/{id}/`,
  patchJAILREGION: `${BASE_URL}/api/jail/jail-regions/{id}/`,
  deleteJAILREGION: `${BASE_URL}/api/jail/jail-regions/{id}/`,
};

export const JAIL_PROVINCE = {
  getJAIL_PROVINCE: `${BASE_URL}/api/jail/jail-provinces/`,
  postJAIL_PROVINCE: `${BASE_URL}/api/jail/jail-provinces/`,
  putJAIL_PROVINCE: `${BASE_URL}/api/jail/jail-provinces/{id}/`,
  patchJAIL_PROVINCE: `${BASE_URL}/api/jail/jail-provinces/{id}/`,
  deleteJAIL_PROVINCE: `${BASE_URL}/api/jail/jail-provinces/{id}/`,
};

export const JAIL_MUNICIPALITY = {
  getJAIL_MUNICIPALITY: `${BASE_URL}/api/jail/jail-municipalities/`,
  postJAIL_MUNICIPALITY: `${BASE_URL}/api/jail/jail-municipalities/`,
  putJAIL_MUNICIPALITY: `${BASE_URL}/api/jail/jail-municipalities/{id}/`,
  patchJAIL_MUNICIPALITY: `${BASE_URL}/api/jail/jail-municipalities/{id}/`,
  deleteJAIL_MUNICIPALITY: `${BASE_URL}/api/jail/jail-municipalities/{id}/`,
};

export const JAIL_MEDIA = {
  getJAIL_MEDIA: `${BASE_URL}/api/jail/jail-media/`,
  postJAIL_MEDIA: `${BASE_URL}/api/jail/jail-media/`,
  putJAIL_MEDIA: `${BASE_URL}/api/jail/jail-media/{id}/`,
  patchJAIL_MEDIA: `${BASE_URL}/api/jail/jail-media/{id}/`,
  deleteJAIL_MEDIA: `${BASE_URL}/api/jail/jail-media/{id}/`,
};

export const JAIL_BARANGAY = {
  getJAIL_BARANGAY: `${BASE_URL}/api/jail/jail-barangays/`,
  postJAIL_BARANGAY: `${BASE_URL}/api/jail/jail-barangays/`,
  putJAIL_BARANGAY: `${BASE_URL}/api/jail/jail-barangays/{id}/`,
  patchJAIL_BARANGAY: `${BASE_URL}/api/jail/jail-barangays/{id}/`,
  deleteJAIL_BARANGAY: `${BASE_URL}/api/jail/jail-barangays/{id}/`,
};

export const VISITOR_TYPE = {
  getVISITOR_TYPE: `${BASE_URL}/api/codes/visitor-types/`,
  postVISITOR_TYPE: `${BASE_URL}/api/codes/visitor-types/`,
  putVISITOR_TYPE: `${BASE_URL}/api/codes/visitor-types/{id}/`,
  patchVISITOR_TYPE: `${BASE_URL}/api/codes/visitor-types/{id}/`,
  deleteVISITOR_TYPE: `${BASE_URL}/api/codes/visitor-types/{id}/`,
};

export const VISITOR_TO_PDL_RELATIONSHIP = {
  getVISITOR_TO_PDL_RELATIONSHIP: `${BASE_URL}/api/codes/visitor-to-pdl-relationships/`,
  postVISITOR_TO_PDL_RELATIONSHIP: `${BASE_URL}/api/codes/visitor-to-pdl-relationships/`,
  putVISITOR_TO_PDL_RELATIONSHIP: `${BASE_URL}/api/codes/visitor-to-pdl-relationships/{id}/`,
  patchVISITOR_TO_PDL_RELATIONSHIP: `${BASE_URL}/api/codes/visitor-to-pdl-relationships/{id}/`,
  deleteVISITOR_TO_PDL_RELATIONSHIP: `${BASE_URL}/api/codes/visitor-to-pdl-relationships/{id}/`,
};

export const VISITOR_REQ_DOCS = {
  getVISITOR_REQ_DOCS: `${BASE_URL}/api/codes/visitor-req-docs/`,
  postVISITOR_REQ_DOCS: `${BASE_URL}/api/codes/visitor-req-docs/`,
  putVISITOR_REQ_DOCS: `${BASE_URL}/api/codes/visitor-req-docs/{id}/`,
  patchVISITOR_REQ_DOCS: `${BASE_URL}/api/codes/visitor-req-docs/{id}/`,
  deleteVISITOR_REQ_DOCS: `${BASE_URL}/api/codes/visitor-req-docs/{id}/`,
};

export const RANK = {
  getRANK: `${BASE_URL}/api/codes/ranks/`,
  postRANK: `${BASE_URL}/api/codes/ranks/`,
  putRANK: `${BASE_URL}/api/codes/ranks/{id}/`,
  patchRANK: `${BASE_URL}/api/codes/ranks/{id}/`,
  deleteRANK: `${BASE_URL}/api/codes/ranks/{id}/`,
};

export const POSITION = {
  getPOSITION: `${BASE_URL}/api/codes/positions/`,
  postPOSITION: `${BASE_URL}/api/codes/positions/`,
  putPOSITION: `${BASE_URL}/api/codes/positions/{id}/`,
  patchPOSITION: `${BASE_URL}/api/codes/positions/{id}/`,
  deletePOSITION: `${BASE_URL}/api/codes/positions/{id}/`,
};

export const ORGANIZATION = {
  getORGANIZATION: `${BASE_URL}/api/codes/organizations/`,
  postORGANIZATION: `${BASE_URL}/api/codes/organizations/`,
  putORGANIZATION: `${BASE_URL}/api/codes/organizations/{id}/`,
  patchORGANIZATION: `${BASE_URL}/api/codes/organizations/{id}/`,
  deleteORGANIZATION: `${BASE_URL}/api/codes/organizations/{id}/`,
};

export const ORGANIZATIONAL_TYPE = {
  getORGANIZATIONAL_TYPE: `${BASE_URL}/api/codes/organizational-types/`,
  postORGANIZATIONAL_TYPE: `${BASE_URL}/api/codes/organizational-types/`,
  putORGANIZATIONAL_TYPE: `${BASE_URL}/api/codes/organizational-types/{id}/`,
  patchORGANIZATIONAL_TYPE: `${BASE_URL}/api/codes/organizational-types/{id}/`,
  deleteORGANIZATIONAL_TYPE: `${BASE_URL}/api/codes/organizational-types/{id}/`,
};

export const ORGANIZATIONAL_LEVEL = {
  getORGANIZATIONAL_LEVEL: `${BASE_URL}/api/codes/organizational-levels/`,
  postORGANIZATIONAL_LEVEL: `${BASE_URL}/api/codes/organizational-levels/`,
  putORGANIZATIONAL_LEVEL: `${BASE_URL}/api/codes/organizational-levels/{id}/`,
  patchORGANIZATIONAL_LEVEL: `${BASE_URL}/api/codes/organizational-levels/{id}/`,
  deleteORGANIZATIONAL_LEVEL: `${BASE_URL}/api/codes/organizational-levels/{id}/`,
};

export const JAIL_TYPE = {
  getJAIL_TYPE: `${BASE_URL}/api/jail/jail-types/`,
  postJAIL_TYPE: `${BASE_URL}/api/jail/jail-types/`,
  putJAIL_TYPE: `${BASE_URL}/api/jail/jail-types/{id}/`,
  patchJAIL_TYPE: `${BASE_URL}/api/jail/jail-types/{id}/`,
  deleteJAIL_TYPE: `${BASE_URL}/api/jail/jail-types/{id}/`,
};

export const JAIL_SECURITY_LEVEL = {
  getJAIL_SECURITY_LEVEL: `${BASE_URL}/api/jail/jail-security-levels/`,
  postJAIL_SECURITY_LEVEL: `${BASE_URL}/api/jail/jail-security-levels/`,
  putJAIL_SECURITY_LEVEL: `${BASE_URL}/api/jail/jail-security-levels/{id}/`,
  patchJAIL_SECURITY_LEVEL: `${BASE_URL}/api/jail/jail-security-levels/{id}/`,
  deleteJAIL_SECURITY_LEVEL: `${BASE_URL}/api/jail/jail-security-levels/{id}/`,
};

export const JAIL_CATEGORY = {
  getJAIL_CATEGORY: `${BASE_URL}/api/jail/jail-categories/`,
  postJAIL_CATEGORY: `${BASE_URL}/api/jail/jail-categories/`,
  putJAIL_CATEGORY: `${BASE_URL}/api/jail/jail-categories/{id}/`,
  patchJAIL_CATEGORY: `${BASE_URL}/api/jail/jail-categories/{id}/`,
  deleteJAIL_CATEGORY: `${BASE_URL}/api/jail/jail-categories/{id}/`,
};

export const ID_TYPE = {
  getID_TYPE: `${BASE_URL}/api/codes/id-types/`,
  postID_TYPE: `${BASE_URL}/api/codes/id-types/`,
  putID_TYPE: `${BASE_URL}/api/codes/id-types/{id}/`,
  patchID_TYPE: `${BASE_URL}/api/codes/id-types/{id}/`,
  deleteID_TYPE: `${BASE_URL}/api/codes/id-types/{id}/`,
};

export const SYSTEM_SETTING = {
  getSYSTEM_SETTING: `${BASE_URL}/api/codes/system-settings/`,
  postSYSTEM_SETTING: `${BASE_URL}/api/codes/system-settings/`,
  putSYSTEM_SETTING: `${BASE_URL}/api/codes/system-settings/{id}/`,
  patchSYSTEM_SETTING: `${BASE_URL}/api/codes/system-settings/{id}/`,
  deleteSYSTEM_SETTING: `${BASE_URL}/api/codes/system-settings/{id}/`,
};

export const GROUP_ROLE = {
  getGROUP_ROLE: `${BASE_URL}/api/standards/groups/`,
  postGROUP_ROLE: `${BASE_URL}/api/standards/groups/`,
  putGROUP_ROLE: `${BASE_URL}/api/standards/groups/{id}/`,
  patchGROUP_ROLE: `${BASE_URL}/api/standards/groups/{id}/`,
  deleteGROUP_ROLE: `${BASE_URL}/api/standards/groups/{id}/`,
};

export const GROUP_ROLE_PERMISSION = {
  getGROUP_ROLE_PERMISSION: `${BASE_URL}/api/standards/permissions/`,
  postGROUP_ROLE_PERMISSION: `${BASE_URL}/api/standards/permissions/`,
  putGROUP_ROLE_PERMISSION: `${BASE_URL}/api/standards/permissions/{id}/`,
  patchGROUP_ROLE_PERMISSION: `${BASE_URL}/api/standards/permissions/{id}/`,
  deleteGROUP_ROLE_PERMISSION: `${BASE_URL}/api/standards/permissions/{id}/`,
};

export const PDL_TO_VISIT = {
  getPDL_TO_VISIT: `${BASE_URL}/api/codes/pdl-to-visit/`,
  postPDL_TO_VISIT: `${BASE_URL}/api/codes/pdl-to-visit/`,
  putPDL_TO_VISIT: `${BASE_URL}/api/codes/pdl-to-visit/{id}/`,
  patchPDL_TO_VISIT: `${BASE_URL}/api/codes/pdl-to-visit/{id}/`,
  deletePDL_TO_VISIT: `${BASE_URL}/api/codes/pdl-to-visit/{id}/`,
};

export const EMPLOYMENT_TYPE = {
  getEMPLOYMENT_TYPE: `${BASE_URL}/api/codes/employment-types/`,
  postEMPLOYMENT_TYPE: `${BASE_URL}/api/codes/employment-types/`,
  putEMPLOYMENT_TYPE: `${BASE_URL}/api/codes/employment-types/{id}/`,
  patchEMPLOYMENT_TYPE: `${BASE_URL}/api/codes/employment-types/{id}/`,
  deleteEMPLOYMENT_TYPE: `${BASE_URL}/api/codes/employment-types/{id}/`,
};

export const DEVICE_TYPE = {
  getDEVICE_TYPE: `${BASE_URL}/api/codes/device-types/`,
  postDEVICE_TYPE: `${BASE_URL}/api/codes/device-types/`,
  putDEVICE_TYPE: `${BASE_URL}/api/codes/device-types/{id}/`,
  patchDEVICE_TYPE: `${BASE_URL}/api/codes/device-types/{id}/`,
  deleteDEVICE_TYPE: `${BASE_URL}/api/codes/device-types/{id}/`,
};

export const DEVICE_USAGE = {
  getDEVICE_USAGE: `${BASE_URL}/api/codes/device-usages/`,
  postDEVICE_USAGE: `${BASE_URL}/api/codes/device-usages/`,
  putDEVICE_USAGE: `${BASE_URL}/api/codes/device-usages/{id}/`,
  patchDEVICE_USAGE: `${BASE_URL}/api/codes/device-usages/{id}/`,
  deleteDEVICE_USAGE: `${BASE_URL}/api/codes/device-usages/{id}/`,
};

export const DEVICE = {
  getDEVICE: `${BASE_URL}/api/codes/devices/`,
  postDEVICE: `${BASE_URL}/api/codes/devices/`,
  putDEVICE: `${BASE_URL}/api/codes/devices/{id}/`,
  patchDEVICE: `${BASE_URL}/api/codes/devices/{id}/`,
  deleteDEVICE: `${BASE_URL}/api/codes/devices/{id}/`,
};

export const SUMMARYCARD = {
  getSUMMARYCARD: `${BASE_URL}/api/dashboard/summary-dashboard/`,
  getDAILY_LOGS: `${BASE_URL}/api/dashboard/summary-dashboard/get-daily-logs`,
  getDAILY_PERSON_COUNT: `${BASE_URL}/api/dashboard/summary-dashboard/get-daily-person-count`,
  getMONTHLY_LOGS: `${BASE_URL}/api/dashboard/summary-dashboard/get-monthly-logs`,
  getMONTLY_PERSON_COUNT: `${BASE_URL}/api/dashboard/summary-dashboard/get-monthly-person-count`,
};

export const ISSUES = {
  getISSUES: `${BASE_URL}/api/issues/issues/`,
  POSTISSUES: `${BASE_URL}/api/issues/issues/`,
  putISSUES: `${BASE_URL}/api/issues/issues/{id}/`,
  patchISSUES: `${BASE_URL}/api/issues/issues/{id}/`,
  deleteISSUES: `${BASE_URL}/api/issues/issues/{id}/`,
};

export const SKILLS = {
  getSKILLS: `${BASE_URL}/api/standards/skills/`,
  postSKILLS: `${BASE_URL}/api/standards/skills/`,
  getSKILL: `${BASE_URL}/api/standards/skills/{id}/`,
  patchSKILLS: `${BASE_URL}/api/standards/skills/{id}/`,
  deleteSKILLS: `${BASE_URL}/api/standards/skills/{id}/`,
  putSKILLS: `${BASE_URL}/api/standards/skills/{id}/`,
};

export const TALENTS = {
  getTALENTS: `${BASE_URL}/api/standards/talents/`,
  postTALENTS: `${BASE_URL}/api/standards/talents/`,
  getSKILL: `${BASE_URL}/api/standards/talents/{id}/`,
  patchTALENTS: `${BASE_URL}/api/standards/talents/{id}/`,
  deleteTALENTS: `${BASE_URL}/api/standards/talents/{id}/`,
  putTALENTS: `${BASE_URL}/api/standards/talents/{id}/`,
};

export const RELIGION = {
  getRELIGION: `${BASE_URL}/api/standards/religions/`,
  postRELIGION: `${BASE_URL}/api/standards/religions/`,
  getRELIGIONS: `${BASE_URL}/api/standards/religions/{id}/`,
  patchRELIGION: `${BASE_URL}/api/standards/religions/{id}/`,
  deleteRELIGION: `${BASE_URL}/api/standards/religions/{id}/`,
  putRELIGION: `${BASE_URL}/api/standards/religions/{id}/`,
};

export const INTEREST = {
  getINTEREST: `${BASE_URL}/api/standards/interests/`,
  postINTEREST: `${BASE_URL}/api/standards/interests/`,
  patchINTEREST: `${BASE_URL}/api/standards/interests/{id}/`,
  deleteINTEREST: `${BASE_URL}/api/standards/interests/{id}/`,
  putINTEREST: `${BASE_URL}/api/standards/interests/{id}/`,
};

export const ETHNICITY = {
  getETHNICITY: `${BASE_URL}/api/codes/ethnicities/`,
  postETHNICITY: `${BASE_URL}/api/codes/ethnicities/`,
  patchETHNICITY: `${BASE_URL}/api/codes/ethnicities/{id}/`,
  deleteETHNICITY: `${BASE_URL}/api/codes/ethnicities/{id}/`,
  putETHNICITY: `${BASE_URL}/api/codes/ethnicities/{id}/`,
};

export const ETHNICITYPROVINCE = {
  getETHNICITYPROVINCE: `${BASE_URL}/api/codes/ethnicity-provinces/`,
  postETHNICITYPROVINCE: `${BASE_URL}/api/codes/ethnicity-provinces/`,
  patchETHNICITYPROVINCE: `${BASE_URL}/api/codes/ethnicity-provinces/{id}/`,
  deleteETHNICITYPROVINCE: `${BASE_URL}/api/codes/ethnicity-provinces/{id}/`,
  putETHNICITYPROVINCE: `${BASE_URL}/api/codes/ethnicity-provinces/{id}/`,
};

export const LOOK = {
  getLOOK: `${BASE_URL}/api/pdls/looks/`,
  postLOOK: `${BASE_URL}/api/pdls/looks/`,
  patchLOOK: `${BASE_URL}/api/pdls/looks/{id}/`,
  deleteLOOK: `${BASE_URL}/api/pdls/looks/{id}/`,
  putLOOK: `${BASE_URL}/api/pdls/looks/{id}/`,
};

export const SERVICEPROVIDER = {
  getSERVICEPROVIDER: `${BASE_URL}/api/service-providers/service-providers/`,
  postSERVICEPROVIDER: `${BASE_URL}/api/service-providers/service-providers/`,
  patchSERVICEPROVIDER: `${BASE_URL}/api/service-providers/service-providers/{id}/`,
  deleteSERVICEPROVIDER: `${BASE_URL}/api/service-providers/service-providers/{id}/`,
  putSERVICEPROVIDER: `${BASE_URL}/api/service-providers/service-providers/{id}/`,
};

export const COURT = {
  getCOURT: `${BASE_URL}/api/standards/court/`,
  postCOURT: `${BASE_URL}/api/standards/court/`,
  patchCOURT: `${BASE_URL}/api/standards/court/{id}/`,
  deleteCOURT: `${BASE_URL}/api/standards/court/{id}/`,
  putCOURT: `${BASE_URL}/api/standards/court/{id}/`,
};

export const BRANCH = {
  getBRANCH: `${BASE_URL}/api/standards/court-branch/`,
  postBRANCH: `${BASE_URL}/api/standards/court-branch/`,
  patchBRANCH: `${BASE_URL}/api/standards/court-branch/{id}/`,
  deleteBRANCH: `${BASE_URL}/api/standards/court-branch/{id}/`,
  putBRANCH: `${BASE_URL}/api/standards/court-branch/{id}/`,
};

export const BACKUP = {
  getBACKUP: `${BASE_URL}/api/frontend_server_backups/`,
  postBACKUP: `${BASE_URL}/api/frontend_server_backups/`,
}

export const ISSUE_TYPE = {
  getISSUE_TYPE: `${BASE_URL}/api/issues_v2/issue-types/`,
  postISSUE_TYPE: `${BASE_URL}/api/issues_v2/issue-types/`,
  putISSUE_TYPE: `${BASE_URL}/api/issues_v2/issue-types/{id}/`,
  patchISSUE_TYPE: `${BASE_URL}/api/issues_v2/issue-types/{id}/`,
  deleteISSUE_TYPE: `${BASE_URL}/api/issues_v2/issue-types/{id}/`,
}

export const ISSUE_CATEGORIES = {
  getISSUE_CATEGORIES: `${BASE_URL}/api/issues/issue-categories/`,
  postISSUE_CATEGORIES: `${BASE_URL}/api/issues/issue-categories/`,
  putISSUE_CATEGORIES: `${BASE_URL}/api/issues/issue-categories/{id}/`,
  patchISSUE_CATEGORIES: `${BASE_URL}/api/issues/issue-categories/{id}/`,
  deleteISSUE_CATEGORIES: `${BASE_URL}/api/issues/issue-categories/{id}/`,
}

export const RISK = {
  getRISK: `${BASE_URL}/api/issues_v2/risk/`,
  postRISK: `${BASE_URL}/api/issues_v2/risk/`,
  putRISK: `${BASE_URL}/api/issues_v2/risk/{id}/`,
  patchRISK: `${BASE_URL}/api/issues_v2/risk/{id}/`,
  deleteRISK: `${BASE_URL}/api/issues_v2/risk/{id}/`,
}