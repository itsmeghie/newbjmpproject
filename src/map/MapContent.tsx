import { useState } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import MapLayerChanger from "./navigationbuttons/MapLayerChanger"
import ControlButtons from "./navigationbuttons/ControlButtons"
import L, { LatLngExpression } from "leaflet";
import markerIcon from "@/assets/location_marker.png"

const customMarkerIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [25, 41], // Default size for Leaflet markers
    iconAnchor: [12, 41], // Anchor point of the icon
    popupAnchor: [1, -34], // Popup position relative to the icon
    shadowSize: [41, 41], // Default shadow size
});

const FlyToMarker = ({ position }: { position: LatLngExpression }) => {
    const map = useMap();
    const handleClick = () => {
        map.flyTo(position, 18);
    };

    return <Marker position={position} eventHandlers={{ click: handleClick }} icon={customMarkerIcon} />;
};


export const MapContent = () => {
    const [mapUrl, setMapUrl] = useState("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")
    const [mapLayer, setMapLayer] = useState("satellite")
    const [clusterMarkers, setClusterMarkers] = useState(true)

    const attributions = [
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    ]


    const polylinePositionsMale: LatLngExpression[] = [
        [14.727153530902502, 121.11558987623435],
        [14.725771474882087, 121.1166421028438],
        [14.726507817289903, 121.11769237726229],
        [14.727697288244704, 121.11686465171415],
        [14.727153530902502, 121.11558987623435]
    ];

    const polylinePositionsFemale: LatLngExpression[] = [
        [14.638780496127705, 121.06193862912565],
        [14.637685344314953, 121.06189303157467],
        [14.637674963702898, 121.06394760357763],
        [14.63872080789965, 121.0639288281155],
        [14.638780496127705, 121.06193862912565]
    ];

    return (
        <div className="w-[95%] h-[90vh] rounded mx-auto relative">
            <MapLayerChanger
                mapLayerChangeHandler={setMapLayer}
                setmapLayerURL={setMapUrl}

            />

            <ControlButtons clusterMarkers={clusterMarkers} setClusterMarkers={setClusterMarkers} />

            <MapContainer
                center={[14.727626960034861, 121.11634738290836]}
                zoom={18}
                style={{ width: "100%", height: "100%", borderRadius: "6px" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution={mapLayer === "googlemap" ? attributions[0] : attributions[1]}
                    url={mapUrl}
                />
                <FlyToMarker position={[14.726808391538036, 121.11664478670633]} />
                <FlyToMarker position={[14.638191398557218, 121.06305442802021]} />
                <Polyline positions={polylinePositionsMale} />
                <Polyline positions={polylinePositionsFemale} pathOptions={{ color: "red" }} />
            </MapContainer >

        </div>
    )
}
