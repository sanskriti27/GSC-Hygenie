import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:google_sign_in/google_sign_in.dart';

class home extends StatefulWidget {
  const home({super.key});

  @override
  State<home> createState() => _homeState();
}

class _homeState extends State<home> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  User? user;
  bool isloggedin = false;

  Future getUser() async {
    User? firebaseUser = _auth.currentUser;
    await firebaseUser?.reload();
    firebaseUser = _auth.currentUser;

    if (firebaseUser != null) {
      setState(() {
        this.user = firebaseUser!;
        this.isloggedin = true;
      });
    }
  }

  Future checkAuthentification() async {
    await _auth.authStateChanges().listen((user) {
      if (user == null) {
        print('redirecting');
        Navigator.pushNamedAndRemoveUntil(
            context, "phoneNumberEnter", (route) => false);
      }
    });
  }

  Future signOut(context) async {
    _auth.signOut();
    final googleSignIn = GoogleSignIn();
    await googleSignIn.signOut();
    Navigator.pushNamedAndRemoveUntil(
        context, "phoneNumberEnter", (route) => false);
  }

  @override
  void initState() {
    super.initState();
    this.checkAuthentification().whenComplete(() {
      setState(() {});
    });
    this.getUser().whenComplete(() {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          iconTheme:
              const IconThemeData(color: Color.fromRGBO(99, 100, 167, 1)),
          elevation: 0.0,
          title: const Text(
            'Dash Board',
            style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 20,
                color: Color.fromRGBO(99, 100, 167, 1)),
          ),
          actions: <Widget>[
            IconButton(
              icon: const Icon(
                Icons.logout,
                color: Color.fromRGBO(99, 100, 167, 1),
              ),
              onPressed: () {
                signOut(context);
              },
            ),
          ]),
      body: user == null
          ? Container()
          : Column(
              children: [
                Text(
                  'Welcome ' + '${user?.uid}',
                  style: TextStyle(
                      color: Color.fromRGBO(99, 100, 167, 1), fontSize: 20),
                ),
              ],
            ),
    );
  }
}
