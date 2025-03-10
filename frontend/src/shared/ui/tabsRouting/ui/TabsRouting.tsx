import React from 'react';
import {Route, Routes} from "react-router-dom";
import {TabItem} from "./TabItem";


interface TabsRoutingProps {
    tabs: { title: string; to: string, element: JSX.Element }[]; // Array of tab titles and routes
}

const TabsRouting: React.FC<TabsRoutingProps> = ({tabs}) => {
    return (<>
            <div className="flex space-x-4">
                {tabs.map((tab, index) => (<TabItem key={index} title={tab.title} to={tab.to}/>))}
            </div>
            <Routes>
                {tabs.map(tab => <Route key={tab.to} path={tab.to} element={tab.element}/>)}
            </Routes>
        </>);
};
export default TabsRouting;