type OpeningReplayListener = () => void;

const openingReplayListeners = new Set<OpeningReplayListener>();

export function requestOpeningReplay() {
  if (__DEV__) {
    console.info('[opening-audio] COMEÇAR pressed', { listeners: openingReplayListeners.size });
  }
  openingReplayListeners.forEach((listener) => listener());
}

export function subscribeToOpeningReplay(listener: OpeningReplayListener) {
  openingReplayListeners.add(listener);

  return () => {
    openingReplayListeners.delete(listener);
  };
}
