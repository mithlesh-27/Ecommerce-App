import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../navigation/AppNavigator";
import { updateAddress } from "../api/address";
import { useAuth } from "../context/AuthContext";
import { fetchPincodeDetails } from "../utils/pincode";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditAddress">;

export default function EditAddressScreen({ route, navigation }: Props) {
  const { addr } = route.params;
  const { userToken } = useAuth();

  const [label, setLabel] = useState(addr.label);
  const [line1, setLine1] = useState(addr.line1);
  const [city, setCity] = useState(addr.city);
  const [state, setState] = useState(addr.state);
  const [pincode, setPincode] = useState(addr.pincode);
  const [phone, setPhone] = useState(addr.phone);
  const [isDefault, setIsDefault] = useState(addr.is_default);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePincodeChange = async (value: string) => {
    const pin = value.replace(/[^0-9]/g, "");
    setPincode(pin);

    if (pin.length === 6) {
      setPincodeLoading(true);

      try {
        const data = await fetchPincodeDetails(pin);

        if (data) {
          setCity(data.city);
          setState(data.state);
        } else {
          Alert.alert("Invalid Pincode", "Unable to fetch location.");
        }
      } catch (err) {
        console.log("Pincode error:", err);
      }

      setPincodeLoading(false);
    }
  };

  const validate = () => {
    if (!label.trim()) return Alert.alert("Validation Error", "Label is required.");
    if (!line1.trim()) return Alert.alert("Validation Error", "Address line is required.");
    if (!city.trim()) return Alert.alert("Validation Error", "City is required.");
    if (!state.trim()) return Alert.alert("Validation Error", "State is required.");
    if (!pincode.trim()) return Alert.alert("Validation Error", "Pincode is required.");
    if (!phone.trim()) return Alert.alert("Validation Error", "Phone number is required.");

    if (!/^[0-9]{6}$/.test(pincode))
      return Alert.alert("Validation Error", "Pincode must be 6 digits.");

    if (!/^[0-9]{10}$/.test(phone))
      return Alert.alert("Validation Error", "Phone number must be 10 digits.");

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await updateAddress(
        addr.id,
        { label, line1, city, state, pincode, phone, is_default: isDefault },
        userToken!
      );

      Alert.alert("Success", "Address updated successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("Update address error:", err);
      Alert.alert("Error", "Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>

          <Text style={styles.title}>Edit Address</Text>
          <Text style={styles.subtitle}>Update your delivery details</Text>

          {/* Label */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Label</Text>
            <TextInput
              style={styles.input}
              placeholder="Home / Office"
              placeholderTextColor="#9CA3AF"
              value={label}
              onChangeText={setLabel}
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Line</Text>
            <TextInput
              style={styles.input}
              placeholder="Street, Area"
              placeholderTextColor="#9CA3AF"
              value={line1}
              onChangeText={setLine1}
            />
          </View>

          {/* City State */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#9CA3AF"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>

          {/* Pincode Phone */}
          <View style={styles.row}>

            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Pincode</Text>

              <View style={styles.pincodeWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Postal code"
                  placeholderTextColor="#9CA3AF"
                  value={pincode}
                  keyboardType="numeric"
                  onChangeText={handlePincodeChange}
                  maxLength={6}
                />

                {pincodeLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#6366F1"
                    style={styles.pinLoader}
                  />
                )}
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>

          </View>

          {/* Default */}
          <View style={styles.defaultRow}>
            <Text style={styles.defaultText}>Set as Default</Text>

            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ true: "#6366F1", false: "#D1D5DB" }}
              thumbColor="#fff"
            />
          </View>

          {/* Save */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              onPressIn={pressIn}
              onPressOut={pressOut}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 22,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontWeight: "600",
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
  },

  pincodeWrapper: {
    justifyContent: "center",
  },

  pinLoader: {
    position: "absolute",
    right: 12,
  },

  defaultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 24,
  },

  defaultText: {
    fontSize: 14,
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

});