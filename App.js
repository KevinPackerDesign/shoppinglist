import React from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import firebase from "firebase";
import firestore from "firebase";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: "Please wait, you are getting logged in",
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDUqWmEYEkLRArxAeM4FFV7NxTovESMapY",
      authDomain: "test-a4d4b.firebaseapp.com",
      projectId: "test-a4d4b",
      storageBucket: "test-a4d4b.appspot.com",
      messagingSenderId: "808146556772",
      appId: "1:808146556772:web:69b229ae6f4ed4b7df4c71",
      measurementId: "G-27KV2ZCRZL",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceShoppinglistUser = null;
  }

  componentDidMount() {
    this.referenceShoppingLists = firebase
      .firestore()
      .collection("shoppinglists");

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: "Hello User",
      });

      this.referenceShoppinglistUser = firebase
        .firestore()
        .collection("shoppinglists")
        .where("uid", "==", this.state.uid);
      this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(
        this.onCollectionUpdate
      );
    });
  }
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeListUser();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  addList() {
    this.referenceShoppingLists.add({
      name: "Test 2",
      items: ["pizza", "burgers", "beer"],
      uid: this.state.uid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        <Text style={styles.text}>All Shopping lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.name}: {item.items}
            </Text>
          )}
        />
        <Button
          onPress={() => {
            this.addList();
          }}
          title="Add something"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});

export default App;
