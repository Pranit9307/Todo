import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../post';
import { PostService } from '../post-service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {
  posts: Post[] = [];
  statusFilter: string = 'all';
  dueDateFilter: string = '';

  constructor(private postService: PostService, private router: Router, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.statusFilter = 'all'; // Ensure default
      this.loadPosts();
    }
  }

  loadPosts() {
    const filters: any = {};
    if (this.statusFilter === 'completed') {
      filters.completed = true;
    } else if (this.statusFilter === 'pending') {
      filters.completed = false;
    }

    if (this.dueDateFilter) {
      filters.dueDate = this.dueDateFilter;
    }

    console.log('Loading posts with filters:', filters); // Debug log

    this.postService.getPosts(filters).subscribe((data: Post[]) => {
      this.posts = data;
      console.log('Posts loaded:', this.posts); // Debug log
      this.cdr.detectChanges(); // Force UI update
    });
  }

  applyFilter() {
    this.loadPosts();
  }


  editPost(id: number) {
    // Navigation handled by routerLink in template
  }

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.postService.deletePost(id).subscribe(() => {
        alert('Todo deleted successfully!');
        this.posts = this.posts.filter(post => post.id !== id);
      });
    }
  }

  toggleComplete(post: Post) {
    post.completed = !post.completed;
    this.postService.updatePost(post.id, post).subscribe(() => {
      console.log('Todo status updated');
    });
  }

}
