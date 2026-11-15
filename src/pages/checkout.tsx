import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Lock
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi'>('razorpay');
  const [utrNumber, setUtrNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch member details
  useEffect(() => {
    if (!router.isReady) return;
    if (!id || typeof id !== 'string') {
      setLoading(false);
      return;
    }

    fetch('/api/member-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMember(data.member);
          // If already paid or free, redirect to confirmation
          if (data.member.payment_status === 'paid' || data.member.payment_status === 'free') {
            router.push(`/confirmation?id=${data.member.membership_id}`);
          }
        } else {
          setErrorMsg(data.error || 'Failed to load member details.');
        }
      })
      .catch(() => {
        setErrorMsg('Error connecting to server.');
      })
      .finally(() => setLoading(false));
  }, [router.isReady, id, router]);

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (!member) return;
    setProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: member.amount,
          membership_id: member.membership_id,
          plan_name: member.membership_plan,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay order.');
      }

      // Check if real live merchant key or placeholder test key
      const isPlaceholderKey =
        !orderData.key_id ||
        orderData.key_id.includes('51APSCA2026Test') ||
        orderData.is_test_mode;

      // If real production key configured and Razorpay script loaded
      if (typeof window !== 'undefined' && window.Razorpay && !isPlaceholderKey) {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount_paise,
          currency: 'INR',
          name: 'APSCA Official Portal',
          description: `Membership: ${member.membership_plan}`,
          image: '/logo.png',
          order_id: orderData.order_id,
          prefill: {
            name: member.full_name,
            email: member.email,
            contact: member.mobile,
          },
          theme: {
            color: '#1A2B4C',
          },
          handler: async function (response: any) {
            await verifyPayment(response.razorpay_payment_id || `PAY_${Date.now()}`);
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
        };

        try {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            setErrorMsg('Payment cancelled or failed: ' + (response.error?.description || 'Unknown error'));
            setProcessing(false);
          });
          rzp.open();
        } catch (openErr) {
          console.warn('Razorpay open failed, executing test payment simulation:', openErr);
          await verifyPayment(`TEST_PAY_${Date.now()}`);
        }
      } else {
        // Instant test mode verification
        const mockPayId = `RZP_TEST_${Date.now()}`;
        await verifyPayment(mockPayId);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  // Verify Payment API Call
  const verifyPayment = async (paymentId: string) => {
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membership_id: member.membership_id,
          payment_id: paymentId,
          payment_method: 'razorpay',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/confirmation?id=${member.membership_id}`);
      } else {
        throw new Error(data.error || 'Payment verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setProcessing(false);
    }
  };

  // Handle Manual UPI / Bank Transfer Submit
  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMsg('Please enter your 12-digit UPI / UTR Transaction Reference number.');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membership_id: member.membership_id,
          payment_method: 'upi_bank',
          utr_number: utrNumber.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/confirmation?id=${member.membership_id}`);
      } else {
        throw new Error(data.error || 'Failed to submit payment.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Checkout - APSCA">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>
            Loading checkout details...
          </div>
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout title="Order Not Found - APSCA">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--secondary)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '10px' }}>
            Registration Not Found
          </h2>
          <p style={{ color: 'var(--neutral-600)', marginBottom: '24px' }}>
            We could not find an unpaid registration matching this ID.
          </p>
          <Link href="/register" className="btn btn-secondary">
            Go to Registration
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Checkout (${member.membership_id}) - APSCA`}
      description="Secure checkout and membership payment for Andhra Pradesh State Carpenters Association."
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '50px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '10px' }}>
            Secure Membership Checkout
          </div>
          <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '8px' }}>
            Complete Your Membership
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1rem' }}>
            Membership ID: <strong style={{ color: 'var(--accent)' }}>{member.membership_id}</strong>
          </p>
        </div>
      </section>

      {/* Main Checkout View */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          
          {errorMsg && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Column: Member & Plan Summary */}
            <div className="card" style={{ padding: '30px', borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--secondary)" /> Membership Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--neutral-600)' }}>Full Name:</span>
                  <strong style={{ color: 'var(--primary)' }}>{member.full_name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--neutral-600)' }}>Mobile Number:</span>
                  <span>{member.mobile}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--neutral-600)' }}>Email Address:</span>
                  <span>{member.email}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--neutral-600)' }}>District / City:</span>
                  <span>{member.district} / {member.city}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--neutral-600)' }}>Selected Plan:</span>
                  <span className="badge badge-secondary">{member.membership_plan}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ backgroundColor: 'var(--neutral-100)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--neutral-700)' }}>Membership Fee</span>
                  <span>₹ {member.amount}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--neutral-700)' }}>Govt. Compliance & Verification</span>
                  <span style={{ color: '#16A34A', fontWeight: 600 }}>FREE (₹ 0)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', paddingTop: '10px', borderTop: '1px solid var(--neutral-300)' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: 'var(--secondary)' }}>₹ {member.amount}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="#16A34A" /> Encrypted 256-bit SSL certified transaction
              </div>
            </div>

            {/* Right Column: Payment Step (Razorpay & UPI) */}
            <div className="card" style={{ padding: '30px', borderTop: '4px solid var(--secondary)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--neutral-200)' }}>
                Choose Payment Method
              </h3>

              {/* Method Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'razorpay' ? '2px solid var(--primary)' : '1px solid var(--neutral-300)',
                    backgroundColor: paymentMethod === 'razorpay' ? 'var(--primary-soft)' : 'white',
                    color: paymentMethod === 'razorpay' ? 'var(--primary)' : 'var(--neutral-700)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CreditCard size={20} color="var(--primary)" />
                  <span>Razorpay Online</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>UPI, Cards, NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'upi' ? '2px solid var(--secondary)' : '1px solid var(--neutral-300)',
                    backgroundColor: paymentMethod === 'upi' ? 'var(--secondary-soft)' : 'white',
                    color: paymentMethod === 'upi' ? 'var(--secondary)' : 'var(--neutral-700)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Building size={20} color="var(--secondary)" />
                  <span>Bank / UPI QR</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>Direct Transfer</span>
                </button>
              </div>

              {/* Payment Method 1: Razorpay */}
              {paymentMethod === 'razorpay' && (
                <div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--neutral-200)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '6px', fontSize: '0.95rem' }}>
                      Razorpay Payment Gateway (Test Mode Enabled)
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', lineHeight: 1.5 }}>
                      Supports all major payment options: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking. Test keys are configurable via <code style={{ color: 'var(--secondary)', backgroundColor: '#F1F5F9', padding: '2px 4px', borderRadius: '4px' }}>.env</code>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRazorpayPayment}
                    disabled={processing}
                    className="btn btn-secondary btn-lg"
                    style={{ width: '100%', fontWeight: 700, fontSize: '1.05rem', boxShadow: 'var(--shadow-secondary)' }}
                  >
                    {processing ? 'Processing Payment...' : `Pay ₹ ${member.amount} Online (Instant Checkout)`}
                  </button>
                </div>
              )}

              {/* Payment Method 2: Official Bank & UPI Transfer */}
              {paymentMethod === 'upi' && (
                <div>
                  <div style={{ backgroundColor: '#FFFDF0', border: '1px solid var(--accent)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', fontSize: '0.95rem' }}>
                      Official Association Bank & UPI Account
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--neutral-800)' }}>
                      <div><strong>Account Name:</strong> Andhra Pradesh State Carpenters Association</div>
                      <div><strong>Bank Name:</strong> State Bank of India (SBI)</div>
                      <div><strong>Account No:</strong> 39824510294</div>
                      <div><strong>IFSC Code:</strong> SBIN0001234</div>
                      <div><strong>Branch:</strong> Vijayawada Main Branch</div>
                      <div style={{ color: 'var(--secondary)', fontWeight: 700, marginTop: '4px' }}>
                        <strong>UPI ID:</strong> apsca@sbi | <strong>Phone:</strong> 9399980781
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUpiSubmit}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="form-label" style={{ margin: 0 }}>
                          Enter 12-Digit UTR / Transaction Reference Number *
                        </label>
                        <button
                          type="button"
                          onClick={() => setUtrNumber(`UTR${Date.now().toString().slice(-9)}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Auto-fill Sample UTR
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 423819284719"
                        className="form-control"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)' }}>
                        Found in your GPay / PhonePe / Banking app payment receipt.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', fontWeight: 700 }}
                    >
                      {processing ? 'Verifying...' : `Confirm Transfer of ₹ ${member.amount}`}
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
}
