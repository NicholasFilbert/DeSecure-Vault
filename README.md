# DeSecure-Vault
 DeSecure Vault is a decentralized and privacy-preserving file storage system that leverages cutting-edge Web3 technologies to ensure secure and verifiable data management.

 # Tech Stack
- IPFS (Kubo): Distributed file storage for decentralized content addressing and retrieval.
- zk-SNARKs: Zero-knowledge proofs to verify file integrity and ownership without revealing data.
- SIWE (Sign-In with Ethereum): Seamless and secure wallet-based authentication.

## DB Structure
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    chain_id INTEGER NOT NULL,
    directory_ipfs_cid TEXT default null,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (wallet_address, chain_id)
);

CREATE TABLE directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  parent_directory_id UUID REFERENCES directory(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active boolean default true
);


CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  directory_id UUID REFERENCES directory(id) ON DELETE SET NULL,
  name TEXT,
  category TEXT,
  ipfs_cid TEXT,
  file_hash TEXT,
  size BIGINT,
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN default true
); 
```
  
## How to run Zk-Snark
Install Snarkjs
```bash
npm install -g circom snarkjs
```
Install circom
```
git clone https://github.com/iden3/circom.git
```
Reference: https://docs.circom.io/getting-started/installation/#installing-dependencies

##Run
```bash
# Compile the circuit
circom FileUploader.circom --r1cs --wasm --sym --output .

# Generate Powers of Tau parameters (only needed once, can be reused for other circuits)
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First Contributor" -v
snarkjs powersoftau beacon pot12_0001.ptau pot12_beacon.ptau public_hexadecimal_verifiable_random_value_like_chain_hash 10 -v
snarkjs powersoftau prepare phase2 pot12_beacon.ptau pot12_final.ptau

# Setup the circuit and generate the proving and verification keys
snarkjs groth16 setup FileUploader.r1cs pot12_final.ptau filehash_0000.zkey
snarkjs zkey contribute filehash_0000.zkey filehash_0001.zkey --name="contributor 2" -v
snarkjs zkey beacon filehash_0001.zkey filehash_final.zkey public_hexadecimal_verifiable_random_value_like_chain_hash 10 -v

# Export the verification key
snarkjs zkey export verificationkey filehash_final.zkey verification_key.json
```

Note: You can create the snarkjs files anywhere and add it to your project later on. Just make sure your r1cs, wasm, and verification_key.json is corresponding
