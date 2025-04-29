import { Modal } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";

import qrScanImg from "@/assets/qr-code.png"
import rfidScanImg from "@/assets/rfid-colored.png"
import fingerScanImg from "@/assets/fingerprint-scan.png"
import irisqrScanImg from "@/assets/eye-scan.png"
import faceqrScanImg from "@/assets/face-scan.png"
import { NavLink } from "react-router-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    selectedArea: string | null;
};

const ScannerSelection = ({ open, onClose, selectedArea }: Props) => {
    const [selectedScanners, setSelectedScanners] = useState<string[]>([]);

    let scannerSelection = [];

    if (selectedArea === "PDL Station") {
        scannerSelection = [
            { scanner: "Fingerprint", icon: fingerScanImg },
            { scanner: "Face Recognition", icon: faceqrScanImg },
            { scanner: "Iris", icon: irisqrScanImg },
        ];
    } else {
        scannerSelection = [
            { scanner: "RFID", icon: rfidScanImg },
            { scanner: "QR", icon: qrScanImg },
            { scanner: "Fingerprint", icon: fingerScanImg },
            { scanner: "Face Recognition", icon: faceqrScanImg },
            { scanner: "Iris", icon: irisqrScanImg },
        ];
    }

    const toggleScanner = (scannerName: string) => {
        setSelectedScanners((prev) =>
            prev.includes(scannerName)
                ? prev.filter((name) => name !== scannerName)
                : [...prev, scannerName]
        );
    };

    return (
        <Modal
            width={"40%"}
            centered
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="w-full mt-4 flex flex-col items-center gap-6 p-2">
                <h1 className="w-full text-center text-2xl font-semibold">
                    Please select mode(s) of verification.
                </h1>

                <div className="w-[62%] gap-x-0 gap-y-2 grid grid-cols-2 place-items-center">
                    {scannerSelection.map((scanner, id) => {
                        const isSelected = selectedScanners.includes(scanner.scanner);

                        return (
                            <motion.div
                                key={id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: id * 0.1,
                                }}
                                onClick={() => toggleScanner(scanner.scanner)}
                                className={`
                  w-52 flex flex-col justify-center items-center 
                  gap-2 rounded-lg p-5 cursor-pointer border-2
                  ${isSelected ? 'border-green-600' : 'bg-gray-100 border-gray-200 text-gray-700'}
                  ${id === scannerSelection.length - 1 ? 'col-span-2' : ''}
                `}
                            >
                                <div className="w-20 flex items-center justify-center">
                                    <img
                                        src={scanner.icon}
                                        alt={`${scanner.scanner} icon`}
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                                <span className="text-xl font-semibold">{scanner.scanner}</span>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="w-full flex justify-center mt-4">
                    <NavLink
                        to="verify"
                        state={{
                            scanners: selectedScanners,
                            selectedArea,
                        }}
                        className={`px-4 py-2 rounded-md font-semibold transition
                            ${selectedScanners.length === 0
                                ? "bg-gray-400 cursor-not-allowed pointer-events-none opacity-30"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }
                        `}
                    >
                        Next
                    </NavLink>

                </div>

            </div>
        </Modal>
    );
};

export default ScannerSelection;
