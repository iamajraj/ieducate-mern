import React from "react";
import { Input } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const InputField = ({
    label,
    placeholder,
    value,
    onChange,
    isPassword,
    className,
    type,
    name,
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-[16px]">{label}</label>
            {isPassword ? (
                <Input.Password
                    name={name}
                    className={`mt-2 rounded-md py-3 px-2 text-[17px] ${className}`}
                    placeholder={placeholder ?? ""}
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <Input
                    name={name}
                    placeholder={placeholder ?? ""}
                    className={`mt-2 rounded-md py-3 px-2 text-[17px] ${className}`}
                    spellCheck={false}
                    value={value}
                    onChange={onChange}
                    type={type ?? "text"}
                />
            )}
        </div>
    );
};

export default InputField;
