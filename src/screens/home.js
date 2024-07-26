import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Item } from '../components/ListItem';

function HomeScreen({ navigation }) {
    const [pesquisa, setPesquisa] = useState('');
    const [serie, setSerie] = useState('');
    const [turma, setTurma] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const turmas = [
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
    ];

    const turmasFiltradas = turmas.filter(turma =>
        turma.serie.toLowerCase().includes(pesquisa.toLowerCase()) ||
        turma.turma.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <ScrollView>
                <View style={styles.container}>
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
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={item => item.id}
                        style={styles.list}
                    />
                </View>
            </ScrollView>
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
                                onPress={() => setModalVisible(false)}
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
        padding: 16,
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
});

export default HomeScreen;