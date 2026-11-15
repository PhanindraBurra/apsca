import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import districtsData from '@/data/district_members.json';
import { query } from '@/lib/db';
import {
  MapPin,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
  Award,
  Phone
} from 'lucide-react';

interface DistrictItem {
  name: string;
  slug: string;
  memberCount: number;
  sampleMembers: string[];
}

interface DistrictsIndexProps {
  districts: DistrictItem[];
}

export default function DistrictsIndex({ districts }: DistrictsIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.sampleMembers.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalMembers = districts.reduce((sum, d) => sum + d.memberCount, 0);

  return (
    <Layout
      title="All 26 Districts of Andhra Pradesh - APSCA Official Portal"
      description="Connect with carpenters, leaders, and welfare committees across all 26 districts of Andhra Pradesh State Carpenters Association."
    >
      {/* Hero Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0 50px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            Statewide Presence • 100% Coverage
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '12px', fontWeight: 800 }}>
            All 26 Districts of Andhra Pradesh
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', maxWidth: '780px', lineHeight: 1.6 }}>
            Explore local carpenter committees, certified craftsmen, union representatives, and welfare aid rolls in each district of Andhra Pradesh.
          </p>

          {/* District Highlights Bar */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>26</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Official Districts</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{totalMembers}+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Verified District Leaders</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>4,614+</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>State Directory Craftsmen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main District Directory Grid */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          
          {/* Search Toolbar */}
          <div style={{ backgroundColor: 'white', padding: '18px 24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--neutral-200)' }}>
            <div style={{ position: 'relative', flex: '1 1 320px' }}>
              <Search size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search district name (e.g. Krishna, Guntur, Visakhapatnam)..."
                className="form-control"
                style={{ paddingLeft: '42px', height: '44px', fontSize: '0.92rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', fontWeight: 600 }}>
              Showing {filteredDistricts.length} of {districts.length} Districts
            </div>
          </div>

          {/* 26 Districts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredDistricts.map((d) => (
              <div
                key={d.slug}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                  borderTop: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ backgroundColor: 'var(--primary-soft)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                        <MapPin size={20} color="var(--primary)" />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0, fontWeight: 700 }}>
                        {d.name}
                      </h3>
                    </div>
                    <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                      {d.memberCount} Members
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', marginBottom: '14px', lineHeight: 1.5 }}>
                    Dedicated welfare committee and carpenters network for {d.name} district jurisdiction.
                  </p>

                  {d.sampleMembers.length > 0 && (
                    <div style={{ backgroundColor: 'var(--neutral-100)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Key Committee Members:
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--neutral-800)', fontWeight: 600 }}>
                        {d.sampleMembers.slice(0, 2).join(' • ')}
                        {d.sampleMembers.length > 2 ? ` (+${d.sampleMembers.length - 2} more)` : ''}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={`/districts/${d.slug}`}
                  className="btn btn-outline-primary"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem' }}
                >
                  <span>Explore {d.name} Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {/* Join Call to Action */}
          <div style={{ marginTop: '48px', backgroundColor: 'var(--primary)', color: 'white', padding: '36px', borderRadius: 'var(--radius-lg)', textAlign: 'center', borderBottom: '4px solid var(--accent)' }}>
            <h3 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '10px', fontWeight: 800 }}>
              Are you a carpenter in any of these 26 districts?
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 20px auto' }}>
              Register today with Andhra Pradesh State Carpenters Association to get legal protection, certified ID card, death aid, and government training.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-secondary btn-lg" style={{ fontWeight: 700 }}>
                Become a Member (Join Now)
              </Link>
              <Link href="/carpenters" className="btn btn-outline-white btn-lg">
                Search All 4,614 Carpenters
              </Link>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Query counts of registered members per district
  const districtCounts: Record<string, number> = {};
  try {
    const rows = await query<{ district: string; count: number }>(
      `SELECT district, COUNT(*) as count FROM members WHERE (status = 'active' OR status IS NULL) GROUP BY district`
    );
    (rows || []).forEach((r) => {
      if (r.district) {
        districtCounts[r.district.toLowerCase()] = r.count;
      }
    });
  } catch (e) {
    console.error('Error fetching district counts:', e);
  }

  const districts: DistrictItem[] = Object.keys(districtsData).map((k) => {
    const d = (districtsData as any)[k];
    const sampleMembers = (d.members || [])
      .map((m: any) => m.name)
      .filter(Boolean)
      .slice(0, 3);

    const baseCount = d.member_count || (d.members || []).length;
    const extraCount = districtCounts[(d.district_name || '').toLowerCase()] || 0;

    return {
      name: d.district_name || k,
      slug: k === 'sri-potti-sriramulu-nellore-srikakulam' ? 'sri-potti-sriramulu-nellore' : k,
      memberCount: baseCount + extraCount,
      sampleMembers,
    };
  });

  // Sort alphabetically by district name
  districts.sort((a, b) => a.name.localeCompare(b.name));

  return {
    props: {
      districts,
    },
  };
};
