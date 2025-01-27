import React from 'react';
import { Text, View } from 'react-native';

interface ChatHeaderProps {
  name: string;
  lastName: string;
  userStatus: string;
  lastMessageTime: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, lastName, userStatus, lastMessageTime }) => {
  return (
    <View>
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 17,
        }}>
        {`${name} ${lastName}`}
      </Text>
      <Text
        style={{
          color: 'white',
          fontSize: 12,
          textAlign: 'center',
        }}>
        {userStatus === 'Online' ? userStatus : lastMessageTime}
      </Text>
    </View>
  );
};

export default ChatHeader;
