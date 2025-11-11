import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CertificateView from '../components/CertificateView';

const VerifyCertificate = () => {
  const { code } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCode, setSearchCode] = useState(code || '');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (code) {
      verifyCertificate(code);
    } else {
      setLoading(false);
    }
  }, [code]);

  const verifyCertificate = async (certCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/certificates/verify/${certCode}`);
      
      if (!response.ok) {
        throw new Error('Certificate not found or invalid');
      }
      
      const data = await response.json();
      setCertificate(data);
      setVerified(true);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError(err.message);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      verifyCertificate(searchCode.trim());
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2>Certificate Verification</h2>
          <p className="text-muted">
            Verify the authenticity of a course completion certificate
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter certificate code (e.g., CERT-ABC123XYZ)"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {loading && !error && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Verifying certificate...</p>
        </div>
      )}

      {error && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger">
              <h4 className="alert-heading">Verification Failed</h4>
              <p>{error}</p>
              <hr />
              <p className="mb-0">
                Please check the certificate code and try again. If you believe this is an error, please contact support.
              </p>
            </div>
          </div>
        </div>
      )}

      {verified && certificate && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-success mb-4">
              <h4 className="alert-heading">Certificate Verified!</h4>
              <p>This certificate is valid and was issued by our platform.</p>
            </div>
            
            <CertificateView certificate={certificate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
