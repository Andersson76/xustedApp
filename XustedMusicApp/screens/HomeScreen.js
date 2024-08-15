import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AlbumContext } from "../AlbumContext";

export default function HomeScreen({ navigation }) {
  const { albums } = useContext(AlbumContext);

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
