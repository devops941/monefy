import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import * as expenseSvc from '../services/expenseService';
import * as categorySvc from '../services/categoryService';
import * as profileSvc from '../services/userProfileService';

const AppContext = createContext();

const DEFAULT_PROFILE = {
  name: 'User',
  monthlyIncome: 75000,
  defaultBudget: 35000,
  currency: '₹',
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [userProfile, setUserProfileState] = useState(DEFAULT_PROFILE);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message) => setToast(message);

  // ── Load all data from server ─────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [expensesData, categoriesData, profileData] = await Promise.all([
        expenseSvc.getExpenses().catch(() => []),
        categorySvc.getCategories().catch(() => []),
        profileSvc.getProfile().catch(() => null),
      ]);

      setExpenses(expensesData || []);

      setCategories(categoriesData && categoriesData.length > 0 ? categoriesData : DEFAULT_CATEGORIES);

      if (profileData) {
        setUserProfileState({ ...DEFAULT_PROFILE, ...profileData });
      }
    } catch {
      // Network error — keep defaults
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('monefy_user'),
      AsyncStorage.getItem('monefy_token'),
    ]).then(([json, token]) => {
      if (json && token) {
        setUser(JSON.parse(json));
        loadAllData();
      } else {
        // Stale session (pre-auth or missing token) — force re-login
        AsyncStorage.multiRemove(['monefy_user', 'monefy_token']).catch(() => {});
      }
    }).catch(() => {})
    .finally(() => setAuthLoading(false));
  }, [loadAllData]);

  const login = async (userData) => {
    await AsyncStorage.setItem('monefy_user', JSON.stringify(userData));
    if (userData.token) await AsyncStorage.setItem('monefy_token', userData.token);
    setUser(userData);
    await loadAllData();
  };

  const logout = async () => {
    await AsyncStorage.removeItem('monefy_user');
    await AsyncStorage.removeItem('monefy_token');
    setUser(null);
    setExpenses([]);
    setCategories(DEFAULT_CATEGORIES);
    setUserProfileState(DEFAULT_PROFILE);
  };

  // ── Expenses ──────────────────────────────────────────────────────────────
  const addExpense = async (expense) => {
    const payload = {
      ...expense,
      title: expense.title || expense.merchantName || expense.merchant || 'Expense',
      merchantName: expense.merchantName || expense.merchant || undefined,
    };
    const saved = await expenseSvc.createExpense(payload);
    setExpenses((prev) => [saved, ...prev]);
    return saved;
  };

  const deleteExpense = async (id) => {
    setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
    try { await expenseSvc.deleteExpense(id); } catch { /* optimistic — already removed */ }
  };

  const updateExpense = async (id, data) => {
    setExpenses((prev) =>
      prev.map((e) => ((e._id || e.id) === id ? { ...e, ...data } : e))
    );
    try { await expenseSvc.updateExpense(id, data); } catch { /* optimistic — already updated */ }
  };

  // ── Categories ────────────────────────────────────────────────────────────
  const addCategory = async (category) => {
    try {
      const saved = await categorySvc.createCategory(category);
      setCategories((prev) => [...prev, saved]);
    } catch {
      setCategories((prev) => [...prev, { ...category, id: Date.now().toString() }]);
    }
  };

  const updateCategory = async (id, data) => {
    setCategories((prev) =>
      prev.map((c) => ((c._id || c.id) === id ? { ...c, ...data } : c))
    );
    try { await categorySvc.updateCategory(id, data); } catch {}
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
    try { await categorySvc.deleteCategory(id); } catch {}
  };

  // ── Profile ───────────────────────────────────────────────────────────────
  const setUserProfile = async (profile) => {
    setUserProfileState(profile);
    try { await profileSvc.updateProfile(profile); } catch {}
  };

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    user, authLoading, dataLoading,
    login, logout,
    expenses, categories, userProfile, toast,
    addExpense, deleteExpense, updateExpense,
    addCategory, updateCategory, deleteCategory,
    setUserProfile, showToast,
    refreshData: loadAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
