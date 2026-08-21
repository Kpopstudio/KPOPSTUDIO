/* eslint-disable react-hooks/immutability -- expo-audio exposes volume as an imperative property. */
import { useAudioPlayer, useAudioPlayerStatus, type AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

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

const USE_ALTERNATE_REVEAL = false;

const crystalSource = require('@/assets/sounds/kpop-studio-crystal-signature.wav.wav');
const crowdSource = require('@/assets/sounds/kpop-studio-dream-arena-build.wav.wav');
const revealSource = USE_ALTERNATE_REVEAL
  ? require('@/assets/sounds/kpop-studio-dream-reveal-alt.mp3.mp3')
  : require('@/assets/sounds/kpop-studio-dream-reveal.mp3.mp3');

export const OPENING_SCENE_DURATION_MS = OPENING_TIMINGS.openingTotal;

export function useOpeningAudio() {
  const crystal = useAudioPlayer(crystalSource, { updateInterval: 100 });
  const crowdA = useAudioPlayer(crowdSource, { updateInterval: 100 });
  const crowdB = useAudioPlayer(crowdSource, { updateInterval: 100 });
  const revealA = useAudioPlayer(revealSource, { updateInterval: 100 });
  const revealB = useAudioPlayer(revealSource, { updateInterval: 100 });
  const crystalStatus = useAudioPlayerStatus(crystal);
  const crowdAStatus = useAudioPlayerStatus(crowdA);
  const crowdBStatus = useAudioPlayerStatus(crowdB);
  const revealAStatus = useAudioPlayerStatus(revealA);
  const revealBStatus = useAudioPlayerStatus(revealB);
  const audioReady =
    crystalStatus.isLoaded &&
    crowdAStatus.isLoaded &&
    crowdBStatus.isLoaded &&
    revealAStatus.isLoaded &&
    revealBStatus.isLoaded;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const startedRef = useRef(false);

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

  const startOpeningAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      crystal.pause();
      const crowds: [AudioPlayer, AudioPlayer] = [crowdA, crowdB];
      crowds.forEach((crowd) => {
        crowd.pause();
        crowd.volume = 0;
        void crowd.seekTo(0);
      });
      crystal.volume = CRYSTAL_VOLUME;
      void crystal.seekTo(0);

      schedule(() => crystal.play(), CRYSTAL_START_MS);
      schedule(() => {
        crowdA.volume = CROWD_START_VOLUME;
        crowdA.play();
      }, CROWD_START_MS);

      const openingStartedAt = Date.now();
      const crowdGains = [1, 0];
      let crowdMasterVolume = CROWD_START_VOLUME;
      automate(() => {
        const elapsed = Date.now() - openingStartedAt;
        if (elapsed < CROWD_START_MS) return false;
        if (elapsed < CROWD_BUILD_END_MS) {
          const progress = (elapsed - CROWD_START_MS) / (CROWD_BUILD_END_MS - CROWD_START_MS);
          crowdMasterVolume =
            CROWD_START_VOLUME + (CROWD_PEAK_VOLUME - CROWD_START_VOLUME) * progress * progress;
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
          if (Date.now() - openingStartedAt >= CROWD_END_MS) return;
          const incomingIndex = outgoingIndex === 0 ? 1 : 0;
          const outgoing = crowds[outgoingIndex];
          const incoming = crowds[incomingIndex];
          incoming.pause();
          void incoming.seekTo(CROWD_LOOP_START_SECONDS);
          crowdGains[incomingIndex] = 0;
          incoming.volume = 0;
          incoming.play();
          const crossfadeStartedAt = Date.now();
          automate(() => {
            const progress = Math.min(
              (Date.now() - crossfadeStartedAt) / CROWD_LOOP_CROSSFADE_MS,
              1
            );
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

      const reveals: [AudioPlayer, AudioPlayer] = [revealA, revealB];
      const queueLoopCrossfade = (outgoingIndex: 0 | 1, delay: number) => {
        schedule(() => {
          const incomingIndex = outgoingIndex === 0 ? 1 : 0;
          const outgoing = reveals[outgoingIndex];
          const incoming = reveals[incomingIndex];
          incoming.pause();
          void incoming.seekTo(REVEAL_START_SECONDS);
          incoming.volume = 0;
          incoming.play();
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
          void player.seekTo(REVEAL_START_SECONDS);
          player.volume = 0;
        });
        revealA.play();
        const fadeStartedAt = Date.now();
        automate(() => {
          const progress = Math.min((Date.now() - fadeStartedAt) / MUSIC_FADE_IN_MS, 1);
          revealA.volume = MUSIC_VOLUME * Math.sin(progress * Math.PI * 0.5);
          return progress >= 1;
        }, 25);
        queueLoopCrossfade(0, LOOP_CROSSFADE_START_MS);
      }, MUSIC_START_MS);
    } catch {
      // Audio errors must never block the visual opening.
    }
  }, [automate, crowdA, crowdB, crystal, revealA, revealB, schedule]);

  const restartOpeningAudio = useCallback(() => {
    clearAutomation();
    crystal.pause();
    crowdA.pause();
    crowdB.pause();
    const reveals = [revealA, revealB];
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
    startedRef.current = false;
    startOpeningAudio();
  }, [automate, clearAutomation, crowdA, crowdB, crystal, revealA, revealB, startOpeningAudio]);

  useEffect(
    () => () => {
      clearAutomation();
      try {
        crystal.pause();
        crowdA.pause();
        crowdB.pause();
        revealA.pause();
        revealB.pause();
      } catch {
        // useAudioPlayer releases all four players after this cleanup.
      }
    },
    [clearAutomation, crowdA, crowdB, crystal, revealA, revealB]
  );

  return { audioReady, restartOpeningAudio, startOpeningAudio };
}
