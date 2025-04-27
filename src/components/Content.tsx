import {ReactNode} from "react";

interface ContentProps {
    children?: ReactNode;
}

const Content = ({children}: ContentProps) => {
    return (
        <div className="w-[85%] transition-all mx-auto relative bg-red">
            {children}
        </div>
    );
};

export default Content;