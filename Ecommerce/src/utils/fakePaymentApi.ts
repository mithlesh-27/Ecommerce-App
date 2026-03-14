export type PaymentResponse =
  | { success: true; transactionId: string }
  | { success: false; error: string };

export const fakePaymentApi = (): Promise<PaymentResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;

      if (success) {
        resolve({
          success: true,
          transactionId: `TXN-${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          error: 'Payment failed. Please try again.',
        });
      }
    }, 2000);
  });
};
