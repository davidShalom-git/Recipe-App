import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useAuthStore } from '@/store/auth';// Adjust path as needed

const RecipeDashboard = () => {
  const [recipes, setRecipes] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { token } = useAuthStore();
  const BASE_URL = 'https://recipe-app-rq23.vercel.app/api/recipe';

  const categories = [
    { key: 'all', name: 'All', icon: '🍽️' },
    { key: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { key: 'lunch', name: 'Lunch', icon: '🌞' },
    { key: 'snacks', name: 'Snacks', icon: '🍪' },
    { key: 'dinner', name: 'Dinner', icon: '🌙' }
  ];

  // Fetch recipes for a specific category
  const fetchRecipesByCategory = async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/${category}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return []; // No recipes found
        }
        throw new Error(`Failed to fetch ${category} recipes`);
      }

      const data = await response.json();
      return data.recipes || data || [];
    } catch (error) {
      console.error(`Error fetching ${category} recipes:`, error);
      return [];
    }
  };

  // Fetch all user recipes
  const fetchAllRecipes = async () => {
    setLoading(true);
    try {
      const [breakfastData, lunchData, snacksData, dinnerData] = await Promise.all([
        fetchRecipesByCategory('breakfast'),
        fetchRecipesByCategory('lunch'),
        fetchRecipesByCategory('snacks'),
        fetchRecipesByCategory('dinner')
      ]);

      setRecipes({
        breakfast: breakfastData,
        lunch: lunchData,
        snacks: snacksData,
        dinner: dinnerData
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  // Delete recipe
  const deleteRecipe = async (recipeId, category) => {
    try {
      const response = await fetch(`${BASE_URL}/${category}/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Update local state
      setRecipes(prev => ({
        ...prev,
        [category]: prev[category].filter(recipe => recipe._id !== recipeId)
      }));

      Alert.alert('Success', 'Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      Alert.alert('Error', 'Failed to delete recipe');
    }
  };

  // Confirm delete
  const confirmDelete = (recipe, category) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteRecipe(recipe._id, category)
        }
      ]
    );
  };

  // Get filtered recipes based on active category and search
  const getFilteredRecipes = () => {
    let allRecipes = [];
    
    if (activeCategory === 'all') {
      Object.entries(recipes).forEach(([category, categoryRecipes]) => {
        categoryRecipes.forEach(recipe => {
          allRecipes.push({ ...recipe, category });
        });
      });
    } else {
      recipes[activeCategory].forEach(recipe => {
        allRecipes.push({ ...recipe, category: activeCategory });
      });
    }

    if (searchQuery) {
      allRecipes = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return allRecipes;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllRecipes();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const filteredRecipes = getFilteredRecipes();
  const totalRecipes = Object.values(recipes).reduce((sum, categoryRecipes) => sum + categoryRecipes.length, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading your recipes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Recipe Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your delicious creations</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsNumber}>{totalRecipes}</Text>
          <Text style={styles.statsLabel}>Recipes</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your recipes..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryItem,
              activeCategory === category.key && styles.activeCategoryItem
            ]}
            onPress={() => setActiveCategory(category.key)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              activeCategory === category.key && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
            <View style={[
              styles.categoryBadge,
              activeCategory === category.key && styles.activeCategoryBadge
            ]}>
              <Text style={[
                styles.categoryBadgeText,
                activeCategory === category.key && styles.activeCategoryBadgeText
              ]}>
                {category.key === 'all' ? totalRecipes : recipes[category.key]?.length || 0}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipes List */}
      <ScrollView
        style={styles.recipesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Recipes Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Start creating your first recipe!'}
            </Text>
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {filteredRecipes.map((recipe, index) => (
              <View key={`${recipe._id}-${index}`} style={styles.recipeCard}>
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
                <View style={styles.recipeContent}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeTitle} numberOfLines={2}>
                      {recipe.title}
                    </Text>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>
                        {recipe.category}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.recipeInfo}>
                    <Text style={styles.ingredientsCount}>
                      🥘 {recipe.ingredients?.length || 0} ingredients
                    </Text>
                    <Text style={styles.stepsCount}>
                      📝 {recipe.how_to?.length || 0} steps
                    </Text>
                  </View>

                  <View style={styles.recipeActions}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => {
                        // Navigate to recipe detail - implement navigation
                        console.log('View recipe:', recipe._id);
                      }}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => confirmDelete(recipe, recipe.category)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryItem: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  categoryBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeCategoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  activeCategoryBadgeText: {
    color: '#FFFFFF',
  },
  recipesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recipesGrid: {
    paddingVertical: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 10,
  },
  categoryTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
    textTransform: 'capitalize',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ingredientsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  recipeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default RecipeDashboard;