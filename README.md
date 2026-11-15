# Andhra Pradesh State Carpenters Association (APSCA) Official Web Portal

A modern, full-stack, responsive web portal for the **Andhra Pradesh State Carpenters Association (ఆంధ్రప్రదేశ్ రాష్ట్ర కార్పెంటర్స్ అసోసియేషన్)**, rebuilt from `https://apsca.co.in/`.

---

## 🌟 Key Features

1. **Exact 1:1 Content & Asset Migration**:
   - Preserved original Telugu historical text honoring Sri Viswakarma (`శ్రీ విశ్వకర్మ పరబ్రహ్మణేనమ:`), the Stone Age-to-modern-society evolution narrative, Mission, Vision, and Leadership messages.
   - Preserved all state leadership profiles: State President Tatikonda Ranga Babu, General Secretary Pedapudi Narasimha Murthy, and executive committee members.
   - Dedicated portal pages for **all 26 districts of Andhra Pradesh** with 761 committee members.
   - **Searchable Carpenters Directory** containing **4,614 verified registered carpenters** with instant search by name, ID, mobile, and city.
   - All 7 specialized carpentry disciplines (Furniture Making, Cabinet Makers, Wood Carving, Temple Wood Works, Toys Making, Boat Making, Vehicle Interior & Exterior).
   - Skill India and WorldSkills Competition pages with official government registration links.

2. **Official Logo & Palette**:
   - Reused the official transparent APSCA logo in Header, Footer, and Favicon.
   - Theme colors strictly extracted from the logo:
     - `--primary`: `#1A2B4C` (Deep Navy Blue)
     - `--secondary`: `#C81E1E` (Crimson Red)
     - `--accent`: `#F5B301` (Golden Yellow)

3. **Complete Membership & Payment System**:
   - **Plans matching old site**:
     - General membership (Free, ₹0)
     - State Committee membership (Premium, ₹300)
     - State Executive Membership (Advanced, ₹900)
   - Comprehensive registration form with validation, photo upload, and ID proof document attachment.
   - Duplicate prevention against existing mobile numbers and emails.
   - **Checkout**: Razorpay integration (test mode with configurable keys) + Direct Bank Transfer / UPI details.
   - **Confirmation**: Animated confetti, unique Membership ID generation (`APSCA-2026-XXXX`), printable digital card, and **downloadable official PDF receipt/certificate** using jsPDF.

4. **Secure Admin Dashboard**:
   - Password-protected (`admin123` by default, configurable).
   - Real-time statistics (total members, paid, pending).
   - Filter by district, plan, and payment status.
   - Modal to inspect uploaded member photo and ID proof.
   - One-click **Export to CSV / Excel**.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "Carpenters Website"

# Install dependencies
npm install
```

### 3. Environment Variables
Create or verify `.env.local` in the project root:
```env
# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_51APSCA2026Test
RAZORPAY_KEY_SECRET=APSCASecretKey2026TestMode
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_51APSCA2026Test

# Admin Dashboard Access
ADMIN_PASSWORD=admin123

# Public Base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Bank & UPI Official Details
NEXT_PUBLIC_BANK_NAME=State Bank of India
NEXT_PUBLIC_ACCOUNT_NAME=Andhra Pradesh State Carpenters Association (APSCA)
NEXT_PUBLIC_ACCOUNT_NO=39824510294
NEXT_PUBLIC_IFSC=SBIN0001234
NEXT_PUBLIC_BRANCH=Vijayawada Main Branch
NEXT_PUBLIC_UPI_ID=apsca@sbi
NEXT_PUBLIC_UPI_PHONE=9399980781
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 5. Running the Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
├── data/                      # Local SQLite database (apsca.db)
├── public/
│   ├── images/               # 1,000+ downloaded original & enriched photos
│   ├── logo.png              # Official APSCA logo
│   ├── favicon.ico           # APSCA favicon
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Sticky header with mega-menu & CTA
│   │   ├── Footer.tsx        # Official contact details & links
│   │   └── Layout.tsx        # SEO & metadata wrapper
│   ├── data/
│   │   ├── carpenters_directory.json  # 4,614 carpenter records
│   │   ├── district_members.json      # 761 district members across 26 districts
│   │   └── services_and_events.json   # 7 services & 2 competitions
│   ├── lib/
│   │   └── db.ts             # SQLite database layer with auto-migration
│   ├── pages/
│   │   ├── api/
│   │   │   ├── register.ts            # Member registration & duplicate check
│   │   │   ├── create-order.ts        # Razorpay order generation
│   │   │   ├── verify-payment.ts      # Payment verification
│   │   │   ├── member-login.ts        # Member profile lookup
│   │   │   └── admin/
│   │   │       ├── members.ts         # Admin member management API
│   │   │       └── export.ts          # CSV / Excel export API
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx                  # Rebuilt modern Homepage
│   │   ├── about-us.tsx               # About Us & Viswakarma Telugu history
│   │   ├── members.tsx                # State leadership committee
│   │   ├── carpenters.tsx             # Searchable 4,614 carpenters directory
│   │   ├── contact-us.tsx             # Vijayawada head office contact & form
│   │   ├── register.tsx               # Membership plans & registration form
│   │   ├── checkout.tsx               # Razorpay & UPI payment checkout
│   │   ├── confirmation.tsx           # Digital ID card & PDF receipt generator
│   │   ├── member-login.tsx           # Profile login & ID lookup
│   │   ├── admin.tsx                  # Password-protected admin portal
│   │   ├── districts/
│   │   │   └── [slug].tsx             # Dynamic 26 Andhra Pradesh district portals
│   │   ├── services/
│   │   │   └── [slug].tsx             # 7 Specialized carpentry service pages
│   │   └── events/
│   │       └── [slug].tsx             # Skill India & WorldSkills competition pages
│   └── styles/
│       └── globals.css                # CSS variables from logo palette & styling
├── site-inventory.md          # Complete crawl inventory & migration checklist
├── package.json
└── tsconfig.json
```

---

## 🌐 Deployment Instructions

### Vercel (Recommended)
1. Push this repository to GitHub/GitLab.
2. Import project into [Vercel](https://vercel.com).
3. Set Environment Variables in Project Settings (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_PASSWORD`).
4. Click **Deploy**.

### Self-Hosted VPS / Docker / Ubuntu
```bash
# Build standalone bundle
npm run build

# Run with PM2 process manager
npm install -g pm2
pm2 start npm --name "apsca-portal" -- start
pm2 save
```
