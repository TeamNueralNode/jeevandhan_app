import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TCSCalculator, ExpenseData } from '../utils/scoreCalculator';

const { width } = Dimensions.get('window');

export default function TCSScore() {
  const calculator = new TCSCalculator();
  
  const [expenses] = useState<ExpenseData[]>([
    { id: 1, type: 'Mobile Recharge', amount: 399, date: '2024-01-15', status: 'paid' },
    { id: 2, type: 'Electricity Bill', amount: 1250, date: '2024-01-10', status: 'paid' },
    { id: 3, type: 'House Rent', amount: 15000, date: '2024-01-01', status: 'paid' },
    { id: 4, type: 'Internet Bill', amount: 899, date: '2024-01-08', status: 'paid' },
    { id: 5, type: 'Mobile Recharge', amount: 399, date: '2024-01-05', status: 'paid' },
    { id: 6, type: 'Water Bill', amount: 450, date: '2024-01-12', status: 'paid' },
  ]);

  const [tcsData, setTcsData] = useState(() => calculator.calculateTCSScore(expenses));
  const [showRange, setShowRange] = useState(false);
  
  useEffect(() => {
    setTcsData(calculator.calculateTCSScore(expenses));
  }, [expenses]);

  const recommendations = calculator.getScoreRecommendations(tcsData.score, tcsData.factors);

  const scoreRanges = [
    { min: 750, max: 850, label: 'Excellent', color: '#10b981', description: 'Outstanding financial behavior' },
    { min: 700, max: 749, label: 'Very Good', color: '#22c55e', description: 'Great payment history' },
    { min: 650, max: 699, label: 'Good', color: '#84cc16', description: 'Good financial habits' },
    { min: 600, max: 649, label: 'Fair', color: '#eab308', description: 'Room for improvement' },
    { min: 550, max: 599, label: 'Poor', color: '#f59e0b', description: 'Needs attention' },
    { min: 300, max: 549, label: 'Very Poor', color: '#ef4444', description: 'Requires immediate action' },
  ];

  const getCurrentRange = () => {
    return scoreRanges.find(range => tcsData.score >= range.min && tcsData.score <= range.max) || scoreRanges[scoreRanges.length - 1];
  };

  const getScoreProgress = () => {
    return ((tcsData.score - 300) / 550) * 100;
  };

  const getScoreSuggestions = () => {
    const score = tcsData.score;
    if (score >= 750) {
      return [
        "🎉 Excellent! You're in the top tier of TCS scores",
        "💪 Keep maintaining your consistent payment habits",
        "🔄 Continue diversifying your tracked expenses",
        "📈 Your score puts you ahead of 90% of users"
      ];
    } else if (score >= 700) {
      return [
        "⭐ Very Good! You're close to excellent territory",
        "🎯 Focus on payment consistency to reach 750+",
        "📊 Track more expense types for diversity bonus",
        "⏰ Maintain timely payments for the next 2-3 months"
      ];
    } else if (score >= 650) {
      return [
        "👍 Good progress! You're on the right track",
        "💡 Pay all bills before due dates this month",
        "📱 Add more regular expenses like mobile recharge",
        "🏠 Include rent and utility payments consistently"
      ];
    } else if (score >= 600) {
      return [
        "⚠️ Fair score - significant improvement possible",
        "🚨 Focus on eliminating any overdue payments",
        "📋 Upload and track at least 5 different expense types",
        "⏱️ Set payment reminders to avoid late payments"
      ];
    } else if (score >= 550) {
      return [
        "🔴 Poor score - immediate action needed",
        "💳 Clear any overdue payments immediately",
        "📄 Complete KYC verification for score boost",
        "🔄 Start with 2-3 regular monthly payments"
      ];
    } else {
      return [
        "🆘 Very Poor - urgent improvement required",
        "🚨 Address all overdue payments first",
        "📋 Begin by tracking just 1-2 regular expenses",
        "🆔 Complete basic KYC for immediate 50+ point boost"
      ];
    }
  };


  const factorDetails = [
    {
      key: 'paymentHistory',
      name: 'Payment History',
      icon: 'card',
      description: 'Your track record of paying bills on time',
      weight: '35%',
      tips: 'Always pay bills before due date to maintain good history'
    },
    {
      key: 'expenseConsistency',
      name: 'Expense Consistency',
      icon: 'repeat',
      description: 'Regular pattern of expense payments',
      weight: '25%',
      tips: 'Make regular payments for utilities and subscriptions'
    },
    {
      key: 'amountStability',
      name: 'Amount Stability',
      icon: 'trending-up',
      description: 'Consistency in payment amounts',
      weight: '25%',
      tips: 'Maintain similar payment amounts for recurring expenses'
    },
    {
      key: 'diversityBonus',
      name: 'Expense Diversity',
      icon: 'grid',
      description: 'Variety of different expense types',
      weight: '15%',
      tips: 'Track different types of expenses to show financial responsibility'
    }
  ];

  const currentRange = getCurrentRange();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TCS Score</Text>
        <Text style={styles.headerSubtitle}>Trust & Credit Score Analysis</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>Your TCS Score</Text>
            <TouchableOpacity 
              style={styles.rangeToggleHeader}
              onPress={() => setShowRange(!showRange)}
            >
              <Ionicons 
                name={showRange ? "eye-off" : "eye"} 
                size={18} 
                color="#4f46e5" 
              />
              <Text style={styles.rangeToggleHeaderText}>
                {showRange ? "Hide Ranges" : "Show Ranges"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Score Circle */}
          <View style={styles.scoreCircleContainer}>
            <View style={[styles.scoreCircle, { borderColor: currentRange.color }]}>
              <Text style={[styles.scoreValue, { color: currentRange.color }]}>
                {tcsData.score}
              </Text>
              <Text style={styles.scoreRange}>300-850</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={[styles.scoreStatus, { color: currentRange.color }]}>
                {currentRange.label}
              </Text>
              <Text style={styles.scoreDescription}>
                {currentRange.description}
              </Text>
            </View>
          </View>

          {/* Score Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${getScoreProgress()}%`,
                    backgroundColor: currentRange.color
                  }
                ]} 
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>300</Text>
              <Text style={styles.progressLabel}>850</Text>
            </View>
          </View>
        </View>

        {/* Score Ranges - Show when toggle is enabled */}
        {showRange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TCS Score Ranges</Text>
            <View style={styles.rangesContainer}>
              {scoreRanges.map((range, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.rangeItem,
                    tcsData.score >= range.min && tcsData.score <= range.max && styles.rangeItemActive
                  ]}
                >
                  <View style={[styles.rangeColor, { backgroundColor: range.color }]} />
                  <View style={styles.rangeInfo}>
                    <Text style={styles.rangeLabel}>{range.label}</Text>
                    <Text style={styles.rangeValues}>{range.min} - {range.max}</Text>
                  </View>
                  {tcsData.score >= range.min && tcsData.score <= range.max && (
                    <Ionicons name="checkmark-circle" size={20} color={range.color} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Personalized Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Suggestions</Text>
          <View style={styles.suggestionsContainer}>
            {getScoreSuggestions().map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <View style={styles.suggestionBullet}>
                  <Text style={styles.suggestionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Steps to Improve */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps to Improve</Text>
          <View style={styles.nextStepsCard}>
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Upload More Documents</Text>
                <Text style={styles.stepDescription}>Add utility bills and payment receipts</Text>
              </View>
            </View>
            
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Complete KYC Verification</Text>
                <Text style={styles.stepDescription}>Verify your identity for higher score potential</Text>
              </View>
            </View>
            
            <View style={styles.nextStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Maintain Payment History</Text>
                <Text style={styles.stepDescription}>Continue paying bills on time consistently</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Score Factors Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Factors</Text>
          {factorDetails.map((factor) => {
            const value = tcsData.factors[factor.key as keyof typeof tcsData.factors];
            const percentage = Math.round(value * 100);
            
            return (
              <View key={factor.key} style={styles.factorCard}>
                <View style={styles.factorHeader}>
                  <View style={styles.factorTitleContainer}>
                    <Ionicons name={factor.icon as any} size={20} color="#4f46e5" />
                    <Text style={styles.factorName}>{factor.name}</Text>
                    <Text style={styles.factorWeight}>{factor.weight}</Text>
                  </View>
                  <Text style={[styles.factorValue, { color: value > 0.7 ? '#10b981' : value > 0.4 ? '#f59e0b' : '#ef4444' }]}>
                    {percentage}%
                  </Text>
                </View>
                
                <View style={styles.factorProgress}>
                  <View style={styles.factorProgressBar}>
                    <View 
                      style={[
                        styles.factorProgressFill, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: value > 0.7 ? '#10b981' : value > 0.4 ? '#f59e0b' : '#ef4444'
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={styles.factorDescription}>{factor.description}</Text>
                <Text style={styles.factorTip}>💡 {factor.tips}</Text>
              </View>
            );
          })}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Ionicons name="bulb" size={20} color="#f59e0b" />
                <Text style={styles.recommendationTitle}>Tip {index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Score History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Trends</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>This Month</Text>
              <Text style={[styles.trendValue, { color: '#10b981' }]}>+12</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Last Month</Text>
              <Text style={styles.trendValue}>{tcsData.score - 12}</Text>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>3 Months Ago</Text>
              <Text style={styles.trendValue}>{tcsData.score - 25}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  rangeToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  rangeToggleHeaderText: {
    fontSize: 12,
    color: '#4f46e5',
    marginLeft: 6,
    fontWeight: '600',
  },
  scoreCircleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  scoreRange: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreStatus: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  suggestionBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  suggestionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  rangesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  rangeItemActive: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  rangeColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  rangeInfo: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  rangeValues: {
    fontSize: 14,
    color: '#666',
  },
  factorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginLeft: 8,
    flex: 1,
  },
  factorWeight: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  factorValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  factorProgress: {
    marginBottom: 12,
  },
  factorProgressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  factorProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  factorTip: {
    fontSize: 12,
    color: '#4f46e5',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendItem: {
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  nextStepsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
