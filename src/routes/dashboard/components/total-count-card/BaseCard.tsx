import React, { FC, Suspense } from "react";

import type { AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";

import { Text } from "@/components";

import styles from "./index.module.css";

const Area = React.lazy(() => import("@ant-design/plots/es/components/area"));

export type BaseCardProps = {
  isLoading: boolean;
  totalCount?: number;
  primaryColor: string;
  secondaryColor?: string;
  icon: React.ReactNode;
  title: string;
  data: { index: string; value: number }[];
};

export const BaseCard: FC<BaseCardProps> = ({
  isLoading,
  totalCount,
  primaryColor,
  secondaryColor,
  icon,
  title,
  data,
}) => {
  const config: AreaConfig = {
    className: styles.area,
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    data: data,
    autoFit: true,
    tooltip: false,
    animation: false,
    xField: "index",
    yField: "value",
    xAxis: false,
    yAxis: {
      tickCount: 12,
      label: {
        style: {
          fill: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    smooth: true,
    areaStyle: () => ({
      fill: `l(270) 0:#fff 0.2:${secondaryColor || primaryColor} 1:${primaryColor}`,
    }),
    line: {
      color: primaryColor,
    },
  };

  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      bodyStyle={{
        padding: "8px 8px 8px 12px",
      }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text
          size="xxxl"
          strong
          style={{
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button
              style={{
                marginTop: "8px",
                width: "74px",
              }}
            />
          ) : (
            totalCount
          )}
        </Text>
        <Suspense>
          <Area {...config} />
        </Suspense>
      </div>
    </Card>
  );
};