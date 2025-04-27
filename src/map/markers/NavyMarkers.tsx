import { Marker, Popup } from "react-leaflet";
import { MarkerProps } from "../Types/MapTypes";
import { customIcon } from "../functions/customIcon";


const NavyMarkers = ({ latitude, longitude, type }: MarkerProps) => {

    if (!latitude || !longitude) {
        console.log("Latitude and Longitude must be provided.");
        return null;
    }

    return (
        <Marker position={[latitude, longitude]} icon={customIcon(type)}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    )
}

export default NavyMarkers