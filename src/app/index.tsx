import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OPENING_TIMINGS } from '@/constants/opening-timings';
import { requestOpeningReplay, subscribeToOpeningReplay } from '@/utils/opening-replay';

const COLORS = {
  background: '#030107',
  text: '#FFF9FF',
  textSecondary: '#E2D8EA',
  pink: '#FF4FCB',
  purple: '#8A45FF',
} as const;

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();
  const [openingKey, setOpeningKey] = useState(0);
  const [homeReveal, setHomeReveal] = useState({
    k: false,
    message: false,
    button: false,
  });
  const compactHeight = height < 720;
  const kWidth = Math.min(width * (compactHeight ? 0.39 : 0.44), compactHeight ? 150 : 176);
  const kHeight = kWidth * (1199 / 1312);

  useEffect(
    () =>
      subscribeToOpeningReplay(() => {
        setHomeReveal({ k: false, message: false, button: false });
        setOpeningKey((value) => value + 1);
      }),
    []
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setHomeReveal((state) => ({ ...state, k: true })), OPENING_TIMINGS.contentStart),
      setTimeout(
        () => setHomeReveal((state) => ({ ...state, message: true })),
        OPENING_TIMINGS.messageStart
      ),
      setTimeout(
        () => setHomeReveal((state) => ({ ...state, button: true })),
        OPENING_TIMINGS.buttonStart
      ),
    ];

    return () => timers.forEach(clearTimeout);
  }, [openingKey]);

  return (
    <View style={styles.screen}>
      <Image
        accessibilityLabel="Palco de show do KPOP Studio"
        contentFit="cover"
        source={require('@/assets/images/kpop-studio-home-bg.png.png')}
        style={styles.backgroundImage}
      />

      <SafeAreaView style={styles.safeArea}>
        <View key={openingKey} style={styles.content}>
          <View style={[styles.kFrame, { width: kWidth, height: kHeight }]}>
            {homeReveal.k && (
              <Animated.View
                entering={FadeIn.duration(700).easing(Easing.out(Easing.cubic))}
                style={styles.fill}>
                <Image
                  accessibilityLabel="K cristalizado do KPOP Studio"
                  contentFit="contain"
                  source={require('@/assets/images/kpop-studio-k-crystal.png.png')}
                  style={styles.kCrystal}
                />
              </Animated.View>
            )}
          </View>

          <View style={[styles.copy, compactHeight && styles.copyCompact]}>
            <View style={styles.messageSlot}>
              {homeReveal.message && (
                <Animated.Text
                  entering={FadeInDown.duration(650).easing(Easing.out(Easing.cubic))}
                  style={styles.message}>
                  Crie seu grupo e transforme trainees em estrelas do K-pop.
                </Animated.Text>
              )}
            </View>
          </View>

          <View style={styles.stageWindow} />

          <View style={styles.buttonWrapper}>
            {homeReveal.button && (
              <Animated.View entering={FadeInUp.duration(650).easing(Easing.out(Easing.cubic))}>
                <Pressable
                  accessibilityLabel="Começar"
                  accessibilityRole="button"
                  onPress={requestOpeningReplay}
                  style={({ pressed }) => [styles.buttonPressable, pressed && styles.buttonPressed]}>
                  <LinearGradient
                    colors={[COLORS.pink, '#D647F4', COLORS.purple]}
                    end={{ x: 1, y: 0.5 }}
                    start={{ x: 0, y: 0.5 }}
                    style={styles.button}>
                    <Text style={styles.buttonLabel}>COMEÇAR</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 20,
  },
  kFrame: {
    flexShrink: 0,
  },
  kCrystal: {
    width: '100%',
    height: '100%',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  copy: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 410,
    marginTop: 38,
  },
  copyCompact: {
    marginTop: 24,
  },
  messageSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  message: {
    color: COLORS.textSecondary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
    width: '100%',
    maxWidth: 360,
    textShadowColor: 'rgba(0, 0, 0, 0.92)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  stageWindow: {
    flex: 1,
    minHeight: 72,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  buttonPressable: {
    borderRadius: 18,
    shadowColor: COLORS.pink,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 9 },
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.982 }],
  },
  button: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 2.2,
  },
});
