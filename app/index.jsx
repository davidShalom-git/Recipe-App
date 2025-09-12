import { 
    Alert, 
    KeyboardAvoidingView, 
    Platform, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Dimensions,
    ScrollView,
    StatusBar
} from "react-native";
import { Image } from "expo-image";
import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const recepie = require('@/assets/images/Cooking-Recipe.png')
const { width, height } = Dimensions.get('window');

// Responsive scaling
const scale = width / 375; // Based on iPhone X width
const scaleFont = (size) => Math.round(size * scale);
const scaleSize = (size) => Math.round(size * scale);

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const { Login } = useAuthStore();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

   // Updated handleSubmit function for your Login component
const handleSubmit = async () => {
    if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return;
    }
    if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
    }
    if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
    }

    setIsLoading(true);
    try {
        const result = await Login(email.trim(), password);
        console.log('Login result:', result);
        
        if (result && result.success) {
            // Login successful - you might want to navigate here
            Alert.alert('Success', 'Login successful!');
            console.log('User logged in:', result.user);
            // Example: navigation.navigate('Home') or router.push('/home')
        } else {
            // Login failed
            const errorMessage = result?.message || 'Login failed. Please try again.';
            Alert.alert('Login Error', errorMessage);
        }
    } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
        console.error('Login error:', error);
    } finally {
        setIsLoading(false);
    }
}

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <StatusBar barStyle="light-content" backgroundColor="indigo" />
            <View style={styles.indigoBackground}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={recepie}
                                alt="Recipe cooking illustration"
                                style={styles.headerImage}
                                contentFit="contain"
                            />
                        </View>
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <Text style={styles.subtitleText}>Sign in to continue cooking</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.title}>Login</Text>
                            <View style={styles.titleUnderline} />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>
                                <Ionicons name="mail-outline" size={scaleSize(16)} color="#666" /> Email
                            </Text>
                            <View style={[
                                styles.inputContainer,
                                emailFocused && styles.inputContainerFocused,
                                !validateEmail(email) && email.length > 0 && styles.inputContainerError
                            ]}>
                                <Ionicons 
                                    name="mail-outline" 
                                    size={scaleSize(20)} 
                                    color={emailFocused ? "indigo" : "#999"} 
                                    style={styles.inputIcon} 
                                />
                                <TextInput
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                    placeholderTextColor="#999"
                                    returnKeyType="next"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>
                                <Ionicons name="lock-closed-outline" size={scaleSize(16)} color="#666" /> Password
                            </Text>
                            <View style={[
                                styles.inputContainer,
                                passwordFocused && styles.inputContainerFocused
                            ]}>
                                <Ionicons 
                                    name="lock-closed-outline" 
                                    size={scaleSize(20)} 
                                    color={passwordFocused ? "indigo" : "#999"} 
                                    style={styles.inputIcon} 
                                />
                                <TextInput
                                    placeholder="Enter your password"
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                    placeholderTextColor="#999"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={togglePasswordVisibility}
                                    disabled={isLoading}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={scaleSize(20)}
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isLoading ? ['#ccc', '#aaa'] : ['indigo', 'indigo']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.loginButtonGradient}
                            >
                                {isLoading && (
                                    <Ionicons 
                                        name="refresh-outline" 
                                        size={scaleSize(20)} 
                                        color="white" 
                                        style={styles.loadingIcon} 
                                    />
                                )}
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Link href='/(auth)/Signup' style={styles.signupLink}>
                                <Text style={styles.signupLinkText}>Sign Up</Text>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indigoBackground: {
        flex: 1,
        backgroundColor: 'indigo',
    },
    scrollContainer: {
        flexGrow: 1,
        minHeight: height,
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: scaleSize(20),
        paddingHorizontal: scaleSize(20),
    },
    imageContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: scaleSize(80),
        padding: scaleSize(15),
        marginBottom: scaleSize(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    headerImage: {
        width: scaleSize(120),
        height: scaleSize(120),
    },
    welcomeText: {
        fontSize: scaleFont(26),
        fontWeight: '700',
        color: 'white',
        marginBottom: scaleSize(5),
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: scaleFont(15),
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: scaleSize(30),
        borderTopRightRadius: scaleSize(30),
        paddingHorizontal: scaleSize(25),
        paddingTop: scaleSize(30),
        paddingBottom: scaleSize(30),
        marginTop: scaleSize(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: scaleSize(30),
    },
    title: {
        fontSize: scaleFont(22),
        fontWeight: '700',
        color: '#333',
        marginBottom: scaleSize(8),
    },
    titleUnderline: {
        width: scaleSize(40),
        height: scaleSize(3),
        backgroundColor: 'indigo',
        borderRadius: scaleSize(2),
    },
    inputWrapper: {
        marginBottom: scaleSize(20),
    },
    label: {
        fontSize: scaleFont(13),
        fontWeight: '600',
        color: '#666',
        marginBottom: scaleSize(6),
        marginLeft: scaleSize(3),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: scaleSize(12),
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: scaleSize(12),
        height: scaleSize(50),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    inputContainerFocused: {
        borderColor: 'indigo',
        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    inputContainerError: {
        borderColor: '#dc3545',
    },
    inputIcon: {
        marginRight: scaleSize(10),
    },
    input: {
        flex: 1,
        fontSize: scaleFont(15),
        color: '#333',
        height: '100%',
        paddingVertical: 0, // Important for Android
    },
    eyeIcon: {
        padding: scaleSize(5),
        marginLeft: scaleSize(8),
    },
    loginButton: {
        marginTop: scaleSize(8),
        marginBottom: scaleSize(20),
        borderRadius: scaleSize(12),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: 'indigo',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    loginButtonDisabled: {
        ...Platform.select({
            ios: {
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    loginButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scaleSize(16),
        paddingHorizontal: scaleSize(30),
        minHeight: scaleSize(50),
    },
    loadingIcon: {
        marginRight: scaleSize(8),
    },
    loginButtonText: {
        color: 'white',
        fontSize: scaleFont(16),
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scaleSize(25),
        flexWrap: 'wrap',
    },
    signupText: {
        fontSize: scaleFont(13),
        color: '#666',
    },
    signupLink: {
        marginLeft: scaleSize(2),
    },
    signupLinkText: {
        color: 'indigo',
        fontWeight: '600',
        fontSize: scaleFont(13),
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scaleSize(20),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e9ecef',
    },
    dividerText: {
        marginHorizontal: scaleSize(15),
        fontSize: scaleFont(13),
        color: '#999',
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scaleSize(15),
        marginBottom: scaleSize(10),
    },
    socialButton: {
        width: scaleSize(45),
        height: scaleSize(45),
        borderRadius: scaleSize(22),
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 1,
            },
        }),
    },
});