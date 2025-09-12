import { useState } from "react";
import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import { food } from '@/assets/data/breakfast';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Idli(){
    
     const idliData = food ? food.filter(item => item.Title === 'Poori') : [];
    
      const renderItem = ({ item, index }) => {
        return (
          <LinearGradient
            colors={['indigo', 'indigo']}
            style={styles.container}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>{item.Title}</Text>
              <View style={styles.titleUnderline} />
            </View>
    
            {/* Image Section */}
            <View style={styles.imageContainer}>
              <Image source={item.Image} style={styles.image} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>Traditional South Indian</Text>
              </View>
            </View>
    
            {/* Content Section */}
            <View style={styles.contentContainer}>
              
              {/* Ingredients Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🥄</Text>
                  </View>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                </View>
                
                <View style={styles.card}>
                  {item.Ingredients.map((ingredient, idx) => (
                    <View key={idx} style={styles.ingredientItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.ingredientText}>
                        {ingredient.replace(/^\d+\.\s*-\s*/, '')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
    
              {/* Instructions Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>👨‍🍳</Text>
                  </View>
                  <Text style={styles.sectionTitle}>How to Make</Text>
                </View>
                
                <View style={styles.card}>
                  {item.How_to.map((step, idx) => (
                    <View key={idx} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>
                        {step.replace(/^\d+\.\s*-\s*/, '')}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
    
              {/* Bottom Decoration */}
              <View style={styles.bottomDecoration}>
                <Text style={styles.decorationText}>✨ Enjoy your homemade Idli! ✨</Text>
              </View>
            </View>
          </LinearGradient>
        );
      }
    
      return (
        <FlatList
          data={idliData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />
      );
    
}

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#FFD700',
    marginTop: 8,
    borderRadius: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  image: {
    width: width * 0.8,
    height: 250,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  imageOverlayText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    backgroundColor: '#667eea',
    borderRadius: 4,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#667eea',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  bottomDecoration: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  decorationText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});