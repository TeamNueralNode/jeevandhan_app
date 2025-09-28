import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding3() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity
        style={styles.skip}
        onPress={() => {
          navigation.replace('Login');
        }}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎯</Text>
        </View>
        <Text style={styles.title}>Achieve Financial Goals</Text>
        <Text style={styles.subtitle}>Improve Your TCS Score</Text>
        <Text style={styles.description}>
          Get personalized insights and recommendations to improve your Trust & Credit Score and achieve better financial health.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.next}
        onPress={() => {
          navigation.replace('Login');
        }}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 7 },
  skip: { position: 'absolute', bottom: 24, left: 24, zIndex: 1 },
  skipText: { color: '#888', fontSize: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconContainer: { marginBottom: 24 },
  icon: { fontSize: 64 },
  title: { fontSize: 28, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '500', color: '#4f46e5', textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
  next: { position: 'absolute', bottom: 24, right: 24, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#4f46e5', borderRadius: 12 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});




