import {useTable} from "@refinedev/antd";
import {ADMINISTRATION_USERS_QUERY} from "@/routes/administration/queries";
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
