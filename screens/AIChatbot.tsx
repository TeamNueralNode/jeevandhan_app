import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your JeevanDhan AI assistant. I can help you understand your TCS score, provide financial advice, and guide you through improving your creditworthiness. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickQuestions = [
    "How can I improve my TCS score?",
    "What documents should I upload?",
    "Why is my score low?",
    "How does KYC help my score?",
    "What affects payment history?",
    "How often is my score updated?",
  ];

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('improve') && message.includes('score')) {
      return "To improve your TCS score:\n\n1. 📅 Pay all bills on time consistently\n2. 📄 Upload more expense documents (electricity, mobile, rent)\n3. 🆔 Complete KYC verification for a 50+ point boost\n4. 🔄 Maintain regular payment patterns\n5. 📊 Diversify your tracked expenses\n\nWhich area would you like me to explain in more detail?";
    }
    
    if (message.includes('document') || message.includes('upload')) {
      return "You should upload these documents for better TCS scoring:\n\n📱 Mobile recharge receipts\n💡 Electricity bills\n🏠 House rent payments\n🌐 Internet bills\n💧 Water bills\n🔥 Gas bills\n\nFor KYC verification:\n🆔 Aadhaar Card\n💳 PAN Card\n📄 Income Certificate\n🏦 Bank Statements\n\nGo to your Profile → Upload Documents to get started!";
    }
    
    if (message.includes('kyc')) {
      return "KYC (Know Your Customer) verification significantly boosts your TCS score:\n\n✅ Immediate 50+ point increase\n🔒 Enhanced security and trust\n⚡ Priority processing for services\n📈 Higher score potential (up to 850)\n\nRequired documents:\n• Aadhaar Card (mandatory)\n• PAN Card (mandatory)\n• Income Certificate (optional)\n• Bank Statement (optional)\n\nComplete KYC from Profile → KYC Verification";
    }
    
    if (message.includes('low') || message.includes('poor')) {
      return "If your TCS score is low, here's an action plan:\n\n🚨 Immediate actions:\n• Clear any overdue payments\n• Upload at least 3 recent bill payments\n• Complete basic KYC verification\n\n📈 Medium-term (1-3 months):\n• Maintain consistent payment schedule\n• Add more expense categories\n• Keep payment amounts stable\n\n💪 Your score can improve by 100+ points with consistent effort!";
    }
    
    if (message.includes('payment') && message.includes('history')) {
      return "Payment History is 35% of your TCS score - the most important factor!\n\n✅ What helps:\n• Paying bills before due dates\n• Consistent monthly payments\n• Zero overdue amounts\n• Regular payment patterns\n\n❌ What hurts:\n• Late payments (major impact)\n• Missed payments\n• Irregular payment patterns\n\nTip: Set up payment reminders to never miss a due date!";
    }
    
    if (message.includes('update') || message.includes('often')) {
      return "Your TCS score is updated:\n\n📊 Real-time: When you upload new documents\n📅 Daily: Payment status changes\n📈 Weekly: Score recalculation\n📋 Monthly: Comprehensive review\n\nYou can check your score anytime in the TCS Score tab. The more data you provide, the more accurate your score becomes!";
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! 👋 I'm here to help you with your TCS score and financial journey. You can ask me about:\n\n• Improving your TCS score\n• Document requirements\n• KYC verification\n• Payment strategies\n• Score factors\n\nWhat would you like to know?";
    }
    
    // Default response
    return "I understand you're asking about your TCS score. Here are some common topics I can help with:\n\n💡 Score improvement strategies\n📄 Document upload guidance\n🆔 KYC verification process\n📊 Understanding score factors\n💳 Payment best practices\n\nCould you please be more specific about what you'd like to know?";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const sendQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>JeevanDhan Financial Advisor</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              {!message.isUser && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser ? styles.userMessageTime : styles.aiMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
              {message.isUser && (
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessageContainer]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
              </View>
              <View style={[styles.messageBubble, styles.aiMessageBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}

          {/* Quick Questions */}
          {messages.length === 1 && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => sendQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me about your TCS score..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#fff" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  aiMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  aiMessageText: {
    color: '#374151',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  aiMessageTime: {
    color: '#6b7280',
  },
  userMessageTime: {
    color: '#e0e7ff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 2,
  },
  quickQuestionsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
});
