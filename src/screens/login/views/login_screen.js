import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../../store/auth_slice';
import MyColor from '../../../constants/color';
import { Text } from '@rneui/themed';

// type RootStackParamList = {
//   BottomTab: undefined;
// };

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { signIn } = useAuth();

  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      Alert.alert('Login successful!');
      
      navigation.navigate('BottomTab');  
    } catch (err) {
      // const error = err as Error;
      Alert.alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNavSignUp = () => {

  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Text style={styles.textLogin}>Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.buttonSignIn} onPress={handleSignIn}>
          <Text style={styles.textSignIn}>Log In</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color={MyColor.primary} />
        )}

        <View style={styles.signUpContainer}>
          <Text style={{color: 'black'}}>Does not have an account? </Text>
          <TouchableOpacity onPress={handleNavSignUp}>
            <Text style={styles.textSignUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogin: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textTransform: 'capitalize',
    color: 'black',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 12,
    color: 'black',
  },
  buttonSignIn: {
    backgroundColor: MyColor.primary,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSignIn: {
    color: 'white',
    fontWeight: '800',
  },
  signUpContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  textSignUp: {
    color: MyColor.primary,
  },
});
