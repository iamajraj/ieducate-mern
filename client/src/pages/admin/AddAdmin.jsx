import { Button } from "antd";
import React from "react";
import Container from "../../components/Container";
import InputField from "../../components/InputField";

const AddAdmin = () => {
    const handleSubmit = (e) => {
        e.preventDefaul();
    };
    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <h1 className="text-[24px]">Add Admin</h1>
                <p className="text-[13px] mt-2">
                    Add the following details to add new admin
                </p>
                <div className="border-b w-full my-7"></div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-7"
                >
                    <div className="flex items-center gap-10">
                        <InputField
                            className=""
                            label="Name *"
                            placeholder="Enter the name"
                        />
                        <InputField
                            label="Email *"
                            placeholder="Enter the email"
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <InputField
                            label="Username *"
                            placeholder="Enter the username"
                        />
                        <InputField
                            label="Password *"
                            placeholder="Enter new password"
                            isPassword
                        />
                    </div>

                    <Button
                        type="text"
                        className={`flex items-center bg-main text-white  justify-center hover:bg-transparent cursor-pointer mt-5 py-7 w-[180px] ml-auto`}
                    >
                        <p className={`text-[18px]`}>Add</p>
                    </Button>
                </form>

                <div className="mt-8">
                    <p className="border-b w-max pb-2">Requirements</p>
                    <ul className="mt-4 flex flex-col gap-3 ml-7">
                        <li className="text-[13px] list-disc ">
                            The fields marked with (*) is required
                        </li>
                        <li className="text-[13px] list-disc ">
                            The email should be unique per user
                        </li>
                        <li className="text-[13px] list-disc ">
                            The username should be unique per user
                        </li>
                        <li className="text-[13px] list-disc ">
                            Multiple user with same email not allowed
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    );
};

export default AddAdmin;
