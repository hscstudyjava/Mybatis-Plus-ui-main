import { AuthCacheConstant } from './CacheConstatns'
import cache from './CacheUtils'


/************访问Token存储************************** */

export function setAccessToken(accessToken: string) {
    if (accessToken == null && accessToken=="") return false
    cache.cookieCache.set(AuthCacheConstant.ACCESS_TOKEN_KEY, accessToken)
}

export function setAccessTokenExpire(accessToken: string, expireTime: number): boolean {
    if (accessToken == null && accessToken=="") return false
    return cache.cookieCache.setExpiredValue(AuthCacheConstant.ACCESS_TOKEN_KEY, accessToken, expireTime)
}

export function getAccessToken() {
    let accessToken= cache.cookieCache.get(AuthCacheConstant.ACCESS_TOKEN_KEY)
    if(accessToken==null && accessToken==""){
        return
    }
    return accessToken
}

export function removeAccessToken() {
    cache.cookieCache.remove(AuthCacheConstant.ACCESS_TOKEN_KEY)
}


/******************刷新Token*********************** */
export function seteRefreshToken(refreshToken: string) {
    if (refreshToken == null && refreshToken=="") return false
    cache.local.set(AuthCacheConstant.REFRESH_TOKEN_KEY, refreshToken)
}

export function getRefreshToken(): string | null{
    let refreshToekn= cache.local.get(AuthCacheConstant.REFRESH_TOKEN_KEY) as string
    if(refreshToekn==null && refreshToekn==""){
        return null
    }
    return refreshToekn
}

export function removeRefreshToken() {
    cache.local.remove(AuthCacheConstant.REFRESH_TOKEN_KEY)
}