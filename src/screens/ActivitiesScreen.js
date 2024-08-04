import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivitiesService } from '../services/ActivitiesService';
import DropdownComponent from '../components/DropdownComponent';
import { ClassroomsService } from '../services/ClassroomsService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent }) => (
    <TouchableOpacity style={styles.listContainer} onPress={onPress}>
        <View style={styles.listItem}>
            <Text numberOfLines={1} style={styles.listTitle}>{item.classroom_name}</Text>
            {selected === item.id && (
                <View style={styles.listAction}>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('updateActivity', item)}>
                        <Icon name='pencil' type='font-awesome' color='white' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('viewActivity', item)}>
                        <Icon name='eye' type='font-awesome' color='white' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('deleteActivity', item)}>
                        <Icon name='trash' type='font-awesome' color='white' />
                    </Pressable>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

export function ActivitiesScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [classroomId, setClassroomId] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState([]);
    const [activities, setActivities] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [menu, setMenu] = useState([]);

    const activitiesService = ActivitiesService();
    const classroomsService = ClassroomsService();

    useEffect(() => {
        loadActivities();
        convertData();
    }, []);

    const loadActivities = () => {
        activitiesService.getActivities((data) => {
            setActivities(data);
        });
    };

    const filteredActivities = activities.filter(act =>
        act.classroom_name.toLowerCase().includes(search.toLowerCase())
    );

    function addActivity(classroomId, description) {
        if (!classroomId || !description) return;
        activitiesService.addActivity(classroomId, description, () => {
            loadActivities();
            Alert.alert('', 'Atividade adicionada com sucesso!');
        });
    }

    function updateActivity(id, classroomId, description, status) {
        if (!classroomId || !description || !status) return;
        activitiesService.updateActivity(id, classroomId, description, status, () => {
            loadActivities();
            Alert.alert('', 'Atividade atualizada com sucesso!');
        });
    }

    function deleteActivity(id) {
        activitiesService.deleteActivity(id, () => {
            loadActivities();
            Alert.alert('', 'Atividade excluída com sucesso!');
        });
    }

    function convertData() {
        classroomsService.getClassrooms((result) => {
            let items = result.map((data) => {
                return { label: data.name, value: data.id }
            });
            setMenu(items);
        })
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        if (content === 'addActivity') {
            setId('');
            setClassroomId('');
            setDescription('');
            setStatus('');
        } else {
            setId(item.id);
            setClassroomId(item.classroom_id)
            setDescription(item.description);
            setStatus(item.status);
        }
        convertData();
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Atividades</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Turma'
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => handleModalContent('addActivity')}>
                        <Icon name='plus-square' type='font-awesome' color='white' />
                        <Text style={styles.addButtonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredActivities}
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
                {modalContent === 'addActivity' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Nova Atividade</Text>
                            <View style={styles.dropdownContainer}>
                                <DropdownComponent placeholder='Selecione a Turma' data={menu} value={classroomId} setValue={setClassroomId} />
                            </View>
                            <TextInput
                                textAlignVertical='top'
                                multiline={true}
                                numberOfLines={4}
                                style={styles.modalInput}
                                onChangeText={setDescription}
                                value={description}
                                placeholder='Descrição'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        addActivity(classroomId, description);
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
                {modalContent === 'updateActivity' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Atividade</Text>
                            <DropdownComponent placeholder='Selecione a Turma' data={menu} value={classroomId} setValue={setClassroomId} />
                            <TextInput
                                textAlignVertical='top'
                                multiline={true}
                                numberOfLines={4}
                                style={styles.modalInput}
                                onChangeText={setDescription}
                                value={description}
                                placeholder='Descrição'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
                                    onPress={() => {
                                        updateActivity(id, classroomId, description);
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
                {modalContent === 'viewActivity' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Descrição</Text>
                            <Text style={styles.modalText}>{description}</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                {modalContent === 'deleteActivity' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Excluir Atividade</Text>
                            <Text style={styles.modalText}>Deseja realmente excluir esta atividade?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.dangerButton]}
                                    onPress={() => {
                                        deleteActivity(id);
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
        height: 100,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 12,
        padding: 10,
    },
    dropdownContainer: {
        marginBottom: 10,
        width: '100%',
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
        paddingHorizontal: 10,
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
        fontWeight: 'bold',
        width: '65%',
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