import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HiHome, HiOutlineUsers, HiWrenchScrewdriver} from "react-icons/hi2";
import LinkContainer from "./LinkContainer";
import { FaRegFileAlt } from "react-icons/fa";
import { LiaToolsSolid } from "react-icons/lia";
import { VscSettings } from "react-icons/vsc";
import { FaWrench } from "react-icons/fa6";
import { IoMapOutline } from "react-icons/io5";
import { GoGitMerge } from "react-icons/go";
import { GrGroup } from "react-icons/gr";
import { CiFileOn } from "react-icons/ci";
import { LuFolderCog } from "react-icons/lu";
import { MdOutlinePersonSearch} from "react-icons/md";
import { PiWarningOctagon, PiWarningLight, PiUserCircleLight  } from "react-icons/pi";

interface NavbarProps {
    isSidebarCollapsed: boolean;
}

const Navbar = ({ isSidebarCollapsed }: NavbarProps) => {

    return (
        <>
            <ul className="flex flex-col">
                <p className="text-black ml-5 text-base font-bold">MODULES</p>
                <li>
                    <NavLink to={"home"}>
                        <LinkContainer icon={HiHome} isSidebarCollapsed={isSidebarCollapsed} linkName={"Home"} />
                    </NavLink>

                </li>
                <li>
                    <NavLink to={"dashboard"}>
                        <LinkContainer icon={RxDashboard} isSidebarCollapsed={isSidebarCollapsed} linkName={"Dashboard"} />
                    </NavLink>

                </li>
                <li>
                    <NavLink to={"map"}>
                        <LinkContainer icon={IoMapOutline} isSidebarCollapsed={isSidebarCollapsed} linkName={"Map"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"personnels"}>
                        <LinkContainer icon={HiOutlineUsers} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Personnels"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"visitors"}>
                        <LinkContainer icon={GrGroup} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Visitors"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"pdls"}>
                        <LinkContainer icon={CiFileOn} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"PDLs"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"assets"}>
                        <LinkContainer icon={LuFolderCog} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Assets"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"screening"}>
                        <LinkContainer icon={MdOutlinePersonSearch} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Screening"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"threats"}>
                        <LinkContainer icon={PiWarningLight} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Threats"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"incidents"}>
                        <LinkContainer icon={PiWarningOctagon} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Incidents"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"reports"}>
                        <LinkContainer icon={FaRegFileAlt} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Reports"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"supports"}>
                        <LinkContainer icon={FaWrench} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Supports"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"settings"}>
                        <LinkContainer icon={VscSettings} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Settings"} />
                    </NavLink>
                </li>
                <hr className="w-[85%] border-gray-400 mx-auto my-5" />
                <p className="text-black ml-5 text-base font-bold">ADMINISTRATION</p>
                <li>
                    <NavLink to={"maintenance"}>
                        <LinkContainer icon={HiWrenchScrewdriver} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Maintenance"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"integrations"}>
                        <LinkContainer icon={GoGitMerge} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Integrations"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"tools"}>
                        <LinkContainer icon={LiaToolsSolid} isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Tools"} />
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"users"}>
                        <LinkContainer icon={PiUserCircleLight } isSidebarCollapsed={isSidebarCollapsed}
                            linkName={"Users"} />
                    </NavLink>
                </li>
            </ul>
        </>
    );
};

export default Navbar;