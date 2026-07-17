import React from 'react';
import { Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#111318' },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: '#111318' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'Image Prompt Analyzer',
              headerRight: () => (
                <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12}>
                  <Text style={{ color: '#60a5fa', fontSize: 15 }}>Settings</Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'API Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
