import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RadioButton } from '../components/RadioButton';
import { StudentsService } from '../services/StudentsService';
import { AttendancesService } from '../services/AttendancesService';
import { AttendancesStudentsService } from '../services/AttendancesStudentsService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selectedOption, onPress }) => {
    return (
        <View style={[styles.listItem, styles.listContainer]}>
            <Text style={styles.listTitle}>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 20 }}>
                <RadioButton
                    selected={selectedOption === 'presente'}
                    onPress={() => onPress('presente')}
                    color='white'
                    children={<Text style={styles.radioButtonText}>P</Text>} />
                <RadioButton
                    selected={selectedOption === 'ausente'}
                    onPress={() => onPress('ausente')}
                    color='white'
                    children={<Text style={styles.radioButtonText}>A</Text>} />
            </View>
        </View>
    );
}

export function NewAttendancesStudentsScreen({ route, navigation }) {
    const [students, setStudents] = useState([]);
    const [attendancesStudents, setAttendancesStudents] = useState({});

    const { classroomId, classroomName } = route.params;

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
                    <Text style={styles.title}>Chamada - {classroomName}</Text>
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
                <TouchableOpacity style={styles.addButton} onPress={saveAttendance}>
                    <Icon name='save' type='font-awesome' color='white' />
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight: 8,
        paddingLeft: 8,
    },
    list: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6b6b6b',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#e8e8e8',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#6b6b6b',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    modalText: {
        fontSize: 16,
    },
    modalInput: {
        width: '100%',
        height: 50,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 12,
        paddingLeft: 8,
    },
    modalButtonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    addButton: {
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        flexDirection: 'row',
        gap: 10,
        borderRadius: 5,
        backgroundColor: '#4a90e2',
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    safeButton: {
        backgroundColor: '#679289',
    },
    dangerButton: {
        backgroundColor: '#d9534f',
    },
    cancelButton: {
        backgroundColor: '#b8b8b899',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    listContainer: {
        backgroundColor: '#679289',
        marginBottom: 10,
        borderRadius: 10
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    listAction: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        gap: 10
    },
    listButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    optionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 30,
        height: 30
    },
    menuOption: {
        flexDirection: 'row',
        gap: 10,
        padding: 10,
    },
    menuText: {
        color: '#6b6b6b',
    },
    radioButtonText: {
        color: 'white'
    }
});
