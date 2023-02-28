import React from "react";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import router from "./routes";

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
