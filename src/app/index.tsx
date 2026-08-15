import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type TextStyle,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#030107',
  text: '#FFF9FF',
  textSecondary: '#E2D8EA',
  pink: '#FF4FCB',
  purple: '#8A45FF',
} as const;

const webGradientText = Platform.select({
  web: {
    backgroundImage: 'linear-gradient(100deg, #FFC1F0, #F0A8FF, #D7C2FF)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    filter:
      'drop-shadow(0 0 8px rgba(255, 139, 224, 0.4)) drop-shadow(0 0 14px rgba(188, 142, 255, 0.24))',
  } as TextStyle,
});

function GradientTitle() {
  if (Platform.OS === 'web') {
    return <Text style={[styles.titleAccent, styles.titleAccentWeb, webGradientText]}>aqui.</Text>;
  }

  return (
    <MaskedView
      maskElement={<Text style={[styles.titleAccent, styles.titleAccentNative]}>aqui.</Text>}
      style={styles.gradientTextMask}>
      <LinearGradient
        colors={['#FFC1F0', '#F0A8FF', '#D7C2FF']}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={styles.gradientTextFill}>
        <Text style={[styles.titleAccent, styles.titleAccentNative, styles.hiddenText]}>aqui.</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();
  const compactHeight = height < 720;
  const kWidth = Math.min(width * (compactHeight ? 0.39 : 0.44), compactHeight ? 150 : 176);
  const kHeight = kWidth * (1199 / 1312);

  return (
    <View style={styles.screen}>
      <Image
        accessibilityLabel="Palco de show do KPOP Studio"
        contentFit="cover"
        source={require('@/assets/images/kpop-studio-home-bg.png.png')}
        style={styles.backgroundImage}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            entering={FadeIn.duration(950).easing(Easing.out(Easing.cubic))}
            style={[styles.kFrame, { width: kWidth, height: kHeight }]}>
            <Image
              accessibilityLabel="K cristalizado do KPOP Studio"
              contentFit="contain"
              source={require('@/assets/images/kpop-studio-k-crystal.png.png')}
              style={styles.kCrystal}
            />
          </Animated.View>

          <View style={[styles.copy, compactHeight && styles.copyCompact]}>
            <Animated.View
              entering={FadeInDown.delay(220).duration(820).easing(Easing.out(Easing.cubic))}
              style={styles.titleGroup}>
              <Text style={styles.title}>Seu sonho começa</Text>
              <GradientTitle />
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(380).duration(820).easing(Easing.out(Easing.cubic))}
              style={styles.subtitle}>
              Crie seu grupo e transforme trainees em estrelas do K-pop.
            </Animated.Text>
          </View>

          <View style={styles.stageWindow} />

          <Animated.View
            entering={FadeInUp.delay(560).duration(820).easing(Easing.out(Easing.cubic))}
            style={styles.buttonWrapper}>
            <Pressable
              accessibilityLabel="Começar"
              accessibilityRole="button"
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
  copy: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 410,
    marginTop: 38,
  },
  copyCompact: {
    marginTop: 24,
  },
  titleGroup: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 29,
    lineHeight: 35,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.72)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  gradientTextMask: {
    alignSelf: 'center',
    marginTop: 5,
  },
  gradientTextFill: {
    paddingHorizontal: 2,
  },
  titleAccent: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 34,
    lineHeight: 41,
    textAlign: 'center',
  },
  titleAccentNative: {
    textShadowColor: 'rgba(229, 145, 255, 0.48)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleAccentWeb: {
    marginTop: 5,
  },
  hiddenText: {
    opacity: 0,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    width: '100%',
    maxWidth: 340,
    marginTop: 25,
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
