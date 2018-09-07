import { ProfileDto } from 'profile/dto/profile.dto';
import { UserInfoDto } from './user-info.dto';

export class RegistrationDto {
    registrationFormDto: UserInfoDto;
    profileFormDto: ProfileDto;
}