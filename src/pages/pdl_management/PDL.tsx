import { GodotLink, Header } from "../assets/components/link"

const PDL = () => {
    return (
        <div className="flex flex-wrap gap-5">
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="PDLs Information"/>
                <div className="mt-2 ml-8">
                    <GodotLink link="pdl" title="PDL" />
                    <GodotLink link="" title="PDL Profile" />
                    <GodotLink link="/jvms/registration/pdl-registration" title="PDL Registration" />
                    <GodotLink link="" title="Authorized Visitor" />
                    <GodotLink link="gang-affiliation" title="Gang Affiliations" />
                </div>
            </div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <div className="mt-2 ml-8">
                    <GodotLink link="police-precinct" title="Police Precincts" />
                    <GodotLink link="court-branches" title="Courts/Branches" />
                    <GodotLink link="offenses" title="Offenses" />
                    <GodotLink link="law" title="Laws" />
                    <GodotLink link="crime-category" title="Crime Categories" />
                </div>
            </div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="Maintenance"/>
                <div className="mt-2 ml-8">
                    <GodotLink link="/jvms/maintenance/ethnicities" title="Ethnicities" />
                    <GodotLink link="skills" title="Skills" />
                    <GodotLink link="talents" title="Talents" />
                    <GodotLink link="/jvms/database/interest" title="Interests" />
                    <GodotLink link="/jvms/database/looks" title="Looks" />
                    <GodotLink link="relationship" title="Relationships" />
                </div>
            </div>
        </div>
    )
}

export default PDL
