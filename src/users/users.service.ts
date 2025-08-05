import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`
      );
    }

    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  async approveTeacher(userId: number): Promise<{ message: string }> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "TEACHER") {
      throw new NotFoundException("O‘qituvchi topilmadi");
    }

    if (user.is_teacher_approved) {
      return { message: "Bu o‘qituvchi allaqachon tasdiqlangan" };
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { is_teacher_approved: true },
    });

    await this.prisma.notification.create({
      data: {
        user_id: user.id,
        title: 'O‘qituvchi tasdiqlandi',
        message: 'Siz o‘qituvchi sifatida tasdiqlandingiz. Endi tizimga kira olasiz.',
      },
    });

    return { message: "O‘qituvchi muvaffaqiyatli tasdiqlandi" };
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); 
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
