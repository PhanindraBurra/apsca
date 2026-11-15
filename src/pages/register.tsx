import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  Award,
  ShieldCheck,
  CheckCircle,
  Upload,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const DISTRICTS = [
  'Srikakulam', 'Parvathipuram Manyam', 'Vizianagaram', 'Visakhapatnam',
  'Anakapalli', 'Alluri Sitharama Raju', 'Kurnool', 'Nandyal',
  'Sri Potti Sriramulu Nellore', 'Kakinada', 'Dr. B. R. Ambedkar Konaseema',
  'East Godavari', 'Eluru', 'Krishna', 'West Godavari', 'YSR Kadapa',
  'Anantapuramu', 'Sri Sathya Sai', 'NTR', 'Guntur', 'Bapatla',
  'Palnadu', 'Prakasam', 'Tirupati', 'Chittoor', 'Annamayya'
];

const PLANS = [
  {
    id: 'general',
    name: 'General membership',
    tier: 'Free',
    price: 0,
    validity: 'Lifetime',
    color: 'var(--primary)',
    features: [
      'Submit member details officially',
      'Ensure government compliance',
      'Data stays confidential',
      '*no additional fees after completion'
    ]
  },
  {
    id: 'committee',
    name: 'State Committee membership',
    tier: 'Premium',
    price: 300,
    validity: '1 Year',
    color: 'var(--secondary)',
    popular: true,
    features: [
      'Reserved for active members',
      'Level Four Certificate awarded',
      'Accident / death aid given',
      'Only actives can contest',
      '*no additional fees after completion'
    ]
  },
  {
    id: 'executive',
    name: 'State Executive Membership',
    tier: 'Advanced',
    price: 900,
    validity: '3 Years',
    color: 'var(--accent)',
    features: [
      'Support for active trainees',
      'QR ID cards given',
      'Certificate after training',
      'Accident / death help offered',
      'Voting rights for members',
      '*no additional fees after completion'
    ]
  }
];

