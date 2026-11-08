/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Augment google namespace with Google Identity Services (GIS)
declare global {
  namespace google {
    namespace accounts {
      namespace id {
        function initialize(config: {
          client_id: string;
          callback: (response: { credential: string; select_by?: string }) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
          context?: 'signin' | 'signup' | 'use';
          prompt_parent_id?: string;
          itp_support?: boolean;
          use_fedcm_for_prompt?: boolean;
        }): void;

        function prompt(
          notification?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
            getMomentType: () => string;
          }) => void
        ): void;

        function renderButton(
          parent: HTMLElement,
          options: {
            type?: 'standard' | 'icon';
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
            width?: number | string;
            locale?: string;
            click_listener?: () => void;
          }
        ): void;

        function disableAutoSelect(): void;
        function cancel(): void;
      }
    }
  }

  interface Window {
    google?: typeof google;
  }
}

export {};
