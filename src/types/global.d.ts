// Ambient module declarations for static asset imports
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}
