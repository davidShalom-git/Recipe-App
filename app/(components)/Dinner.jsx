import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { ScrollView, Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import breakfast from '../../assets/images/idli.jpg'
import { router } from "expo-router";

const { width } = Dimensions.get('window');

export default function Dinner() {

    const [dinnerRecipes, setDinnerRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDinnerRecipes = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch('https://recipe-app-rq23.vercel.app/api/recipe/all/dinner')
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()
            console.log('Fetched dinner recipes:', data) // Debug log
            setDinnerRecipes(data)

        } catch (error) {
            console.error('Error fetching dinner recipes:', error);
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Call the fetch function when component mounts
    useEffect(() => {
        fetchDinnerRecipes()
    }, [])

    const renderView = ({ item, index }) => {
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => router.push(`/recipe/dinner/${item._id}`)}>
                    <Image 
                        source={item.image ? { uri: item.image } : breakfast} 
                        style={styles.image} 
                    />
                    <Text style={styles.text}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (loading) {
        return (
            <View style={{ backgroundColor: "indigo", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Loading dinner recipes...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={{ backgroundColor: "indigo", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', margin: 20 }}>
                    Error loading recipes: {error}
                </Text>
                <TouchableOpacity onPress={fetchDinnerRecipes} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ backgroundColor: "indigo", flex: 1 }}>
            <Text style={{ 
                color: 'white', 
                fontSize: 30, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                marginVertical: 50 
            }}>
                Dinner Recipes
            </Text>

            <FlatList
                key="two-columns"
                numColumns={2}
                showsVerticalScrollIndicator={true}
                data={dinnerRecipes}
                renderItem={renderView}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.flatListContainer}
                columnWrapperStyle={styles.row}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    flatListContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        width: (width - 56) / 2, // Calculate exact width: total width - (padding + margin)
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5, // for Android shadow
        alignItems: 'center',
    },
    image: {
        height: 120,
        width: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    retryText: {
        color: 'indigo',
        fontWeight: 'bold',
    },
});