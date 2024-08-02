import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RadioButton } from '../components/RadioButton';
import { StudentsService } from '../services/StudentsService';
import { AttendancesService } from '../services/AttendancesService';
import { AttendancesStudentsService } from '../services/AttendancesStudentsService';

const Item = ({ item }) => {
    return (
        <View style={[styles.listItem, styles.listContainer]}>
            <Text style={styles.listTitle}>{item.student_id}</Text>
            <Text>{item.status}</Text>
        </View>
    );
}

export function AttendancesStudentsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [attendancesStudents, setAttendancesStudents] = useState([]);

    const { attendanceId, classroomName } = route.params;

    const attendancesStudentsService = AttendancesStudentsService();


    useEffect(() => {
        loadAttendancesStudents();
    }, []);

    const loadAttendancesStudents = () => {
        attendancesStudentsService.getAttendancesStudents(attendanceId, (data) => {
            setAttendancesStudents(data);
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chamada - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Aluno ou Status'
                    />
                    <Button title='Adicionar' onPress={() => navigation.navigate('NewAttendancesStudents', { classroomId, classroomName })} />
                </View>
                <FlatList
                    data={attendancesStudents}
                    renderItem={({ item }) => (<Item item={item} />)}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 8,
        paddingLeft: 8,
    },
    list: {
        flex: 1,
    },
    title: {
        fontSize: 16,
    },
    button: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: '#1d7874',
    },
    cancelButton: {
        backgroundColor: '#ee2e31',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    listContainer: {
        backgroundColor: '#679289',
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 80,
    },
    listTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
});
