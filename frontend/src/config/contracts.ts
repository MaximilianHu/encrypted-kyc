// EncryptedIdentity contract deployed on Sepolia
export const CONTRACT_ADDRESS = '0x9FB3DC39F2C0B4aE35fc916c18f5b729C113ea36';

// ABI copied from artifacts/contracts/EncryptedIdentity.sol/EncryptedIdentity.json
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "UserUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllUsers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "nameCiphertext",
        "type": "string"
      },
      {
        "internalType": "eaddress",
        "name": "encAddr",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "birthYear",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "countryId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "nameCiphertext",
        "type": "string"
      },
      {
        "internalType": "externalEaddress",
        "name": "extEncAddress",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint32",
        "name": "extBirthYear",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint32",
        "name": "extCountryId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "submitUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
