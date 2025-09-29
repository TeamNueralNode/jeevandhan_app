import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import Onboarding3 from './screens/Onboarding3';
import Login from './screens/Login';
import Home from './screens/Home';
import ExpenseTracker from './screens/ExpenseTracker';
import DocumentUpload from './screens/DocumentUpload';
import KYCVerification from './screens/KYCVerification';
import TCSScore from './screens/TCSScore';

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Login: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  TCSScore: undefined;
  DocumentUpload: undefined;
  KYCVerification: undefined;
  ExpenseTracker: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TCSScore') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'DocumentUpload') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'KYCVerification') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'ExpenseTracker') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="TCSScore" 
        component={TCSScore} 
        options={{ tabBarLabel: 'TCS Score' }}
      />
      <Tab.Screen 
        name="DocumentUpload" 
        component={DocumentUpload} 
        options={{ tabBarLabel: 'Documents' }}
      />
      <Tab.Screen 
        name="KYCVerification" 
        component={KYCVerification} 
        options={{ tabBarLabel: 'KYC' }}
      />
      <Tab.Screen 
        name="ExpenseTracker" 
        component={ExpenseTracker} 
        options={{ tabBarLabel: 'Expenses' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding1" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding1" component={Onboarding1} />
          <Stack.Screen name="Onboarding2" component={Onboarding2} />
          <Stack.Screen name="Onboarding3" component={Onboarding3} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
