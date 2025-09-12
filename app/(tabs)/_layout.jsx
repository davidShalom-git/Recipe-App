import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'indigo',
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          marginBottom: 30,
          borderRadius: 40,
          marginLeft: 20,
          marginRight: 20,
          height: 60,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
        }
      }}
    >

      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='home' size={24} color={color} />,
          title: 'Home'
        }}

      />

      <Tabs.Screen
        name='Recipe'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='restaurant' size={24} color={color} />,
          title: 'Recipes'
        }}

      />
      <Tabs.Screen
        name='Upload'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='cloud' size={24} color={color} />,
          title: 'Upload'
        }}

      />

      <Tabs.Screen
        name='User'
        options={{
          tabBarIcon: ({ color }) => <Ionicons name='person' size={24} color={color} />,
          title: 'User'
        }}
      />


    </Tabs>
  )
}