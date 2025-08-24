import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'RefreshTokens', timestamps: true })
export class RefreshToken extends Model {
  @ForeignKey(() => User)
  @Index
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Index
  @Column(DataType.STRING)
  tokenHash!: string;

  @Index
  @Column(DataType.DATE)
  expiresAt!: Date;

  @Index
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  revoked!: boolean;

  @Column(DataType.STRING)
  userAgent?: string;

  @Column(DataType.STRING)
  ip?: string;
}
