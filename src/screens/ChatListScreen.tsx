import type React from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {List, Text, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useChatListStore, type Chat} from '../store/chatList.store';

type RootStackParamList = {
  ChatList: undefined;
  Chat: {chatId: number};
};

type ChatListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatList'
>;

export const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const {chats, setChats} = useChatListStore();

  useEffect(() => {
    // Usar los mocks proporcionados
    const mockChats: Chat[] = [
      {
        id: 1,
        contact: {
          name: 'John',
          lastName: 'Gonzales',
          id: '123456',
        },
        lastMessage: 'Hey, how are you?',
        lastMessageTime: '10:00 AM',
      },
      {
        id: 2,
        contact: {
          name: 'Maria',
          lastName: 'Lopez',
          id: '1234567',
        },
        lastMessage: 'Do you want to go out tonight?',
        lastMessageTime: 'yesterday',
      },
      {
        id: 3,
        contact: {
          name: 'Peter',
          lastName: 'Sanchez',
          id: '12345678',
        },
        lastMessage: "I'll be late for the meeting",
        lastMessageTime: '2 hours ago',
      },
    ];
    setChats(mockChats);
  }, [setChats]);

  const handleChatPress = (chatId: number) => {
    navigation.navigate('Chat', {chatId});
  };

  const renderChatItem = ({item}: {item: Chat}) => (
    <List.Item
      title={`${item.contact.name} ${item.contact.lastName}`}
      description={item.lastMessage}
      left={props => <List.Icon {...props} icon="account" />}
      right={() => <Text style={styles.time}>{item.lastMessageTime}</Text>}
      onPress={() => handleChatPress(1)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
