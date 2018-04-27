import React from 'react'
import RootSiblings from 'react-native-root-siblings'

import SnackBar from './SnackBar'

export default class SnackBarManager {
  constructor () {
    this.current = null
    this.queue = []

    this.hideCurrent = null
  }

  get = () => {
    return {
      current: this.current,
      queue: this.queue
    }
  };

  setCurrent = (props, callback) => {
    this.current = new RootSiblings(<SnackBar {...this} {...props} />)
    if (!!callback && typeof callback === 'function') {
      callback()
    }
  };

  setHide = (func) => {
    this.hideCurrent = func
  };

  add = (title, options, callback) => {
    const props = {title, ...options}

    if (this.current) {
      this.queue.push(props)
      if (!!callback && typeof callback === 'function') {
        callback()
      }
      return
    }

    this.setCurrent(props, callback)
  };

  show = (title, options, callback) => {
    const props = {title, ...options}

    props.onDismiss = (callback) => {
      this.removeCurrent(callback)
      if (options.onDismiss) {
        options.onDismiss()
      }
    }

    if (this.current) {
      if (this.isItemAlreadyExistById(props)) {
        return
      }

      this.add(title, props, callback)
      return
    }

    this.setCurrent(props, callback)
  };

  dismiss = (callback) => {
    this.hideCurrent(callback)
  };

  removeCurrent = (callback) => {
    if (!this.current) {
      if (!!callback && typeof callback === 'function') {
        callback()
      }
      return
    }

    this.current.destroy(() => {
      this.current = null
      this.hideCurrent = null

      console.log('callback', callback)

      if (!this.queue.length) {
        if (!!callback && typeof callback === 'function') {
          callback()
        }
      } else {
        const current = this.queue.shift()
        this.setCurrent(current, callback)
      }
    })

    console.log(this)
  };

  isItemAlreadyExistById = (props) => {
    return props.id && this.queue.find(item => item.id === props.id)
  }
}
