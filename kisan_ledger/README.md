# Kisan Ledger (Flutter + Firebase)

Monorepo containing:
- `farmer_app`: Flutter Android farmer application
- `admin_panel`: Flutter Web admin dashboard
- `firebase`: Firestore/Storage rules and indexes

## Prerequisites
- Flutter stable (3.24+)
- Dart SDK (bundled with Flutter)
- Firebase CLI: `npm i -g firebase-tools`
- FlutterFire CLI: `dart pub global activate flutterfire_cli`

## Local setup
1. Farmer app
   - `cd kisan_ledger/farmer_app`
   - `flutter pub get`
   - `flutterfire configure`
   - `flutter run`
2. Admin panel (web)
   - `cd ../admin_panel`
   - `flutter pub get`
   - `flutterfire configure`
   - `flutter run -d chrome`
3. Backend deploy
   - `cd ../firebase`
   - `firebase deploy --only firestore:rules,firestore:indexes,storage`

## CI/CD
- Workflow builds Farmer APK and Admin web on push/PR affecting `kisan_ledger/**`.
- Farmer APK is signed only when these GitHub secrets exist:
  - `ANDROID_KEYSTORE_BASE64`
  - `ANDROID_KEY_ALIAS`
  - `ANDROID_KEYSTORE_PASSWORD`
  - `ANDROID_KEY_PASSWORD`
