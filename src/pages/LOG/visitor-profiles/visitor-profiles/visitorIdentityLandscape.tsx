/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateAge } from "@/functions/calculateAge"


const IdentificationLandscape = ({ visitor }: { visitor: any }) => {

    const Info = ({ title, info }: { title: string, info: string | null }) => {
        return (
            <div className="flex items-center">
                <label className="w-56 text-[#8E8E8E]">{title}</label>
                <p className="mt-1 w-full bg-[#F9F9F9] rounded-md h-9">{info}</p>
            </div>
        )
    }

    const Title = ({ title }: { title: string }) => {
        return (
            <div className="rounded-lg h-fit w-full bg-[#2F3237] text-white py-2 px-2 font-semibold">
                {title}
            </div>
        )
    }

    const Cards = ({ title, img }: { title: string, img?: string }) => {
        return (
            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-[11.05rem] overflow-hidden">
                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">
                    {title}
                </div>
                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">
                    {img && (
                        <img
                            src={img}
                            alt="Requirement Image"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>
        );
    };


    let profileImg = "";

    if (visitor?.person?.media) {
        const frontPicture = visitor?.person?.media?.find(
            (media: { picture_view: string; }) => media?.picture_view === "Front"
        )?.media_binary;

        if (frontPicture) {
            profileImg = `data:image/jpeg;base64,${frontPicture}`;
        }
    }

    const relationshipToPdl = visitor?.pdls?.map(pdl => pdl?.relationship_to_pdl)
    const requirements = visitor?.person?.media_requirements?.map(requirement => requirement?.name)

    const requirementImg = visitor?.person?.media_requirements?.find(
        requirement => requirement?.name?.toLowerCase?.() === "waiver"
    )?.direct_image;

    const cohabitationRequirementImg = visitor?.person?.media_requirements?.find(
        requirement => requirement?.name?.toLowerCase?.() === "waiver 2"
    )?.direct_image;

    const leftViewImg = visitor?.person?.media?.find(
        media => media?.media_description?.toLowerCase?.() === "left-side view picture"
    )?.media_binary;

    const rightViewImg = visitor?.person?.media?.find(
        media => media?.media_description?.toLowerCase?.() === "right-side view picture"
    )?.media_binary;

    const fullBodyViewImg = visitor?.person?.media?.find(
        media => media?.media_description?.toLowerCase?.() === "full-body front picture"
    )?.media_binary;

    return (
        <div>
            <div className={`w-full min-h-screen flex flex-col space-y-3`}>
                <div className="w-full text-center py-5 bg-[#2F3237] text-[#FFEFEF]">
                    <h1 className="font-medium font-lg">QUEZON CITY JAIL MALE DORM</h1>
                    <h2 className="font-bold text-3xl">VISITORS CODE IDENTIFICATION</h2>
                </div>
                <div className="bg-white py-2 md:py-8 px-2 md:px-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="border border-[#EAEAEC] rounded-xl p-4 flex shadow-md shadow-[#8E8E8E]/20 bg-white">
                            <div className="bg-[#C4C4C4] w-full h-64 md:min-h-96 rounded-xl overflow-hidden object-cover">
                                {
                                    profileImg && (<img src={profileImg} alt="Profile Picture" className="w-full h-full object-cover" />)
                                }
                            </div>
                        </div>
                        {/* Visitor History */}
                        <div className="border shadow-md space-y-5 shadow-[#8E8E8E]/20 border-[#EAEAEC] rounded-xl p-5">
                            <p className="text-[#404958] font-semibold">Visitor History</p>
                            <div className="flex">
                                <div className="w-full">
                                    <div className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Date
                                    </div>
                                    <div className="rounded-l-lg border-l border-t border-b border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        0
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Duration
                                    </div>
                                    <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className=" text-center rounded-full bg-[#D8D8D8]">
                                            0
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Login
                                    </div>
                                    <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className=" text-center">
                                            0
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] rounded-r-lg text-white py-1 px-2 font-semibold">
                                        Logout
                                    </div>
                                    <div className="border-b border-r rounded-r-lg border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className="text-center">
                                            0
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full space-y-4">
                        {/* Visitor's Basic Info Section */}
                        <div className="space-y-4">
                            <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-4 w-full">
                                <p className="text-[#404958] font-semibold">Visitors/Dalaw Basic Info</p>
                                <div className="grid grid-cols-1 mt-2 gap-4">
                                    <Info title="Type of Visitor:" info={visitor?.visitor_type ?? ""} />
                                    <Info title="Surname:" info={visitor?.person?.last_name ?? ""} />
                                    <Info title="First Name:" info={visitor?.person?.first_name ?? ""} />
                                    <Info title="Middle Name:" info={visitor?.person?.middle_name ?? ""} />
                                    <Info
                                        title="Address:"
                                        info={`
                                        ${visitor?.person?.addresses[0]?.bldg_subdivision ?? ""} 
                                         ${visitor?.person?.addresses[0]?.street_number ?? ""} 
                                          ${visitor?.person?.addresses[0]?.street ?? ""} 
                                           ${visitor?.person?.addresses[0]?.bldg_subdivision ?? ""} 
                                            ${visitor?.person?.addresses[0]?.barangay ?? ""} 
                                             ${visitor?.person?.addresses[0]?.municipality ?? ""} 
                                              ${visitor?.person?.addresses[0]?.province ?? ""} 
                                               ${visitor?.person?.addresses[0]?.country ?? ""} 
                                               ${visitor?.person?.addresses[0]?.postal_code ?? ""}
                                        `}
                                    />
                                    <Info title="Gender:" info={visitor?.person?.gender?.gender_option} />
                                    <Info title="Age:" info={String(calculateAge(visitor?.person?.date_of_birth))} />
                                    <Info title="Birthday:" info={visitor?.person?.date_of_birth} />
                                    <Info title="Relationship to PDL:" info={relationshipToPdl.join(", ")} />
                                    <Info title="Requirements:" info={requirements.join(", ")} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="border border-[#EAEAEC] rounded-xl p-4 md:p-2 space-y-2 shadow-md shadow-[#8E8E8E]/20  bg-white">
                        <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Title title="Waiver" />
                                <Cards title="Waiver 1" img={`data:image/jpeg;base64,${requirementImg}`} />
                            </div>
                            <div className="space-y-2">
                                <Title title="Requirement" />
                                <Cards title="Cohabitation" img={`data:image/jpeg;base64,${cohabitationRequirementImg}`} />
                            </div>
                        </div>
                        <div className="space-y-2 text-center">
                            <Title title="Identification Markings" />
                            <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                <Cards title="Right Thumbmark" img="" />
                                <Cards title="Signature" img="" />
                            </div>
                        </div>
                        <div className="space-y-2 text-center">
                            <Title title="Identification Pictures" />
                            <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                <Cards title="Close Up Front" img={profileImg} />
                                <Cards title="Full Body Front" img={`data:image/jpeg;base64,${fullBodyViewImg}`} />
                            </div>
                            <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                <Cards title="Left Side" img={`data:image/jpeg;base64,${leftViewImg}`} />
                                <Cards title="Right Side" img={`data:image/jpeg;base64,${rightViewImg}`} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default IdentificationLandscape
