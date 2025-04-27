import { NavLink } from "react-router-dom"
import { GodotLink, Header } from "../assets/components/link"

const Personnels = () => {
    return (
            <div className="space-y-5 text-gray-700">
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
                        <div className="h-fit w-full border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                            <NavLink to={"personnel"}>
                            <p className="ml-5 text-basee font-medium">Personnel</p>
                            </NavLink>
                        </div>
                        <div className="h-fit w-full border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                            <NavLink to={""}>
                            <p className="ml-5 text-basee font-medium">Personnel Profile</p>
                            </NavLink>
                        </div>
                        <div className="h-fit w-full border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                            <NavLink to={""}>
                            <p className="ml-5 text-basee font-medium">Dashboard</p>
                            </NavLink>
                        </div>
                        <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                            <GodotLink link="ranks" title="Ranks" />
                            <GodotLink link="positions" title="Positions" />
                            <GodotLink link="employment-type" title="Employment Type" />
                        </div>
                        <div className="w-full border shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                            <GodotLink link="" title="Ins / Outs" />
                        </div>
                       
                    </div>
                    <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                            <Header title="MAINTENANCE"/>
                            <div className="flex flex-wrap justify-between gap-5 mt-2">
                                <div className="w-96">
                                    <GodotLink link="affiliation-type" title="Affiliation Types" />
                                    <GodotLink link="gender" title="Gender" />
                                    <GodotLink link="civil-status" title="Civil Status" />
                                    <GodotLink link="record-status" title="Record Status" />
                                    <GodotLink link="/jvms/maintenance/religion" title="Religion" />
                                    <GodotLink link="/jvms/maintenance/occupation" title="Occupation" />
                                    <GodotLink link="/jvms/maintenance/educational-attainments" title="Educational Attainments" />
                                    
                                </div>
                                <div className="w-96">
                                    <GodotLink link="id-types" title="ID-Types" />
                                    <GodotLink link="social-media-platforms" title="Social Media Platforms" />
                                    <GodotLink link="/jvms/maintenance/prefixes" title="Prefixes" />
                                    <GodotLink link="/jvms/maintenance/suffixes" title="Suffixes" />
                                </div>
                                <div className="w-96">
                                    <GodotLink link="/jvms/maintenance/contact-types" title="Contact Types" />
                                    <GodotLink link="/jvms/maintenance/address-types" title="Address Types" />
                                    <GodotLink link="/jvms/maintenance/nationalities" title="Nationalities" />
                                    <GodotLink link="/jvms/maintenance/multi-birth-classification" title="Multi Birth Classication" />
                                </div>
                            </div>
                        </div>
                </div>
            </div>
    )
}

export default Personnels
