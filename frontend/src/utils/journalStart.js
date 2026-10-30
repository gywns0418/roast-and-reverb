export function journalStartDestination(compact, pathname, state) {
  if (!compact) return null;
  if (
    pathname === "/coffee/write" &&
    (state?.coffeeDraft ||
      state?.coffeeCandidate ||
      state?.repeatCoffee ||
      state?.selectedSoundtrack)
  )
    return null;
  return "/coffee?write=1";
}
