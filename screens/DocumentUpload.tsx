import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface DocumentData {
  id: string;
  type: string;
  name: string;
  uri: string;
  status: 'uploaded' | 'verified' | 'rejected';
  amount?: number;
  date?: string;
  provider?: string;
}

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [documentDetails, setDocumentDetails] = useState({
    amount: '',
    date: '',
    provider: ''
  });

  const documentTypes = [
    { id: 'electricity', name: 'Electricity Bill', icon: '⚡', color: '#f59e0b' },
    { id: 'mobile', name: 'Mobile Recharge', icon: '📱', color: '#3b82f6' },
    { id: 'rent', name: 'House Rent', icon: '🏠', color: '#10b981' },
    { id: 'internet', name: 'Internet Bill', icon: '🌐', color: '#8b5cf6' },
    { id: 'water', name: 'Water Bill', icon: '💧', color: '#06b6d4' },
    { id: 'gas', name: 'Gas Bill', icon: '🔥', color: '#ef4444' },
    { id: 'aadhaar', name: 'Aadhaar Card', icon: '🆔', color: '#f97316' },
    { id: 'income', name: 'Income Certificate', icon: '📄', color: '#84cc16' }
  ];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newDoc: DocumentData = {
          id: Date.now().toString(),
          type: selectedDocType,
          name: asset.name,
          uri: asset.uri,
          status: 'uploaded',
          amount: documentDetails.amount ? parseFloat(documentDetails.amount) : undefined,
          date: documentDetails.date,
          provider: documentDetails.provider
        };

        setDocuments(prev => [...prev, newDoc]);
        setModalVisible(false);
        setDocumentDetails({ amount: '', date: '', provider: '' });
        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newDoc: DocumentData = {
          id: Date.now().toString(),
          type: selectedDocType,
          name: `${selectedDocType}_${Date.now()}.jpg`,
          uri: asset.uri,
          status: 'uploaded',
          amount: documentDetails.amount ? parseFloat(documentDetails.amount) : undefined,
          date: documentDetails.date,
          provider: documentDetails.provider
        };

        setDocuments(prev => [...prev, newDoc]);
        setModalVisible(false);
        setDocumentDetails({ amount: '', date: '', provider: '' });
        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const openUploadModal = (docType: string) => {
    setSelectedDocType(docType);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Upload</Text>
        <Text style={styles.headerSubtitle}>Upload your expense documents for TCS calculation</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Document Types Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          <View style={styles.documentGrid}>
            {documentTypes.map((docType) => (
              <TouchableOpacity
                key={docType.id}
                style={[styles.documentCard, { borderColor: docType.color }]}
                onPress={() => openUploadModal(docType.id)}
              >
                <Text style={styles.documentIcon}>{docType.icon}</Text>
                <Text style={styles.documentName}>{docType.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uploaded Documents</Text>
            {documents.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{doc.name}</Text>
                  <Text style={styles.documentType}>
                    {documentTypes.find(t => t.id === doc.type)?.name}
                  </Text>
                  {doc.amount && (
                    <Text style={styles.documentAmount}>₹{doc.amount}</Text>
                  )}
                  {doc.date && (
                    <Text style={styles.documentDate}>{doc.date}</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(doc.status)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Upload {documentTypes.find(t => t.id === selectedDocType)?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Document Details Form */}
            {['electricity', 'mobile', 'rent', 'internet', 'water', 'gas'].includes(selectedDocType) && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Amount (₹)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter amount"
                  value={documentDetails.amount}
                  onChangeText={(text) => setDocumentDetails(prev => ({ ...prev, amount: text }))}
                  keyboardType="numeric"
                />

                <Text style={styles.formLabel}>Date</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="DD/MM/YYYY"
                  value={documentDetails.date}
                  onChangeText={(text) => setDocumentDetails(prev => ({ ...prev, date: text }))}
                />

                <Text style={styles.formLabel}>Provider/Company</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter provider name"
                  value={documentDetails.provider}
                  onChangeText={(text) => setDocumentDetails(prev => ({ ...prev, provider: text }))}
                />
              </View>
            )}

            {/* Upload Options */}
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Ionicons name="document" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Choose File</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  documentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111',
    textAlign: 'center',
  },
  documentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  documentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  closeButton: {
    padding: 4,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
