import moment from "moment";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import AnnouncementCard from "./component/AnnouncementCard";

const StudentAnnouncement = () => {
    const [announcements, setAnnouncements] = useState([]);

    const getAnnouncements = async () => {
        try {
            const res = await axiosInstance.get("/announcements");
            setAnnouncements(res.data.announcements);
        } catch (err) {}
    };

    useEffect(() => {
        getAnnouncements();
    }, []);

    console.log(announcements);

    return (
        <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
            <h1 className="text-[28px] font-medium hidden md:block">
                Announcement
            </h1>
            <div className="overflow-y-scroll mt-[32px] no-scrollbar h-full flex flex-col gap-[32px]">
                {announcements
                    ?.map((item) => <AnnouncementCard item={item} />)
                    .reverse()}
            </div>
        </div>
    );
};

export default StudentAnnouncement;
