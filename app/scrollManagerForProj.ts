// app/scrollManagerForProj.ts
"use client";

export interface ScrollSection {
  id: string;
  start: number;
  end: number;
  onProgress: (progress: number) => void;
}

export class ScrollManager {
  private sections: ScrollSection[] = [];
  private totalHeight: number = 0;
  private scrollHandler: ((event: Event) => void) | null = null;

  addSection(section: ScrollSection) {
    if (typeof window === 'undefined') return;
    this.sections.push(section);
    this.sections.sort((a, b) => a.start - b.start);
  }

  removeSection(id: string) {
    this.sections = this.sections.filter(section => section.id !== id);
  }

  startScrollTracking(totalHeight: number) {
    if (typeof window === 'undefined') return;
    
    this.totalHeight = totalHeight;
    
    this.scrollHandler = () => {
      const scrollTop = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrollTop / this.totalHeight));
      this.updateSections(progress);
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updateSections(0);
  }

  private updateSections(globalProgress: number) {
    this.sections.forEach(section => {
      if (globalProgress >= section.start && globalProgress <= section.end) {
        const sectionProgress = (globalProgress - section.start) / (section.end - section.start);
        const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
        section.onProgress(clampedProgress);
      } else if (globalProgress < section.start) {
        section.onProgress(0);
      } else if (globalProgress > section.end) {
        section.onProgress(1);
      }
    });
  }

  destroy() {
    if (this.scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    this.sections = [];
  }
}

export const scrollManagerForProj = new ScrollManager();

// Easing function
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
