# Encrypted KYC - Privacy-Preserving Identity Management

A decentralized identity verification system leveraging **Fully Homomorphic Encryption (FHE)** to enable secure, private, and regulatory-compliant KYC (Know Your Customer) processes on the blockchain.

## 🌟 Overview

Encrypted KYC revolutionizes identity management by combining **blockchain transparency** with **cryptographic privacy**. Users can submit and store their personal information on-chain in an encrypted format that enables verification without exposing sensitive data to unauthorized parties.

### The Problem

Traditional KYC systems face critical challenges:

- **Privacy Risks**: Personal data stored in centralized databases is vulnerable to breaches, exposing millions of users to identity theft
- **Data Silos**: Users must repeatedly submit KYC information to different services, creating redundant data stores and increased attack surfaces
- **Lack of User Control**: Individuals have limited control over how their personal information is stored, accessed, and shared
- **Regulatory Compliance**: Organizations struggle to balance privacy regulations (GDPR, CCPA) with KYC/AML requirements
- **Trust Dependencies**: Users must trust third-party custodians with their most sensitive personal information
- **Immutable Public Records**: Blockchain transparency conflicts with privacy requirements for personal data

### The Solution

Encrypted KYC addresses these challenges through:

1. **Dual-Layer Encryption Architecture**
   - **Client-Side AES-GCM Encryption**: User names are encrypted client-side using the user's wallet address as key material, ensuring only the owner can decrypt their name
   - **Fully Homomorphic Encryption (FHE)**: Sensitive data (address, birth year, country ID) is encrypted using Zama's FHEVM, enabling on-chain computations on encrypted data

2. **User-Controlled Privacy**
   - Users maintain complete ownership of their encryption keys
   - Selective disclosure: Only authorized parties with proper permissions can access specific data fields
   - Decryption requires user signature verification through EIP-712 typed data

3. **Regulatory Compliance with Privacy**
   - Verifiable compliance without exposing raw data
   - Encrypted proofs enable age verification, geographic restrictions, and sanctions screening
   - Audit trails maintained on-chain without compromising user privacy

4. **Decentralized and Portable**
   - Single KYC submission can be reused across multiple dApps and services
   - No central authority controls user data
   - Blockchain-based storage ensures data availability and censorship resistance

## 🔑 Key Features

### Privacy-First Design

- **Zero-Knowledge Architecture**: Sensitive information never leaves the user's device in plaintext
- **End-to-End Encryption**: Client-side encryption for names using AES-GCM with PBKDF2 key derivation
- **FHE-Based Storage**: Birth year, country ID, and address encrypted using Zama's Fully Homomorphic Encryption
- **Selective Decryption**: Users control who can decrypt their information through on-chain access control lists

### Advanced Cryptography

- **AES-GCM (256-bit)**: Industry-standard authenticated encryption for client-side name protection
  - PBKDF2 key derivation with 100,000 iterations
  - Random IV generation for each encryption operation
  - Authenticated encryption prevents tampering

- **Fully Homomorphic Encryption (Zama FHEVM)**:
  - Enables computation on encrypted data without decryption
  - Future capability: Age verification without revealing exact birth year
  - Future capability: Geographic compliance checks without exposing location

### Blockchain Integration

- **Smart Contract Architecture**: Solidity smart contracts on Ethereum Sepolia testnet
- **On-Chain Access Control**: Fine-grained permissions managed through FHE's allow/allowThis mechanisms
- **Event-Driven Updates**: Real-time notifications for data submissions and updates
- **EIP-712 Signature Standard**: Secure, human-readable transaction signing

### User Experience

- **Modern React Frontend**: Clean, responsive UI built with React 19 and TypeScript
- **Web3 Wallet Integration**: Seamless connection using RainbowKit and Wagmi
  - MetaMask, Rainbow, Coinbase Wallet, and more
  - One-click wallet connection

- **Real-Time Encryption Status**: Visual feedback during encryption and blockchain operations
- **Intuitive Data Management**: Simple forms for submission, clear display of encrypted/decrypted states

## 🏗️ Technical Architecture

