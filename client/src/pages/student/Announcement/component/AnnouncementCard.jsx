import moment from "moment";
import React, { useState } from "react";

const AnnouncementCard = ({ item }) => {
    const [isOpen, setIsOpen] = useState();
    return (
        <div className="shadow-md w-full pt-[30px] bg-white rounded-[5px] border-l-[4px] md:border-l-[7px] border-l-[#E5247D] px-[10px] md:px-[40px]">
            <div className="flex items-center justify-between pb-[30px]">
                <h2 className="text-[12px] md:text-[18px] text-[#E5247D] font-medium flex-1">
                    {item.title}
                </h2>
                <div className="flex items-center justify-between flex-1">
                    <p className="text-[12px] md:text-[15px]">
                        {moment(item.createdAt).fromNow()}
                    </p>
                    <p
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                        className="text-blue-500 cursor-pointer font-medium text-[12px] md:text-[16px]"
                    >
                        {isOpen ? "View less" : "View More"}
                    </p>
                </div>
            </div>
            {isOpen ? (
                <>
                    <div className="h-[1px] bg-[#D9D9D9] w-full"></div>
                    <div className="px-[20px] py-[20px]">
                        <p className="text-[15px] font-medium">Dear Student,</p>
                        <p className="my-6 text-[14px]">{item.description}</p>
                        <p className="text-[14px]">Thanks!</p>
                        <p className="font-medium mt-3">Admin</p>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default AnnouncementCard;
