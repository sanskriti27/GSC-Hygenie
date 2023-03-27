import 'package:flutter/material.dart';

class NavigationDrawerWidget extends StatefulWidget {
  NavigationDrawerWidget({Key? key}) : super(key: key);

  @override
  _NavigationDrawerWidgetState createState() => _NavigationDrawerWidgetState();
}

class _NavigationDrawerWidgetState extends State<NavigationDrawerWidget> {
  // ignore: unused_element
  _NavigationDrawerWidgetState({Key? key});

  Widget buildMenuItem({
    required String text,
    required IconData icon,
    VoidCallback? onClicked,
  }) {
    final color = Colors.white;
    final hoverColor = Colors.white70;
    return ListTile(
      leading: Icon(
        icon,
        color: color,
        size: 25,
      ),
      title: Text(
        text,
        style: TextStyle(color: color, fontSize: 15),
      ),
      hoverColor: hoverColor,
      onTap: onClicked,
    );
  }

  void selectedItem(BuildContext context, int index) {
    switch (index) {
      case 0:
        Navigator.pushNamedAndRemoveUntil(
            context, "homePage", (route) => false);
        break;
      case 1:
        // will change it after the page is created
        Navigator.pushNamedAndRemoveUntil(
            context, "homePage", (route) => false);
        break;
      case 2:
        // will change it after the page is created
        Navigator.pushNamedAndRemoveUntil(
            context, "homePage", (route) => false);
        break;
      default:
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Material(
        color: Colors.black,
        child: ListView(
          padding: EdgeInsets.symmetric(horizontal: 20),
          children: <Widget>[
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.2,
            ),
            buildMenuItem(
              text: 'Home',
              icon: Icons.home,
              onClicked: () => selectedItem(context, 0),
            ),
            buildMenuItem(
              text: 'Search Washroom',
              icon: Icons.wc,
              onClicked: () => selectedItem(context, 1),
            ),
            buildMenuItem(
              text: 'Profile',
              icon: Icons.person_outline_rounded,
              onClicked: () => selectedItem(context, 2),
            ),
          ],
        ),
      ),
    );
  }
}
