import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import { OPENING_TIMINGS } from '@/constants/opening-timings';
import {
  OPENING_SCENE_DURATION_MS,
  OPENING_VISUAL_FADE_START_MS,
  useOpeningAudio,
} from '@/hooks/use-opening-audio.web';
import { subscribeToOpeningReplay } from '@/utils/opening-replay';

import classes from './animated-icon.module.css';
const DURATION = 300;
const arenaImageSource: string = require('@/assets/images/kpop-studio-home-bg.png.png');
const crystalMaskSource: string = require('@/assets/images/kpop-studio-k-crystal.png.png');
const arenaLayerStyle: CSSProperties = { backgroundImage: `url("${arenaImageSource}")` };
const crystalMaskStyle: CSSProperties = {
  maskImage: `url("${crystalMaskSource}")`,
  WebkitMaskImage: `url("${crystalMaskSource}")`,
};
const openingVisualStyle = {
  '--arena-black-in-delay': `${OPENING_TIMINGS.splashFadeIn + OPENING_TIMINGS.splashHold}ms`,
  '--splash-exit-delay': `${OPENING_TIMINGS.splashFadeIn + OPENING_TIMINGS.splashHold}ms`,
  '--splash-fade-in': `${OPENING_TIMINGS.splashFadeIn}ms`,
  '--splash-fade-out': `${OPENING_TIMINGS.splashFadeOut}ms`,
} as CSSProperties;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (value: number) => {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
};
const lightstickPoints = [
  { left: 7.7, top: 75.4, size: 6, delay: 0 },
  { left: 14.5, top: 82.1, size: 5, delay: 260 },
  { left: 19.2, top: 73.1, size: 4, delay: 120 },
  { left: 26.2, top: 74.2, size: 4, delay: 520 },
  { left: 29.8, top: 71.1, size: 3, delay: 370 },
  { left: 33.7, top: 78.2, size: 4, delay: 720 },
  { left: 40.9, top: 71.2, size: 3, delay: 610 },
  { left: 3.8, top: 67.6, size: 3, delay: 840 },
  { left: 10.9, top: 62.8, size: 2, delay: 430 },
  { left: 89.2, top: 62.5, size: 2, delay: 190 },
  { left: 96.2, top: 68.3, size: 3, delay: 470 },
  { left: 83.7, top: 75.2, size: 4, delay: 330 },
  { left: 88, top: 70, size: 3, delay: 680 },
  { left: 93, top: 76.7, size: 5, delay: 560 },
  { left: 86.4, top: 82, size: 5, delay: 880 },
  { left: 77.8, top: 73.4, size: 3, delay: 760 },
  { left: 23.2, top: 68.5, size: 2, delay: 960 },
  { left: 73.4, top: 68.7, size: 2, delay: 1010 },
] as const;

export function AnimatedSplashOverlay() {
  const [loaded, setLoaded] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [sequenceKey, setSequenceKey] = useState(0);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const lightstickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { audioReady, restartOpeningAudio, startOpeningAudio } = useOpeningAudio();

  const updateArenaProgress = useCallback((progress: number) => {
    const arena = arenaRef.current;
    if (!arena) return;

    const crowd = smoothstep((progress - 0.54) / 0.4);
    const stage = smoothstep((progress - 0.68) / 0.25);
    const performers = smoothstep((progress - 0.8) / 0.17);
    const finalLights = smoothstep((progress - 0.92) / 0.08);

    arena.style.setProperty('--crowd-reveal', crowd.toFixed(4));
    arena.style.setProperty('--stage-reveal', stage.toFixed(4));
    arena.style.setProperty('--performer-reveal', performers.toFixed(4));
    arena.style.setProperty('--final-lights', finalLights.toFixed(4));
    arena.style.setProperty('--mask-width', `${8 + crowd * 330}%`);
    arena.style.setProperty('--mask-height', `${6 + crowd * 285}%`);

    lightstickPoints.forEach((point, index) => {
      const lightstick = lightstickRefs.current[index];
      if (!lightstick) return;
      const switchAt = point.delay / OPENING_TIMINGS.lightsticksDuration;
      const intensity = smoothstep((progress - switchAt) / 0.18);
      lightstick.style.opacity = `${intensity * 0.84}`;
      lightstick.style.transform = `scale(${0.58 + intensity * 0.42})`;
    });
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([Image.prefetch(arenaImageSource), Image.prefetch(crystalMaskSource)])
      .then(() => {
        if (active) setAssetsReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () =>
      subscribeToOpeningReplay(() => {
        restartOpeningAudio();
        setSequenceKey((value) => value + 1);
        setFading(false);
        setVisible(true);
      }),
    [restartOpeningAudio]
  );

  useEffect(() => {
    if (!loaded || !assetsReady || !audioReady || !visible) return;

    updateArenaProgress(0);
    startOpeningAudio(updateArenaProgress);
    const fadeTimeout = window.setTimeout(() => setFading(true), OPENING_VISUAL_FADE_START_MS);
    const hideTimeout = window.setTimeout(() => setVisible(false), OPENING_SCENE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [assetsReady, audioReady, loaded, sequenceKey, startOpeningAudio, updateArenaProgress, visible]);

  if (!visible) return null;

  const experienceReady = loaded && assetsReady && audioReady;

  return (
    <View style={[styles.splashOverlay, fading && styles.splashOverlayFading]}>
      <div
        className={`${classes.openingVisual} ${!experienceReady ? classes.openingVisualPaused : ''}`}
        key={sequenceKey}
        style={openingVisualStyle}>
        <div className={classes.kScene}>
          <Image
            contentFit="cover"
            onLoad={() => setLoaded(true)}
            source={require('@/assets/images/kpop-studio-splash.jpg')}
            style={styles.splashImage}
          />
        </div>

        <div className={classes.kShine} style={crystalMaskStyle} />

        <div className={classes.arenaScene} ref={arenaRef}>
          <div className={`${classes.arenaLayer} ${classes.arenaBase}`} style={arenaLayerStyle} />
          <div className={classes.lightstickLayer}>
            {lightstickPoints.map((point, index) => (
              <span
                className={classes.lightstickPoint}
                key={index}
                ref={(node) => {
                  lightstickRefs.current[index] = node;
                }}
                style={{
                  height: point.size,
                  left: `${point.left}%`,
                  top: `${point.top}%`,
                  width: point.size,
                }}
              />
            ))}
          </div>
          <div className={`${classes.arenaLayer} ${classes.arenaReveal}`} style={arenaLayerStyle} />
          <div className={classes.stageAtmosphere} />
          <div className={`${classes.arenaLayer} ${classes.arenaFinal}`} style={arenaLayerStyle} />
        </div>
      </div>
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
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

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#03000B',
    zIndex: 1000,
    transitionDuration: '100ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  splashOverlayFading: {
    opacity: 0,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
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
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
});
