import PushNotification from 'react-native-push-notification';

export const scheduleWateringReminder = ({fieldName, crop, intervalDays, fieldId}) => {
  const notifId = `water_${fieldId}`;
  PushNotification.cancelLocalNotification(notifId);

  PushNotification.localNotificationSchedule({
    id: notifId,
    channelId: 'kisan-sathi-reminders',
    title: `💧 Paani ka Time — ${fieldName}`,
    message: `${crop} ko aaj paani dena hai. Apna khet check karein!`,
    date: new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000),
    repeatType: 'day',
    repeatTime: intervalDays,
    allowWhileIdle: true,
    importance: 'high',
  });
};

export const scheduleFertilizerReminder = ({fieldName, fertilizerName, daysFromNow, fieldId, index}) => {
  const notifId = `fert_${fieldId}_${index}`;
  PushNotification.cancelLocalNotification(notifId);

  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);

  PushNotification.localNotificationSchedule({
    id: notifId,
    channelId: 'kisan-sathi-reminders',
    title: `🌱 Fertilizer Reminder — ${fieldName}`,
    message: `Aaj ${fertilizerName} dalne ka waqt hai. Sahi dose yaad rakhein!`,
    date,
    allowWhileIdle: true,
    importance: 'high',
  });
};

export const scheduleCustomReminder = ({title, message, date, id}) => {
  PushNotification.cancelLocalNotification(id);
  PushNotification.localNotificationSchedule({
    id,
    channelId: 'kisan-sathi-reminders',
    title,
    message,
    date,
    allowWhileIdle: true,
    importance: 'high',
  });
};

export const cancelReminder = id => {
  PushNotification.cancelLocalNotification(id);
};
