import React from 'react';
import PageTemplate from "@pages/PageTemplate";
import {Exception} from '@shared/exception/Exception';



function Page404() {

    return (
        <PageTemplate error={new Exception("Page not found")}/>
    );
}

export default Page404;