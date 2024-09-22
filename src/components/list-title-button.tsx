import type {FC} from "react";
import {useLocation} from "react-router-dom";

import {useGo, useNavigation} from "@refinedev/core";

import {PlusCircleOutlined} from "@ant-design/icons";
import {Button, Grid} from "antd";

import {Text} from "../components";

interface ListTitleButtonProps {
    buttonText: string,
    onClick?: () => void
}

export const ListTitleButton: FC<ListTitleButtonProps> = ({
    buttonText,
    onClick
}) => {
    const screens = Grid.useBreakpoint();

    return (
        <Button
            type="primary"
            icon={<PlusCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={onClick}
            size={screens.xs ? "middle" : "large"}
            style={{
                marginTop: screens.xs ? "1.6rem" : "0.3rem",
            }}
        >
            <Text
                style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 400,
                }}
            >
                {!screens.xs ? buttonText : null}
            </Text>
        </Button>
    );
};
