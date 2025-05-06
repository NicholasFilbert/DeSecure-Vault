# DeSecure-Vault
 DeSecure Vault is a decentralized and privacy-preserving file storage system that leverages cutting-edge Web3 technologies to ensure secure and verifiable data management.

 # Tech Stack
- IPFS (Kubo): Distributed file storage for decentralized content addressing and retrieval.
- zk-SNARKs: Zero-knowledge proofs to verify file integrity and ownership without revealing data.
- SIWE (Sign-In with Ethereum): Seamless and secure wallet-based authentication.
   
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
snarkjs powersoftau prepare phase2 pot12_0000.ptau pot12_final.ptau

# Setup the circuit and generate the proving and verification keys
snarkjs groth16 setup FileUploader.r1cs pot12_final.ptau filehash_0000.zkey
snarkjs zkey contribute filehash_0000.zkey filehash_final.zkey --name="contributor" -v

# Export the verification key
snarkjs zkey export verificationkey filehash_final.zkey verification_key.json
```

Note: You can create the snarkjs files anywhere and add it to your project later on. Just make sure your r1cs, wasm, and verification_key.json is corresponding
