jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn().mockResolvedValue(true),
}));

jest.mock('@dariyd/react-native-text-recognition', () => ({
  __esModule: true,
  default: {
    recognizeText: jest.fn().mockResolvedValue({ success: false }),
    isAvailable: jest.fn().mockResolvedValue(false),
    detectText: jest.fn().mockResolvedValue({ success: false }),
  },
  recognizeText: jest.fn().mockResolvedValue({ success: false }),
  isAvailable: jest.fn().mockResolvedValue(false),
  detectText: jest.fn().mockResolvedValue({ success: false }),
}));
