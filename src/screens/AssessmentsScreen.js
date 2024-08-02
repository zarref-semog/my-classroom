import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AssessmentsService } from '../services/AssessmentsService';
import { ScoresService } from '../services/ScoresService';
import { StudentsService } from '../services/StudentsService';

const Item = ({ navigation, item, classroomId, classroomName, selected, onPress, setModalContent }) => (
    <Pressable style={styles.listContainer} onPress={onPress}>
        <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item.name}</Text>
            {selected === item.id ? (
                <View style={styles.listAction}>
                    <Pressable style={styles.listButton} onPress={() => {
                        navigation.navigate('Scores', {
                            classroomId: classroomId,
                            classroomName: classroomName,
                            assessmentId: item.id,
                            assessmentName: item.name
                        });
                    }}>
                        <Icon name='address-book' type='font-awesome' color='#e8e8e8' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('updateAssessment', item)}>
                        <Icon name='pencil' type='font-awesome' color='blue' />
                    </Pressable>
                    <Pressable style={styles.listButton} onPress={() => setModalContent('deleteAssessment', item)}>
                        <Icon name='trash' type='font-awesome' color='red' />
                    </Pressable>
                </View>
            ) : (
                <View style={styles.listAction}>
                    <Text>{item.passing_score}</Text>
                </View>
            )}
        </View>
    </Pressable>
);

export function AssessmentsScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [passingScore, setPassingScore] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState([]);
    const [students, setStudents] = useState([]);

    const { classroomId, classroomName } = route.params;

    const assessmentsService = AssessmentsService();
    const scoresService = ScoresService();
    const studentsService = StudentsService();

    const filteredAssessments = assessments.filter(ass =>
        ass.name.toLowerCase().includes(search.toLowerCase()) ||
        String(ass.passing_score).toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        loadStudents();
        loadAssessments();
    }, []);

    function loadStudents() {
        studentsService.getStudents(classroomId, (data) => setStudents(data));
    }

    function loadAssessments() {
        assessmentsService.getAssessments((data) => setAssessments(data));
    }

    function addAssessment(name, passingScore) {
        assessmentsService.addAssessment(classroomId, name, passingScore, (data) => {
            scoresService.addManyScores(students, data.lastInsertRowId);
            loadAssessments();
        });
    }

    function updateAssessment(id, name, passingScore) {
        assessmentsService.updateAssessment(id, classroomId, name, passingScore, () => {
            loadAssessments();
        });
    }

    function deleteAssessment(id) {
        assessmentsService.deleteAssessment(id, () => {
            loadAssessments();
        });
    }

    function handleSelectedItem(item) {
        item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
    }

    function handleModalContent(content, item = {}) {
        if (content === 'addAssessment') {
            setName('');
            setPassingScore('');
        } else {
            setId(item.id);
            setName(item.name);
            setPassingScore(String(item.passing_score));
        }
        setModalContent(content);
        setModalVisible(true);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Avaliações - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Avaliação'
                    />
                    <Button title='Adicionar' onPress={() => handleModalContent('addAssessment')} />
                </View>
                <FlatList
                    data={filteredAssessments}
                    renderItem={({ item }) => (
                        <Item
                            navigation={navigation}
                            item={item}
                            classroomId={classroomId}
                            classroomName={classroomName}
                            selected={selectedItem}
                            onPress={() => handleSelectedItem(item)}
                            setModalContent={(content, item) => handleModalContent(content, item)}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    style={styles.list}
                />
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {modalContent === 'addAssessment' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Nova Avaliação</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <TextInput
                                keyboardType='numeric'
                                style={styles.modalInput}
                                onChangeText={(value) => setPassingScore(value)}
                                value={passingScore}
                                placeholder='Nota de corte'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        addAssessment(name, parseFloat(passingScore));
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
                {modalContent === 'updateAssessment' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Avaliação</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setName}
                                value={name}
                                placeholder='Nome'
                            />
                            <TextInput
                                keyboardType='numeric'
                                style={styles.modalInput}
                                onChangeText={(value) => setPassingScore(value)}
                                value={passingScore}
                                placeholder='Nota de corte'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        updateAssessment(id, name, parseFloat(passingScore));
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
                {modalContent === 'deleteAssessment' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Excluir Avaliação</Text>
                            <Text>Deseja realmente excluir esta avaliação?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => {
                                        deleteAssessment(id);
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
});