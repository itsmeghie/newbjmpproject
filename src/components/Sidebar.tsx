import { ReactNode } from "react";
import clsx from 'clsx';
import logo from '@/assets/tambuli_alert_logo.png'

interface SidebarProps {
    children?: ReactNode;
    isSidebarCollapsed: boolean;
}

const Sidebar = ({ isSidebarCollapsed, children }: SidebarProps) => {
    return (
        <div className={clsx(`bg-grayWhtie py-4 flex-shrink-0`, isSidebarCollapsed ? 'w-[80px]' : 'w-[250px]', 'transition-all sticky top-0 h-screen overflow-auto', 'scrollbar-hide ')} >
            <img
                src={logo}
                className={clsx('bg-gray-100 rounded-full mb-4 transition-all', isSidebarCollapsed ? 'w-12 h-12 mx-auto' : 'w-36 h-36 ml-4')}
            />
            <div className="nav-container">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;