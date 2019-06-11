import React from 'react';
import {
  requireNativeComponent,
  View,
  StyleSheet,
  findNodeHandle,
  Dimensions,
} from 'react-native';

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
  sourceView = React.createRef();
  componentDidMount() {
    this.preview.current.setNativeProps({
      childRef: findNodeHandle(this.sourceView.current),
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
    const { width, height } = Dimensions.get('window');
    return (
      <React.Fragment>
        <View {...this.props} ref={this.sourceView}>
          <NativePeekableView
            style={[StyleSheet.absoluteFillObject, { backgroundColor: 'red' }]}
            onDisappear={this.onDisappear}
            onPeek={this.onPeek}
            onPop={this.props.onPop}
            ref={this.preview}
            previewActions={this.state.traversedActions}
            onAction={this.onActionsEvent}>
            {/* Renders nothing and inside view bound to the screen used by controller */}
            <View style={{ width: 0, height: 0 }}>
              <View style={{ width, height }}>
                {this.state.visible ? this.props.renderPreview() : null}
              </View>
            </View>
          </NativePeekableView>
          {this.props.children}
        </View>
      </React.Fragment>
    );
  }
}
