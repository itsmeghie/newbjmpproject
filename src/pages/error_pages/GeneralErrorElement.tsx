import { NavLink } from "react-router-dom"

const GeneralErrorElement = () => {
    return (
        <div className="flex items-center justify-center w-full h-[100vh] flex-col gap-4">
            <p>This page is currently unavailable.</p>
            <NavLink
                to="/jvms/dashboard"
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
            >
                Home
            </NavLink>
        </div>
    )
}

export default GeneralErrorElement