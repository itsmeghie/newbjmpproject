import { GodotLink, Header } from "../assets/components/link"

const Database = () => {
    return (
        <div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-5">
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <Header title="Datebase"/>
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/personnels"
                        title="Personnel"/>
                        <GodotLink
                        link="/jvms/pdls"
                        title="PDLs"/>
                        <GodotLink
                        link="/jvms/visitors"
                        title="Visitors"/>
                        <GodotLink
                        link="/jvms/assets/jail-facility"
                        title="Jail Facility"/>
                        <GodotLink
                        link="/jvms/threats"
                        title="Threats"/>
                        <GodotLink
                        link="/jvms/incidents"
                        title="Incidents"/>
                        <GodotLink
                        link="/jvms/assets/devices"
                        title="Devices"/>
                        <GodotLink
                        link="/jvms/users"
                        title="Users"/>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <Header title="Maintenance"/>
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/maintenance/record-status"
                        title="Record Status"/>
                        <GodotLink
                        link="/jvms/maintenance/social-media-platforms"
                        title="Social Media Platforms"/>
                        <GodotLink
                        link="/jvms/maintenance/gender"
                        title="Genders"/>
                        <GodotLink
                        link="/jvms/maintenance/civil-status"
                        title="Civil Status"/>
                        <GodotLink
                        link="/jvms/maintenance/id-types"
                        title="ID Types"/>
                        <GodotLink
                        link="/jvms/maintenance/backup"
                        title="Backup"/>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <Header title="Devices"/>
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/assets/devices-type"
                        title="Device Types"/>
                        <GodotLink
                        link="/jvms/assets/devices-usage"
                        title="Device Usage"/>
                    </div>
                </div>

                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <Header title="Jail Information"/>
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/assets/jail-type"
                        title="Jail Types"/>
                        <GodotLink
                        link="/jvms/assets/jail-categories"
                        title="Jail Categories"/>
                        <GodotLink
                        link="/jvms/assets/jail-security"
                        title="Jail Security Levels"/>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/maintenance/ethnicities"
                        title="Ethnicities"/>
                        <GodotLink
                        link="/jvms/pdls/skills"
                        title="Skills"/>
                        <GodotLink
                        link="/jvms/pdls/talents"
                        title="Talents"/>
                        <GodotLink
                        link="/jvms/database/interest"
                        title="Interests"/>
                        <GodotLink
                        link="/jvms/database/looks"
                        title="Looks"/>
                        <GodotLink
                        link=""
                        title="Relationships"/>
                    </div>
                </div>
                <div className="min-w-60 max-w-auto flex-1 basis-[calc(25%-1.25rem)] border shadow-sm border-gray-200 rounded-md p-4 gap-2">
                    <div className="mt-2">
                        <GodotLink
                        link="/jvms/database/judicial-courts"
                        title="Judicial Courts"/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Database
