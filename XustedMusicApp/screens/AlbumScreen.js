import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { Audio } from "expo-av"; // Importera Audio från expo-av
import { AlbumContext } from "../AlbumContext";

export default function AlbumScreen({ route, navigation }) {
  const { albumId } = route.params;
  const { albums } = useContext(AlbumContext);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const initialIndex = albums.findIndex((album) => album.id === albumId);
    if (initialIndex !== -1) {
      setCurrentAlbumIndex(initialIndex);
    } else {
      console.error("Album not found");
    }

    return () => {
      if (sound) {
        sound.unloadAsync(); // Avlasta ljudfilen när komponenten demonteras
      }
    };
  }, [albumId, albums, sound]);

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

  const soundFiles = {
    "busted.wav": require("../assets/sounds/busted.wav"),
    "cold_horizon.wav": require("../assets/sounds/cold_horizon.wav"),
    "fishermans_friend.wav": require("../assets/sounds/fishermans_friend.wav"),
    "ice_picker.wav": require("../assets/sounds/ice_picker.wav"),
  };

  const playSong = async (song) => {
    if (sound) {
      await sound.unloadAsync(); // Avlasta eventuell tidigare laddad ljudfil
    }

    const soundFile = soundFiles[song.file];
    if (!soundFile) {
      console.error(`Sound file ${song.file} not found!`);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  if (albums.length === 0) return null;

  const album = albums[currentAlbumIndex];

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
