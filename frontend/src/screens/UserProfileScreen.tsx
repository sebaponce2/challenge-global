import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { TextInput, Button, Text, Avatar, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuthStore } from '../store/auth.store';
import RNFS from 'react-native-fs';

export const UserProfileScreen = () => {
  const { updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuthStore();
  const [body, setBody] = useState<any>(user!);
  const [statusOptions] = useState(['Online', 'Offline']);

  const handleSaveChanges = () => {
    if (isEditing) {
      updateUser({...body!, userId: user!.id!});
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;

        try {
          const base64Image = await RNFS.readFile(uri!, 'base64');
          setBody({ ...body!, photo: `data:image/jpeg;base64,${base64Image}` });
        } catch (error) {
          console.error('Error al convertir la imagen a base64:', error);
        }
      }
    });
  };

  const renderAvatar = () => {
    if (body!.photo) {
      return <Image source={{ uri: body!.photo }} style={styles.avatar} />;
    }
    return <Avatar.Text size={100} label={body!.name!.substring(0, 2).toUpperCase()} />;
  };

  const handleStatusChange = (status: string) => {
    setBody({ ...body!, status });
    setMenuVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarChange} disabled={!isEditing}>
          {renderAvatar()}
          {isEditing && (
            <View style={styles.editAvatarIcon}>
              <IconButton icon="camera" size={24} iconColor="#fff" style={styles.cameraIcon} onPress={handleAvatarChange} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          label="Nombre"
          value={body!.name!}
          onChangeText={text => setBody({ ...body!, name: text })}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Apellido"
          value={body!.last_name!}
          onChangeText={text => setBody({ ...body!, last_name: text })}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={body!.email}
          onChangeText={text => setBody({ ...body!, email: text })}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Telefono"
          value={body!.phone}
          onChangeText={text => setBody({ ...body!, phone: text })}
          disabled={!isEditing}
          style={styles.input}
        />
        <View style={styles.statusContainer}>
          <Text>Estado de conexión:</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)} disabled={!isEditing}>
            <Button>{body!.status}</Button>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={statusOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => handleStatusChange(item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Button mode="contained" onPress={handleSaveChanges} style={styles.editButton}>
          {isEditing ? 'Guardar cambios' : 'Editar perfil'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 2,
  },
  cameraIcon: {
    backgroundColor: '#007AFF',
  },
  content: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  editButton: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
