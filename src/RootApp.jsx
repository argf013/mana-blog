import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/ToastContext";
import { LoaderProvider } from "./components/LoaderContext";
import App from "./App";

const RootApp = () => (
    <LoaderProvider>
        <ToastProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ToastProvider>
    </LoaderProvider>
);

export default RootApp;