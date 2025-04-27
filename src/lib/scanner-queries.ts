/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BiometricRecordFace,
  CaptureResponse,
  FaceResponse,
  FingerprintData,
  InitIris,
  InitScanner,
  IrisCapturePayload,
  IrisCaptureResponse,
  UninitIrisScanner,
  UninitScanner,
} from "./scanner-definitions";
import { BIOMETRIC, FACE } from "@/lib/urls";

const FINGER_SCANNER_URL: string = import.meta.env.VITE_API_FINGER_URL;
const IRIS_SCANNER_URL: string = import.meta.env.VITE_API_IRIS_URL;

//For Fingerprints

export const uninitScanner = async (): Promise<UninitScanner> => {
  const response = await fetch(`${FINGER_SCANNER_URL}/uninitdevice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error Uninitializing Scanner");
  }
  return response.json();
};

export const getScannerInfo = async (): Promise<InitScanner> => {
  const response = await fetch(`${FINGER_SCANNER_URL}/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error Initizalizing Scanner");
  }
  return response.json();
};

export const captureFingerprints = async (
  payload: FingerprintData
): Promise<CaptureResponse> => {
  const response = await fetch(`${FINGER_SCANNER_URL}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error Initizalizing Scanner");
  }
  return response.json();
};

export const enrollAllFingers = async (payload: any) => {
  const response = await fetch(BIOMETRIC.ENROLL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const verifyFingerprint = async (verificationPayload: {
  template: string;
  type: string;
}): Promise<any> => {
  const response = await fetch(BIOMETRIC.IDENTIFY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificationPayload),
  });

  if (!response.ok) {
    throw new Error("No Matches Found");
  }

  return response.json();
};

//For Iris

export const uninitIrisScanner = async (): Promise<UninitIrisScanner> => {
  const response = await fetch(`${IRIS_SCANNER_URL}/uninitdevice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error Uninitializing Scanner");
  }
  return response.json();
};

export const getIrisScannerInfo = async (): Promise<InitIris> => {
  const response = await fetch(`${IRIS_SCANNER_URL}/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error Initizalizing Scanner");
  }
  return response.json();
};

export const captureIris = async (
  payload: IrisCapturePayload
): Promise<IrisCaptureResponse> => {
  const response = await fetch(`${IRIS_SCANNER_URL}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error Initizalizing Scanner");
  }
  return response.json();
};

export const enrollIris = async (payload: IrisCaptureResponse) => {
  const response = await fetch(BIOMETRIC.ENROLL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const verifyIris = async (verificationPayload: {
  template: string;
  type: string;
}): Promise<any> => {
  const response = await fetch(BIOMETRIC.IDENTIFY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificationPayload),
  });

  if (!response.ok) {
    throw new Error("No Matches Found");
  }

  return response.json();
};

//For Face

export const captureFace = async (): Promise<FaceResponse> => {
  const response = await fetch(FACE.CAPTURE_FACE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: "start" }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const enrollBiometricFace = async (
  enrollForm: BiometricRecordFace
): Promise<any> => {
  const response = await fetch(BIOMETRIC.ENROLL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollForm),
  });

  if (!response.ok) {
    throw new Error("Failed to enroll biometric data");
  }

  return response.json();
};

export const verifyFace = async (verificationPayload: {
  template: string;
  type: string;
}): Promise<any> => {
  const response = await fetch(BIOMETRIC.IDENTIFY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificationPayload),
  });

  if (!response.ok) {
    throw new Error("No Matches Found");
  }

  return response.json();
};
