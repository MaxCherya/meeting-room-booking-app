import { Table, Column, Model, DataType, Unique, HasMany } from 'sequelize-typescript';
import { Booking } from './Booking';

@Table({ tableName: 'Users', timestamps: true })
export class User extends Model {
  @Column(DataType.STRING) name!: string;
  @Unique @Column(DataType.STRING) email!: string;
  @Column(DataType.STRING) passwordHash!: string;

  @HasMany(() => Booking) bookings!: Booking[];
}