import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { MenuProvider } from 'react-native-popup-menu';
import initializeDatabase from './src/database/initializeDatabase';
import { MyClassroomStack } from './src/navigation/MyClassroomStack';

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
