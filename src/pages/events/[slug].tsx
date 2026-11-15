import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import servicesData from '@/data/services_and_events.json';
import {
  Award,
  Calendar,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface EventPageProps {
  slug: string;
  title: string;
  paragraphs: string[];
  images: string[];
}

export default function EventDetail({
  slug,
  title,
  paragraphs,
  images,
}: EventPageProps) {
  const isIndia = slug.includes('india');
  const bannerImg = isIndia
    ? '/images/WhatsApp-Image-2024-10-20-at-11.48.14_c9dac03c.webp'
    : '/images/WhatsApp-Image-2024-10-20-at-12.01.05_d829010b.webp';

  return (
    <Layout
      title={`${title} - APSCA Skills & Competitions`}
      description={`Official participation guidelines and Skill India registration details for ${title} with the Andhra Pradesh State Carpenters Association.`}
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            Skill India & Global Competitions
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            {title}
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem' }}>
            Empowering Indian Talent for Global Excellence in Vocational Carpentry Skills
          </p>
        </div>
      </section>

      {/* Main Event Article */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div className="card" style={{ padding: '36px', marginBottom: '32px' }}>
            <div style={{ position: 'relative', height: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '28px', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src={bannerImg}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="badge badge-secondary" style={{ marginBottom: '14px' }}>
              Official Notice & Registration
            </div>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '16px' }}>
              Empowering Carpentry for Future Generations in Andhra Pradesh
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1.05rem', color: 'var(--neutral-800)', lineHeight: 1.8, marginBottom: '28px' }}>
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Official Registration Notice Box */}
            <div style={{ backgroundColor: '#FFFDF0', border: '2px solid var(--accent)', borderRadius: 'var(--radius-md)', padding: '24px', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Award size={22} color="var(--secondary)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 700 }}>
                  IndiaSkills 2025 Competition Registration
                </h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', marginBottom: '16px' }}>
                Registrations for the IndiaSkills Competition 2025 have been launched on the Skill India Digital Hub (SIDH). Registered members of APSCA are encouraged to participate.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="https://www.skillindiadigital.gov.in/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Individual Skill Registration (SIDH)</span>
                  <ExternalLink size={16} />
                </a>

                <Link href="/register" className="btn btn-primary">
                  <span>Register with APSCA First</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Event Gallery */}
          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '16px' }}>
              Event Gallery & Competition Moments
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <Image
                  src="/images/WhatsApp-Image-2024-10-24-at-05.55.25_19384f77.webp"
                  alt="Skill Competition Moment"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <Image
                  src="/images/WhatsApp-Image-2024-10-24-at-17.35.23_7f46c036.webp"
                  alt="Skill Training Session"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <Image
                  src="/images/WhatsApp-Image-2024-10-20-at-18.43.57_5bf2d730.webp"
                  alt="Skill India Gathering"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'indias-biggest-skill-competition' } },
      { params: { slug: 'world-skill-competition-2' } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const sData = (servicesData as any)[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    paragraphs: [],
    images: [],
  };

  return {
    props: {
      slug,
      title: sData.title || slug.replace(/-/g, ' ').toUpperCase(),
      paragraphs: sData.paragraphs || [],
      images: sData.images || [],
    },
  };
};
