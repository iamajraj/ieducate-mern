import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useContext, useEffect } from "react";
import { authContext } from "../context/AuthProvider";

const AutoLogout = ({ children }) => {
    const { setUser } = useContext(authContext);
    const navigate = useNavigate();

    const logout = () => {
        const user_type = JSON.parse(localStorage.getItem("user")).user_type;
        localStorage.clear();
        setUser(null);
        navigate(`/${user_type}`);
    };
    const setLastOpenTime = () => {
        localStorage.setItem("last_open", JSON.stringify(new Date()));
        return true;
    };

    const handleLogoutTimer = () => {
        const old_d = JSON.parse(localStorage.getItem("last_open"));
        if (old_d) {
            if (!compare(old_d)) {
                logout();
            } else {
                // localStorage.removeItem("last_open");
                window.addEventListener("beforeunload", setLastOpenTime);
                window.addEventListener("unload", setLastOpenTime);
                window.addEventListener("close", setLastOpenTime);
            }
        } else {
            window.addEventListener("beforeunload", setLastOpenTime);
            window.addEventListener("unload", setLastOpenTime);
            window.addEventListener("close", setLastOpenTime);
        }
    };

    const compare = (date) => {
        console.log(moment(date).fromNow());
        return moment(date).isAfter(moment().subtract(1, "hour"));
    };

    useEffect(() => {
        window.addEventListener("load", handleLogoutTimer);
    }, []);
    return children;
};

export default AutoLogout;
