// Bot-spam scoring for the contact form. The honeypot and rate limit catch
// most bots, but some skip hidden inputs. These signals match the
// random-string submissions seen on the Academy form in Oct 2026 (message
// "JbewwruVxYVMSvSoQm", Gmail dot-trick addresses like
// "dyla.n.coo.k.kn@gmail.com"). Same rules as pi-academy/lib/spam-check.ts.
// One signal alone never blocks: a real person can trip one by accident.

const MIN_FILL_MS = 3000;

// A run of 10+ letters that flips lower→upper case 3+ times inside the word,
// e.g. "FNnTBRZCylYDjbmBigwYNgAf". Real names like "McDonald" flip once.
function hasRandomCaseWord(s: string): boolean {
  return s.split(/\s+/).some((w) => {
    if (!/^[A-Za-z]{10,}$/.test(w)) return false;
    return (w.match(/[a-z][A-Z]/g)?.length ?? 0) >= 3;
  });
}

export function spamSignals(input: {
  email: string;
  message: string;
  // Every free-text value in the submission (name, organisation, etc.).
  texts: string[];
  elapsed_ms?: number;
}): string[] {
  const signals: string[] = [];

  if (input.texts.some(hasRandomCaseWord)) {
    signals.push("random-case-word");
  }

  const message = input.message.trim();
  if (message.length >= 8 && !/\s/.test(message)) {
    signals.push("message-without-spaces");
  }

  const [local = "", domain = ""] = input.email.toLowerCase().split("@");
  if ((domain === "gmail.com" || domain === "googlemail.com") && (local.match(/\./g)?.length ?? 0) >= 3) {
    signals.push("gmail-dot-trick");
  }

  // The real form always sends how long it was open; scripts posting
  // straight to the API don't.
  if (input.elapsed_ms === undefined || input.elapsed_ms < MIN_FILL_MS) {
    signals.push("too-fast-or-no-timer");
  }

  return signals;
}

export const isLikelySpam = (signals: string[]) => signals.length >= 2;
