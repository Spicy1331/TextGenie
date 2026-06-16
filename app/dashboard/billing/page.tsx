"use client"
import React, { useState, useEffect } from 'react'
import { Zap, Check, CreditCard, ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

function Billing() {
  const { user } = useUser()
  const [isPremium, setIsPremium] = useState(false)
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans')
  
  // Checkout Form State
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const plan = localStorage.getItem('user_plan')
    setIsPremium(plan === 'premium')
  }, [])

  const handleUpgradeClick = () => {
    setStep('checkout')
  }

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 16) {
      const formatted = value.match(/.{1,4}/g)?.join(' ') || value
      setCardNumber(formatted)
      if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }))
    }
  }

  // Format Expiry Date (adds slash after 2 digits)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      let formatted = value
      if (value.length > 2) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`
      }
      setExpiry(formatted)
      if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: '' }))
    }
  }

  // Format CVC (max 3 digits)
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 3) {
      setCvc(value)
      if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: '' }))
    }
  }

  const handlePay = () => {
    // Basic Mock Validation
    const newErrors: { [key: string]: string } = {}
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number'
    }
    if (!expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      newErrors.expiry = 'Use MM/YY format'
    }
    if (cvc.length !== 3) {
      newErrors.cvc = 'Enter 3-digit CVC'
    }
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsProcessing(true)

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false)
      localStorage.setItem('user_plan', 'premium')
      setIsPremium(true)
      
      // Dispatch events to instantly update SideNav UsageTrack
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new Event('planUpdated'))
      
      setStep('success')
    }, 2500)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[80vh] flex flex-col justify-center">
      {/* -------------------- STEP 1: PLANS -------------------- */}
      {step === 'plans' && (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
              <Sparkles className="h-9 w-9 text-primary fill-primary/10" />
              Upgrade to Premium
            </h1>
            <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
              Unlock the full power of TextGenie with unlimited AI generations, faster responses, and priority templates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan Card */}
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Free Tier</h3>
                <p className="text-sm text-gray-500 mt-2">Perfect for trying out TextGenie</p>
                <div className="mt-5 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">$0</span>
                  <span className="text-gray-500 text-sm ml-1">/ month</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {[
                    '10,000 words limit',
                    'Access to all AI content templates',
                    'Historical search logs & history',
                    'Basic responsive interface',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  variant="outline"
                  className="w-full py-6 rounded-2xl font-bold text-gray-500 bg-gray-50 border-gray-200 cursor-default"
                  disabled
                >
                  {isPremium ? 'Downgrade not available' : 'Currently Active'}
                </Button>
              </div>
            </div>

            {/* Premium Plan Card */}
            <div className="bg-white border-2 border-primary rounded-3xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden transform hover:scale-[1.01] transition">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" /> Best Value
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">Premium Tier</h3>
                <p className="text-sm text-gray-500 mt-2">Unlimited power for creators and writers</p>
                <div className="mt-5 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">$9.99</span>
                  <span className="text-gray-500 text-sm ml-1">/ month</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {[
                    'Unlimited words generation',
                    'Higher-quality AI model priority',
                    'No daily or monthly restrictions',
                    'Exclusive template releases',
                    'Lifetime updates & features',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                {isPremium ? (
                  <Button
                    className="w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none flex items-center justify-center gap-2 cursor-default"
                    disabled
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Premium Active
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgradeClick}
                    className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold border-none shadow-lg shadow-primary/20 active:scale-95 transition"
                  >
                    Upgrade Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- STEP 2: CHECKOUT -------------------- */}
      {step === 'checkout' && (
        <div className="max-w-2xl mx-auto w-full">
          <button
            onClick={() => setStep('plans')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </button>

          <div className="bg-white border rounded-3xl p-6 md:p-8 shadow-sm grid md:grid-cols-1 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
              <p className="text-sm text-gray-500 mt-1">Simulated payment process. Do not enter actual credit card details.</p>

              {/* Dynamic Interactive Credit Card Graphic */}
              <div className="mt-6 w-full max-w-sm mx-auto h-48 bg-gradient-to-br from-[#704ef8] to-[#987bfb] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest">Card Issuer</p>
                    <h4 className="font-bold text-lg">TextGenie Pay</h4>
                  </div>
                  <CreditCard className="h-8 w-8 text-white/90" />
                </div>

                <div className="my-4">
                  <p className="font-mono text-lg tracking-widest text-white/90">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-white/60 uppercase tracking-widest">Card Holder</p>
                    <p className="font-medium text-xs truncate max-w-[150px] uppercase">
                      {cardName || 'YOUR NAME'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-white/60 uppercase tracking-widest">Expires</p>
                    <p className="font-mono text-xs">{expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm ${
                      errors.cardName ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''
                    }`}
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value)
                      if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: '' }))
                    }}
                  />
                  {errors.cardName && <p className="text-xs text-destructive mt-1">{errors.cardName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono ${
                      errors.cardNumber ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''
                    }`}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                  {errors.cardNumber && <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono ${
                        errors.expiry ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''
                      }`}
                      value={expiry}
                      onChange={handleExpiryChange}
                    />
                    {errors.expiry && <p className="text-xs text-destructive mt-1">{errors.expiry}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      CVC Code
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono ${
                        errors.cvc ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''
                      }`}
                      value={cvc}
                      onChange={handleCvcChange}
                    />
                    {errors.cvc && <p className="text-xs text-destructive mt-1">{errors.cvc}</p>}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t flex items-center justify-between text-sm mb-4">
                  <span className="font-semibold text-gray-600">Plan Amount</span>
                  <span className="font-bold text-gray-900">$9.99 / mo</span>
                </div>

                <Button
                  onClick={handlePay}
                  className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold border-none flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Security Checkout...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Pay $9.99 / Month
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- STEP 3: SUCCESS -------------------- */}
      {step === 'success' && (
        <div className="max-w-md mx-auto w-full text-center bg-white border rounded-3xl p-8 shadow-sm">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-6">
            <CheckCircle2 className="h-14 w-14" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">Upgrade Successful!</h2>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for purchasing **TextGenie Premium**, {user?.firstName || 'Creator'}. Your limits have been instantly updated.
          </p>

          <div className="my-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-left text-xs text-emerald-800 space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Receipt status:</span>
              <span>Paid - Simulator</span>
            </div>
            <div className="flex justify-between">
              <span>Account level:</span>
              <span>Premium Tier</span>
            </div>
            <div className="flex justify-between">
              <span>Word Limit:</span>
              <span>Unlimited Generations</span>
            </div>
          </div>

          <Link href="/dashboard">
            <Button className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold border-none">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Billing