import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RadioButton } from '../components/RadioButton';
import { StudentsService } from '../services/StudentsService';
import { AttendancesService } from '../services/AttendancesService';
import { AttendancesStudentsService } from '../services/AttendancesStudentsService';

const Item = ({ item, selectedOption, onPress }) => {
    return (
        <View style={[styles.listItem, styles.listContainer]}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <RadioButton selected={selectedOption === 'presente'} onPress={() => onPress('presente')} color='blue' />
                <RadioButton selected={selectedOption === 'ausente'} onPress={() => onPress('ausente')} color='red' />
            </View>
        </View>
    );
}

export function NewAttendancesStudentsScreen({ route, navigation }) {
    const [students, setStudents] = useState([]);
    const [attendancesStudents, setAttendancesStudents] = useState({});

    const { classroomId } = route.params;

    const studentsService = StudentsService();
    const attendancesService = AttendancesService();
    const attendancesStudentsService = AttendancesStudentsService();

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        studentsService.getStudents(classroomId, (data) => {
            setStudents(data);
        });
    };

    const handleAttendanceChange = (studentId, value) => {
        setAttendancesStudents((prev) => ({
            ...prev,
            [studentId]: {
                student_id: studentId,
                status: value
            }
        }));
    };

    const saveAttendance = async () => {
        const attendances = Object.values(attendancesStudents);

        try {
            attendancesService.addAttendance(classroomId, new Date().toLocaleDateString(), (result) => {
                attendancesStudentsService.addManyAttendanceStudent(attendances, result.lastInsertRowId);
            })
            alert('Chamada salva com sucesso!');
        } catch (error) {
            console.error('Error saving attendances:', error);
            alert('Falha ao salvar chamada.');
        } finally {
            navigation.goBack();
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chamada Turma 1</Text>
                </View>
                <FlatList
                    data={students}
                    renderItem={({ item }) => (
                        <Item 
                            item={item}
                            selectedOption={attendancesStudents[item.id]?.status}
                            onPress={(value) => handleAttendanceChange(item.id, value)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
                <Button style={styles.button} title='Salvar' onPress={saveAttendance} />
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
