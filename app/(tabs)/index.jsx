import { useAuthStore } from '@/store/auth'
import React, { useState } from 'react'

import { 
  Dimensions, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  StatusBar, 
  SafeAreaView,
  ScrollView,
  Platform 
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import idli from '@/assets/images/idli.jpg'
import dosa from '@/assets/images/Dosa.jpg'
import upma from '@/assets/images/upma.jpg'
import semiya from '@/assets/images/semiya.jpg'
import poori from '@/assets/images/poori.jpg'
import pongal from '@/assets/images/pongal.jpg'
import Brk from '../(components)/Bk'
import Lunch from '../(components)/Lunch'
import Snacks from '../(components)/Snacks'
import Dinner from '../(components)/Dinner'
import Idli from '../(components)/Idli'
import Dosa from '../(components)/Dosa'
import Poori from '../(components)/Poori'
import Pongal from '../(components)/Pongal'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling
const scale = screenWidth / 375;
const scaleFont = (size) => Math.round(size * scale);
const scaleSize = (size) => Math.round(size * scale);

export default function index() {
  const { logout } = useAuthStore()
  const [currentView, setCurrentView] = useState('home')
  const [searchText, setSearchText] = useState('')

  const viewsData = [
    { id: 1, title: 'BreakFast', content: 'Start your day', color: '#FF6B6B', component: 'breakfast', img: idli },
    { id: 2, title: 'Lunch', content: 'Midday meals', color: '#4ECDC4', component: 'lunch', img: dosa },
    { id: 3, title: 'Snacks', content: 'Quick bites', color: '#45B7D1', component: 'snacks', img: semiya },
    { id: 4, title: 'Dinner', content: 'Evening food', color: '#96CEB4', component: 'dinner', img: upma },
  ];

  const viewsData2 = [
    { id: 1, title: 'Idli Special', content: 'Fluffy steamed cakes', color: '#FF6B6B', component: 'idli', img: idli, rating: '4.8' },
    { id: 2, title: 'Crispy Dosa', content: 'Golden brown perfection', color: '#4ECDC4', component: 'dosa', img: dosa, rating: '4.9' },
    { id: 5, title: 'Fluffy Poori', content: 'Deep-fried delight', color: '#FFEAA7', component: 'poori', img: poori, rating: '4.5' },
    { id: 6, title: 'Warm Pongal', content: 'Hearty rice dish', color: '#DDA0DD', component: 'pongal', img: pongal, rating: '4.8' },
  ];

     // Add this function to your Index component
    const clearStorageAndRelogin = async () => {
        try {
            await AsyncStorage.clear();
            await logout();
            console.log('Storage cleared');
            // Navigate to login screen
        } catch (error) {
            console.error('Clear storage error:', error);
        }
    };

  const handleNavigation = (item) => {
    if (item.component === 'breakfast') {
      setCurrentView('breakfast')
    } else if (item.component === 'lunch') {
      setCurrentView('lunch')
    } else if (item.component === 'snacks') {
      setCurrentView('snacks')
    } else if (item.component === 'dinner') {
      setCurrentView('dinner')
    } else if (item.component === 'idli') {
      setCurrentView('idli')
    } else if (item.component === 'dosa') {
      setCurrentView('dosa')
    } else if (item.component === 'semiya') {
      setCurrentView('semiya')
    } else if (item.component === 'upma') {
      setCurrentView('upma')
    } else if (item.component === 'poori') {
      setCurrentView('poori')
    } else if (item.component === 'pongal') {
      setCurrentView('pongal')
    } else if (item.link) {
      router.push(item.link)
    }
  }

  const renderView = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.viewCard}
        onPress={() => handleNavigation(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.img}
            style={styles.circularImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.viewTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.viewSubtitle} numberOfLines={2}>{item.content}</Text>
      </TouchableOpacity>
    )
  }

  const renderFood = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.squareCard}
        onPress={() => handleNavigation(item)}
        activeOpacity={0.8}
      >
        <View style={styles.squareImageContainer}>
          <Image
            source={item.img}
            style={styles.squareImage}
            resizeMode="cover"
          />
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={scaleSize(12)} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.squareTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.squareSubtitle} numberOfLines={2}>{item.content}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Component views remain the same but with improved back button
  const renderComponentView = (Component, title) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="indigo" />
      <View style={styles.backHeader}>
        <TouchableOpacity 
          onPress={() => setCurrentView('home')}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={scaleSize(20)} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {title && <Text style={styles.backTitle}>{title}</Text>}
      </View>
      <Component />
    </SafeAreaView>
  )

  // Show components when selected
  if (currentView === 'breakfast') return renderComponentView(Brk, 'Breakfast');
  if (currentView === 'lunch') return renderComponentView(Lunch, 'Lunch');
  if (currentView === 'snacks') return renderComponentView(Snacks, 'Snacks');
  if (currentView === 'dinner') return renderComponentView(Dinner, 'Dinner');
  if (currentView === 'idli') return renderComponentView(Idli, 'Idli Special');
  if (currentView === 'dosa') return renderComponentView(Dosa, 'Crispy Dosa');
  if (currentView === 'poori') return renderComponentView(Poori, 'Fluffy Poori');
  if (currentView === 'pongal') return renderComponentView(Pongal, 'Warm Pongal');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="indigo" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerText}>Delicious Journey</Text>
              <Text style={styles.headerSubtext}>Discover amazing flavors</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={logout}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="person-circle" size={scaleSize(32)} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={scaleSize(18)} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder='Search dishes...'
              style={styles.searchInput}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={scaleSize(18)} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={viewsData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderView}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: scaleSize(10) }} />}
        />

        {/* Popular Dishes Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Dishes</Text>
          <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={viewsData2}
          renderItem={renderFood}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.verticalList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false} // Disable since we're inside ScrollView
        />
        <TouchableOpacity
                onPress={clearStorageAndRelogin}
                style={{ backgroundColor: 'orange', padding: 10, margin: 5 }}
            >
                <Text style={{ color: 'white' }}>Clear & Relogin</Text>
            </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'indigo',
  },
  scrollView: {
    flex: 1,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    paddingBottom: scaleSize(10),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: scaleFont(16),
    fontWeight: '500',
    marginLeft: scaleSize(5),
  },
  backTitle: {
    color: 'white',
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: scaleSize(20),
    paddingBottom: scaleSize(20),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: scaleSize(10),
  },
  headerText: {
    color: 'white',
    fontSize: scaleFont(26),
    fontWeight: 'bold',
  },
  headerSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: scaleFont(14),
    marginTop: scaleSize(4),
  },
  profileButton: {
    padding: scaleSize(4),
  },
  searchContainer: {
    paddingHorizontal: scaleSize(20),
    marginBottom: scaleSize(20),
  },
  searchBox: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaleSize(20),
    paddingHorizontal: scaleSize(16),
    paddingVertical: scaleSize(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: scaleSize(10),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(15),
    color: '#333',
    height: scaleSize(20),
    paddingVertical: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
    marginBottom: scaleSize(15),
    marginTop: scaleSize(10),
  },
  sectionTitle: {
    color: 'white',
    fontSize: scaleFont(20),
    fontWeight: 'bold',
  },
  seeAllText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: scaleFont(13),
    fontWeight: '500',
  },
  horizontalList: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(10),
    paddingBottom: scaleSize(10),
  },
  
  // Categories Cards
  viewCard: {
    backgroundColor: 'white',
    width: scaleSize(120),
    borderRadius: scaleSize(15),
    padding: scaleSize(12),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    width: scaleSize(65),
    height: scaleSize(65),
    borderRadius: scaleSize(32),
    overflow: 'hidden',
    marginBottom: scaleSize(8),
  },
  circularImage: {
    width: '100%',
    height: '100%',
  },
  viewTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: scaleSize(2),
  },
  viewSubtitle: {
    fontSize: scaleFont(11),
    color: '#666',
    textAlign: 'center',
    lineHeight: scaleFont(14),
  },

  // Popular Dishes
  verticalList: {
    paddingHorizontal: scaleSize(20),
    paddingBottom: scaleSize(30),
  },
  row: {
    justifyContent: 'space-between',
  },
  squareCard: {
    backgroundColor: 'white',
    width: (screenWidth - scaleSize(50)) / 2,
    marginBottom: scaleSize(15),
    borderRadius: scaleSize(15),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  squareImageContainer: {
    width: '100%',
    height: scaleSize(100),
    position: 'relative',
  },
  squareImage: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    position: 'absolute',
    top: scaleSize(8),
    right: scaleSize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: scaleSize(10),
    paddingHorizontal: scaleSize(6),
    paddingVertical: scaleSize(3),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ratingText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
    color: '#333',
    marginLeft: scaleSize(2),
  },
  cardContent: {
    padding: scaleSize(10),
  },
  squareTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: scaleSize(3),
  },
  squareSubtitle: {
    fontSize: scaleFont(11),
    color: '#666',
    lineHeight: scaleFont(14),
  },
})