import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {saveField} from '../utils/storage';
import {scheduleWateringReminder, scheduleFertilizerReminder} from '../utils/notifications';
import {CROPS, SOIL_TYPES, getCropAdvice, getWateringDays} from '../utils/cropData';
import uuid from 'react-native-uuid';

const AddFieldScreen = ({navigation}) => {
  const [fieldName, setFieldName] = useState('');
  const [area, setArea] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [sowingDate, setSowingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [seedVariety, setSeedVariety] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!fieldName || !selectedCrop || !area || !selectedSoil) {
      Alert.alert('Bhai!', 'Sabhi zaroori fields bharo — naam, fasal, area aur mitti ka prakar.');
      return;
    }

    setSaving(true);
    try {
      const fieldId = uuid.v4();
      const advice = getCropAdvice(selectedCrop);
      const waterDays = getWateringDays(selectedCrop);

      const field = {
        id: fieldId,
        name: fieldName,
        area: parseFloat(area),
        crop: selectedCrop,
        soilType: selectedSoil,
        sowingDate: sowingDate.toISOString(),
        seedVariety,
        notes,
        createdAt: new Date().toISOString(),
      };

      await saveField(field);

      // Schedule watering reminder
      scheduleWateringReminder({
        fieldName,
        crop: selectedCrop,
        intervalDays: waterDays,
        fieldId,
      });

      // Schedule fertilizer reminders (staggered 30, 60, 90 days)
      advice.fertilizers.forEach((fert, index) => {
        scheduleFertilizerReminder({
          fieldName,
          fertilizerName: fert.name,
          daysFromNow: 30 + index * 20,
          fieldId,
          index,
        });
      });

      Alert.alert(
        '✅ Khet Add Ho Gaya!',
        `"${fieldName}" mein ${selectedCrop} ka record save ho gaya. Paani aur fertilizer reminders set ho gaye hain!`,
        [{text: 'Dekho', onPress: () => navigation.goBack()}],
      );
    } catch (e) {
      Alert.alert('Error', 'Kuch galat hua. Dobara try karein.');
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Naya Khet Add Karein</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel label="Khet ka Naam" icon="map-marker" />
        <TextInput
          style={styles.input}
          placeholder="e.g. Gaon ke piche wala khet"
          placeholderTextColor="#BDBDBD"
          value={fieldName}
          onChangeText={setFieldName}
        />

        <SectionLabel label="Rakba (Acres mein)" icon="ruler" />
        <TextInput
          style={styles.input}
          placeholder="e.g. 2.5"
          placeholderTextColor="#BDBDBD"
          value={area}
          onChangeText={setArea}
          keyboardType="decimal-pad"
        />

        <SectionLabel label="Fasal Chunein" icon="sprout" />
        <View style={styles.chipGrid}>
          {CROPS.map(crop => (
            <TouchableOpacity
              key={crop}
              style={[styles.chip, selectedCrop === crop && styles.chipSelected]}
              onPress={() => setSelectedCrop(crop)}>
              <Text style={[styles.chipText, selectedCrop === crop && styles.chipTextSelected]}>
                {crop}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel label="Mitti ka Prakar" icon="terrain" />
        <View style={styles.chipGrid}>
          {SOIL_TYPES.map(soil => (
            <TouchableOpacity
              key={soil}
              style={[styles.chip, selectedSoil === soil && styles.chipSelected]}
              onPress={() => setSelectedSoil(soil)}>
              <Text style={[styles.chipText, selectedSoil === soil && styles.chipTextSelected]}>
                {soil}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel label="Bawaai Ki Tarikh" icon="calendar" />
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}>
          <Icon name="calendar" size={18} color="#2E7D32" />
          <Text style={styles.dateText}>
            {sowingDate.toLocaleDateString('hi-IN', {day: 'numeric', month: 'long', year: 'numeric'})}
          </Text>
        </TouchableOpacity>

        <SectionLabel label="Beej ki Variety (Optional)" icon="seed" />
        <TextInput
          style={styles.input}
          placeholder="e.g. HD-2967, PUSA-44"
          placeholderTextColor="#BDBDBD"
          value={seedVariety}
          onChangeText={setSeedVariety}
        />

        <SectionLabel label="Notes (Optional)" icon="note-text" />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Koi khas baat jo yaad rakhni hai..."
          placeholderTextColor="#BDBDBD"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>
            {saving ? 'Save ho raha hai...' : 'Khet Save Karein & Reminders Set Karein'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={date => {setSowingDate(date); setShowDatePicker(false);}}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      />
    </View>
  );
};

const SectionLabel = ({label, icon}) => (
  <View style={styles.labelRow}>
    <Icon name={icon} size={16} color="#2E7D32" />
    <Text style={styles.label}>{label}</Text>
  </View>
);

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
  labelRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, marginBottom: 8},
  label: {fontSize: 14, fontWeight: '600', color: '#424242'},
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
  textArea: {height: 80, textAlignVertical: 'top'},
  chipGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {backgroundColor: '#2E7D32', borderColor: '#2E7D32'},
  chipText: {fontSize: 13, color: '#424242'},
  chipTextSelected: {color: '#fff', fontWeight: '600'},
  dateBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {fontSize: 15, color: '#212121'},
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
  saveBtnDisabled: {backgroundColor: '#A5D6A7'},
  saveBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});

export default AddFieldScreen;
