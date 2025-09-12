import { useAuthStore } from "@/store/auth";
import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";


export default function Index() {
    const { user, token, checkAuth, logout } = useAuthStore();
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        checkAuth();
    }, []);

 

    // Add this button to your Index component

    const debugAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            setDebugInfo({
                storeToken: token ? token.substring(0, 30) + '...' : 'null',
                storedToken: storedToken ? storedToken.substring(0, 30) + '...' : 'null',
                storeUser: user?.username || 'null',
                storedUser: storedUser ? JSON.parse(storedUser).username : 'null',
                tokenLength: token?.length || 0,
                storedTokenLength: storedToken?.length || 0
            });
        } catch (error) {
            console.error('Debug error:', error);
        }
    };

    const testAPI = async () => {
        try {
            console.log('Testing API with token:', token ? 'Token exists' : 'No token');

            const response = await fetch('http://192.168.18.58:4000/api/recipe/breakfast/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('API Test Response Status:', response.status);
            const data = await response.json();
            console.log('API Test Response:', data);
        } catch (error) {
            console.error('API Test Error:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Welcome to the App</Text>
            <Text>User: {user?.username || 'Not logged in'}</Text>
            <Text>Token exists: {token ? 'Yes' : 'No'}</Text>

            <TouchableOpacity
                onPress={debugAuth}
                style={{ backgroundColor: 'blue', padding: 10, margin: 5 }}
            >
                <Text style={{ color: 'white' }}>Debug Auth</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={testAPI}
                style={{ backgroundColor: 'green', padding: 10, margin: 5 }}
            >
                <Text style={{ color: 'white' }}>Test API</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={logout}
                style={{ backgroundColor: 'red', padding: 10, margin: 5 }}
            >
                <Text style={{ color: 'white' }}>Logout</Text>
            </TouchableOpacity>

            {/* Debug Info Display */}
            {Object.keys(debugInfo).length > 0 && (
                <View style={{ backgroundColor: '#f0f0f0', padding: 10, margin: 10 }}>
                    <Text>Debug Info:</Text>
                    {Object.entries(debugInfo).map(([key, value]) => (
                        <Text key={key}>{key}: {value}</Text>
                    ))}
                </View>
            )}
           

        </View>
    );
}
