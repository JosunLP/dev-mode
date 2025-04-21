import { writable } from 'svelte/store';

// Safe Mode Store
export const safeMode = writable<boolean>(false);

// Compliance Mode Store
export const complianceMode = writable<boolean>(false);

// Modal Store for Cease & Desist Alert
type ModalState = {
  open: boolean;
  title: string;
  message: string;
  showCancel: boolean;
  isHtml: boolean;
};

const createModalStore = () => {
  const defaultState: ModalState = {
    open: false,
    title: '',
    message: '',
    showCancel: false,
    isHtml: false
  };
  
  const { subscribe, set, update } = writable<ModalState>(defaultState);
  
  return {
    subscribe,
    set,
    update,
    open: (title: string, message: string, showCancel = false, isHtml = false) => {
      set({
        open: true,
        title,
        message,
        showCancel,
        isHtml
      });
    },
    close: () => {
      set(defaultState);
    }
  };
};

export const modalStore = createModalStore();

// Scan Results Store for Open-Source Offender
export const scanResults = writable<string[]>([]);

// Patent-Pending Watermark Store
export const watermarkEnabled = writable<boolean>(false);

// Build Overlord Progress Store
export const buildProgress = writable<number>(0);

// License Whisperer Store
export const licenseWhispers = writable<string[]>([
  "Remember that every line of code you write could potentially be patented.",
  "This function might be protected by 3 patents. Check before using.",
  "Have you read the license agreement completely? There are 24 appendices.",
  "Remember: 'Hello World' is a protected expression in 14 jurisdictions.",
  "The use of for-loops is subject to Corporate Coding Policy §27b.",
  "Warning: Using open-source code may lead to unwanted freedom.",
  "Are your variable names sufficiently unique? Check our trademark database.",
  "Fun Fact: By reading this message, you have accepted 4 license agreements."
]);
export const currentWhisper = writable<string>("");

// Trademark Radar Store
export const trademarkRadarActive = writable<boolean>(false);
export const markedWords = writable<Array<{word: string, marked: boolean}>>([
  { word: "feature", marked: false },
  { word: "innovation", marked: false },
  { word: "patent", marked: false },
  { word: "svelte", marked: false },
  { word: "code", marked: false },
  { word: "typescript", marked: false },
  { word: "javascript", marked: false },
  { word: "development", marked: false },
  { word: "software", marked: false },
  { word: "developer", marked: false }
]);

// PR Queue Store
export type PRItem = {
  id: number;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export const prQueue = writable<PRItem[]>([]);

// Dependency Mapper Store
export const dependencies = writable([
  {
    id: 1,
    name: "svelte",
    patentId: "PAT-2024-SVL-1243",
    expanded: false,
    children: [
      {
        id: 2,
        name: "svelte/internal",
        patentId: "PAT-2024-SVL-1244",
        expanded: false,
        children: [
          {
            id: 5,
            name: "svelte/elements",
            patentId: "PAT-2024-SVL-1247",
            children: []
          },
          {
            id: 6,
            name: "svelte/transitions",
            patentId: "PAT-2024-SVL-1248",
            children: []
          }
        ]
      },
      {
        id: 3,
        name: "svelte/store",
        patentId: "PAT-2024-SVL-1245",
        expanded: false,
        children: []
      },
      {
        id: 4,
        name: "svelte/motion",
        patentId: "PAT-2024-SVL-1246",
        expanded: false,
        children: []
      }
    ]
  },
  {
    id: 7,
    name: "typescript",
    patentId: "PAT-2023-TS-0458",
    expanded: false,
    children: [
      {
        id: 8,
        name: "typescript/lib",
        patentId: "PAT-2023-TS-0459",
        expanded: false,
        children: []
      },
      {
        id: 9,
        name: "typescript/compiler",
        patentId: "PAT-2023-TS-0460",
        expanded: false,
        children: []
      }
    ]
  },
  {
    id: 10,
    name: "vite",
    patentId: "PAT-2025-VITE-0014",
    expanded: false,
    children: [
      {
        id: 11,
        name: "vite/client",
        patentId: "PAT-2025-VITE-0015",
        expanded: false,
        children: []
      }
    ]
  }
]);