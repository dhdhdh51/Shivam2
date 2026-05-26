import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getExpenses, deleteExpense} from '../utils/storage';

const CATEGORY_ICONS = {
  Seed: {icon: 'seed', color: '#2E7D32', bg: '#E8F5E9'},
  Fertilizer: {icon: 'flask', color: '#E65100', bg: '#FBE9E7'},
  Pesticide: {icon: 'skull-crossbones', color: '#7B1FA2', bg: '#F3E5F5'},
  Labour: {icon: 'account-group', color: '#1565C0', bg: '#E3F2FD'},
  Irrigation: {icon: 'water', color: '#0277BD', bg: '#E1F5FE'},
  Equipment: {icon: 'tractor', color: '#4E342E', bg: '#EFEBE9'},
  Transport: {icon: 'truck', color: '#F57F17', bg: '#FFFDE7'},
  Other: {icon: 'dots-horizontal', color: '#424242', bg: '#F5F5F5'},
};

const FinanceScreen = ({navigation}) => {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useFocusEffect(useCallback(() => {loadExpenses();}, []));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const renderExpense = ({item}) => {
    const cat = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Other;
    return (
      <View style={styles.expenseCard}>
        <View style={[styles.catIcon, {backgroundColor: cat.bg}]}>
          <Icon name={cat.icon} size={20} color={cat.color} />
        </View>
        <View style={styles.expInfo}>
          <Text style={styles.expTitle}>{item.description}</Text>
          <Text style={styles.expMeta}>
            {item.category} • {new Date(item.date).toLocaleDateString('hi-IN')}
          </Text>
          {item.fieldName ? <Text style={styles.expField}>📍 {item.fieldName}</Text> : null}
        </View>
        <Text style={styles.expAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kharcha Hisaab 💰</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddExpense', {onSave: loadExpenses})}>
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Kul Kharcha</Text>
            <Text style={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{expenses.length} entries</Text>
          </View>
        </View>

        {Object.keys(byCategory).length > 0 && (
          <View style={styles.catBreakdown}>
            {Object.entries(byCategory).slice(0, 4).map(([cat, amt]) => {
              const c = CATEGORY_ICONS[cat] || CATEGORY_ICONS.Other;
              return (
                <View key={cat} style={styles.catChip}>
                  <Icon name={c.icon} size={12} color={c.color} />
                  <Text style={styles.catChipText}>{cat}</Text>
                  <Text style={styles.catChipAmt}>₹{Math.round(amt / 1000)}K</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={renderExpense}
        contentContainerStyle={expenses.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={styles.emptyTitle}>Koi kharcha record nahi</Text>
            <Text style={styles.emptySubtitle}>+ button se apna pehla kharcha add karein</Text>
          </View>
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '700'},
  addBtn: {backgroundColor: '#1B5E20', padding: 8, borderRadius: 50},
  summaryCard: {
    backgroundColor: '#2E7D32',
    margin: 16,
    borderRadius: 18,
    padding: 20,
  },
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14},
  totalLabel: {color: '#A5D6A7', fontSize: 13},
  totalAmount: {color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 2},
  countBadge: {backgroundColor: '#1B5E20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6},
  countText: {color: '#A5D6A7', fontSize: 13},
  catBreakdown: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  catChip: {
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  catChipText: {color: '#A5D6A7', fontSize: 12},
  catChipAmt: {color: '#fff', fontSize: 12, fontWeight: '700'},
  list: {paddingHorizontal: 16, gap: 10, paddingBottom: 20},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
  },
  catIcon: {padding: 10, borderRadius: 10},
  expInfo: {flex: 1},
  expTitle: {fontSize: 14, fontWeight: '700', color: '#212121'},
  expMeta: {fontSize: 12, color: '#757575', marginTop: 2},
  expField: {fontSize: 12, color: '#4CAF50', marginTop: 2},
  expAmount: {fontSize: 15, fontWeight: '800', color: '#C62828'},
  empty: {alignItems: 'center', padding: 40},
  emptyEmoji: {fontSize: 56, marginBottom: 16},
  emptyTitle: {fontSize: 18, fontWeight: '700', color: '#424242'},
  emptySubtitle: {fontSize: 13, color: '#757575', textAlign: 'center', marginTop: 8},
});

export default FinanceScreen;
