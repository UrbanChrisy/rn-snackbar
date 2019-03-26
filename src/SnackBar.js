import React, { Component } from 'react'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

import { Animated, Easing, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

const DEFAULT_DURATION = 5000
const DEFAULT_FADEOUT_DURATION = 250
const INITIAL_POSITION_BOTTOM = -180
const INITIAL_POSITION_TOP = 0
const TO_POSITION_BOTTOM = 180
const TO_POSITION_TOP = -360

const STYLE_BANNER_COLOR: string = '#000000'
const TEXT_COLOR_ACCENT: string = '#0088ff'

const styles = StyleSheet.create({
  containerBottom: {
    flex: 1,
    position: 'absolute',
    bottom: INITIAL_POSITION_BOTTOM,
    left: 0,
    right: 0
  },

  containerTop: {
    flex: 1,
    position: 'absolute',
    top: INITIAL_POSITION_TOP,
    left: 0,
    right: 0
  },

  text: {
    padding: 15,
    fontSize: 16
  },

  inlineText: {
    flex: 1,
    padding: 15,
    fontSize: 16
  },

  buttonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10
  },

  button: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    marginBottom: 8
  },

  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18
  },

  flat: {
    fontSize: 14
  }
})

export default class SnackBar extends Component {
  static defaultProps = {
    // Behaviour
    fadeOutDuration: DEFAULT_FADEOUT_DURATION,
    duration: DEFAULT_DURATION,
    isStatic: false,

    // Functions
    onConfirm: Function,
    onCancel: Function,
    onAutoDismiss: Function,

    // Styles
    style: {},
    renderContent: null,
    backgroundColor: STYLE_BANNER_COLOR,
    buttonColor: TEXT_COLOR_ACCENT,
    textColor: 'white',
    position: 'bottom',
    buttonTextStyle: {},
    textStyle: {}

  }

  constructor (props) {
    super(props)

    this.state = {
      transformOffsetYTop: new Animated.Value(-180),
      transformOffsetYBottom: new Animated.Value(0),
      transformOpacity: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.props.setHide(this.hide)
    const {transformOpacity, transformOffsetYTop, transformOffsetYBottom} = this.state
    const {fadeOutDuration, duration, position, isStatic} = this.props
    const initialPosition = position === 'top' ? INITIAL_POSITION_TOP : INITIAL_POSITION_BOTTOM
    const transformOffsetY = position === 'top' ? transformOffsetYTop : transformOffsetYBottom

    Animated.parallel([
      Animated.timing(transformOpacity, {
        toValue: 1,
        duration: fadeOutDuration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(transformOffsetY, {
        toValue: initialPosition,
        duration: fadeOutDuration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      })
    ]).start(() => {
      if (isStatic) {
        return
      }
      this.setTimeout(() => {
        this.hide(() => {
        }, true)
      }, duration)
    })
  }

  hide = (callback, isAutoDismiss = false) => {
    const {transformOpacity, transformOffsetYTop, transformOffsetYBottom} = this.state
    const {fadeOutDuration, onAutoDismiss, onDismiss, position} = this.props

    const transformOffsetY = position === 'top' ? transformOffsetYTop : transformOffsetYBottom
    const toPosition = position === 'top' ? TO_POSITION_TOP : TO_POSITION_BOTTOM

    Animated.parallel([
      Animated.timing(transformOpacity, {
        toValue: 0,
        duration: fadeOutDuration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(transformOffsetY, {
        toValue: toPosition,
        easing: Easing.inOut(Easing.quad),
        duration: fadeOutDuration,
        useNativeDriver: true
      })
    ]).start(() => {
      onDismiss(callback)
      if (!!onAutoDismiss && isAutoDismiss) {
        onAutoDismiss()
      }
    })
  }

  renderButton = (text, onPress, style) => {
    const {buttonColor, buttonTextStyle} = this.props
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={[styles.button, style, {color: buttonColor}, buttonTextStyle]}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  renderContent = () => {
    const {confirmText, onConfirm, cancelText, onCancel, title, textColor, textStyle} = this.props

    const titleElement = (<Text style={[styles.text, {color: textColor}, textStyle]}>{title}</Text>)

    if (confirmText && cancelText) {
      return (
        <View>
          {titleElement}
          <View style={styles.actionRow}>
            {this.renderButton(cancelText, onCancel, styles.flat)}
            {this.renderButton(confirmText, onConfirm, styles.flat)}
          </View>
        </View>
      )
    }

    if (confirmText) {
      return (
        <View style={styles.inlineRow}>
          <Text style={[styles.inlineText, {color: textColor}]}>{title}</Text>
          {this.renderButton(confirmText, onConfirm)}
        </View>
      )
    }

    return titleElement
  }

  render () {
    const {style, renderContent, backgroundColor, position, tapToClose} = this.props

    const isTop = position === 'top'

    let transformOffsetY = this.state.transformOffsetYBottom
    let containerStyle = styles.containerBottom

    if (isTop) {
      transformOffsetY = this.state.transformOffsetYTop
      containerStyle = styles.containerTop
    }

    return (
      <TouchableWithoutFeedback onPress={() => tapToClose && this.hide()} style={{backgroundColor: 'transparent'}}>
        <Animated.View
          style={[containerStyle,
            {
              opacity: this.state.transformOpacity,
              transform: [{translateY: transformOffsetY}],
              backgroundColor
            },
            style
          ]}>
          {renderContent ? renderContent() : this.renderContent()}
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

reactMixin(SnackBar.prototype, TimerMixin)
