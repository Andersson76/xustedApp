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
import { AlbumContext } from "../AlbumContext";

export default function AlbumScreen({ route, navigation }) {
  const { albumId } = route.params;
  const { albums } = useContext(AlbumContext);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);

  useEffect(() => {
    const initialIndex = albums.findIndex((album) => album.id === albumId);
    if (initialIndex !== -1) {
      setCurrentAlbumIndex(initialIndex);
    } else {
      console.error("Album not found");
    }
  }, [albumId, albums]);

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
