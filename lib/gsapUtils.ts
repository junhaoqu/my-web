import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Safe utility to kill/clear GSAP animations and ScrollTriggers synchronously.
export function killAllGsap() {
  try {
    // Revert all ScrollTriggers to their original state.
    // revert() is more thorough than kill() for restoring layout, as it undoes DOM changes from pinning.
    // It also calls kill() internally.
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
      ScrollTrigger.getAll().forEach((trigger) => {
        // Cast to any to bypass potential outdated type definitions
        try { (trigger as any).revert(); } catch (e) { /* ignore */ }
      });
    }

    // Kill any remaining tweens/delayedCalls/etc. that aren't associated with a ScrollTrigger.
    try { (gsap as any).killAll && (gsap as any).killAll(true, true, true, true); } catch (e) { /* ignore */ }

    // Clear global timeline
    try { (gsap as any).globalTimeline && (gsap as any).globalTimeline.clear(); } catch (e) { /* ignore */ }
  } catch (e) {
    // swallow any errors during cleanup
  } finally {
    // Forcefully restore viewport state that might be left over from pinning.
    document.body.style.overflow = '';
    document.body.style.height = '';
    window.scrollTo(0, 0);

    // Manually find and remove any leftover pin-spacer divs from ScrollTrigger
    const spacers = document.querySelectorAll('.pin-spacer');
    spacers.forEach(spacer => {
      const parent = spacer.parentNode;
      if (parent) {
        // Move children (the original pinned element) back to the original parent
        while (spacer.firstChild) {
          parent.insertBefore(spacer.firstChild, spacer);
        }
        // Remove the now-empty spacer
        parent.removeChild(spacer);
      }
    });
  }
}
