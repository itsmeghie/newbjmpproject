import { PersonnelTypes } from "@/pages/Types/PersonnelTypes";

export interface MapProps {
  allArmyPersonnel: PersonnelTypes[];
  allNavyPersonnel: PersonnelTypes[];
  allAirforcePersonnel: PersonnelTypes[];
}

export interface MarkerProps {
  latitude: number;
  longitude: number;
  type: string;
}
