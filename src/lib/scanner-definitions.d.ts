export type UninitScanner = {
  CaptureData: string | number | boolean | null;
  DeviceInfo: string | number | boolean | null;
  ErrorCode: string;
  ErrorDescription: string;
  Fingers: {
    FingerCount: number;
    fingers: string | number | null;
  };
  Status: boolean;
};

export type InitScanner = {
  CaptureData: null;
  DeviceInfo: {
    Firmware: string;
    Height: number;
    Make: string;
    Model: string;
    SerialNo: string;
    Width: number;
  };
  ErrorCode: string;
  ErrorDescription: string;
  Fingers: {
    FingerCount: number;
    fingers: string | number | null;
  };
  Status: boolean;
};

export type FingerPosition = {
  LEFT_LITTLE: boolean;
  LEFT_RING: boolean;
  LEFT_MIDDLE: boolean;
  LEFT_INDEX: boolean;
  RIGHT_INDEX: boolean;
  RIGHT_MIDDLE: boolean;
  RIGHT_RING: boolean;
  RIGHT_LITTLE: boolean;
  LEFT_THUMB: boolean;
  RIGHT_THUMB: boolean;
};

export type FingerprintData = {
  TimeOut: number;
  Slap: number;
  FingerPosition: FingerPosition;
  NFIQ_Quality: number;
};

export type CapturedFingers = {
  FingerBitmapStr: string;
  Intensity: number;
  NFIQ: number;
  Quality: number;
};

export type CaptureResponse = {
  CaptureData: {
    CapturedFingers: CapturedFingers[];
    ErrorCode: string | number;
    FingerCount: number;
    GraphicalMainBitmap: string;
    GraphicalPlainBitmap: string;
  };
  DeviceInfo: {
    Firmware: string;
    Height: number;
    Make: string;
    Model: string;
    SerialNo: string;
    Width: number;
  };
  ErrorCode: string | number;
  ErrorDescription: string;
  Fingers: {
    FingerCount: number;
    fingers: string | number | null;
  };
  Status: boolean;
};

export type CustomFingerResponse = {
  CapturedFingers: CapturedFingers[];
  GraphicalPlainBitmap: string;
};

export type FaceResponse = {
  result: string;
  images: {
    icao: string;
    original: string;
  };
};

export type BiometricRecordFace = {
  remarks: string;
  person: number | null;
  biometric_type: string;
  position: string;
  place_registered: string;
  upload_data: string;
};

export type UninitIrisScanner = {
  ErrorCode: string;
  ErrorDescription: string;
  QualityLeft: number;
  QualityRight: number;
};

type IrisDeviceInfo = {
  Firmware: string;
  Height: number;
  Make: string;
  Model: string;
  SerialNo: string;
  Width: number;
};

export type InitIris = {
  DeviceInfo: IrisDeviceInfo;
  ErrorCode: string;
  ErrorDescription: string;
  QualityLeft: number;
  QualityRight: number;
};

export type IrisCapturePayload = {
  TimeOut: number | string;
  IrisSide: number | string;
};

export type IrisCaptureResponse = {
  ErrorCode: string;
  ErrorDescription: string;
  ImgDataLeft: string;
  ImgDataRight: string;
  QualityLeft: number;
  QualityRight: number;
};

// ------------------ Added MatchData Section ------------------

export type Gender = {
  id: number;
  gender_option: string;
  description: string;
};

export type PersonData = {
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
  object_ref_no: string | null;
  record_status: string | null;
};

export type Biometric = {
  id: number;
  remarks: string;
  person: number;
  person_data: PersonData;
  biometric_type: string;
  position: string;
  place_registered: string;
  data: string;
};

export type MatchData = {
  subject_id: string;
  score: number;
  biometric: Biometric;
};

export type FaceVerificationResponse = {
  message: string;
  data: MatchData[];
};
