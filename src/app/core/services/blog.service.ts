// src/app/core/services/blog.service.ts
import { Injectable } from '@angular/core';
import { BLOG_POSTS, BlogPost } from '../data/blog-post';

@Injectable({ providedIn: 'root' })
export class BlogService {
  getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find(post => post.slug === slug);
  }

  getAllPosts(): BlogPost[] {
    return BLOG_POSTS;
  }
}