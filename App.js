import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ClassroomsScreen } from './src/screens/ClassroomsScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { ActivitiesScreen } from './src/screens/ActivitiesScreen';
import { ScoresScreen } from './src/screens/ScoresScreen';
import { SQLiteProvider } from 'expo-sqlite';
import { MenuProvider } from 'react-native-popup-menu';
import initializeDatabase from './src/database/database-init';
import { AttendancesStudentsScreen } from './src/screens/AttendancesStudentsScreen';
import { NewAttendancesStudentsScreen } from './src/screens/NewAttendancesStudentsScreen';
import { AssessmentsScreen } from './src/screens/AssessmentsScreen';
import { AttendancesScreen } from './src/screens/AttendancesScreen';
import { StudentsScreen } from './src/screens/StudentsScreen';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

function MyClassroomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Classrooms') {
            return <Icon name='graduation-cap' type='font-awesome' size={size} color={color} />;
          } else if (route.name === 'Activities') {
            return <Icon name='book' type='font-awesome' size={size} color={color} />;
          } else if (route.name === 'Schedule') {
            return <Icon name='calendar' type='font-awesome' size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#7dace3',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: '#4a90e2'
        },
        headerShown: false,
        tabBarShowLabel: false
      })}
    >
      <Tab.Screen name='Classrooms' component={ClassroomsScreen} options={{unmountOnBlur: true}} />
      <Tab.Screen name='Activities' component={ActivitiesScreen} options={{unmountOnBlur: true}} />
      <Tab.Screen name='Schedule' component={SchedulesScreen} options={{unmountOnBlur: true}} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function MyClassroomStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ClassroomTabs' component={MyClassroomTabs} />
      <Stack.Screen name='Students' component={StudentsScreen} />
      <Stack.Screen name='Attendances' component={AttendancesScreen} />
      <Stack.Screen name='AttendancesStudents' component={AttendancesStudentsScreen} />
      <Stack.Screen name='NewAttendancesStudents' component={NewAttendancesStudentsScreen} />
      <Stack.Screen name='Assessments' component={AssessmentsScreen} />
      <Stack.Screen name='Scores' component={ScoresScreen} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <SQLiteProvider databaseName="MyClassroom.db" onInit={initializeDatabase}>
        <MenuProvider>
          <MyClassroomStack />
        </MenuProvider>
      </SQLiteProvider>
    </NavigationContainer>
  );
}

export default App;