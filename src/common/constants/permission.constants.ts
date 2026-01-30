export const PERMISSION_CACHE_KEY = 'permissions_CACHE'

export const ABILITY_CACHE_KEY = (userId: number, roleId: number) => `ability:user_${userId}:role_${roleId}`

export const ABILITY_CACHE_TTL = 300
