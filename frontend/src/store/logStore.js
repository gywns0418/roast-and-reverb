const STORAGE_KEY = "roast-reverb-log-selection";

function readSelection() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { selectedCoffeeId: null, selectedMusicId: null };
}

export const logStore = {
  get selection() {
    return readSelection();
  },
  setSelection(selection) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readSelection(), ...selection }));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
