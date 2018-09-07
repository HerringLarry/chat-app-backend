import { Profile } from './profile.entity';
import { Injectable, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {

  constructor(@InjectRepository(Profile)
  private readonly profileRepository: Repository<Profile> ){}

  async createProfile( profileDto: ProfileDto ): Promise<void> {
    await this.profileRepository.save(profileDto);
  }
}