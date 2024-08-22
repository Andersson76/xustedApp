import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  Platform,
} from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AlbumContext } from '../AlbumContext';

export default function HomeScreen({ navigation }) {
  const { albums } = useContext(AlbumContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const triggerHaptic = () => {
    HapticFeedback.trigger('impactLight');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              triggerHaptic();
              navigation.navigate('Album', { albumId: item.id });
            }}
          >
            <View style={styles.albumContainer}>
              <Image source={{ uri: item.cover }} style={styles.coverImage} />
              <Text style={styles.albumTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Trigger Haptic Feedback" onPress={triggerHaptic} />
      </View>
      {/* Visa DateTimePicker iOS*/}
      <Button title="Välj datum" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
          locale="sv-SE"
        />
      )}
      <Text>Valt datum: {selectedDate.toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  albumContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  coverImage: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  albumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
