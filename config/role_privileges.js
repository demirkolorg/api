module.exports = {
    privGroups: [
        {
            id: "USERS",
            name: "User Permissions",
        },
        {
            id: "ROLES",
            name: "Role Permissions",
        },
        {
            id: "CATEGORIES",
            name: "Category Permissions",
        },
        {
            id: "AUTDITLOGS",
            name: "AuditLog Permissions",
        }
    ],
    privileges: [
        //* USERS
        {
            key: "user_view",
            name: "User View",
            group: "USERS",
            description: "User View"
        },
        {
            key: "user_add",
            name: "User Add",
            group: "USERS",
            description: "User Add"
        },
        {
            key: "user_update",
            name: "User Update",
            group: "USERS",
            description: "User Update"
        },
        {
            key: "user_delete",
            name: "User Delete",
            group: "USERS",
            description: "User Delete"
        },
        //* ROLES
        {
            key: "role_view",
            name: "Role View",
            group: "ROLES",
            description: "Role View"
        },
        {
            key: "role_add",
            name: "Role Add",
            group: "ROLES",
            description: "Role Add"
        },
        {
            key: "role_update",
            name: "Role Update",
            group: "ROLES",
            description: "Role Update"
        },
        {
            key: "role_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Role Delete"
        },
        //* CATEGORIES
        {
            key: "category_view",
            name: "Category View",
            group: "CATEGORIES",
            description: "Category View"
        },
        {
            key: "category_add",
            name: "Category Add",
            group: "CATEGORIES",
            description: "Category Add"
        },
        {
            key: "category_update",
            name: "Category Update",
            group: "CATEGORIES",
            description: "Category Update"
        },
        {
            key: "category_delete",
            name: "Category Delete",
            group: "CATEGORIES",
            description: "Category Delete"
        },

        //* AUDITLOGS
        {
            key: "auditlogs_view",
            name: "Auditlogs View",
            group: "AUDITLOGS",
            description: "Auditlogs View"
        }
    ]
}