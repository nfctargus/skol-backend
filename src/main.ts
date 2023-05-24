import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as ExpressSession from 'express-session'; 
import * as passport from 'passport';
import { DataSource } from 'typeorm';
import { Session } from 'utils/typeorm/entities/Session';
import { TypeormStore } from 'connect-typeorm';

async function bootstrap() {
    const {PORT,COOKIE_SECRET,SESSION_NAME,COOKIE_MAX_AGE} = process.env;
    const app = await NestFactory.create(AppModule);
    const sessionRepo = app.get(DataSource).getRepository(Session);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: [`http://localhost:3000`],credentials:true});
    app.use(
        ExpressSession({
            secret: COOKIE_SECRET,
            resave: true,
            name: SESSION_NAME,
            saveUninitialized: true,
            cookie: { maxAge: Number(COOKIE_MAX_AGE) },
            store: new TypeormStore().connect(sessionRepo),
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    try {
        await app.listen(PORT, () => console.log(`Nest Server is running on port ${PORT}`))
    } catch (err) {
        console.log(err)
    }
}
bootstrap();