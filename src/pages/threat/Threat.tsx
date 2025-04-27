import { NavLink } from "react-router-dom"

const Threat = () => {
    return (
        <div className="flex flex-wrap gap-5 text-gray-700">
            <div className="w-96 border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                <NavLink to={"watch-list"}>
                    <p className="ml-5 text-basee font-medium">Watchlist</p>
                </NavLink>
            </div>
            <div className="w-96 border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                <NavLink to={"threat-profile"}>
                    <p className="ml-5 text-basee font-medium">Threat Profile</p>
                </NavLink>
            </div>
            <h1></h1>
        </div>
    )
}

export default Threat
