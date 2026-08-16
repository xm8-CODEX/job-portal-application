// src/components/layout/Layout.jsx
// Main layout wrapper used by all public and candidate/recruiter pages.

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, hideFooter = false }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
