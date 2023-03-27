import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../commonDrawer.dart';

class home extends StatefulWidget {
  const home({super.key});

  @override
  State<home> createState() => _homeState();
}

class _homeState extends State<home> {
  User? user;
  int navIndex = 0;
  var height, width;
  bool isloggedin = false;
  final FirebaseAuth _auth = FirebaseAuth.instance;

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
    height = MediaQuery.of(context).size.height;
    width = MediaQuery.of(context).size.width;
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
              image: AssetImage('images/homePageBGImage.png'),
              fit: BoxFit.cover)),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        drawer: NavigationDrawerWidget(),
        appBar: AppBar(
            backgroundColor: Colors.transparent,
            iconTheme: const IconThemeData(color: Colors.white),
            elevation: 0.0,
            actions: <Widget>[
              IconButton(
                icon: const Icon(
                  Icons.logout,
                  color: Colors.white,
                ),
                onPressed: () {
                  signOut(context);
                },
              ),
            ]),
        body: SingleChildScrollView(
            child: user == null
                ? Container()
                : SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(
                          height: height * 0.018,
                        ),
                        Container(
                          padding: EdgeInsets.only(
                              left: width * 0.06, right: width * 0.06),
                          alignment: Alignment.topCenter,
                          child: TextField(
                            decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: height * 0.018),
                                filled: true,
                                fillColor: Colors.white,
                                hintText: "Enter current loaction",
                                hintStyle:
                                    TextStyle(color: Colors.grey, fontSize: 16),
                                prefixIcon: const Icon(Icons.search),
                                border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(25),
                                    borderSide: BorderSide())),
                          ),
                        ),
                        SizedBox(
                          height: height * 0.27,
                        ),
                        Container(
                          alignment: Alignment.centerLeft,
                          padding: EdgeInsets.only(
                              left: width * 0.06, right: width * 0.06),
                          child: const Text(
                            "Want to find",
                            textAlign: TextAlign.left,
                            style: TextStyle(
                                color: Color.fromRGBO(255, 255, 255, 1),
                                fontFamily: 'Montserrat',
                                fontSize: 32,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                        Container(
                          alignment: Alignment.centerLeft,
                          padding: EdgeInsets.only(
                              left: width * 0.06,
                              right: width * 0.06,
                              bottom: height * 0.05),
                          child: const Text(
                            "toilets nearby?",
                            textAlign: TextAlign.left,
                            style: TextStyle(
                                color: Color.fromRGBO(255, 255, 255, 1),
                                fontFamily: 'Montserrat',
                                fontSize: 32,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                        Container(
                          alignment: Alignment.centerLeft,
                          padding: EdgeInsets.only(left: width * 0.06),
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              elevation: 8,
                              backgroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              padding: EdgeInsets.fromLTRB(width * 0.28,
                                  width * 0.033, width * 0.28, width * 0.033),
                            ),
                            child: const Text(
                              'Search',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  color: Color.fromRGBO(55, 63, 81, 1),
                                  fontFamily: 'Montserrat',
                                  fontSize: 18,
                                  letterSpacing:
                                      0 /*percentages not used in flutter. defaulting to zero*/,
                                  fontWeight: FontWeight.normal,
                                  height: 1),
                            ),
                          ),
                        ),
                      ],
                    ),
                  )),
      ),
    );
  }
}
