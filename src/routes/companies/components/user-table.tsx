import React from "react";
import { Table, Tag, Space } from "antd";
import { useTable } from "@refinedev/antd";
import { OrganizationMember, Organization } from "@/rest-api/types";
import { UserTag } from "@/components/tags/user-tag";
// Import the necessary icons
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

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
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (_: string, record: OrganizationMember) => (
                <Space size="middle">
                    <UserTag 
                      user={{
                        id: record.user_id,
                        name: record.name,
                        avatarUrl: record.picture,
                        email: record.email,
                      }} 
                      resource={`users`}
                    />
                    {record.role === "TourAdmin" && (
                        <Tag color="red">Tour Admin</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Status",
            dataIndex: "metadata",
            key: "status",
            render: (metadata: any) => (
                <Tag
                    color={metadata?.isblocked ? "error" : "success"}
                    icon={metadata?.isblocked ? <CloseCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                >
                    {metadata?.isblocked ? "Blocked" : "Active"}
                </Tag>
            ),
        },
    ];

    return <Table {...tableProps} columns={columns} />;
};