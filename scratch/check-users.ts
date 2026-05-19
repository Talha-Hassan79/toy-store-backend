import { AppDataSource } from '../src/data-source';
import { User } from '../src/auth/user.entity';

async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  console.log('Registered Users:');
  console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified })));
  await AppDataSource.destroy();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
