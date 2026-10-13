import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Clock, ScanLine, BarChart2, Settings } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import ExpenseHistoryScreen from '../screens/ExpenseHistoryScreen';
import UploadBillScreen from '../screens/UploadBillScreen';
import ReportsOverviewScreen from '../screens/ReportsOverviewScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 75,
          paddingBottom: 13,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="History"
        component={ExpenseHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} strokeWidth={2} />,
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Scan"
        component={UploadBillScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size} strokeWidth={2} />,
          tabBarLabel: 'Scan',
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsOverviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} strokeWidth={2} />,
          tabBarLabel: 'Reports',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} strokeWidth={2} />,
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
