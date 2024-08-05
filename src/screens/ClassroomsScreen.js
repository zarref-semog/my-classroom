import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, Modal, FlatList, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClassroomsService } from '../services/ClassroomsService';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const Item = ({ navigation, item, selected, onPress, setModalContent }) => (
    <TouchableOpacity style={styles.listContainer} onPress={onPress}>
        <View style={styles.listItem}>
            <Text numberOfLines={1} style={styles.listTitle}>{item.name}</Text>
            {selected === item.id ? (
                <View style={styles.listAction}>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('updateClassroom', item)}>
                        <Icon name='pencil' type='font-awesome' color='white' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('deleteClassroom', item)}>
                        <Icon name='trash' type='font-awesome' color='white' />
                    </Pressable>
                    <Menu>
                        <MenuTrigger style={styles.listButton}>
                            <Icon name='ellipsis-v' type='font-awesome' color='white' />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                style={styles.menuOption}
                                onSelect={() => {
                                    navigation.navigate('Students', { classroomId: item.id, classroomName: item.name })
                                }}
                            >
                                <Icon name='group' type='font-awesome' color='#888888' />
                                <Text style={styles.menuText}>Alunos</Text>
                            </MenuOption>
                            <MenuOption
                                style={styles.menuOption}
                                onSelect={() => {
                                    navigation.navigate('Attendances', { classroomId: item.id, classroomName: item.name })
                                }}
                            >
                                <Icon name='check-square' type='font-awesome' color='#888888' />
                                <Text style={styles.menuText}>Chamadas</Text>
                            </MenuOption>
                            <MenuOption
                                style={styles.menuOption}
                                onSelect={() => {
                                    navigation.navigate('Assessments', { classroomId: item.id, classroomName: item.name })
                                }}
                            >
                                <Icon name='pencil-square' type='font-awesome' color='#888888' />
                                <Text style={styles.menuText}>Avaliações</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            ) : (
                <View style={styles.listAction}>
                    <Icon name='group' type='font-awesome' color='white' />
                    <Text style={styles.listInfo}>{item.total_students}</Text>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

export function ClassroomsScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState('');

    const classroomsService = ClassroomsService();

    useEffect(() => {
        loadClassrooms();
    }, []);

    const loadClassrooms = () => {
        classroomsService.getClassrooms((data) => {
            setClassrooms(data);
        });
    };

    const filteredClassrooms = classrooms.filter(cr =>
        cr.name.toLowerCase().includes(search.toLowerCase())
    );


    function addClassroom(name) {
        if (!name) return;
        classroomsService.addClassroom(name, () => {
            loadClassrooms();
            Alert.alert('', 'Sala de aula adicionada com sucesso!');
        });
    }

    function updateClassroom(id, name) {
        if (!name) return;
        classroomsService.updateClassroom(id, name, () => {
            loadClassrooms();
            Alert.alert('', 'Sala de aula atualizada com sucesso!');
        });
    }

    function deleteClassroom(id) {
        classroomsService.deleteClassroom(id, () => {
            loadClassrooms();
            Alert.alert('', 'Sala de aula excluída com sucesso!');
        });
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        if (content === 'addClassroom') {
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
                <View>
                    <Text style={styles.title}>Turmas</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Turma'
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => handleModalContent('addClassroom')}>
                        <Icon name='plus-square' type='font-awesome' color='white' />
                        <Text style={styles.addButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredClassrooms}
                    renderItem={({ item }) => (
                        <Item
                            navigation={navigation}
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
                {modalContent === 'addClassroom' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Nova Turma</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Turma'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        addClassroom(name);
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
                {modalContent === 'updateClassroom' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Turma</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Turma'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        updateClassroom(id, name);
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
                {modalContent === 'deleteClassroom' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Excluir Turma</Text>
                            <Text>Deseja realmente excluir esta turma?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.dangerButton]}
                                    onPress={() => {
                                        deleteClassroom(id);
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
        height: 50,
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
        width: '68%',
    },
    listInfo: {
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
    }
});
