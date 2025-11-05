import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  const email = 'admin@example.com';
  const password = 'Admin@123456';

  console.log('🔍 Testing login credentials...');
  console.log('Email:', email);
  console.log('Password:', password);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log('✅ User found in database');
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('User Role:', user.role);
  console.log('Password Hash (first 20 chars):', user.passwordHash.substring(0, 20) + '...');

  // Test password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  console.log('\n🔐 Password verification result:', isValid ? '✅ VALID' : '❌ INVALID');

  if (!isValid) {
    // Try to create new hash and compare
    console.log('\n🔧 Creating fresh hash for comparison...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('New Hash (first 20 chars):', newHash.substring(0, 20) + '...');
    const testCompare = await bcrypt.compare(password, newHash);
    console.log('Test verification:', testCompare ? '✅ VALID' : '❌ INVALID');
  }
}

testLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
