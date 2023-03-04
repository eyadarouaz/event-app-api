import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { SnakeNamingStrategy } from './shared/snake-naming.strategy';


//for more info : https://typeorm.io/data-source-options
const ormOptions : TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'database',
  database: 'events',
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
  synchronize: true,
}

@Module({
  imports: [ 
    TypeOrmModule.forRoot(ormOptions),
    AuthModule,
    UserModule,
    PostModule,
  ],
  providers: [],
})
export class AppModule {}
