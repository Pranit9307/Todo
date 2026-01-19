import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PostService } from '../post-service';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {
  post: Post = { id: 0, title: '', body: '' };

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.getPostById(+id).subscribe((data: Post) => {
        this.post = data;
      });
    }
  }

  submit() {
    if (!this.post.title || !this.post.body) {
      alert('Title and Body are required!');
      return;
    }

    this.postService.updatePost(this.post.id, this.post).subscribe(() => {
      alert('Todo updated successfully!');
      this.router.navigate(['/posts']);
    });
  }
}
