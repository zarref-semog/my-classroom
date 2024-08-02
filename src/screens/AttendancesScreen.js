import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Pressable, Modal, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AttendancesService } from '../services/AttendancesService';
import { Icon } from 'react-native-elements';

const Item = ({ item, classroomName, navigation, selected, onPress, setModalContent }) => {
    return (
        <Pressable style={styles.listContainer} onPress={onPress}>
            <View style={[styles.listItem, styles.listContainer]}>
                <Text style={styles.listTitle}>{item.date}</Text>
                {
                    selected === item.id && (
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <Pressable onPress={() => navigation.navigate('AttendancesStudents', { attendanceId: item.id, classroomName: classroomName })}>
                                <Icon name='eye' type='font-awesome' color='white' />
                            </Pressable>
                            <Pressable onPress={() => { setModalContent('deleteAttendance', item) }}>
                                <Icon name='trash' type='font-awesome' color='red' />
                            </Pressable>
                        </View>
                    )
                }
            </View>
        </Pressable>
    );
};

export function AttendancesScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState('');

    const { classroomId, classroomName } = route.params;

    const attendancesService = AttendancesService();

    const filteredAttendances = attendances.filter(att =>
        att.date.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        loadAttendances();
    });

    const loadAttendances = () => {
        attendancesService.getAttendances(classroomId, (data) => {
            setAttendances(data);
        });
    };

    function deleteAttendance(id) {
        attendancesService.deleteAttendance(id, () => {
            loadAttendances();
        });
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        setId(item.id);
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chamadas - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Chamada'
                    />
                    <Button title='Adicionar' onPress={() => navigation.navigate('NewAttendancesStudents', { classroomId, classroomName })} />
                </View>
                <FlatList
                    data={filteredAttendances}
                    renderItem={({ item }) => (
                        <Item
                            navigation={navigation}
                            item={item}
                            classroomName={classroomName}
                            selected={selectedItem}
                            onPress={() => handleSelectedItem(item)}
                            setModalContent={(content, item) => handleModalContent(content, item)}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    style={styles.list}
                />
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    {modalContent === 'deleteAttendance' && (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Excluir Turma</Text>
                                <Text>Deseja realmente excluir esta turma?</Text>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.saveButton]}
                                        onPress={() => {
                                            deleteAttendance(id);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Excluir</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#f4c095',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: 'white'
    },
    modalInput: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
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
    listOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        marginTop: 10,
        marginBottom: 10
    },
    listButton: {
        marginRight: 5,
    },
    listTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
});