import gql from "graphql-tag";

export const COMPANY_QUOTES_TABLE_QUERY = gql`
    query CompanyQuotesTable(
        $filter: QuoteFilter!
        $sorting: [QuoteSort!]
        $paging: OffsetPaging!
    ) {
        quotes(filter: $filter, sorting: $sorting, paging: $paging) {
            totalCount
            nodes {
                id
                title
                status
                total
                company {
                    id
                    name
                }
                contact {
                    id
                    name
                    avatarUrl
                }
                salesOwner {
                    id
                    name
                    avatarUrl
                }
            }
        }
    }
`;
