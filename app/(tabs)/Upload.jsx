import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, Animated, Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useAuthStore } from '@/store/auth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const Upload = () => {
  const navigation = useNavigation();
  
  // Get authentication state from store
  const { token, isAuthenticated, user, checkAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    ingredients: [],
    how_to: []
  })
  
  const [ingredients, setIng] = useState("")
  const [howTo, setHowTo] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))

  // Memoize responsive functions to prevent recalculation
  const { wp, hp } = useMemo(() => ({
    wp: (percentage) => {
      const value = (percentage * screenWidth) / 100
      return Math.round(value)
    },
    hp: (percentage) => {
      const value = (percentage * screenHeight) / 100
      return Math.round(value)
    }
  }), [screenWidth, screenHeight]);

  // Optimize auth check with error handling
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
        setHasError(true);
      }
    };
    initAuth();
  }, [checkAuth]);

  // Debug authentication state (only in development)
  useEffect(() => {
    if (__DEV__) {
      console.log('Upload component - Auth state:', {
        hasToken: !!token,
        isAuthenticated,
        username: user?.username,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
      });
    }
  }, [token, isAuthenticated, user]);

  // Optimized animation setup
  useEffect(() => {
    let isMounted = true;
    
    const startAnimations = () => {
      if (!isMounted) return;
      
      try {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600, // Reduced from 800
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400, // Reduced from 600
            useNativeDriver: true,
          })
        ]).start();
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    const timer = setTimeout(startAnimations, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [fadeAnim, slideAnim])

  // Error boundary component
  if (hasError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Please try reloading the page</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              checkAuth();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show authentication error if not logged in
  if (!isAuthenticated || !token) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authErrorContainer}>
          <Text style={styles.authErrorIcon}>🔒</Text>
          <Text style={styles.authErrorTitle}>Authentication Required</Text>
          <Text style={styles.authErrorText}>Please log in to upload recipes</Text>
          <TouchableOpacity 
            style={styles.authErrorButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authErrorButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Optimize ingredient handling with useCallback
  const handleIngredients = useCallback(() => {
    if (ingredients.trim()) {
      setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ingredients.trim()] }))
      setIng("")
    }
  }, [ingredients]);

  const removeIngredient = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }, []);

  const handleHowTo = useCallback(() => {
    if (howTo.trim()) {
      setFormData(prev => ({ ...prev, how_to: [...prev.how_to, howTo.trim()] }))
      setHowTo("")
    }
  }, [howTo]);

  const removeHowTo = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      how_to: prev.how_to.filter((_, i) => i !== index)
    }))
  }, []);

  // Optimize image picker with better error handling and memory management
  const pickImage = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Grant Permission', onPress: async () => {
                try {
                  const newPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!newPermission.granted) {
                    Alert.alert('Error', 'Camera roll permission is required to select images');
                    return;
                  }
                  pickImageFromLibrary();
                } catch (error) {
                  console.error('Permission error:', error);
                  Alert.alert('Error', 'Failed to get permissions');
                }
              }
            }
          ]
        );
        return;
      }

      pickImageFromLibrary();
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  }, []);

  const pickImageFromLibrary = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Slightly reduced for better performance
        exif: false, // Remove EXIF data to save memory
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];

        // Check file size to prevent memory issues
        if (selectedImage.fileSize && selectedImage.fileSize > 8 * 1024 * 1024) { // 8MB limit
          Alert.alert('Error', 'Image is too large. Please choose a smaller image (under 8MB).');
          return;
        }

        setFormData(prev => ({
          ...prev,
          image: {
            uri: selectedImage.uri,
            type: selectedImage.type || 'image/jpeg',
            name: selectedImage.fileName || `image_${Date.now()}.jpg`
          }
        }));

        Alert.alert("Success", "Image selected successfully!");
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Reduced for better performance
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setFormData(prev => ({
          ...prev,
          image: {
            uri: selectedImage.uri,
            type: 'image/jpeg',
            name: `photo_${Date.now()}.jpg`
          }
        }));

        Alert.alert("Success", "Photo taken successfully!");
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  }, []);

  // Optimize fetch data with better error handling
  const fetchData = useCallback(async () => {
    // Double-check authentication before making request
    if (!token || !isAuthenticated) {
      Alert.alert('Authentication Error', 'Please log in again to upload recipes');
      return;
    }

    setIsLoading(true);
    try {
      if (__DEV__) {
        console.log('Uploading recipe with token:', token ? 'Token exists' : 'No token');
      }
      
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      
      if (formData.image && formData.image.uri) {
        formDataToSend.append('image', {
          uri: formData.image.uri,
          type: 'image/jpeg',
          name: formData.image.name || `recipe_${Date.now()}.jpg`,
        }); 
      }
      
      formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
      formDataToSend.append('how_to', JSON.stringify(formData.how_to));

      if (__DEV__) {
        console.log('Making authenticated request to:', `https://recipe-app-rq23.vercel.app/api/recipe/add/${url}`);
      }

      const response = await fetch(`https://recipe-app-rq23.vercel.app/api/recipe/add/${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (__DEV__) {
        console.log('Response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (__DEV__) {
          console.log('Error response:', errorText);
        }
        
        // Handle different error types
        if (response.status === 401) {
          Alert.alert(
            'Authentication Error',
            'Your session has expired. Please log in again.',
            [
              { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]
          );
          return;
        }
        
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (__DEV__) {
        console.log('Upload successful:', data);
      }
      
      // Show success alert with navigation option
      Alert.alert(
        "Success", 
        "Recipe saved successfully! 🎉\n\nWould you like to view your recipes?",
        [
          {
            text: "Stay Here",
            style: "cancel",
            onPress: () => {
              // Reset form on success
              setFormData({
                title: "",
                image: null,
                ingredients: [],
                how_to: []
              });
              setUrl("");
            }
          },
          {
            text: "View Dashboard",
            onPress: () => {
              // Reset form and navigate
              setFormData({
                title: "",
                image: null,
                ingredients: [],
                how_to: []
              });
              setUrl("");
              navigation.navigate('User');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = "Upload failed. Please try again.";
      
      if (error.message.includes('Network request failed')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes('401')) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.message.includes('413')) {
        errorMessage = "File too large. Please choose a smaller image.";
      } else if (error.message.includes('400')) {
        errorMessage = "Invalid data. Please check all fields and try again.";
      }
      
      Alert.alert("Upload Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, formData, url, navigation]);

  // Memoize styles object to prevent recreation
  const dynamicStyles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: 'indigo'
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: 'indigo'
    },
    scrollContent: {
      flexGrow: 1,
      minHeight: screenHeight
    },
    header: {
      backgroundColor: 'indigo',
      paddingTop: Platform.OS === 'ios' ? hp(2) : hp(4),
      paddingBottom: hp(3),
      paddingHorizontal: wp(5),
      minHeight: hp(22)
    },
    headerContent: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerIcon: {
      fontSize: wp(12),
      marginBottom: hp(1)
    },
    headerTitle: {
      color: 'white',
      fontSize: wp(8),
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: hp(0.5)
    },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: wp(4),
      textAlign: 'center',
      fontWeight: '400',
      marginBottom: hp(1)
    },
    userGreeting: {
      color: 'rgba(255,255,255,0.95)',
      fontSize: wp(4.2),
      textAlign: 'center',
      fontWeight: '500',
      marginBottom: hp(2)
    },
    dashboardButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: wp(6),
      paddingVertical: hp(1.5),
      borderRadius: wp(6),
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
      marginTop: hp(1)
    },
    dashboardButtonIcon: {
      fontSize: wp(5),
      marginRight: wp(2)
    },
    dashboardButtonText: {
      color: 'white',
      fontSize: wp(4),
      fontWeight: '600'
    },
    container: {
      backgroundColor: 'white',
      paddingHorizontal: wp(5),
      paddingTop: hp(3),
      paddingBottom: hp(5),
      borderTopLeftRadius: wp(8),
      borderTopRightRadius: wp(8),
      minHeight: hp(75),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -5
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10
    },
    section: {
      marginBottom: hp(3)
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(1.5)
    },
    sectionIcon: {
      fontSize: wp(6),
      marginRight: wp(3)
    },
    sectionLabel: {
      fontSize: wp(5),
      fontWeight: '700',
      color: '#1e293b',
      flex: 1
    },
    inputWrapper: {
      backgroundColor: '#f8fafc',
      borderRadius: wp(4),
      borderWidth: 2,
      borderColor: '#e2e8f0',
      shadowColor: 'indigo',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    input: {
      fontSize: wp(4),
      color: '#1e293b',
      paddingVertical: hp(2),
      paddingHorizontal: wp(4),
      fontWeight: '500',
      minHeight: hp(6)
    },
    multilineInput: {
      minHeight: hp(10),
      textAlignVertical: 'top'
    }
  }), [wp, hp, screenHeight]);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="indigo" />
      <ScrollView
        style={dynamicStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
        removeClippedSubviews={true} // Optimize for performance
        maxToRenderPerBatch={10} // Reduce rendering batch size
      >
        {/* Header Section */}
        <View style={dynamicStyles.header}>
          <Animated.View style={[
            dynamicStyles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Text style={dynamicStyles.headerIcon}>👨‍🍳</Text>
            <Text style={dynamicStyles.headerTitle}>Create Recipe</Text>
            <Text style={dynamicStyles.headerSubtitle}>Share your culinary masterpiece</Text>
            <Text style={dynamicStyles.userGreeting}>Welcome, {user?.username}! 👋</Text>
            
            {/* Dashboard Navigation Button */}
            <TouchableOpacity 
              style={dynamicStyles.dashboardButton}
              onPress={() => navigation.navigate('User')}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.dashboardButtonIcon}>📊</Text>
              <Text style={dynamicStyles.dashboardButtonText}>My Dashboard</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View style={[
          dynamicStyles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>

          {/* Title Section */}
          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Text style={dynamicStyles.sectionIcon}>📝</Text>
              <Text style={dynamicStyles.sectionLabel}>Recipe Title</Text>
            </View>
            <View style={dynamicStyles.inputWrapper}>
              <TextInput
                style={dynamicStyles.input}
                placeholder='Enter your recipe name...'
                placeholderTextColor="#a0a8b8"
                value={formData.title}
                onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Text style={dynamicStyles.sectionIcon}>🍽️</Text>
              <Text style={dynamicStyles.sectionLabel}>Recipe Type</Text>
            </View>
            <View style={dynamicStyles.inputWrapper}>
              <RNPickerSelect
                onValueChange={(value) => setUrl(value)}
                items={[
                  { label: 'Breakfast', value: 'breakfast' },
                  { label: 'Lunch', value: 'lunch' },
                  { label: 'Snacks', value: 'snacks' },
                  { label: 'Dinner', value: 'dinner' },
                ]}
                placeholder={{ label: 'Select a meal type...', value: null }}
                style={styles.pickerSelectStyles}
                disabled={isLoading}
              />
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Text style={dynamicStyles.sectionIcon}>🥕</Text>
              <Text style={dynamicStyles.sectionLabel}>Ingredients</Text>
            </View>
            <View style={dynamicStyles.inputWrapper}>
              <TextInput
                style={dynamicStyles.input}
                placeholder='Add an ingredient...'
                placeholderTextColor="#a0a8b8"
                value={ingredients}
                onChangeText={setIng}
                returnKeyType="done"
                onSubmitEditing={handleIngredients}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity 
              onPress={handleIngredients} 
              style={[styles.addButton, isLoading && styles.disabledButton]} 
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.addButtonText}>+ Add Ingredient</Text>
            </TouchableOpacity>

            {formData.ingredients.length > 0 && (
              <View style={styles.listContainer}>
                {formData.ingredients.map((ingredient, index) => (
                  <Animated.View key={`ingredient-${index}`} style={styles.listItem}>
                    <View style={styles.listContent}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.listText} numberOfLines={2}>{ingredient}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeIngredient(index)}
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}
          </View>

          {/* Instructions Section */}
          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Text style={dynamicStyles.sectionIcon}>📋</Text>
              <Text style={dynamicStyles.sectionLabel}>Cooking Instructions</Text>
            </View>
            <View style={dynamicStyles.inputWrapper}>
              <TextInput
                style={[dynamicStyles.input, dynamicStyles.multilineInput]}
                placeholder='Describe the cooking step...'
                placeholderTextColor="#a0a8b8"
                value={howTo}
                onChangeText={setHowTo}
                multiline={true}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity 
              onPress={handleHowTo} 
              style={[styles.addButton, isLoading && styles.disabledButton]} 
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.addButtonText}>+ Add Step</Text>
            </TouchableOpacity>

            {formData.how_to.length > 0 && (
              <View style={styles.listContainer}>
                {formData.how_to.map((instruction, index) => (
                  <Animated.View key={`instruction-${index}`} style={styles.listItem}>
                    <View style={styles.listContent}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.listText}>{instruction}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeHowTo(index)}
                      activeOpacity={0.7}
                      disabled={isLoading}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}
          </View>

          {/* Image Section */}
          <View style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Text style={dynamicStyles.sectionIcon}>📸</Text>
              <Text style={dynamicStyles.sectionLabel}>Recipe Photo</Text>
            </View>

            {!formData.image ? (
              <View style={styles.imageUploadContainer}>
                <TouchableOpacity
                  style={[styles.imagePickerButton, isLoading && styles.disabledButton]}
                  onPress={pickImage}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <Text style={styles.imagePickerIcon}>🖼️</Text>
                  <Text style={styles.imagePickerText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: formData.image.uri }} 
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setFormData(prev => ({ ...prev, image: null }))}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <Text style={styles.removeImageText}>× Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons Container */}
          <View style={styles.actionButtonsContainer}>
            {/* Save Recipe Button */}
            <TouchableOpacity
              style={[
                styles.submitButton, 
                (isLoading || !token) && styles.disabledButton
              ]}
              onPress={() => {
                if (!formData.title.trim()) {
                  Alert.alert("Error", "Please enter a recipe title");
                  return;
                }
                if (!url) { 
                  Alert.alert("Error", "Please select a meal type");
                  return;
                }
                if (formData.ingredients.length === 0) {
                  Alert.alert("Error", "Please add at least one ingredient");
                  return;
                }
                if (formData.how_to.length === 0) {
                  Alert.alert("Error", "Please add cooking instructions");
                  return;
                }
                if (!formData.image) {
                  Alert.alert("Error", "Please select a recipe photo");
                  return;
                }

                fetchData();
              }}
              activeOpacity={0.8}
              disabled={isLoading || !token}
            >
              <Text style={styles.submitIcon}>
                {isLoading ? '⏳' : '🍽️'}
              </Text>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Uploading...' : 'Save Recipe'}
              </Text>
            </TouchableOpacity>

            {/* View Dashboard Button */}
            <TouchableOpacity
              style={[styles.dashboardNavButton, isLoading && styles.disabledButton]}
              onPress={() => navigation.navigate('User')}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.dashboardNavIcon}>📊</Text>
              <Text style={styles.dashboardNavButtonText}>View My Recipes</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Upload

const styles = StyleSheet.create({
  pickerSelectStyles: {
    inputIOS: {
      fontSize: 16,
      color: '#1e293b',
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontWeight: '500',
      minHeight: 48,
      backgroundColor: 'transparent',
    },
    inputAndroid: {
      fontSize: 14,
      color: '#1e293b',
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontWeight: '500',
      minHeight: 36,
      backgroundColor: 'transparent',
    },
    placeholder: {
      color: '#a0a8b8',
      fontSize: 16,
    }
  },
  addButton: {
    backgroundColor: 'indigo',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: 'indigo',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
  },
  listContainer: {
    marginTop: 16
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'indigo'
  },
  listContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'indigo',
    marginRight: 12,
    marginTop: 6
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'indigo',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2
  },
  stepNumberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '500'
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 2
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },
  imageUploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imagePickerButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'indigo',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: 'indigo',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  imagePickerIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  imagePickerText: {
    color: 'indigo',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center'
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 12
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  },
  selectedImage: {
    width: '100%',
    height: 200,
    minWidth: 280,
    maxWidth: 350
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700'
  },
  actionButtonsContainer: {
    marginTop: 16
  },
  submitButton: {
    backgroundColor: 'indigo',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12
  },
  submitIcon: {
    fontSize: 24,
    marginRight: 12
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
  },
  dashboardNavButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'indigo',
    shadowColor: 'indigo',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  dashboardNavIcon: {
    fontSize: 24,
    marginRight: 12
  },
  dashboardNavButtonText: {
    color: 'indigo',
    fontSize: 20,
    fontWeight: '700'
  },
  disabledButton: {
    opacity: 0.6
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f8fafc'
  },
  authErrorIcon: {
    fontSize: 80,
    marginBottom: 16
  },
  authErrorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center'
  },
  authErrorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24
  },
  authErrorButton: {
    backgroundColor: 'indigo',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20
  },
  authErrorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f8fafc'
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24
  },
  retryButton: {
    backgroundColor: 'indigo',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});