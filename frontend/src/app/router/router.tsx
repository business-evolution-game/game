import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import LoadingPage from "@pages/loading";
import Home from "@pages/home";
import Start from "@pages/start";


const GamePage = lazy(() => import("@pages/game"));
const Page404 = lazy(() => import("@pages/404"));

export const Routing = () => {
    return (<BrowserRouter>
        <Suspense fallback={<LoadingPage/>}>
            <Routes>
                <Route path="/" element={<Navigate to={'/home'}/>}/>
                <Route path="/home/*" element={<Home/>}/>
                <Route path="/start/*" element={<Start/>}/>
                <Route path="/board" element={<GamePage/>}/>
                <Route path="*" element={<Page404/>}/>
            </Routes>
        </Suspense>
    </BrowserRouter>);
};