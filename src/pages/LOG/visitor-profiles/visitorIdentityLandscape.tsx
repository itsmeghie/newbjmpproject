/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateAge } from "@/functions/calculateAge"

//All errors are linter errors, please ignore. Me too lazy write long type huhu

const IdentificationLandscape = ({ visitor }: { visitor: any }) => {

    const Info = ({ title, info }: { title: string, info: string | null }) => {
        return (
            <div className="flex items-center">
                <label className="w-56 text-[#8E8E8E]">{title}</label>
                <p className="mt-1 w-full bg-[#F9F9F9] rounded-md h-9 flex items-center pl-3">{info}</p>
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
        requirement => requirement?.name?.toLowerCase?.() === "cohabitation"
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

    const signatureImg = visitor?.person?.media?.find(
        media => media?.media_description?.toLowerCase?.() === "signature picture"
    )?.media_binary;

    const rightThumbImg = visitor?.person?.biometrics?.find(
        media => media?.position?.toLowerCase?.() === "finger_right_thumb"
    )?.data

    const address = visitor?.person?.addresses?.[0];

    const addressParts = [
        address?.bldg_subdivision,
        address?.street_number,
        address?.street,
        address?.barangay,
        address?.municipality,
        address?.province,
        address?.country,
        address?.postal_code
    ];

    const hasAnyAddress = addressParts.some(Boolean);

    console.log("Visitor Info", visitor)

    return (
        <div>
            <div className={`w-full min-h-screen flex flex-col space-y-3`}>
                <div className="w-full text-center py-5 bg-[#2F3237] text-[#FFEFEF]">
                    <h1 className="font-medium font-lg">QUEZON CITY JAIL MALE DORM</h1>
                    <h2 className="font-bold text-3xl">VISITORS CODE IDENTIFICATION</h2>
                </div>
                <div className="bg-white py-2 md:py-8 px-2 md:px-10 w-full flex gap-4">
                    <section className="flex-[2] flex flex-col gap-4">

                        <div className="w-full flex gap-4">
                            <div className="grid grid-cols-1 gap-4 flex-1">
                                <div className="border rounded-xl p-4 flex flex-col gap-4 shadow-md shadow-[#8E8E8E]/20 bh-white h-fit">
                                    <div className="bg-[#C4C4C4] w-full h-64 md:min-h-96 rounded-xl overflow-hidden object-cover">
                                        {
                                            profileImg && (<img src={profileImg} alt="Profile Picture" className="w-full h-full object-cover" />)
                                        }
                                    </div>
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
                            </div>
                            <div className="w-full space-y-2 flex-1">
                                {/* Visitor's Basic Info Section */}
                                <div className="space-y-4">
                                    <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-4 w-full">
                                        <p className="text-[#404958] font-semibold">Visitors/Dalaw Basic Info</p>
                                        <div className="grid grid-cols-1 mt-2 gap-3.5">
                                            <Info title="Type of Visitor:" info={visitor?.visitor_type || "N/A"} />
                                            <Info title="Surname:" info={visitor?.person?.last_name || "N/A"} />
                                            <Info title="First Name:" info={visitor?.person?.first_name || "N/A"} />
                                            <Info title="Middle Name:" info={visitor?.person?.middle_name || "N/A"} />
                                            <Info
                                                title="Address:"
                                                info={hasAnyAddress
                                                    ? addressParts.filter(Boolean).join(' ')
                                                    : 'N/A'}
                                            />
                                            <Info title="Gender:" info={visitor?.person?.gender?.gender_option || "N/A"} />
                                            <Info title="Age:" info={String(calculateAge(visitor?.person?.date_of_birth)) || "N/A"} />
                                            <Info title="Birthday:" info={visitor?.person?.date_of_birth} />
                                            <Info title="Relationship to PDL:" info={relationshipToPdl.join(", ") || "N/A"} />
                                            <Info title="Requirements:" info={requirements.join(", ") || "N/A"} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="w-full border shadow-md shadow-[#8E8E8E]/20 border-[#EAEAEC] rounded-xl p-5 flex flex-col gap-4 h-full">
                            <div className="w-full flex">
                                <p className="text-[#404958] font-semibold flex-1 text-center">PDL Basic Info</p>
                                <p className="text-[#404958] font-semibold flex-1 text-center">Cell Assigned</p>
                            </div>
                            <div className="flex">
                                <div className="w-full">
                                    <div className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        PDL No.
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div
                                            key={pdl?.pdl?.id}
                                            className="rounded-l-lg border-l border-t border-b border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2"
                                        >
                                            {pdl?.pdl?.id || "N/A"}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        Surname
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.person?.last_name || "N/A"}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        FirstName
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.person?.first_name || "N/A"}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        Middle Name
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.person?.middle_name || "N/A"}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        Level
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.cell?.building || "N/A"}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-center">
                                        Annex
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.cell?.floor}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] rounded-r-lg text-white py-1 px-2 font-semibold text-center">
                                        Dorm
                                    </div>
                                    {visitor?.pdls?.map(pdl => (
                                        <div key={pdl?.pdl?.id} className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                            {pdl?.pdl?.cell?.cell_name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="border border-[#EAEAEC] rounded-xl p-4 md:p-2 space-y-2 shadow-md shadow-[#8E8E8E]/20 bg-white flex-1">
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
                                <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-[11.05rem] overflow-hidden">
                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">
                                        Right Thumbmark
                                    </div>
                                    <div className="w-full flex items-center justify-center rounded-b-lg bg-[#7E7E7E] flex-grow">
                                        {rightThumbImg && (
                                            <img
                                                src={`data:image/jpeg;base64,${rightThumbImg}`}
                                                className="w-[55%] h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                                <Cards title="Signature" img={`data:image/jpeg;base64,${signatureImg}`} />
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
