import type React from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {List, Text, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useChatListStore} from '../store/chatList.store';
import {useAuthStore} from '../store/auth.store';

type RootStackParamList = {
  ChatList: undefined;
  Chat: {chatId: number; contact: {name: string; lastName: string}};
};

type ChatListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatList'
>;

export const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const {getChats, chats} = useChatListStore();
  const {user} = useAuthStore();

  useEffect(() => {
    getChats(user!.id);
  }, []);

  const handleChatPress = (chatId: number, contact: any) => {
    navigation.navigate('Chat', {chatId, contact});
  };

  const renderChatItem = ({item}: {item: ChatList}) => {
    let contentData;
    let isJsonContent = false;

    try {
      contentData = JSON.parse(item.lastMessage);
      isJsonContent = !!contentData.type && !!contentData.content;
    } catch (e) {
      contentData = item.lastMessage;
    }
    return (
      <List.Item
        title={`${item.contact.name} ${item.contact.lastName}`}
        description={
          contentData.type &&
          (contentData.type === 'image' || contentData.type === 'file')
            ? contentData.type
            : contentData
        }
        left={props => <List.Icon {...props} icon="account" />}
        right={() => <Text style={styles.time}>{item.lastMessageTime}</Text>}
        onPress={() => handleChatPress(item.id, item.contact)}
      />
    );
  };

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
