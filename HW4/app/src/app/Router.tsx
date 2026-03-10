import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";

const HomePage = lazy(() =>
    import("@/pages/HomePage").then((m) => ({default: m.HomePage}))
);
const NotFoundPage = lazy(() =>
    import("@/pages/NotFoundPage").then((m) => ({default: m.NotFoundPage}))
);

function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-neon-blue font-display animate-pulse text-lg">
                Загрузка...
            </div>
        </div>
    );
}

export function Router() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader/>}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
