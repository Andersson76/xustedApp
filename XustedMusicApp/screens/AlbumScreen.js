// screens/AlbumScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
//import Sound from "react-native-sound";

export default function AlbumScreen({ route }) {
  const { album } = route.params;

/*   const playSong = (song) => {
    const sound = new Sound(song.file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load the sound", error);
        return;
      }
      sound.play();
    });
  }; */

  return (
    <View style={styles.container}>
      <Text style={styles.albumTitle}>{album.title}</Text>
      <FlatList
        data={album.songs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          //<TouchableOpacity onPress={() => playSong(item)}>
            <Text style={styles.songTitle}>
              {item.title} - {item.duration}
            </Text>
          //</TouchableOpacity>
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
  albumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    padding: 10,
    backgroundColor: "#eee",
    marginBottom: 5,
  },
});
