import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { OPENING_SCENE_DURATION_MS, useOpeningAudio } from '@/hooks/use-opening-audio.native';
import { subscribeToOpeningReplay } from '@/utils/opening-replay';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [sequenceKey, setSequenceKey] = useState(0);
  const { audioReady, restartOpeningAudio, startOpeningAudio } = useOpeningAudio();

  useEffect(() => {
    if (animate || !audioReady || !imageLoaded) return;
    SplashScreen.hideAsync().finally(() => {
      startOpeningAudio();
      setAnimate(true);
    });
  }, [animate, audioReady, imageLoaded, startOpeningAudio]);

  useEffect(
    () =>
      subscribeToOpeningReplay(() => {
        restartOpeningAudio();
        setSequenceKey((value) => value + 1);
        setVisible(true);
        setAnimate(true);
      }),
    [restartOpeningAudio]
  );

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    97.6: {
      opacity: 1,
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.inOut(Easing.cubic),
    },
  });

  const image = (
    <Image
      contentFit="cover"
      onLoad={() => setImageLoaded(true)}
      style={styles.splashImage}
      source={require('@/assets/images/kpop-studio-splash.jpg')}
    />
  );

  return animate ? (
    <Animated.View
      key={sequenceKey}
      entering={splashKeyframe.duration(OPENING_SCENE_DURATION_MS).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {image}
    </Animated.View>
  ) : (
    <View style={styles.splashOverlay}>
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  splashImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#03000B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
