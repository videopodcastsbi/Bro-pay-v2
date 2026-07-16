import React, { useState } from 'react';
import { QrCode, Download, Share2, Copy, RefreshCw, CheckCircle, Camera } from 'lucide-react';
import '../styles/qr-payment.css';

const QRPayment: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [paymentId] = useState(() => `BP-${Date.now().toString().slice(-8)}`);
  const qrPattern = Array.from({ length: 25 }, (_, i) => i % 3 === 0 || i % 7 === 0);

  const generateQR = () => {
    if (amount) {
      setQrGenerated(true);
    }
  };

  const resetQR = () => {
    setAmount('');
    setNote('');
    setQrGenerated(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`bropay://pay?amount=${amount}&note=${note}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="qr-page">
      <div className="page-header">
        <div>
          <h1>QR Payment</h1>
          <p>Generate QR codes to receive payments instantly</p>
        </div>
      </div>

      <div className="qr-content">
        <div className="qr-generator-card">
          <h3>Generate Payment QR</h3>
          
          <div className="input-group">
            <label>Amount ($)</label>
            <input
              type="number"
              className="input-field"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={qrGenerated}
            />
          </div>

          <div className="input-group">
            <label>Note (optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="What's this payment for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={qrGenerated}
            />
          </div>

          {!qrGenerated ? (
            <button className="btn btn-primary full-width" onClick={generateQR} disabled={!amount}>
              <QrCode size={18} />
              Generate QR Code
            </button>
          ) : (
            <button className="btn btn-secondary full-width" onClick={resetQR}>
              <RefreshCw size={18} />
              Generate New QR
            </button>
          )}
        </div>

        <div className="qr-display-card">
          {qrGenerated ? (
            <div className="qr-code-display">
              <div className="qr-placeholder">
                <div className="qr-pattern">
                  {qrPattern.map((filled, i) => (
                    <div
                      key={i}
                      className={`qr-cell ${filled ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="qr-amount">${Number(amount).toFixed(2)}</div>
              {note && <div className="qr-note">{note}</div>}
              <div className="qr-footer">
                <span className="qr-id">Payment ID: {paymentId}</span>
              </div>
              
              <div className="qr-actions">
                <button className="btn btn-secondary" onClick={handleCopy}>
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button className="btn btn-secondary">
                  <Download size={16} />
                  Download
                </button>
                <button className="btn btn-secondary">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          ) : (
            <div className="qr-empty">
              <div className="empty-icon">
                <Camera size={48} />
              </div>
              <h3>QR Code Preview</h3>
              <p>Enter an amount and generate a QR code to receive payments</p>
            </div>
          )}
        </div>
      </div>

      <div className="qr-info-section">
        <h3>How QR Payment Works</h3>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Enter Amount</h4>
            <p>Set the payment amount you want to receive</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Show QR Code</h4>
            <p>Display the generated QR code to the payer</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Scan & Pay</h4>
            <p>Payer scans the code with their Bro Pay app</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Receive Funds</h4>
            <p>Money is instantly credited to your wallet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
