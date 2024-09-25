import React, { FC, useState } from "react";
import { Space, Tag, Tooltip, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CustomAvatar } from "../custom-avatar";
import { ContactShowPage } from "../../routes/users/UserDrawer";

type Props = {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    email: string;
  };
  resource: string;
};

export const UserTag: FC<Props> = ({ user, resource }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = async () => {
    setLoading(true);
    setError(null);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setLoading(false);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    message.error("Failed to load user details. Please try again.");
  };

  return (
    <>
      <Tag
        key={user.id}
        style={{
          padding: 2,
          paddingRight: 8,
          borderRadius: 24,
          lineHeight: "unset",
          marginRight: "unset",
        }}
      >
        <Space size={4}>
          <CustomAvatar
            src={user.avatarUrl}
            name={user.name}
            style={{ display: "inline-flex" }}
          />
          {user.name}
          <Tooltip title="View user details">
            <InfoCircleOutlined
              onClick={openDrawer}
              style={{ cursor: "pointer", marginLeft: 4 }} onPointerEnterCapture={onpointerenter} onPointerLeaveCapture={onpointerleave}/>
          </Tooltip>
        </Space>
      </Tag>

      {drawerVisible && (
        <ContactShowPage
          id={user.id}
          visible={drawerVisible}
          onClose={closeDrawer}
          loading={loading}
          setLoading={setLoading}
          error={error}
          onError={handleError}
          resource={resource}
        />
      )}
    </>
  );
};
