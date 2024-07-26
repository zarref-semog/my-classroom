import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

export const Item = ({ navigation, item}) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <TouchableOpacity style={styles.container} onPress={() => setShowOptions(!showOptions)} back>
                <View style={styles.item}>
                    <Text style={styles.title}>{`${item.serie} - ${item.turma}`}</Text>
                    <Text style={styles.title}>{item.qtdAlunos}</Text>
                </View>
                {showOptions && (
                    <View style={styles.options}>
                        <View style={styles.button}>
                            <Button title='Alunos' onPress={() => { navigation.navigate('Students')}} />
                        </View>
                        <View style={styles.button}>
                            <Button title='Atividades' onPress={() => { }} />
                        </View>
                        <View style={styles.button}>
                            <Button title='Editar' onPress={() => { }} />
                        </View>
                    </View>

                )}
                <View style={styles.line} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#679289',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 80,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        marginRight: 5,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    },
});
