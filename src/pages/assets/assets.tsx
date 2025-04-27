import { NavLink } from "react-router-dom";
import { GodotLink, Header } from "./components/link";

const Assets = () => {
    return (
        <div>
            <div className="space-y-5 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                        <Header title="Assets"/>
                        <div className="mt-2">
                            <div className="ml-8">
                                <GodotLink link="jail-facility" title="Jail Facility" />
                                <GodotLink link="annex" title="Annex" />
                                <GodotLink link="levels" title="Levels" />
                                <GodotLink link="dorms" title="Dorms" />
                                <GodotLink link="areas" title="Areas" />
                            </div>
                        </div>
                    </div>
                        <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                            <Header title="Jail"/>
                            <div className="mt-2">
                                <div className="ml-8">
                                    <GodotLink link="jail-type" title="Jail Type" />
                                    <GodotLink link="jail-categories" title="Jail Categories" />
                                    <GodotLink link="jail-security" title="Jail Security" />
                                </div>
                            </div>
                        </div>
                        <div className="w-full border h-fit shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                            <NavLink to={""}>
                                <p className="ml-5 text-basee font-medium">Jail Profile</p>
                            </NavLink>
                        </div>
                </div>
                <div className="border flex flex-col border-gray-200 p-5 w-full md:w-[32.2rem] shadow-sm hover:shadow-md rounded-md">
                    <Header title="Devices"/>
                    <div className="flex flex-wrap gap-2 md:gap-20">
                        <div className="ml-8">
                            <GodotLink link="devices" title="Devices" />
                            <GodotLink link="devices-type" title="Device Type" />
                            <GodotLink link="devices-usage" title="Device Usage" />
                            <GodotLink link="" title="Device Settings" />
                            <GodotLink link="" title="Device Profile" />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Assets
