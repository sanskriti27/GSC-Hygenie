import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:hygenie/homePage/home.dart';
import 'otpSignIn/otp.dart';
import 'otpSignIn/phoneNumber.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: 'phoneNumberEnter',
    routes: {
      'phoneNumberEnter': (context) => phoneNumberEnter(),
      'otpEnter': (context) => otpEnter(),
      'homePage': (context) => home(),
    },
  ));
}
