import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';
import 'package:hygenie/otpSignIn/storeUserInfo.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/material.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

class phoneNumberEnter extends StatefulWidget {
  phoneNumberEnter({Key? key}) : super(key: key);
  static String verify = "";
  @override
  State<phoneNumberEnter> createState() => _phoneNumberEnter();
}

class _phoneNumberEnter extends State<phoneNumberEnter> {
  var height, width, phoneNumber;
  bool phoneNUmberFilled = false;
  SharedPreferences? prefs;
  User? currentUser;

  signInWithGoogle() async {
    prefs = await SharedPreferences.getInstance();

    // Trigger the authentication flow
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
    // Obtain the auth details from the request
    final GoogleSignInAuthentication googleAuth =
        await googleUser!.authentication;
    // Create a new credential
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    User? firebaseUser =
        (await FirebaseAuth.instance.signInWithCredential(credential)).user;
    // return await FirebaseAuth.instance.signInWithCredential(credential);

    if (firebaseUser != null) {
      // Check is already sign up
      final QuerySnapshot result = await FirebaseFirestore.instance
          .collection('users')
          .where('id', isEqualTo: firebaseUser.uid)
          .get();
      final List<DocumentSnapshot> documents = result.docs;
      if (documents.length == 0) {
        // Update data to server if new user
        FirebaseFirestore.instance
            .collection('chat')
            .doc(firebaseUser.uid)
            .set({
          'nickname': firebaseUser.displayName,
          'photoUrl': firebaseUser.photoURL,
          'id': firebaseUser.uid,
          'createdAt': DateTime.now().toString(),
          'chattingWith': null
        });

        // Write data to local
        currentUser = firebaseUser;
        await prefs?.setString('id', currentUser!.uid);
        await prefs?.setString('nickname', currentUser!.displayName ?? "");
        await prefs?.setString('photoUrl', currentUser!.photoURL ?? "");
      } else {
        DocumentSnapshot documentSnapshot = documents[0];
        UserChat userChat = UserChat.fromDocument(documentSnapshot);
        // Write data to local
        await prefs?.setString('id', userChat.id);
        await prefs?.setString('nickname', userChat.nickname);
        await prefs?.setString('photoUrl', userChat.photoUrl);
        await prefs?.setString('aboutMe', userChat.aboutMe);
      }
      // Navigator.push(context, MaterialPageRoute(builder: (context) => HomeScreen(currentUserId: firebaseUser.uid)));
    }
  }

  @override
  Widget build(BuildContext context) {
    height = MediaQuery.of(context).size.height;
    width = MediaQuery.of(context).size.width;
    return Scaffold(
      backgroundColor: Color.fromRGBO(243, 245, 247, 1),
      body: SingleChildScrollView(
        child: Stack(
          children: [
            Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: height * 0.15,
                  ),
                  Container(
                      padding: EdgeInsets.only(left: width * 0.05),
                      child: const Text('Welcome !',
                          textAlign: TextAlign.left,
                          style: TextStyle(
                              color: Color.fromRGBO(26, 42, 82, 1),
                              fontFamily: 'Montserrat',
                              fontSize: 32,
                              fontWeight: FontWeight.bold))),
                  Container(
                      padding: EdgeInsets.only(
                          left: width * 0.05,
                          top: height * 0.01,
                          bottom: height * 0.03),
                      child: const Text(
                        'Login to Continue',
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            color: Color.fromRGBO(26, 42, 82, 1),
                            fontFamily: 'Montserrat',
                            fontSize: 24,
                            fontWeight: FontWeight.normal),
                      )),
                  Container(
                    padding: EdgeInsets.fromLTRB(
                        width * 0.05, 0, width * 0.05, height * 0.01),
                    child: IntlPhoneField(
                      dropdownIconPosition: IconPosition.trailing,
                      dropdownIcon: const Icon(Icons.keyboard_arrow_down),
                      flagsButtonMargin: EdgeInsets.only(left: width * 0.04),
                      decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        labelText: 'Enter Phone Number',
                        enabledBorder: OutlineInputBorder(
                          borderSide:
                              BorderSide(color: Colors.white, width: 0.0),
                        ),
                        border: OutlineInputBorder(
                          borderSide: BorderSide(),
                        ),
                      ),
                      initialCountryCode: 'IN',
                      onChanged: (phone) {
                        phoneNumber = phone.completeNumber;
                      },
                      onSubmitted: (phone) {
                        phoneNUmberFilled = true;
                        print('final number: ${phoneNumber}');
                      },
                    ),
                  ),
                  Container(
                    alignment: Alignment.center,
                    child: ElevatedButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.verifyPhoneNumber(
                          phoneNumber: '${phoneNumber}',
                          timeout: const Duration(seconds: 120),
                          verificationCompleted:
                              (PhoneAuthCredential credential) {},
                          verificationFailed: (FirebaseAuthException e) {},
                          codeSent: (String verificationId, int? resendToken) {
                            phoneNumberEnter.verify = verificationId;
                            print("phonel: ${phoneNumberEnter.verify}");
                            Navigator.pushNamed(context, "otpEnter");
                          },
                          codeAutoRetrievalTimeout: (String verificationId) {},
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        elevation: 8,
                        backgroundColor: const Color.fromRGBO(26, 42, 82, 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                        padding: EdgeInsets.fromLTRB(width * 0.365,
                            width * 0.038, width * 0.365, width * 0.038),
                      ),
                      child: const Text('Get OTP',
                          style: TextStyle(
                              fontWeight: FontWeight.normal,
                              fontSize: 18,
                              color: Colors.white),
                          textAlign: TextAlign.center),
                    ),
                  ),
                  SizedBox(
                    height: height * 0.1,
                  ),
                  Container(
                      padding: EdgeInsets.only(
                          left: width * 0.325, right: width * 0.325),
                      child: const Text('- Or Log in with -',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              color: Color.fromRGBO(88, 86, 86, 1),
                              fontFamily: 'Montserrat',
                              fontSize: 18,
                              fontWeight: FontWeight.normal))),
                  Container(
                    padding: EdgeInsets.only(
                        left: width * 0.25, right: width * 0.25),
                    alignment: Alignment.center,
                    child: SignInButton(Buttons.Google, onPressed: () {
                      signInWithGoogle().whenComplete(() {
                        Navigator.pushNamedAndRemoveUntil(
                            context, "homePage", (route) => false);
                      });
                    }),
                  )
                ])
          ],
        ),
      ),
    );
  }
}
