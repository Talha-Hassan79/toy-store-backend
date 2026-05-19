import { AppDataSource } from '../src/data-source';
import { User } from '../src/auth/user.entity';
import * as bcrypt from 'bcrypt';

async function main() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const admin = await userRepo.findOne({ where: { email: 'admin@toystore.com' } });
  if (admin) {
    admin.password = await bcrypt.hash('admin123', 10);
    await userRepo.save(admin);
    console.log('Admin password updated successfully to "admin123"');
  } else {
    console.log('Admin user not found!');
  }
  await AppDataSource.destroy();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
