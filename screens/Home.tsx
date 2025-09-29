import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TCSCalculator, ExpenseData } from '../utils/scoreCalculator';

export default function Home() {
  const navigation = useNavigation<any>();
  const calculator = new TCSCalculator();
  
  const [expenses, setExpenses] = useState<ExpenseData[]>([
    { id: 1, type: 'Mobile Recharge', amount: 399, date: '2024-01-15', status: 'paid' },
    { id: 2, type: 'Electricity Bill', amount: 1250, date: '2024-01-10', status: 'paid' },
    { id: 3, type: 'House Rent', amount: 15000, date: '2024-01-01', status: 'paid' },
    { id: 4, type: 'Internet Bill', amount: 899, date: '2024-01-08', status: 'paid' },
    { id: 5, type: 'Mobile Recharge', amount: 399, date: '2024-01-05', status: 'paid' },
    { id: 6, type: 'Water Bill', amount: 450, date: '2024-01-12', status: 'paid' },
  ]);

  const [tcsData, setTcsData] = useState(() => calculator.calculateTCSScore(expenses));
  
  useEffect(() => {
    setTcsData(calculator.calculateTCSScore(expenses));
  }, [expenses]);

  const recommendations = calculator.getScoreRecommendations(tcsData.score, tcsData.factors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.appName}>JeevanDhan</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* TCS Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Your TCS Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: calculator.getScoreColor(tcsData.score) }]}>
              {tcsData.score}
            </Text>
            <View style={styles.scoreDetails}>
              <Text style={[styles.scoreStatus, { color: calculator.getScoreColor(tcsData.score) }]}>
                {calculator.getScoreStatus(tcsData.score)}
              </Text>
              <Text style={styles.scoreRange}>Range: 300-850</Text>
            </View>
          </View>
          <View style={styles.scoreBar}>
            <View 
              style={[
                styles.scoreProgress, 
                { 
                  width: `${((tcsData.score - 300) / 550) * 100}%`,
                  backgroundColor: calculator.getScoreColor(tcsData.score)
                }
              ]} 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('DocumentUpload' as never)}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionTitle}>Mobile Recharge</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('DocumentUpload' as never)}
            >
              <Text style={styles.actionIcon}>💡</Text>
              <Text style={styles.actionTitle}>Electricity Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('DocumentUpload' as never)}
            >
              <Text style={styles.actionIcon}>🏠</Text>
              <Text style={styles.actionTitle}>House Rent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('DocumentUpload' as never)}
            >
              <Text style={styles.actionIcon}>🌐</Text>
              <Text style={styles.actionTitle}>Internet Bill</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseLeft}>
                <Text style={styles.expenseType}>{expense.type}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                  <Text style={styles.statusText}>PAID</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Score Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Insights</Text>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.insightCard}>
              <Text style={styles.insightTitle}>💡 Recommendation {index + 1}</Text>
              <Text style={styles.insightText}>{recommendation}</Text>
            </View>
          ))}
          
          {/* Score Factors */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📊 Score Breakdown</Text>
            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Payment History</Text>
              <Text style={styles.factorValue}>{Math.round(tcsData.factors.paymentHistory * 100)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Expense Consistency</Text>
              <Text style={styles.factorValue}>{Math.round(tcsData.factors.expenseConsistency * 100)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Amount Stability</Text>
              <Text style={styles.factorValue}>{Math.round(tcsData.factors.amountStability * 100)}%</Text>
            </View>
            <View style={styles.factorItem}>
              <Text style={styles.factorLabel}>Expense Diversity</Text>
              <Text style={styles.factorValue}>{Math.round(tcsData.factors.diversityBonus * 100)}%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 7 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    backgroundColor: '#fff',
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 14, color: '#666', marginBottom: 2 },
  appName: { fontSize: 20, fontWeight: '700', color: '#111' },
  profileButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#f3f4f6', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profileIcon: { fontSize: 18 },
  body: { flex: 1, padding: 16 },
  
  // Score Card Styles
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreTitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  scoreValue: { fontSize: 48, fontWeight: '700', marginRight: 16 },
  scoreDetails: { flex: 1 },
  scoreStatus: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  scoreRange: { fontSize: 14, color: '#666' },
  scoreBar: { 
    height: 8, 
    backgroundColor: '#e5e7eb', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  scoreProgress: { height: '100%', borderRadius: 4 },
  
  // Section Styles
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 12 },
  
  // Actions Grid Styles
  actionsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '500', color: '#111', textAlign: 'center' },
  
  // Expense Item Styles
  expenseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseLeft: { flex: 1 },
  expenseType: { fontSize: 16, fontWeight: '500', color: '#111', marginBottom: 4 },
  expenseDate: { fontSize: 14, color: '#666' },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  statusText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  
  // Insight Card Styles
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightTitle: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#666', lineHeight: 20 },
  
  // Factor Breakdown Styles
  factorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  factorLabel: { fontSize: 14, color: '#666', flex: 1 },
  factorValue: { fontSize: 14, fontWeight: '600', color: '#4f46e5' },
});




