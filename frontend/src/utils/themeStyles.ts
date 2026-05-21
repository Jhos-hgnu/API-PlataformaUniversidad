import type { Theme } from '../context/authTypes';

export interface ThemeStyles {
  page: string;
  panel: string;
  panelMuted: string;
  input: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonAccent: string;
  border: string;
  label: string;
  text: string;
  mutedText: string;
  tableHeader: string;
  tableRowHover: string;
  badgePrimary: string;
  badgeSecondary: string;
  shadow: string;
}

export const getThemeStyles = (theme: Theme): ThemeStyles => {
  switch (theme) {
    case 'oscuro':
      return {
        page: 'bg-slate-950 text-slate-100',
        panel: 'bg-slate-900 border-slate-800 text-slate-100',
        panelMuted: 'bg-slate-950/80 border-slate-800 text-slate-100',
        input: 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold',
        buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold',
        buttonAccent: 'bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-bold',
        border: 'border-slate-800',
        label: 'text-slate-400',
        text: 'text-slate-100',
        mutedText: 'text-slate-400',
        tableHeader: 'bg-slate-900 text-slate-300 border-slate-800',
        tableRowHover: 'hover:bg-slate-800/60',
        badgePrimary: 'bg-blue-600 text-white',
        badgeSecondary: 'bg-slate-700 text-slate-100',
        shadow: 'shadow-slate-950/10',
      };

    case 'coquette':
      return {
        page: 'bg-[#fff5f6] text-[#6d4c51]',
        panel: 'bg-white border-[#fbcdd4] text-[#6d4c51]',
        panelMuted: 'bg-[#fff5f6]/70 border-[#fbcdd4] text-[#6d4c51]',
        input: 'bg-[#ffe6f0] border-[#f4a9c8] text-[#6d4c51] placeholder:text-[#b3888d]',
        buttonPrimary: 'bg-[#f472b6] hover:bg-[#ec4899] text-white text-xs font-bold',
        buttonSecondary: 'bg-[#fff5f6] hover:bg-[#fbcdd4] text-[#6d4c51] text-xs font-bold',
        buttonAccent: 'bg-[#fdf1f4] hover:bg-[#fbcdd4] text-[#6d4c51] text-xs font-bold',
        border: 'border-[#fbcdd4]',
        label: 'text-[#b3888d]',
        text: 'text-[#6d4c51]',
        mutedText: 'text-[#b3888d]',
        tableHeader: 'bg-[#fff5f6] text-[#6d4c51] border-[#fbcdd4]',
        tableRowHover: 'hover:bg-[#fde7ed]',
        badgePrimary: 'bg-[#f472b6] text-white',
        badgeSecondary: 'bg-[#fff5f6] text-[#6d4c51]',
        shadow: 'shadow-pink-100/40',
      };

    case 'claro':
    default:
      return {
        page: 'bg-[#f4f6f9] text-slate-900',
        panel: 'bg-white border-gray-200 text-slate-900',
        panelMuted: 'bg-slate-50 border-gray-200 text-slate-900',
        input: 'bg-slate-100 border-slate-300 text-gray-700 placeholder:text-gray-500',
        buttonPrimary: 'bg-[#1a365d] hover:bg-[#152c4d] text-white text-xs font-bold',
        buttonSecondary: 'bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold',
        buttonAccent: 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold',
        border: 'border-gray-200',
        label: 'text-gray-500',
        text: 'text-slate-900',
        mutedText: 'text-gray-500',
        tableHeader: 'bg-gray-50 text-gray-500 border-gray-200',
        tableRowHover: 'hover:bg-gray-50',
        badgePrimary: 'bg-blue-600 text-white',
        badgeSecondary: 'bg-slate-100 text-slate-700',
        shadow: 'shadow-gray-100/50',
      };
  }
};
