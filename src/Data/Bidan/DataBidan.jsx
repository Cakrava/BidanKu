import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatarLaki from '../../assets/Img/laki.jpg';
import avatarPerempuan from '../../assets/Img/perempuan.jpg';
import AddData from '../../Component/AddData';
import col from '../../assets/ColorHunt';
import Icon from 'react-native-vector-icons/Ionicons';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {Swipeable} from 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from 'react-native-elements';
import {apiImage, apiUrl} from '../../assets/Config';

const Drawer = createDrawerNavigator();
export default function DataBidan() {
  const navigation = useNavigation();
  const route = useRoute();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastpage, setlastPage] = useState(0);
  const [dataDeleted, setDataDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [titleCari, setTitleCari] = useState('');
  let prevOpenedRow;
  const [row, setRow] = useState({});
  const [totalPerempuan, setTotalPerempuan] = useState(0);
  const [totalLakiLaki, setTotalLakiLaki] = useState(0);

  const [originalData, setOriginalData] = useState([]);
  const [dataBidan, setDataBidan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPage, setLastPage] = useState(0);

  const [iconRotation] = useState(new Animated.Value(0));
  const [icon] = useState(new Animated.Value(50));
  const [inputValue, setInputValue] = useState('');
  const [tombolTambah] = useState(new Animated.Value(120));
  const [tombolCari] = useState(new Animated.Value(120));
  const [inputCari] = useState(new Animated.Value(100));
  const [pop, setPop] = useState(false);
  const navigationRef = useNavigationContainerRef();

  const openDrawer = () => {
    if (navigationRef.current && navigationRef.current.openDrawer) {
      navigationRef.current.openDrawer();
    } else {
      console.warn('Drawer cannot be opened');
    }
  };
  const fetchDataBidan = async (pageNumber = 1, searchQuery = search) => {
    setLoading(true);
    setError('');

    try {
      let token = await AsyncStorage.getItem('userToken');
      const response = await fetch(
        `${apiUrl}bidan/?page=${pageNumber}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setOriginalData(json.data);
      setPage(pageNumber);
      setlastPage(json.meta.last_page);

      setDataBidan(pageNumber === 1 ? json.data : [...dataBidan, ...json.data]);
    } catch (error) {
      setError(`Gagal Mengambil Data: ${error}`);
    } finally {
      setLoading(false);
      if (pageNumber === 1) setRefreshing(false);
    }
  };
  let token;
  useEffect(() => {
    const initializeData = async () => {
      let token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        await fetchDataBidan();
      }
    };

    initializeData();
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.dataAdded && !dataDeleted) {
        initializeData();
        setDataDeleted(false);
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.dataAdded]);

  const checkToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.navigate('Login'); //Ganti login dengan nama route halaman login anda
    } else {
      fetchDataBidan(); //lanjutkan dengan memuat data jika token ada
    }
  };
  const handleSearch = () => {
    setIsSearching(false);
    fetchDataBidan(1, '');
  };

  const clearSearch = () => {
    setIsSearching(false);
    fetchDataBidan(1, '');
    setSearch('');
  };

  const onRefresh = () => {
    setRefreshing(true);

    fetchDataBidan(1, search).finally(() => setRefreshing(false));
  };

  const TambahData = item => {
    navigation.navigate('TambahDataBidan');
    // togelTambah();
  };

  const renderItemBidan = ({item, index}) => {
    const closeRow = index => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = () => {
      const handleDelete = idBidan => {
        Alert.alert(
          'Konfirmasi',
          'Anda akan menghapus data ini?',
          [
            {
              text: 'Tidak',
              style: 'cancel',
            },
            {
              text: 'Ya',
              onPress: async () => {
                try {
                  let token = await AsyncStorage.getItem('userToken');
                  // Lakukan penghapusan data bidan dengan permintaan DELETE ke API
                  const response = await fetch(`${apiBidan}/${idBidan}`, {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  if (response.status === 200) {
                    // Data bidan berhasil dihapus
                    Alert.alert('', 'Data bidan berhasil dihapus!', [
                      {
                        onPress: async () => {
                          // Reset data setelah penghapusan berhasil
                          await fetchDataBidan();

                          // Jangan lupa set state dataDeleted menjadi true
                          setDataDeleted(true);
                        },
                        text: 'Ok',
                      },
                    ]);
                  } else {
                    // Gagal menghapus data
                    console.log('Gagal menghapus data');
                    // Handle kesalahan jika penghapusan gagal
                  }
                } catch (error) {
                  console.error('Terjadi kesalahan:', error);
                }
              },
            },
          ],
          {cancelable: true},
        );
      };

      return (
        <View
          style={{
            marginBottom: 10,

            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            backgroundColor: '#dedede',
            width: 200,
            height: 113,
            marginLeft: -130,
          }}>
          <TouchableOpacity
            onPress={() => handleDelete(item.idBidan)}
            style={{
              backgroundColor: '#39A7FF',
              alignItems: 'flex-end',
              justifyContent: 'center',
              width: 'auto',
              height: 56,
              borderTopRightRadius: 10,
            }}>
            <Icon
              name="trash-outline"
              size={20}
              style={{color: 'white', marginRight: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => editbidan(item)}
            style={{
              backgroundColor: '#39A7FF',
              alignItems: 'flex-end',
              justifyContent: 'center',
              width: 'auto',
              height: 56,
              borderBottomRightRadius: 10,
            }}>
            <Icon
              name="create-outline"
              size={20}
              style={{color: 'white', marginRight: 25}}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const bukadetail = item => {
      navigation.navigate('Detail', {
        idBidan: item.idBidan,
        fotoBidan: item.fotoBidan,
      });
    };
    const editbidan = item => {
      navigation.navigate('EditBidan', {
        idBidan: item.idBidan,
      });
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        onSwipeableOpen={() => closeRow(index)}
        ref={ref => (row[index] = ref)}
        rightOpenValue={-20}>
        <View style={styles.item}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '100%'}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                    width: 'auto',
                  }}>
                  <View
                    style={[
                      styles.foto,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <Avatar
                      size={25}
                      rounded
                      source={
                        item.fotoBidan
                          ? {uri: `${apiImage}${item.foto_thumb}`}
                          : item.jenisKelamin === 'L'
                          ? avatarLaki
                          : item.jenisKelamin === 'P'
                          ? avatarPerempuan
                          : avatarLaki
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.title}>{item.namaBidan}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Icon name="finger-print-outline" style={{}}></Icon>
                      <Text style={styles.idCode}> {item.idBidan}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={{marginRight: 20}}
                  onPress={() => bukadetail(item)}>
                  <Icon name="eye-outline" size={20}></Icon>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: -5,
                }}>
                <Icon
                  name="location-outline"
                  size={15}
                  style={{marginLeft: -15}}
                />
                <Text style={{fontSize: 12, marginLeft: 15}}>
                  {item.alamatPraktik.length <= 20
                    ? item.alamatPraktik
                    : `${item.alamatPraktik.slice(0, 20)}...`}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 'auto',
                  }}>
                  <Icon
                    name="call-outline"
                    size={13}
                    style={{marginLeft: -12}}
                  />
                  <Text style={{fontSize: 12, marginLeft: 15}}>
                    {item.nohpBidan}
                  </Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: '#39A7FF',
                    borderBottomLeftRadius: 50,
                    borderTopLeftRadius: 50,
                    width: 91,
                  }}>
                  <Text style={{color: 'white', marginLeft: 10}}>
                    {item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  const tampildata = () => {};
  return (
    <View>
      <GestureHandlerRootView>
        <View
          style={{
            // paddingTop: 20,
            backgroundColor: col.putih,
            width: 'auto',
            height: 60,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',

            // paddingBottom: 20,
          }}>
          <View
            style={{
              width: '50%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={openDrawer}>
              <Icon name="menu-outline" size={30} style={{marginLeft: 20}} />
            </TouchableOpacity>
            <View style={{marginLeft: 10, marginRight: 10}}>
              {loading && page === 1 && (
                <ActivityIndicator size={20} color={col.merah} />
              )}
            </View>
            <Text style={{color: 'black', fontSize: 17, fontWeight: 'bold'}}>
              Bidan
            </Text>
          </View>
          <View
            style={{
              width: '50%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: col.abu,
                width: '60%',
                borderRadius: 100,
              }}>
              <TextInput style={{fontSize: 14}}></TextInput>
            </View>
            <TouchableOpacity>
              <Icon name="search-outline" size={30} style={{marginRight: 20}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginLeft: 10, marginRight: 10}}>
          {search ? (
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 5,
                  borderRadius: 50,
                  marginRight: 5, // Add margin to separate from the next view
                }}>
                <Text style={{fontSize: 18, color: '#39A7FF'}}>
                  Pencarian: {search}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 5,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={clearSearch}>
                  <Icon
                    name="close-outline"
                    size={18}
                    style={{color: 'red', marginLeft: 2.5, marginRight: 2.5}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Adjust the position of the loading indicator */}

          {error && <Text style={styles.title}>{error}</Text>}
          <FlatList
            style={{marginTop: 10, marginBottom: 10, height: 600}}
            initialNumToRender={1}
            data={dataBidan}
            renderItem={renderItemBidan}
            keyExtractor={item => item.idBidan}
            extraData={loading || error}
            onEndReached={() => {
              if (!loading && page < lastpage) {
                fetchDataBidan(page + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              !loading || page === 1 ? null : (
                <ActivityIndicator size="large" color="#860A35" />
              )
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{flexGrow: 1}}
          />
        </View>
      </GestureHandlerRootView>

      <AddData onPress={TambahData} />
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    marginRight: 10,
    width: 100,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: '#39A7FF',
    padding: 20,
    borderBottomRightRadius: 50,
  },
  textInfo: {
    color: '#39A7FF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  judul: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  foto: {
    borderRadius: 50,
    marginLeft: -20,
    marginRight: 10,
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#39A7FF',
  },
  iconDetail: {
    borderRadius: 50,
    marginLeft: -20,
    marginRight: 10,
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#39A7FF',
  },
  note: {
    color: 'white',
    fontSize: 15,
    marginBottom: 10,
  },
  AddButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39A7FF',
    marginLeft: 310,
    marginRight: 20,
    borderRadius: 100,
    marginTop: -32,
    borderColor: 'white',
    borderWidth: 2,
  },
  item: {
    marginBottom: 10,
    borderColor: '#dedede',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 30,

    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 18,
  },
  idCode: {
    color: 'gray',
    fontSize: 12,
  },

  rightActions: {
    marginBottom: 10,
    borderColor: '#dedede',
    borderWidth: 1,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#dedede',
    paddingLeft: -100,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButton: {
    marginRight: 10,
    marginLeft: -200,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 200,
    paddingHorizontal: 20,
    height: '100%',
  },
  circle: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#39A7FF',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 125,
    right: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#39A7FF',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 125,
    right: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButton: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#39A7FF',
    width: 40,
    height: 40,
    position: 'absolute',
    top: 20,
    right: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInput: {
    borderWidth: 0.5,
    borderColor: '#39A7FF',
    backgroundColor: '#39A7FF',
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: '100%',
    width: '100%',
    height: 60,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
