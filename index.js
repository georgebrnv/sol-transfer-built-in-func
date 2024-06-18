// Create .env file and define SENDER_PRIVATE_KEY_64BYTES and RECEIVER_PUBLIC_KEY_BASE58 variables.
// SENDER_PRIVATE_KEY_64BYTES is number of bytes separated with commas, 
// RECEIVER_PUBLIC_KEY_BASE58 is a public key (wallet address).

const { 
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
    Connection,
    clusterApiUrl,
    sendAndConfirmTransaction,
} = require("@solana/web3.js");
require("dotenv").config();

// Importing sender Private Key from .env
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY_64BYTES;
let senderPrivateKeyArray = senderPrivateKey.split(',').map(Number);

// Importing receiver Public Key (Solana Wallet Address)
const receiverPublicKeyString = process.env.RECEIVER_PUBLIC_KEY_BASE58;

// Encoding Key Pair
let secretKey = Uint8Array.from(senderPrivateKeyArray);

// Generating Key Pair from sender Private Key
let fromKeypair = Keypair.fromSecretKey(secretKey);

// Creating PublicKey Object for receiver public key
let receiverPubKey = new PublicKey(receiverPublicKeyString);

// Setup connection
const connection = new Connection(clusterApiUrl('devnet'))

async function sendSol(fromKeypair, toKeypair, solAmount) {

    try {
        // Create a transaction
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toKeypair,
                lamports: solAmount * LAMPORTS_PER_SOL,
            }),
        );

        // Sign and send the transaction
        let signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [fromKeypair]
        );

        console.log("Transaction signature: ", signature);
    } catch (err) {
        console.error("Error sending transaction: ", err)
    }

};

sendSol(fromKeypair, receiverPubKey, 1);