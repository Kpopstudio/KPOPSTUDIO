import { useCallback, useEffect, useRef, useState } from 'react';

import { OPENING_TIMINGS } from '@/constants/opening-timings';

const CRYSTAL_START_MS = 230;
const CRYSTAL_VOLUME = 0.72;
const CROWD_START_MS = OPENING_TIMINGS.crowdAudioStart;
const CROWD_BUILD_END_MS = OPENING_TIMINGS.lightsticksStart + OPENING_TIMINGS.lightsticksDuration;
const CROWD_FADE_START_MS = CROWD_BUILD_END_MS;
const CROWD_END_MS = CROWD_START_MS + OPENING_TIMINGS.crowdAudioDuration;
const CROWD_START_VOLUME = 0.025;
const CROWD_PEAK_VOLUME = 0.82;
const CROWD_LOOP_START_SECONDS = 1.2;
const CROWD_LOOP_FIRST_CROSSFADE_MS = 7400;
const CROWD_LOOP_CYCLE_MS = 6200;
const CROWD_LOOP_CROSSFADE_MS = 900;
const MUSIC_START_MS = OPENING_TIMINGS.musicStart;
const MUSIC_VOLUME = 0.92;
const MUSIC_FADE_IN_MS = 550;
const REVEAL_START_SECONDS = 23.7;
const REVEAL_END_SECONDS = 55.7;
const LOOP_CROSSFADE_MS = 1200;
const LOOP_SEGMENT_MS = (REVEAL_END_SECONDS - REVEAL_START_SECONDS) * 1000;
const LOOP_CROSSFADE_START_MS = LOOP_SEGMENT_MS - LOOP_CROSSFADE_MS;

// Troque somente esta constante para testar a versão alternativa.
const USE_ALTERNATE_REVEAL = false;

const crystalSource: string = require('@/assets/sounds/kpop-studio-crystal-signature.wav.wav');
const crowdSource: string = require('@/assets/sounds/kpop-studio-dream-arena-build.wav.wav');
const revealSource: string = USE_ALTERNATE_REVEAL
  ? require('@/assets/sounds/kpop-studio-dream-reveal-alt.mp3.mp3')
  : require('@/assets/sounds/kpop-studio-dream-reveal.mp3.mp3');

export const OPENING_SCENE_DURATION_MS = OPENING_TIMINGS.openingTotal;
export const OPENING_VISUAL_FADE_START_MS = OPENING_TIMINGS.openingTotal - 220;
export const OPENING_VISUAL_FADE_DURATION_MS =
  OPENING_SCENE_DURATION_MS - OPENING_VISUAL_FADE_START_MS;

function reportPlaybackError(label: string, error: unknown) {
  if (__DEV__) console.warn(`[opening-audio] ${label} failed`, error);
}

function smoothstep(value: number) {
  const progress = Math.min(Math.max(value, 0), 1);
  return progress * progress * (3 - 2 * progress);
}

