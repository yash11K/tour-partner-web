import { Card, Skeleton, Space, Tag } from "antd";

import { Text } from "@/components";


export const CompanyCardSkeleton = () => {
  return (
    <Card
      size="small"
      actions={[
        <div
          key={1}
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
        <Skeleton.Avatar
          active
          shape="square"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "4px",
          }}
        />
        <Skeleton.Input
          active
          style={{
            width: "200px",
            height: "16px",
            marginTop: "16px",
          }}
        />
        <Space
          direction="vertical"
          size={0}
          style={{
            marginBottom: "6px",
            alignItems: "center",
          }}
        >
          <Skeleton.Input
            active
            style={{
              height: "16px",
              marginTop: "12px",
            }}
          />
          <Skeleton.Input
            active
            style={{
              height: "16px",
              marginTop: "8px",
            }}
          />
        </Space>
        
        {/* New elements for created at and brands */}
        <Space
          direction="vertical"
          size={4}
          style={{
            width: "100%",
            marginTop: "12px",
          }}
        >
          <Text size="xs">Created at</Text>
          <Text size="sm">Jan 1, 2023</Text>
        </Space>
        
        <Space
          direction="vertical"
          size={4}
          style={{
            width: "100%",
            marginTop: "12px",
          }}
        >
          <Text size="xs">Brands</Text>
          <Space size={4}>
            <Tag color="blue">Brand A</Tag>
            <Tag color="green">Brand B</Tag>
            <Tag color="orange">Brand C</Tag>
          </Space>
        </Space>
      </div>
    </Card>
  );
};
