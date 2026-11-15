import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Building,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <Layout
      title="Contact Us - APSCA"
      description="Get in touch with the Andhra Pradesh State Carpenters Association (APSCA) Head Office in Vijayawada, Andhra Pradesh."
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            State Headquarters
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            Get in touch with us. We are located in Vijayawada, Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '36px', alignItems: 'start' }}>
            
            {/* Contact Details & Map Card */}
            <div>
              <div className="card" style={{ padding: '36px', marginBottom: '28px', borderTop: '4px solid var(--secondary)' }}>
                <div className="badge badge-secondary" style={{ marginBottom: '12px' }}>Where to find us</div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '12px' }}>
                  Reach us
                </h2>
                <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.6 }}>
                  Visit us at our convenient location to explore our collections in person. We are located in a prime, easily accessible area with ample parking for your comfort.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Address */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                        Head Office
                      </h3>
                      <p style={{ color: 'var(--neutral-700)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        D.No.:-61-19-7/3 Ramalingeswara Nagar Vijayawada. Pin code: 520013, Andhra Pradesh, India.
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                        Mail Address
                      </h3>
                      <a href="mailto:apscapresident@gmail.com" style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.95rem' }}>
                        apscapresident@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                        Official Phone Numbers
                      </h3>
                      <div style={{ color: 'var(--neutral-800)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <a href="tel:9399980781">9399980781</a>
                        <a href="tel:9290124303">92901 24303</a>
                        <a href="tel:9866820997">9866820997</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--neutral-200)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neutral-600)', fontSize: '0.85rem' }}>
                  <Clock size={16} color="var(--secondary)" /> Working Hours: Monday to Saturday (9:00 AM - 6:00 PM)
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div>
              <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--primary)' }}>
                <div className="badge badge-primary" style={{ marginBottom: '12px' }}>Send a Message</div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>
                  Get in touch with us
                </h2>
                <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem', marginBottom: '24px' }}>
                  Have questions about membership, training, district committees, or legal welfare? Send our executive office a message.
                </p>

                {submitted ? (
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <CheckCircle size={44} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ color: '#166534', fontSize: '1.3rem', marginBottom: '8px' }}>
                      Message Received!
                    </h3>
                    <p style={{ color: '#15803D', fontSize: '0.95rem', marginBottom: '16px' }}>
                      Thank you for contacting APSCA. Our Vijayawada office will contact you shortly on your provided phone number or email.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          className="form-control"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">District (Andhra Pradesh)</label>
                        <input
                          type="text"
                          placeholder="e.g. Krishna / Guntur"
                          className="form-control"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        placeholder="Inquiry subject..."
                        className="form-control"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Message *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your message or inquiry here..."
                        className="form-control"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-secondary btn-lg"
                      style={{ width: '100%', fontWeight: 700, marginTop: '8px' }}
                    >
                      {loading ? 'Sending...' : 'Send Message to APSCA'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
}
