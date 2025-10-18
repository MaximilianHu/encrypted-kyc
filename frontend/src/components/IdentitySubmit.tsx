import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { encryptNameWithAddress } from '../utils/crypto';
import '../styles/IdentitySubmit.css';

export function IdentitySubmit() {
  const { address } = useAccount();
  const { instance, isLoading: zamaLoading } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const [name, setName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instance || !address || !signerPromise) return;

    setSubmitting(true);
    try {
      const nationalityIdNum = parseInt(countryId);
      const birthYearNum = parseInt(birthYear);
      if (!Number.isInteger(nationalityIdNum) || !Number.isInteger(birthYearNum)) {
        throw new Error('Invalid numeric input');
      }

      // Client-side encrypt name using the wallet address
      const nameCiphertext = await encryptNameWithAddress(name, address);

      // Prepare FHE encrypted inputs: address, birthYear, countryId
      const buffer = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      buffer.addAddress(address);
      buffer.add32(birthYearNum);
      buffer.add32(nationalityIdNum);
      const enc = await buffer.encrypt();

      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.submitUser(
        nameCiphertext,
        enc.handles[0],
        enc.handles[1],
        enc.handles[2],
        enc.inputProof
      );
      await tx.wait();
      setDone(true);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="success-page-container">
        <div className="success-page-card">
          <div className="success-icon">✓</div>
          <h2 className="success-page-title">Submitted!</h2>
          <p className="success-page-description">Your encrypted data is stored on-chain.</p>
          <button className="reset-button" onClick={() => setDone(false)}>Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="identity-submit-container">
      <div className="identity-submit-card">
        <h2 className="identity-submit-title">Submit Info</h2>
        <form onSubmit={handleSubmit} className="identity-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Country ID</label>
            <input className="text-input" value={countryId} onChange={(e) => setCountryId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Birth Year</label>
            <input className="text-input" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} required />
          </div>
          <button className="submit-button" disabled={zamaLoading || submitting || !address}>
            {zamaLoading ? 'Initializing...' : submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

