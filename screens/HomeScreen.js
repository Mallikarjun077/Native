import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProtectedData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      navigation.replace('Login');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.4:8000/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setUsername(data.sub || 'User');
      } else {
        Alert.alert('Error', data.detail || 'Unauthorized');
        navigation.replace('Login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not reach server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const dashboardItems = [
    { id: '1', title: 'Profile', action: () => Alert.alert('Profile screen coming soon!') },
    { id: '2', title: 'Messages', action: () => Alert.alert('Messages feature coming soon!') },
    { id: '3', title: 'Settings', action: () => Alert.alert('Settings screen coming soon!') },
    { id: '4', title: 'Refresh', action: fetchProtectedData },
    { id: '5', title: 'Exit', action: logout },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={item.action} style={styles.card}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.info}>App Version: 1.0.0</Text>
        </>
      )}

      <FlatList
        data={dashboardItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.dashboard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    paddingTop: 50,
    
  },
  header: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 20,
    color: '#0f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  dashboard: {
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#fff',
  },
});
