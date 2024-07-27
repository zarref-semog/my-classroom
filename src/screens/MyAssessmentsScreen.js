import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const Item = ({ navigation, item, selected, onPress}) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <TouchableOpacity style={styles.listContainer} selected={selected} onPress={onPress} back>
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>{item.nome}</Text>
                    <Text style={styles.listTitle}>{item.nota}</Text>
                </View>
                {(selected === item.id) && (
                    <View style={styles.listOptions}>
                        <View style={styles.listButton}>
                            <Button title='Notas' onPress={() => { navigation.navigate('Scores')}} />
                        </View>
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

export function MyAssessmentsScreen({ navigation }) {
    const [pesquisa, setPesquisa] = useState('');
    const [serie, setSerie] = useState('');
    const [turma, setTurma] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const avaliacoes = [
        { id: '1', nome: 'AV 1', nota: '7,0'},
        { id: '2', nome: 'AV 2', nota: '7,0'},
        { id: '3', nome: 'AVS', nota: '7,0'},
        { id: '4', nome: 'PF', nota: '7,0'},
        { id: '5', nome: 'RP', nota: '7,0'},
        { id: '6', nome: 'RF', nota: '7,0'},
    ];

    const notasFiltradas = avaliacoes.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        aluno.nota.toLowerCase().includes(pesquisa.toLowerCase())
    );

    function handleSelectedOption(item) {
        setSelectedOption(item.id);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Avaliações - Turma 1</Text>
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
                        data={notasFiltradas}
                        renderItem={({ item }) => <Item navigation={navigation} item={item} selected={selectedOption} onPress={() => {handleSelectedOption(item)}} />}
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