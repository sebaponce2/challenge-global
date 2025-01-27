import type React from 'react';
import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {useAuthStore} from '../store/auth.store';
import {validateEmail, validatePassword} from '../utils/validations';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  TabNavigator: {screen: 'ChatList'};
};

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore(state => state.login);

  type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
  >;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    let isValid = true;

    // Validaciones del formulario
    if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese un email válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      try {
        await login(email);
        navigation.navigate('TabNavigator', {
          screen: 'ChatList',
        });
      } catch (error) {
        isValid = false;
        setEmailError('Usuario no encontrado');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        error={!!emailError}
        style={styles.input}
      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        mode="outlined"
        error={!!passwordError}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <HelperText type="error" visible={!!passwordError}>
        {passwordError}
      </HelperText>
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});
