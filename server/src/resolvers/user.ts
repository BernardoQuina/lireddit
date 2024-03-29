import { User } from '../entities/User'
import { MyContext } from '../types'
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import argon2 from 'argon2'
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants'
import { UsernamePasswordInput } from './UsernamePasswordInput'
import { validateRegister } from '../utils/validateRegister'
import { sendEmail } from '../utils/sendEmail'
import { v4 } from 'uuid'

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() {req}: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email
    }

    // current user wants to see someone elses email
    return 'If you want their email, ask them directly'
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {

    if(newPassword.length < 8) {
      return { errors: [{
        field: 'newPassword',
        message: 'length must be at least 8 characters long'
      }]}
    }

    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    console.log(userId)

    if (!userId) {
      return  { errors: [{
        field: 'token',
        message: 'token expired'
      }]}
    }

    const userIdNum = parseInt(userId)
    const user = await User.findOne(userIdNum)

    if(!user) {
      return { errors: [{
        field: 'token',
        message: 'user no longer exists'
      }]}
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword)} // hash and update the new password
    )

    redis.del(key)

    // log in user after change password
    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis } : MyContext
  ) {
    const user = await User.findOne({ where: { email } })
    
    if (!user) {
      // the email is not in the db
      return true
    }

    const token = v4()
    
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3 // Expires in 3 days
    )

    
    
    await sendEmail(
      email,
      `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`
    )

    return true
  }

  @Query(() => User, { nullable: true })
  me(
    @Ctx() { req }: MyContext
  ) {
    // You are not logged in
    if(!req.session.userId) {
      return null
    }

    return User.findOne(req.session.userId)
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) {
      return { errors }
    }
    
    const hashedPassword = await argon2.hash(options.password)

    let user
    
    try {
      

      user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword
      }).save()

      return { user }
      
    } catch (err) {
      if(err.detail.includes('already exists') && err.detail.includes('username')) {
        // duplicate username or email error
        return {
          errors: [{
            field: 'username',
            message: 'username already taken'
          }]
        }
      }

      if(err.detail.includes('already exists') && err.detail.includes('email')) {
        // duplicate username or email error
        return {
          errors: [{
            field: 'email',
            message: 'This email is already used by an account'
          }]
        }
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user?.id
    
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne( usernameOrEmail.includes('@')
      ? { where: { email: usernameOrEmail } }
      : { where: { username: usernameOrEmail } }
    )

    if(!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: 'Invalid login'
        }]
      }
    }
    const valid = await argon2.verify(user.password, password)
    if(!valid) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: 'Invalid login'
        }]
      }
    }

    req.session.userId = user.id
    
    return { user }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy( err => {
      res.clearCookie(COOKIE_NAME)
      if (err) {
        console.log(err)
        resolve(false)
        return
      }
      
      resolve(true)
    }))
  }
}