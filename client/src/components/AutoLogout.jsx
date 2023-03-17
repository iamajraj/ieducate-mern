import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthProvider";

const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

const AutoLogout = ({ children }) => {
    const { setUser } = useContext(authContext);

    const navigate = useNavigate();

    const logout = (user_type) => {
        setUser(null);
        localStorage.clear();
        navigate(`/${user_type}`);
    };

    let timer;

    const handleLogoutTimer = () => {
        timer = setTimeout(() => {
            resetTimer();
            Object.values(events).forEach((ev) => {
                window.removeEventListener(ev, resetTimer);
            });
            const local_user = JSON.parse(localStorage.getItem("user"));
            logout(local_user?.user_type);
            Object.values(events).forEach((ev) => {
                window.removeEventListener(ev, handle);
            });
        }, 3600000);
    };

    function resetTimer() {
        if (timer) clearTimeout(timer);
    }

    function handle() {
        resetTimer();
        handleLogoutTimer();
    }

    useEffect(() => {
        Object.values(events).forEach((ev) => {
            window.addEventListener(ev, handle);
        });
    }, []);
    return children;
};

export default AutoLogout;
