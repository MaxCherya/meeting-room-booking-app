import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Booking } from './Booking';
import { RoomMember } from './RoomMember';

@Table({ tableName: 'Rooms', timestamps: true })
export class Room extends Model {
  @Column(DataType.STRING) name!: string;
  @Column(DataType.TEXT) description!: string;

  @HasMany(() => Booking) bookings!: Booking[];
  @HasMany(() => RoomMember) members!: RoomMember[];
}