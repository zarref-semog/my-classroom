import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivitiesService } from '../services/ActivitiesService';
import DropdownComponent from '../components/DropdownComponent';
import { ClassroomsService } from '../services/ClassroomsService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent }) => (
    <Pressable style={styles.listContainer} onPress={onPress}>
        <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item.classroom_id}</Text>
            {selected === item.id && (
                <View style={styles.listAction}>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('updateActivity', item)}>
                        <Icon name='pencil' type='font-awesome' color='blue' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('viewActivity', item)}>
                        <Icon name='eye' type='font-awesome' color='white' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('deleteActivity', item)}>
                        <Icon name='trash' type='font-awesome' color='red' />
                    </Pressable>
                </View>
            )}
        </View>
    </Pressable>
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


    function addActivity(classroomId, description) {
        activitiesService.addActivity(classroomId, description, () => {
            loadActivities();
        });
    }

    function updateActivity(id, classroomId, description, status) {
        activitiesService.updateActivity(id, classroomId, description, status, () => {
            loadActivities();
        });
    }

    function deleteActivity(id) {
        activitiesService.deleteActivity(id, () => {
            loadActivities();
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
                    <Text style={styles.title}>Minhas Atividades</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Turma'
                    />
                    <Button title='Adicionar' onPress={() => handleModalContent('addActivity')} />
                </View>
                <FlatList
                    data={activities}
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
                            <DropdownComponent data={menu} value={classroomId} setValue={setClassroomId} />
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
                                    style={[styles.button, styles.saveButton]}
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
                            <DropdownComponent data={menu} value={classroomId} setValue={setClassroomId} />
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
                                    style={[styles.button, styles.saveButton]}
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
                            <Text style={styles.modalTitle}>Visualizar Atividade</Text>
                            <Text>{description}</Text>
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
                            <Text>Deseja realmente excluir esta atividade?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
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
        paddingVertical: 10,
        width: '100%',
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
    listTitle: {
        color: 'white',
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#b3b3b3'
    },
});