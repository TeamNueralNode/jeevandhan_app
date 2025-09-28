import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Modal,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Expense {
  id: number;
  type: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description?: string;
}

export default function ExpenseTracker() {
  const navigation = useNavigation<any>();
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, type: 'Mobile Recharge', amount: 399, date: '2024-01-15', status: 'paid' },
    { id: 2, type: 'Electricity Bill', amount: 1250, date: '2024-01-10', status: 'paid' },
    { id: 3, type: 'House Rent', amount: 15000, date: '2024-01-01', status: 'paid' },
    { id: 4, type: 'Internet Bill', amount: 899, date: '2024-01-08', status: 'paid' },
    { id: 5, type: 'Water Bill', amount: 450, date: '2024-01-20', status: 'pending' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    type: '',
    amount: '',
    description: ''
  });

  const expenseTypes = [
    { name: 'Mobile Recharge', icon: '📱' },
    { name: 'Electricity Bill', icon: '💡' },
    { name: 'House Rent', icon: '🏠' },
    { name: 'Internet Bill', icon: '🌐' },
    { name: 'Water Bill', icon: '💧' },
    { name: 'Gas Bill', icon: '🔥' },
    { name: 'Insurance', icon: '🛡️' },
    { name: 'Other', icon: '📄' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const addExpense = () => {
    if (!newExpense.type || !newExpense.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const expense: Expense = {
      id: expenses.length + 1,
      type: newExpense.type,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: newExpense.description
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ type: '', amount: '', description: '' });
    setModalVisible(false);
    Alert.alert('Success', 'Expense added successfully!');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryValue}>₹{totalExpenses.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={[styles.summaryValue, { color: '#10b981' }]}>₹{paidExpenses.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>₹{pendingExpenses.toLocaleString()}</Text>
          </View>
        </View>

        {/* Expenses List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Expenses</Text>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseLeft}>
                <Text style={styles.expenseType}>{expense.type}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
                {expense.description && (
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                )}
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) }]}>
                  <Text style={styles.statusText}>{expense.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Expense Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                {expenseTypes.map((type) => (
                  <TouchableOpacity
                    key={type.name}
                    style={[
                      styles.typeOption,
                      newExpense.type === type.name && styles.typeOptionSelected
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, type: type.name })}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[
                      styles.typeName,
                      newExpense.type === type.name && styles.typeNameSelected
                    ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add description..."
                value={newExpense.description}
                onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addExpense}>
                <Text style={styles.submitButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: { fontSize: 20, fontWeight: '600', color: '#fff' },
  body: { flex: 1, padding: 16 },

  // Summary Styles
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700', color: '#111' },

  // Section Styles
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 12 },

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
  expenseDate: { fontSize: 14, color: '#666', marginBottom: 2 },
  expenseDescription: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { fontSize: 10, fontWeight: '600', color: '#fff' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  closeButton: { fontSize: 18, color: '#666' },
  modalBody: { padding: 20 },

  // Form Styles
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#111', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  // Type Selector Styles
  typeSelector: { marginBottom: 8 },
  typeOption: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 80,
  },
  typeOptionSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#f0f0ff',
  },
  typeIcon: { fontSize: 20, marginBottom: 4 },
  typeName: { fontSize: 12, color: '#666', textAlign: 'center' },
  typeNameSelected: { color: '#4f46e5', fontWeight: '500' },

  // Submit Button
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
