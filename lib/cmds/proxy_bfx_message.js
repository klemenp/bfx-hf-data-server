'use strict'

const debug = require('debug')('bfx:hf:data-server:cmds:proxy-bfx')
const sendError = require('../wss/send_error')
const ERRORS = require('../errors')

module.exports = async (ds, ws, msg, clientID) => {
  const { bfxProxies } = ds
  const proxy = bfxProxies[clientID]
  const [, bfxMessage] = msg

  if (!proxy) {
    return sendError(ws, ERRORS.BFX_PROXY.UNAVAILABLE)
  }

  if (proxy.isOpen()) {
    debug('proxying to bfx: %j', bfxMessage)
    proxy.send(bfxMessage)
  } else {
    debug('buffering bfx message: %j', bfxMessage)
    proxy._preOpenMessageBuffer.push(bfxMessage)
  }
}
