import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import left from '../assets/left.png';

export const ArrowIconHeader = ({onPress, screenName}) => {
  return (
    <TouchableOpacity onPress={screenName !== 'Home' ? onPress : () => {}}>
      <View style={{height: 24, width: 24, marginRight: 10, marginTop: 2}}>
        <Image
          style={{height: '100%', width: '100%', tintColor: 'white'}}
          source={left}
        />
      </View>
    </TouchableOpacity>
  );
};