/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:56:56
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-18 15:43:52
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const crypto = require('crypto');
const axios = require('axios');

function sha256(message, secret = '', encoding) {
    const hmac = crypto.createHmac('sha256', secret)
    return hmac.update(message).digest(encoding)
}

function getHash(message, encoding = 'hex') {
    const hash = crypto.createHash('sha256')
    return hash.update(message).digest(encoding)
}

function getDate(timestamp) {
    const date = new Date(timestamp * 1000)
    const year = date.getUTCFullYear()
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
    const day = ('0' + date.getUTCDate()).slice(-2)
    return `${year}-${month}-${day}`
}

function get_authorization(params, timestamp, SECRET_ID, SECRET_KEY){
    const endpoint = "tmt.tencentcloudapi.com"
    const service = "tmt"
    const action = "TextTranslate"
    //时间处理, 获取世界时间日期
    const date = getDate(timestamp)
    const payload = JSON.stringify(params)

    // ************* 步骤 1：拼接规范请求串 *************
    const hashedRequestPayload = getHash(payload);
    const httpRequestMethod = "POST"
    const canonicalUri = "/"
    const canonicalQueryString = ""
    const canonicalHeaders = "content-type:application/json; charset=utf-8\n"
        + "host:" + endpoint + "\n"
        + "x-tc-action:" + action.toLowerCase() + "\n"
    const signedHeaders = "content-type;host;x-tc-action"

    const canonicalRequest = httpRequestMethod + "\n"
                         + canonicalUri + "\n"
                         + canonicalQueryString + "\n"
                         + canonicalHeaders + "\n"
                         + signedHeaders + "\n"
                         + hashedRequestPayload

    // ************* 步骤 2：拼接待签名字符串 *************
    const algorithm = "TC3-HMAC-SHA256"
    const hashedCanonicalRequest = getHash(canonicalRequest);
    const credentialScope = date + "/" + service + "/" + "tc3_request"
    const stringToSign = algorithm + "\n" +
                    timestamp + "\n" +
                    credentialScope + "\n" +
                    hashedCanonicalRequest
                    
    // ************* 步骤 3：计算签名 *************
    const kDate = sha256(date, 'TC3' + SECRET_KEY)
    const kService = sha256(service, kDate)
    const kSigning = sha256('tc3_request', kService)
    const signature = sha256(stringToSign, kSigning, 'hex')

    // ************* 步骤 4：拼接 Authorization *************
    const authorization = algorithm + " " +
                    "Credential=" + SECRET_ID + "/" + credentialScope + ", " +
                    "SignedHeaders=" + signedHeaders + ", " +
                    "Signature=" + signature
    return authorization
}

async function tencent_tmt(SourceText, SECRET_ID, SECRET_KEY){
    const data = {
        'SourceText': SourceText,
        'Source': 'auto',
        'Target': 'zh',
        'ProjectId': 0
    }
    const timestamp = Math.floor(Date.now() / 1000)
    const authorization = get_authorization(data, timestamp, SECRET_ID, SECRET_KEY)
    const url = 'https://tmt.tencentcloudapi.com'
    const config = {
        headers: {
            'Authorization':authorization,
            'Content-Type': 'application/json; charset=utf-8',
            'Host': 'tmt.tencentcloudapi.com',
            'X-TC-Action': 'TextTranslate',
            'X-TC-Timestamp': timestamp,
            'X-TC-Version': '2018-03-21',
            'X-TC-Region': 'ap-guangzhou'
        }
    }
    const tmt_response = await axios.post(url, data, config)
    const tmt_data = tmt_response.data.Response
    return tmt_data
}

function output(...args) {
    console.log("\x1b[32m[QQ增强-腾讯翻译]\x1b[0m", ...args);
}

module.exports = {
    tencent_tmt: tencent_tmt
};
