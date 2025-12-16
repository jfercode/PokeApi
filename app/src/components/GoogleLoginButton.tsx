/**
 * GoogleLoginButton.tsx
 * Botón de login con Google usando @react-oauth/google
 * La librería oficial de Google para React
 */

import { GoogleLogin } from '@react-oauth/google';


interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: any) => void;
  onError?: () => void;
}

function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  return (
    <div className="flex justify-center mt-8">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text="signin_with"
        size="large"
        theme="filled_blue"
      />
    </div>
  );
}

export default GoogleLoginButton;
