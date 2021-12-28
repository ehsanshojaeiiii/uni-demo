import {
    Column,
    BaseEntity as Base,
    PrimaryGeneratedColumn,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export class BaseEntity extends Base {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    createdBy?: number;

    @CreateDateColumn({type: "timestamp with time zone"})
    createdAt?: Date;

    @Column({nullable: true})
    updatedBy?: number;

    @UpdateDateColumn({type: "timestamp with time zone"})
    updatedAt?: Date;

}
