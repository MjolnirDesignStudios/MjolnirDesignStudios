// types.d.ts
interface Window {
  Calendly: {
    initPopupWidget: (options: {
      url: string;
      prefill?: { email?: string; [key: string]: string };
    }) => void;
  };
  gtag: (command: string, targetId: string, config?: any) => void;
  dataLayer: any[];
}