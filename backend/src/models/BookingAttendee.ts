import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { Booking } from './Booking';
import { User } from './User';

@Table({ tableName: 'BookingAttendees', timestamps: true })
export class BookingAttendee extends Model {
  @ForeignKey(() => Booking)
  @Column(DataType.INTEGER)
  bookingId!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => Booking) booking!: Booking;
  @BelongsTo(() => User) user!: User;

  // unique pair (bookingId, userId)
  @Unique('booking_user_unique')
  @Column(DataType.STRING)
  get bookingUserUnique() { return `${this.bookingId}_${this.userId}`; }
  set bookingUserUnique(_: string) {}
}