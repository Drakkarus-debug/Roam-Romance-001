export const COLORS = {
  black: '#000000',
  darkBg: '#0a0a0a',
  cardBg: 'rgba(0,0,0,0.9)',
  gold: '#EAB308',
  goldLight: '#FBBF24',
  goldDark: '#B45309',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  red: '#EF4444',
  green: '#22C55E',
  pink: '#EC4899',
  purple: '#8B5CF6',
};

export const BG_IMAGE = 'https://customer-assets.emergentagent.com/job_78741d56-7120-4b1e-bb03-8c74389f498e/artifacts/d3k1x2rz_ChatGPT%20Image%20Feb%2017%2C%202026%2C%2009_31_28%20PM.png';
export const LOGO_IMAGE = 'https://customer-assets.emergentagent.com/job_roam-dating-1/artifacts/c6dvvshx_ChatGPT%20Image%20Feb%2015%2C%202026%2C%2012_26_39%20PM.png';

export const API_URL = typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL
  ? process.env.REACT_APP_BACKEND_URL
  : 'https://roam-romance-preview.preview.emergentagent.com';
