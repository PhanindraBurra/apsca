import React, { useState, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/Layout';
import carpentersData from '@/data/carpenters_directory.json';
import { query } from '@/lib/db';
import {
  Search,
  Phone,
  MapPin,
  Building,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle
} from 'lucide-react';

const ITEMS_PER_PAGE = 30;

interface CarpenterItem {
  id: string;
  name: string;
  mobile: string;
  city?: string;
  local_union?: string;
  address?: string;
  isRegistered?: boolean;
}

interface CarpentersDirectoryProps {
  initialCarpenters: CarpenterItem[];
}

export default function CarpentersDirectory({ initialCarpenters = carpentersData }: CarpentersDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract distinct cities for filtering
  const cities = useMemo(() => {
    const set = new Set<string>();
    initialCarpenters.forEach((c: any) => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set).sort();
  }, [initialCarpenters]);

  // Filtered list based on search and city
  const filteredCarpenters = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return initialCarpenters.filter((c: any) => {
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term) ||
        (c.mobile && c.mobile.includes(term));

      const matchCity = selectedCity === 'all' || c.city === selectedCity;

      return matchSearch && matchCity;
    });
  }, [searchTerm, selectedCity, initialCarpenters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCarpenters.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCarpenters.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCarpenters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <Layout
      title="Carpenters Directory (4,614 Registered) - APSCA"
      description="Official searchable directory of all 4,614 registered carpenters across Andhra Pradesh with ID numbers and contact details."
    >
      {/* Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            Official State Registry
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>
            Carpenters Directory
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>
            Verified statewide directory of {carpentersData.length.toLocaleString()} registered carpenters in Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '800px' }}>
        <div className="container">
          
          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '24px', marginBottom: '32px', borderTop: '3px solid var(--secondary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'center' }}>
              
              {/* Search Input */}
              <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--neutral-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Carpenter Name, ID (e.g. 000153), or Mobile..."
                  className="form-control"
                  style={{ paddingLeft: '42px', height: '48px', fontSize: '0.95rem' }}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Status & Results Count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', fontWeight: 600 }}>
                  Showing <span style={{ color: 'var(--secondary)', fontWeight: 800 }}>{filteredCarpenters.length.toLocaleString()}</span> registered carpenters
                </div>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {paginatedItems.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <User size={48} color="var(--neutral-400)" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '8px' }}>No carpenters found</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.95rem' }}>
                No records matched your search query "{searchTerm}". Try searching by ID or last name.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {paginatedItems.map((carpenter: any, idx: number) => (
                <div
                  key={`${carpenter.id}-${idx}`}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    borderTop: '3px solid var(--primary-light)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        ID: {carpenter.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} color="var(--secondary)" /> Verified
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                      {carpenter.name}
                    </h3>

                    {carpenter.city && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--neutral-700)', marginBottom: '6px' }}>
                        <Building size={14} color="var(--neutral-400)" />
                        <span>City: {carpenter.city}</span>
                      </div>
                    )}

                    {carpenter.local_union && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--neutral-600)', marginBottom: '10px', lineHeight: 1.4 }}>
                        <MapPin size={12} color="var(--neutral-400)" style={{ display: 'inline', marginRight: '4px' }} />
                        {carpenter.local_union}
                      </div>
                    )}
                  </div>

                  <div style={{ paddingTop: '14px', borderTop: '1px solid var(--neutral-200)', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                        <Phone size={14} color="var(--secondary)" />
                        <span>{carpenter.mobile}</span>
                      </div>

                      <a
                        href={`tel:${carpenter.mobile.replace(/\s+/g, '')}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{ fontSize: '0.9rem', color: 'var(--neutral-700)', fontWeight: 600, padding: '0 12px' }}>
                Page {currentPage} of {totalPages}
              </div>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let dbCarpenters: CarpenterItem[] = [];
  try {
    const rows = await query<any>(
      `SELECT membership_id, full_name, mobile, email, city, district, organization
       FROM members
       WHERE (status = 'active' OR status IS NULL)
       ORDER BY id DESC`
    );
    dbCarpenters = (rows || []).map((m: any) => ({
      id: m.membership_id,
      name: m.full_name,
      mobile: m.mobile,
      city: m.city || m.district || 'Andhra Pradesh',
      local_union: m.organization || 'APSCA Registered Craftsman',
      isRegistered: true,
    }));
  } catch (err) {
    console.error('Error fetching SQLite carpenters for directory:', err);
  }

  const combined = [...dbCarpenters, ...carpentersData];

  return {
    props: {
      initialCarpenters: combined,
    },
  };
};
