import React, { useEffect, useState } from "react";
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
    fetch(
      "https://raw.githubusercontent.com/Andersson76/xustedApp/main/XustedMusicApp/assets/data/albums.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Kontrollera här att du får vad du förväntar dig
        setAlbums(data.albums);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Album", { album: item })}
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
    padding: 10,
  },
  albumContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  coverImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: "cover",
  },
  albumTitle: {
    fontSize: 18,
  },
});
