import {User} from "../entities/User";
import {LiredditDbContext} from "src/types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UserNamePasswordOptions {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], {nullable: true})
	errors?: FieldError[];

	@Field(() => User, {nullable: true})
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg("options") options: UserNamePasswordOptions,
		@Ctx() {em}: LiredditDbContext
	): Promise<UserResponse> {
		if (options.username.length < 5) {
			return {
				errors: [
					{
						field: "username",
						message: "Username must be at least 5 characters",
					},
				],
			};
		}
		if (options.password.length < 8) {
			return {
				errors: [
					{
						field: "password",
						message: "Password must be at least 8 characters",
					},
				],
			};
		}
		const hashedPassword = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPassword,
		});
		await em.persistAndFlush(user);
		return {
			user,
		};
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("options") options: UserNamePasswordOptions,
		@Ctx() {em, req}: LiredditDbContext
	): Promise<UserResponse> {
		const user = await em.findOneOrFail(User, {username: options.username});
		if (!user) {
			return {
				errors: [
					{
						field: "username",
						message: "That user does not exist",
					},
				],
			};
		}
		const validPassword = await argon2.verify(user.password, options.password);
		if (!validPassword) {
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect password",
					},
				],
			};
		}

		//req.session.userId = user.id;

		return {
			user,
		};
	}
}
