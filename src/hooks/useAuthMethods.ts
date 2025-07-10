
import { authMethods } from '@/utils/auth/authMethods';
import { UserProfile } from '@/types/auth';
import { AuthResult, PasswordUpdateResult, ResetPasswordParams } from '@/utils/auth/types';
import { hasRole, checkAccess } from '@/utils/roleUtils';
import { API_BASE_URL } from '@/types/variables';

export function useRoleMethods(setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>) {
  // Auth functions that use our authMethods
 
  // Added methods for convenience
  const updateEmail = async (newEmail: string): Promise<AuthResult> => {
    try {
      // Здесь нужно будет переписать на свой backend
      console.log('updateEmail: нужно переписать на backend');
      return { 
        success: true, 
        message: "Email update initiated. Please check your new email for verification." 
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  };
  
 
  

  return {
    loginWithEmail,
    logout,
    updatePassword,
    sendPasswordResetEmail,
    resetPassword,
    signupWithEmail,
    hasRole,
    updateEmail
  };
}
