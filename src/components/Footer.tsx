import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--primary)', color: 'var(--neutral-100)', paddingTop: '60px', paddingBottom: '30px', borderTop: '4px solid var(--accent)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          
          {/* Column 1: Organization & Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px', backgroundColor: 'white', borderRadius: '50%', padding: '4px', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/logo.png"
                  alt="APSCA Logo"
                  fill
                  style={{ objectFit: 'contain', padding: '4px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--neutral-white)', letterSpacing: '0.5px' }}>
                  APSCA
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  AP State Carpenters Association
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginBottom: '16px', lineHeight: 1.6 }}>
              APSCA carpenters deliver skilled craftsmanship, ensuring quality woodwork, structural integrity, and sustainable practices for public projects across Andhra Pradesh.
            </p>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }} className="telugu-text">
              ధన్యవాదములతో: ఆంధ్రప్రదేశ్ రాష్ట్ర కార్పెంటర్స్ (వడ్రంగి) అసోసియేషన్ - అధ్యక్షుడు రంగబాబు తాటికొండ.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={12} /> Registered Union
              </span>
              <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                <Award size={12} /> Skill India Partner
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Explore Us
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • About Us (శ్రీ విశ్వకర్మ చరిత్ర)
                </Link>
              </li>
              <li>
                <Link href="/members" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • State Leadership Committee
                </Link>
              </li>
              <li>
                <Link href="/carpenters" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • Search Carpenters Directory (4,614)
                </Link>
              </li>
              <li>
                <Link href="/register" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • Choose Membership Plan (Free / ₹300 / ₹900)
                </Link>
              </li>
              <li>
                <Link href="/events/indias-biggest-skill-competition" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • India's Biggest Skill Competition
                </Link>
              </li>
              <li>
                <Link href="/contact-us" style={{ color: '#E2E8F0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" style={{ color: 'var(--accent)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  • Admin Login Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Head Office Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, color: 'white' }}>Head Office:</div>
                  D.No.:-61-19-7/3 Ramalingeswara Nagar Vijayawada. Pin code: 520013, Andhra Pradesh, India.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                  <div style={{ fontWeight: 600, color: 'white' }}>Mail Address:</div>
                  <a href="mailto:apscapresident@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                    apscapresident@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                  <div style={{ fontWeight: 600, color: 'white' }}>Official Phone Numbers:</div>
                  <div style={{ color: '#CBD5E1', marginTop: '2px' }}>9399980781</div>
                  <div style={{ color: '#CBD5E1' }}>92901 24303</div>
                  <div style={{ color: '#CBD5E1' }}>9866820997</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Verification */}
          <div>
            <h4 style={{ color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Newsletter
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#CBD5E1', marginBottom: '14px', lineHeight: 1.5 }}>
              Signup our newsletter to get update information, promotion or insight regarding carpentry training and state welfare benefits.
            </p>

            {newsletterSuccess ? (
              <div style={{ backgroundColor: 'rgba(245, 179, 1, 0.15)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Thank you! You have been subscribed.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  required
                  placeholder="Your mail here..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%', fontWeight: 700 }}>
                  Subscribe
                </button>
              </form>
            )}

            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#94A3B8' }}>
              Connect with 7,500+ carpenters across all 26 districts of Andhra Pradesh.
            </div>
          </div>
        </div>

        {/* Bottom Bar with Exact Original Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            Copyright © 2022 rights reserved@Drushyanth Digital Marketing Services
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.85rem', color: '#CBD5E1' }}>
            <Link href="/about-us" style={{ color: '#CBD5E1' }}>About</Link>
            <span>•</span>
            <Link href="/members" style={{ color: '#CBD5E1' }}>Committee</Link>
            <span>•</span>
            <Link href="/carpenters" style={{ color: '#CBD5E1' }}>Directory</Link>
            <span>•</span>
            <Link href="/contact-us" style={{ color: '#CBD5E1' }}>Contact</Link>
            <span>•</span>
            <Link href="/admin" style={{ color: 'var(--accent)' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
