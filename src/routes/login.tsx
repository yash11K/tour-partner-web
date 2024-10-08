import React from "react";
import { Layout, Button, Space, Typography } from "antd";
import { ThemedTitleV2 } from "@refinedev/antd";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="vertical" align="center" size="large">
        <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: "22px",
          }}
        />
        <Button
          type="primary"
          size="middle"
          onClick={() => loginWithRedirect()}
          style={{ width: "240px" }}
        >
          Sign in
        </Button>
        <Typography.Text type="secondary">Powered by Auth0</Typography.Text>
      </Space>
    </Layout>
  );
};
