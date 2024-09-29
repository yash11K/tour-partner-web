import {useTable} from "@refinedev/antd";

import {User} from "@/rest-api/schema.types";

const UsersTable = () => {

    const {tableProps, filters} = useTable<User>({
        resource: "members",
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "first_name",
                    value: "",
                    operator: "contains",
                },
                {
                    field: "family_name",
                    value: "",
                    operator: "contains",
                },
            ],
        },
    });
}
