import { PartialType } from "@nestjs/swagger";
import { CreateCertificateDto } from "./create-cretificate.dto";

export class UpdateCretificateDto extends PartialType(CreateCertificateDto) {}
