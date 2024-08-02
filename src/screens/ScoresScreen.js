import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScoresService } from '../services/ScoresService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.listItem, styles.listContainer]}>
                <Text style={styles.listTitle}>{item.student_id}</Text>
                {selected === item.id ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable onPress={() => setModalContent('updateScore', item)}>
                            <Icon name='pencil' type='font-awesome' />
                        </Pressable>
                    </View>
                ) : (
                    <Text>{item.score}</Text>
                )}
            </View>
        </Pressable>
    );
};

export function ScoresScreen({ route }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [score, setScore] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [scores, setScores] = useState([]);

    const { classroomId, classroomName, assessmentId, assessmentName } = route.params;

    const scoresService = ScoresService();

    useEffect(() => {
        loadScores();
    }, []);

    function loadScores() {
        scoresService.getScores(assessmentId, (data) => {
            setScores(data);
        });
    }

    function handleSelectedItem(item) {
        setSelectedItem(item.id !== selectedItem ? item.id : null);
    }

    function handleModalContent(content, item = {}) {
        setId(item.id);
        setName(item.student_id);
        setScore(item.score);
        setModalContent(content);
        setModalVisible(true);
    }

    const updateScore = (studentId, newScore) => {
        scoresService.updateScore(id, assessmentId, studentId, newScore, () => {
            loadScores();
            setModalVisible(false);
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Notas {assessmentName} - {classroomName}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder='Buscar Aluno'
                    />
                </View>
                <FlatList
                    data={scores}
                    renderItem={({ item }) => (
                        <Item
                            item={item}
                            selected={selectedItem}
                            onPress={() => handleSelectedItem(item)}
                            setModalContent={handleModalContent}
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
                {modalContent === 'updateScore' && (
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Nota</Text>
                            <Text>{name}</Text>
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setScore}
                                value={score}
                                placeholder='Nota'
                                keyboardType='numeric'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={() => updateScore(id, score)}
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
        color: 'white',
        fontWeight: 'bold',
    },
});
