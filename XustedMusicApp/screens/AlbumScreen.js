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
import GestureRecognizer from "react-native-swipe-gestures";
//import Sound from "react-native-sound";

export default function AlbumScreen({ route, navigation }) {
  const { albumId } = route.params;
  const [albums, setAlbums] = useState([]);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);

  useEffect(() => {
    if (!albumId) {
      console.error("albumId is undefined");
      return;
    }
    console.log("Received albumId:", albumId); // Lägg till denna rad för att se albumId
    axios
      .get(
        "https://raw.githubusercontent.com/Andersson76/xustedApp/main/XustedMusicApp/assets/data/albums.json"
      )
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setAlbums(response.data);
          response.data.forEach((album) => console.log("Album ID:", album.id)); // Lägg till denna rad för att se alla album-ID:n
          const initialIndex = response.data.findIndex(
            (album) => album.id === albumId
          );
          console.log("Initial Index:", initialIndex); // Lägg till denna rad för att se indexet
          if (initialIndex !== -1) {
            setCurrentAlbumIndex(initialIndex);
          } else {
            console.error("Album not found");
          }
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Axios error:", error);
      });
  }, [albumId]);

  const handleSwipeLeft = () => {
    if (currentAlbumIndex < albums.length - 1) {
      setCurrentAlbumIndex(currentAlbumIndex + 1);
      navigation.navigate("Album", {
        albumId: albums[currentAlbumIndex + 1].id,
      });
    }
  };

  const handleSwipeRight = () => {
    if (currentAlbumIndex > 0) {
      setCurrentAlbumIndex(currentAlbumIndex - 1);
      navigation.navigate("Album", {
        albumId: albums[currentAlbumIndex - 1].id,
      });
    }
  };

  if (albums.length === 0) return null;

  const album = albums[currentAlbumIndex];

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
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.albumTitle}>{album.title}</Text>
        <FlatList
          data={album.songs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => playSong(item)}>
              <Image source={{ uri: item.cover }} style={styles.coverImage} />
              <Text style={styles.songTitle}>
                {item.title} - {item.duration}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </GestureRecognizer>
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
  coverImage: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
});
