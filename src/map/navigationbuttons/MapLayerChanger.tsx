import clsx from "clsx"
import { useState } from "react"

interface MapLayerChangerProps {
    mapLayerChangeHandler: (layer: string) => void
    setmapLayerURL: (layer: string) => void
}

const MapLayerChanger = ({ mapLayerChangeHandler, setmapLayerURL }: MapLayerChangerProps) => {
    const [activeButton, setActiveButton] = useState("satellite")

    return (
        <div
            className="bg-gray-300 absolute top-5 left-1/2 transform -translate-x-1/2 z-[500] flex gap-3 p-2 opacity-80 rounded-lg"
        >
            <button
                onClick={() => {
                    setmapLayerURL("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")
                    mapLayerChangeHandler("satellite")
                    setActiveButton("satellite")
                }}
                className={clsx('p-1 rounded-lg w-28 text-sm font-bold', activeButton === "satellite" ? 'bg-white' : '')}
            >
                Sattelite
            </button>
            <button
                onClick={() => {
                    setmapLayerURL("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
                    mapLayerChangeHandler("googlemap")
                    setActiveButton("googlemap")
                }}
                className={clsx('p-1 rounded-lg w-28 text-sm font-bold', activeButton === "googlemap" ? 'bg-white' : '')}
            >
                Google Map
            </button>
        </div>
    )
}

export default MapLayerChanger