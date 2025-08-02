import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService
  ) {}

  async sendActivationLink(
    full_name: string,
    email: string,
    activationLink: string
  ) {
    const url = `${process.env.API_URL || process.env.api_url}/api/auth/activate/${activationLink}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Accountingizni faollashtiring",
        template: "./confirmation", // <--- confirmation.hbs papkada bo‘lishi kerak
        context: {
          name: full_name,
          url,
        },
      });
      this.logger.log(`Activation email sent to ${email}`);
    } catch (err) {
      this.logger.error(
        `Failed to send activation email to ${email}`,
        err as any
      );
      throw err;
    }
  }
}
