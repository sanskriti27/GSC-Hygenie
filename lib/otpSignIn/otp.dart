import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:hygenie/otpSignIn/phoneNumber.dart';
import 'package:hygenie/otpSignIn/storeUserInfo.dart';
import 'package:pinput/pinput.dart';
import 'package:hygenie/homePage/home.dart';
import 'package:shared_preferences/shared_preferences.dart';

class otpEnter extends StatefulWidget {
  otpEnter({Key? key}) : super(key: key);

  @override
  State<otpEnter> createState() => _otpEnterState();
}

class _otpEnterState extends State<otpEnter> {
  var height, width, phoneNumber;
  User? currentUser;
  SharedPreferences? prefs;
  final FirebaseAuth auth = FirebaseAuth.instance;

  @override
  Widget build(BuildContext context) {
    height = MediaQuery.of(context).size.height;
    width = MediaQuery.of(context).size.width;

    final defaultPinTheme = PinTheme(
      // margin: EdgeInsets.only(left: width * 0.025, right: width * 0.025),
      width: 49,
      height: 49,
      textStyle: const TextStyle(
          fontSize: 20,
          color: Color.fromRGBO(26, 42, 82, 1),
          fontWeight: FontWeight.w600),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color.fromRGBO(177, 177, 177, 1)),
        borderRadius: BorderRadius.circular(8),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyDecorationWith(
      color: Color.fromARGB(255, 240, 230, 230),
      border: Border.all(color: const Color.fromRGBO(114, 178, 238, 1)),
      borderRadius: BorderRadius.circular(8),
    );

    final submittedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        color: Colors.white,
      ),
    );
    var otpCode = "";
    UserCredential user;

    return Scaffold(
        backgroundColor: Color.fromRGBO(243, 245, 247, 1),
        body: SingleChildScrollView(
            child: Stack(children: [
          Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: height * 0.15,
                ),
                Container(
                    padding: EdgeInsets.only(
                        left: width * 0.063, bottom: height * 0.03),
                    child: const Text('Enter OTP',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            color: Color.fromRGBO(26, 42, 82, 1),
                            fontFamily: 'Montserrat',
                            fontSize: 32,
                            fontWeight: FontWeight.bold))),
                Container(
                  alignment: Alignment.center,
                  child: Pinput(
                    onCompleted: (value) async {
                      otpCode = value;
                      print("comp: ${otpCode}");
                      try {
                        print(otpCode);
                        print("otp: ${phoneNumberEnter.verify}");
                        PhoneAuthCredential credential =
                            PhoneAuthProvider.credential(
                                verificationId: phoneNumberEnter.verify,
                                smsCode: otpCode);

                        User? firebaseUser =
                            (await auth.signInWithCredential(credential)).user;

                        if (firebaseUser != null) {
                          // Check is already sign up
                          final QuerySnapshot result = await FirebaseFirestore
                              .instance
                              .collection('users')
                              .where('id', isEqualTo: firebaseUser.uid)
                              .get();
                          final List<DocumentSnapshot> documents = result.docs;
                          if (documents.length == 0) {
                            // Update data to server if new user
                            FirebaseFirestore.instance
                                .collection('users')
                                .doc(firebaseUser.uid)
                                .set({
                              'nickname': firebaseUser.displayName,
                              'photoUrl': firebaseUser.photoURL,
                              'id': firebaseUser.uid,
                              'createdAt': DateTime.now().toString(),
                              'phoneNumber': phoneNumberEnter.phnNo
                            });
                          }
                        }

                        Navigator.pushNamedAndRemoveUntil(
                            context, "homePage", (route) => false);
                      } catch (e) {
                        const AlertDialog(
                          title: Text("Incorrect OTP"),
                          content: Text("Enter the correct 6-digit OTP."),
                        );
                      }
                    },
                    onSubmitted: (value) {},
                    defaultPinTheme: defaultPinTheme,
                    focusedPinTheme: focusedPinTheme,
                    submittedPinTheme: submittedPinTheme,
                    length: 6,
                    pinputAutovalidateMode: PinputAutovalidateMode.disabled,
                    showCursor: true,
                  ),
                ),
                Container(
                  padding: EdgeInsets.only(top: height * 0.07),
                  alignment: Alignment.center,
                  child: ElevatedButton(
                    onPressed: () async {
                      Navigator.pushNamedAndRemoveUntil(
                          context, "phoneNumberEnter", (route) => false);
                    },
                    style: ElevatedButton.styleFrom(
                      elevation: 8,
                      backgroundColor: const Color.fromRGBO(26, 42, 82, 1),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                      padding: EdgeInsets.fromLTRB(width * 0.2, width * 0.035,
                          width * 0.2, width * 0.035),
                    ),
                    child: const Text('Edit Phone Number',
                        style: TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 20,
                            color: Colors.white),
                        textAlign: TextAlign.center),
                  ),
                ),
                Container(
                  alignment: Alignment.center,
                  padding: EdgeInsets.only(top: height * 0.001, bottom: 0),
                  child: TextButton(
                    onPressed: () async {
                      print("resend: ${phoneNumberEnter.phnNo}");
                      await FirebaseAuth.instance.verifyPhoneNumber(
                        phoneNumber: '${phoneNumberEnter.phnNo}',
                        timeout: const Duration(seconds: 120),
                        verificationCompleted:
                            (PhoneAuthCredential credential) {},
                        verificationFailed: (FirebaseAuthException e) {},
                        codeSent: (String verificationId, int? resendToken) {
                          phoneNumberEnter.verify = verificationId;
                          print("phonel: ${phoneNumberEnter.verify}");
                        },
                        codeAutoRetrievalTimeout: (String verificationId) {},
                      );
                    },
                    child: const Text('Resend OTP',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            color: Color.fromRGBO(26, 42, 82, 1),
                            fontFamily: 'Montserrat',
                            fontSize: 20,
                            fontWeight: FontWeight.w500)),
                  ),
                )
              ])
        ])));
  }
}
