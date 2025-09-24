import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.appName}>JeevanDhan</Text>
      </View>
      <View style={styles.body} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  logo: { width: 28, height: 28, borderRadius: 6, marginRight: 8 },
  appName: { fontSize: 20, fontWeight: '700', color: '#111' },
  body: { flex: 1 },
});




