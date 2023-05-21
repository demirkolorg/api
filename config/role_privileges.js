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
        {
            key: "user_report",
            name: "User Report",
            group: "USERS",
            description: "User Report"
        },
        {
            key: "user_print",
            name: "User Print",
            group: "USERS",
            description: "User Print"
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
        {
            key: "role_report",
            name: "Role Report",
            group: "ROLES",
            description: "Roles Report"
        },
        {
            key: "role_print",
            name: "RoleUser Print",
            group: "ROLESUSERS",
            description: "Role Print"
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
        {
            key: "category_report",
            name: "Category Report",
            group: "CATEGORIES",
            description: "Category Report"
        },
        {
            key: "category_print",
            name: "Category Print",
            group: "CATEGORIES",
            description: "Category Print"
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