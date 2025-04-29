import { useState } from "react";
import { GodotLink, Header } from "../assets/components/link";
import RfidModal from "./RFID-Reader/RfidModal";
import ScannerSelection from "./ScannerSelection";

const Screening = () => {
    const [isRfidModalVisible, setIsRfidModalVisible] = useState(false);
    const [isScannerSelectionModalOpen, setIsScannerSelectionModalOpen] = useState(false)
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    return (
        <div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="Areas" />
                <div className="mt-2 ml-8 space-y-2">
                    <GodotLink
                        link=""
                        title="Main Gate"
                        openModalClick={() => {
                            setSelectedArea("Main Gate");
                            setIsScannerSelectionModalOpen(true);
                        }}
                    />
                    <GodotLink
                        link=""
                        title="Visitor Station"
                        openModalClick={() => {
                            setSelectedArea("Visitor Station");
                            setIsScannerSelectionModalOpen(true);
                        }}
                    />
                    <GodotLink
                        link=""
                        title="PDL Station"
                        openModalClick={() => {
                            setSelectedArea("PDL Station");
                            setIsScannerSelectionModalOpen(true);
                        }}
                    />

                </div>
            </div>

            <RfidModal open={isRfidModalVisible} onClose={() => setIsRfidModalVisible(false)} />
            <ScannerSelection
                open={isScannerSelectionModalOpen}
                onClose={() => setIsScannerSelectionModalOpen(false)}
                selectedArea={selectedArea}
            />
        </div>
    );
};

export default Screening;
