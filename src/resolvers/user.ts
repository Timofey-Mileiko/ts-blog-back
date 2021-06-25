import User, { UserModel } from "../models/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { MyContext } from "src/types";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
    @Field()
    username!: string

    @Field()
    password!: string
}

@ObjectType()
class FieldError{
    @Field()
    field!: string

    @Field()
    message!: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => UserModel, {nullable: true})
    user?: UserModel
}

@Resolver()
export class UserResolver {
    @Query(() => UserModel, {nullable: true})
    async me(
        @Ctx() { req }: MyContext
    ){
        if(!req.session.userId){
            return null;
        }

        const user = await User.findById( req.session.userId )

        return user
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        if(options.username.length <= 2){
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }

        if(options.password.length <= 3){
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be greater than 3'
                }]
            }
        }

        const hashedPassword = await argon2.hash(options.password)
        try{
            const user = await User.create({ username: options.username, password: hashedPassword });

            req.session.userId = user._id;

            return { user }
        }catch(err){
            if(err.code === 11000){// || err.detail.includes("already exists")
                return{
                    errors: [{
                        field: 'username',
                        message: "Username already exists"
                    }]
                }
            }

            return {
                errors: [{
                    field: 'undefined',
                    message: err.detail.toString()
                }]
            }
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne({ username: options.username });
        if(!user){
            return{
                errors: [{
                    field: 'username',
                    message: "that username doesn't exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password!, options.password);
        if(!valid){
            return{
                errors: [{
                    field: 'password',
                    message: "incorrect password"
                }]
            }
        }

        req.session.userId = user._id;

        return { user }
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){
        return new Promise(resolve => req.session.destroy((err) => {
            res.clearCookie(COOKIE_NAME)
            if(err){
                console.log(err)
                resolve(false)
                return
            }

            resolve(true)
        }))
    }
}