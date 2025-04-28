import { useState } from "react";
import { GodotLink, Header } from "../assets/components/link";
// import { GoDotFill } from "react-icons/go";
// import ModalLink from "./RFID-Reader/ModalLink";
import RfidModal from "./RFID-Reader/RfidModal";
import ScannerSelection from "./ScannerSelection";

const Screening = () => {
    const [isRfidModalVisible, setIsRfidModalVisible] = useState(false);
    const [isScannerSelectionModalOpen, setIsScannerSelectionModalOpen] = useState(false)

    return (
        <div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="Areas" />
                <div className="mt-2 ml-8 space-y-2">
                    {/* <ModalLink
                        title="RFID Reader"
                        onClick={() => setIsRfidModalVisible(true)}
                        icon={<GoDotFill />}
                    /> */}
                    <GodotLink link="" title="Main Gate" openModalClick={() => setIsScannerSelectionModalOpen(true)} />
                    <GodotLink link="" title="Visitor Station" openModalClick={() => setIsScannerSelectionModalOpen(true)} />
                    <GodotLink link="" title="PDL Station" openModalClick={() => setIsScannerSelectionModalOpen(true)} />
                    {/* 
                    <GodotLink link="facial-recognition" title="Facial Recognition" />
                    <GodotLink link="iris-recognition" title="Iris Recognition" /> */}
                    {/* <GodotLink link="fingerprint-recognition" title="Fingerprint Recognition" /> */}
                </div>
            </div>

            <RfidModal open={isRfidModalVisible} onClose={() => setIsRfidModalVisible(false)} />
            <ScannerSelection open={isScannerSelectionModalOpen} onClose={() => setIsScannerSelectionModalOpen(false)} />
        </div>
    );
};

export default Screening;
