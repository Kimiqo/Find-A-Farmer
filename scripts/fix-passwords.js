const bcrypt = require("bcryptjs");

async function generateHashes() {
  const passwords = {
    buyer: "Buyer123!",
    farmer: "Farmer123!",
    admin: "Admin123!",
  };

  const buyerHash = await bcrypt.hash(passwords.buyer, 10);
  const farmerHash = await bcrypt.hash(passwords.farmer, 10);
  const adminHash = await bcrypt.hash(passwords.admin, 10);

  console.log("Buyer Hash (Buyer123!):", buyerHash);
  console.log("Farmer Hash (Farmer123!):", farmerHash);
  console.log("Admin Hash (Admin123!):", adminHash);
}

generateHashes().catch(console.error);