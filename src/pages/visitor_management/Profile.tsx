import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";
import { getVisitorSpecific } from "@/lib/queries";
import { Visitor } from "@/lib/definitions";
import { Button } from "antd";

type VisitorCodeIdentificationProps = {
    onClose: () => void;
    idNumber: string; // Accept idNumber prop
};

const Profile = ({ onClose, idNumber }: VisitorCodeIdentificationProps) => {
    const token = useTokenStore().token;
    const [visitor, setVisitor] = useState<Visitor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisitorData = async () => {
            if (!token || !idNumber) return;
            setLoading(true);
            try {
                const data = await getVisitorSpecific(token, idNumber); 
                setVisitor(data);
            } catch (err) {
                console.error("Error fetching visitor data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitorData();
    }, [token, idNumber]);

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full max-w-xl space-y-3 py-3">
                <div className="w-full text-center py-1 bg-[#2F3237] text-[#FFEFEF]">
                    <h1 className="text-xs font-medium">QUEZON CITY JAIL MALE DORM</h1>
                    <h2 className="font-bold">VISITORS CODE IDENTIFICATION</h2>
                </div>
                
                {loading ? (
                    <p>Loading visitor information...</p>
                ) : visitor ? (
                    <div className="border border-[#EAEAEC] shadow-md rounded-xl p-2 w-full">
                        <p className="text-[#404958] text-sm">Visitor Basic Info</p>
                        <p>Surname: {visitor.person.last_name || "N/A"}</p>
                        <p>First Name: {visitor.person.first_name || "N/A"}</p>
                        <p>Middle Name: {visitor.person.middle_name || "N/A"}</p>
                        <p>Visitor No: {visitor.visitor_reg_no || "N/A"}</p>
                        {/* Add more fields as necessary */}
                    </div>
                ) : (
                    <p>No visitor information found.</p>
                )}

                <div className="flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;