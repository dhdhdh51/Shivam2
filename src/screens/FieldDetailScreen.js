import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {deleteField} from '../utils/storage';
import {getCropAdvice} from '../utils/cropData';

const FieldDetailScreen = ({navigation, route}) => {
  const {field} = route.params;
  const advice = getCropAdvice(field.crop);

  const getDaysSinceSowing = () => {
    return Math.floor((Date.now() - new Date(field.sowingDate)) / (1000 * 60 * 60 * 24));
  };

  const handleDelete = () => {
    Alert.alert(
      'Khet Delete Karein?',
      `"${field.name}" aur uske saare records hamesha ke liye delete ho jayenge.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteField(field.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{field.name}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Icon name="trash-can-outline" size={22} color="#FFCDD2" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <StatBox label="Fasal" value={field.crop} icon="sprout" />
            <StatBox label="Rakba" value={`${field.area} acres`} icon="ruler" />
          </View>
          <View style={styles.summaryRow}>
            <StatBox label="Mitti" value={field.soilType} icon="terrain" />
            <StatBox label="Din Gaye" value={`${getDaysSinceSowing()} din`} icon="calendar-clock" />
          </View>
          {field.seedVariety ? (
            <View style={styles.varietyRow}>
              <Icon name="seed" size={14} color="#757575" />
              <Text style={styles.varietyText}>Variety: {field.seedVariety}</Text>
            </View>
          ) : null}
        </View>

        {/* Fertilizer Advice */}
        <SectionHeader title="Khad (Fertilizer) Salah" icon="flask" />
        {advice.fertilizers.map((fert, i) => (
          <View key={i} style={styles.fertCard}>
            <View style={styles.fertIcon}>
              <Icon name="flask" size={20} color="#E65100" />
            </View>
            <View style={styles.fertInfo}>
              <Text style={styles.fertName}>{fert.name}</Text>
              <Text style={styles.fertDose}>{fert.dose}</Text>
            </View>
          </View>
        ))}

        {/* Watering */}
        <SectionHeader title="Paani (Irrigation)" icon="water" />
        <View style={styles.infoCard}>
          <Icon name="water" size={20} color="#1565C0" />
          <Text style={styles.infoText}>{advice.wateringFrequency}</Text>
        </View>

        {/* Critical Stages */}
        <SectionHeader title="Zaroori Stages" icon="chart-timeline" />
        <View style={styles.stagesCard}>
          {advice.criticalStages.map((stage, i) => (
            <View key={i} style={styles.stageRow}>
              <View style={styles.stageDot} />
              <Text style={styles.stageText}>{stage}</Text>
            </View>
          ))}
        </View>

        {/* Pro Tip */}
        <SectionHeader title="Expert Tip" icon="lightbulb" />
        <View style={styles.tipCard}>
          <Icon name="lightbulb-on" size={22} color="#F57F17" />
          <Text style={styles.tipText}>{advice.tips}</Text>
        </View>

        {/* Sowing Time */}
        <SectionHeader title="Bawaai ka Sahi Waqt" icon="clock" />
        <View style={styles.infoCard}>
          <Icon name="calendar" size={20} color="#4CAF50" />
          <Text style={styles.infoText}>{advice.sowingTime}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const StatBox = ({label, value, icon}) => (
  <View style={styles.statBox}>
    <Icon name={icon} size={16} color="#2E7D32" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue} numberOfLines={2}>{value}</Text>
  </View>
);

const SectionHeader = ({title, icon}) => (
  <View style={styles.sectionHeader}>
    <Icon name={icon} size={16} color="#2E7D32" />
    <Text style={styles.sectionTitle}>{title}</Text>
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
  },
  backBtn: {marginRight: 12},
  headerTitle: {flex: 1, color: '#fff', fontSize: 17, fontWeight: '700'},
  deleteBtn: {marginLeft: 12, padding: 4},
  content: {padding: 16, paddingBottom: 40},
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  summaryRow: {flexDirection: 'row', gap: 12, marginBottom: 12},
  statBox: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    gap: 4,
  },
  statLabel: {fontSize: 11, color: '#757575', fontWeight: '600'},
  statValue: {fontSize: 13, color: '#212121', fontWeight: '700'},
  varietyRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4},
  varietyText: {fontSize: 13, color: '#757575'},
  aiAdviceBtn: {
    backgroundColor: '#1B5E20',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  aiAdviceBtnText: {flex: 1, color: '#fff', fontSize: 15, fontWeight: '700'},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 16},
  sectionTitle: {fontSize: 15, fontWeight: '700', color: '#212121'},
  fertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E65100',
  },
  fertIcon: {
    backgroundColor: '#FBE9E7',
    padding: 8,
    borderRadius: 10,
  },
  fertInfo: {flex: 1},
  fertName: {fontSize: 14, fontWeight: '700', color: '#212121'},
  fertDose: {fontSize: 12, color: '#757575', marginTop: 2},
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {flex: 1, fontSize: 14, color: '#424242', lineHeight: 20},
  stagesCard: {backgroundColor: '#fff', borderRadius: 12, padding: 14},
  stageRow: {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6},
  stageDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32'},
  stageText: {fontSize: 14, color: '#424242'},
  tipCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FFF176',
  },
  tipText: {flex: 1, fontSize: 14, color: '#424242', lineHeight: 20},
});

export default FieldDetailScreen;
