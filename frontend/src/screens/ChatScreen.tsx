import type React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {TextInput, Button, Text, Card, IconButton} from 'react-native-paper';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import {useChatStore, type Message} from '../store/chat.store';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAuthStore} from '../store/auth.store';
import ChatHeader from '../components/ChatHeader';
import RNFS from 'react-native-fs';
import {io} from 'socket.io-client';

type RootStackParamList = {
  ChatScreen: {chatId: number; contact: {name: string; lastName: string}};
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const {chatId} = route.params;
  const {chat, getMessages, postMessage, updateChat} = useChatStore();
  const {user} = useAuthStore();
  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState<{
    type: 'image' | 'file';
    content: string;
    name: string;
    text: string;
  } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    getMessages(chatId, user!.id);
    setHeader();
  }, []);

  useEffect(() => {
    handleSocket();

    return () => {
      if (!socketRef.current?.connected) {
        socketRef.current?.connect();
      }
    };
  }, []);

  const handleSocket = async () => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:8080');

      socketRef.current.on('connect', () => {
        socketRef.current?.emit('join', chatId);
      });

      socketRef.current.on('message', received => {
        if (received.chatId === chatId) {
          updateChat(received);
        }
      });
    }
  };

  const setHeader = () => {
    if (chat) {
      navigation.setOptions({
        headerTitle: () => (
          <ChatHeader
            name={route.params.contact?.name}
            lastName={route.params.contact?.lastName}
            userStatus={chat?.status ?? ''}
            lastMessageTime={chat?.lastSeen ?? ''}
          />
        ),
      });
    }
  };

  const handleSend = () => {
    if (messageText.trim() || attachment) {
      const body: any = {
        chatId: chatId,
        senderId: user!.id,
        content: messageText.trim(),
      };

      if (attachment) {
        body.content = JSON.stringify(attachment); // Convertimos el adjunto a JSON
      }

      postMessage(body);

      if (messageText.trim().length > 0 || attachment) {
        socketRef.current?.emit('message', {
          chatId,
          message: {
            sender: user!.name,
            content: body.content,
            time: new Date().toLocaleTimeString([], {
              hour: 'numeric',
              minute: 'numeric',
            }),
          },
        });
      }

      setMessageText('');
      setAttachment(null);
    }
  };

  const handleAttachment = async () => {
    launchImageLibrary({mediaType: 'mixed'}, async response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];

        if (asset.uri) {
          try {
            const base64 = await RNFS.readFile(asset.uri, 'base64');
            setAttachment({
              content: base64,
              type: asset.type?.startsWith('image/') ? 'image' : 'file',
              name: asset.fileName || 'Archivo adjunto',
              text: messageText.trim(),
            });
            console.log('messageText:', messageText);
          } catch (error) {
            console.error('Error al convertir a Base64:', error);
          }
        }
      }
    });
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isCurrentUser = item.sender === 'You';

    let contentData;
    let isJsonContent = false;

    try {
      contentData = JSON.parse(item.content);
      isJsonContent = !!contentData.type && !!contentData.content;
    } catch (e) {
      contentData = item.content;
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUser : styles.otherUser,
        ]}>
        <Card
          style={isCurrentUser ? styles.currentUserCard : styles.otherUserCard}>
          <Card.Content
            style={{paddingBottom: 8, paddingTop: 8, paddingHorizontal: 12}}>
            <Text
              style={[
                {color: 'white', marginBottom: 4, fontWeight: 'bold'},
                isCurrentUser
                  ? {alignSelf: 'flex-end'}
                  : {alignSelf: 'flex-start'},
              ]}>
              {item.sender}
            </Text>

            {/* Renderizamos contenido si es texto común */}
            {!isJsonContent && (
              <Text style={{color: 'white'}}>{contentData}</Text>
            )}

            {/* Renderizamos contenido si es JSON */}
            {isJsonContent && contentData.type === 'image' && (
              <>
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${contentData.content}`,
                  }}
                  style={{
                    width: 150,
                    height: 150,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                />
                {contentData.text?.trim() !== '' && (
                  <Text style={{color: 'white', marginTop: 4}}>
                    {contentData?.text?.trim()}
                  </Text>
                )}
              </>
            )}
            {isJsonContent && contentData.type === 'file' && (
              <View style={styles.attachmentContainer}>
                <IconButton
                  icon="file-document"
                  size={40}
                  iconColor="#000"
                  onPress={() =>
                    console.log('Abrir archivo:', contentData.content)
                  }
                />
                <Text style={{color: '#000'}}>{contentData.name}</Text>
              </View>
            )}

            <Text style={styles.timestamp}>{item.time}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <FlatList
        ref={flatListRef}
        data={chat?.messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
      />
      <View style={styles.inputContainer}>
        {attachment?.type && (
          <View style={styles.attachmentPreview}>
            <IconButton
              icon={attachment.type === 'image' ? 'image' : 'file-document'}
              size={30}
              iconColor="#000"
            />
          </View>
        )}
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={e => {
            if (attachment?.content) {
              setAttachment({...attachment, text: e});
            }
            setMessageText(e);
          }}
          placeholder="Escribe un mensaje..."
        />
        <IconButton
          icon="paperclip"
          size={24}
          iconColor="#000"
          onPress={handleAttachment}
        />
        <Button
          style={{backgroundColor: '#6750a4'}}
          mode="contained"
          onPress={handleSend}>
          Enviar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  currentUser: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  otherUser: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  currentUserCard: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: '#6750a4',
  },
  otherUserCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: '#2e373d',
  },
  messageCard: {
    borderRadius: 20,
  },
  timestamp: {
    fontSize: 10,
    color: 'white',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  attachmentContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});
