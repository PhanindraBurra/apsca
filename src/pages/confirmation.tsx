import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import {
  CheckCircle,
  Download,
  Printer,
  Mail,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Calendar,
  Building,
  Award,
  ArrowRight,
  QrCode,
  CreditCard,
  Layers,
  FileText
} from 'lucide-react';

// Helper to convert an image URL or relative path into base64 Data URL for jsPDF
const loadImageAsDataUrl = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    if (url.startsWith('data:image/')) return resolve(url);
    try {
      const img = new (window as any).Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    } catch {
      resolve(null);
    }
  });
};

export default function Confirmation() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [cardView, setCardView] = useState<'both' | 'front' | 'back'>('both');
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    fetch('/api/member-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMember(data.member);
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#1A2B4C', '#C81E1E', '#F5B301'],
            });
          } catch (e) {
            console.error('Confetti error:', e);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Draw Front Side of the ID Card in jsPDF
  const drawFrontCard = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    mem: any,
    photoDataUrl: string | null,
    logoDataUrl: string | null
  ) => {
    // Card Base
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(26, 43, 76);
    doc.setLineWidth(0.6);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'FD');

    // Header Background Band
    const headerH = 13.5;
    doc.setFillColor(26, 43, 76);
    doc.roundedRect(x, y, w, headerH, 2.5, 2.5, 'F');
    // Square off bottom corners of header
    doc.rect(x, y + headerH - 2, w, 2, 'F');

    // Gold separator line
    doc.setFillColor(245, 179, 1);
    doc.rect(x, y + headerH, w, 1, 'F');

    // Official Logo in Header
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', x + 2.2, y + 1.8, 10, 10);
      } catch (e) {
        console.error('Logo draw error:', e);
      }
    }

    // Association Title Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('ANDHRA PRADESH STATE CARPENTERS ASSOCIATION', x + 13.5, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(245, 179, 1);
    doc.text('ఆంధ్రప్రదేశ్ రాష్ట్ర వడ్రంగుల సంఘం • Regd. No. 51/2026', x + 13.5, y + 8.2);

    doc.setFontSize(4.2);
    doc.setTextColor(226, 232, 240);
    doc.text('Government Aligned State Craftsmen Union Registry', x + 13.5, y + 11.2);

    // Membership Plan Ribbon
    const ribbonY = y + headerH + 1;
    const ribbonH = 4.2;
    doc.setFillColor(200, 30, 30); // Crimson Red
    doc.rect(x, ribbonY, w, ribbonH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(255, 255, 255);
    const planName = (mem.membership_plan || 'GENERAL MEMBERSHIP').toUpperCase();
    doc.text(`OFFICIAL IDENTITY CARD  •  ${planName}`, x + w / 2, ribbonY + 3, { align: 'center' });

    // Left Photo Section
    const photoX = x + 3.5;
    const photoY = ribbonY + ribbonH + 2.5;
    const photoW = 21;
    const photoH = 26;

    // Photo Box Border
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(245, 179, 1);
    doc.setLineWidth(0.4);
    doc.rect(photoX, photoY, photoW, photoH, 'FD');

    if (photoDataUrl) {
      try {
        doc.addImage(photoDataUrl, 'JPEG', photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
      } catch {
        // Fallback to silhouette avatar
        doc.setFillColor(203, 213, 225);
        doc.circle(photoX + photoW / 2, photoY + 9, 5, 'F');
        doc.roundedRect(photoX + 3, photoY + 16, photoW - 6, 8, 2, 2, 'F');
      }
    } else {
      // Silhouette avatar
      doc.setFillColor(203, 213, 225);
      doc.circle(photoX + photoW / 2, photoY + 9, 5, 'F');
      doc.roundedRect(photoX + 3, photoY + 16, photoW - 6, 8, 2, 2, 'F');
    }

    // ID Pill below Photo
    const idY = photoY + photoH + 1.2;
    doc.setFillColor(26, 43, 76);
    doc.roundedRect(photoX, idY, photoW, 4, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.3);
    doc.setTextColor(245, 179, 1);
    doc.text(mem.membership_id || 'APSCA-2026', photoX + photoW / 2, idY + 2.8, { align: 'center' });

    // Right Details Section
    const detailsX = photoX + photoW + 4;
    let textY = photoY + 3.2;

    // Member Full Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 43, 76);
    const fullName = (mem.full_name || 'REGISTERED MEMBER').toUpperCase();
    doc.text(fullName.length > 22 ? fullName.slice(0, 22) + '...' : fullName, detailsX, textY);

    // Trade / Specialization
    textY += 3.8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(200, 30, 30);
    const org = (mem.organization || 'Craftsman Carpenter & Wood Works').toUpperCase();
    doc.text(org.length > 30 ? org.slice(0, 30) + '...' : org, detailsX, textY);

    // Grid of fields
    textY += 3.8;
    const drawField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.8);
      doc.setTextColor(71, 85, 105);
      doc.text(label, detailsX, textY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const valStr = value || '-';
      doc.text(valStr.length > 24 ? valStr.slice(0, 24) + '...' : valStr, detailsX + 16, textY);
      textY += 3.4;
    };

    drawField('Mobile:', mem.mobile || '-');
    drawField('District:', mem.district || 'Andhra Pradesh');
    drawField('City / Town:', mem.city || '-');
    drawField('DOB / Sex:', `${mem.dob || '-'} / ${mem.gender || 'Male'}`);
    drawField('Valid Till:', '2026 - 2031 (5 Years)');

    // Bottom Signatures & Security Strip
    const footerY = y + h - 8.5;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(x, footerY, w, 8.5, 'FD');

    // Hologram Gold Seal Emblem
    doc.setFillColor(245, 179, 1);
    doc.circle(x + 8, footerY + 4.2, 3.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.2);
    doc.setTextColor(26, 43, 76);
    doc.text('VERIFIED', x + 8, footerY + 4.5, { align: 'center' });

    // President Signature Block
    const sig1X = x + 38;
    doc.setDrawColor(148, 163, 184);
    doc.line(sig1X - 10, footerY + 4.2, sig1X + 10, footerY + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.8);
    doc.setTextColor(26, 43, 76);
    doc.text('Tatikonda Ranga Babu', sig1X, footerY + 6.2, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.2);
    doc.setTextColor(100, 116, 139);
    doc.text('State President', sig1X, footerY + 7.8, { align: 'center' });

    // General Secretary Signature Block
    const sig2X = x + w - 16;
    doc.setDrawColor(148, 163, 184);
    doc.line(sig2X - 10, footerY + 4.2, sig2X + 10, footerY + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.8);
    doc.setTextColor(26, 43, 76);
    doc.text('P. Narasimha Murthy', sig2X, footerY + 6.2, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.2);
    doc.setTextColor(100, 116, 139);
    doc.text('General Secretary', sig2X, footerY + 7.8, { align: 'center' });
  };

  // Draw Back Side of the ID Card in jsPDF
  const drawBackCard = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    mem: any
  ) => {
    // Card Base
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(26, 43, 76);
    doc.setLineWidth(0.6);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'FD');

    // Header Band
    const headerH = 8.5;
    doc.setFillColor(26, 43, 76);
    doc.roundedRect(x, y, w, headerH, 2.5, 2.5, 'F');
    doc.rect(x, y + headerH - 2, w, 2, 'F');

    doc.setFillColor(245, 179, 1);
    doc.rect(x, y + headerH, w, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(255, 255, 255);
    doc.text('CARD HOLDER DIRECTORY & EMERGENCY GUIDELINES', x + w / 2, y + 4.2, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.2);
    doc.setTextColor(245, 179, 1);
    doc.text('Headquarters: D.No: 61-19-7/3 Ramalingeswara Nagar, Vijayawada - 520013', x + w / 2, y + 7.2, { align: 'center' });

    // Left Barcode & QR Block
    const leftX = x + 3.5;
    const barcodeY = y + headerH + 2.5;

    // Simulated clean vector Barcode
    doc.setFillColor(26, 43, 76);
    const barWidths = [0.4, 0.8, 0.4, 1.2, 0.6, 0.4, 1.0, 0.5, 0.8, 0.4, 1.1, 0.5, 0.9, 0.4, 0.7, 0.5, 1.2, 0.4];
    let curBx = leftX;
    for (let i = 0; i < barWidths.length; i++) {
      doc.rect(curBx, barcodeY, barWidths[i], 12, 'F');
      curBx += barWidths[i] + 0.6;
    }

    doc.setFont('courier', 'bold');
    doc.setFontSize(4.2);
    doc.setTextColor(26, 43, 76);
    doc.text(`* ${mem.membership_id} *`, leftX + 11, barcodeY + 15, { align: 'center' });

    // QR Verification Box
    const qrY = barcodeY + 17;
    doc.setDrawColor(26, 43, 76);
    doc.setLineWidth(0.4);
    doc.setFillColor(248, 250, 252);
    doc.rect(leftX, qrY, 22, 16, 'FD');

    // Inner QR target pattern
    doc.setFillColor(26, 43, 76);
    doc.rect(leftX + 2, qrY + 2, 4, 4, 'F');
    doc.rect(leftX + 16, qrY + 2, 4, 4, 'F');
    doc.rect(leftX + 2, qrY + 10, 4, 4, 'F');
    doc.rect(leftX + 8, qrY + 6, 6, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(3.5);
    doc.setTextColor(26, 43, 76);
    doc.text('SCAN TO VERIFY', leftX + 11, qrY + 15, { align: 'center' });

    // Right Content & Instructions Block
    const rightX = leftX + 26;
    let bY = y + headerH + 3.5;

    const drawBackField = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.6);
      doc.setTextColor(71, 85, 105);
      doc.text(label, rightX, bY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const str = value || '-';
      doc.text(str.length > 34 ? str.slice(0, 34) + '...' : str, rightX + 18, bY);
      bY += 3.4;
    };

    drawBackField('Local Union:', mem.local_union_address || 'Central APSCA Roll');
    drawBackField('Nominee Name:', mem.nominee_name || '-');
    drawBackField('Helpline Contact:', '9399980781, 92901 24303');
    drawBackField('Union Email:', 'apscapresident@gmail.com');

    // Terms and Conditions Box
    bY += 1.5;
    doc.setFillColor(241, 245, 249);
    doc.rect(rightX, bY, w - 31, 19, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.2);
    doc.setTextColor(26, 43, 76);
    doc.text('TERMS & CONDITIONS:', rightX + 2, bY + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.8);
    doc.setTextColor(71, 85, 105);
    doc.text('1. This card is non-transferable & property of APSCA.', rightX + 2, bY + 6.5);
    doc.text('2. Entitles cardholder to union welfare, legal aid & skill events.', rightX + 2, bY + 10.0);
    doc.text('3. In case of emergency or loss, contact the central helpline.', rightX + 2, bY + 13.5);
    doc.text('4. Return address: D.No: 61-19-7/3 Ramalingeswara Nagar, VJA-520013.', rightX + 2, bY + 17.0);

    // Bottom Security Banner
    const footerY = y + h - 6;
    doc.setFillColor(26, 43, 76);
    doc.rect(x, footerY, w, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.2);
    doc.setTextColor(245, 179, 1);
    doc.text('APSCA  •  EMPOWERING 75,000+ CARPENTERS ACROSS ANDHRA PRADESH', x + w / 2, footerY + 4, { align: 'center' });
  };

  // 1. Download Printable A4 Sheet with Front & Back ID Card Side-by-Side
  const handleDownloadSheetPDF = async () => {
    if (!member) return;
    setPdfGenerating(true);

    try {
      const photoDataUrl = member.photo_url ? await loadImageAsDataUrl(member.photo_url) : null;
      const logoDataUrl = await loadImageAsDataUrl('/logo.png');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Outer Decorative Border
      doc.setDrawColor(26, 43, 76);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, 194, 281);

      doc.setDrawColor(245, 179, 1);
      doc.setLineWidth(0.4);
      doc.rect(9.5, 9.5, 191, 278);

      // Sheet Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(26, 43, 76);
      doc.text('ANDHRA PRADESH STATE CARPENTERS ASSOCIATION', 105, 20, { align: 'center' });

      doc.setFontSize(9.5);
      doc.setTextColor(200, 30, 30);
      doc.text('OFFICIAL MEMBERSHIP IDENTITY CARD (PVC FORMAT)', 105, 26, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Printable ID Card Sheet • Fold along center line or cut along outer dashed borders to laminate', 105, 31, { align: 'center' });

      // Cut marks guide line
      if (doc.setLineDashPattern) {
        doc.setLineDashPattern([2, 1.5], 0);
        doc.setDrawColor(180, 180, 180);
        doc.line(10, 38, 200, 38);
        doc.setLineDashPattern([], 0);
      }
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text('✂ Cut along dashed guides below • Standard PVC ID Card Dimensions (95mm x 60mm)', 105, 36.5, { align: 'center' });

      // Side-by-Side Cards (Total width = 94 + 2 + 94 = 190mm on 210mm A4)
      const cardW = 94;
      const cardH = 60;
      const frontX = 11;
      const frontY = 41;
      const backX = frontX + cardW + 2;
      const backY = frontY;

      // Draw Front Card
      drawFrontCard(doc, frontX, frontY, cardW, cardH, member, photoDataUrl, logoDataUrl);

      // Draw Back Card
      drawBackCard(doc, backX, backY, cardW, cardH, member);

      // Center fold line
      if (doc.setLineDashPattern) {
        doc.setLineDashPattern([1.5, 1.5], 0);
        doc.setDrawColor(200, 30, 30);
        doc.line(frontX + cardW + 1, frontY - 1.5, frontX + cardW + 1, frontY + cardH + 1.5);
        doc.setLineDashPattern([], 0);
      }

      // Bottom Cut line
      const afterCardsY = frontY + cardH + 6;
      if (doc.setLineDashPattern) {
        doc.setLineDashPattern([2, 1.5], 0);
        doc.setDrawColor(180, 180, 180);
        doc.line(10, afterCardsY, 200, afterCardsY);
        doc.setLineDashPattern([], 0);
      }

      // Receipt & Verification Summary Box Below the Cards
      const summaryY = afterCardsY + 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(26, 43, 76);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, summaryY, 182, 42, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(26, 43, 76);
      doc.text('MEMBERSHIP PAYMENT & REGISTRATION AUDIT', 20, summaryY + 8);

      doc.setFontSize(8);
      doc.setTextColor(200, 30, 30);
      doc.text(`Official Member ID: ${member.membership_id}`, 140, summaryY + 8);

      // Audit fields table
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      doc.text(`Member Name: ${(member.full_name || '').toUpperCase()}`, 20, summaryY + 16);
      doc.text(`Mobile Number: ${member.mobile || '-'}`, 105, summaryY + 16);

      doc.text(`Membership Tier: ${member.membership_plan || 'General Membership'}`, 20, summaryY + 23);
      doc.text(`Fee Paid: INR Rs. ${member.amount || 0}.00 (${(member.payment_status || 'PAID').toUpperCase()})`, 105, summaryY + 23);

      doc.text(`Transaction Reference: ${member.payment_id || 'TXN-' + member.membership_id}`, 20, summaryY + 30);
      doc.text(`Payment Mode: ${member.payment_method || 'Official Union Registry'}`, 105, summaryY + 30);

      doc.text(`Date of Issue: ${new Date(member.created_at || Date.now()).toLocaleDateString()}`, 20, summaryY + 37);
      doc.text(`Status: VERIFIED & COMPLIANT WITH APSCA BYLAWS`, 105, summaryY + 37);

      // Instructions & Legal Note
      const noteY = summaryY + 50;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('How to Use: Print this page on standard A4 / photo paper. Cut along the outer dashed guides and fold down the center red dashed line.', 105, noteY, { align: 'center' });
      doc.text('Laminate the folded card to create an official, durable PVC pocket ID card.', 105, noteY + 5, { align: 'center' });

      // Verification Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Digital Verification Hash: ${member.membership_id} • Verified via apsca.co.in`, 105, 275, { align: 'center' });

      doc.save(`APSCA_Membership_ID_Card_${member.membership_id}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  // 2. Download Wallet PVC Card Size (CR80: 85.6mm x 54mm) - Direct 2-Page Card
  const handleDownloadWalletCardPDF = async () => {
    if (!member) return;
    setPdfGenerating(true);

    try {
      const photoDataUrl = member.photo_url ? await loadImageAsDataUrl(member.photo_url) : null;
      const logoDataUrl = await loadImageAsDataUrl('/logo.png');

      const cardW = 85.6;
      const cardH = 54;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [cardH, cardW],
      });

      // Page 1: Front
      drawFrontCard(doc, 0, 0, cardW, cardH, member, photoDataUrl, logoDataUrl);

      // Page 2: Back
      doc.addPage([cardH, cardW], 'landscape');
      drawBackCard(doc, 0, 0, cardW, cardH, member);

      doc.save(`APSCA_Wallet_PVC_Card_${member.membership_id}.pdf`);
    } catch (err) {
      console.error('Wallet card PDF error:', err);
      alert('Error generating wallet card. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 5000);
  };

  if (loading) {
    return (
      <Layout title="Processing Confirmation - APSCA">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>
            Verifying your membership details...
          </div>
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout title="Membership Not Found - APSCA">
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '12px' }}>
            No Member Record Found
          </h2>
          <Link href="/register" className="btn btn-secondary">
            Register as a Member
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`Official ID Card (${member.membership_id}) - APSCA`}
      description="Official membership ID card and printable digital card from Andhra Pradesh State Carpenters Association."
    >
      <section className="section" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '800px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          {/* Success Banner */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', boxShadow: 'var(--shadow-md)' }}>
              <CheckCircle size={40} color="#16A34A" />
            </div>

            <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
              Registration Verified & Activated
            </div>

            <h1 style={{ fontSize: '2.1rem', color: 'var(--primary)', marginBottom: '8px' }}>
              Welcome to the APSCA Family!
            </h1>

            <p style={{ color: 'var(--neutral-600)', fontSize: '1.02rem' }}>
              Your official Identity Card has been issued below. You can download it as an ID card PDF or wallet card.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="hero-buttons-wrap" style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={handleDownloadSheetPDF}
              disabled={pdfGenerating}
              className="btn btn-secondary"
              style={{ fontWeight: 700, padding: '11px 22px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-md)' }}
            >
              <Download size={18} />
              <span>{pdfGenerating ? 'Generating PDF...' : 'Download ID Card PDF (Front & Back)'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadWalletCardPDF}
              disabled={pdfGenerating}
              className="btn btn-primary"
              style={{ fontWeight: 600, padding: '11px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <CreditCard size={18} />
              <span>Download Wallet PVC Size</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline-primary"
              style={{ fontWeight: 600, padding: '11px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Printer size={18} />
              <span>Print ID Card</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="btn btn-outline-primary"
              style={{ padding: '11px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Mail size={18} />
              <span>{emailSent ? 'Dispatched!' : 'Email Copy'}</span>
            </button>
          </div>

          {emailSent && (
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', padding: '10px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', textAlign: 'center', fontSize: '0.88rem' }}>
              ✓ A digital copy of your official ID Card has been dispatched to <strong>{member.email}</strong>.
            </div>
          )}

          {/* Interactive Card View Mode Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => setCardView('both')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1.5px solid var(--primary)',
                backgroundColor: cardView === 'both' ? 'var(--primary)' : '#FFFFFF',
                color: cardView === 'both' ? '#FFFFFF' : 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={14} />
              <span>Both Sides (Print View)</span>
            </button>

            <button
              type="button"
              onClick={() => setCardView('front')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1.5px solid var(--primary)',
                backgroundColor: cardView === 'front' ? 'var(--primary)' : '#FFFFFF',
                color: cardView === 'front' ? '#FFFFFF' : 'var(--primary)',
              }}
            >
              Front Side
            </button>

            <button
              type="button"
              onClick={() => setCardView('back')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1.5px solid var(--primary)',
                backgroundColor: cardView === 'back' ? 'var(--primary)' : '#FFFFFF',
                color: cardView === 'back' ? '#FFFFFF' : 'var(--primary)',
              }}
            >
              Reverse Side
            </button>
          </div>

          {/* Printable Official ID Card Component */}
          <div id="printable-id-card" style={{ marginBottom: '28px' }}>
            <div className="id-card-both-wrap" style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              
              {/* FRONT OF ID CARD */}
              {(cardView === 'both' || cardView === 'front') && (
                <div
                  className="id-card-container"
                  style={{
                    width: '440px',
                    maxWidth: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 8px 24px rgba(26, 43, 76, 0.12)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Top Header */}
                  <div style={{ backgroundColor: 'var(--primary)', padding: '10px 14px 8px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2.5px solid var(--accent)' }}>
                    <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                      <Image src="/logo.png" alt="APSCA Logo" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        Andhra Pradesh State Carpenters Association
                      </div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.70rem', fontWeight: 700 }}>
                        ఆంధ్రప్రదేశ్ రాష్ట్ర వడ్రంగుల సంఘం • Regd. No. 51/2026
                      </div>
                      <div style={{ color: '#CBD5E1', fontSize: '0.62rem', letterSpacing: '0.2px' }}>
                        Government Aligned State Craftsmen Union Registry
                      </div>
                    </div>
                  </div>

                  {/* Plan Ribbon */}
                  <div style={{ backgroundColor: 'var(--secondary)', color: '#FFFFFF', padding: '3px 12px', textAlign: 'center', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                    OFFICIAL IDENTITY CARD • {(member.membership_plan || 'GENERAL').toUpperCase()}
                  </div>

                  {/* Front Body */}
                  <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '100px 1fr', gap: '14px', alignItems: 'start' }}>
                    {/* Left Photo & ID */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '100px', height: '115px', borderRadius: '6px', border: '2px solid var(--accent)', overflow: 'hidden', backgroundColor: 'var(--neutral-100)', position: 'relative', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {member.photo_url ? (
                          <Image src={member.photo_url} alt={member.full_name} fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <User size={48} color="var(--neutral-400)" />
                        )}
                      </div>
                      <div style={{ marginTop: '6px', backgroundColor: 'var(--primary)', color: 'var(--accent)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.70rem', fontWeight: 800, fontFamily: 'monospace' }}>
                        {member.membership_id}
                      </div>
                    </div>

                    {/* Right Details */}
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2, marginBottom: '2px' }}>
                        {member.full_name}
                      </div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px' }}>
                        {member.organization || 'Craftsman Carpenter & Wood Works'}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '65px 1fr', gap: '4px 6px', fontSize: '0.76rem', color: 'var(--neutral-800)' }}>
                        <span style={{ color: 'var(--neutral-600)', fontWeight: 600 }}>Mobile:</span>
                        <span style={{ fontWeight: 700 }}>{member.mobile}</span>

                        <span style={{ color: 'var(--neutral-600)', fontWeight: 600 }}>District:</span>
                        <span>{member.district || 'Andhra Pradesh'}</span>

                        <span style={{ color: 'var(--neutral-600)', fontWeight: 600 }}>City:</span>
                        <span>{member.city || '-'}</span>

                        <span style={{ color: 'var(--neutral-600)', fontWeight: 600 }}>DOB/Sex:</span>
                        <span>{member.dob || '-'} / {member.gender || 'Male'}</span>

                        <span style={{ color: 'var(--neutral-600)', fontWeight: 600 }}>Valid:</span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>2026 - 2031 (5 Yrs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Signatures & Security Strip */}
                  <div style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid var(--neutral-200)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.64rem', fontWeight: 800 }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 900 }}>
                        ★
                      </div>
                      <span>VERIFIED APSCA</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '1px', backgroundColor: 'var(--neutral-400)', margin: '0 auto 2px auto' }} />
                      <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--primary)' }}>Tatikonda Ranga Babu</div>
                      <div style={{ fontSize: '0.55rem', color: 'var(--neutral-500)' }}>State President</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '1px', backgroundColor: 'var(--neutral-400)', margin: '0 auto 2px auto' }} />
                      <div style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--primary)' }}>P. Narasimha Murthy</div>
                      <div style={{ fontSize: '0.55rem', color: 'var(--neutral-500)' }}>General Secretary</div>
                    </div>
                  </div>
                </div>
              )}

              {/* BACK OF ID CARD */}
              {(cardView === 'both' || cardView === 'back') && (
                <div
                  className="id-card-container"
                  style={{
                    width: '440px',
                    maxWidth: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 8px 24px rgba(26, 43, 76, 0.12)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Top Header */}
                  <div style={{ backgroundColor: 'var(--primary)', padding: '8px 12px', textAlign: 'center', borderBottom: '2px solid var(--accent)' }}>
                    <div style={{ color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.4px' }}>
                      CARD HOLDER DIRECTORY & EMERGENCY GUIDELINES
                    </div>
                    <div style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>
                      Central Office: D.No: 61-19-7/3 Ramalingeswara Nagar, Vijayawada - 520013
                    </div>
                  </div>

                  {/* Back Body */}
                  <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '110px 1fr', gap: '12px', alignItems: 'start' }}>
                    {/* Barcode & QR Box */}
                    <div style={{ textAlign: 'center' }}>
                      {/* Barcode simulation */}
                      <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', backgroundColor: '#F8FAFC', padding: '4px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }}>
                        {[4, 2, 6, 2, 3, 5, 2, 4, 2, 7, 3, 2, 5, 2, 4, 3, 2].map((w, idx) => (
                          <div key={idx} style={{ width: `${w}px`, height: '100%', backgroundColor: 'var(--primary)' }} />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.62rem', fontFamily: 'monospace', fontWeight: 700, marginTop: '2px', color: 'var(--neutral-700)' }}>
                        *{member.membership_id}*
                      </div>

                      {/* QR Box */}
                      <div style={{ marginTop: '8px', padding: '6px', border: '1px solid var(--neutral-300)', borderRadius: '6px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <QrCode size={40} color="var(--primary)" />
                        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>SCAN TO VERIFY</span>
                      </div>
                    </div>

                    {/* Details & Rules */}
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--neutral-800)', marginBottom: '8px' }}>
                        <div><strong>Local Union:</strong> {member.local_union_address || 'Central APSCA Roll'}</div>
                        <div><strong>Nominee:</strong> {member.nominee_name || '-'}</div>
                        <div><strong>Helpline:</strong> 9399980781, 92901 24303</div>
                        <div><strong>Email:</strong> apscapresident@gmail.com</div>
                      </div>

                      <div style={{ backgroundColor: '#F1F5F9', padding: '8px 10px', borderRadius: '6px', fontSize: '0.66rem', color: 'var(--neutral-700)', lineHeight: 1.4 }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '2px' }}>INSTRUCTIONS:</div>
                        <div>1. This card is non-transferable & property of APSCA.</div>
                        <div>2. Entitles cardholder to union welfare schemes & aid.</div>
                        <div>3. If lost, report immediately to union headquarters.</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Security Banner */}
                  <div style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)', padding: '6px 12px', textAlign: 'center', fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.4px' }}>
                    APSCA • EMPOWERING 75,000+ CARPENTERS ACROSS ANDHRA PRADESH
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Payment & Audit Summary Box */}
          <div
            id="printable-receipt"
            className="card"
            style={{
              padding: '20px 24px',
              border: '1.5px solid var(--neutral-300)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
              backgroundColor: '#FFFFFF',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800 }}>
                  Official Registration & Payment Audit
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                  State Union Record • Regd. No. 51/2026
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 700, fontSize: '0.85rem' }}>
                <ShieldCheck size={20} /> Verified & Active Member
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.86rem', color: 'var(--neutral-800)' }}>
              <div>
                <span style={{ color: 'var(--neutral-500)', fontSize: '0.76rem', display: 'block' }}>Fee Paid</span>
                <strong>INR ₹ {member.amount || 0}.00</strong> ({(member.payment_status || 'PAID').toUpperCase()})
              </div>

              <div>
                <span style={{ color: 'var(--neutral-500)', fontSize: '0.76rem', display: 'block' }}>Transaction ID</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{member.payment_id || `TXN-${member.membership_id}`}</span>
              </div>

              <div>
                <span style={{ color: 'var(--neutral-500)', fontSize: '0.76rem', display: 'block' }}>Payment Method</span>
                <span>{member.payment_method || 'Official Union Registry'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--neutral-500)', fontSize: '0.76rem', display: 'block' }}>Date Registered</span>
                <span>{new Date(member.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Navigation link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/carpenters" className="btn btn-outline-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>View Searchable Carpenters Directory (4,614 Records)</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </Layout>
  );
}
