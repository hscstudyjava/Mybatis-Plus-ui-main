import Cookies from 'js-cookie'


const sessionCache =
{

    set(key: any, value: any) {
        if (!sessionStorage) {
            return
        }
        if (key != null && value != null) {
            sessionStorage.setItem(key, value)
        }
    },
    get(key: any) {
        if (!sessionStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return sessionStorage.getItem(key)
    },
    setJSON(key: any, jsonValue: string) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },
    getJSON(key: any) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },
    remove(key: any) {
        sessionStorage.removeItem(key);
    }
}

const localCache = {
    set(key: any, value: any) {
        if (!localStorage) {
            return
        }
        if (key != null && value != null) {
            localStorage.setItem(key, value)
        }
    },
    get(key: any) {
        if (!localStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return localStorage.getItem(key)
    },
    setJSON(key: any, jsonValue: string) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },
    getJSON(key: any) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },
    remove(key: any) {
        localStorage.removeItem(key);
    }
}

/**
 * cookie存储
 */
const cookieCache = {
    set(key: string, value: any): boolean {
        if (!Cookies) {
            return false
        }
        if (key != null && value != null) {
            Cookies.set(key, value)
            return true
        }
        return false
    },
    setExpiredValue(key: string, value: any, expiredTime: number) {
        var m =new Date().getTime()+expiredTime
        
        if (!Cookies) {
            return false
        }
        if (key != null && value != null && expiredTime != null) {
            Cookies.set(key, value, {
                expires: new Date(m)
            })
            return true
        }
        return false
    },
    get(key: string):any {
        if (!Cookies) {
            return null
        }
        if (key == null) {
            return null
        }
        return Cookies.get(key)
    },
    setJSON(key: any, jsonValue: string) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },
    getJSON(key: any) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },
    remove(key: any) {
        Cookies.remove(key)
    }



}



export default {
    /** 
     * 本地存储
     */
    local: localCache,
    /** 
     * 会话存储
     */
    seesion: sessionCache,
    /** 
     * cookieCache
     */
    cookieCache


}