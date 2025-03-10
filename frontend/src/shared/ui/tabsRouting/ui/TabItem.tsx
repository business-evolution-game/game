import React from "react";
import { NavLink } from "react-router-dom";

interface TabItemProps {
    title: string;
    to: string; // URL to navigate to
}

export const TabItem: React.FC<TabItemProps> = ({title, to}) => {
    return (<li className="cursor-pointer px-4 py-2">
        <NavLink
            to={to}
            className={({isActive}) => isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}
        >
            {title}
        </NavLink>
    </li>);
};