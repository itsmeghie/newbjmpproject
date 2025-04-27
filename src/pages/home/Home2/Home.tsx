import { NavLink } from "react-router-dom"

const Home2 = () => {
    return (
        <div className="flex flex-col text-sm justify-center p-5 gap-5">
            <div className="flex flex-col md:flex-row justify-center gap-5">
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"registration"}>
                            <p className="text-base font-medium px-2">Registration</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"administration"}>
                            <p className="text-base font-medium px-2">Administration</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"statistics-dashboard"}>
                            <p className="text-base font-medium px-2">Statistics Dashboard</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"alpha-list"}>
                            <p className="text-base font-medium px-2">Alpha List</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"log-monitoring"}>
                            <p className="text-base font-medium px-2">Log Monitoring</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"status-reports"}>
                            <p className="text-base font-medium px-2">Status Reports</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"scanners"}>
                            <p className="text-base font-medium px-2">Scanners</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"databases"}>
                            <p className="text-base font-medium px-2">Databases</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"cctv-monitor"}>
                            <p className="text-base font-medium px-2">CCTV Monitor</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"cctv-database"}>
                            <p className="text-base font-medium px-2">CCTV Database</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"location-access"}>
                            <p className="text-base font-medium px-2">Location Access</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to="/jvms/threats">
                            <p className="text-base font-medium px-2">Threats</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to="/jvms/incidents">
                            <p className="text-base font-medium px-2">Incidents</p>
                        </NavLink>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Personnel Management</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/personnels/personnel"}>
                            <p className="text-base font-medium px-2">Personnel</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/personnels/ranks"}>
                            <p className="text-base font-medium px-2">Ranks</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/personnels/positions"}>
                            <p className="text-base font-medium px-2">Positions</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/personnels/employment-type"}>
                            <p className="text-base font-medium px-2">Employment Types</p>
                        </NavLink>
                    </div>
                    <div className="mt-16">
                        <h1 className="font-bold text-base px-3.5">PDL Management</h1>
                        <div className="hover:bg-gray-100 rounded-md mt-2 p-1.5">
                            <NavLink to={"pdl-master-list"}>
                                <p className="text-base font-medium px-2">PDL Master List</p>
                            </NavLink>
                        </div>
                        <div className="hover:bg-gray-100 rounded-md p-1.5">
                            <NavLink to={"pdl-authorized-visitor"}>
                                <p className="text-base font-medium px-2">PDL Authorized Visitors</p>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Visitor Management</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"visitor-master-list"}>
                            <p className="text-base font-medium px-2">Visitor Master List</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"visitor-registration"}>
                            <p className="text-base font-medium px-2">Visitor Registration</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/visitors/visitor-type"}>
                            <p className="text-base font-medium px-2">Types of Visitors</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/visitors/visitor-req-docs"}>
                            <p className="text-base font-medium px-2">Visitor Requirements</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/visitors/visitor-relationship"}>
                            <p className="text-base font-medium px-2">Visitor Relationships</p>
                        </NavLink>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Asset Management</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/assets/jail-facility"}>
                            <p className="text-base font-medium px-2">Jail Facility</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/assets/annex"}>
                            <p className="text-base font-medium px-2">Annex</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/assets/levels"}>
                            <p className="text-base font-medium px-2">Levels</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/assets/dorms"}>
                            <p className="text-base font-medium px-2">Dorms</p>
                        </NavLink>
                    </div>
                    <div className="mt-16">
                        <h1 className="font-bold text-base px-3.5">Device Management</h1>
                        <hr className="w-full my-1 border-gray-200 mx-auto" />
                        <div className="hover:bg-gray-100 rounded-md mt-2 p-1.5">
                            <NavLink to={"/jvms/assets/devices"}>
                                <p className="text-base font-medium px-2">Devices</p>
                            </NavLink>
                        </div>
                        <div className="hover:bg-gray-100 rounded-md p-1.5">
                            <NavLink to={"/jvms/assets/devices-types"}>
                                <p className="text-base font-medium px-2">Device Types</p>
                            </NavLink>
                        </div>
                        <div className="hover:bg-gray-100 rounded-md p-1.5">
                            <NavLink to={"/jvms/assets/devices-usage"}>
                                <p className="text-base font-medium px-2">Device Usage</p>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-5">
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">User Management</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/users/user"}>
                            <p className="text-base font-medium px-2">Users</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/users/roles"}>
                            <p className="text-base font-medium px-2">Roles</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/users/role-levels"}>
                            <p className="text-base font-medium px-2">Role Levels</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"menu-items"}>
                            <p className="text-base font-medium px-2">Menu Items</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"access-matrix"}>
                            <p className="text-base font-medium px-2">Access Matrix</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"user-bridge"}>
                            <p className="text-base font-medium px-2">User Bridge</p>
                        </NavLink>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Support</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Settings</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"general-settings"}>
                            <p className="text-base font-medium px-2">General Settings</p>
                        </NavLink>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow border-gray-200 rounded-md p-4 gap-2">
                    <h1 className="font-bold text-base px-3.5">Maintenance</h1>
                    <hr className="w-full my-1 border-gray-200 mx-auto" />
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/maintenance/record-status"}>
                            <p className="text-base font-medium px-2">Record Status</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/maintenance/social-media-platforms"}>
                            <p className="text-base font-medium px-2">Social Media Platforms</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/maintenance/gender"}>
                            <p className="text-base font-medium px-2">Genders</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/maintenance/civil-status"}>
                            <p className="text-base font-medium px-2">Civil Status</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/maintenance/id-types"}>
                            <p className="text-base font-medium px-2">ID Types</p>
                        </NavLink>
                    </div>
                    <div className="hover:bg-gray-100 rounded-md p-1.5">
                        <NavLink to={"/jvms/personnels/affiliation-type"}>
                            <p className="text-base font-medium px-2">Affiliation Type</p>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home2
