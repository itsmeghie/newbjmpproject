/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
  const content: string;
  export default content;
}

interface Window {
  windyInit: (options: any, callback: (windyAPI: any) => void) => void;
}

declare global {
  interface Window {
    glParticles?: any;
  }
}
