import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FIELDS: 'ks_fields',
  REMINDERS: 'ks_reminders',
  EXPENSES: 'ks_expenses',
};

// Fields
export const getFields = async () => {
  const data = await AsyncStorage.getItem(KEYS.FIELDS);
  return data ? JSON.parse(data) : [];
};

export const saveField = async field => {
  const fields = await getFields();
  const existing = fields.findIndex(f => f.id === field.id);
  if (existing >= 0) {
    fields[existing] = field;
  } else {
    fields.push(field);
  }
  await AsyncStorage.setItem(KEYS.FIELDS, JSON.stringify(fields));
};

export const deleteField = async id => {
  const fields = await getFields();
  await AsyncStorage.setItem(
    KEYS.FIELDS,
    JSON.stringify(fields.filter(f => f.id !== id)),
  );
};

// Reminders
export const getReminders = async () => {
  const data = await AsyncStorage.getItem(KEYS.REMINDERS);
  return data ? JSON.parse(data) : [];
};

export const saveReminder = async reminder => {
  const reminders = await getReminders();
  const existing = reminders.findIndex(r => r.id === reminder.id);
  if (existing >= 0) {
    reminders[existing] = reminder;
  } else {
    reminders.push(reminder);
  }
  await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
};

export const deleteReminder = async id => {
  const reminders = await getReminders();
  await AsyncStorage.setItem(
    KEYS.REMINDERS,
    JSON.stringify(reminders.filter(r => r.id !== id)),
  );
};

// Expenses / Finance
export const getExpenses = async () => {
  const data = await AsyncStorage.getItem(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = async expense => {
  const expenses = await getExpenses();
  expenses.push(expense);
  await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const deleteExpense = async id => {
  const expenses = await getExpenses();
  await AsyncStorage.setItem(
    KEYS.EXPENSES,
    JSON.stringify(expenses.filter(e => e.id !== id)),
  );
};
