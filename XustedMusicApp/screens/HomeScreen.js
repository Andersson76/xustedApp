import React, { useContext, useState, useRef } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import ActionSheet from 'react-native-actionsheet';
import { AlbumContext } from '../AlbumContext';

export default function HomeScreen({ navigation }) {
  const { albums } = useContext(AlbumContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const actionSheetRef = useRef();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const showActionSheet = () => {
    actionSheetRef.current.show();
  };

  const handleActionSheetPress = (index) => {
    // Hantera ActionSheet-alternativ här
    console.log('Valt alternativ:', index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
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

      {/* Knapp för att visa ActionSheet */}
      <Button title="Visa alternativ" onPress={showActionSheet} />

      {/* Implementera ActionSheet */}
      <ActionSheet
        ref={actionSheetRef}
        title={'Vilket alternativ vill du välja?'}
        options={['Alternativ 1', 'Alternativ 2', 'Avbryt']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => handleActionSheetPress(index)}
      />
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
