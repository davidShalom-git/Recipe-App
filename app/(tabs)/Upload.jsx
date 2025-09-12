import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { Alert, Animated, Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useAuthStore } from '@/store/auth'; // Import auth store

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const wp = (percentage) => {
  const value = (percentage * screenWidth) / 100
  return Math.round(value)
}

const hp = (percentage) => {
  const value = (percentage * screenHeight) / 100
  return Math.round(value)
}

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
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Debug authentication state
  useEffect(() => {
    console.log('Upload component - Auth state:', {
      hasToken: !!token,
      isAuthenticated,
      username: user?.username,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    });
  }, [token, isAuthenticated, user]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

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

  const handleIngredients = () => {
    if (ingredients.trim()) {
      setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ingredients.trim()] }))
      setIng("")
    }
  }

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleHowTo = () => {
    if (howTo.trim()) {
      setFormData(prev => ({ ...prev, how_to: [...prev.how_to, howTo.trim()] }))
      setHowTo("")
    }
  }

  const removeHowTo = (index) => {
    setFormData(prev => ({
      ...prev,
      how_to: prev.how_to.filter((_, i) => i !== index)
    }))
  }

  const pickImage = async () => {
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
                const newPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!newPermission.granted) {
                  Alert.alert('Error', 'Camera roll permission is required to select images');
                  return;
                }
                pickImageFromLibrary();
              }
            }
          ]
        );
        return;
      }

      pickImageFromLibrary();
    } catch (error) {
      console.log('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  }

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];

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
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
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
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  }

  const fetchData = async () => {
    // Double-check authentication before making request
    if (!token || !isAuthenticated) {
      Alert.alert('Authentication Error', 'Please log in again to upload recipes');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Uploading recipe with token:', token ? 'Token exists' : 'No token');
      
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

      console.log('Making authenticated request to:', `https://recipe-app-rq23.vercel.app/api/recipe/add/${url}`);

      const response = await fetch(`https://recipe-app-rq23.vercel.app/api/recipe/add/${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Add authentication header
        },
        body: formDataToSend,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
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
      console.log('Upload successful:', data);
      
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="indigo" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Animated.View style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Text style={styles.headerIcon}>👨‍🍳</Text>
            <Text style={styles.headerTitle}>Create Recipe</Text>
            <Text style={styles.headerSubtitle}>Share your culinary masterpiece</Text>
            <Text style={styles.userGreeting}>Welcome, {user?.username}! 👋</Text>
            
            {/* Dashboard Navigation Button */}
            <TouchableOpacity 
              style={styles.dashboardButton}
              onPress={() => navigation.navigate('User')}
              activeOpacity={0.8}
            >
              <Text style={styles.dashboardButtonIcon}>📊</Text>
              <Text style={styles.dashboardButtonText}>My Dashboard</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>

          {/* Title Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionLabel}>Recipe Title</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder='Enter your recipe name...'
                placeholderTextColor="#a0a8b8"
                value={formData.title}
                onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🍽️</Text>
              <Text style={styles.sectionLabel}>Recipe Type</Text>
            </View>
            <View style={styles.inputWrapper}>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🥕</Text>
              <Text style={styles.sectionLabel}>Ingredients</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
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
                  <Animated.View key={index} style={styles.listItem}>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionLabel}>Cooking Instructions</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
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
                  <Animated.View key={index} style={styles.listItem}>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📸</Text>
              <Text style={styles.sectionLabel}>Recipe Photo</Text>
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
                  <Image source={{ uri: formData.image.uri }} style={styles.selectedImage} />
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
  
  pickerSelectStyles: {
    inputIOS: {
      fontSize: wp(4),
      color: '#1e293b',
      paddingVertical: hp(0.5),
      paddingHorizontal: wp(4),
      fontWeight: '500',
      minHeight: hp(6),
      backgroundColor: 'transparent',
    },
    inputAndroid: {
      fontSize: wp(3.5),
      color: '#1e293b',
      paddingVertical: hp(0.5),
      paddingHorizontal: wp(2),
      fontWeight: '500',
      minHeight: hp(4.5),
      backgroundColor: 'transparent',
    },
    placeholder: {
      color: '#a0a8b8',
      fontSize: wp(4),
    }
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
  },
  addButton: {
    backgroundColor: 'indigo',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(6),
    borderRadius: wp(4),
    alignItems: 'center',
    marginTop: hp(1.5),
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
    fontSize: wp(4)
  },
  listContainer: {
    marginTop: hp(2)
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(1),
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
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: 'indigo',
    marginRight: wp(3),
    marginTop: hp(0.8)
  },
  stepNumber: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: 'indigo',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    marginTop: hp(0.2)
  },
  stepNumberText: {
    color: 'white',
    fontWeight: '700',
    fontSize: wp(3.5)
  },
  listText: {
    flex: 1,
    fontSize: wp(3.8),
    color: '#334155',
    lineHeight: wp(5.5),
    fontWeight: '500'
  },
  removeButton: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
    marginTop: hp(0.2)
  },
  removeButtonText: {
    color: 'white',
    fontSize: wp(4.5),
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
    borderRadius: wp(4),
    paddingVertical: hp(3),
    alignItems: 'center',
    marginRight: wp(2),
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
    fontSize: wp(8),
    marginBottom: hp(1)
  },
  imagePickerText: {
    color: 'indigo',
    fontSize: wp(3.8),
    fontWeight: '600',
    textAlign: 'center'
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: hp(1.5)
  },
  imageWrapper: {
    borderRadius: wp(4),
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
    width: wp(80),
    height: hp(25),
    resizeMode: 'cover'
  },
  removeImageButton: {
    position: 'absolute',
    top: wp(3),
    right: wp(3),
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderRadius: wp(5)
  },
  removeImageText: {
    color: 'white',
    fontSize: wp(3.5),
    fontWeight: '700'
  },
  actionButtonsContainer: {
    marginTop: hp(2)
  },
  submitButton: {
    backgroundColor: 'indigo',
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(8),
    borderRadius: wp(5),
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
    marginBottom: hp(1.5)
  },
  submitIcon: {
    fontSize: wp(6),
    marginRight: wp(3)
  },
  submitButtonText: {
    color: 'white',
    fontSize: wp(5),
    fontWeight: '700'
  },
  dashboardNavButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(8),
    borderRadius: wp(5),
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
    fontSize: wp(6),
    marginRight: wp(3)
  },
  dashboardNavButtonText: {
    color: 'indigo',
    fontSize: wp(5),
    fontWeight: '700'
  },
  disabledButton: {
    opacity: 0.6
  },
  authErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    backgroundColor: '#f8fafc'
  },
  authErrorIcon: {
    fontSize: wp(20),
    marginBottom: hp(2)
  },
  authErrorTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: hp(1),
    textAlign: 'center'
  },
  authErrorText: {
    fontSize: wp(4),
    color: '#64748b',
    textAlign: 'center',
    marginBottom: hp(3)
  },
  authErrorButton: {
    backgroundColor: 'indigo',
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(5)
  },
  authErrorButtonText: {
    color: 'white',
    fontSize: wp(4),
    fontWeight: '600'
  }
})
