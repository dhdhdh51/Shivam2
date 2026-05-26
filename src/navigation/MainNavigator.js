import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import AddFieldScreen from '../screens/AddFieldScreen';
import FieldDetailScreen from '../screens/FieldDetailScreen';
import RemindersScreen from '../screens/RemindersScreen';
import FinanceScreen from '../screens/FinanceScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="AddField" component={AddFieldScreen} />
    <Stack.Screen name="FieldDetail" component={FieldDetailScreen} />
  </Stack.Navigator>
);

const FinanceStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="FinanceMain" component={FinanceScreen} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
        tabBarIcon: ({color, size}) => {
          const icons = {
            Khet: 'sprout',
            Reminders: 'bell-ring',
            Finance: 'cash-multiple',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Khet" component={HomeStack} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Finance" component={FinanceStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
