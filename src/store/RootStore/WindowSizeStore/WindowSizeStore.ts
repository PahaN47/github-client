import { action, computed, makeObservable, observable } from 'mobx';

export type WindowSizeStoreProps = {
  initialWidth: number;
  initialHeight: number;
};

class WindowSizeStore {
  width: number;
  height: number;

  constructor({ initialWidth, initialHeight }: WindowSizeStoreProps) {
    this.width = initialWidth;
    this.height = initialHeight;

    makeObservable(this, {
      setSize: action.bound,
      isTablet: computed,
      isSmallDesktop: computed,
      isMobile: computed,
      width: observable,
      height: observable,
    });
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get isMobile() {
    return this.width <= 480;
  }

  get isTablet() {
    return this.width > 480 && this.width <= 768;
  }

  get isSmallDesktop() {
    return this.width > 768 && this.width <= 1024;
  }
}

export default WindowSizeStore;
