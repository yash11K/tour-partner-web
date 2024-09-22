import type { FC } from "react";

import { DeleteButton, EditButton, FilterDropdown } from "@refinedev/antd";
import {
  type CrudFilters,
  type CrudSorting,
  getDefaultFilter,
} from "@refinedev/core";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Table, type TableProps } from "antd";
import { Typography } from 'antd';

import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { currencyNumber } from "@/utilities";


type Company = {
  id: string;
  name: string;
  createdAt: string;
  brands?: string[];
  isBlocked?: boolean;
  branding?: {
    logo_url?: string;
  };
};

type Props = {
  tableProps: TableProps<Company>;
  filters: CrudFilters;
  sorters: CrudSorting;
  data?: Company[]; // Add this line
};

export const CompaniesTableView: FC<Props> = ({ tableProps, filters, data }) => {
  return (
    <Table
      {...tableProps}
      dataSource={data || tableProps.dataSource}
      pagination={{
        ...tableProps.pagination,
        pageSizeOptions: ["12", "24", "48", "96"],
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="companies" />
        ),
      }}
      rowKey="id"
    >
      <Table.Column<Company>
        dataIndex="name"
        title="Company title"
        defaultFilteredValue={getDefaultFilter("id", filters)}
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        filterIcon={<SearchOutlined />}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search Company" />
          </FilterDropdown>
        )}
        render={(_, record) => {
          return (
            <Space>
              <CustomAvatar
                shape="circle"
                name={record.name}
                src={record.branding?.logo_url}
                style={{ objectFit: "contain" }}
              />
              <Text
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {record.name}
              </Text>
            </Space>
          );
        }}
      />
      <Table.Column<Company>
        dataIndex={"totalRevenue"}
        title="Open deals amount"
        render={(_, company) => {
          return (
            <Text>
              {currencyNumber(5000)} 
            </Text>
          );
        }}
      />

      <Table.Column<Company>
        dataIndex="brands"
        title="Brands"
        render={(brands) => (
          <Space direction="vertical">
            {brands?.map((brand: string, index: number) => (
              <Typography.Text key={index} strong>
                {brand}
              </Typography.Text>
            ))}
          </Space>
        )}
      />

      <Table.Column<Company>
        fixed="right"
        dataIndex="id"
        title="Actions"
        render={(value) => (
          <Space>
            <EditButton
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<EyeOutlined />}
              hideText
              size="small"
              recordItemId={value}
            />

            <DeleteButton hideText size="small" recordItemId={value} />
          </Space>
        )}
      />
    </Table>
  );
};
