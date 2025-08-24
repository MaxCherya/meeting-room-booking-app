import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Room } from './Room';
import { User } from './User';

@Table({ tableName: 'Bookings', timestamps: true })
export class Booking extends Model {
  @ForeignKey(() => Room) @Column(DataType.INTEGER) roomId!: number;
  @ForeignKey(() => User) @Column(DataType.INTEGER) createdById!: number;

  @BelongsTo(() => Room) room!: Room;
  @BelongsTo(() => User) createdBy!: User;

  @Column(DataType.DATE) startsAt!: Date;
  @Column(DataType.DATE) endsAt!: Date;
  @Column(DataType.TEXT) description!: string;
}