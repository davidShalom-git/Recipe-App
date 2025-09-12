import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function DetailsFood() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [foods, setFoods] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (foodId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://recipe-app-rq23.vercel.app/api/recipe/snacks/${foodId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  };

  const parseIngredients = (ingredients) => {
    console.log("Raw ingredients from API:", ingredients, typeof ingredients);
    
    if (!ingredients) return [];
    
    // If it's an array, check if the first element is a stringified array
    if (Array.isArray(ingredients)) {
      console.log("Ingredients is array:", ingredients);
      
      // If array has one element that looks like a stringified JSON array
      if (ingredients.length === 1 && typeof ingredients[0] === 'string') {
        const firstItem = ingredients[0].trim();
        
        // Check if it looks like a stringified array: "[\"Rice\", \"Urad Dal\", \"Salt\"]"
        if (firstItem.startsWith('[') && firstItem.endsWith(']')) {
          try {
            const parsed = JSON.parse(firstItem);
            if (Array.isArray(parsed)) {
              console.log("Successfully parsed nested JSON array:", parsed);
              return parsed;
            }
          } catch (error) {
            console.log("JSON parse failed, trying manual parsing");
            
            // Manual parsing for escaped quotes
            const content = firstItem.slice(1, -1); // Remove [ and ]
            const items = content.split(',').map(item => {
              // Remove quotes, escaped quotes, and trim whitespace
              return item.trim().replace(/^["\\]*|["\\]*$/g, '').replace(/\\"/g, '"');
            });
            console.log("Manually parsed items:", items);
            return items;
          }
        }
      }
      

      return ingredients;
    }
    
    // If it's a string
    if (typeof ingredients === 'string') {
      let cleanedIngredients = ingredients.trim();
      
      
      if (cleanedIngredients.startsWith('[') && cleanedIngredients.endsWith(']')) {
        try {
          const parsed = JSON.parse(cleanedIngredients);
          if (Array.isArray(parsed)) {
            console.log("Successfully parsed JSON array:", parsed);
            return parsed;
          }
        } catch (error) {
          console.log("JSON parse failed, trying manual parsing");
          
          // Manual parsing
          const content = cleanedIngredients.slice(1, -1);
          const items = content.split(',').map(item => {
            return item.trim().replace(/^["']|["']$/g, '');
          });
          console.log("Manually parsed items:", items);
          return items;
        }
      }
      
      // Single string item
      return [cleanedIngredients];
    }
    
    return [];
  };

   const parseHow_to = (How_to) => {
    console.log("Raw ingredients from API:", How_to, typeof ingredients);
    
    if (!How_to) return [];
    
    // If it's an array, check if the first element is a stringified array
    if (Array.isArray(How_to)) {
      console.log("Ingredients is array:", How_to);
    
      // If array has one element that looks like a stringified JSON array
      if (How_to.length === 1 && typeof How_to[0] === 'string') {
        const firstItem = How_to[0].trim();
        
        // Check if it looks like a stringified array: "[\"Rice\", \"Urad Dal\", \"Salt\"]"
        if (firstItem.startsWith('[') && firstItem.endsWith(']')) {
          try {
            const parsed = JSON.parse(firstItem);
            if (Array.isArray(parsed)) {
              console.log("Successfully parsed nested JSON array:", parsed);
              return parsed;
            }
          } catch (error) {
            console.log("JSON parse failed, trying manual parsing");
            
            // Manual parsing for escaped quotes
            const content = firstItem.slice(1, -1); // Remove [ and ]
            const items = content.split(',').map(item => {
              // Remove quotes, escaped quotes, and trim whitespace
              return item.trim().replace(/^["\\]*|["\\]*$/g, '').replace(/\\"/g, '"');
            });
            console.log("Manually parsed items:", items);
            return items;
          }
        }
      }
      

      return How_to;
    }
    
    // If it's a string
    if (typeof ingredients === 'string') {
      let cleanedIngredients = ingredients.trim();
      
      
      if (cleanedIngredients.startsWith('[') && cleanedIngredients.endsWith(']')) {
        try {
          const parsed = JSON.parse(cleanedIngredients);
          if (Array.isArray(parsed)) {
            console.log("Successfully parsed JSON array:", parsed);
            return parsed;
          }
        } catch (error) {
          console.log("JSON parse failed, trying manual parsing");
          
          // Manual parsing
          const content = cleanedIngredients.slice(1, -1);
          const items = content.split(',').map(item => {
            return item.trim().replace(/^["']|["']$/g, '');
          });
          console.log("Manually parsed items:", items);
          return items;
        }
      }
      
      // Single string item
      return [cleanedIngredients];
    }
    
    return [];
  };


  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const ingredientsList = parseIngredients(foods.ingredients);
  const howToList = parseHow_to(foods.how_to);

  console.log("Final ingredients list:", ingredientsList); // Debug log
  console.log("Ingredients list length:", ingredientsList.length); // Debug log

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{foods.title || "Recipe Details"}</Text>
      
      {foods.image && (
        <Image
          source={{ uri: foods.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🥄</Text>
          </View>
          <Text style={styles.sectionTitle}>Ingredients</Text>
        </View>

        <View style={styles.card}>
          {ingredientsList.length > 0 ? (
            ingredientsList.map((ingredient, idx) => (
              <View key={idx} style={styles.ingredientItem}>
                <Text style={styles.bulletText}>•</Text>
                <Text style={styles.ingredientText}>
                  {ingredient}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                No ingredients found. Debug: {JSON.stringify(foods.ingredients)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🥄</Text>
                </View>
                <Text style={styles.sectionTitle}>How_to</Text>
              </View>
      
              <View style={styles.card}>
                {ingredientsList.length > 0 ? (
                  howToList.map((how_to, idx) => (
                    <View key={idx} style={styles.ingredientItem}>
                      <Text style={styles.bulletText}>•</Text>
                      <Text style={styles.ingredientText}>
                        {how_to}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>
                      No ingredients found. Debug: {JSON.stringify(foods.ingredients)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'indigo',
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    minHeight: '100%',
  },
  centerContent: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    width: '100%',
    maxWidth: 380,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingVertical: 4,
  },
  bulletText: {
    fontSize: 20,
    color: '#4f46e5',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 1,
    minWidth: 20,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#718096',
    fontStyle: 'italic',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});