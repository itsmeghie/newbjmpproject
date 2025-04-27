export interface FilterType {
   Officers: boolean;
   "Enlisted Personnel": boolean;
   "Non-Commissioned Officers": boolean;
}

export interface MapView {
   center: {
     lat: number;
     lon: number;
   };
   zoom: number;
 }