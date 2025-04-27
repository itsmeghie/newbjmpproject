import {IconType} from "react-icons";
import clsx from "clsx";

interface LinkContainerProps {
    icon: IconType;
    linkName?: string;
    isSidebarCollapsed: boolean;
}

const LinkContainer = ({icon: Icon, linkName, isSidebarCollapsed}: LinkContainerProps) => {
    return (
        <div className={clsx('flex items-center gap-3 p-3 py-1 mx-3 my-2', isSidebarCollapsed && 'justify-center my-3')}>
            <Icon className="transition-all" size={isSidebarCollapsed ? 20 : 16}/>
            {!isSidebarCollapsed && <p className="transition-all">{linkName}</p>}
        </div>
    )
}

export default LinkContainer;