import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { SchedulesService } from '../services/SchedulesService';
import DropdownComponent from '../components/DropdownComponent';
import { TextInputMask } from 'react-native-masked-text';
import { ClassroomsService } from '../services/ClassroomsService';

const Item = ({ item, selected, onPress, setModalContent }) => {
  return (
    <TouchableOpacity style={styles.listContainer} onPress={onPress}>
      <View style={styles.listItem}>
        <Text numberOfLines={1} style={styles.listTitle}>{item.classroom_name}</Text>
        <View style={styles.listAction}>
          {
            selected === item.id ? (
              <>
                <Pressable style={styles.listButton} onPress={() => setModalContent('updateSchedule', item)}>
                  <Icon name='pencil' type='font-awesome' color='white' />
                </Pressable>
                <Pressable style={styles.listButton} onPress={() => setModalContent('deleteSchedule', item)}>
                  <Icon name='trash' type='font-awesome' color='white' />
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.listInfo}>{item.start_time} - {item.end_time}</Text>
              </>
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function SchedulesScreen() {
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [modalContent, setModalContent] = useState('');
  const [classrooms, setClassrooms] = useState([]);

  const weekDays = [
    { label: 'Domingo', value: 'domingo' },
    { label: 'Segunda-feira', value: 'segunda-feira' },
    { label: 'Terça-feira', value: 'terca-feira' },
    { label: 'Quarta-feira', value: 'quarta-feira' },
    { label: 'Quinta-feira', value: 'quinta-feira' },
    { label: 'Sexta-feira', value: 'sexta-feira' },
    { label: 'Sábado', value: 'sabado' }
  ]

  const classroomsService = ClassroomsService();
  const schedulesService = SchedulesService();

  useEffect(() => {
    loadSchedules();
    convertData();
    setTodayAsSearch();
  }, []);

  const loadSchedules = () => {
    schedulesService.getSchedules((data) => {
      setSchedules(data);
    });
  };

  const setTodayAsSearch = () => {
    const today = new Date().getDay();
    const weekDay = weekDays[today].value;
    setSearch(weekDay);
  };

  function convertData() {
    classroomsService.getClassrooms((result) => {
      let items = result.map((data) => {
        return { label: data.name, value: data.id }
      });
      setClassrooms(items);
    })
  }

  const filteredSchedules = schedules.filter(schedule =>
    schedule.week_day.toLowerCase().includes(search.toLowerCase())
  );


  function addSchedule(classroomId, weekDay, startTime, endTime) {
    if (!classroomId || !weekDay || !startTime || !endTime) {
      setModalVisible(false);
      return;
    }
    if (!checkStartTime(startTime)) return;
    if (!checkEndTime(endTime)) return;
    schedulesService.addSchedule(classroomId, weekDay, startTime, endTime, () => {
      loadSchedules();
      setModalVisible(false);
      Alert.alert('', 'Agenda adicionada com sucesso!');
    });
  }

  function updateSchedule(id, classroomId, weekDay, startTime, endTime) {
    if (!classroomId || !weekDay || !startTime || !endTime) {
      setModalVisible(false);
      return;
    };
    if (!checkStartTime(startTime)) return;
    if (!checkEndTime(endTime)) return;
    schedulesService.updateSchedule(id, classroomId, weekDay, startTime, endTime, () => {
      loadSchedules();
      setModalVisible(false);
      Alert.alert('', 'Agenda atualizada com sucesso!');
    });
  }

  function deleteSchedule(id) {
    schedulesService.deleteSchedule(id, () => {
      loadSchedules();
      Alert.alert('', 'Agenda excluída com sucesso!');
    });
  }

  function handleSelectedItem(item) {
    item.id !== selectedItem ? setSelectedItem(item.id) : setSelectedItem(null);
  }

  function handleModalContent(content, item = {}) {
    if (content === 'addSchedule') {
      setId('');
      setClassroomId('');
      setWeekDay('');
      setStartTime('');
      setEndTime('');
    } else {
      setId(item.id);
      setClassroomId(item.classroom_id);
      setWeekDay(item.week_day);
      setStartTime(item.start_time);
      setEndTime(item.end_time);
    }
    setModalContent(content);
    setModalVisible(true);
  }

  const validateTime = (time) => {
    const [hours, minutes] = time.split(':');
    const isValid =
      hours >= '00' && hours <= '23' && minutes >= '00' && minutes <= '59';
    return isValid;
  };

  const checkStartTime = (text) => {
    if (!validateTime(text)) {
      Alert.alert('Hora inválida', 'Por favor, insira uma hora entre 00:00 e 23:59');
      return false;
    }
    return true;
  };

  const checkEndTime = (text) => {
    if (!validateTime(text)) {
      Alert.alert('Hora inválida', 'Por favor, insira uma hora entre 00:00 e 23:59');
      return false;
    }
    return true;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f4c095' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Agenda</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.search}>
            <DropdownComponent placeholder='Selecione o dia' data={weekDays} value={search} setValue={setSearch} />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => handleModalContent('addSchedule')}>
            <Icon name='plus-square' type='font-awesome' color='white' />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredSchedules}
          renderItem={({ item }) => (
            <Item
              item={item}
              selected={selectedItem}
              onPress={() => handleSelectedItem(item)}
              setModalContent={(content, item) => handleModalContent(content, item)}
            />
          )}
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
        {modalContent === 'addSchedule' && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar Agenda</Text>
              <View style={styles.dropdownContainer}>
                <DropdownComponent placeholder='Selecione a Turma' data={classrooms} value={classroomId} setValue={setClassroomId} />
              </View>
              <View style={styles.dropdownContainer}>
                <DropdownComponent placeholder='Selecione o dia' data={weekDays} value={weekDay} setValue={setWeekDay} />
              </View>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99:99'
                }}
                style={styles.modalInput}
                onChangeText={setStartTime}
                value={startTime}
                placeholder='Hora de Início'
              />
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99:99'
                }}
                style={styles.modalInput}
                onChangeText={setEndTime}
                value={endTime}
                placeholder='Hora de Fim'
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.safeButton]}
                  onPress={() => addSchedule(classroomId, weekDay, startTime, endTime)}
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
        {modalContent === 'updateSchedule' && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar Aluno</Text>
              <View style={styles.dropdownContainer}>
                <DropdownComponent data={weekDays} value={weekDay} setValue={setWeekDay} />
              </View>
              <View style={styles.dropdownContainer}>
                <DropdownComponent data={classrooms} value={classroomId} setValue={setClassroomId} />
              </View>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99:99'
                }}
                style={styles.modalInput}
                onChangeText={setStartTime}
                value={startTime}
                placeholder='Hora de Início'
              />
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '99:99'
                }}
                style={styles.modalInput}
                onChangeText={setEndTime}
                value={endTime}
                placeholder='Hora de Fim'
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.safeButton]}
                  onPress={() => updateSchedule(id, classroomId, weekDay, startTime, endTime)}
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
        {modalContent === 'deleteSchedule' && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Excluir Agenda</Text>
              <Text style={styles.modalText}>Deseja realmente excluir esta agenda?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.dangerButton]}
                  onPress={() => {
                    deleteSchedule(id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 10
  },
  search: {
    width: '60%'
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b6b6b',
    textAlign: 'center',
    marginBottom: 10,
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
  dropdownContainer: {
    marginBottom: 10,
    width: '100%',
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
    width: '50%'
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
    gap: 20
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
