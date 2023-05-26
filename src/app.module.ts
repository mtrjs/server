import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OverviewModule } from './overview/overview.module';
import { UserModule } from './user/user.module';
import { GlobalModule } from './global.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/monitor', {
      authSource: 'monitor',
      user: 'admin',
      pass: 'admin',
    }),
    GlobalModule,
    ReportModule,
    OverviewModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
