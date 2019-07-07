# wxpay 

[![node version](https://img.shields.io/node/v/@wongyouth/wxpay.svg?style=flat-square)](https://www.npmjs.com/package/@wongyouth/wxpay)
[![npm version](https://img.shields.io/npm/v/@wongyouth/wxpay/g.svg?style=flat-square)](https://www.npmjs.com/package/@wongyouth/wxpay)
[![license](https://img.shields.io/npm/l/@wongyouth/wxpay/g.svg?style=flat-square)](https://www.npmjs.com/package/@wongyouth/wxpay)
[![downloads](https://img.shields.io/npm/dt/@wongyouth/wxpay/g.svg?style=flat-square)](https://www.npmjs.com/package/wongyouth/wxpay)
[![build status](https://img.shields.io/travis/wongyouth/wxpay.svg?style=flat-square)](https://travis-ci.org/wongyouth/wxpay)


## 简介

支持多个商户ID，APPID, API_KEY，所有参数可通过参数传入。
参数使用官网相同的参数名。

目前仅支持[统一下单接口](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1)


## 使用方法

```js
const { unifiedOrder } = require('@wongyouth/wxpay')
const result = await unifedOrder({
  appid: '...',
  mch_id: '...',
  openid: '...',
  body: '...',
  total_fee: 101,
  spbill_create_ip: '...',
  api_key: '...'
})
```

`nonce_str`, `sign` 可不用传入，内部会自动取值。

## 沙盒支持

可通过设置环境变量指定沙盒调用的路径

```shell
export WXPAY_BASE_URL=https://api.mch.weixin.qq.com/sandboxnew
```