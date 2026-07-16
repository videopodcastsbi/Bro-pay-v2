import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, BookOpen, Mail } from 'lucide-react';
import '../styles/help.css';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { question: 'How do I transfer money?', answer: 'Go to the Transfer page from the sidebar or dashboard, enter the recipient details, amount, and confirm the transaction.' },
    { question: 'Is my money safe with Bro Pay?', answer: 'Yes, we use industry-standard encryption and security protocols to protect your funds and personal information.' },
    { question: 'How do I add funds to my wallet?', answer: 'You can top up your wallet using the Top Up feature in the Wallet section. We support bank transfers and card payments.' },
    { question: 'Can I have multiple currencies?', answer: 'Yes! Bro Pay supports multiple wallets in different currencies. You can create a new wallet from the Wallet page.' },
    { question: 'How do I contact support?', answer: 'You can reach our support team via email at support@bropay.com or through the contact form below.' },
  ];

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>Help Center</h1>
      </div>

      <div className="help-hero">
        <HelpCircle size={48} className="hero-icon" />
        <h2>How can we help you?</h2>
        <p>Find answers to common questions or contact our support team.</p>
      </div>

      <div className="help-content">
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="support-options">
          <h3>Contact Support</h3>
          <div className="support-cards">
            <div className="support-card">
              <div className="support-icon"><MessageSquare size={24} /></div>
              <h4>Live Chat</h4>
              <p>Chat with our support team in real-time.</p>
              <button className="btn-outline">Start Chat</button>
            </div>
            <div className="support-card">
              <div className="support-icon"><Mail size={24} /></div>
              <h4>Email Support</h4>
              <p>Send us an email and we'll respond within 24 hours.</p>
              <button className="btn-outline">Send Email</button>
            </div>
            <div className="support-card">
              <div className="support-icon"><BookOpen size={24} /></div>
              <h4>Documentation</h4>
              <p>Browse our comprehensive guides and tutorials.</p>
              <button className="btn-outline">View Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
