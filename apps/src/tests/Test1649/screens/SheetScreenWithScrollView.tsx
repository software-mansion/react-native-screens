import * as React from 'react';
import {
  Button,
  View,
  ScrollView,
  Text,
} from 'react-native';

import CommonSheetContent from '../components/CommonSheetContent';

export default function SheetScreenWithScrollView() {
  const [additionalContentVisible, setAdditionalContentVisible] =
    React.useState(true);

  const svRef = React.useRef<ScrollView | null>(null);
  const contentRef = React.useRef<View | null>(null);

  return (
    <ScrollView ref={svRef} nestedScrollEnabled={false} scrollEnabled>
      <View ref={contentRef}>
        <CommonSheetContent />
        <Button
          title="Toggle content"
          onPress={() => setAdditionalContentVisible(old => !old)}
        />
        {additionalContentVisible &&
          [...Array(10).keys()].map(val => (
            <Text key={`${val}`}>Some component {val}</Text>
          ))}
      </View>
    </ScrollView>
  );
  // return (
  //   <ScrollView nestedScrollEnabled={true}>
  //     <SheetScreen navigation={navigation} />
  //     {[...Array(99).keys()].map(val => (
  //       <Text key={`${val}`}>Some component {val}</Text>
  //     ))}
  //   </ScrollView>
  // );
}

