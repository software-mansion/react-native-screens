import React from 'react';
import {
  requireNativeComponent,
  View,
  StyleSheet,
  findNodeHandle,
} from 'react-native';

export const ScreenContext = React.createContext();

export const NativePeekableView = requireNativeComponent(
  'RNSPeekableView',
  null
);

export default class PeekableView extends React.Component {
  static traverseActions(actions, actionsMap) {
    const traversedAction = [];
    if (!actions) {
      return;
    }
    actions.forEach(currentAction => {
      if (currentAction.group) {
        const { group, ...clonedAction } = currentAction;
        clonedAction['group'] = this.traverseActions(group, actionsMap);
        traversedAction.push(clonedAction);
      } else {
        const { action, ...clonedAction } = currentAction;
        clonedAction['_key'] = actionsMap.length;
        actionsMap.push(action);
        traversedAction.push(clonedAction);
      }
    });
    return traversedAction;
  }

  static getDerivedStateFromProps(props) {
    const mappedActions = [];
    const traversedActions = PeekableView.traverseActions(
      props.previewActions,
      mappedActions
    );
    return {
      traversedActions,
      mappedActions,
    };
  }

  preview = React.createRef();
  previewView = React.createRef();
  childView = React.createRef();
  componentDidMount() {
    const childRef = React.Children.only(this.props.children)._nativeTag;
    setImmediate(() => {
      const node = this.context._ref._component;
      this.preview.current.setNativeProps({
        childRef: findNodeHandle(this.childView.current),
        screenRef: findNodeHandle(this.context._ref._component),
      });
    });
  }

  state = {
    visible: false,
  };

  onDisappear = () => {
    this.setState({
      visible: false,
    });
    this.props.onDisappear && this.props.onDisappear();
  };

  onPeek = () => {
    this.setState({
      visible: true,
    });
    this.props.onPeek && this.props.onPeek();
  };

  state = {
    traversedActions: [],
    mappedActions: [],
  };

  onActionsEvent = ({ nativeEvent: { key } }) => {
    this.state.mappedActions[key]();
  };

  render() {
    const { onPeek, onPop, onDisappear, previewActions, ...rest } = this.props;
    return (
      <React.Fragment>
        <View {...this.props} ref={this.childView}>
          {this.props.children}
        </View>
        <NativePeekableView
          onDisappear={this.onDisappear}
          onPeek={this.onPeek}
          onPop={this.props.onPop}
          ref={this.preview}
          previewActions={this.state.traversedActions}
          onAction={this.onActionsEvent}>
          <View style={StyleSheet.absoluteFill}>
            {this.state.visible ? this.props.renderPreview() : null}
          </View>
        </NativePeekableView>
      </React.Fragment>
    );
  }
}
PeekableView.contextType = ScreenContext;
