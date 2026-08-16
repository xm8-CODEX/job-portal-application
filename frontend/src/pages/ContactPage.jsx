// src/pages/ContactPage.jsx

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate sending (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="about-hero" style={{ padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Get in Touch
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)' }}>
            Have a question, feedback, or need help? We're here for you.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="contact-grid">
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 24 }}>Contact Information</h2>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 40 }}>
              Our support team is available Monday through Friday, 9am to 6pm IST.
              We typically respond within 24 hours.
            </p>

            {[
              { icon: <Mail size={20} />, label: 'Email', value: 'support@jobportal.com', href: 'mailto:support@jobportal.com' },
              { icon: <Phone size={20} />, label: 'Phone', value: '+91 (800) 123-4567', href: 'tel:+918001234567' },
              { icon: <MapPin size={20} />, label: 'Office', value: '12th Floor, Sunshine Towers, Bangalore, KA 560001', href: null },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-700)', marginBottom: 4 }}>{c.label}</div>
                  {c.href ? (
                    <a href={c.href} style={{ color: 'var(--primary)', fontSize: 'var(--text-sm)' }}>{c.value}</a>
                  ) : (
                    <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ padding: 24, background: 'var(--primary-bg)', borderRadius: 16, marginTop: 32 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <MessageSquare size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Job Portal Support</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                For fastest response, use our in-app support chat available from your dashboard.
                Priority support available for employers with active job postings.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 24 }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="label label--required">Full Name</label>
                  <input
                    className="input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="label label--required">Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Subject</label>
                <select
                  className="select"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Select a topic</option>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing / Account</option>
                  <option>Partnership</option>
                  <option>Report an Issue</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label label--required">Message</label>
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className={`btn btn--primary btn--lg ${sending ? 'btn--loading' : ''}`}
                disabled={sending}
              >
                {!sending && <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
