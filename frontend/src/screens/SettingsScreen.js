import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag, Target, LogOut, Shield, ChevronRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import Card from '../components/common/Card';

const SettingsScreen = ({ navigation }) => {
  const { user, userProfile, logout } = useApp();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const displayName = user?.name || userProfile?.name || 'User';

  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const settings = [
    { id: 'categories', Icon: Tag,    label: 'Category Management', route: 'CategoryManagement', color: '#7E22CE' },
    { id: 'budget',     Icon: Target, label: 'Budget Limits',       route: 'MonthlyBudget',      color: '#0369A1' },
  ];

  const handleSettingPress = (route) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Settings</Text>

        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              {(user?.email || userProfile?.email) && (
                <Text style={styles.profileEmail}>{user?.email || userProfile?.email}</Text>
              )}
              
            </View>
          </View>
        </Card>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {settings.map(({ id, Icon, label, route, color }) => (
            <TouchableOpacity
              key={id}
              style={styles.settingItem}
              onPress={() => handleSettingPress(route)}
              activeOpacity={0.7}
            >
              <View style={styles.settingItemContent}>
                <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                  <Icon size={18} color={color} strokeWidth={2} />
                </View>
                <Text style={styles.settingLabel}>{label}</Text>
              </View>
              <ChevronRight size={16} color={COLORS.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Privacy & Security</Text>
          <View style={styles.privacyRow}>
            <Shield size={18} color={COLORS.success} strokeWidth={2} />
            <Text style={styles.privacyText}>
              Your data is stored locally and never sent to external servers.
            </Text>
          </View>
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={18} color={COLORS.danger} strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  profileDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  privacyCard: {
    marginBottom: 24,
    backgroundColor: COLORS.successLight,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 8,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.success,
    flex: 1,
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 32,
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
});

export default SettingsScreen;
