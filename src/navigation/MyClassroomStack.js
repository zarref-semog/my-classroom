import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AttendancesStudentsScreen } from '../screens/AttendancesStudentsScreen';
import { NewAttendancesStudentsScreen } from '../screens/NewAttendancesStudentsScreen';
import { AssessmentsScreen } from '../screens/AssessmentsScreen';
import { AttendancesScreen } from '../screens/AttendancesScreen';
import { StudentsScreen } from '../screens/StudentsScreen';
import { ScoresScreen } from '../screens/ScoresScreen';
import { MyClassroomTabs } from './MyClassroomTabs';

const Stack = createNativeStackNavigator();

export function MyClassroomStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ClassroomTabs' component={MyClassroomTabs} options={{unmountOnBlur: true}} />
      <Stack.Screen name='Students' component={StudentsScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen name='Attendances' component={AttendancesScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen name='AttendancesStudents' component={AttendancesStudentsScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen name='NewAttendancesStudents' component={NewAttendancesStudentsScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen name='Assessments' component={AssessmentsScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen name='Scores' component={ScoresScreen} options={{unmountOnBlur: true}} />
    </Stack.Navigator>
  );
}