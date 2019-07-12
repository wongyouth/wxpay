const expect = require('expect.js')
const { genNonceStr, genTimeStamp, genSign, parseXML } = require('../src/util')

describe('util', function() {
  describe('genNonceStr', function() {
    it('length <= 32', function() {
      expect(genNonceStr().length).to.be.lessThan(33)
    })
  })

  describe('getTimeStamp', function() {
    it('is integer', function() {
      expect(genTimeStamp()).to.be.a('number')
    })
  })

  describe('genSign', function() {
    const mch_id = '10000100',
      app_id = 'wxd930ea5d5a258f4f',
      api_key = '192006250b4c09247ec02edce69f6a2d'

    it('get sign', function() {
      const params = {
        appid: app_id,
        mch_id: mch_id,
        device_info: '1000',
        body: 'test',
        nonce_str: 'ibuaiVcKdpRxkhJA'
      }

      expect(genSign(api_key)(params)).to.be.eql(
        '9A0A8659F005D6984697E2CA0A9CF3B7'
      )
    })

    it('filter blank value', function() {
      const params = {
        appid: app_id,
        mch_id: mch_id,
        device_info: '1000',
        body: 'test',
        nonce_str: 'ibuaiVcKdpRxkhJA',
        desc: ''
      }

      expect(genSign(api_key)(params)).to.be.eql(
        '9A0A8659F005D6984697E2CA0A9CF3B7'
      )
    })
  })

  describe('parseXML', () => {
    it('convert to js', () => {
      const xml = `
        <xml>
          <trade_type><![CDATA[NATIVE]]></trade_type>
          <prepay_id><![CDATA[wx20190626230121136890]]></prepay_id>
          <nonce_str><![CDATA[b1921511c42f53e1e04b5c5c18b59325]]></nonce_str>
          <return_code><![CDATA[SUCCESS]]></return_code>
          <err_code_des><![CDATA[ok]]></err_code_des>
          <sign><![CDATA[C179061D57358A20EDAD7D5DDCBA8004]]></sign>
          <mch_id><![CDATA[1539826321]]></mch_id>
          <return_msg><![CDATA[OK]]></return_msg>
          <appid><![CDATA[wx1650e054787ce3d7]]></appid>
          <device_info><![CDATA[sandbox]]></device_info>
          <code_url><![CDATA[weixin://wxpay/s/An4baqw]]></code_url>
          <result_code><![CDATA[SUCCESS]]></result_code>
          <total_fee>1</total_fee>
          <err_code><![CDATA[SUCCESS]]></err_code>
        </xml>
      `

      expect(parseXML(xml)).to.eql({
        trade_type: 'NATIVE',
        prepay_id: 'wx20190626230121136890',
        nonce_str: 'b1921511c42f53e1e04b5c5c18b59325',
        return_code: 'SUCCESS',
        err_code_des: 'ok',
        sign: 'C179061D57358A20EDAD7D5DDCBA8004',
        mch_id: '1539826321',
        return_msg: 'OK',
        appid: 'wx1650e054787ce3d7',
        device_info: 'sandbox',
        total_fee: 1,
        code_url: 'weixin://wxpay/s/An4baqw',
        result_code: 'SUCCESS',
        err_code: 'SUCCESS'
      })
    })

    it('return_code FAIL', () => {
      const xml = `
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[签名失败]]></return_msg>
        </xml>
      `

      expect(() => parseXML(xml)).to.throwError(/签名失败/)
    })

    it('result_code FAIL', () => {
      const xml = `
        <xml>
          <return_code><![CDATA[SUCCESS]]></return_code>
          <return_msg><![CDATA[OK]]></return_msg>
          <result_code><![CDATA[FAIL]]></result_code>
          <err_code><![CDATA[1000]]></err_code>
          <err_code_des><![CDATA[not found]]></err_code_des>
        </xml>
      `

      expect(() => parseXML(xml)).to.throwError(/not found/)
    })
  })
})
