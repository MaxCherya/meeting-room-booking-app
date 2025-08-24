import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Unique } from 'sequelize-typescript';
import { Room } from './Room';
import { User } from './User';

@Table({ tableName: 'RoomMembers', timestamps: true })
export class RoomMember extends Model {
  @ForeignKey(() => Room) @Column(DataType.INTEGER) roomId!: number;
  @ForeignKey(() => User) @Column(DataType.INTEGER) userId!: number;

  @Column(DataType.ENUM('admin', 'user')) role!: 'admin' | 'user';

  @BelongsTo(() => Room) room!: Room;
  @BelongsTo(() => User) user!: User;

  @Unique('room_user_unique')
  @Column(DataType.STRING)
  get roomUserUnique() { return `${this.roomId}_${this.userId}`; }
  set roomUserUnique(_: string) {}
}