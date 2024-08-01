import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ClassroomsScreen } from './src/screens/ClassroomsScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { StudentsScreen } from './src/screens/StudentsScreen';
import { ActivitiesScreen } from './src/screens/ActivitiesScreen';
import { AttendancesScreen } from './src/screens/AttendancesScreen';
import { AssessmentsScreen } from './src/screens/AssessmentsScreen';
import { ScoresScreen } from './src/screens/ScoresScreen';
import { SQLiteProvider } from 'expo-sqlite';
import initializeDatabase from './src/database/database-init';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyClassroomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, }}>
      <Tab.Screen name='Classes' component={ClassroomsScreen} />
      <Tab.Screen name='Activities' component={ActivitiesScreen} />
      <Tab.Screen name='Schedule' component={SchedulesScreen} />
    </Tab.Navigator>
  );
}

function MyClassroomStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ClassroomTabs' component={MyClassroomTabs} />
      <Stack.Screen name='Students' component={StudentsScreen} />
      <Stack.Screen name='Attendances' component={AttendancesScreen} />
      <Stack.Screen name='Assessments' component={AssessmentsScreen} />
      <Stack.Screen name='Scores' component={ScoresScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <SQLiteProvider databaseName="MyClassroom.db" onInit={initializeDatabase}>
        <MyClassroomStack />
      </SQLiteProvider>
    </NavigationContainer>
  );
}

export default App;