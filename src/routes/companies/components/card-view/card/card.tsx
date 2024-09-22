import type { FC } from "react";
import { useNavigation, useNotification } from "@refinedev/core";
import { EyeOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Modal, Space, Tag, Typography } from "antd";
import { CustomAvatar, Text } from "@/components";
import { Organization } from "@/rest-api/types";
import { getOrganization } from "@/routes/companies/queries";
import { currencyNumber } from "@/utilities";
import dayjs from 'dayjs';
import axios from "axios";

type Props = {
  company: Organization;
};

export const CompanyCard: FC<Props> = ({ company }) => {
  const { edit } = useNavigation();
  const { open } = useNotification();

  const handleStatusChange = async () => {
    Modal.confirm({
      title: `Are you sure you want to ${company.metadata?.isBlocked ? 'unblock' : 'block'} this company?`,
      onOk: async () => {
        try {
          // Replace with your actual API endpoint
          const response = await axios.post(`/api/companies/${company.id}/toggle-status`);
          
          if (response.status === 200) {
            open?.({
              type: 'success',
              message: `Company successfully ${company.metadata?.isBlocked ? 'unblocked' : 'blocked'}`,
            });
            // You might want to refresh the company data here
          } else {
            throw new Error('Failed to update company status');
          }
        } catch (error) {
          open?.({
            type: 'error',
            message: 'An error occurred while updating the company status',
          });
        }
      },
    });
  };

  return (
    <Card
      size="small"
      actions={[
        <Button
          key="addAdmin"
          icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          size="small"
          type="primary"
          style={{ backgroundColor: '#1890ff' }}
          onClick={() => {
            console.log('Add new admin for company:', company.id);
          }}
        >
          Add Admin
        </Button>,
      ]}
    >
      <div style={{ position: "relative" }}>
        <Dropdown
          menu={{
            items: [
              {
                label: "View company",
                key: "1",
                icon: <EyeOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                onClick: async () => {
                  await getOrganization(company.id);
                },
              },
            ],
          }}
          placement="bottomRight"
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
            icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          />
        </Dropdown>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <CustomAvatar
              shape="square"
              name={company.name}
              src={company.branding?.logo_url}
              style={{ width: "48px", height: "48px", objectFit: "contain" }}
            />
            <Text strong>{company.name}</Text>
          </Space>

          <Space direction="vertical" size="small">
            <Text>Revenue: {currencyNumber(5000)}</Text>
            <Text>Created At: {dayjs(company.metadata?.createdAt).format('MMMM D, YYYY')}</Text>
          </Space>

          <Space>
            {company.metadata?.avis === "true" && (
              <div style={{
                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f0f0',
              }}>
                <img src="/public/avis.com.png" alt="Avis" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            {company.metadata?.budget === "true" && (
              <div style={{
                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f0f0',
              }}>
                <img src="/public/budget.com.png" alt="Budget" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </Space>

          <Button
            danger={!company.metadata?.isBlocked}
            type={company.metadata?.isBlocked ? "primary" : "default"}
            onClick={handleStatusChange}
          >
            {company.metadata?.isBlocked ? "Blocked" : "Active"}
          </Button>
        </Space>
      </div>
    </Card>
  );
};
