const crypto = require('crypto')
const _ = require('lodash/fp')
const convert = require('xml-js')

const genTimeStamp = () => (Date.now() / 1000) | 0

const genNonceStr = () => crypto.randomBytes(16).toString('hex')

// eslint-disable-next-line no-unused-vars
const trace = msg => {
  console.log('\n====> \ttrace:', msg)
  return msg
}

// s => o => s
const genSign = key =>
  _.pipe([
    _.pickBy(Boolean), // filter blank value
    _.toPairs,
    _.map(([k, v]) => `${k}=${v}`),
    _.sortBy(_.identity),
    _.join('&'),
    s => `${s}&key=${key}`,
    s =>
      crypto
        .createHash('md5')
        .update(s)
        .digest('hex')
        .toUpperCase()
  ])

const toXML = obj => convert.js2xml({ xml: obj }, { compact: true })
const toJS = xml => convert.xml2js(xml, { compact: true })
const format = _.pipe([
  toJS,
  x => x.xml, // remove xml tag
  _.mapValues(x => x._cdata) // remove _cdata tag
])

function parseXML(xml) {
  const js = format(xml)
  if (js.return_code !== 'SUCCESS') {
    console.error(js)
    throw new Error(js.return_msg)
  } else if (js.result_code !== 'SUCCESS') {
    console.error(js)
    throw new Error(`[${js.err_code}] ${js.err_code_des}`)
  } else {
    return js
  }
}

module.exports = {
  genNonceStr,
  genSign,
  genTimeStamp,
  parseXML,
  toJS,
  toXML
}
