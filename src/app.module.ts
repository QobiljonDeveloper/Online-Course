import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { RequestLoggerMiddleware } from "./common/loggers/request.logger";
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CoursesModule } from './courses/courses.module';
import { CategoryModule } from './category/category.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { CourseProgressModule } from './course-progress/course-progress.module';
import { LessonProgressModule } from './lesson_progress/lesson_progress.module';
import { CoursePurcahseModule } from './course-purcahse/course-purcahse.module';
import { CourseReviewModule } from './course-review/course-review.module';
import { PaymentModule } from './payment/payment.module';
import { GroupModule } from './group/group.module';
import { GroupMessageModule } from './group-message/group-message.module';
import { PrivateChatModule } from './private_chat/private_chat.module';
import { PrivateMessageModule } from './private_message/private_message.module';
import { CretificateModule } from './cretificate/cretificate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminsModule,
    NotificationsModule,
    CoursesModule,
    CategoryModule,
    ModulesModule,
    LessonsModule,
    CourseProgressModule,
    LessonProgressModule,
    CoursePurcahseModule,
    CourseReviewModule,
    PaymentModule,
    GroupModule,
    GroupMessageModule,
    PrivateChatModule,
    PrivateMessageModule,
    CretificateModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
