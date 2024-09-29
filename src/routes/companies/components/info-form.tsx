import React, { useState } from "react";

import { ShopOutlined } from "@ant-design/icons";
import { Button, Card, Image, message, Space } from "antd";

import { Text } from "@/components";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganization"; // Assume this hook exists
import { Organization } from "@/rest-api/types";
import { currencyNumber } from "@/utilities";

export const CompanyInfoForm: React.FC<{ organization: Organization }> = ({ organization }) => {
  const { updateOrganization, isLoading } = useUpdateOrganization();
  const [isBlocked, setIsBlocked] = useState(organization.metadata?.isBlocked === "true");

  const handleToggleBlock = async () => {
    const action = isBlocked ? 'enable' : 'disable';
    try {
      const updatedOrg = await updateOrganization(
        organization.id,
        {
          metadata: { ...organization.metadata, isBlocked: isBlocked ? "false" : "true" }
        }
      );
      if (updatedOrg) {
        setIsBlocked(!isBlocked);
        message.success(`Organization ${action}d successfully`);
      }
    } catch (error) {
      message.error(`Failed to ${action} organization`);
    }
  };

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
              <BrandLogo src="/Avis_red.png" alt="Avis" />
            )}
            {organization.metadata?.Budget === "true" && (
              <BrandLogo src="/Budget_blue.png" alt="Budget" />
            )}
          </div>
        </div>
        
        <Button 
          type="primary"
          danger={!isBlocked}
          onClick={handleToggleBlock}
          loading={isLoading}
          style={{ 
            backgroundColor: isBlocked ? "#52c41a" : undefined, 
            borderColor: isBlocked ? "#52c41a" : undefined 
          }}
        >
          {isBlocked ? "Enable" : "Disable"}
        </Button>
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
