import { Post } from "../entities/Post";
import { LiredditDbContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // Get Posts
  @Query(() => [Post])
  getPosts(@Ctx() { em }: LiredditDbContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  // Get Post
  @Query(() => Post, { nullable: true })
  getPost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: LiredditDbContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  // Create Post
  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: LiredditDbContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  // Update Post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { em }: LiredditDbContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  // Delete Post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: LiredditDbContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch {
      return false;
    }
  }
}
