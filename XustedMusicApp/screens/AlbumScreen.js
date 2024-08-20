import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { AlbumContext } from "../AlbumContext";

export default function AlbumScreen({ route, navigation }) {
  const { albumId } = route.params;
  const { albums } = useContext(AlbumContext);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

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
    "ice_picker.mp3": require("../assets/sounds/ice_picker.mp3"),
    "cold_horizon.mp3": require("../assets/sounds/cold_horizon.mp3"),
    "fishermans_friend.mp3": require("../assets/sounds/fishermans_friend.mp3"),
    "tunnel_1.mp3": require("../assets/sounds/tunnel_1.mp3"),
    "tunnel_2.mp3": require("../assets/sounds/tunnel_2.mp3"),
    "tyo.mp3": require("../assets/sounds/tyo.mp3"),
    "oyt.mp3": require("../assets/sounds/oyt.mp3"),
    "busted.mp3": require("../assets/sounds/busted.mp3"),
    "maze.mp3": require("../assets/sounds/maze.mp3"),
    "sensor.mp3": require("../assets/sounds/sensor.mp3"),
  };

  const playSong = async (song) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const soundFile = soundFiles[song.file];
    if (!soundFile) {
      console.error(`Sound file ${song.file} not found!`);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPlaybackPosition(status.positionMillis || 0);
        setPlaybackDuration(status.durationMillis || 0);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      }
    });
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleStop = async () => {
    if (!sound) return;

    await sound.stopAsync();
    setIsPlaying(false);
    setPlaybackPosition(0);
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
        <View style={styles.albumContainer}>
          <Image source={{ uri: album.cover }} style={styles.albumCover} />
          <Text style={styles.albumTitle}>{album.title}</Text>
        </View>

        {sound && (
          <View style={styles.controls}>
            <Button
              title={isPlaying ? "Pause" : "Play"}
              onPress={handlePlayPause}
            />
            <Button title="Stop" onPress={handleStop} />
            <View style={styles.progressContainer}>
              <Slider
                style={styles.slider}
                value={playbackPosition}
                minimumValue={0}
                maximumValue={playbackDuration}
                onValueChange={async (value) => {
                  if (sound) {
                    await sound.setPositionAsync(value);
                    setPlaybackPosition(value);
                  }
                }}
                thumbTintColor="#000000"
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#cccccc"
              />
              <Text style={styles.timeText}>
                {Math.floor(playbackPosition / 1000)} /{" "}
                {Math.floor(playbackDuration / 1000)}
              </Text>
            </View>
          </View>
        )}

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
  albumContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  albumCover: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
  controls: {
    marginVertical: 20,
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeText: {
    marginTop: 10,
    fontSize: 16,
  },
});
