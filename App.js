import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebase = require("firebase");
require("firebase/firestore");

export default class App extends React.Component() {
  constructor() {
    super();
    this.state = {
      lists: [],
    };
    // const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);

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

      firebase.firestore().collection("shoppinglists/list2");
    }
  }

  componentDidMount() {
    this.referenceShoppingLists = firebase
      .firestore()
      .collection("shoppinglists");
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(
      this.onCollectionUpdate
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
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
      name: "TestList",
      items: ["eggs", "pasta", "veggies"],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) => (
            <Text>
              {item.name}: {item.items}
            </Text>
          )}
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
