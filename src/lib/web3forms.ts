/**
 * Web3Forms integration helper for SFI GECI Portal
 * Handles sending email notifications for Contact section messages and Student Grievances.
 */

export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
  process.env.WEB3FORMS_ACCESS_KEY ||
  '938ab6c7-2811-4412-a94e-70a7fa9e6299';

export interface Web3FormSubmitResult {
  success: boolean;
  message: string;
  data?: any;
}

export async function submitToWeb3Forms(
  payload: Record<string, string | number | boolean | undefined | null> | FormData
): Promise<Web3FormSubmitResult> {
  let formData: FormData;

  if (typeof window !== 'undefined' && payload instanceof FormData) {
    formData = payload;
    if (!formData.has('access_key')) {
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    }
  } else {
    formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    if (payload && !(payload instanceof FormData)) {
      for (const [key, value] of Object.entries(payload)) {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    }
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Success! Your message has been sent.',
        data: data.data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Error sending message via Web3Forms.',
        data,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Something went wrong. Please check your connection.',
    };
  }
}
