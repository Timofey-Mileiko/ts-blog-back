import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Field, ID, ObjectType } from 'type-graphql';



@ObjectType()
export class UserModel extends TimeStamps {
  @Field(() => String)
  @prop({ type: String, unique: true})
  public username?: string
  
  @prop({ type: String})
  public password?: string
  
  @Field(() => ID, { nullable: true })
  public _id?: mongoose.Types.ObjectId;

  @Field()
  @prop()
  createdAt?: Date

  @Field()
  @prop()
  updatedAt?: Date
}

const User = getModelForClass(UserModel);

export default User;

