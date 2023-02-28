import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export const useAxios = ({ url, method, body = null }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const result = await axiosInstance.request({
                url,
                method,
                data: body,
            });
            setResponse(result.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { response, error, loading };
};
