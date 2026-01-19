import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = "http://localhost:8000/api";

  constructor(private http: HttpClient) { }

  getPosts(filters?: { completed?: boolean; dueDate?: string }): Observable<Post[]> {
    let params = {};
    if (filters) {
      if (filters.completed !== undefined) {
        // @ts-ignore
        params['completed'] = filters.completed;
      }
      if (filters.dueDate) {
        // @ts-ignore
        params['dueDate'] = filters.dueDate;
      }
    }
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
