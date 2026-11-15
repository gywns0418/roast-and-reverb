// On phones the coffee writing form lives inside the journal composer, so the
// standalone write page opens it there. Home (/dashboard) is a real tab now and
// is never redirected.
export function journalStartDestination(compact, pathname, state) {
  if (!compact || pathname !== "/coffee/write") return null;
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
