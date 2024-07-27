import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export const RadioButton = ({ selected, onPress, children, color }) => {
    return (
        <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
            <View style={[styles.radioCircle, selected && {backgroundColor: color}]} />
            <Text style={styles.radioText}>{children}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioText: {
        fontSize: 16,
    },
});