### Technology Stack

#### Smart Contracts
- **Solidity ^0.8.24**: Latest stable version with enhanced security features
- **Zama FHEVM (@fhevm/solidity ^0.8.0)**: Fully Homomorphic Encryption library
- **Hardhat**: Development environment, testing framework, and deployment tools
- **TypeChain**: Type-safe contract interactions

#### Frontend
- **React 19.1.1**: Modern UI framework with concurrent rendering
- **TypeScript 5.8.3**: Type-safe JavaScript for robust code
- **Vite 7.1.6**: Lightning-fast build tool and dev server
- **Wagmi 2.17.0**: React hooks for Ethereum interactions
- **RainbowKit 2.2.8**: Beautiful wallet connection UI
- **Ethers.js 6.15.0**: Ethereum library for contract interactions
- **Zama Relayer SDK (@zama-fhe/relayer-sdk ^0.2.0)**: FHE encryption client library

#### Cryptography
- **Web Crypto API**: Browser-native cryptographic operations
- **Zama FHEVM**: Fully homomorphic encryption for on-chain privacy
- **PBKDF2**: Password-based key derivation (100,000 iterations)
- **AES-GCM**: Authenticated encryption with 256-bit keys

#### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Solhint**: Solidity linting
- **Mocha & Chai**: Testing framework
- **Hardhat Gas Reporter**: Gas optimization insights

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  React Frontend (TypeScript)                       │    │
│  │  - Wallet Connection (RainbowKit)                  │    │
│  │  - Client-Side Encryption (Web Crypto)             │    │
│  │  - FHE Instance (Zama SDK)                         │    │
│  └─────────────────┬──────────────────────────────────┘    │
└────────────────────┼───────────────────────────────────────┘
                     │
                     │ HTTPS / Web3 RPC
                     │
┌────────────────────▼───────────────────────────────────────┐
│              Ethereum Sepolia Network                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │  EncryptedIdentity Smart Contract                  │    │
│  │  - FHE Storage (eaddress, euint32)                 │    │
│  │  - Access Control Lists                            │    │
│  │  - Event Emissions                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Zama FHE Coprocessor                              │    │
│  │  - Homomorphic Operations                          │    │
│  │  - Decryption Oracle                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

The `EncryptedIdentity` contract (contracts/EncryptedIdentity.sol:1) implements a hybrid encryption strategy:

```solidity
struct UserInfo {
    string nameCiphertext;      // Client-encrypted (AES-GCM)
    eaddress encAddress;        // FHE-encrypted address
    euint32 birthYear;          // FHE-encrypted birth year
    euint32 countryId;          // FHE-encrypted country ID
    bool exists;                // Registration status
}
```

**Key Functions**:
- `submitUser()` (contracts/EncryptedIdentity.sol:34): Submit/update encrypted identity with FHE input proof validation
- `getUserInfo()` (contracts/EncryptedIdentity.sol:91): Retrieve encrypted user data (view-only)
- `hasUser()` (contracts/EncryptedIdentity.sol:75): Check registration status
- `getAllUsers()` (contracts/EncryptedIdentity.sol:80): Get list of registered addresses

**Security Features**:
- ACL-based access control using FHE.allow() and FHE.allowThis()
- Input proof validation for all encrypted submissions
- Event-driven architecture for transparency
- No view function dependency on msg.sender (eliminates front-running risks)

### Encryption Workflows

#### Submission Flow
1. User enters personal information in the frontend form
2. **Name encryption** (frontend/src/utils/crypto.ts:28):
   - Derives AES-256 key from wallet address using PBKDF2 (100,000 iterations)
   - Generates random 12-byte IV
   - Encrypts name using AES-GCM
   - Encodes as Base64 string

3. **FHE encryption** (frontend/src/components/IdentitySubmit.tsx:37):
   - Creates encrypted input buffer for contract address
   - Encrypts address, birth year, and country ID using Zama SDK
   - Generates cryptographic proof

4. **Blockchain submission**:
   - Calls `submitUser()` with encrypted data and proof
   - Contract validates proof and stores encrypted values
   - Sets ACL permissions for user and contract

