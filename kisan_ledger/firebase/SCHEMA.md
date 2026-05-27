# Firestore Schema

## Collections
- users: `{name, email, role, blocked, phone, village, createdAt}`
- fields: `{farmerId, name, village, area, areaUnit, polygon, gpsCenter, imageUrls, createdAt}`
- crops: `{farmerId, fieldId, cropName, seedVariety, sowingDate, harvestDate, stage, notes}`
- activities: `{farmerId, fieldId, cropId, type, date, quantity, unit, cost, notes, photoUrls}`
- expenses: `{farmerId, fieldId, category, amount, date, note}`
- irrigation_logs: `{farmerId, fieldId, date, source, motorHours, quantityEstimate, reminderDate}`
- notifications: `{farmerId, title, body, type, sentAt, readAt}`
- mandi_prices: `{cropName, market, unit, price, updatedAt}`
- farming_tips: `{title, body, imageUrl, season, createdAt, updatedAt}`
- government_schemes: `{title, description, eligibility, imageUrl, link, createdAt}`
- support_tickets: `{farmerId, subject, message, status, adminReply, createdAt, updatedAt}`