export function useOpeningAudio() {
  const [audioReady, setAudioReady] = useState(false);
  const crystalRef = useRef<HTMLAudioElement | null>(null);
  const crowdRefs = useRef<[HTMLAudioElement, HTMLAudioElement] | null>(null);
  const revealRefs = useRef<[HTMLAudioElement, HTMLAudioElement] | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const startedRef = useRef(false);
  const unlockedRef = useRef(false);

  const clearAutomation = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  }, []);

  const automate = useCallback((callback: () => boolean, intervalMs = 40) => {
    const interval = setInterval(() => {
      if (callback()) clearInterval(interval);
    }, intervalMs);
    intervalsRef.current.push(interval);
  }, []);

  useEffect(() => {
    const crystal = new Audio(crystalSource);
    const crowdA = new Audio(crowdSource);
    const crowdB = new Audio(crowdSource);
    const revealA = new Audio(revealSource);
    const revealB = new Audio(revealSource);
    const players = [crystal, crowdA, crowdB, revealA, revealB];

    players.forEach((player) => {
      player.preload = 'auto';
      player.hidden = true;
      document.body.append(player);
      player.load();
    });
    crystalRef.current = crystal;
    crowdRefs.current = [crowdA, crowdB];
    revealRefs.current = [revealA, revealB];

    const logLoaded = (label: string, player: HTMLAudioElement) => () => {
      if (__DEV__) {
        console.info(`[opening-audio] ${label} loaded`, JSON.stringify({ duration: player.duration }));
      }
    };
    const loadedListeners = [
      ['crystal', crystal, logLoaded('crystal', crystal)],
      ['crowd-a', crowdA, logLoaded('crowd-a', crowdA)],
      ['crowd-b', crowdB, logLoaded('crowd-b', crowdB)],
      ['reveal-a', revealA, logLoaded('reveal-a', revealA)],
      ['reveal-b', revealB, logLoaded('reveal-b', revealB)],
    ] as const;
    const loadedPlayers = new Set<HTMLAudioElement>();
    const markReady = (player: HTMLAudioElement) => () => {
      loadedPlayers.add(player);
      if (loadedPlayers.size === players.length) setAudioReady(true);
    };
    const readyListeners = players.map((player) => [player, markReady(player)] as const);
    loadedListeners.forEach(([, player, listener]) => player.addEventListener('loadeddata', listener));
    readyListeners.forEach(([player, listener]) => {
      player.addEventListener('loadeddata', listener);
      if (player.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) listener();
    });

    return () => {
      clearAutomation();
      loadedListeners.forEach(([, player, listener]) =>
        player.removeEventListener('loadeddata', listener)
      );
      readyListeners.forEach(([player, listener]) =>
        player.removeEventListener('loadeddata', listener)
      );
      players.forEach((player) => {
        player.pause();
        player.removeAttribute('src');
        player.load();
        player.remove();
      });
      crystalRef.current = null;
      crowdRefs.current = null;
      revealRefs.current = null;
    };
  }, [clearAutomation]);

  const progressListenerRef = useRef<((progress: number) => void) | null>(null);

  const startOpeningAudio = useCallback((onRevealProgress?: (progress: number) => void) => {
    if (onRevealProgress) progressListenerRef.current = onRevealProgress;
    const crystal = crystalRef.current;
    const crowds = crowdRefs.current;
    const reveals = revealRefs.current;
    if (!crystal || !crowds || !reveals || startedRef.current) return;
    startedRef.current = true;
    if (!unlockedRef.current) return;

    crystal.pause();
    crowds.forEach((crowd) => crowd.pause());
    crystal.currentTime = 0;
    crowds.forEach((crowd) => {
      crowd.currentTime = 0;
      crowd.volume = 0;
    });
    crystal.volume = CRYSTAL_VOLUME;

    schedule(() => {
      void crystal.play().catch((error) => reportPlaybackError('crystal play', error));
      if (__DEV__) console.info('[opening-audio] crystal play', JSON.stringify({ volume: crystal.volume }));
    }, CRYSTAL_START_MS);

    schedule(() => {
      crowds[0].volume = CROWD_START_VOLUME;
      void crowds[0].play().catch((error) => reportPlaybackError('crowd play', error));
      if (__DEV__) console.info('[opening-audio] crowd play', JSON.stringify({ volume: crowds[0].volume }));
    }, CROWD_START_MS);

    const openingStartedAt = performance.now();
    const crowdGains = [1, 0];
    let crowdMasterVolume = CROWD_START_VOLUME;
    automate(() => {
      const elapsed = performance.now() - openingStartedAt;
      if (elapsed < CROWD_START_MS) return false;
      const visualProgress = (elapsed - OPENING_TIMINGS.lightsticksStart) / OPENING_TIMINGS.lightsticksDuration;
      progressListenerRef.current?.(Math.min(Math.max(visualProgress, 0), 1));
      if (elapsed < CROWD_BUILD_END_MS) {
        const fadeInProgress = (elapsed - CROWD_START_MS) / (CROWD_BUILD_END_MS - CROWD_START_MS);
        crowdMasterVolume =
          CROWD_START_VOLUME +
          (CROWD_PEAK_VOLUME - CROWD_START_VOLUME) * smoothstep(fadeInProgress);
      } else if (elapsed < CROWD_FADE_START_MS) {
        crowdMasterVolume = CROWD_PEAK_VOLUME;
      } else {
        const fadeProgress = Math.min(
          (elapsed - CROWD_FADE_START_MS) / OPENING_TIMINGS.crowdAudioFadeOut,
          1
        );
        crowdMasterVolume = CROWD_PEAK_VOLUME * Math.pow(1 - fadeProgress, 3);
      }
      crowds.forEach((crowd, index) => {
        crowd.volume = crowdMasterVolume * crowdGains[index];
      });
      if (elapsed < CROWD_END_MS) return false;
      crowds.forEach((crowd) => {
        crowd.volume = 0;
        crowd.pause();
      });
      return true;
    });

    const queueCrowdCrossfade = (outgoingIndex: 0 | 1, delay: number) => {
      schedule(() => {
        if (performance.now() - openingStartedAt >= CROWD_END_MS) return;
        const incomingIndex = outgoingIndex === 0 ? 1 : 0;
        const outgoing = crowds[outgoingIndex];
        const incoming = crowds[incomingIndex];
        incoming.pause();
        incoming.currentTime = CROWD_LOOP_START_SECONDS;
        crowdGains[incomingIndex] = 0;
        incoming.volume = 0;
        void incoming.play().catch((error) => reportPlaybackError('crowd loop play', error));
        const crossfadeStartedAt = Date.now();
        automate(() => {
          const progress = Math.min((Date.now() - crossfadeStartedAt) / CROWD_LOOP_CROSSFADE_MS, 1);
          crowdGains[outgoingIndex] = Math.cos(progress * Math.PI * 0.5);
          crowdGains[incomingIndex] = Math.sin(progress * Math.PI * 0.5);
          outgoing.volume = crowdMasterVolume * crowdGains[outgoingIndex];
          incoming.volume = crowdMasterVolume * crowdGains[incomingIndex];
          if (progress < 1) return false;
          outgoing.volume = 0;
          outgoing.pause();
          crowdGains[outgoingIndex] = 0;
          crowdGains[incomingIndex] = 1;
          return true;
        }, 25);
        queueCrowdCrossfade(incomingIndex, CROWD_LOOP_CYCLE_MS);
      }, delay);
    };
    schedule(() => queueCrowdCrossfade(0, CROWD_LOOP_FIRST_CROSSFADE_MS), CROWD_START_MS);

    const queueLoopCrossfade = (outgoingIndex: 0 | 1, delay: number) => {
      schedule(() => {
        const incomingIndex = outgoingIndex === 0 ? 1 : 0;
        const outgoing = reveals[outgoingIndex];
        const incoming = reveals[incomingIndex];
        incoming.pause();
        incoming.currentTime = REVEAL_START_SECONDS;
        incoming.volume = 0;
        void incoming.play().catch((error) => reportPlaybackError('loop crossfade play', error));
        const crossfadeStartedAt = Date.now();

        automate(() => {
          const progress = Math.min((Date.now() - crossfadeStartedAt) / LOOP_CROSSFADE_MS, 1);
          outgoing.volume = MUSIC_VOLUME * Math.cos(progress * Math.PI * 0.5);
          incoming.volume = MUSIC_VOLUME * Math.sin(progress * Math.PI * 0.5);
          if (progress < 1) return false;
          outgoing.volume = 0;
          outgoing.pause();
          incoming.volume = MUSIC_VOLUME;
          return true;
        }, 25);
        queueLoopCrossfade(incomingIndex, LOOP_CROSSFADE_START_MS);
      }, delay);
    };

    schedule(() => {
      reveals.forEach((player) => {
        player.pause();
        player.currentTime = REVEAL_START_SECONDS;
        player.volume = 0;
      });
      const first = reveals[0];
      void first.play().catch((error) => reportPlaybackError('reveal loop play', error));
      const fadeStartedAt = Date.now();
      automate(() => {
        const progress = Math.min((Date.now() - fadeStartedAt) / MUSIC_FADE_IN_MS, 1);
        first.volume = MUSIC_VOLUME * Math.sin(progress * Math.PI * 0.5);
        return progress >= 1;
      }, 25);
      queueLoopCrossfade(0, LOOP_CROSSFADE_START_MS);
      if (__DEV__) {
        console.info(
          '[opening-audio] reveal loop started',
          JSON.stringify({ start: REVEAL_START_SECONDS, end: REVEAL_END_SECONDS })
        );
      }
    }, MUSIC_START_MS);
  }, [automate, schedule]);

  const restartOpeningAudio = useCallback(() => {
    clearAutomation();
    crystalRef.current?.pause();
    crowdRefs.current?.forEach((crowd) => crowd.pause());
    const reveals = revealRefs.current;
    if (reveals) {
      const initialVolumes = reveals.map((player) => player.volume);
      const fadeStartedAt = Date.now();
      automate(() => {
        const progress = Math.min((Date.now() - fadeStartedAt) / 350, 1);
        reveals.forEach((player, index) => {
          player.volume = initialVolumes[index] * (1 - progress);
          if (progress >= 1) player.pause();
        });
        return progress >= 1;
      }, 25);
    }
    unlockedRef.current = true;
    startedRef.current = false;
    startOpeningAudio();
  }, [automate, clearAutomation, startOpeningAudio]);

  return { audioReady, restartOpeningAudio, startOpeningAudio };
}
