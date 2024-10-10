import React, {Suspense} from 'react';
import {Exception} from "@shared/exception/Exception";
import Header from "@widgets/header";
import Ops from "@widgets/ops";



type PageTemplateType = {
    error?: Exception | null, children?: JSX.Element,
}

const PageTemplate: React.FC<PageTemplateType> = ({error = null, children = <></>}) => {
    // const isAuthenticated = useAppSelector(state => state.auth.status == 'connected');

    let renderComponent: JSX.Element = children;

    if (error) {
        renderComponent = (<Ops error={error}/>);
    }

    //
    // if (!isAuthenticated) {
    //     renderComponent = (<LoginPage/>);
    // }
    return (
        <div className="flex flex-col bg-primary min-h-screen w-full">
            <Header/>
            <main className="flex-grow flex w-full">
                <Suspense fallback={<div></div>}>
                    {renderComponent}
                </Suspense>
            </main>
        </div>
    );
};

export default PageTemplate;