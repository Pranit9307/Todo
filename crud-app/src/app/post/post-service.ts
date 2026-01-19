import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = "http://localhost:8000/api";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getPosts(filters?: { completed?: boolean; dueDate?: string }): Observable<Post[]> {
    let params: any = {};
    if (isPlatformBrowser(this.platformId)) {
      const username = localStorage.getItem('username');
      if (username) {
        params['username'] = username;
      }
    }

    if (filters) {
      if (filters.completed !== undefined) {
        params['completed'] = filters.completed;
      }
      if (filters.dueDate) {
        params['dueDate'] = filters.dueDate;
      }
    }
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    if (isPlatformBrowser(this.platformId)) {
      const username = localStorage.getItem('username');
      if (username) {
        // @ts-ignore
        post['username'] = username;
      }
    }
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
