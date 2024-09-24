import React from "react";
import { Card, Space, Image } from "antd";
import { Text } from "@/components";
import { Organization } from "@/rest-api/types";
import { currencyNumber } from "@/utilities";
import { ShopOutlined } from "@ant-design/icons";
import { UserTable } from "./user-table";

export const CompanyInfoForm: React.FC<{ organization: Organization }> = ({ organization }) => {
  return (
    <Card
      title={
        <Space size={15}>
          <ShopOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <Text>{organization.display_name}</Text>
        </Space>
      }
      headStyle={{
        padding: "1rem",
      }}
      bodyStyle={{
        padding: "1rem",
      }}
      style={{
        width: "100%",
        maxWidth: "500px",
        color: "red",
      }}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
        <InfoItem label="Name" value={organization.display_name ?? ''} />
        <InfoItem label="cid" value={organization.name ?? ''} />
        <InfoItem label="Revenue" value={currencyNumber(5000)} />
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
            {organization.metadata?.Avis === "true" && (
              <BrandLogo src="/public/avis.com.png" alt="Avis" />
            )}
            {organization.metadata?.Budget === "true" && (
              <BrandLogo src="/public/budget.com.png" alt="Budget" />
            )}
          </div>
        </div>
      </Space>
    </Card>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{ wordBreak: 'break-word' }}>
    <Text strong>{label}:</Text> {value}
  </div
  >
);

const BrandLogo: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      preview={false}
      style={{ objectFit: 'contain' }}
    />
  </div>
);

export default CompanyInfoForm;
