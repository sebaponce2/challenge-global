import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { TextInput, Button, Text, Card } from "react-native-paper"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { useChatStore, type Message } from "../store/chat.store"
import { launchImageLibrary } from "react-native-image-picker"
import Icon from "react-native-ionicons"

type RootStackParamList = {
  ChatScreen: { contactId: string }
}

type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>()
  const { contactId } = route.params
  const { specificChats, chats, addMessage } = useChatStore()
  const chat = specificChats.find((c) => c.contactId === contactId)
  const contactInfo = chats.find((c) => c.contact.id === contactId)?.contact
  const [messageText, setMessageText] = useState("")
  const [attachment, setAttachment] = useState<{ type: "image" | "file"; url: string } | null>(null)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    // Simular recepción de mensajes cada 10 segundos
    const interval = setInterval(() => {
      const newMessage: Message = {
        sender: contactInfo?.name || "",
        content: `Mensaje automático ${Date.now()}`,
        time: new Date().toLocaleTimeString(),
      }
      addMessage(contactId, newMessage)
    }, 10000)

    return () => clearInterval(interval)
  }, [contactId, addMessage, contactInfo])

  const handleSend = () => {
    if (messageText.trim() || attachment) {
      const newMessage: Message = {
        sender: "You",
        content: messageText.trim(),
        time: new Date().toLocaleTimeString(),
        attachment: attachment || undefined,
      }
      addMessage(contactId, newMessage)
      setMessageText("")
      setAttachment(null)
    }
  }

  const handleAttachment = () => {
    launchImageLibrary({ mediaType: "mixed" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0]
        setAttachment({
          type: asset.type?.startsWith("image/") ? "image" : "file",
          url: asset.uri || "",
        })
      }
    })
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.sender === "You"
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUser : styles.otherUser]}>
        <Card style={styles.messageCard}>
          <Card.Content>
            <Text>{item.content}</Text>
            {item.attachment && (
              <View style={styles.attachmentContainer}>
                {item.attachment.type === "image" ? (
                  <Icon name="image" size={50} color="#000" />
                ) : (
                  <Icon name="document" size={50} color="#000" />
                )}
              </View>
            )}
            <Text style={styles.timestamp}>{item.time}</Text>
          </Card.Content>
        </Card>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Text style={styles.title}>{`${contactInfo?.name} ${contactInfo?.lastName}`}</Text>
      <FlatList
        ref={flatListRef}
        data={chat?.messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        {attachment && (
          <View style={styles.attachmentPreview}>
            <Icon name={attachment.type === "image" ? "image" : "document"} size={40} color="#000" />
            <TouchableOpacity onPress={() => setAttachment(null)}>
              <Icon name="close-circle" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={handleAttachment}>
          <Icon name="attach" size={24} color="#000" />
        </TouchableOpacity>
        <Button mode="contained" onPress={handleSend}>
          Enviar
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: "80%",
  },
  currentUser: {
    alignSelf: "flex-end",
  },
  otherUser: {
    alignSelf: "flex-start",
  },
  messageCard: {
    borderRadius: 20,
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  attachmentContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  attachmentPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
})