#### Decryption Flow
1. User requests to view their data (frontend/src/components/IdentityStatus.tsx:41)
2. **Name decryption**:
   - Derives same AES key from wallet address
   - Decodes Base64 ciphertext
   - Extracts IV and encrypted payload
   - Decrypts using AES-GCM

3. **FHE decryption**:
   - Generates ephemeral keypair
   - Creates EIP-712 typed signature for authorization
   - Submits decryption request to Zama relayer
   - Receives decrypted values through secure channel

## 🎯 Use Cases

### Individual Users
- **Single Sign-On for Web3**: Submit KYC once, reuse across multiple dApps
- **Privacy-Preserved Access**: Participate in regulated DeFi without exposing identity
- **Self-Sovereign Identity**: Full control over personal data and access permissions
- **Cross-Platform Portability**: Use same identity across different blockchain applications

### DeFi Protocols
- **Compliant Token Offerings**: Verify accredited investor status without seeing net worth
- **Geographic Restrictions**: Enforce regional limitations without exposing user location
- **Age Verification**: Confirm users meet minimum age requirements without revealing birth date
- **Sanctions Screening**: Check against restricted addresses without exposing user identity

### DAOs and Governance
- **Sybil Resistance**: One-person-one-vote with privacy-preserved uniqueness proofs
- **Reputation Systems**: Build on-chain reputation without doxxing participants
- **Compliance Voting**: Restrict proposals to verified members while maintaining anonymity

