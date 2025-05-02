import { GodotLink, Header } from "../assets/components/link"

const Registration = () => {
    return (
        <div className="space-y-5 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                    <Header title="Visitors" />
                    <div className="mt-2">
                        <div className="ml-8">
                            <GodotLink link="/jvms/visitors/visitor-registration" title="PDL Visitors" />
                            <GodotLink link="/jvms/registration/personnel-registration" title="BJMP Personnel" />
                            <GodotLink link="/jvms/visitors/service-provider" title="3rd Party Providers" />
                            <GodotLink link="/jvms/visitors/non-pdl-visitor" title="Other Non-PDL Visitors" />
                        </div>
                    </div>
                </div>
                <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                    <Header title="PDL" />
                    <div className="mt-2">
                        <div className="ml-8">
                            <GodotLink link="pdl-registration" title="PDL Registration" />
                        </div>
                    </div>
                </div>
                <div className="w-full border h-fit shadow-sm hover:shadow-md border-gray-200 p-5 rounded-md">
                    <Header title="Personnel" />
                    <div className="mt-2">
                        <div className="ml-8">
                            <GodotLink link="personnel-registration" title="Personnel Registration" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration
