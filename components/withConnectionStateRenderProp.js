import React, { Fragment, Component } from 'react'
import { Animated, StyleSheet, Text, View, NetInfo } from 'react-native'

const resolveConnectionStatus = type => {
  switch (type) {
    case 'none':
    case 'unknown':
      return false
    case 'cellular':
    case 'wifi':
      return true
  }
}

export default class WithConnectionState extends Component {
  state = {
    isOnline: true
  }

  componentWillMount = async () => {
    const initialConnectionState = await NetInfo.getConnectionInfo()

    this.setState(() => ({
      isOnline: resolveConnectionStatus(initialConnectionState.type)
    }))

    this._netInfoListener = NetInfo.addEventListener(
      'connectionChange',
      info => {
        this.setState(() => ({
          isOnline: resolveConnectionStatus(info.type)
        }))
      }
    )
  }

  componentWillUnmount = () => {
    NetInfo.removeEventListener(this._netInfoListener)
  }

  render() {
    return <Fragment> {this.props.children(this.state.isOnline)} </Fragment>
  }
}
