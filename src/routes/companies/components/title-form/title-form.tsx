import { useState } from "react";

import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";

import { CustomAvatar, SelectOptionWithAvatar, Text } from "@/components";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import type { User } from "@/rest-api/schema.types";
import { getNameInitials } from "@/utilities";

import { COMPANY_TITLE_FORM_MUTATION, COMPANY_TITLE_QUERY } from "./queries";
import styles from "./title-form.module.css";

export const CompanyTitleForm = () => {
  const {
    formProps,
    query: queryResult,
    onFinish,
  } = useForm<
    GetFields<any>,
    HttpError,
    GetVariables<any>
  >({
    redirect: false,
    meta: {
      gqlMutation: COMPANY_TITLE_FORM_MUTATION,
      gqlQuery: COMPANY_TITLE_QUERY,
    },
  });

  const company = queryResult?.data?.data;
  const loading = queryResult?.isLoading;

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={company?.branding.logo_url}
          name={getNameInitials(company?.display_name || "")}
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
              loading={loading}
              onChange={(value) => {
                return onFinish?.({
                  display_name: value,
                });
              }}
            />
          </Form.Item>
          {/* Remove or update SalesOwnerInput as it's not present in the new API response */}
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

// Remove or update SalesOwnerInput component as it's not present in the new API response
