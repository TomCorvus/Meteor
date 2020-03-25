import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchForm from '../components/SearchForm';

export default function Home() {
  return (
    <View style={styles.container}>
      <SearchForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
