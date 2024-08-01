import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Item = ({ navigation, item, selected, onPress }) => {
    return (
        <TouchableOpacity style={styles.listContainer} onPress={onPress} back>
            <View style={styles.listItem}>
                <Text style={styles.listTitle}>{item.nome}</Text>
                <Text style={styles.listTitle}>{item.nota}</Text>
            </View>
            {(selected === item.id) && (
                <View style={styles.listOptions}>
                    <View style={styles.listButton}>
                        <Button title='Editar' onPress={() => {}} />
                    </View>
                    <View style={styles.listButton}>
                        <Button title='Excluir' onPress={() => {}} />
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

export function ScoresScreen({ navigation }) {
    const [pesquisa, setPesquisa] = useState('');
    const [serie, setSerie] = useState('');
    const [turma, setTurma] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const alunos = [
        { id: '1', nome: 'João Silva', nota: '9,5' },
        { id: '2', nome: 'Maria Souza', nota: '7,9' },
        { id: '3', nome: 'Carlos Pereira', nota: '6,8' },
        { id: '4', nome: 'Ana Lima', nota: '5,4' },
        { id: '5', nome: 'Pedro Santos', nota: '10,0' },
        { id: '6', nome: 'Julia Oliveira', nota: '9,8' },
        { id: '7', nome: 'Lucas Ferreira', nota: '2,5' },
        { id: '8', nome: 'Mariana Costa', nota: '0,0' },
        { id: '9', nome: 'Felipe Alves', nota: '7,3' },
        { id: '10', nome: 'Larissa Mendes', nota: '10,0' }
    ];

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        aluno.nota.toLowerCase().includes(pesquisa.toLowerCase())
    );

    function handleSelectedItem(item) {
        setSelectedItem(item.id);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Notas AV1 - Turma 1</Text>
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
                    data={alunosFiltrados}
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