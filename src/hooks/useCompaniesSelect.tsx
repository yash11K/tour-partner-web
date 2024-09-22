import { useSelect } from "@refinedev/antd";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";

import gql from "graphql-tag";


const COMPANIES_SELECT_QUERY = gql`
    query CompaniesSelect(
        $filter: CompanyFilter!
        $sorting: [CompanySort!]
        $paging: OffsetPaging!
    ) {
        companies(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useCompaniesSelect = () => {
  return useSelect<GetFieldsFromList<any>>({
    resource: "companies",
    meta: {
      gqlQuery: COMPANIES_SELECT_QUERY,
    },
  });
};
