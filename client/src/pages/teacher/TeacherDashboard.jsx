import React, { useContext } from "react";
import Container from "../../components/Container";
import { authContext } from "../../context/AuthProvider";

const Dashboard = () => {
    const { user } = useContext(authContext);
    return (
        <Container>
            <div className="bg-white p-8 rounded-lg flex flex-col">
                <div>
                    <h1 className="text-[22px] text-gray-800 font-semibold">
                        Welcome {user?.name}!
                    </h1>
                    <p className="text-[14px]">Dashboard</p>
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;
