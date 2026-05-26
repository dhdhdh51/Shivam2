# Kisan Ledger (Flutter + Firebase)

Monorepo containing:
- `farmer_app`: Flutter Android farmer application
- `admin_panel`: Flutter Web admin dashboard
- `firebase`: Firestore rules/indexes and Cloud Functions for notifications

## Quick start
1. Install Flutter stable (>=3.24)
2. Install Firebase CLI and FlutterFire CLI
3. Run setup for each app:
   - `cd farmer_app && flutter pub get`
   - `cd ../admin_panel && flutter pub get`
4. Configure Firebase:
   - `flutterfire configure` inside each app
5. Deploy backend rules/indexes/functions:
   - `cd ../firebase && firebase deploy`

Detailed setup is in each app README.
