const bcrypt = require("bcrypt");

const passwords = ["user1", "user2", "admin"];

async function generateHashes() {
    for (const password of passwords) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`Password: ${password}, Hash: ${hash}`);
    }
}

generateHashes();

// Password: user1, Hash: $2b$10$pU3VOTzFo/loylATFj6THuSWsFAgSFvbbazSRubGMP78bhmigeWMu
// Password: user2, Hash: $2b$10$qHTcfAyl/E58bvwJerIGnOSJz.DY7q/qHeGZcbh88znHJ7/VQ2Jiq
// Password: admin, Hash: $2b$10$dhdI02k/ycpSFwEPUHavGetPX66xUU9aYhGBaDAxe8ILYVQV98q5C