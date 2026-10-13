import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';

const PRESET_COLORS = [
  '#3563E9', '#F59E0B', '#10B981', '#EC4899',
  '#EF4444', '#8B5CF6', '#06B6D4', '#6366F1',
  '#14B8A6', '#64748B',
];

const PRESET_ICONS = ['📦', '🏷️', '⭐', '💡', '🎯', '🔑', '🧳', '🌿', '💼', '🛠️'];

const CategoryManagementScreen = ({ navigation }) => {
  const { categories, addCategory, deleteCategory, showToast } = useApp();
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) { showToast('Please enter a category name'); return; }
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category already exists'); return;
    }
    addCategory({ name: trimmed, color: selectedColor, icon: selectedIcon, isDefault: false, spent: 0, budget: 0 });
    setNewName('');
    showToast('Category added!');
  };

  const handleDelete = (cat) => {
    Alert.alert('Delete Category', `Delete "${cat.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => { deleteCategory(cat.id); showToast('Category deleted'); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Manage Categories" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add New Category */}
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add New Category</Text>

          <TextInput
            style={styles.input}
            placeholder="Category name"
            placeholderTextColor={COLORS.textMuted}
            value={newName}
            onChangeText={setNewName}
          />

          <Text style={styles.pickerLabel}>Color</Text>
          <View style={styles.colorRow}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.8}
              />
            ))}
          </View>

          <Text style={styles.pickerLabel}>Icon</Text>
          <View style={styles.iconRow}>
            {PRESET_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && { backgroundColor: selectedColor + '22', borderColor: selectedColor },
                ]}
                onPress={() => setSelectedIcon(icon)}
                activeOpacity={0.8}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.addBtn, { backgroundColor: selectedColor }]} onPress={handleAdd} activeOpacity={0.8}>
            <Plus size={18} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Category List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>All Categories ({categories.length})</Text>

          {categories.map((cat) => (
            <View key={cat.id} style={styles.catItem}>
              <View style={[styles.catIconBox, { backgroundColor: (cat.color || COLORS.primary) + '22' }]}>
                <Text style={styles.catIcon}>{cat.icon || '📦'}</Text>
              </View>

              <View style={styles.catInfo}>
                <Text style={styles.catName}>{cat.name}</Text>
                {cat.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: (cat.color || COLORS.primary) + '22' }]}>
                    <Text style={[styles.defaultBadgeText, { color: cat.color || COLORS.primary }]}>Default</Text>
                  </View>
                )}
              </View>

              <View style={[styles.colorBar, { backgroundColor: cat.color || COLORS.primary }]} />

              {!cat.isDefault && (
                <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.deleteBtn} activeOpacity={0.7}>
                  <Trash2 size={16} color={COLORS.danger} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  addSection: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: COLORS.textPrimary,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  iconText: { fontSize: 22 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  addBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },

  listSection: { marginBottom: 8 },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  catIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catIcon: { fontSize: 20 },
  catInfo: { flex: 1 },
  catName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  defaultBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '700' },
  colorBar: { width: 4, height: 32, borderRadius: 2 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryManagementScreen;
