import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScoresService } from '../services/ScoresService';
import { Icon } from 'react-native-elements';

const Item = ({ item, selected, onPress, setModalContent, passingScore }) => {
    const scoreColor = item.score < passingScore ? '#db9795' : '#95b6de';

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.listItem, styles.listContainer]}>
                <Text numberOfLines={1} style={styles.listTitle}>{item.student_name}</Text>
                {selected === item.id ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={styles.listButton} onPress={() => setModalContent('updateScore', item)}>
                            <Icon name='pencil' type='font-awesome' color='white' />
                        </Pressable>
                    </View>
                ) : (
                    <Text style={[styles.listInfo, { color: scoreColor }]}>
                        {item.score.toString().replace('.', ',')}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};


export function ScoresScreen({ route, navigation }) {
    const [search, setSearch] = useState('');
    const [id, setId] = useState('');
    const [score, setScore] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [scores, setScores] = useState([]);

    const { classroomName, assessmentId, assessmentName, passingScore } = route.params;

    const scoresService = ScoresService();

    useEffect(() => {
        loadScores();
    }, []);

    const filteredScores = scores.filter(score =>
        score.student_name.toLowerCase().includes(search.toLowerCase()) ||
        String(score.score).toLowerCase().includes(search.toLowerCase())
    );

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
        setScore(item.score.toString().replace('.', ','));
        setModalContent(content);
        setModalVisible(true);
    }

    const updateScore = (id, score) => {
        if (!score) return;
        const parsedScore = parseFloat(score.replace(',', '.'));
        scoresService.updateScore(id, parsedScore, () => {
            loadScores();
            setModalVisible(false);
            setSelectedItem('');
            Alert.alert('', 'Nota atualizada com sucesso!');
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name='arrow-left' type='font-awesome' size={24} color='#6b6b6b' />
                    </TouchableOpacity>
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
                    data={filteredScores}
                    renderItem={({ item }) => (
                        <Item
                            item={item}
                            selected={selectedItem}
                            passingScore={passingScore}
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
                            <TextInput
                                style={styles.modalInput}
                                onChangeText={setScore}
                                value={score}
                                placeholder='Nota'
                                keyboardType='numeric'
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.safeButton]}
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
        marginTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
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
        maxWidth: '80%',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6b6b6b',
        textAlign: 'center',
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
        width: '65%',
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
