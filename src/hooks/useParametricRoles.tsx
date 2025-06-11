import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface ParametricRole {
    id: string
    name: string
    display_name: string
    description: string
    level: number
    color: string
    permissions: string[]
}

export const useParametricRoles = () => {
    const { user } = useAuth()
    const [roles, setRoles] = useState<ParametricRole[]>([])
    const [permissions, setPermissions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUserRoles = async () => {
            if (!user) {
                setRoles([])
                setPermissions([])
                setIsLoading(false)
                return
            }

            try {
                console.log(
                    "🔍 useParametricRoles: Fetching roles for user:",
                    user.id
                )

                const { data, error } = await supabase.rpc(
                    "get_user_roles_v2",
                    {
                        _user_id: user.id,
                    }
                )

                if (error) {
                    console.error(
                        "❌ useParametricRoles: Error fetching roles:",
                        error
                    )
                    setRoles([])
                    setPermissions([])
                } else {
                    console.log(
                        "✅ useParametricRoles: Roles fetched successfully:",
                        data
                    )

                    const userRoles = data || []
                    const allPermissions = userRoles.reduce(
                        (acc: string[], role: any) => {
                            return [...acc, ...(role.permissions || [])]
                        },
                        []
                    )

                    setRoles(
                        userRoles.map((role: any) => ({
                            id: role.role_id,
                            name: role.role_name,
                            display_name: role.display_name,
                            description: "",
                            level: role.level,
                            color: "#3B82F6",
                            permissions: role.permissions || [],
                        }))
                    )

                    setPermissions([...new Set(allPermissions)])
                }
            } catch (error) {
                console.error("💥 useParametricRoles: Unexpected error:", error)
                setRoles([])
                setPermissions([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserRoles()
    }, [user])

    const hasPermission = (permission: string) =>
        permissions.includes(permission)

    const hasRole = (roleName: string) =>
        roles.some(role => role.name === roleName)

    const getHighestRole = () =>
        roles.reduce(
            (highest, current) =>
                current.level > highest.level ? current : highest,
            { level: 0, name: "user" } as ParametricRole
        )

    const isAdmin = hasRole("admin") || hasRole("super-admin")
    const isModerator = hasRole("moderator")
    const isDeveloper = hasRole("developer")

    return {
        roles,
        permissions,
        isLoading,
        hasPermission,
        hasRole,
        getHighestRole,
        isAdmin,
        isModerator,
        isDeveloper,
    }
}
