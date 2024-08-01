import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RadioButton } from '../components/RadioButton';

const Item = ({ item }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <View style={[styles.listItem, styles.listContainer]}>
            <Text style={styles.listTitle}>{item.nome}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <RadioButton selected={selectedOption === 'option1'} onPress={() => { handleOptionChange('option1') }} color='blue' />
                <RadioButton selected={selectedOption === 'option2'} onPress={() => { handleOptionChange('option2') }} color='red' />
            </View>
        </View>
    );
}

export function AttendancesScreen({ navigation }) {
    const [pesquisa, setPesquisa] = useState('');
    const [serie, setSerie] = useState('');
    const [turma, setTurma] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const chamadas = [
        { id: '1', nome: 'João Silva' },
        { id: '2', nome: 'Maria Souza' },
        { id: '3', nome: 'Carlos Pereira' },
        { id: '4', nome: 'Ana Lima' },
        { id: '5', nome: 'Pedro Santos' },
        { id: '6', nome: 'Julia Oliveira' },
        { id: '7', nome: 'Lucas Ferreira' },
        { id: '8', nome: 'Mariana Costa' },
        { id: '9', nome: 'Felipe Alves' },
        { id: '10', nome: 'Larissa Mendes' }
    ];

    const chamadasFiltradas = chamadas.filter(chamada =>
        chamada.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Chamada Turma 1</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPesquisa}
                        value={pesquisa}
                        placeholder='Buscar Aluno'
                    />
                    <Button title='Adicionar' onPress={() => setModalVisible(true)} />
                </View>
                <FlatList
                    data={chamadasFiltradas}
                    renderItem={({ item }) => <Item navigation={navigation} item={item} />}
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