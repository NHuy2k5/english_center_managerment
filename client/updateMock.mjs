import fs from 'fs';

const mockDataPath = './src/mockData.js';
let content = fs.readFileSync(mockDataPath, 'utf8');

// A simple regex replacement won't work well for adding multiple fields.
// Let's use a function to generate random string.
function generateRandomData(name, parentName) {
  const num = Math.floor(100 + Math.random() * 900); // 3 digit
  const firstNames = name.split(' ');
  const lastName = firstNames[firstNames.length - 1];
  const username = lastName.toLowerCase() + num;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  const password = prefix + num;

  const pNum = Math.floor(100 + Math.random() * 900);
  const pFirstNames = parentName.split(' ');
  const pLastName = pFirstNames[pFirstNames.length - 1];
  const pUsername = pLastName.toLowerCase() + pNum;
  const pPrefix = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
  const pPassword = pPrefix + pNum;

  const dob = `${Math.floor(1 + Math.random() * 28).toString().padStart(2, '0')}/${Math.floor(1 + Math.random() * 12).toString().padStart(2, '0')}/20${Math.floor(10 + Math.random() * 5)}`;

  return `\n    username: "${username}",\n    password: "${password}",\n    parentUsername: "${pUsername}",\n    parentPassword: "${pPassword}",\n    dob: "${dob}",`;
}

// Replace each student block by appending before 'status: '
const regex = /name: "([^"]+)",[\s\S]*?parentName: "([^"]+)",[\s\S]*?tuitionOwed:/g;
const newContent = content.replace(regex, (match, name, parentName) => {
  const insertIndex = match.lastIndexOf('tuitionOwed:');
  const generated = generateRandomData(name, parentName);
  return match.slice(0, insertIndex) + generated.trim() + ',\n    ' + match.slice(insertIndex);
});

fs.writeFileSync(mockDataPath, newContent, 'utf8');
console.log("Mock data updated.");
