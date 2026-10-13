import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import CategoryCard from '../components/category/CategoryCard';

const CategorySelectionScreen = ({ navigation }) => {
  const { categories } = useApp();

  const handleSelectCategory = (categoryId) => {
    navigation.navigate('CategoryDetails', { categoryId });
  };

  const handleManageCategories = () => {
    navigation.navigate('CategoryManagement');
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectCategory(item.id)}
      style={styles.cardWrapper}
    >
      <CategoryCard category={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AppHeader
          title="Select Category"
          onBackPress={() => navigation.goBack()}
        />
        <TouchableOpacity
          style={styles.manageButton}
          onPress={handleManageCategories}
        >
          <Text style={styles.manageButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  manageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    width: '48%',
  },
});

export default CategorySelectionScreen;
