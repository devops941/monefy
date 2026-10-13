import { useState } from 'react';
import {
  View, StyleSheet, Text, ScrollView, TextInput,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import AppButton from '../components/common/AppButton';
import AppHeader from '../components/common/AppHeader';

const CATEGORY_LIST = [
  { id: 'cat_1',  name: 'Groceries',     icon: '🛒', bg: '#F0FDF4', text: '#15803D' },
  { id: 'cat_2',  name: 'Food & Dining', icon: '🍽️', bg: '#FFF7ED', text: '#C2410C' },
  { id: 'cat_3',  name: 'Transport',     icon: '🚗', bg: '#F0F9FF', text: '#0369A1' },
  { id: 'cat_4',  name: 'Shopping',      icon: '🛍️', bg: '#FDF4FF', text: '#7E22CE' },
  { id: 'cat_5',  name: 'Healthcare',    icon: '❤️', bg: '#FFF1F2', text: '#BE123C' },
  { id: 'cat_6',  name: 'Utilities',     icon: '⚡', bg: '#FFFBEB', text: '#B45309' },
  { id: 'cat_7',  name: 'Education',     icon: '📚', bg: '#F5F3FF', text: '#6D28D9' },
  { id: 'cat_8',  name: 'Entertainment', icon: '🎬', bg: '#EEF2FF', text: '#4338CA' },
  { id: 'cat_9',  name: 'Personal Care', icon: '😊', bg: '#F0FDFA', text: '#0F766E' },
  { id: 'cat_10', name: 'Housing',       icon: '🏠', bg: '#F8FAFC', text: '#475569' },
  { id: 'cat_11', name: 'Other',         icon: '📦', bg: '#F1F5F9', text: '#475569' },
];

const getCatMeta = (name) =>
  CATEGORY_LIST.find((c) => c.name.toLowerCase() === (name || '').toLowerCase())
  || CATEGORY_LIST[CATEGORY_LIST.length - 1];

const initItems = (rawItems) => {
  if (!rawItems || rawItems.length === 0)
    return [{ id: 1, itemName: '', quantity: 1, unitPrice: 0, amount: 0, category: 'Other' }];
  return rawItems.map((item, i) => ({
    id: item.id || i + 1,
    itemName: item.itemName || '',
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice || 0,
    amount: item.amount || 0,
    category: item.category || 'Other',
  }));
};

const ExtractedBillReviewScreen = ({ navigation, route }) => {
  const { addExpense, categories, showToast } = useApp();
  const imageUri = route?.params?.imageUri || null;

  const [merchantName, setMerchantName] = useState(route?.params?.merchantName || '');
  const [items, setItems] = useState(initItems(route?.params?.items));
  const [openPickerId, setOpenPickerId] = useState(null);

  const totalAmount = items.reduce((s, it) => s + (it.amount || 0), 0);

  const handleAddItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    setItems([...items, { id: newId, itemName: '', quantity: 1, unitPrice: 0, amount: 0, category: 'Other' }]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.amount = parseFloat((updated.quantity * updated.unitPrice).toFixed(2));
      }
      return updated;
    }));
  };

  const handleDeleteItem = (id) => {
    if (items.length === 1) { Alert.alert('Cannot Delete', 'At least one item is required.'); return; }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemCategory = (id, catName) => {
    setItems(items.map((it) => it.id === id ? { ...it, category: catName } : it));
    setOpenPickerId(null);
  };

  const handleSave = async () => {
    if (!merchantName.trim()) { Alert.alert('Required', 'Please enter a merchant name.'); return; }
    if (items.every((it) => it.amount <= 0)) { Alert.alert('Required', 'At least one item must have an amount.'); return; }

    // Group items by category → one expense per category group
    const groups = {};
    items.forEach((item) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });

    try {
      await Promise.all(
        Object.entries(groups).map(([catName, groupItems]) => {
          const catObj = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
          return addExpense({
            title: merchantName,
            merchantName,
            amount: groupItems.reduce((s, it) => s + it.amount, 0),
            categoryId: catObj ? (catObj._id || catObj.id) : 'cat_11',
            transactionDate: new Date().toISOString().split('T')[0],
            billImageUri: imageUri,
            items: groupItems,
          });
        })
      );

      const catNames = Object.keys(groups);
      showToast(
        catNames.length > 1
          ? `${catNames.length} expenses saved (${catNames.join(' + ')})`
          : 'Expense saved!'
      );
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch {
      showToast('Failed to save expense. Check connection.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Review Bill" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bill image */}
        {imageUri && (
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.billImage} resizeMode="cover" />
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>📄 AI-scanned bill</Text>
            </View>
          </View>
        )}

        {/* Merchant */}
        <View style={styles.section}>
          <Text style={styles.label}>MERCHANT / SHOP NAME</Text>
          <TextInput
            style={styles.merchantInput}
            value={merchantName}
            onChangeText={setMerchantName}
            placeholder="e.g. AJIO, Big Bazaar, Swiggy"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Items */}
        <View style={styles.section}>
          <View style={styles.itemsHeader}>
            <Text style={styles.label}>ITEMS</Text>
            <TouchableOpacity onPress={handleAddItem} style={styles.addBtn}>
              <Text style={styles.addBtnText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map((item) => {
            const catMeta = getCatMeta(item.category);
            const isOpen = openPickerId === item.id;
            return (
              <View key={item.id} style={styles.itemCard}>
                {/* Item name */}
                <TextInput
                  style={styles.itemNameInput}
                  value={item.itemName}
                  onChangeText={(v) => handleUpdateItem(item.id, 'itemName', v)}
                  placeholder="Item name"
                  placeholderTextColor="#94A3B8"
                />

                {/* Qty / Price / Total row */}
                <View style={styles.itemNumRow}>
                  <View style={styles.numField}>
                    <Text style={styles.numLabel}>Qty</Text>
                    <TextInput
                      style={styles.numInput}
                      value={String(item.quantity)}
                      onChangeText={(v) => handleUpdateItem(item.id, 'quantity', parseFloat(v) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.numDivider} />
                  <View style={styles.numField}>
                    <Text style={styles.numLabel}>Price ₹</Text>
                    <TextInput
                      style={styles.numInput}
                      value={String(item.unitPrice)}
                      onChangeText={(v) => handleUpdateItem(item.id, 'unitPrice', parseFloat(v) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.numDivider} />
                  <View style={[styles.numField, { flex: 1.2, alignItems: 'flex-end' }]}>
                    <Text style={styles.numLabel}>Total</Text>
                    <Text style={styles.totalCell}>₹{item.amount.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Category chip + delete */}
                <View style={styles.itemFooter}>
                  <TouchableOpacity
                    style={[styles.catChip, { backgroundColor: catMeta.bg }]}
                    onPress={() => setOpenPickerId(isOpen ? null : item.id)}
                  >
                    <Text style={styles.catChipIcon}>{catMeta.icon}</Text>
                    <Text style={[styles.catChipText, { color: catMeta.text }]}>{catMeta.name}</Text>
                    <Text style={[styles.catChipArrow, { color: catMeta.text }]}>{isOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Inline category picker */}
                {isOpen && (
                  <View style={styles.catGrid}>
                    {CATEGORY_LIST.map((cat) => {
                      const selected = cat.name === item.category;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[styles.catOption, selected && { backgroundColor: '#3563E9' }]}
                          onPress={() => handleItemCategory(item.id, cat.name)}
                        >
                          <Text style={styles.catOptionIcon}>{cat.icon}</Text>
                          <Text style={[styles.catOptionText, selected && { color: '#FFF' }]}>{cat.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm & Save Expense" onPress={handleSave} variant="primary" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 },

  imageCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  billImage: { width: '100%', height: 160 },
  imageBadge: { backgroundColor: '#EFF6FF', paddingVertical: 8 },
  imageBadgeText: { fontSize: 12, color: '#3563E9', fontWeight: '600', textAlign: 'center' },

  section: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1, marginBottom: 10 },

  merchantInput: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0',
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#0F172A', fontWeight: '600',
  },

  itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  addBtn: { backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { color: '#3563E9', fontSize: 13, fontWeight: '700' },

  itemCard: {
    backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0',
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },

  itemNameInput: {
    fontSize: 15, fontWeight: '600', color: '#0F172A',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    paddingBottom: 10, marginBottom: 12,
  },

  itemNumRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  numField: { flex: 1, alignItems: 'center' },
  numLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  numInput: {
    backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 8, paddingVertical: 6, fontSize: 14, color: '#0F172A', textAlign: 'center', width: '90%',
  },
  numDivider: { width: 1, height: 36, backgroundColor: '#E2E8F0', marginHorizontal: 4 },
  totalCell: { fontSize: 15, fontWeight: '800', color: '#3563E9' },

  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catChip: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, gap: 4,
  },
  catChipIcon: { fontSize: 14 },
  catChipText: { fontSize: 12, fontWeight: '700' },
  catChipArrow: { fontSize: 9, marginLeft: 2 },
  deleteBtn: { padding: 6 },
  deleteIcon: { fontSize: 16, color: '#EF4444' },

  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  catOption: {
    width: '30%', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4,
    borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
  },
  catOptionIcon: { fontSize: 20, marginBottom: 3 },
  catOptionText: { fontSize: 10, fontWeight: '600', color: '#475569', textAlign: 'center' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 14, padding: 18,
    borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  totalAmount: { fontSize: 26, fontWeight: '900', color: '#3563E9' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingBottom: 28, paddingTop: 12,
    backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
});

export default ExtractedBillReviewScreen;
