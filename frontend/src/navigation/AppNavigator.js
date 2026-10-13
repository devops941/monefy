import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import BottomTabNavigator from './BottomTabNavigator';

import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import ImagePreviewScreen from '../screens/ImagePreviewScreen';
import OCRProcessingScreen from '../screens/OCRProcessingScreen';
import ExtractedBillReviewScreen from '../screens/ExtractedBillReviewScreen';
import ExpenseDetailsScreen from '../screens/ExpenseDetailsScreen';
import ManualExpenseEntryScreen from '../screens/ManualExpenseEntryScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import DailyReportScreen from '../screens/DailyReportScreen';
import WeeklyReportScreen from '../screens/WeeklyReportScreen';
import MonthlyReportScreen from '../screens/MonthlyReportScreen';
import MonthlyBudgetScreen from '../screens/MonthlyBudgetScreen';
import CategoryBudgetsScreen from '../screens/CategoryBudgetsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#3563E9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? 'MainTabs' : 'Login'}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="ImagePreview" component={ImagePreviewScreen} />
        <Stack.Screen name="OCRProcessing" component={OCRProcessingScreen} />
        <Stack.Screen name="ExtractedBillReview" component={ExtractedBillReviewScreen} />
        <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
        <Stack.Screen name="ManualExpenseEntry" component={ManualExpenseEntryScreen} />
        <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
        <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
        <Stack.Screen name="DailyReport" component={DailyReportScreen} />
        <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
        <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} />
        <Stack.Screen name="MonthlyBudget" component={MonthlyBudgetScreen} />
        <Stack.Screen name="CategoryBudgets" component={CategoryBudgetsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
