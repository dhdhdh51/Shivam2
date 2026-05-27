import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const ProviderScope(child: KisanFarmerApp()));
}

final authStateProvider = StreamProvider<User?>((ref) => FirebaseAuth.instance.authStateChanges());

class KisanFarmerApp extends ConsumerWidget {
  const KisanFarmerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    return MaterialApp(
      title: 'Kisan Ledger',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      darkTheme: ThemeData.dark(useMaterial3: true),
      home: auth.when(
        data: (user) => user == null ? const LoginPage() : const DashboardPage(),
        loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
        error: (e, _) => Scaffold(body: Center(child: Text('Error: $e'))),
      ),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final email = TextEditingController();
  final pass = TextEditingController();
  String? error;

  Future<void> signIn() async {
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(email: email.text.trim(), password: pass.text.trim());
    } on FirebaseAuthException catch (e) {
      setState(() => error = e.message);
    }
  }

  Future<void> resetPassword() async {
    if (email.text.isEmpty) return;
    await FirebaseAuth.instance.sendPasswordResetEmail(email: email.text.trim());
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password reset email sent')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kisan Ledger Farmer Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
          TextField(controller: pass, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
          const SizedBox(height: 12),
          ElevatedButton(onPressed: signIn, child: const Text('Login')),
          TextButton(onPressed: resetPassword, child: const Text('Forgot Password')),
          if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
        ]),
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final userDoc = FirebaseFirestore.instance.collection('users').doc(uid);
    final fieldsQ = FirebaseFirestore.instance.collection('fields').where('farmerId', isEqualTo: uid);
    final expensesQ = FirebaseFirestore.instance.collection('expenses').where('farmerId', isEqualTo: uid);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kisan Ledger Dashboard'),
        actions: [IconButton(onPressed: () => FirebaseAuth.instance.signOut(), icon: const Icon(Icons.logout))],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
            stream: userDoc.snapshots(),
            builder: (_, s) => Text('Welcome ${s.data?.data()?['name'] ?? 'Farmer'}', style: Theme.of(context).textTheme.headlineSmall),
          ),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: _CounterCard(title: 'Fields', stream: fieldsQ.snapshots())),
            const SizedBox(width: 8),
            Expanded(child: _CounterCard(title: 'Expenses', stream: expensesQ.snapshots())),
          ]),
        ]),
      ),
    );
  }
}

class _CounterCard extends StatelessWidget {
  final String title;
  final Stream<QuerySnapshot<Map<String, dynamic>>> stream;
  const _CounterCard({required this.title, required this.stream});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
          stream: stream,
          builder: (_, s) => Column(children: [Text(title), Text('${s.data?.size ?? 0}', style: Theme.of(context).textTheme.headlineMedium)]),
        ),
      ),
    );
  }
}
