import React from "react";
import RootSiblings from "./RootSiblings";
import SnackBar from "./SnackBar";

export default class SnackBarManager {
    constructor() {
        this.current = null;
        this.queue = [];

        this.hideCurrent = null;
    }

    get = () => {
        return {
            current: this.current,
            queue: this.queue
        };
    };

    setCurrent = (props, callback) => {
        this.current = new RootSiblings(<SnackBar {...this} {...props} />);
        if (!!callback && typeof callback === "function") {
            callback();
        }
    };

    setHide = (func) => {
        this.hideCurrent = func;
    };

    add = (title, options, callback) => {
        const props = { title, ...options };

        if (this.current) {
            this.queue.push(props);
            if (!!callback && typeof callback === "function") {
                callback();
            }
            return;
        }

        this.setCurrent(props, callback);
    };

    show = (title, options, callback) => {
        const props = { title, ...options };

        props.onDismiss = (callback) => {
            this.removeCurrent(callback);
            if (!!options && !!options.onDismiss) {
                options.onDismiss();
            }
        };

        if (this.current) {
            if (this.isItemAlreadyExistById(props)) {
                return;
            }

            this.add(title, props, callback);
            return;
        }

        this.setCurrent(props, callback);
    };

    dismiss = (callback) => {
        if (!!this.hideCurrent) {
            this.hideCurrent(callback);
        }
    };

    removeCurrent = (callback) => {
        if (!this.current) {
            if (!!callback && typeof callback === "function") {
                callback();
            }
            return;
        }

        this.current.destroy(() => {
            this.current = null;
            this.hideCurrent = null;

            if (!this.queue.length) {
                if (!!callback && typeof callback === "function") {
                    callback();
                }
            } else {
                const current = this.queue.shift();
                this.setCurrent(current, callback);
            }
        });
    };

    isItemAlreadyExistById = (props) => {
        return props.id && this.queue.find(item => item.id === props.id);
    };
}
