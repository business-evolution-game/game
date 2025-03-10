import React from 'react';
import PageTemplate from "@pages/PageTemplate";
import Board from "@widgets/board";
import {Navigate, Route, Routes} from "react-router-dom";
import LoadingCircle from "@shared/ui/loader/LoadingCircle";
import Ops from "@widgets/ops";
import {Exception} from "@shared/exception/Exception";



function Home() {

    return (
        <PageTemplate>
                <div className="min-h-screen bg-gray-100">
                    <Navigate to={"/start"}/> {/*/todo: delete after adding some static page*/}
                    <Routes>
                        <Route path="/subpage" element={<LoadingCircle  progress={50}/>} />
                        <Route path="*" element={<Ops error={new Exception("Page not found")}/>}/>
                    </Routes>
                </div>
        </PageTemplate>
    );
}

export default Home;