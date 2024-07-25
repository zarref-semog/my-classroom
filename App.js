import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//  import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/home';
import AboutScreen from './src/screens/about';

const Tab = createBottomTabNavigator();
//  const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='About' component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//  function App() {
//      return (
//      <NavigationContainer>
//          <Stack.Navigator>
//          <Stack.Screen name='Home' component={HomeScreen} />
//          <Stack.Screen name='About' component={AboutScreen} />
//          </Stack.Navigator>
//      </NavigationContainer>
//      );
//  }

export default App;