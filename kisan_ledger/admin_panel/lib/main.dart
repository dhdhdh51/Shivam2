import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const KisanAdminApp());
}

class KisanAdminApp extends StatelessWidget {
  const KisanAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kisan Ledger Admin',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      home: const AdminGate(),
    );
  }
}

class AdminGate extends StatelessWidget {
  const AdminGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (_, s) {
        if (!s.hasData) return const AdminLogin();
        return FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
          future: FirebaseFirestore.instance.collection('users').doc(s.data!.uid).get(),
          builder: (_, roleSnap) {
            if (!roleSnap.hasData) return const Scaffold(body: Center(child: CircularProgressIndicator()));
            final role = roleSnap.data!.data()?['role'];
            if (role == 'admin' || role == 'super_admin') return const AdminDashboard();
            return const Scaffold(body: Center(child: Text('Unauthorized')));
          },
        );
      },
    );
  }
}

class AdminLogin extends StatefulWidget { const AdminLogin({super.key}); @override State<AdminLogin> createState()=>_AdminLoginState(); }
class _AdminLoginState extends State<AdminLogin> {
  final email = TextEditingController(); final pass = TextEditingController(); String? e;
  Future<void> login() async { try { await FirebaseAuth.instance.signInWithEmailAndPassword(email: email.text.trim(), password: pass.text.trim()); } on FirebaseAuthException catch (ex) { setState(() => e = ex.message); } }
  @override Widget build(BuildContext context)=>Scaffold(body: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420), child: Column(mainAxisSize: MainAxisSize.min, children:[TextField(controller: email, decoration: const InputDecoration(labelText: 'Email')), TextField(controller: pass, obscureText: true, decoration: const InputDecoration(labelText:'Password')), ElevatedButton(onPressed: login, child: const Text('Admin Login')), if(e!=null) Text(e!, style: const TextStyle(color: Colors.red))]))));
}

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});
  @override
  Widget build(BuildContext context) {
    final users = FirebaseFirestore.instance.collection('users').snapshots();
    final tickets = FirebaseFirestore.instance.collection('support_tickets').orderBy('createdAt', descending: true).limit(20).snapshots();
    return Scaffold(
      appBar: AppBar(title: const Text('Kisan Ledger Admin Dashboard'), actions: [IconButton(onPressed: ()=>FirebaseAuth.instance.signOut(), icon: const Icon(Icons.logout))]),
      body: Row(children: [
        Expanded(child: StreamBuilder<QuerySnapshot<Map<String,dynamic>>>(stream: users, builder: (_, s)=>Card(child: ListView(children:[const ListTile(title: Text('Farmers')), for(final d in s.data?.docs ?? []) ListTile(title: Text(d.data()['name'] ?? ''), subtitle: Text(d.data()['email'] ?? ''), trailing: Switch(value: !(d.data()['blocked'] ?? false), onChanged: (v)=>d.reference.update({'blocked': !v})))])))),
        Expanded(child: StreamBuilder<QuerySnapshot<Map<String,dynamic>>>(stream: tickets, builder: (_, s)=>Card(child: ListView(children:[const ListTile(title: Text('Support Tickets')), for(final d in s.data?.docs ?? []) ListTile(title: Text(d.data()['subject'] ?? ''), subtitle: Text(d.data()['status'] ?? 'open'))])))),
      ]),
    );
  }
}
