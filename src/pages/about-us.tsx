import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {
  Award,
  Users,
  CheckCircle,
  Briefcase,
  Sparkles,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export default function AboutUs() {
  return (
    <Layout
      title="About Us - APSCA"
      description="About Andhra Pradesh State Carpenters Association - Historical journey from the Stone Age to modern society, honoring Viswakarma and empowering carpenters."
    >
      {/* Page Header */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0', borderBottom: '3px solid var(--accent)' }}>
        <div className="container">
          <div className="badge badge-accent" style={{ marginBottom: '12px' }}>
            APSCA History & Purpose
          </div>
          <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>About Us</h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem' }}>
            Home / About Us
          </p>
        </div>
      </section>

      {/* Main Historical Essay (శ్రీ విశ్వకర్మ పరబ్రహ్మణేనమ:) */}
      <section className="section" style={{ backgroundColor: 'var(--neutral-white)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 className="telugu-text" style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '8px' }}>
              శ్రీ విశ్వకర్మ పరబ్రహ్మణేనమ:
            </h2>
            <div style={{ width: '80px', height: '3px', backgroundColor: 'var(--accent)', margin: '0 auto' }}></div>
          </div>

          <div className="card" style={{ padding: '36px', backgroundColor: '#FFFDF9', borderColor: '#FDE68A', marginBottom: '40px' }}>
            <h3 className="telugu-text" style={{ color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '16px' }}>
              ఉపోద్గాతం : రాతి యుగం నుండి మనిషి మనుగడకు ఇతోధికంగా ప్రత్యక్షంగా, పరోక్షంగాను మానవ సమాజ బ్రతుకుబాటలో కొత్తవరవడి సృష్టించినది. వడ్రంగే.
            </h3>

            <div className="telugu-text" style={{ fontSize: '1.05rem', lineHeight: '2', color: 'var(--neutral-800)' }}>
              <p style={{ marginBottom: '18px' }}>
                అనగా: రాతియుగంలో మనిషి నిత్యకృత్యమైన ఆకలి తీర్చుకొనుటకు ఆకులు, అలమలు, భుజించుట తదుపరి ఆహార విషయంలో మార్పు కోరుకొని ఏదైన జంతువును వేటాడి భుజించాలనే ఆలోచనతో ఒక పదునైన రాయిని తీసుకొని ఒక పొడవైన కర్రను చివర సూదిగా చెక్కి తన శక్తి కొలది విసిరి జంతువును వేటాడాలనే తపన మొట్టమొదటిగా కలిగినది.
              </p>
              <p style={{ marginBottom: '18px' }}>
                కాలక్రమేన మనిషి మెదడులో వచ్చిన మార్పులకు అనుగుణంగా భూమిని కొద్ది గుల్లపరచి విత్తనములు చల్లి పంట పండించాలనే ఆలోచనతో మొట్టమొదటి తన ప్రతిభా పాఠవాలతో నాగలిని తయారు చేసి ఈప్రపంచ అన్నదాతలు అయిన రైతుసోదరులకు అందించిన ఘనత వడ్రంగిది. అది మొదలు… నాటి నుండి నేటివరకు ప్రపంచ మానవ సమాజ అవసరముల దృష్యా సమాజసేవలో భాగంగా (తద్వారా తన మనుగడ సాగించుటకు) వడ్రంగి చేసిన కృషి అజరామరం.
              </p>
              <p style={{ marginBottom: '18px' }}>
                ఎలయనగా నాగలి తయారు చేసిన దగ్గర నుండి తద్వారా పండిన ధాన్యమును అతిసునాయాసముగా పొలము నుండి ఇంటికి తీసుకొని వెళ్ళుటకు మహా మేదస్సుతో చెక్కలో చెక్కను మిళితము గావించి చక్రములతో నడుచు మొదటి వస్తు రవాణా వాహనము (ఎండ్లబండి) ని తయారుచేసిన ఘనత మన వండ్రంగులదే.
              </p>
              <p style={{ marginBottom: '18px' }}>
                తదుపరి రోలు రోకలి తయారు చేసి వాటిని దంచి బియ్యముగా మార్చి అన్నం వండుకొనుటకు కావలసిన మట్టిపాత్రలను తయారు చేయుటకు కావలసిన కుమ్మరి సారెను (చక్రం)ను తయారుచేసి అన్నం తిన గలిగేటట్లు తయారు చేసిన ఘనత మన వడ్రంగులదే.
              </p>
              <p style={{ marginBottom: '18px' }}>
                ఇంకను గొప్పలు చెప్పుకొను అవసరము లేకునను సహజ ధోరణిలో సహజసిద్ధమైన వానరజన్మ నుండి మానవునిగా రూపాంతరము చెందిన పిదప ఆచ్చాధన లేని సమయంలో ప్రకృతి ప్రసాదించిన ఆకులనే అంగవస్త్రములుగా ధరించుట అందరికి విధతమే. తదుపరి ఆలోచన పరుడైన, నిరంతర మేధ సంపన్నుడైన వడ్రంగి భూమాత ప్రసాదించిన నిరర్ధకముగా వున్న పత్తిని ఒక దారముగా ఒడుకుటకు మొదటిగా ఏకులరాట్నము తయారు చేసి తద్వారా మన చేనేత కార్మిక సోదరులకు అందించి మనిషి పురోగమనము వైపు పయనించేటట్లు చేనేత కొరకు మగ్గం తయారు చేసిన మహానీయుడు మన వడ్రంగి సోదరులే.
              </p>
              <p>
                తదుపరి కడుపునిండిన తరువాత భుక్తాయాసముతో ఒక నీడను సేదతీరుటకు కర్రలను ఉపయోగించి ఇంటిని నిర్మించిన మహా మనిషి మన వడ్రంగులే. కాలక్రమేణా మనిషి సుఖముగా కూర్చునుటకు, విశ్రాంతి తీసుకొనుటకు అభద్రతా భావము నుండి భద్రతతో నివశించుటకు కుర్చీ, మంచం, ద్వారబందము, తలుపులు మొదలుగునవి తయారు చేసి (తన క్షుద్బాధను తీర్చుకొనుచు) మానవశ్రేయస్సుకు పెద్దపీట వేసినది మన వడ్రంగులే.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '28px', marginBottom: '40px' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <div className="badge badge-secondary" style={{ marginBottom: '10px' }}>Our Mission</div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '12px' }}>Mission</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', lineHeight: 1.7 }}>
                The Andhra Pradesh State Carpenters Association is committed to excellence, craftsmanship, and unity. We aim to uplift our members by promoting skill development, modern technical knowledge, government welfare alignment, and industry recognition across all 26 districts of Andhra Pradesh.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="badge badge-primary" style={{ marginBottom: '10px' }}>Our Vision</div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '12px' }}>Vision</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', lineHeight: 1.7 }}>
                To empower every carpenter in Andhra Pradesh so that they can proudly say, “I am a proud carpenter,” respected for their skill, provided with continuous employment opportunities, fair compensation, and full social security.
              </p>
            </div>
          </div>

          {/* Why Choose Us & Your Ideas Crafted with Precision */}
          <div className="card" style={{ padding: '36px', marginBottom: '40px' }}>
            <div className="badge badge-accent" style={{ marginBottom: '10px' }}>Why Choose Us</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '14px' }}>
              Your ideas crafted with precision and detail
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--neutral-700)', lineHeight: 1.7, marginBottom: '24px' }}>
              Your ideas deserve the finest care. We transform your concepts into reality with precision and attention to detail, ensuring quality, beauty, and functionality in every creation we deliver.
            </p>

            {/* Stats Row from Old Site */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid var(--neutral-200)' }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)' }}>1000+</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Project Done</div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>5000+</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Happy Clients</div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)' }}>7500+</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Professionals</div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>98%</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Repeat Order</div>
              </div>
            </div>
          </div>

          {/* People Behind Us - Teamwork makes the dream work */}
          <div className="card" style={{ padding: '36px', backgroundColor: 'var(--neutral-50)' }}>
            <div className="badge badge-primary" style={{ marginBottom: '10px' }}>People Behind Us</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '14px' }}>
              Teamwork makes the dream work
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--neutral-700)', lineHeight: 1.7, marginBottom: '24px' }}>
              At our core, we believe teamwork transforms ideas into achievements. Every member contributes unique skills, creativity, and passion, working together toward a shared vision. It’s this spirit of collaboration that drives quality, innovation, and success in every project we deliver.
            </p>

            <Link href="/members" className="btn btn-secondary">
              <Users size={18} />
              <span>Meet State Leadership Team</span>
            </Link>
          </div>

        </div>
      </section>
    </Layout>
  );
}
