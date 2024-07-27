import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Item = ({ navigation, item, selected, onPress }) => {
    return (
        <TouchableOpacity style={styles.listContainer} onPress={onPress} back>
            <View style={styles.listItem}>
                <Text style={styles.listTitle}>{`${item.serie} - ${item.turma}`}</Text>
                <Text style={styles.listTitle}>{item.qtdAlunos}</Text>
            </View>
            {(selected === item.id) && (
                <View style={styles.listOptions}>
                    <View style={styles.listButton}>
                        <Button title='Alunos' onPress={() => { navigation.navigate('Students') }} />
                    </View>
                    <View style={styles.listButton}>
                        <Button title='Chamada' onPress={() => { navigation.navigate('Attendances') }} />
                    </View>
                    <View style={styles.listButton}>
                        <Button title='Avaliações' onPress={() => { navigation.navigate('Assessments') }} />
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

export function MyClassesScreen({ navigation }) {
    const [pesquisa, setPesquisa] = useState('');
    const [serie, setSerie] = useState('');
    const [turma, setTurma] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [turmas, setTurmas] = useState([
        { id: '1', serie: '8º ano', turma: 'A', qtdAlunos: 22 },
        { id: '2', serie: '7º ano', turma: 'B', qtdAlunos: 32 },
        { id: '3', serie: '6º ano', turma: 'C', qtdAlunos: 25 },
        { id: '4', serie: '9º ano', turma: 'D', qtdAlunos: 18 },
        { id: '5', serie: '5º ano', turma: 'E', qtdAlunos: 31 },
        { id: '6', serie: '8º ano', turma: 'A', qtdAlunos: 22 },
        { id: '7', serie: '7º ano', turma: 'B', qtdAlunos: 32 },
        { id: '8', serie: '6º ano', turma: 'C', qtdAlunos: 25 },
        { id: '9', serie: '9º ano', turma: 'D', qtdAlunos: 18 },
        { id: '10', serie: '5º ano', turma: 'E', qtdAlunos: 31 },
    ]);

    const turmasFiltradas = turmas.filter(turma =>
        turma.serie.toLowerCase().includes(pesquisa.toLowerCase()) ||
        turma.turma.toLowerCase().includes(pesquisa.toLowerCase())
    );

    function clear() {
        setSerie('');
        setTurma('');
    }

    function handleSelectedItem(item) {
        setSelectedItem(item.id);
    }

    function addNewClass(turma) {
        let maxId = turmas.sort((a, b) => a.id - b.id).lastIndexOf("id");
        setTurmas([...turmas, { id: `${maxId++}`, ...turma }]);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Minhas Turmas</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPesquisa}
                        value={pesquisa}
                        placeholder='Buscar Turma'
                    />
                    <Button title='Adicionar' onPress={() => setModalVisible(true)} />
                </View>
                <FlatList
                    data={turmasFiltradas}
                    renderItem={({ item }) => <Item navigation={navigation} item={item} selected={selectedItem} onPress={() => { handleSelectedItem(item) }} />}
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nova Turma</Text>
                        <TextInput
                            style={styles.modalInput}
                            onChangeText={setSerie}
                            value={serie}
                            placeholder='Série'
                        />
                        <TextInput
                            style={styles.modalInput}
                            onChangeText={setTurma}
                            value={turma}
                            placeholder='Turma'
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={() => {
                                    addNewClass({ serie: serie, turma: turma });
                                    setModalVisible(false);
                                    clear();
                                }
                                }
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