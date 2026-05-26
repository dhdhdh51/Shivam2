import React, {useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getReminders, saveReminder, deleteReminder} from '../utils/storage';
import {scheduleCustomReminder, cancelReminder} from '../utils/notifications';
import uuid from 'react-native-uuid';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date(Date.now() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadReminders = async () => {
    const data = await getReminders();
    setReminders(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  useFocusEffect(useCallback(() => {loadReminders();}, []));

  const addReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Bhai!', 'Reminder ka title likhna zaroori hai.');
      return;
    }
    const id = uuid.v4();
    const reminder = {id, title, date: reminderDate.toISOString(), createdAt: new Date().toISOString()};
    await saveReminder(reminder);
    scheduleCustomReminder({
      id,
      title: `🔔 ${title}`,
      message: 'Kisan Sathi reminder — aaj yeh kaam karna hai!',
      date: reminderDate,
    });
    setTitle('');
    setShowAdd(false);
    loadReminders();
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete?', 'Yeh reminder hata dein?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: async () => {
        cancelReminder(id);
        await deleteReminder(id);
        loadReminders();
      }},
    ]);
  };

  const isOverdue = date => new Date(date) < new Date();

  const renderReminder = ({item}) => (
    <View style={[styles.card, isOverdue(item.date) && styles.cardOverdue]}>
      <View style={styles.cardIcon}>
        <Icon name={isOverdue(item.date) ? 'bell-off' : 'bell-ring'} size={22}
          color={isOverdue(item.date) ? '#9E9E9E' : '#2E7D32'} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={[styles.cardDate, isOverdue(item.date) && styles.cardDateOverdue]}>
          {new Date(item.date).toLocaleString('hi-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
          {isOverdue(item.date) ? '  (Overdue)' : ''}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.delBtn}>
        <Icon name="trash-can-outline" size={20} color="#EF9A9A" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders 🔔</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
          <Icon name={showAdd ? 'close' : 'plus'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Naya Reminder</Text>
          <TextInput
            style={styles.input}
            placeholder="Kya karna hai? e.g. DAP dalna hai"
            placeholderTextColor="#BDBDBD"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar-clock" size={18} color="#2E7D32" />
            <Text style={styles.dateText}>
              {reminderDate.toLocaleString('hi-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={addReminder}>
            <Text style={styles.saveBtnText}>Reminder Set Karein</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={renderReminder}
        contentContainerStyle={reminders.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>Koi reminder nahi</Text>
            <Text style={styles.emptySubtitle}>+ button dabake apna pehla reminder add karein</Text>
          </View>
        }
      />

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={date => {setReminderDate(date); setShowDatePicker(false);}}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F1F8E9'},
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '700'},
  addBtn: {backgroundColor: '#1B5E20', padding: 8, borderRadius: 50},
  list: {padding: 16, gap: 10},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  cardOverdue: {borderLeftColor: '#BDBDBD', opacity: 0.7},
  cardIcon: {backgroundColor: '#E8F5E9', padding: 10, borderRadius: 10},
  cardInfo: {flex: 1},
  cardTitle: {fontSize: 14, fontWeight: '700', color: '#212121'},
  cardDate: {fontSize: 12, color: '#4CAF50', marginTop: 2},
  cardDateOverdue: {color: '#9E9E9E'},
  delBtn: {padding: 4},
  addCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  addTitle: {fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 12},
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#212121',
    marginBottom: 10,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  dateText: {fontSize: 14, color: '#212121'},
  saveBtn: {backgroundColor: '#2E7D32', borderRadius: 10, padding: 12, alignItems: 'center'},
  saveBtnText: {color: '#fff', fontWeight: '700', fontSize: 14},
  empty: {alignItems: 'center', padding: 40},
  emptyEmoji: {fontSize: 56, marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '700', color: '#424242'},
  emptySubtitle: {fontSize: 13, color: '#757575', textAlign: 'center', marginTop: 8},
});

export default RemindersScreen;
