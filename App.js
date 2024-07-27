import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MyClassesScreen } from './src/screens/MyClassesScreen';
import { MyScheduleScreen } from './src/screens/MyScheduleScreen';
import { MyStudentsScreen } from './src/screens/MyStudentsScreen';
import { MyActivitiesScreen } from './src/screens/MyActivitiesScreen';
import { MyAttendancesScreen } from './src/screens/MyAttendanceScreen';
import { MyAssessmentsScreen } from './src/screens/MyAssessmentsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyClassroomTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name='Classes' component={MyClassesScreen} />
      <Tab.Screen name='Activities' component={MyActivitiesScreen} />
      <Tab.Screen name='Schedule' component={MyScheduleScreen} />
    </Tab.Navigator>
  );
}

function MyClassroomStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='ClassroomTabs' component={MyClassroomTabs} />
      <Stack.Screen name='Students' component={MyStudentsScreen} />
      <Stack.Screen name='Attendances' component={MyAttendancesScreen} />
      <Stack.Screen name='Assessments' component={MyAssessmentsScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyClassroomStack />
    </NavigationContainer>
  );
}

export default App;