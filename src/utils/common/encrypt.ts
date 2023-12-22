/** 
 * @author hsc
 * @since 2023-12-22 14:59:44
 * 
 * 通用加密解密相关工具类
 */
import CryptoJS from 'crypto-js';// Aes 对称加密库
import jsencrypt from 'jsencrypt';// Rsa 非对称加密库



/**
 * 对称解密
 */
export const useAes={

    /**
     * 
     * @param text 加密内容
     * @param key 密钥
     */
    aesEncrypt(text:string, key:string):string{
        const encryptedData = CryptoJS.AES.encrypt(text, key).toString();
        return encryptedData;
    },

    /**
     * 
     * @param encryptedData 数据
     * @param key key
     * @returns 
     */
    decryptSensitiveData(encryptedData:string, key:string):string{
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }

}