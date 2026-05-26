import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import PushNotification from 'react-native-push-notification';
import MainNavigator from './src/navigation/MainNavigator';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  permissions: {alert: true, badge: true, sound: true},
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: 'kisan-sathi-reminders',
    channelName: 'Kisan Sathi Reminders',
    channelDescription: 'Watering and fertilizer reminders',
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => console.log(`Channel created: ${created}`),
);

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
