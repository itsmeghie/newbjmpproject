import { GodotLink, Header } from "../assets/components/link"

const Maintenance = () => {
    return (
        <div>
            <div>
                <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                    <Header title="Maintenance"/>
                    <div className="mt-2 ml-8">
                        <GodotLink link="record-status" title="Record Status" />
                        <GodotLink link="social-media-platforms" title="Social Media Platform" />
                        <GodotLink link="gender" title="Genders" />
                        <GodotLink link="religion" title="Religion" />
                        <GodotLink link="ethnicities" title="Ethnicities" />

                        <GodotLink link="civil-status" title="Civil Status" />
                        <GodotLink link="id-types" title="ID Types" />
                        <GodotLink link="" title="Backup" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Maintenance
