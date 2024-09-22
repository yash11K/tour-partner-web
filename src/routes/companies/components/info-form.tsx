import React from "react";
import { useOne } from "@refinedev/core";
import { Card, Space, Image } from "antd";
import { Text } from "@/components";
import type { Company } from "@/rest-api/schema.types";
import { currencyNumber } from "@/utilities";
import { ShopOutlined } from "@ant-design/icons";

export const CompanyInfoForm: React.FC = () => {
  const { data, isLoading } = useOne<Company>({
    resource: "companies",
    id: "current", // Assuming we're fetching the current company
  });

  const companyData = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!companyData) {
    return <div>No company data available</div>;
  }

  return (
    <Card
      title={
        <Space size={15}>
          <ShopOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Text>Company Info</Text>
        </Space>
      }
      headStyle={{
        padding: "1rem",
      }}
      bodyStyle={{
        padding: "1rem",
      }}
      style={{
        maxWidth: "500px",
      }}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <div>
          <Text strong>Company Name:</Text> {companyData.name}
        </div>
        <div>
          <Text strong>CID:</Text> {companyData.id}
        </div>
        <div>
          <Text strong>Revenue:</Text> {currencyNumber(companyData.totalRevenue || 5000)}
        </div>
        <div>
          <Text strong>Brands:</Text>
          <Space>
            {companyData.metadata?.avis && (
              <Image
                src="/public/avis.com.png"
                alt="Avis"
                width={100}
                preview={false}
              />
            )}
            {companyData.metadata?.budget && (
              <Image
                src="/public/budget.com.png"
                alt="Budget"
                width={100}
                preview={false}
              />
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );
};
