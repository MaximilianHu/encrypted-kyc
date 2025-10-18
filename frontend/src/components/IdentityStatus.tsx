import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { decryptNameWithAddress } from '../utils/crypto';
import '../styles/IdentityStatus.css';

const COUNTRY_MAP: Record<string, string> = {
  '1': 'USA',
  '2': 'China',
  '3': 'UK',
  '4': 'Germany',
  '5': 'France',
  '86': 'Other',
};

export function IdentityStatus() {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signer = useEthersSigner();
  const [decrypted, setDecrypted] = useState<{ name: string; birthYear: string; countryId: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: has } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasUser',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: info } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!has },
  });

  const decryptNow = async () => {
    if (!instance || !address || !info || !signer) return;
    setBusy(true);
    try {
      // info: [nameCiphertext, encAddr, birthYear, countryId]
      const name = await decryptNameWithAddress(info[0] as string, address);

      const handleContractPairs = [
        { handle: info[2] as string, contractAddress: CONTRACT_ADDRESS },
        { handle: info[3] as string, contractAddress: CONTRACT_ADDRESS },
      ];

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [CONTRACT_ADDRESS];

      const keypair = instance.generateKeypair();
      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const s = await signer;
      const signature = await s!.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays,
      );

      const birthYear = String(result[info[2] as string] || '');
      const countryId = String(result[info[3] as string] || '');
      setDecrypted({ name, birthYear, countryId });
    } catch (e) {
      console.error(e);
      alert('Decryption failed');
    } finally {
      setBusy(false);
    }
  };

  if (!address) {
    return <div className="no-record-message"><p>Please connect your wallet</p></div>;
  }
  if (!has) {
    return (
      <div className="identity-status-container">
        <div className="status-card no-record-message">
          <h2 className="no-record-title">No Record</h2>
          <p className="no-record-description">Submit your info in the Submit tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="identity-status-container">
      <div className="status-card">
        <h3 className="status-title">Your Information</h3>
        <div className="decrypted-grid" style={{ marginTop: '1rem' }}>
          <div className="decrypted-item">
            <label className="decrypted-label">Name</label>
            <p className="decrypted-value">{decrypted ? decrypted.name : '***'}</p>
          </div>
          <div className="decrypted-item">
            <label className="decrypted-label">Country</label>
            <p className="decrypted-value">
              {decrypted ? (COUNTRY_MAP[decrypted.countryId] || decrypted.countryId) : '***'}
            </p>
          </div>
          <div className="decrypted-item">
            <label className="decrypted-label">Birth Year</label>
            <p className="decrypted-value">{decrypted ? decrypted.birthYear : '***'}</p>
          </div>
        </div>

        {!decrypted ? (
          <div className="decrypt-section" style={{ marginTop: '1.5rem' }}>
            <button className="decrypt-button" disabled={busy || !instance} onClick={decryptNow}>
              {busy ? 'Decrypting...' : 'Decrypt'}
            </button>
          </div>
        ) : (
          <div className="decrypted-section" style={{ marginTop: '1.5rem' }}>
            <div className="success-message">
              <p>Successfully decrypted your data.</p>
            </div>
            <div className="refresh-section" style={{ marginTop: '1rem' }}>
              <button className="refresh-button" onClick={() => setDecrypted(null)}>Hide Decrypted Data</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

