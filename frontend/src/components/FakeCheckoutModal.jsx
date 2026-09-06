import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function FakeCheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  itemTitle,
  amount,
  relatedType = 'service_booking',
  relatedId = null
}) {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardholderName, setCardholderName] = useState('Ahmed Khan');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Auto format card number input
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setCardExpiry(val);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      // Simulate ~1.5s processing spinner
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const res = await api.post('/payments/fake-checkout', {
        related_type: relatedType,
        related_id: relatedId,
        amount: parseFloat(amount),
        card_number: cardNumber.replace(/\D/g, '') || '4242424242424242',
        card_expiry: cardExpiry || '12/28',
        card_cvv: cardCvv || '888'
      });

      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger success callback after showing checkmark animation
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess(res.data);
      }, 1300);
    } catch (err) {
      console.error('Payment failed:', err);
      setIsProcessing(false);
      setErrorMessage(err.response?.data?.error || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            disabled={isProcessing || isSuccess}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Mock Checkout</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Complete Booking</h2>
          <p className="text-xs text-slate-300 mt-1 truncate">{itemTitle}</p>

          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">Total Due Today:</span>
            <span className="text-2xl font-black text-white">${parseFloat(amount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-[11px] leading-snug">
            <strong>Demo Mode:</strong> No real payment is processed. Simulated checkout for final year project demonstration.
          </p>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in zoom-in-90 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-500">
              Transaction approved. Finalizing your mentorship booking...
            </p>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handlePay} className="p-5 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="e.g. Ahmed Khan"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Card Number (Demo Auto-filled)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4242 4242 4242 4242"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Code (CVV)
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Demo Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Pay ${parseFloat(amount || 0).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              🔒 End-to-end encrypted demo sandbox • No credit card will ever be charged.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
