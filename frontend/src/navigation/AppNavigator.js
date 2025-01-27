import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LoginScreen} from '../screens/LoginScreen';
import {ChatListScreen} from '../screens/ChatListScreen';
import {ChatScreen} from '../screens/ChatScreen';
import {UserProfileScreen} from '../screens/UserProfileScreen';
import {ArrowIconHeader} from '../components/ArrowIconHeader';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: 'Chats',
          tabBarIcon: ({color, size}) => (
            <Icon name="chat" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#6750a4',
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#6750a4',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'none',
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({navigation, route}) => ({
            headerStyle: {
              backgroundColor: '#6750a4',
            },
            headerTitle: () => (
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 17,
                }}>{`${route.params.contact?.name} ${route.params.contact?.lastName}`}</Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => (
              <ArrowIconHeader
                onPress={() => {
                  navigation.goBack();
                }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
