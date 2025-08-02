import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentStatusDto } from "./dto/update-payment-status.dto";
import { PaymentStatus } from "../../generated/prisma";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePaymentDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.course_id },
    });
    if (!course) throw new NotFoundException("Kurs topilmadi");

    const amount = course.price;

    return this.prisma.payment.create({
      data: {
        user_id: userId,
        course_id: dto.course_id,
        amount,
        payment_method: dto.payment_method,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async updateStatus(paymentId: number, dto: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException("Payment topilmadi");

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: dto.status,
        paid_at: dto.status === PaymentStatus.SUCCEEDED ? new Date() : null,
      },
    });
  }

  async findMyPayments(userId: number) {
    return this.prisma.payment.findMany({
      where: { user_id: userId },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: { user: true, course: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneById(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { course: true, user: true },
    });
    if (!payment) throw new NotFoundException("Payment topilmadi");
    return payment;
  }
}
