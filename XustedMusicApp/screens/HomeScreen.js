import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function HomeScreen({ navigation }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/Andersson76/xustedApp/main/XustedMusicApp/assets/data/albums.json"
      )
      .then((response) => {
        setAlbums(response.data);
      })
      .catch((error) => {
        console.error("Axios error:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Album", { albumId: item.id })}
          >
            <View style={styles.albumContainer}>
              <Image source={{ uri: item.cover }} style={styles.coverImage} />
              <Text style={styles.albumTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  albumContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  coverImage: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  albumTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
