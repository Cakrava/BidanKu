import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../../assets/Config';

const TambahDataBidan = () => {
  const [idBidan, setIdBidan] = useState('');
  const [SIBP, setSIBP] = useState('');
  const [namaBidan, setNamaBidan] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('L');
  const [tmpLahir, setTmpLahir] = useState('');
  const [tglLahir, setTglLahir] = useState(new Date());
  const [alamatPraktik, setAlamatPraktik] = useState('');
  const [nohpBidan, setNohpBidan] = useState('');
  const [status, setStatus] = useState('');
  const [catatan, setCatatan] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const navigation = useNavigation();
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const submitForm = async () => {
    setIsSaving(true);
    setValidationErrors({});
    const formData = {
      idBidan,
      SIBP,
      namaBidan,
      jenisKelamin,
      tglLahir: tglLahir.toISOString().split('T')[0],
      tmpLahir,
      alamatPraktik,
      nohpBidan,
      status,
      catatan,
    };

    try {
      let token = await AsyncStorage.getItem('userToken');
      // Replace `apiBudan` with the correct API endpoint for your application
      const response = await fetch(`${apiUrl}bidan`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSaving(false);

        if (response.status === 422) {
          let errors = {};
          Object.keys(data.errors).forEach(key => {
            errors[key] = data.errors[key][0];
          });
          setValidationErrors(errors);
        } else {
          throw new Error(
            data.message || 'Terjadi kesalahan saat menyimpan data.',
          );
        }
      } else {
        setIsSaving(false);
        Alert.alert('Success', 'Data Bidan berhasil ditambahkan', [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('DataBidan', {dataAdded: true}),
          },
        ]);
      }
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Error', error.toString());
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tglLahir;
    setDatePickerVisible(Platform.OS === 'ios');
    setTglLahir(currentDate);
  };

  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // ... (import statements and beginning of TambahDataBidan component)

  return (
    <ScrollView style={styles.container}>
      <Input
        placeholder="ID Bidan"
        value={idBidan}
        onChangeText={setIdBidan}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="id-card-outline" size={24} color="grey" />}
        errorMessage={validationErrors.idBidan}
      />

      <Input
        placeholder="SIBP"
        value={SIBP}
        onChangeText={setSIBP}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="card-outline" size={24} color="grey" />}
        errorMessage={validationErrors.SIBP}
      />

      <Input
        placeholder="Nama Bidan"
        value={namaBidan}
        onChangeText={setNamaBidan}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="person-outline" size={24} color="grey" />}
        errorMessage={validationErrors.namaBidan}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={jenisKelamin}
          onValueChange={itemValue => setJenisKelamin(itemValue)}
          style={styles.picker}
          mode="dropdown">
          <Picker.Item label="Laki-laki" value="L" />
          <Picker.Item label="Perempuan" value="P" />
        </Picker>
      </View>

      <Input
        placeholder="Tempat Lahir"
        value={tmpLahir}
        onChangeText={setTmpLahir}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="location-outline" size={24} color="grey" />}
        errorMessage={validationErrors.tmpLahir}
      />

      <TouchableOpacity
        onPress={() => setDatePickerVisible(true)}
        style={styles.datePickerButton}>
        <Icon name="calendar-outline" size={24} color="grey" />
        <Text style={styles.dateText}>
          {tglLahir ? tglLahir.toISOString().split('T')[0] : 'Tanggal Lahir'}
        </Text>
      </TouchableOpacity>
      {datePickerVisible && (
        <DateTimePicker
          value={tglLahir}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setTglLahir(selectedDate || tglLahir);
            setDatePickerVisible(Platform.OS === 'ios');
          }}
        />
      )}

      <Input
        placeholder="Alamat Praktik"
        value={alamatPraktik}
        onChangeText={setAlamatPraktik}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="business-outline" size={24} color="grey" />}
        errorMessage={validationErrors.alamatPraktik}
      />

      <Input
        placeholder="No HP"
        value={nohpBidan}
        onChangeText={setNohpBidan}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="call-outline" size={24} color="grey" />}
        keyboardType="phone-pad"
        errorMessage={validationErrors.nohpBidan}
      />

      <Input
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={
          <Icon name="information-circle-outline" size={24} color="grey" />
        }
        errorMessage={validationErrors.status}
      />

      <Input
        placeholder="Catatan"
        value={catatan}
        onChangeText={setCatatan}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="clipboard-outline" size={24} color="grey" />}
        errorMessage={validationErrors.catatan}
        multiline
        numberOfLines={4}
      />

      <Button
        title="Simpan Data"
        onPress={submitForm}
        loading={isSaving}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 30,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'tomato',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  inputText: {
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: 'tomato',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  submitTitle: {
    color: '#fff', //warna text tombol
  },
  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateButton: {
    backgroundColor: 'tomato',
    borderRadius: 10,
  },
  dateDisplay: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
});

export default TambahDataBidan;
