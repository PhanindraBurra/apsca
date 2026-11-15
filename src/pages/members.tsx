import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  Award,
  Users,
  ShieldCheck,
  Phone,
  ArrowRight,
  Hammer
} from 'lucide-react';

const STATE_LEADERS = [
  {
    name: 'TATIKONDA RANGA BABU',
    role: 'State President',
    roleTelugu: 'రాష్ట్ర అధ్యక్షుడు',
    img: '/images/1-1024x1024.png',
  },
  {
    name: 'PEDAPUDI NARASIMHA MURTHY',
    role: 'State General Secretary',
    roleTelugu: 'రాష్ట్ర ప్రధాన కార్యదర్శి',
    img: '/images/3-300x300.png',
  },
  {
    name: 'SHAIK SHAMSHEER',
    role: 'State Treasurer',
    roleTelugu: 'రాష్ట్ర కోశాధికారి',
    img: '/images/2-1024x1024.png',
  },
  {
    name: 'VEMULA DURGA PRASAD',
    role: 'State Honorable President',
    roleTelugu: 'రాష్ట్ర గౌరవాధ్యక్షులు',
    img: '/images/worker-holding-an-electric-drill.jpg',
  },
  {
    name: 'V.VERAYAH (CHINNABABU)',
    role: 'State Vice President',
    roleTelugu: 'రాష్ట్ర ఉపాధ్యక్షుడు',
    img: '/images/the-carpenter-works-with-a-tree-1.jpg',
  },
  {
    name: 'SK.KHALEEL',
    role: 'State Vice President',
    roleTelugu: 'రాష్ట్ర ఉపాధ్యక్షుడు',
    img: '/images/12-menuisier.jpeg',
  },
  {
    name: 'N.VEERABRAHMAYYA',
    role: 'State Vice President',
    roleTelugu: 'రాష్ట్ర ఉపాధ్యక్షుడు',
    img: '/images/craftsman-workshop.jpg',
  },
  {
    name: 'K.BHASKARA CHARI',
    role: 'State Disciplinary Convenor Committee',
    roleTelugu: 'రాష్ట్ర క్రమశిక్షణ కమిటీ కన్వీనర్',
    img: '/images/wood-carving-art.jpg',
  },
];

export default function Members() {
  return (
    <Layout
      title="Members & Leadership - APSCA"
      description="Meet the State Committee Leadership and executive representatives of the Andhra Pradesh State Carpenters Association."
    >
      {/* Page Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            State Committee Leadership
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>Our Team</h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>
            Introducing our best carpenters and state leadership committee.
          </p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div className="section-subtitle">Our Team</div>
            <h2 className="section-title">State Leadership Committee</h2>
            <p className="section-desc">
              Dedicated representatives leading the welfare, skill development, and legal recognition of carpenters across Andhra Pradesh.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {STATE_LEADERS.map((leader, index) => (
              <div
                key={index}
                className="card"
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderTop: index === 0 ? '4px solid var(--secondary)' : '4px solid var(--primary)'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '3px solid var(--accent)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <Image
                    src={leader.img}
                    alt={leader.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '6px', fontWeight: 800 }}>
                  {leader.name}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {leader.role}
                </div>
                <div className="telugu-text" style={{ fontSize: '0.8rem', color: 'var(--neutral-600)' }}>
                  {leader.roleTelugu}
                </div>
              </div>
            ))}
          </div>

          {/* Professional Carpenter & Solid as the Wood Section */}
          <div className="card" style={{ padding: '40px', backgroundColor: 'var(--neutral-50)', borderLeft: '5px solid var(--primary)', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Hammer size={24} color="var(--secondary)" />
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                Professional Carpenter
              </div>
            </div>

            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}>
              Solid as the wood we work with.
            </h2>

            <p style={{ fontSize: '1.05rem', color: 'var(--neutral-700)', lineHeight: 1.8, marginBottom: '24px' }}>
              The Andhra Pradesh State Carpenters Association is committed to excellence, craftsmanship, and unity. We aim to uplift our members by promoting skill development, professional growth, and industry recognition.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ backgroundColor: 'var(--neutral-white)', padding: '16px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>7,500+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--neutral-600)' }}>Carpenters United in State Union</div>
              </div>

              <Link href="/carpenters" className="btn btn-primary">
                <span>Search All 4,614 Carpenters in Directory</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Interested in Joining Our Team CTA */}
          <div style={{ backgroundColor: 'var(--primary-dark)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '8px' }}>
                Interested in joining our team?
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '1rem', maxWidth: '600px' }}>
                Dedicated to excellence and collaboration, we foster an environment where skilled carpenters unite for mutual welfare and legal protection.
              </p>
            </div>

            <Link href="/register" className="btn btn-secondary btn-lg">
              <Award size={18} />
              <span>Apply for Membership</span>
            </Link>
          </div>

        </div>
      </section>
    </Layout>
  );
}
