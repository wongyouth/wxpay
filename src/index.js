const debug = require('debug')('wxpay')
const _ = require('lodash')
const fly = require('flyio')

const {
  genNonceStr,
  genTimeStamp,
  genSign,
  toXML,
  parseXML
} = require('./util')

const UNIFIED_ORDER_URL = '/pay/unifiedorder'

fly.config.baseURL =
  process.env.WXPAY_BASE_URL || 'https://api.mch.weixin.qq.com'
fly.config.headers = { 'Content-Type': 'text/plain' }

async function unifiedOrder({
  appid = APP_ID,
  mch_id = MCH_ID,
  sub_appid,
  sub_mch_id,
  device_info,
  nonce_str = genNonceStr(),
  body,
  detail,
  attach,
  fee_type,
  total_fee,
  spbill_create_ip,
  time_start,
  time_expire,
  goods_tag,
  notify_url = NOTIFY_URL,
  trade_type = 'JSAPI',
  limit_pay,
  out_trade_no,
  openid,
  sub_openid,
  receipt,
  scene_info,
  api_key
} = {}) {
  const params = _.pickBy(
    {
      notify_url,
      appid,
      mch_id,
      sub_appid,
      sub_mch_id,
      device_info,
      nonce_str,
      body,
      detail,
      attach,
      fee_type,
      total_fee,
      spbill_create_ip,
      time_start,
      time_expire,
      goods_tag,
      notify_url,
      trade_type,
      limit_pay,
      out_trade_no,
      openid,
      sub_openid,
      receipt,
      scene_info
    },
    Boolean
  )

  const calcSign = genSign(api_key)
  params.sign = calcSign(params)
  const xml = toXML(params)
  debug('xml', xml)
  const res = await fly.post(UNIFIED_ORDER_URL, xml)
  debug('req', res.request)
  debug('res', res.response.body)
  const result = parseXML(res.response.body)
  const data = {
    appId: APP_ID,
    timeStamp: String(genTimeStamp()),
    nonceStr: result.nonce_str,
    package: `prepay_id=${result.prepay_id}`,
    signType: 'MD5'
  }
  data.paySign = calcSign(data)
  return { result: 'ok', data }
}

// Check sign value for notify content
function isValidSign(body, api_key) {
  const calcSign = genSign(api_key)
  return body.sign === calcSign(_.omit(body, 'sign'))
}

module.exports = {
  unifiedOrder,
  isValidSign
}
