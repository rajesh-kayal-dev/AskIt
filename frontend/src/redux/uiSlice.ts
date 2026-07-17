import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type ActiveView = 'chat' | 'agent';

interface UiState {
  isSidebarOpen: boolean;
  isPanelOpen: boolean;
  theme: Theme;
  isSettingsModalOpen: boolean;
  isSearchModalOpen: boolean;
  activeView: ActiveView;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('askit-theme') as Theme;
    if (savedTheme) return savedTheme;
  }
  return 'system';
};

const initialState: UiState = {
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  isPanelOpen: false,
  theme: getInitialTheme(),
  isSettingsModalOpen: false,
  isSearchModalOpen: false,
  activeView: 'chat',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    togglePanel: (state) => {
      state.isPanelOpen = !state.isPanelOpen;
    },
    setPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isPanelOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('askit-theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('askit-theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload;
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchModalOpen = action.payload;
    },
    setActiveView: (state, action: PayloadAction<ActiveView>) => {
      state.activeView = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  togglePanel,
  setPanelOpen,
  toggleTheme,
  setTheme,
  setSettingsModalOpen,
  setSearchModalOpen,
  setActiveView,
} = uiSlice.actions;

export default uiSlice.reducer;
