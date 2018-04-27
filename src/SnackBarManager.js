import React from 'react'
import RootSiblings from 'react-native-root-siblings'

import SnackBar from './SnackBar'

class SnackBarManager {


    constructor() {
        this.current = null;
        this.queue = [];

        this.hideCurrent = null;
    }

    get = () => {
        return {
            current: this.current,
            queue: this.queue
        }
    };


    setCurrent = (props, callback) => {
        this.current = new RootSiblings(<SnackBar {...this} {...props}/>);
        if (!!callback) {
            callback()
        }
    };

    setHide = (func) => {
        this.hideCurrent = func;
    };


    add = (title, options, callback) => {
        const props = {title, ...options};

        if (this.current) {
            this.queue.push(props);
            if (!!callback) {
                callback()
            }
            return
        }

        this.setCurrent(props, callback)
    };

    show = (title, options, callback) => {

        console.log(this.current)
        const props = {title, ...options};

        props.onDismiss = (callback) => {
            this.removeCurrent(callback);
            if (!!options.onDismiss) {
                options.onDismiss();
            }
        };


        if (!!this.current) {

            if (this.isItemAlreadyExistById(props)) {
                return
            }

            this.add(title, options, callback);
            return
        }

        this.setCurrent(props, callback)
    };

    dismiss = (callback) => {
        this.hideCurrent(callback);
    };

    removeCurrent = (callback) => {

        if (!this.current) {
            if (!!callback) {
                callback()
            }
            return;
        }

        this.current.destroy(() => {
            this.current = null;
            this.hideCurrent = null;

            if (!this.queue.length) {
                callback();
                return
            }

            const current = this.queue.shift();
            this.setCurrent(current, callback)
        })
    };

    isItemAlreadyExistById = (props) => {
        return props.id && this.queue.find(item => item.id === props.id)
    }
}

export default new SnackBarManager();