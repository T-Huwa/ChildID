const fs = require("fs").promises;
const path = require("path");

const USER_FILE = path.join(__dirname, "../../users.json");
let users = [];

async function loadUsers() {
  try {
    const data = await fs.readFile(USER_FILE, "utf8");
    users = JSON.parse(data);
  } catch (error) {
    users = [];
  }
}

async function saveUsers() {
  await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));
}

loadUsers();

module.exports = { users, saveUsers };
