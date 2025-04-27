import { GoDotFill } from "react-icons/go";
import { ReactNode } from "react";

interface ModalLinkProps {
    title: string;
    onClick: () => void;
    icon?: ReactNode;
}

const ModalLink: React.FC<ModalLinkProps> = ({ title, onClick, icon }) => {
    return (
        <div
            onClick={onClick}
            className="flex gap-2 hover:bg-gray-50 p-1.5 cursor-pointer"
        >
            <div className="text-[#52688D] bg-[#BFC8D7] text-xs rounded-sm p-1.5 h-fit">
                {icon || <GoDotFill />}
            </div>
            <p className="text-base font-medium">{title}</p>
        </div>
    );
};

export default ModalLink;
