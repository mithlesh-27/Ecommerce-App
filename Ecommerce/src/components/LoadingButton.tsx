import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";

// Optional imports
let LinearGradient: any;
try {
  LinearGradient = require("react-native-linear-gradient").default;
} catch (e) {
  LinearGradient = null; // fallback if not installed
}

type Props = {
  title: string;
  loading: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[]; // optional gradient
};

export default function LoadingButton({
  title,
  loading,
  onPress,
  style,
  textStyle,
  gradientColors,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const ButtonContent = (
    <Animated.View
      style={[
        styles.button,
        style,
        loading && styles.disabled,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Animated.View>
  );

  // If LinearGradient is available and gradientColors provided
  if (LinearGradient && gradientColors) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={gradientColors}
          style={[styles.button, style, loading && styles.disabled]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.text, textStyle]}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // fallback plain button
  return (
    <TouchableOpacity
      style={[styles.button, style, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.text, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});