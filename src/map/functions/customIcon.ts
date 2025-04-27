import OfficerMarkerIcon from "@/assets/chevron-military-svgrepo-com.svg";
import EnlistedMarkerIcon from "@/assets/badge-medal-svgrepo-com.svg";
import NcoMarkerIcon from "@/assets/military-helmet-svgrepo-com.svg";
import DefaultIcon from "@/assets/person.svg";
import L from "leaflet";


export const customIcon = (type: string) => {
    let iconUrl = DefaultIcon;
    if (type === "Officers") {
      iconUrl = OfficerMarkerIcon;
    } else if (type === "Enlisted Personnel") {
      iconUrl = EnlistedMarkerIcon;
    } else if (type === "Non-Commissioned Officers") {
      iconUrl = NcoMarkerIcon;
    } else {
      iconUrl = DefaultIcon;
    }
  
    return L.divIcon({
      className: `bg-[rgba(108,122,137,0.8)] rounded-full flex justify-center items-center w-[25px!important] h-[25px!important]`, 
      html: `
        <div class="flex justify-center items-center w-full h-full">
          <div class="flex justify-center items-center w-full h-full">
            <img src="${iconUrl}" style="width:20px;height:20px;"/>
          </div>
        </div>
      `,
      iconAnchor: [10, 10]
    });
  };