import { useTokenStore } from "@/store/useTokenStore";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { VisitorRecord} from "@/lib/definitions";
import { getVisitorSpecific } from "@/lib/queries";
import { calculateAge } from "@/functions/calculateAge";

const VisitorCodeIdentification = () => {
    const token = useTokenStore().token;
    const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
    const [selectedVisitorId, setSelectedVisitorId] = useState<string>("");
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);

    const printRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const data = await getVisitorSpecific(token);
                setVisitors(data);
            } catch (err) {
                console.error("Error fetching visitor data:", err);
            }
        };
        fetchData();
    }, [token]);

    useEffect(() => {
        const visitor = visitors.find((v) => v.id.toString() === selectedVisitorId);
        setSelectedVisitor(visitor || null);
    }, [selectedVisitorId, visitors]);

    const Info = ({ title, info }: { title: string; info: string | null }) => (
        <div className="flex items-center">
            <label className="w-28 text-[10px] text-[#8E8E8E]">{title}</label>
            <p className="mt-1 w-full bg-[#F9F9F9] rounded-md px-2 py-[1px] text-sm">{info || ""}</p>
        </div>
    );

    const Box = ({ title, cell }: { title: string; cell: string }) => (
        <div className="text-center w-full">
            <div className="w-full border-2 border-[#2F3237] rounded-lg h-8 flex items-center text-xs justify-center">
                {cell || ""}
            </div>
            <p className="text-[#27272] text-xs">{title}</p>
        </div>
    );

    const downloadPDF = async () => {
        if (printRef.current) {
            const canvas = await html2canvas(printRef.current, {
                useCORS: true,
                backgroundColor: null,
                scale: 2,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save("visitor_profile.pdf");
        }
    };

    return (
        <div className="p-4">
            {/* Visitor Selector */}
            <div className="flex items-center gap-2 mb-4">
                <label htmlFor="visitor" className="text-sm font-semibold">Select Visitor:</label>
                <select
                    id="visitor"
                    value={selectedVisitorId}
                    onChange={(e) => setSelectedVisitorId(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Choose Visitor</option>
                    {visitors.map((visitor) => (
                        <option key={visitor.id} value={visitor.id}>
                            {visitor.person?.first_name} {visitor.person?.last_name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={downloadPDF}
                    className="p-2 bg-blue-500 text-white rounded"
                    disabled={!selectedVisitor}
                >
                    Download PDF
                </button>
            </div>
                <div ref={printRef} className="flex flex-col items-center p-4 min-h-screen">
                <div className="bg-white shadow-lg w-full max-w-xl space-y-3 py-3">
                    <div className="w-full text-center py-1 bg-[#2F3237] text-[#FFEFEF]">
                        <h1 className="text-xs font-medium">QUEZON CITY JAIL MALE DORM</h1>
                        <h2 className="font-bold">VISITORS CODE IDENTIFICATION</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-3 px-3">
                        {/* Full Image */}
                        <div className="space-y-3">
                            <div className="border border-[#EAEAEC] rounded-xl p-2 flex shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                                <div className="bg-[#C4C4C4] w-full h-56 rounded-xl">
                                    {selectedVisitor?.person?.media || "No image available"}
                                </div>
                            </div>
    
                            {/* Cell Assigned */}
                            <div className="border shadow-md shadow-[#8E8E8E]/20 border-[#EAEAEC] rounded-xl py-2 px-3">
                                <p className="text-[#404958] text-sm">Cell Assigned</p>
                                <div className="flex w-full mt-1 md:flex-row gap-5">
                                    <Box title="Level" cell={"N/A"} />
                                    <Box title="Annex" cell={"N/A"} />
                                    <Box title="Dorm" cell={"N/A"} />
                                </div>
                            </div>
    
                            {/* Visitor History */}
                            <div className="border shadow-md shadow-[#8E8E8E]/20 border-[#EAEAEC] rounded-xl py-2 px-3">
                                <p className="text-[#404958] text-sm">Visitor History</p>
                                <div className="flex">
                                    <div className="w-full">
                                        <div className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">
                                            Date
                                        </div>
                                        <div className="rounded-l-lg border-l border-t border-b border-[#DCDCDC] flex flex-col gap-2 text-[9px] font-light p-1 mt-2">
                                            0
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">
                                            Duration
                                        </div>
                                        <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-[9px] font-light p-1 mt-2">
                                            <div className=" text-center rounded-full bg-[#D8D8D8]">
                                        0
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">
                                            Login
                                        </div>
                                        <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-[9px] font-light p-1 mt-2">
                                            <div className=" text-center">
                                        0
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="bg-[#2F3237] rounded-r-lg text-white py-1 px-2 font-semibold text-xs">
                                            Logout
                                        </div>
                                        <div className="border-b border-r rounded-r-lg border-t border-[#DCDCDC] flex flex-col gap-2 text-[9px] font-light p-1 mt-2">
                                            <div className=" text-center">
                                        0
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                        {/* Visitor's Basic Info Section */}
                            <div className="space-y-3">
                                <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                    <p className="text-[#404958] text-sm">Visitors/Dalaw Basic Info</p>
                                    <div className="grid grid-cols-1 gap-[2px]">
                                        <Info title="Type of Visitor:" info={selectedVisitor?.visitor_type || "N/A"} />
                                        <Info title="Surname:" info={selectedVisitor?.person?.last_name || "N/A"}/>
                                        <Info title="First Name:" info={selectedVisitor?.person?.first_name || "N/A"}/>
                                        <Info title="Middle Name:" info={selectedVisitor?.person?.middle_name || "N/A"} />
                                        <Info title="Address:" info={selectedVisitor?.person?.addresses?.[0]
                                            ? `${selectedVisitor?.person.addresses[0].street}, ${selectedVisitor?.person.addresses[0].barangay}, ${selectedVisitor?.person.addresses[0].municipality}, ${selectedVisitor?.person.addresses[0].province}, ${selectedVisitor?.person.addresses[0].region}, ${selectedVisitor?.person.addresses[0].postal_code}`
                                            : null
                                        } />
                                        <Info title="Gender:" info={selectedVisitor?.person?.gender?.gender_option || "N/A"} />
                                        <Info title="Age:" info={selectedVisitor?.person?.date_of_birth ? String(calculateAge(selectedVisitor?.person.date_of_birth)) : null} />
                                        <Info title="Birthday:" info={selectedVisitor?.person?.date_of_birth || "N/A"} />
                                        <div className="flex items-center">
                                            <label className="w-48 text-[10px] text-[#8E8E8E]">Relationship to PDL:</label>
                                            <p className="mt-1 block w-full bg-[#F9F9F9] rounded-md text-xs px-2 py-[1px]">
                                            {selectedVisitor?.pdl || "No PDL relationship"}
                                            </p>
                                        </div>
                                        <Info title="Requirements:" info={'N/A'} />
                                    </div>
                                </div> 
                                {/*PDL Basic Info */}
                                <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                    <p className="text-[#404958] text-sm">PDL Basic Info</p>
                                    <div className="grid grid-cols-1 gap-[2px]">
                                        <Info title="Surname:" info={ 'N/A'} />
                                        <Info title="First Name:" info={'N/A'} />
                                        <Info title="Middle Name:" info={'N/A'} />
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="mx-3 border border-[#EAEAEC] rounded-xl p-2 flex flex-col space-y-2 shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                        <div className="w-full flex flex-wrap gap-2 text-center">
                            {/* Waiver */}
                            <div className="space-y-2">
                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                    Waiver
                                </div>
                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Waiver 1</div>
                                    <div className="w-[8.8rem] md:w-[7.83rem] rounded-b-lg bg-[#7E7E7E] flex-grow"></div>
                                </div>
                            </div>
                            {/* REQUIREMENTS */}
                            <div className="space-y-2">
                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                    Requirement
                                </div>
                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Cohabitation</div>
                                    <div className="w-[8.8rem] md:w-[7.83rem] rounded-b-lg bg-[#7E7E7E] flex-grow"></div>
                                </div>
                            </div>
                            {/* IDENTIFICATION MARKINGS */}
                            <div className="space-y-2">
                                <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                    Identification Marking
                                </div>
                                <div className="flex flex-row gap-2 w-full">
                                    <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                        <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Thumbmark</div>
                                        <div className="w-[8.8rem] md:w-[7.83rem] rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.biometrics}</div>
                                    </div>
    
                                    <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                        <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Signature</div>
                                        <div className="w-[8.8rem] md:w-[7.83rem] rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.media}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className="w-full space-y-2 text-center">
                        <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                        Identification Pictures
                        </div>
                        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Close Up Front</div>
                                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.media}</div>
                            </div>
                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Full Body Front</div>
                                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.media}</div>
                            </div>
                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Left Side</div>
                                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.media}</div>
                            </div>
                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Side</div>
                                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">{selectedVisitor?.person?.media}</div>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default VisitorCodeIdentification;