export default function Register() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState('committee');

  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    city: '',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    pincode: '',
    organization: 'Furniture Making & Carpentry',
    local_union_address: '',
    nominee_name: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [idProofPreview, setIdProofPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-select plan from query parameter
  useEffect(() => {
    if (router.query.plan && typeof router.query.plan === 'string') {
      const p = router.query.plan.toLowerCase();
      if (['general', 'committee', 'executive'].includes(p)) {
        setSelectedPlanId(p);
      }
    }
  }, [router.query.plan]);

  const activePlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  // Helper to downscale and compress images client-side before sending
  const compressImage = (file: File, maxWidth = 900, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Handlers
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please choose a smaller photo.');
        return;
      }
      try {
        const compressed = await compressImage(file, 800, 0.82);
        setPhotoPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleIdProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please choose a smaller file.');
        return;
      }
      try {
        const compressed = await compressImage(file, 1000, 0.82);
        setIdProofPreview(compressed);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setIdProofPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        membership_plan: activePlan.name,
        amount: activePlan.price,
        photo_url: photoPreview,
        id_proof_url: idProofPreview,
      };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration.');
      }

      // If already active paid member -> go directly to confirmation/ID card
      if (data.is_paid || (data.payment_status && ['paid', 'free'].includes(data.payment_status))) {
        router.push(`/confirmation?id=${data.membership_id}`);
        return;
      }

      // If Free Plan -> direct to confirmation
      if (activePlan.price === 0 || data.amount === 0) {
        router.push(`/confirmation?id=${data.membership_id}`);
      } else {
        // If Paid Plan -> redirect to checkout with membership_id
        router.push(`/checkout?id=${data.membership_id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
      // Scroll to error if visible
      setTimeout(() => {
        const errEl = document.getElementById('register-error-banner');
        if (errEl) {
          errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Become a Member / Register - APSCA"
      description="Register for official Andhra Pradesh State Carpenters Association membership. Choose your plan, submit details, and receive your digital membership ID."
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            Official Membership Registration
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            Become a Member / Register
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            Join 7,500+ carpenters across all 26 districts of Andhra Pradesh for legal protection, welfare, and training.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          {/* Step 1: Membership Plan Selection */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>Step 1 of 2</div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                Choose Your Membership Plan
              </h2>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>
                Select the plan that matches your engagement level. Details are aligned with the state association constitution.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${plan.color}` : '1px solid var(--neutral-300)',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--neutral-50)',
                      boxShadow: isSelected ? 'var(--shadow-lg)' : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {plan.popular && (
                      <div style={{ position: 'absolute', top: '-10px', right: '16px', backgroundColor: 'var(--secondary)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                        Recommended
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{plan.name}</h3>
                        <span className="badge" style={{ backgroundColor: isSelected ? plan.color : 'var(--neutral-200)', color: isSelected ? 'white' : 'var(--neutral-800)' }}>
                          {plan.tier}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '14px 0' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: plan.color }}>
                          ₹ {plan.price}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neutral-600)' }}>
                          / {plan.validity}
                        </span>
                      </div>

                      <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {plan.features.map((feat, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--neutral-700)' }}>
                            <CheckCircle size={14} color={plan.color} style={{ flexShrink: 0 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--neutral-200)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? plan.color : 'var(--neutral-600)' }}>
                        {isSelected ? '✓ Plan Selected' : 'Click to Select Plan'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Member Details Form */}
          <div className="card" style={{ padding: '40px', borderTop: '4px solid var(--secondary)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div className="badge badge-primary" style={{ marginBottom: '8px' }}>Step 2 of 2</div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                Member Registration Details
              </h2>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>
                Applying for: <strong style={{ color: 'var(--secondary)' }}>{activePlan.name}</strong> (Fee: ₹{activePlan.price})
              </p>
            </div>

            {errorMsg && (
              <div
                id="register-error-banner"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Personal Details */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--secondary)" /> Personal Identification
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name (as per Aadhaar / Official Record) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tatikonda Ranga Babu"
                      className="form-control"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth (DOB) *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information & Duplicate Protection */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={18} color="var(--secondary)" /> Contact & Communication
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      className="form-control"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)' }}>Used for SMS alerts & membership lookup</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. carpenter@gmail.com"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)' }}>Used for digital receipt & certificate delivery</span>
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--secondary)" /> Address & District
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Door No. / Street / Village Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. D.No 12-4, Main Bazaar, Near Temple"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Town / Mandal *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vijayawada / Rajahmundry"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">District (Andhra Pradesh) *</label>
                    <select
                      className="form-control"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PIN Code (6 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 520013"
                      className="form-control"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control"
                      value="Andhra Pradesh"
                      style={{ backgroundColor: 'var(--neutral-100)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Trade, Profession & Local Union (from Old Website) */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="var(--secondary)" /> Profession, Union & Nominee
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Profession / Carpentry Specialization *</label>
                    <select
                      className="form-control"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    >
                      <option value="Furniture Making">Furniture Making</option>
                      <option value="Cabinet Makers">Cabinet Makers & Modular</option>
                      <option value="Wood Carving">Wood Carving Artisan</option>
                      <option value="Temple Wood Works">Temple Wood Works & Chariots</option>
                      <option value="Toys Making">Artisanal Toys Making</option>
                      <option value="Boat Making">Boat Making & Marine Woodwork</option>
                      <option value="Vehicle Interior & Exterior">Vehicle Interior & Exterior</option>
                      <option value="General Carpentry Contractor">General Carpentry Contractor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Local Union Name / Address (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Tadepalligudem Carpenters Welfare Union"
                      className="form-control"
                      value={formData.local_union_address}
                      onChange={(e) => setFormData({ ...formData, local_union_address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nominee Name (for welfare & insurance) (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Family Nominee"
                      className="form-control"
                      value={formData.nominee_name}
                      onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Document & Photo Upload */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} color="var(--secondary)" /> Photo & ID Proof Upload
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Photo Upload */}
                  <div className="form-group">
                    <label className="form-label">Passport Size Photo (for ID Card)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="form-control"
                    />
                    {photoPreview && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--neutral-300)' }}>
                          <Image src={photoPreview} alt="Photo Preview" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>✓ Photo Attached</span>
                      </div>
                    )}
                  </div>

                  {/* ID Proof Upload */}
                  <div className="form-group">
                    <label className="form-label">ID Proof (Aadhaar / Voter ID / Ration Card)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdProofUpload}
                      className="form-control"
                    />
                    {idProofPreview && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--neutral-300)' }}>
                          <Image src={idProofPreview} alt="ID Preview" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>✓ ID Proof Attached</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Error Notification */}
              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#B91C1C',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ backgroundColor: 'var(--neutral-100)', padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Total Payable Amount: <span style={{ color: 'var(--secondary)' }}>₹ {activePlan.price}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                    {activePlan.price === 0
                      ? 'Free membership with instant digital confirmation.'
                      : `Selected: ${activePlan.name} • Secure online payment.`}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-secondary btn-lg"
                  style={{ minWidth: '240px', fontWeight: 700 }}
                >
                  {loading ? (
                    'Processing Registration...'
                  ) : activePlan.price === 0 ? (
                    'Complete Free Registration'
                  ) : (
                    <>
                      <span>Proceed to Payment (₹{activePlan.price})</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </Layout>
  );
}
