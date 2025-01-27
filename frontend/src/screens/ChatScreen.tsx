import type React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
    url: string;
  } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useFocusEffect(() => {
    getMessages(chatId, user!.id);
    setHeader();
  });

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
        body.content += `\n[${attachment.type}]\n${attachment.url}`;
      }

      postMessage(body);

      if (messageText.trim().length > 0) {
        socketRef.current?.emit('message', {
          chatId,
          message: {
            sender: user!.name,
            content: messageText.trim(),
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
            // Convierte el archivo a Base64
            const base64 = await RNFS.readFile(asset.uri, 'base64');
            setAttachment({
              type: asset.type?.startsWith('image/') ? 'image' : 'file',
              url: base64, // Guarda el contenido Base64 aquí
            });
          } catch (error) {
            console.error('Error al convertir a Base64:', error);
          }
        }
      }
    });
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isCurrentUser = item.sender === 'You';

    // Separar el contenido de los adjuntos (si están en el texto)
    const contentParts = item.content.split('\n'); // Dividimos por líneas
    const textContent = contentParts.filter(line => !line.startsWith('['));
    const attachmentLine = contentParts.find(line => line.startsWith('['));

    // Determinar tipo de adjunto
    let attachmentType = null;
    let attachmentUrl = null;

    if (attachmentLine) {
      const match = attachmentLine.match(/\[(image|file)]\n(.+)/); // Busca el tipo y la URL
      if (match) {
        attachmentType = match[1]; // 'image' o 'file'
        attachmentUrl = match[2]; // URL o Base64
      }
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
            style={{
              paddingBottom: 8,
              paddingTop: 8,
              paddingHorizontal: 12,
            }}>
            <Text
              style={[
                {color: 'white', marginBottom: 4, fontWeight: 'bold'},
                isCurrentUser
                  ? {alignSelf: 'flex-end'}
                  : {alignSelf: 'flex-start'},
              ]}>
              {item.sender}
            </Text>

            {/* Mostrar texto del mensaje si existe */}
            {textContent.length > 0 && (
              <Text style={{color: 'white'}}>{textContent.join('\n')}</Text>
            )}

            {attachmentType && attachmentUrl && (
              <View style={styles.attachmentContainer}>
                <IconButton
                  icon={attachmentType === 'image' ? 'image' : 'file-document'}
                  size={40}
                  iconColor="#000"
                  onPress={() => {
                    // Agregar lógica para abrir/ver archivo adjunto
                    console.log('Abrir adjunto:', attachmentUrl);
                  }}
                />
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
        {attachment && (
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
          onChangeText={setMessageText}
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
