import { ApiProperty } from '@nestjs/swagger';
export class AuthTokenDto {
  @ApiProperty({
    example: '0KxjLyIDRPk/QA/L3vS8sq90FMkFzHEpBarFJ5c+VuKi3H2ISH9LV2F9/wgkbuTt',
    type: 'string',
    description: 'Access Token',
    required: true,
  })
    accessToken: string;

  @ApiProperty({
    type: 'string',
    description: 'Refresh Token',
    required: true,
    example: '+LrPtZRtiyTq/B8Vhh+beQtzrppOSuP50mSrmCcIuXFR0/+rKefZ1uQV8m4elQrd',
  })
    refreshToken: string;
}
