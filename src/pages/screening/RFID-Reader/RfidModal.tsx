import { useEffect, useState } from "react";
import { Modal } from "antd";
import noimg from '../../../../public/noimg.png';
import qjmmd from '../../../assets/Logo/QCJMD.png';
import rfid from '../../../assets/rfid.png'
import close from '../../../assets/Icons/close.png'
import check from '../../../assets/Icons/check-mark.png'

interface RfidModalProps {
    open: boolean;
    onClose: () => void;
}

const RfidModal: React.FC<RfidModalProps> = ({ open, onClose }) => {
    const [dateTime, setDateTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            };
            setDateTime(now.toLocaleString("en-US", options));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Modal
            title="RFID Reader"
            open={open}
            onCancel={onClose}
            footer={null}
            width="60%"
            className="top-0 mt-14"
        >
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 p-5 md:p-10">
                {/* Info section */}
                <div className="flex justify-center items-center flex-col gap-5 text-center px-5 w-full md:w-1/2">
                    <img src={qjmmd} className="w-32 md:w-44" alt="QUEZON CITY JAIL LOGO" />
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="uppercase font-bold text-xl md:text-3xl">
                            Visitor Check In / Check Out
                        </h1>
                        <div className="text-sm md:text-base text-gray-600">{dateTime}</div>
                        <div className="mt-5">
                            <h1 className=" font-bold text-xl text-orange-500 md:text-2xl">
                                Hold your RFID Card near the Reader
                            </h1>
                        </div>
                        <img src={rfid} className="w-52" alt="RFID" />
                    </div>
                    <div className="flex justify-normal items-start">
                        Device ID: <select name="device" id="device">
                            <option value="1|RFID Reader | SNO: 12345678">1|RFID Reader | SNO: 12345678</option>
                        </select>
                    </div>
                </div>
                {/* Image section */}
                <div className="flex justify-center flex-col items-center gap-5 w-full md:w-1/2">
                    <div className="w-64 md:w-96 h-64 md:h-96 bg-gray-200 p-5 rounded-lg flex items-center justify-center">
                        <img src={noimg} alt="No Image" className="max-h-full max-w-full object-contain" />
                    </div>
                        <h1 className="text-2xl font-bold text-center">JUAN DELA CRUZ</h1>
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-2xl">STATUS:</h1>
                        <h1 className="font-bold text-2xl">ALLOWED VISIT</h1>
                        
                    </div>
                    <div className="flex gap-5">
                        <img src={check} className="w-14" alt="Check" />
                        <img src={close} className="w-14" alt="Close" />
                    </div>
                </div>

                
            </div>
        </Modal>
    );
};

export default RfidModal;
