// create-certificate.dto.ts
import { IsInt, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCertificateDto {
  @ApiProperty({ example: 1, description: "Foydalanuvchi ID raqami" })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 2, description: "Kurs ID raqami" })
  @IsInt()
  course_id: number;

  @ApiProperty({
    example: "https://yourdomain.com/certificates/1234.pdf",
    description: "Sertifikat fayl manzili (URL ko‘rinishida)",
  })
  @IsString()
  certificate_url: string;
}
