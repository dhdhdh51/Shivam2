import React, {useState, useCallback} from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getFields} from '../utils/storage';

const HomeScreen = ({navigation}) => {
  const [fields, setFields] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFields = async () => {
    const data = await getFields();
    setFields(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFields();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFields();
    setRefreshing(false);
  };

  const getCropEmoji = crop => {
    const emojiMap = {
      'Wheat (Gehun)': '🌾',
      'Rice (Chawal)': '🍚',
      'Maize (Makka)': '🌽',
      'Tomato': '🍅',
      'Potato (Aloo)': '🥔',
      'Cotton (Kapas)': '☁️',
      'Onion (Pyaaz)': '🧅',
      'Sugarcane (Ganna)': '🎋',
    };
    return emojiMap[crop] || '🌱';
  };

  const getDaysSinceSowing = sowingDate => {
    if (!sowingDate) return null;
    const diff = Math.floor((Date.now() - new Date(sowingDate)) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const renderField = ({item}) => {
    const days = getDaysSinceSowing(item.sowingDate);
    return (
      <TouchableOpacity
        style={styles.fieldCard}
        onPress={() => navigation.navigate('FieldDetail', {field: item})}
        activeOpacity={0.85}>
        <View style={styles.cardTop}>
          <Text style={styles.cropEmoji}>{getCropEmoji(item.crop)}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.fieldName}>{item.name}</Text>
            <Text style={styles.cropName}>{item.crop}</Text>
            <Text style={styles.soilText}>{item.soilType} Soil • {item.area} acres</Text>
          </View>
          {days !== null && (
            <View style={styles.daysBadge}>
              <Text style={styles.daysNum}>{days}</Text>
              <Text style={styles.daysLabel}>days</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBottom}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Icon name="water" size={12} color="#1565C0" />
              <Text style={styles.tagText}>Watering set</Text>
            </View>
            <View style={[styles.tag, {backgroundColor: '#E8F5E9'}]}>
              <Icon name="leaf" size={12} color="#2E7D32" />
              <Text style={[styles.tagText, {color: '#2E7D32'}]}>AI advice ready</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="#BDBDBD" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Jai Kisan 🌾</Text>
          <Text style={styles.subtitle}>{fields.length} field{fields.length !== 1 ? 's' : ''} registered</Text>
        </View>

      </View>

      <FlatList
        data={fields}
        keyExtractor={item => item.id}
        renderItem={renderField}
        contentContainerStyle={fields.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Koi khet nahi mila</Text>
            <Text style={styles.emptySubtitle}>Neeche + button dabake apna pehla khet add karein</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddField')}
        activeOpacity={0.9}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F1F8E9'},
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {color: '#fff', fontSize: 22, fontWeight: '700'},
  subtitle: {color: '#A5D6A7', fontSize: 13, marginTop: 2},

  listContent: {padding: 16, gap: 12},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  cardTop: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  cropEmoji: {fontSize: 38, marginRight: 12},
  cardInfo: {flex: 1},
  fieldName: {fontSize: 16, fontWeight: '700', color: '#212121'},
  cropName: {fontSize: 13, color: '#2E7D32', fontWeight: '600', marginTop: 2},
  soilText: {fontSize: 12, color: '#757575', marginTop: 2},
  daysBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    minWidth: 48,
  },
  daysNum: {fontSize: 18, fontWeight: '800', color: '#2E7D32'},
  daysLabel: {fontSize: 10, color: '#4CAF50'},
  cardBottom: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  tagRow: {flexDirection: 'row', gap: 8},
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {fontSize: 11, color: '#1565C0', fontWeight: '600'},
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2E7D32',
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  empty: {alignItems: 'center', padding: 40},
  emptyEmoji: {fontSize: 64, marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '700', color: '#424242'},
  emptySubtitle: {fontSize: 14, color: '#757575', textAlign: 'center', marginTop: 8},
});

export default HomeScreen;
