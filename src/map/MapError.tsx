import { RefreshCcwIcon } from "lucide-react"

const MapError = () => {
    return (
        <div className="w-full h-[90vh] mt-5 flex justify-center items-center flex-col gap-5">
            Oops, something went wrong. Please refresh the page.
            <button
                className="bg-[#1976D2] text-white text-xs px-4 py-1.5 rounded flex gap-1.5 items-center justify-center"
                onClick={() => window.location.reload()}
            >
                <RefreshCcwIcon size={12} /> <span>Refresh</span>
            </button>
        </div>
    )
}

export default MapError