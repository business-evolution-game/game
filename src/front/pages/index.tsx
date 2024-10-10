import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";
import LoadingPage from "./loading";


const GamePage = lazy(() => import("@pages/game"));
const Page404 = lazy(() => import("@pages/404"));

export const Routing = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingPage/>}>
                <Routes>
                    <Route path="/" element={<LoadingPage/>} />
                    <Route path="/board" element={<GamePage/>} />
                    <Route path="*" element={<Page404/>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};