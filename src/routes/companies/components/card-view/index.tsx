import { type FC, useMemo } from "react";

import { List, type ListProps, type TableProps } from "antd";

import { PaginationTotal } from "@/components";

import { CompanyCard, CompanyCardSkeleton } from "./card";
import {Organization} from "@/rest-api/types";

type Props = {
  tableProps: TableProps<Organization>;
  setCurrent: (current: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const CompaniesCardView: FC<Props> = ({
  tableProps: { dataSource, pagination, loading },
  setCurrent,
  setPageSize,
}) => {
  const data = useMemo(() => {
    return [...(dataSource || [])];
  }, [dataSource]);

  return (
    <List
      grid={{
        gutter: 32,
        column: 4,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 4,
      }}
      dataSource={data}
      renderItem={(item: Organization) => (
        <List.Item>
          <CompanyCard
            company={{
              id: item.id,
              name: item.name,
              branding: { logo_url: item.branding?.logo_url },
              metadata: {
                  createdAt: item.metadata?.createdAt,
                  isBlocked: item.metadata?.isBlocked ? "true" : "false",
                  avis: item.metadata?.avis,
                  budget: item.metadata?.budget,
              }
            }}
          />
        </List.Item>
      )}
      pagination={{
        ...(pagination as ListProps<Organization>["pagination"]),
        hideOnSinglePage: true,
        itemRender: undefined,
        position: "bottom",
        style: { display: "flex", marginTop: "1rem" },
        pageSizeOptions: ["12", "24", "48"],
        onChange: (page, pageSize) => {
          setCurrent(page);
          setPageSize(pageSize);
        },
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="organization" />
        ),
      }}
    >
      {loading ? (
        <List
          grid={{
            gutter: 32,
            column: 4,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 4,
          }}
          dataSource={Array.from({ length: 12 }).map((_, i) => ({
            id: i,
          }))}
          renderItem={() => (
            <List.Item>
              <CompanyCardSkeleton />
            </List.Item>
          )}
        />
      ) : undefined}
    </List>
  );
};
