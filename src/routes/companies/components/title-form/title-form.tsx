import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";

import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";

import { CustomAvatar, Text } from "@/components";

import styles from "./title-form.module.css";
import { Organization } from "@/rest-api/types";

export const CompanyTitleForm = ({ id, organization }: { id: string; organization: Organization }) => {
  const {
    formProps,
    onFinish,
  } = useForm<
    Organization,
    HttpError
  >({
    redirect: false,
    id: id,
  });

  return (
    <Form {...formProps} initialValues={organization}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={organization?.branding?.logo_url}
          name={organization?.display_name}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="display_name" required noStyle>
            <TitleInput
              onChange={(value) => {
                return onFinish?.({
                  display_name: value,
                });
              }}
            />
          </Form.Item>
        </Space>
      </Space>
    </Form>
  );
};

const TitleInput = ({
  value,
  onChange,
  loading,
}: {
  // value is set by <Form.Item />
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
}) => {
  return (
    <Text
      className={styles.title}
      size="xl"
      strong
      editable={{
        onChange,
        triggerType: ["text", "icon"],
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <EditOutlined className={styles.titleEditIcon} />,
      }}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} active />
      ) : (
        value
      )}
    </Text>
  );
};