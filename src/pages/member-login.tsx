import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Phone,
  Search,
  ArrowRight
} from 'lucide-react';

export default function MemberLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/member-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect to their confirmation / profile card
        router.push(`/confirmation?id=${data.member.membership_id}`);
      } else {
        throw new Error(data.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Member Login & Profile Lookup - APSCA"
      description="Access your APSCA membership profile, digital ID card, and payment receipt."
    >
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            Member Access Portal
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            Member Login
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            Access your verified membership profile, download receipt, or view ID card.
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '600px' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          
          <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--secondary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <UserCheck size={28} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                Member Profile Lookup
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                Enter your 10-digit mobile number or Membership ID (e.g. APSCA-2026-0001)
              </p>
            </div>

            {errorMsg && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Mobile Number or Membership ID</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9491552702 or APSCA-2026-0001"
                    className="form-control"
                    style={{ paddingLeft: '42px', height: '48px' }}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-secondary"
                style={{ width: '100%', height: '46px', fontWeight: 700 }}
              >
                {loading ? 'Verifying...' : 'Login & View Membership Card'}
              </button>
            </form>

            {/* Quick Demo Credentials for Instant Testing */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'var(--neutral-100)',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={14} color="var(--secondary)" />
                <span>Demo Accounts (Click to Fill)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIdentifier('9848022338')}
                  style={{
                    background: 'white',
                    border: '1px solid var(--neutral-300)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neutral-300)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>9848022338</span>
                  <span style={{ color: 'var(--neutral-600)', fontSize: '0.78rem' }}>Ramesh Chari (Verified Life Member)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIdentifier('9399980781')}
                  style={{
                    background: 'white',
                    border: '1px solid var(--neutral-300)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neutral-300)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>9399980781</span>
                  <span style={{ color: 'var(--neutral-600)', fontSize: '0.78rem' }}>K. Venkateswara Rao (President)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIdentifier('000154')}
                  style={{
                    background: 'white',
                    border: '1px solid var(--neutral-300)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-soft)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neutral-300)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>ID: 000154</span>
                  <span style={{ color: 'var(--neutral-600)', fontSize: '0.78rem' }}>State Directory Carpenter Roll</span>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--neutral-200)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', marginBottom: '8px' }}>
                Not registered yet?
              </div>
              <Link href="/register" className="btn btn-outline-primary btn-sm">
                Apply for Membership
              </Link>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}
