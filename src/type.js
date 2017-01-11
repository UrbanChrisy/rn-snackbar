// @flow

export type SnackItemType = {
  title?: string,
  children?: string,

  // Button
  confirmText?: string,
  onConfirm?: Function,
  cancelText?: string,
  onCancel?: Function,

  // Style
  style?: Object,
  backgroundColor?: string,
  buttonColor?: string,
  textColor?: string,

  // Behaviour
  onAutoDismiss?: Function,
  fadeOutDuration?: number,
  duration?: number,
  isStatic?: boolean
}

export type StateType = {
  items: Array<SnackItemType>,
  current: ?SnackItemType
}

export type ActionType = {
  type: string,
  payload: SnackItemType
}