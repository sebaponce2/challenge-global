import type React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Avatar,
  Switch,
  Menu,
  IconButton,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUserStore, type UserProfile } from '../store/user.store';

export const UserProfileScreen = () => {
  const { profile, updateProfile, setStatus } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      updateProfile(tempProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const newAvatar = response.assets[0].uri;
        setTempProfile({ ...tempProfile, avatar: newAvatar || null });
      }
    });
  };

  const renderAvatar = () => {
    if (tempProfile.avatar) {
      return <Image source={{ uri: tempProfile.avatar }} style={styles.avatar} />;
    }
    return (
      <Avatar.Text
        size={100}
        label={tempProfile.username.substring(0, 2).toUpperCase()}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarChange} disabled={!isEditing}>
          {renderAvatar()}
          {isEditing && (
            <View style={styles.editAvatarIcon}>
              <IconButton
                icon="camera"
                size={24}
                iconColor="#fff"
                style={styles.cameraIcon}
                onPress={handleAvatarChange}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          label="Nombre de usuario"
          value={tempProfile.username}
          onChangeText={(text) =>
            setTempProfile({ ...tempProfile, username: text })
          }
          disabled={!isEditing}
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={tempProfile.email}
          onChangeText={(text) => setTempProfile({ ...tempProfile, email: text })}
          disabled={!isEditing}
          style={styles.input}
        />

        <View style={styles.statusContainer}>
          <Text>Estado de conexión:</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button onPress={() => setMenuVisible(true)}>
                {tempProfile.status.charAt(0).toUpperCase() +
                  tempProfile.status.slice(1)}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setStatus('online');
                setTempProfile({ ...tempProfile, status: 'online' });
                setMenuVisible(false);
              }}
              title="Online"
            />
            <Menu.Item
              onPress={() => {
                setStatus('offline');
                setTempProfile({ ...tempProfile, status: 'offline' });
                setMenuVisible(false);
              }}
              title="Offline"
            />
            <Menu.Item
              onPress={() => {
                setStatus('away');
                setTempProfile({ ...tempProfile, status: 'away' });
                setMenuVisible(false);
              }}
              title="Away"
            />
          </Menu>
        </View>

        <Button
          mode="contained"
          onPress={handleEditToggle}
          style={styles.editButton}
        >
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
});
