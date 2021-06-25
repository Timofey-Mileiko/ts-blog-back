import Post, { PostModel } from "../models/Post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [PostModel])
    async posts(): Promise<PostModel[] | null> {
        return await Post.find()
    }

    @Query(() => PostModel, { nullable: true })
    async post(
        @Arg('id') id: string
    ): Promise<PostModel | null> {
        return await Post.findById(id)
    }

    @Mutation(() => PostModel)
    createPost(
        @Arg('title') title: string
    ): Promise<PostModel> {
        const post = Post.create({ title })
        return post
    }

    @Mutation(() => PostModel, { nullable: true })
    async updatePost(
        @Arg("id") id: string,
        @Arg('title', () => String, { nullable: true }) title: string
    ): Promise<PostModel | null> {
        const post = await Post.findOne({
            _id: id,
        });

        if (typeof title !== 'undefined') {
            post!.title = title;
            post!.save()
        }

        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: string,
    ): Promise<boolean> {
        const deletedPost = await Post.findOneAndDelete({_id: id});
        if(!deletedPost){
            return false
        }
        return true
    }
}