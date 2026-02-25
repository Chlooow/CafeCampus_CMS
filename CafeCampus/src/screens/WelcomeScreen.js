import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/theme';

export default function WelcomeScreen({ navigation }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Logos */}
      <View style={styles.logosRow}>
        {/* Logo CaféCampus avec animation flottante */}
        <Animated.Image
          source={require('../../assets/logo-cafecampus_background-removebg-preview.png')}
          style={[styles.logoImage, { transform: [{ translateY }] }]}
          resizeMode="contain"
        />

        {/* Logo Paris-Saclay avec même animation */}
        <Animated.Image
          source={require('../../assets/logo-upsaclay-background-removebg-preview.png')}
          style={[styles.logoImage, { transform: [{ translateY }] }]}
          resizeMode="contain"
        />
      </View>

      {/* Titre */}
      <Text style={styles.title}>Bienvenue sur Café Campus</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>
        " Pause café sans stress avec CaféCampus à Paris Saclay "
      </Text>

      {/* Bouton COMMENCER */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>COMMENCER</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        © CaféCampus 2024 copyright Uriel Louis, Maimouna Tall, Cheïma Hamrouni et Chloé Makoundou pour l'Université Paris-Saclay
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logosRow: {
    flexDirection: 'row',
    //gap: 3,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 250, // agrandit le logo
    height: 250,
    marginHorizontal: -40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  slogan: {
    fontSize: 15,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 44,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 40,
    marginBottom: 40,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    fontSize: 10,
    color: COLORS.accentDark,
    textAlign: 'center',
    lineHeight: 15,
    opacity: 0.8,
  },
});