### Enterprise Solutions
- **B2B Identity Verification**: Verify business credentials without exposing proprietary information
- **Supply Chain Privacy**: Authenticate participants while protecting trade secrets
- **Confidential Auditing**: Enable compliance checks without revealing sensitive business data

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **MetaMask or compatible Web3 wallet**
- **Sepolia ETH**: For testnet transactions ([Get from faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/encrypted-kyc.git
   cd encrypted-kyc
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   PRIVATE_KEY=your_private_key_here
   INFURA_API_KEY=your_infura_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Compile smart contracts**

   ```bash
   npm run compile
   ```

5. **Run tests**

   ```bash
   npm run test
   ```

6. **Deploy to Sepolia testnet**

   ```bash
   npm run deploy:sepolia
   ```

7. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

8. **Configure contract address**

   Update `frontend/src/config/contracts.ts` with your deployed contract address:

   ```typescript
   export const CONTRACT_ADDRESS = "0xYourContractAddress";
   ```

9. **Start the development server**

   ```bash
   npm run dev
   ```

10. **Open your browser**

    Navigate to `http://localhost:5173`

### Usage

#### Submitting Your Identity

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Navigate to Submit Tab**: Click the "Submit" tab in the navigation
3. **Enter Information**:
   - Name: Your full name
   - Country ID: Numeric country identifier (e.g., 1=USA, 2=China, 3=UK)
   - Birth Year: Your year of birth (e.g., 1990)
4. **Submit**: Click "Submit" to encrypt and store your data on-chain
5. **Confirm Transaction**: Approve the transaction in your wallet
6. **Wait for Confirmation**: Transaction will be confirmed on Sepolia testnet

#### Viewing Your Identity

1. **Navigate to Status Tab**: Click the "Status" tab
2. **View Encrypted State**: Initially, data is shown as `***`
3. **Decrypt Data**: Click "Decrypt" button
4. **Sign Message**: Approve the EIP-712 signature request in your wallet
5. **View Decrypted Data**: Your information will be displayed in plaintext
6. **Hide Data**: Click "Hide Decrypted Data" to return to encrypted view

## 📁 Project Structure

```
encrypted-kyc/
├── contracts/                      # Solidity smart contracts
│   ├── EncryptedIdentity.sol      # Main identity registry contract
│   └── FHECounter.sol             # Example FHE counter
│
├── deploy/                         # Hardhat deployment scripts
│   └── 01_deploy_identity.ts      # Deploy EncryptedIdentity
│
├── test/                           # Smart contract tests
│   └── EncryptedIdentity.ts       # Contract test suite
│
├── tasks/                          # Custom Hardhat tasks
│   └── EncryptedIdentity.ts       # Task definitions
│
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── IdentityApp.tsx   # Main app container
│   │   │   ├── IdentitySubmit.tsx # Submission form
│   │   │   ├── IdentityStatus.tsx # Status/decryption view
│   │   │   └── Header.tsx         # Navigation header
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useZamaInstance.ts # FHE instance management
│   │   │   └── useEthersSigner.ts # Ethers.js integration
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   └── crypto.ts          # Client-side encryption
│   │   │
│   │   ├── config/                # Configuration files
│   │   │   ├── wagmi.ts           # Web3 configuration
│   │   │   └── contracts.ts       # Contract addresses & ABIs
│   │   │
│   │   ├── styles/                # CSS stylesheets
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Application entry point
│   │
│   ├── dist/                       # Production build output
│   └── package.json               # Frontend dependencies
│
├── artifacts/                      # Compiled contract artifacts
├── cache/                          # Hardhat cache
├── types/                          # TypeChain generated types
├── hardhat.config.ts              # Hardhat configuration
├── package.json                   # Root dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🧪 Testing

### Smart Contract Tests

Run the complete test suite:

```bash
npm run test
```

Test on Sepolia testnet:

```bash
npm run test:sepolia
```

Generate coverage report:

```bash
npm run coverage
```

### Test Coverage

The test suite covers:
- Contract deployment and initialization
- User submission with FHE encryption
- Data retrieval and decryption
- Access control list functionality
- Update operations
- Edge cases and error handling

## 🔐 Security Considerations

### Implemented Safeguards

1. **Client-Side Encryption**
   - Names never leave the device unencrypted
   - Key derivation uses strong PBKDF2 with 100,000 iterations
   - Random IV prevents identical ciphertexts for identical plaintexts

2. **Smart Contract Security**
   - Input proof validation prevents unauthorized data submission
   - ACL-based access control restricts decryption capabilities
   - Event emissions provide transparency and audit trails
   - View functions independent of msg.sender prevent front-running

3. **Cryptographic Best Practices**
   - AES-GCM provides authenticated encryption
   - FHE enables computation without decryption
   - EIP-712 signatures prevent replay attacks
   - Ephemeral keypairs for decryption requests

### Known Limitations

This is a proof-of-concept for educational purposes:

- **Testnet Only**: Currently deployed on Sepolia testnet only
- **Limited FHE Operations**: Computation on encrypted data not yet implemented
- **No Multi-Party Verification**: No validator network for identity verification
- **Browser Dependency**: Requires Web Crypto API support
- **Key Management**: Users responsible for wallet key security
- **Gas Costs**: FHE operations are more expensive than standard transactions

### Recommended Security Practices

For production deployment:

1. **Professional Security Audit**: Engage third-party auditors for smart contract review
2. **Key Management System**: Implement hardware wallet support and key backup mechanisms
3. **Rate Limiting**: Add submission frequency limits to prevent spam
4. **Identity Proofing**: Integrate with trusted identity verification services
5. **Upgrade Mechanism**: Implement proxy patterns for contract upgrades
6. **Privacy Policy**: Establish clear data handling and retention policies
7. **Incident Response**: Develop emergency pause and recovery procedures

## 🛣️ Roadmap

### Phase 1: Foundation (Completed)
- [x] Smart contract architecture with hybrid encryption
- [x] Client-side AES-GCM encryption for names
- [x] FHE integration for sensitive fields
- [x] React frontend with wallet integration
- [x] Deployment to Sepolia testnet
- [x] Basic encryption/decryption workflows

### Phase 2: Enhanced Privacy (Q2 2025)
- [ ] Zero-knowledge proofs for age verification
  - Prove age > 18 without revealing birth year
  - ZK-SNARK circuits for range proofs

- [ ] Encrypted attribute-based access control
  - Conditional decryption based on FHE-encrypted attributes
  - Time-locked access permissions

- [ ] Selective disclosure protocols
  - Choose which fields to reveal to which parties
  - Granular permission management UI

### Phase 3: Advanced Features (Q3 2025)
- [ ] Multi-signature verification
  - Require multiple parties to approve identity changes
  - Decentralized identity attestation

- [ ] Reputation scoring on encrypted data
  - Build credit scores without exposing transaction history
  - Private reputation aggregation

- [ ] Cross-chain identity portability
  - Bridge identities to other EVM chains
  - Layer 2 scaling solutions (Optimism, Arbitrum)

- [ ] Document verification
  - Upload and encrypt passport scans, utility bills
  - Verifiable document hashes

### Phase 4: Enterprise & Compliance (Q4 2025)
- [ ] Regulatory compliance toolkit
  - AML/KYC verification modules
  - GDPR right-to-be-forgotten implementation
  - Audit trail generation for regulators

- [ ] Enterprise identity federation
  - Single sign-on for corporate identities
  - Role-based access control for organizations

- [ ] SDK and API development
  - JavaScript/TypeScript SDK for developers
  - REST API for easy integration
  - Webhooks for real-time notifications

### Phase 5: Ecosystem Growth (2026)
- [ ] Mobile applications (iOS, Android)
  - Native mobile wallet integration
  - Biometric authentication

- [ ] Identity verification network
  - Decentralized verifier marketplace
  - Staking mechanism for verifiers
  - Dispute resolution protocol

- [ ] Governance token and DAO
  - Community-driven protocol upgrades
  - Fee distribution mechanisms
  - Decentralized treasury management

### Long-Term Vision
- Universal Web3 identity standard adopted across DeFi
- Privacy-preserving compliance recognized by regulators
- Integration with real-world identity systems (digital IDs, passports)
- Enable fully private, verifiable credential ecosystem

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Code Contributions**
   - Fix bugs and implement new features
   - Improve documentation
   - Write tests and increase coverage
   - Optimize gas usage

2. **Security Research**
   - Report vulnerabilities responsibly
   - Suggest cryptographic improvements
   - Review smart contract code

3. **Community Support**
   - Answer questions in discussions
   - Help users troubleshoot issues
   - Write tutorials and guides

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation

4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Coding Standards

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use ESLint and Prettier configurations provided
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- **Testing**: Maintain or improve code coverage

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License**. See the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- **Zama FHEVM**: BSD-3-Clause-Clear
- **OpenZeppelin Contracts**: MIT
- **Hardhat**: MIT
- **React**: MIT

## 🆘 Support

### Documentation

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh/)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/encrypted-kyc/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/yourusername/encrypted-kyc/discussions)
- **Zama Discord**: [Join the Zama community](https://discord.gg/zama)

### Getting Help

If you encounter issues:

1. Check existing [GitHub Issues](https://github.com/yourusername/encrypted-kyc/issues)
2. Search [Discussions](https://github.com/yourusername/encrypted-kyc/discussions)
3. Ask in [Zama Discord](https://discord.gg/zama)
4. Create a new issue with detailed information:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, browser)
   - Error messages and logs

## 🙏 Acknowledgments

This project builds upon incredible work from:

- **[Zama](https://www.zama.ai/)**: For pioneering fully homomorphic encryption and the FHEVM protocol
- **[Ethereum Foundation](https://ethereum.org/)**: For the robust blockchain infrastructure
- **[Hardhat Team](https://hardhat.org/)**: For the excellent development environment
- **[Rainbow Team](https://rainbow.me/)**: For the beautiful wallet connection experience
- **[Wagmi Team](https://wagmi.sh/)**: For the powerful React hooks for Ethereum

Special thanks to all contributors and the broader Web3 privacy community.

## 📊 Project Status

**Current Version**: 0.1.0 (Alpha)

**Deployment Status**:
- Sepolia Testnet: Active
- Mainnet: Not yet deployed
- Layer 2s: Planned

**Development Activity**:
- Active development in progress
- Regular updates and improvements
- Community feedback welcome

---

**Built with privacy for the Web3 community**

*Empowering users with self-sovereign identity through cutting-edge cryptography*
