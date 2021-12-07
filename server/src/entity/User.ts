import {
    Entity, 
    Column, 
    BeforeInsert
} from 'typeorm';
import { hash } from 'argon2';
import { Field, ObjectType } from 'type-graphql';
import { Base } from './base/Base';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ObjectType()
@Entity('users')
export class User extends Base {
    @Field()
    @IsNotEmpty({ message: 'Name is required' })
    @Column()
    name: string;

    @Field()
    @IsEmail(undefined, { message: 'Email is invalid'})
    @IsNotEmpty({ message: 'Email is required' })
    @Column({ unique: true })
    email: string;

    @Column()
    @MinLength(6, {
      message: 'Password must be at least 6 characters',
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
  
    @Field()
    @Column({ default: false })
    isAdmin: boolean;
  
    @BeforeInsert()
    async hashPassword() {
      this.password = await hash(this.password);
    }
}
