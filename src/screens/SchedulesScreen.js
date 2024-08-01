import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const Item = ({ navigation, item}) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <TouchableOpacity style={styles.listContainer} onPress={() => setShowOptions(!showOptions)} back>
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>{`${item.serie} - ${item.turma}`}</Text>
                    <Text style={styles.listTitle}>{item.qtdAlunos}</Text>
                </View>
                {showOptions && (
                    <View style={styles.options}>
                        <View style={styles.button}>
                            <Button title='Alunos' onPress={() => { navigation.navigate('Students')}} />
                        </View>
                        <View style={styles.button}>
                            <Button title='Chamadas' onPress={() => { navigation.navigate('Attendances') }} />
                        </View>
                        <View style={styles.button}>
                            <Button title='Avaliações' onPress={() => { navigation.navigate('Assessments')}} />
                        </View>
                    </View>
                )}
                <View style={styles.line} />
        </TouchableOpacity>
    );
}

export const SchedulesScreen = () => {
  const tableHead = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const tableData = [
    ['8:00 - 9:00', 'Math', 'English', 'Biology', 'History', 'Geography'],
    ['9:00 - 10:00', 'Physics', 'Math', 'Chemistry', 'Math', 'English'],
    ['10:00 - 11:00', 'Biology', 'History', 'Physics', 'Chemistry', 'Math'],
    ['11:00 - 12:00', 'History', 'Geography', 'Math', 'English', 'Physics'],
    // Adicione mais linhas conforme necessário
  ];

  const transposedTableData = tableHead.map((_, colIndex) =>
    tableData.map(row => row[colIndex])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row data={['Time', ...tableHead]} style={styles.head} textStyle={styles.text} />
          <TableWrapper style={styles.wrapper}>
            <Col
              data={tableData.map(row => row[0])}
              style={styles.title}
              heightArr={[28, 28, 28, 28]}
              textStyle={styles.text}
            />
            <Rows data={transposedTableData} flexArr={[1, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text} />
          </TableWrapper>
        </Table>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28 },
  text: { textAlign: 'center', fontWeight: '100' }
});
