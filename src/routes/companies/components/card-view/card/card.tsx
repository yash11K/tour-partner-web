import type { FC } from "react";

import { useDelete, useNavigation } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import { DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space, Tooltip } from "antd";

import { CustomAvatar, Text } from "@/components";
import { currencyNumber } from "@/utilities";

import { AvatarGroup } from "../../avatar-group";
import { CompanyCardSkeleton } from "./skeleton";
import { Company } from "@/rest-api/types";
import { getOrganization } from "@/routes/companies/queries";

type Props = {
  company: Company;
};

export const CompanyCard: FC<Props> = ({ company }) => {
  const { edit } = useNavigation();
  const { mutate } = useDelete();

  return (
    <Card
      size="small"
      actions={[
        <div
          key="1"
          style={{
            width: "100%",
            height: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
          </div>
        </div>,
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Dropdown
          menu={{
            items: [
              {
                label: "View company",
                key: "1",
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: <EyeOutlined />,
                onClick: () => {
                  getOrganization(company.id);
                },
              },
              {
                danger: true,
                label: "Disable Partner",
                key: "2",
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: <DeleteOutlined />,
                onClick: () => {
                  mutate({
                    resource: "company",
                    id: company.id,
                  });
                },
              },
            ],
          }}
          placement="bottom"
          arrow
        >
          <Button
            type="text"
            shape="circle"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            icon={
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              <MoreOutlined
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            }
          />
        </Dropdown>

        <CustomAvatar
          name={company.name}
          src={company.avatarUrl}
          shape="square"
          style={{
            width: "48px",
            height: "48px",
          }}
        />
        <Text
          strong
          size="md"
          ellipsis={{ tooltip: company.name }}
          style={{
            marginTop: "12px",
          }}
        >
          {company.name}
        </Text>
        <Text type="secondary">{company.brands}</Text>

        <Space
          direction="vertical"
          size={0}
          style={{
            marginTop: "8px",
            alignItems: "center",
          }}
        >
          <Text
            strong
            size="md"
            style={{
              marginTop: "12px",
            }}
          >
            {currencyNumber(5000)}
          </Text>
        </Space>
      </div>
    </Card>
  );
};
