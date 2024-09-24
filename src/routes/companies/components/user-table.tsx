import React from "react";
import { Table, Avatar, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { OrganizationMember, Organization } from "@/rest-api/types";

export const UserTable: React.FC<{ organization: Organization }> = ({ organization }) => {
  const { tableProps } = useTable<OrganizationMember>({
    resource: `organizations/${organization.id}/members`,
    filters: {
      permanent: [
        {
          field: "organizationId",
          operator: "eq",
          value: organization.id,
        },
      ],
    },
  });

  const columns = [
    {
      title: "Avatar",
      dataIndex: "picture",
      key: "picture",
      render: (avatarUrl: string, record: OrganizationMember) => (
        <Avatar src={avatarUrl} alt={record.name} shape="circle" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: OrganizationMember) => (
        <span>
          {name}
          {record.role === "TourAdmin" && (
            <Tag color="red" style={{ marginLeft: 8 }}>
              Tour Admin
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return <Table {...tableProps} columns={columns} />;
};