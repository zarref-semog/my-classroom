import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StudentsService } from '../services/StudentsService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent }) => {
    return (
        <Pressable style={styles.listContainer} onPress={onPress}>
            <View style={styles.listItem}>
                <Text numberOfLines={1} style={styles.listTitle}>{item.name}</Text>
                <View style={styles.listAction}>
                    {
                        selected === item.id ? (
                            <>
                                <Pressable onPress={() => setModalContent('updateStudent', item)}>
                                    <Icon name='pencil' type='font-awesome' color='blue' />
                                </Pressable>
                                <Pressable onPress={() => setModalContent('deleteStudent', item)}>
                                    <Icon name='trash' type='font-awesome' color='red' />
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Text style={{ ...styles.listTitle, color: 'blue' }}>10</Text>
                                <Text style={{ ...styles.listTitle, color: 'red' }}>10</Text>
                            </>
                        )
                    }
                </View>
            </View>
        </Pressable>
    );
}

export function StudentsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [students, setStudents] = useState([]);
    const [modalContent, setModalContent] = useState('');

    const studentsService = StudentsService();

    const { classroomId, classroomName } = route.params;

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        studentsService.getStudents(classroomId, (data) => {
            setStudents(data);
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase())
    );


    function addStudent(name) {
        studentsService.addStudent(classroomId, name, () => {
            loadStudents();
        });
    }

    function updateStudent(id, name) {
        studentsService.updateStudent(id, classroomId, name, () => {
            loadStudents();
        });
    }

    function deleteStudent(id) {
        studentsService.deleteStudent(id, () => {
            loadStudents();
        });
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        if (content === 'addStudent') {
            setName('');
        } else {
            setId(item.id);
            setName(item.name);
        }
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Alunos - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Aluno'
                    />
                    <Button title='Adicionar' onPress={() => { handleModalContent('addStudent') }} />
                </View>
                <FlatList
                    data={filteredStudents}
                    renderItem={({ item }) => (
                        <Item
                            item={item}
                            selected={selectedItem}
                            onPress={() => handleSelectedItem(item)}
                            setModalContent={(content, item) => handleModalContent(content, item)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {modalContent === 'addStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Adicionar Aluno</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        addStudent(name)
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
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
                {modalContent === 'updateStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Aluno</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        updateStudent(id, name);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
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
                {modalContent === 'deleteStudent' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Excluir Aluno</Text>
                            <Text>Deseja realmente excluir este aluno?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        deleteStudent(id);
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
        maxWidth: 250,
        color: 'white',
        fontWeight: 'bold',
    },
    listAction: {
        flexDirection: 'row',
        gap: 20
    }
});