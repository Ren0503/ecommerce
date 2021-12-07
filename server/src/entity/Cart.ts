import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseWithUser } from './base/BaseWithUser';
import { Product } from './Product';

@ObjectType()
@Entity('carts')
export class Cart extends BaseWithUser {
    @Field(() => Int)
    @Column({ type: 'int' })
    quantity: number;

    // Relations
    @PrimaryColumn('uuid')
    productId: string;

    @ManyToOne(() => Product)
    product: Product;
}
