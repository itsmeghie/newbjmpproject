import { Modal } from "antd";

interface RfidModalProps {
    open: boolean;
    onClose: () => void;
}

const RFIDReader: React.FC<RfidModalProps> = ({ open, onClose }) => {
    return (
        <Modal
            title="RFID Reader"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <p>This is where the RFID reader UI will appear.</p>
        </Modal>
    );
};

export default RFIDReader;
