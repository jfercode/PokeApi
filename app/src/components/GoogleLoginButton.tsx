import { GoogleLogin } from '@react-oauth/google';
import { useRef } from 'react';
import ButtonComponent from './ButtonComponent';

// Props interface for GoogleLoginButton component
interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: any) => void;
  onError?: () => void;
}

// Google OAuth login button wrapper with custom styling
// Hides the default Google button and provides a custom button trigger
function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Trigger the hidden Google button click
  const handleClick = () => {
    const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleBtn) {
      googleBtn.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonComponent
        text="🔐 Login with Google"
        variant="primary"
        size="large"
        onClick={handleClick}
      />
      {/* Hidden Google login button but functional */}
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
