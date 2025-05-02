import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/User.entity';
import { UserRole } from '../modules/user/user.types';

export async function createSuperAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(UserEntity);

  const superAdminEmail = 'abyvkrm2004@gmail.com'; 

  try {
    let superAdmin = await userRepository.findOne({
      where: { email: superAdminEmail }
    });

    if (superAdmin) {
      superAdmin.role = UserRole.SUPER_ADMIN;
      await userRepository.save(superAdmin);
      console.log(`User ${superAdminEmail} is now a super admin`);
    } else {
      console.log(`User with email ${superAdminEmail} not found`);
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
} 