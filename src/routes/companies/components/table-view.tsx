import type { FC } from "react";

import { EditButton, FilterDropdown } from "@refinedev/antd";
import {
  type CrudFilters,
  type CrudSorting,
  getDefaultFilter,
} from "@refinedev/core";

import { EyeOutlined, PlusOutlined,SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, type TableProps } from "antd";
import { Tag,Typography  } from 'antd';
import dayjs from 'dayjs';

import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { Organization } from "@/rest-api/types";
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
  tableProps: TableProps<Organization>;
  filters: CrudFilters;
  sorters: CrudSorting;
  data?: Organization[]; // Add this line
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
        title="Revenue"
        render={(_, company) => {
          return (
            <Text>
              {currencyNumber(5000)} 
            </Text>
          );
        }}
      />

      <Table.Column<Company>
        dataIndex="createdAt"
        title="Created At"
        render={(value) => (
          <Typography.Text>
            {dayjs(value).format('MMMM D, YYYY')}
          </Typography.Text>
        )}
        sorter={(a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()}
      />

      <Table.Column<Organization>
        dataIndex="brands"
        title="Brands"
        render={(_, record) => (
          <Space size={8}>
            {record.metadata?.Avis === "true" && (
              <div
                style={{
                  width: 50,
                  height: 50,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/Avis_red.png"
                  alt="Avis"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            {record.metadata?.Budget === "true" && (
              <div
                style={{
                  width: 50,
                  height: 50,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/Budget_blue.png"
                  alt="Budget"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
          </Space>
        )}
      />

      <Table.Column<Organization>
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
            <Button
              icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              size="small"
              type="primary"
              style={{ backgroundColor: '#1890ff' }}
              onClick={() => {
                // Add your logic for adding a new admin here
                console.log('Add new admin for company:', value);
              }}
            >
              Add Admin
            </Button>
          </Space>
        )}
      />

      <Table.Column<Organization>
        dataIndex={["metadata", "isBlocked"]}
        title="Status"
        render={(isBlocked) => {
          const blocked = isBlocked === "true";
          return (
            <Tag color={blocked ? "red" : "green"}>
              {blocked ? "Blocked" : "Active"}
            </Tag>
          );
        }}
      />
    </Table>
  );
};
