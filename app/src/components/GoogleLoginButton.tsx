/**
 * GoogleLoginButton.tsx
 * Botón de login con Google usando @react-oauth/google
 * La librería oficial de Google para React
 */

import { GoogleLogin } from '@react-oauth/google';
import { useRef } from 'react';
import ButtonComponent from './ButtonComponent';


interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: any) => void;
  onError?: () => void;
}

function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    // Clickear el botón de Google escondido
    const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleBtn) {
      googleBtn.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonComponent
        text="🔐 Inicia Sesión con Google"
        variant="primary"
        size="large"
        onClick={handleClick}
      />
      {/* GoogleLogin escondido pero funcional */}
      <div ref={googleButtonRef} className="hidden">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  );
}

export default GoogleLoginButton;
