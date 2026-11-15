import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import {
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Hammer,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

const DISTRICTS = [
  'Srikakulam', 'Parvathipuram Manyam', 'Vizianagaram', 'Visakhapatnam',
  'Anakapalli', 'Alluri Sitharama Raju', 'Kurnool', 'Nandyal',
  'Sri Potti Sriramulu Nellore', 'Kakinada', 'Dr. B. R. Ambedkar Konaseema',
  'East Godavari', 'Eluru', 'Krishna', 'West Godavari', 'YSR Kadapa',
  'Anantapuramu', 'Sri Sathya Sai', 'NTR', 'Guntur', 'Bapatla',
  'Palnadu', 'Prakasam', 'Tirupati', 'Chittoor', 'Annamayya'
];

const SERVICES = [
  {
    title: 'Furniture Making',
    slug: 'furniture-making',
    desc: 'Timeless furniture designs built by skilled hands. Custom wardrobes, dining sets, and ergonomic modern home furniture.',
    img: '/images/service-furniture-making.jpg'
  },
  {
    title: 'Cabinet Makers',
    slug: 'cabinet-makers',
    desc: 'Modular cabinets, modern kitchen storage, and precision cupboards engineered to hold more in less time.',
    img: '/images/service-cabinet-makers.jpg'
  },
  {
    title: 'Wood Carving',
    slug: 'wood-carving',
    desc: 'Intricate traditional and contemporary carving by master artisans, preserving heritage craftsmanship.',
    img: '/images/service-wood-carving.jpg'
  },
  {
    title: 'Temple Wood Works',
    slug: 'temple-wood-works',
    desc: 'Sacred temple architecture, sanctum doors, ornate wooden chariots (rathams), and spiritual art.',
    img: '/images/service-temple-wood-works.jpg'
  },
  {
    title: 'Toys Making',
    slug: 'toys-making',
    desc: 'Traditional wooden toys, artisanal figures, and creative handicrafts promoting eco-friendly peace of mind.',
    img: '/images/service-toys-making.jpg'
  },
  {
    title: 'Boat Making',
    slug: 'boat-making',
    desc: 'Naval woodwork, traditional riverboats, catamarans, and specialized marine wood fabrication for fishermen.',
    img: '/images/service-boat-making.jpg'
  },
  {
    title: 'Vehicle Interior & Exterior',
    slug: 'vehicle-interior-exterior',
    desc: 'Custom wooden bus bodies, truck cabin framing, carriage woodwork, and specialized vehicle carpentry.',
    img: '/images/service-vehicle-interior.jpg'
  }
];

export default function Home() {
  return (
    <Layout
      title="APSCA - Andhra Pradesh State Carpenters Association"
      description="Empowering Andhra Pradesh carpenters through unity, job opportunities, training, and support for a stronger future."
    >
      {/* 1. HERO BANNER */}
      <section
        style={{
          position: 'relative',
          minHeight: '620px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--primary-dark)',
          color: 'white',
          overflow: 'hidden',
          padding: '80px 0'
        }}
      >
        {/* Background Image with Dark Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/hero-carpenter.jpg"
            alt="Carpentry Craftsmanship in Andhra Pradesh"
            fill
            style={{ objectFit: 'cover', opacity: 0.28 }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(15,26,48,0.96) 0%, rgba(26,43,76,0.85) 60%, rgba(26,43,76,0.65) 100%)'
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245, 179, 1, 0.15)', border: '1px solid var(--accent)', padding: '6px 14px', borderRadius: 'var(--radius-full)', marginBottom: '20px' }}>
              <ShieldCheck size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Welcome to Our APSCA Carpenter Family
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '18px' }}>
              Empowering Andhra Pradesh Carpenters
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#E2E8F0', marginBottom: '20px', lineHeight: 1.6, fontWeight: 400 }}>
              Empowering Andhra Pradesh carpenters through unity, job opportunities, training, and support for a stronger future.
            </p>

            <p className="telugu-text" style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '30px', fontWeight: 600 }}>
              చేతి వృత్తితో దేశ నిర్మాణంలో పాలుపంచుకుంటున్న వడ్రంగి సోదరుల ఐక్యవేదిక!
            </p>

            <div className="hero-buttons-wrap" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/register" className="btn btn-secondary btn-lg" style={{ boxShadow: 'var(--shadow-secondary)' }}>
                <Award size={20} />
                <span>Become a Member / Register</span>
              </Link>

              <Link href="/carpenters" className="btn btn-accent btn-lg">
                <Users size={20} />
                <span>Search 4,614 Carpenters</span>
              </Link>

              <Link href="/about-us" className="btn btn-outline-white btn-lg">
                <span>Learn Our History</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Quick Stats Pill */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '45px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>7,500+</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Carpenters United</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>26</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Districts of AP</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>4,614</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Registered Profiles</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Govt Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OM NAMO VISWAKARMA & PRESIDENT'S HISTORICAL MESSAGE */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Left Column: President & Telugu Message */}
            <div className="card" style={{ backgroundColor: '#FFFDF5', borderColor: '#FDE68A', padding: '32px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Hammer size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Om Namo Viswakarma</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>ఓం నమో విశ్వకర్మ</div>
                </div>
              </div>

              <div className="telugu-text" style={{ fontSize: '1.05rem', color: 'var(--neutral-800)', lineHeight: 1.8, marginBottom: '20px' }}>
                <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px' }}>
                  గౌరవప్రథమైన వడ్రంగి వృత్తి చేస్తున్న సోదరులారా,
                </p>
                <p style={{ marginBottom: '12px' }}>
                  ధన్యవాదములతో: ఆంధ్రప్రదేశ్ రాష్ట్ర కార్పెంటర్స్ (వడ్రంగి) అసోసియేషన్ అధ్యక్షుడు <strong>రంగబాబు తాటికొండ</strong>.
                </p>
                <p>
                  చేతి వృత్తితో దేశ నిర్మాణంలో పాలుపంచుకుంటున్న ప్రతి వడ్రంగి గౌరవంగా, ఆత్మవిశ్వాసంతో జీవించేలా రాష్ట్రవ్యాప్తంగా మన అసోసియేషన్ అండగా నిలుస్తోంది.
                </p>
              </div>

              <div style={{ padding: '16px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                  Join Us Our Union: apsca.co.in
                </div>
                <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
                  Connect directly with state and district committee leadership.
                </div>
              </div>
            </div>

            {/* Right Column: Historical Narrative (Takshaka, Jesus, Prophet Zakariya, Jai Jawan Jai Kisan) */}
            <div>
              <div className="badge badge-secondary" style={{ marginBottom: '12px' }}>
                Carpenters Journey
              </div>
              <h2 style={{ fontSize: '2.1rem', marginBottom: '18px', color: 'var(--primary)' }}>
                Universal Occupation: The Backbone of Civilization
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--neutral-700)', marginBottom: '16px', lineHeight: 1.7 }}>
                India has taught civilization to the world in the first place. In the Sikh religion in the current Punjab region, carpenter profession is traditionally known as <strong>“Takshaka”</strong>. As the first Taksila University in the same world, people came here for education and expertise in the field of construction in their countries.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--neutral-700)', marginBottom: '16px', lineHeight: 1.7 }}>
                Carpenter occupation is the Universal Occupation. This profession is honored in the Christian Bible, recognizing that Jesus Christ worked as a carpenter. Islamic traditions record that Prophet Zakariya, a prominent prophet, earned his livelihood through this sacred craft.
              </p>

              {/* Patriotic Quote Box */}
              <div style={{ backgroundColor: 'var(--primary-soft)', borderLeft: '4px solid var(--secondary)', padding: '16px 20px', borderRadius: '0 var(--radius-md) var(--radius-md) 0', margin: '20px 0' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem', marginBottom: '6px' }}>
                  “Jai Jawan, Jai Kisan”
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--neutral-800)', fontSize: '0.95rem' }}>
                  This is the slogan of this country. But never forget the carpenter who makes the gun for the Jawan and the plow for the Kisan.
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--neutral-600)' }}>
                The structure of this country was built with the hands of carpenters. Such a carpenter should always be happy. Every carpenter must have work every day with sustainable income and social dignity.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SKILL INDIA COMPETITIONS SECTION */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-subtitle">Competition For Carpenters</div>
            <h2 className="section-title">Skill India & Global Opportunities</h2>
            <p className="section-desc">
              Dear All, Registrations for the IndiaSkills Competition 2025 have been launched on the Skill India Digital Hub (SIDH).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--secondary)' }}>
              <div>
                <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
                  <Image
                    src="/images/WhatsApp-Image-2024-10-20-at-11.48.14_c9dac03c.webp"
                    alt="India's Biggest Skill Competition"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="badge badge-secondary" style={{ marginBottom: '10px' }}>National Level</div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>India's Biggest Skill Competition</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--neutral-600)', marginBottom: '16px' }}>
                  In collaboration with Skill India, we are working to empower the carpentry profession in Andhra Pradesh and equip carpenters with modern machinery and global vocational skills.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--neutral-200)' }}>
                <Link href="/events/indias-biggest-skill-competition" className="btn btn-outline-primary btn-sm">
                  View More <ArrowRight size={14} />
                </Link>
                <a
                  href="https://www.skillindiadigital.gov.in/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                >
                  Skill India Portal <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
              <div>
                <div style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
                  <Image
                    src="/images/WhatsApp-Image-2024-10-20-at-12.01.05_d829010b.webp"
                    alt="World Skill Competition"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="badge badge-primary" style={{ marginBottom: '10px' }}>International Level</div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>World Skill Competition</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--neutral-600)', marginBottom: '16px' }}>
                  The WorldSkills Competition is a premier global event showcasing vocational talent. Young professionals from across nations compete in carpentry and joinery with advanced craftsmanship.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--neutral-200)' }}>
                <Link href="/events/world-skill-competition-2" className="btn btn-outline-primary btn-sm">
                  View More <ArrowRight size={14} />
                </Link>
                <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                  Global Benchmark
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TOP CARPENTRY SERVICES IN ANDHRA PRADESH */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-subtitle">Specialized Disciplines</div>
            <h2 className="section-title">Top Carpentry & Woodworking Services in Andhra Pradesh</h2>
            <p className="section-desc">
              Explore the versatile masteries of Andhra Pradesh carpenters, preserving traditional heritage while leading modern interior construction.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {SERVICES.map((svc) => (
              <div key={svc.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ position: 'relative', height: '170px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                    <Image
                      src={svc.img}
                      alt={svc.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--primary)' }}>{svc.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', marginBottom: '16px', lineHeight: 1.5 }}>
                    {svc.desc}
                  </p>
                </div>
                <Link
                  href={`/services/${svc.slug}`}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  View Details <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MEMBERSHIP PLANS (EXACT OLD SITE PRICING: ₹0, ₹300, ₹900) */}
      <section className="section" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid var(--neutral-200)', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-subtitle">Price Package</div>
            <h2 className="section-title">Choose Your Membership Plan</h2>
            <p className="section-desc">
              Join the official state association with transparent government-aligned benefits and complete verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '28px', maxWidth: '1080px', margin: '0 auto' }}>
            
            {/* Plan 1: General membership (₹0) */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--neutral-400)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>General membership</h3>
                  <span className="badge badge-primary">Free</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '20px 0' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)' }}>₹ 0</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>/ Lifetime</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Submit member details officially
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Ensure government compliance
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Data stays confidential
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/register?plan=general"
                  className="btn btn-outline-primary"
                  style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}
                >
                  Purchase Now
                </Link>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', textAlign: 'center', marginTop: '8px' }}>
                  *no additional fees after completion
                </div>
              </div>
            </div>

            {/* Plan 2: State Committee membership (₹300) */}
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid var(--secondary)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  backgroundColor: 'var(--secondary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase'
                }}
              >
                Most Popular
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>State Committee membership</h3>
                  <span className="badge badge-secondary">Premium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '20px 0' }}>
                  <span style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--secondary)' }}>₹ 300</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>/ Annual</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--secondary)" /> Reserved for active members
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--secondary)" /> Level Four Certificate awarded
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    <CheckCircle size={16} color="var(--secondary)" /> Accident / death aid given
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--secondary)" /> Only actives can contest
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/register?plan=committee"
                  className="btn btn-secondary"
                  style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}
                >
                  Purchase Now
                </Link>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', textAlign: 'center', marginTop: '8px' }}>
                  *no additional fees after completion
                </div>
              </div>
            </div>

            {/* Plan 3: State Executive Membership (₹900) */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>State Executive Membership</h3>
                  <span className="badge badge-accent">Advanced</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '20px 0' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)' }}>₹ 900</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>/ Multi-Year</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-700)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Support for active trainees
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> QR ID cards given
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Certificate after training
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> Accident / death help offered
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                    <CheckCircle size={16} color="var(--secondary)" /> Voting rights for members
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/register?plan=executive"
                  className="btn btn-accent"
                  style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}
                >
                  Purchase Now
                </Link>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', textAlign: 'center', marginTop: '8px' }}>
                  *no additional fees after completion
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MASTERPIECES BY OUR CARPENTERS (ORIGINAL PHOTO GALLERY) */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-subtitle">Masterpieces</div>
            <h2 className="section-title">Masterpieces by Our Carpenters</h2>
            <p className="section-desc">
              Authentic work samples crafted with dedication and precision across Andhra Pradesh workshops.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ position: 'relative', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="/images/WhatsApp-Image-2025-11-28-at-3.30.44-PM.jpeg"
                alt="Carpenter work sample 1"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'relative', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="/images/WhatsApp-Image-2025-11-28-at-3.30.44-PM-1.jpeg"
                alt="Carpenter work sample 2"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'relative', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="/images/WhatsApp-Image-2025-11-28-at-3.30.44-PM-2.jpeg"
                alt="Carpenter work sample 3"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'relative', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src="/images/banner-image.jpg"
                alt="APSCA Banner Work"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. ALL 26 DISTRICT PORTALS QUICK ACCESS - High Contrast & Clearly Visible at all times */}
      <section className="section" style={{ backgroundColor: '#0F1A30', color: 'white', borderTop: '4px solid var(--accent)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px auto' }}>
            <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
              Statewide Connectivity
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.1rem', fontWeight: 800, marginBottom: '12px' }}>
              Connect with Carpenters Across All 26 Districts
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '1rem' }}>
              Each district features a dedicated portal showing the local committee leaders, registered carpenters, addresses, and contact numbers.
            </p>
          </div>

          <div className="districts-home-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {DISTRICTS.map((dist) => {
              const slug = dist.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link
                  key={dist}
                  href={`/districts/${slug}`}
                  className="district-card-btn"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1.5px solid rgba(255, 255, 255, 0.24)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--secondary)';
                    e.currentTarget.style.borderColor = 'var(--secondary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(200, 30, 30, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.24)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)';
                  }}
                >
                  <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#FFFFFF' }}>{dist}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
