const expect = require('expect.js')

// for test isValidSign
const api_key = '192006250b4c09247ec02edce69f6a2d'

const { unifiedOrder, isValidSign } = require('../src/index')

describe('wxpay-mp', () => {
  describe.skip('unifiedOrder', () => {
    it('make a request call', async () => {
      const data = await unifiedOrder({
        out_trade_no: 'R0001',
        body: 'Just for test',
        total_fee: 101,
        spbill_create_ip: '122.122.111.111',
        api_key
      })
      expect(data).to.have.key('package')
    })
  })

  describe('isValidSign', () => {
    const body = {
      appid: 'wxd930ea5d5a258f4f',
      mch_id: '10000100',
      device_info: '1000',
      body: 'test',
      nonce_str: 'ibuaiVcKdpRxkhJA',
      desc: '',
      sign: '9A0A8659F005D6984697E2CA0A9CF3B7'
    }

    it('true', () => {
      expect(isValidSign(body, api_key)).to.be(true)
    })

    it('false', () => {
      const wrong = { ...body, x: 'x' }

      expect(isValidSign(wrong, api_key)).to.be(false)
    })
  })
})
