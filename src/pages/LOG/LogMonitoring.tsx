import { GodotLink, Header } from "../assets/components/link"
 
const LogMonitoring = () => {
    return (
        <div>
            <div className="border border-gray-200 p-5 w-full md:max-w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="Visit Logs" />
                <div className="mt-2">
                    <div className="ml-8">
                        <GodotLink link="visit-logs" title="Visitor Logs" />
                        <GodotLink link="visitor_check-in-out_profiles" title="Visitor Check In-Out Profiles" />
                        <GodotLink link="pdl-visitors" title="PDL Visitors" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogMonitoring