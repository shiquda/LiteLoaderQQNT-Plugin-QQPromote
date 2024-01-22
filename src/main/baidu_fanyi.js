/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-16 14:59:49
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-22 20:39:28
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const crypto = require('crypto');
const axios = require('axios');

async function baidu_fanyi(SourceText, appid, key){
    const salt = (new Date).getTime();
    const str1 = appid + SourceText + salt +key;
    // 创建 MD5 哈希对象
    const md5Hash = crypto.createHash('md5');
    // 更新哈希对象的数据
    md5Hash.update(str1);
    // 计算并输出 MD5 哈希值
    const sign = md5Hash.digest('hex');
    const fanyi_response = await axios.get('http://api.fanyi.baidu.com/api/trans/vip/translate',
        {
            params: {
                q: SourceText,
                appid: appid,
                salt: salt,
                from: 'auto',
                to: 'zh',
                sign: sign
            }
        }
    );
    const fanyi_data = fanyi_response.data;
    return {
        TargetText: fanyi_data?.trans_result?.[0]?.dst
    }
}

function output(...args) {
    console.log("\x1b[32m[QQ增强-百度翻译]\x1b[0m", ...args);
}

module.exports = {
    baidu_fanyi
};