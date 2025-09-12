import { Background } from "@react-navigation/elements";

import { Image, ScrollView, Text, View, TouchableOpacity, Dimensions, Platform, StatusBar, SafeAreaView, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage) => {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
};

const hp = (percentage) => {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
};

const breakFast = require('../../assets/images/idli.jpg');
const lunch = require('../../assets/images/pongal.jpg');
const snacks = require('../../assets/images/semiya.jpg');
const dinner = require('../../assets/images/Dosa.jpg');

// Import router for navigation
import { router } from "expo-router";

export default function Recipe() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const categories = [
    {
      id: 1,
      name: 'Breakfast',
      image: breakFast,
      emoji: '🌅',
      gradient: ['#ff9a9e', '#fecfef'],
      description: 'Start your day right',
      count: '25+ recipes',
      time: 'Morning',
      route: '/Bk' // Direct route to component
    },
    {
      id: 2,
      name: 'Lunch',
      image: lunch,
      emoji: '☀️',
      gradient: ['#a8edea', '#fed6e3'],
      description: 'Hearty midday meals',
      count: '30+ recipes',
      time: 'Afternoon',
      route: '/Lunch'
    },
    {
      id: 3,
      name: 'Snacks',
      image: snacks,
      emoji: '🍿',
      gradient: ['#ffecd2', '#fcb69f'],
      description: 'Quick bites & treats',
      count: '20+ recipes',
      time: 'Anytime',
      route: '/Snacks'
    },
    {
      id: 4,
      name: 'Dinner',
      image: dinner,
      emoji: '🌙',
      gradient: ['#c471ed', '#f64f59'],
      description: 'End the day deliciously',
      count: '35+ recipes',
      time: 'Evening',
      route: '/Dinner'
    }
  ];

  const CategoryCard = ({ category, index }) => {
    const [pressed, setPressed] = useState(false);
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
              {
                scale: pressed ? 0.96 : 1,
              }
            ],
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => {
            try {
              console.log(`Navigating to: ${category.route}`);
              router.push(category.route);
            } catch (error) {
              console.error('Navigation error:', error);
              alert(`Navigation failed: ${error.message}`);
            }
          }}
          style={[
            styles.categoryCard,
            {
              marginTop: index >= 2 ? hp(2) : 0,
              marginRight: index % 2 === 0 ? wp(3) : 0,
            }
          ]}
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={category.gradient}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Content Container */}
            <View style={styles.cardContent}>
              {/* Header with Emoji and Count */}
              <View style={styles.cardHeader}>
                <View style={styles.emojiContainer}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{category.count}</Text>
                </View>
              </View>

              {/* Image Container */}
              <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                  <Image 
                    source={category.image} 
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Text Content */}
              <View style={styles.textContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryTime}>{category.time}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>

              {/* Explore Button */}
              <TouchableOpacity style={styles.exploreButton} activeOpacity={0.7}>
                <Text style={styles.exploreButtonText}>Explore</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Card Shadow */}
          <View style={styles.cardShadow} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="indigo" translucent={false} />
      
      {/* Main Background */}
      <View style={styles.mainBackground}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Header Section */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.mainEmoji}>🍽️</Text>
              <Text style={styles.title}>Recipe Explorer</Text>
              <Text style={styles.subtitle}>Discover amazing flavors for every meal</Text>
            </View>
            
            {/* Header Decoration */}
            <View style={styles.headerDecoration}>
              <View style={[styles.decorativeDot, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} />
              <View style={[styles.decorativeDot, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]} />
              <View style={[styles.decorativeDot, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />
            </View>
          </Animated.View>

          {/* Categories Grid */}
          <View style={styles.categoriesContainer}>
            <Animated.View 
              style={[
                styles.categoriesGrid,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                />
              ))}
            </Animated.View>
          </View>

          {/* Bottom Section */}
          <Animated.View 
            style={[
              styles.bottomSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.bottomText}>More categories coming soon!</Text>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: 'indigo', // Indigo background
  },
  mainBackground: {
    flex: 1,
    backgroundColor: 'indigo', // Indigo background
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
  },
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4),
    paddingBottom: hp(4),
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  mainEmoji: {
    fontSize: wp(12),
    marginBottom: hp(1.5),
  },
  title: {
    color: 'white',
    fontSize: wp(7.5),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: hp(1),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: wp(3.8),
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: wp(5.5),
    paddingHorizontal: wp(6),
  },
  headerDecoration: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  decorativeDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginHorizontal: wp(1),
  },
  categoriesContainer: {
    flex: 1,
    paddingVertical: hp(2),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: wp(44),
    height: hp(32),
    borderRadius: wp(5),
    marginBottom: hp(3),
    position: 'relative',
  },
  cardShadow: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    bottom: -6,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: wp(5),
    zIndex: -1,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: wp(5),
    padding: wp(4),
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  emojiContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp(3),
    padding: wp(2),
  },
  categoryEmoji: {
    fontSize: wp(6),
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1.2),
    borderRadius: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countText: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#4a5568',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: hp(1),
  },
  imageWrapper: {
    padding: wp(1),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp(12),
  },
  categoryImage: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(10),
  },
  textContent: {
    alignItems: 'center',
    marginVertical: hp(1),
  },
  categoryName: {
    fontSize: wp(4.5),
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: hp(0.3),
    textAlign: 'center',
  },
  categoryTime: {
    fontSize: wp(2.8),
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: hp(0.5),
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryDescription: {
    fontSize: wp(3),
    color: '#4a5568',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: wp(4),
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonText: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#4a5568',
    marginRight: wp(2),
  },
  arrowContainer: {
    backgroundColor: 'indigo',
    borderRadius: wp(2),
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.5),
  },
  arrowIcon: {
    fontSize: wp(3),
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSection: {
    alignItems: 'center',
    paddingVertical: hp(3),
  },
  bottomText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: wp(3.2),
    fontWeight: '500',
  },
  bottomSpacing: {
    height: hp(4),
  },
};