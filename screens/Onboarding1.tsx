import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function Onboarding1() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Onboarding page 1</Text>
      </View>
      <TouchableOpacity style={styles.next} onPress={() => navigation.navigate('Onboarding2')}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  skip: { position: 'absolute', top: 12, left: 16, zIndex: 1 },
  skipText: { color: '#888', fontSize: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', color: '#111' },
  next: { position: 'absolute', bottom: 24, right: 24, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#111', borderRadius: 8 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});




