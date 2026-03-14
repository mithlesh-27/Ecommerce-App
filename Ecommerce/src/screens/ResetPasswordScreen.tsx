import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { apiRequest } from '../api/api';

export default function ResetPasswordScreen({ route, navigation }: any) {
    const [token, setToken] = useState(''); // User can paste token/email link
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!token || !newPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        setLoading(true);

        try {
            await apiRequest('/auth/reset-password', 'POST', { token, newPassword });
            Alert.alert('Success', 'Password updated successfully. You can now log in.');
            setToken('');
            setNewPassword('');
            navigation.navigate('Login');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.label}>Enter the token you received in your email and your new password</Text>

                <TextInput
                    style={styles.input}
                    value={token}
                    onChangeText={setToken}
                    placeholder="Reset Token"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleReset}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f3f4f6', justifyContent: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    label: { fontSize: 14, color: '#555', marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, marginBottom: 20, backgroundColor: '#f9fafb' },
    button: { backgroundColor: '#000', padding: 15, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});