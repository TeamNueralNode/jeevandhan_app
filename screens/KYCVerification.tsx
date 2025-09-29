import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface KYCDocument {
  id: string;
  type: 'aadhaar' | 'pan' | 'income' | 'bank' | 'address';
  name: string;
  uri: string;
  status: 'pending' | 'verified' | 'rejected';
  details?: any;
}

export default function KYCVerification() {
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKYCType, setSelectedKYCType] = useState<string>('');
  const [documentDetails, setDocumentDetails] = useState<any>({});

  const kycTypes = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      icon: '🆔',
      color: '#f97316',
      required: true,
      fields: ['aadhaarNumber', 'name', 'address']
    },
    {
      id: 'pan',
      name: 'PAN Card',
      icon: '💳',
      color: '#3b82f6',
      required: true,
      fields: ['panNumber', 'name']
    },
    {
      id: 'income',
      name: 'Income Certificate',
      icon: '📄',
      color: '#84cc16',
      required: false,
      fields: ['annualIncome', 'issuingAuthority']
    },
    {
      id: 'bank',
      name: 'Bank Statement',
      icon: '🏦',
      color: '#10b981',
      required: false,
      fields: ['accountNumber', 'bankName', 'ifscCode']
    },
    {
      id: 'address',
      name: 'Address Proof',
      icon: '🏠',
      color: '#8b5cf6',
      required: false,
      fields: ['documentType', 'address']
    }
  ];

  const getKYCProgress = () => {
    const requiredDocs = kycTypes.filter(type => type.required);
    const verifiedRequired = kycDocuments.filter(doc => 
      doc.status === 'verified' && kycTypes.find(type => type.id === doc.type)?.required
    );
    return (verifiedRequired.length / requiredDocs.length) * 100;
  };

  const getOverallKYCStatus = () => {
    const progress = getKYCProgress();
    if (progress === 100) return { status: 'Complete', color: '#10b981' };
    if (progress > 0) return { status: 'In Progress', color: '#f59e0b' };
    return { status: 'Not Started', color: '#ef4444' };
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newDoc: KYCDocument = {
          id: Date.now().toString(),
          type: selectedKYCType as any,
          name: asset.name,
          uri: asset.uri,
          status: 'pending',
          details: documentDetails
        };

        setKycDocuments(prev => [...prev, newDoc]);
        setModalVisible(false);
        setDocumentDetails({});
        Alert.alert('Success', 'KYC document uploaded successfully! It will be verified within 24 hours.');
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
        const newDoc: KYCDocument = {
          id: Date.now().toString(),
          type: selectedKYCType as any,
          name: `${selectedKYCType}_${Date.now()}.jpg`,
          uri: asset.uri,
          status: 'pending',
          details: documentDetails
        };

        setKycDocuments(prev => [...prev, newDoc]);
        setModalVisible(false);
        setDocumentDetails({});
        Alert.alert('Success', 'KYC document uploaded successfully! It will be verified within 24 hours.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const openKYCModal = (kycType: string) => {
    setSelectedKYCType(kycType);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      default: return 'time';
    }
  };

  const renderFormFields = () => {
    const kycType = kycTypes.find(type => type.id === selectedKYCType);
    if (!kycType) return null;

    return kycType.fields.map((field) => {
      const getFieldLabel = (fieldName: string) => {
        const labels: { [key: string]: string } = {
          aadhaarNumber: 'Aadhaar Number',
          panNumber: 'PAN Number',
          name: 'Full Name',
          address: 'Address',
          annualIncome: 'Annual Income (₹)',
          issuingAuthority: 'Issuing Authority',
          accountNumber: 'Account Number',
          bankName: 'Bank Name',
          ifscCode: 'IFSC Code',
          documentType: 'Document Type'
        };
        return labels[fieldName] || fieldName;
      };

      const getFieldPlaceholder = (fieldName: string) => {
        const placeholders: { [key: string]: string } = {
          aadhaarNumber: 'XXXX XXXX XXXX',
          panNumber: 'ABCDE1234F',
          name: 'Enter full name as per document',
          address: 'Enter complete address',
          annualIncome: 'Enter annual income',
          issuingAuthority: 'Government authority name',
          accountNumber: 'Bank account number',
          bankName: 'Name of the bank',
          ifscCode: 'Bank IFSC code',
          documentType: 'e.g., Electricity Bill, Rent Agreement'
        };
        return placeholders[fieldName] || `Enter ${fieldName}`;
      };

      return (
        <View key={field}>
          <Text style={styles.formLabel}>{getFieldLabel(field)}</Text>
          <TextInput
            style={styles.formInput}
            placeholder={getFieldPlaceholder(field)}
            value={documentDetails[field] || ''}
            onChangeText={(text) => setDocumentDetails((prev: any) => ({ ...prev, [field]: text }))}
            keyboardType={field.includes('Number') || field.includes('Income') ? 'numeric' : 'default'}
            maxLength={field === 'aadhaarNumber' ? 12 : field === 'panNumber' ? 10 : undefined}
          />
        </View>
      );
    });
  };

  const overallStatus = getOverallKYCStatus();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <Text style={styles.headerSubtitle}>Complete your KYC for enhanced TCS score</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* KYC Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>KYC Progress</Text>
            <View style={[styles.statusBadge, { backgroundColor: overallStatus.color }]}>
              <Text style={styles.statusText}>{overallStatus.status}</Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${getKYCProgress()}%`,
                    backgroundColor: overallStatus.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(getKYCProgress())}% Complete</Text>
          </View>

          <Text style={styles.progressNote}>
            Complete KYC verification to unlock higher TCS score potential
          </Text>
        </View>

        {/* KYC Document Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.kycGrid}>
            {kycTypes.map((kycType) => {
              const uploadedDoc = kycDocuments.find(doc => doc.type === kycType.id);
              const isUploaded = !!uploadedDoc;
              
              return (
                <TouchableOpacity
                  key={kycType.id}
                  style={[
                    styles.kycCard,
                    { borderColor: kycType.color },
                    isUploaded && { backgroundColor: '#f0fdf4' }
                  ]}
                  onPress={() => !isUploaded && openKYCModal(kycType.id)}
                  disabled={isUploaded}
                >
                  <View style={styles.kycCardHeader}>
                    <Text style={styles.kycIcon}>{kycType.icon}</Text>
                    {isUploaded && (
                      <Ionicons 
                        name={getStatusIcon(uploadedDoc.status)} 
                        size={20} 
                        color={getStatusColor(uploadedDoc.status)} 
                      />
                    )}
                  </View>
                  <Text style={styles.kycName}>{kycType.name}</Text>
                  {kycType.required && (
                    <Text style={styles.requiredLabel}>Required</Text>
                  )}
                  {isUploaded && (
                    <Text style={[styles.statusLabel, { color: getStatusColor(uploadedDoc.status) }]}>
                      {uploadedDoc.status.charAt(0).toUpperCase() + uploadedDoc.status.slice(1)}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Uploaded Documents */}
        {kycDocuments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uploaded Documents</Text>
            {kycDocuments.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>
                    {kycTypes.find(t => t.id === doc.type)?.name}
                  </Text>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  {doc.details && Object.keys(doc.details).length > 0 && (
                    <View style={styles.documentDetails}>
                      {Object.entries(doc.details).map(([key, value]) => (
                        <Text key={key} style={styles.detailText}>
                          {key}: {value as string}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.documentStatus}>
                  <Ionicons 
                    name={getStatusIcon(doc.status)} 
                    size={24} 
                    color={getStatusColor(doc.status)} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* KYC Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KYC Benefits</Text>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>🚀 Enhanced TCS Score</Text>
            <Text style={styles.benefitText}>
              Complete KYC verification can boost your TCS score by up to 50 points
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>🔒 Secure & Trusted</Text>
            <Text style={styles.benefitText}>
              Your documents are encrypted and stored securely with bank-level security
            </Text>
          </View>
          <View style={styles.benefitCard}>
            <Text style={styles.benefitTitle}>⚡ Faster Processing</Text>
            <Text style={styles.benefitText}>
              KYC verified users get priority processing for all services
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* KYC Upload Modal */}
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
                Upload {kycTypes.find(t => t.id === selectedKYCType)?.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Document Details Form */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Document Details</Text>
                {renderFormFields()}
              </View>

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
            </ScrollView>
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
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
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
  progressBarContainer: {
    marginBottom: 12,
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
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  progressNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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
  kycGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kycCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kycCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kycIcon: {
    fontSize: 32,
  },
  kycName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4,
  },
  requiredLabel: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
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
  documentName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  documentDetails: {
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  documentStatus: {
    marginLeft: 12,
  },
  benefitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
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
