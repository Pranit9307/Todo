import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../post-service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  title = '';
  body = '';
  dueDate = '';

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  submit() {
    if (!this.title || !this.body) {
      alert('Title and Body are required!');
      return;
    }

    const input = {
      title: this.title,
      body: this.body,
      dueDate: this.dueDate || undefined,
      id: 1
    };

    this.postService.createPost(input).subscribe(() => {
      alert('Todo created successfully!');
      this.title = '';
      this.body = '';
      this.router.navigate(['/posts']); // now works
    });
  }
}
