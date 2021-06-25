import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Field, ID, ObjectType } from 'type-graphql';
// import { Exclude, Expose, Transform } from 'class-transformer';



@ObjectType()
export class PostModel extends TimeStamps {
  @Field(() => String)
  @prop({ type: () => String})
  public title?: string
  
  @Field(() => ID, { nullable: true })
  public _id?: mongoose.Types.ObjectId;

  @Field()
  @prop()
  createdAt?: Date

  @Field()
  @prop()
  updatedAt?: Date
}

const Post = getModelForClass(PostModel);

export default Post;

