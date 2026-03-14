import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import { useAuth } from "../context/AuthContext";
import { createAddress } from "../api/address";
import { fetchPincodeDetails } from "../utils/pincode";

type Props = NativeStackScreenProps<ProfileStackParamList, "AddAddress">;

export default function AddAddressScreen({ navigation }: Props) {
  const { userToken } = useAuth();

  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const validate = () => {
    if (!label.trim()) return Alert.alert("Validation Error", "Label is required.");
    if (!line1.trim()) return Alert.alert("Validation Error", "Address line is required.");
    if (!city.trim()) return Alert.alert("Validation Error", "City is required.");
    if (!state.trim()) return Alert.alert("Validation Error", "State is required.");
    if (!pincode.trim()) return Alert.alert("Validation Error", "Pincode is required.");
    if (!phone.trim()) return Alert.alert("Validation Error", "Phone number is required.");
    if (!/^[0-9]{10}$/.test(phone)) return Alert.alert("Validation Error", "Phone must be 10 digits.");
    return true;
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
          Alert.alert("Invalid Pincode", "Could not fetch location.");
        }
      } catch (err) {
        console.log("Pincode fetch failed", err);
      }

      setPincodeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createAddress(
        { label, line1, city, state, pincode, phone, is_default: isDefault },
        userToken!
      );

      Alert.alert("Success", "Address added successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("Add address error:", err);
      Alert.alert("Error", "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    labelText: string,
    value: string,
    setter: any,
    placeholder: string,
    keyboardType: any = "default",
    maxLength?: number
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{labelText}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={setter}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.card}>

          <Text style={styles.title}>Add New Address</Text>
          <Text style={styles.subtitle}>Enter delivery details</Text>

          {renderInput("Label", label, setLabel, "Home / Office")}
          {renderInput("Address Line", line1, setLine1, "Street / Area")}

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              {renderInput("City", city, setCity, "City")}
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              {renderInput("State", state, setState, "State")}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>Pincode</Text>

              <View style={styles.pincodeContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Postal Code"
                  placeholderTextColor="#999"
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

            <View style={{ flex: 1, marginLeft: 6 }}>
              {renderInput("Phone", phone, setPhone, "10-digit", "phone-pad", 10)}
            </View>
          </View>

          <View style={styles.defaultRow}>
            <Text style={styles.defaultLabel}>Set as Default</Text>

            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ true: "#6366F1", false: "#d1d5db" }}
              thumbColor="#fff"
            />
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save Address</Text>
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

  pincodeContainer: {
    justifyContent: "center",
  },

  pinLoader: {
    position: "absolute",
    right: 14,
  },

  defaultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 24,
  },

  defaultLabel: {
    fontWeight: "600",
    fontSize: 14,
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