import React, { useState, useEffect } from "react";

import { useDelete, useNavigation, useShow, useUpdate } from "@refinedev/core";
import type { GetFields } from "@refinedev/nestjs-query";

import {
    CloseOutlined,
    DeleteOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import {
    Button,
    Drawer,
    Input,
    Popconfirm,
    Spin,
    Typography,
    Alert,
} from "antd";
import dayjs from "dayjs";

import {
    CustomAvatar,
    SelectOptionWithAvatar,
    SingleElementForm,
    Text,
    TextIcon,
} from "@/components";
import { TimezoneEnum } from "@/enums";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";

import styles from "./index.module.css";
import {User} from "@/rest-api/schema.types";

const timezoneOptions = Object.keys(TimezoneEnum).map((key) => ({
    label: TimezoneEnum[key as keyof typeof TimezoneEnum],
    value: TimezoneEnum[key as keyof typeof TimezoneEnum],
}));

type ContactShowPageProps = {
    id: string;
    visible: boolean;
    onClose: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    onError: (error: string) => void;
    resource: string;
};

export const ContactShowPage: React.FC<ContactShowPageProps> = ({
    id,
    visible,
    onClose,
    loading,
    setLoading,
    error,
    onError,
    resource,
}) => {
    const [activeForm, setActiveForm] = useState<
        "email" | "phone_number" | "given_name" | "family_name"
    >();
    const [isVisible, setIsVisible] = useState(visible);
    const { list } = useNavigation();
    const { queryResult } = useShow<GetFields<User>>({
        resource: resource.endsWith('/') ? resource.slice(0, -1) : resource,
        id,
        queryOptions: {
            enabled: false,
        },
    });

    const { data, isLoading: queryLoading, refetch } = queryResult;

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            refetch()
                .then(() => setLoading(false))
                .catch((error: Error) => {
                    setLoading(false);
                    onError(error.message || "Failed to load user details");
                });
        }
    }, [visible, refetch, setLoading, onError]);

    const { mutate: updateMutation } = useUpdate<User>({
        resource: "users",
        successNotification: false,
        id: data?.data?.id,
        mutationOptions: {
            onSuccess: () => {
                closeModal();
                refetch();
            },
        },
    });

    const closeModal = () => {
        setActiveForm(undefined);

        list("users");
    };

    const handleClose = () => {
        setIsVisible(false);
        // Delay the onClose callback to allow for animation
        setTimeout(() => {
            onClose();
        }, 300); // 300ms is the default animation duration for Ant Design Drawer
    };

    if (loading || queryLoading) {
        return (
            <Drawer
                open={isVisible}
                width={756}
                onClose={handleClose}
                bodyStyle={{
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin />
            </Drawer>
        );
    }

    if (error) {
        return (
            <Drawer
                open={isVisible}
                onClose={handleClose}
                width={756}
                bodyStyle={{ background: "#f5f5f5", padding: 24 }}
            >
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </Drawer>
        );
    }

    const {
        user_id,
        given_name,
        family_name,
        email,
        phone_number,
        picture,
        created_at,
        last_login,
        email_verified,
        phone_verified,
        metadata,
    } = data?.data ?? {};

    const isCurrentlyBlocked = metadata?.isblocked === "true";

    return (
        <Drawer
            open={isVisible}
            onClose={handleClose}
            width={756}
            bodyStyle={{ background: "#f5f5f5", padding: 0 }}
            headerStyle={{ display: "none" }}
        >
            <div className={styles.header}>
                <Button
                    type="text"
                    icon={<CloseOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    onClick={handleClose}
                />
            </div>
            <div className={styles.container}>
                <div className={styles.name}>
                    <CustomAvatar
                        style={{
                            marginRight: "1rem",
                            flexShrink: 0,
                            fontSize: "40px",
                            border: "none",  // Remove border
                        }}
                        size={150}
                        src={picture}
                        name={`${given_name} ${family_name}`}
                    />
                    <Typography.Title
                        level={3}
                        style={{ padding: 0, margin: 0, width: "100%" }}
                        className={styles.title}
                    >
                        {`${given_name} ${family_name}`}
                    </Typography.Title>
                </div>

                <div className={styles.form}>
                    <SingleElementForm
                        icon={<MailOutlined className="tertiary" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        state={
                            activeForm && activeForm === "email"
                                ? "form"
                                : email
                                ? "view"
                                : "empty"
                        }
                        itemProps={{
                            name: "email",
                            label: "Email",
                        }}
                        view={<Text>{email} {email_verified && <span>(Verified)</span>}</Text>}
                        onClick={() => setActiveForm("email")}
                        onUpdate={() => setActiveForm(undefined)}
                        onCancel={() => setActiveForm(undefined)}
                    >
                        <Input defaultValue={email} />
                    </SingleElementForm>

                    <SingleElementForm
                        icon={<PhoneOutlined className="tertiary" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        state={
                            activeForm && activeForm === "phone_number"
                                ? "form"
                                : phone_number
                                ? "view"
                                : "empty"
                        }
                        itemProps={{
                            name: "phone_number",
                            label: "Phone",
                        }}
                        view={<Text>{phone_number} {phone_verified && <span>(Verified)</span>}</Text>}
                        onClick={() => setActiveForm("phone_number")}
                        onUpdate={() => setActiveForm(undefined)}
                        onCancel={() => setActiveForm(undefined)}
                    >
                        <Input defaultValue={phone_number || ""} />
                    </SingleElementForm>

                    <SingleElementForm
                        icon={<IdcardOutlined className="tertiary" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        state={
                            activeForm && activeForm === "given_name"
                                ? "form"
                                : given_name
                                ? "view"
                                : "empty"
                        }
                        itemProps={{
                            name: "given_name",
                            label: "Given Name",
                        }}
                        view={<Text>{given_name}</Text>}
                        onClick={() => setActiveForm("given_name")}
                        onUpdate={() => setActiveForm(undefined)}
                        onCancel={() => setActiveForm(undefined)}
                    >
                        <Input defaultValue={given_name || ""} />
                    </SingleElementForm>

                    <SingleElementForm
                        icon={<IdcardOutlined className="tertiary" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        state={
                            activeForm && activeForm === "family_name"
                                ? "form"
                                : family_name
                                ? "view"
                                : "empty"
                        }
                        itemProps={{
                            name: "family_name",
                            label: "Family Name",
                        }}
                        view={<Text>{family_name}</Text>}
                        onClick={() => setActiveForm("family_name")}
                        onUpdate={() => setActiveForm(undefined)}
                        onCancel={() => setActiveForm(undefined)}
                    >
                        <Input defaultValue={family_name || ""} />
                    </SingleElementForm>
                </div>

                <div className={styles.actions}>
                    <Text className="ant-text tertiary">
                        Created on: {dayjs(created_at).format("MMMM DD, YYYY")}
                    </Text>
                    <Text className="ant-text tertiary">
                        Last login: {dayjs(last_login).format("MMMM DD, YYYY HH:mm:ss")}
                    </Text>

                    <Popconfirm
                        title={isCurrentlyBlocked ? "Enable" : "Disable"}
                        description={
                            isCurrentlyBlocked
                                ? "Are you sure you want to enable this contact? This will restore access to book1.carrental.com"
                                : "Are you sure you want to disable this contact? This will block all access to book1.carrental.com"
                        }
                        onConfirm={() => {
                            updateMutation(
                                {
                                    id: user_id,
                                    resource: "users/:id",
                                    values: {
                                        metadata: {
                                            isblocked: isCurrentlyBlocked ? "false" : "true",
                                        },
                                    },
                                },
                                {
                                    onSuccess: () => {
                                        closeModal();
                                        refetch();
                                    },
                                },
                            );
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="link" 
                            danger={!isCurrentlyBlocked} 
                            icon={<DeleteOutlined onPointerEnterCapture={onpointerenter} onPointerLeaveCapture={onpointerleave} />}
                        >
                            {isCurrentlyBlocked ? "Enable" : "Disable"}
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </Drawer>
    );
};