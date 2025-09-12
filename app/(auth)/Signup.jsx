import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Label } from "@react-navigation/elements";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const recepie = require('@/assets/images/Cooking-Recipe.png')
const { width } = Dimensions.get('window');

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
        email: false,
        username: false,
        password: false,
    });

    const { register } = useAuthStore(); 

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const setFieldFocus = (field, focused) => {
        setFocusedFields(prev => ({ ...prev, [field]: focused }));
    };

    const handleSubmit = async () => {
        const { email, username, password } = formData;

        // Enhanced Validation
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }
        if (username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters long');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter a password');
            return;
        }

        setIsLoading(true);
        try {
            const result = await register(username.trim(), email.trim(), password);
            
            if (result && result.success) {
                Alert.alert('Success', 'Account created successfully!');
            } else {
                const errorMessage = result?.message || 'Something went wrong. Please try again.';
                Alert.alert('Sign Up Failed', errorMessage);
            }
        } catch (error) {
            console.error('Sign up error:', error);
            
            let errorMessage = 'Something went wrong. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.indigoBackground}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.innerContainer}>
                        {/* Header Section */}
                        <View style={styles.headerSection}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={recepie}
                                    alt="Recipe cooking illustration"
                                    style={styles.headerImage}
                                />
                            </View>
                            <Text style={styles.welcomeText}>Join Our Community!</Text>
                            <Text style={styles.subtitleText}>Create account to start cooking</Text>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formContainer}>
                            <View style={styles.formHeader}>
                                <Text style={styles.title}>Sign Up</Text>
                                <View style={styles.titleUnderline} />
                            </View>

                            {/* Username Input */}
                            <View style={styles.inputWrapper}>
                                <Label style={styles.label}>
                                    <Ionicons name="at-outline" size={16} color="#666" /> Username
                                </Label>
                                <View style={[
                                    styles.inputContainer,
                                    focusedFields.username && styles.inputContainerFocused,
                                    formData.username.length > 0 && formData.username.length < 3 && styles.inputContainerError
                                ]}>
                                    <Ionicons name="at-outline" size={20} color={focusedFields.username ? "indigo" : "#999"} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Choose a username"
                                        style={styles.input}
                                        value={formData.username}
                                        onChangeText={(value) => updateFormData('username', value.toLowerCase().replace(/\s/g, ''))}
                                        onFocus={() => setFieldFocus('username', true)}
                                        onBlur={() => setFieldFocus('username', false)}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                                {formData.username.length > 0 && formData.username.length < 3 && (
                                    <Text style={styles.errorText}>Username must be at least 3 characters</Text>
                                )}
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <Label style={styles.label}>
                                    <Ionicons name="mail-outline" size={16} color="#666" /> Email
                                </Label>
                                <View style={[
                                    styles.inputContainer,
                                    focusedFields.email && styles.inputContainerFocused,
                                    !validateEmail(formData.email) && formData.email.length > 0 && styles.inputContainerError
                                ]}>
                                    <Ionicons name="mail-outline" size={20} color={focusedFields.email ? "indigo" : "#999"} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Enter your email"
                                        style={styles.input}
                                        value={formData.email}
                                        onChangeText={(value) => updateFormData('email', value)}
                                        onFocus={() => setFieldFocus('email', true)}
                                        onBlur={() => setFieldFocus('email', false)}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                        placeholderTextColor="#999"
                                    />
                                </View>
                                {!validateEmail(formData.email) && formData.email.length > 0 && (
                                    <Text style={styles.errorText}>Please enter a valid email address</Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <Label style={styles.label}>
                                    <Ionicons name="lock-closed-outline" size={16} color="#666" /> Password
                                </Label>
                                <View style={[
                                    styles.inputContainer,
                                    focusedFields.password && styles.inputContainerFocused,
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={20} color={focusedFields.password ? "indigo" : "#999"} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Create a strong password"
                                        style={styles.input}
                                        value={formData.password}
                                        onChangeText={(value) => updateFormData('password', value)}
                                        onFocus={() => setFieldFocus('password', true)}
                                        onBlur={() => setFieldFocus('password', false)}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isLoading}
                                        placeholderTextColor="#999"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={togglePasswordVisibility}
                                        disabled={isLoading}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#999"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isLoading ? ['#ccc', '#aaa'] : ['indigo', 'indigo']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.signUpButtonGradient}
                                >
                                    {isLoading && <Ionicons name="refresh-outline" size={20} color="white" style={styles.loadingIcon} />}
                                    <Text style={styles.signUpButtonText}>
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <Link href='/(auth)/Login' style={styles.loginLink}>
                                    <Text style={styles.loginLinkText}>Sign In</Text>
                                </Link>
                            </View>
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
    scrollView: {
        flex: 1,
    },
    innerContainer: {
        minHeight: '100%',
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
    },
    imageContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 80,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    headerImage: {
        width: 120,
        height: 120,
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '700',
        color: 'white',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 30,
        paddingTop: 35,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        minHeight: 700,
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    titleUnderline: {
        width: 50,
        height: 3,
        backgroundColor: 'indigo',
        borderRadius: 2,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        marginLeft: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,
        height: 55,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inputContainerFocused: {
        borderColor: 'indigo',
        backgroundColor: '#fff',
        shadowOpacity: 0.1,
        elevation: 5,
    },
    inputContainerError: {
        borderColor: '#dc3545',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
        marginLeft: 10,
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    signUpButton: {
        marginTop: 10,
        marginBottom: 25,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: 'indigo',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    signUpButtonDisabled: {
        shadowOpacity: 0.1,
        elevation: 2,
    },
    signUpButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
    },
    loadingIcon: {
        marginRight: 10,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        marginLeft: 2,
    },
    loginLinkText: {
        color: 'indigo',
        fontWeight: '600',
        fontSize: 14,
    },
});