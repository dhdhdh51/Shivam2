import React, {useState, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {saveExpense, getFields} from '../utils/storage';
import uuid from 'react-native-uuid';

const CATEGORIES = ['Seed', 'Fertilizer', 'Pesticide', 'Labour', 'Irrigation', 'Equipment', 'Transport', 'Other'];

const AddExpenseScreen = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    getFields().then(setFields);
  }, []);

  const handleSave = async () => {
    if (!description || !amount || !category) {
      Alert.alert('Bhai!', 'Description, amount aur category zaroori hai.');
      return;
    }
    const expense = {
      id: uuid.v4(),
      description,
      amount: parseFloat(amount),
      category,
      fieldName: selectedField?.name || null,
      fieldId: selectedField?.id || null,
      date: new Date().toISOString(),
    };
    await saveExpense(expense);
    Alert.alert('✅ Kharcha Save!', `₹${parseFloat(amount).toLocaleString('en-IN')} ka kharcha record ho gaya.`, [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kharcha Add Karein</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Label text="Kya kharcha hua?" />
        <TextInput
          style={styles.input}
          placeholder="e.g. Urea kharid, Majdoori"
          placeholderTextColor="#BDBDBD"
          value={description}
          onChangeText={setDescription}
        />

        <Label text="Amount (₹)" />
        <TextInput
          style={styles.input}
          placeholder="e.g. 1500"
          placeholderTextColor="#BDBDBD"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Label text="Category" />
        <View style={styles.chipGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}>
              <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {fields.length > 0 && (
          <>
            <Label text="Khet (Optional)" />
            <View style={styles.chipGrid}>
              {fields.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.chip, selectedField?.id === f.id && styles.chipSelected]}
                  onPress={() => setSelectedField(selectedField?.id === f.id ? null : f)}>
                  <Text style={[styles.chipText, selectedField?.id === f.id && styles.chipTextSelected]}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>Kharcha Save Karein</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({text}) => <Text style={styles.label}>{text}</Text>;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F1F8E9'},
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {padding: 4},
  headerTitle: {color: '#fff', fontSize: 17, fontWeight: '700'},
  content: {padding: 16, paddingBottom: 40},
  label: {fontSize: 14, fontWeight: '600', color: '#424242', marginTop: 18, marginBottom: 8},
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipSelected: {backgroundColor: '#2E7D32', borderColor: '#2E7D32'},
  chipText: {fontSize: 13, color: '#424242'},
  chipTextSelected: {color: '#fff', fontWeight: '600'},
  saveBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
  },
  saveBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});

export default AddExpenseScreen;
