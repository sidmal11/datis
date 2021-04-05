import { Component , OnInit} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute,ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/auth/auth.service";
import { Injectable } from "@angular/core";
import { ErrorComponent } from "src/app/error/error.component";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
@Injectable()
export class PostCreateComponent implements OnInit {
  enteredName = "";
  enteredSalary = "";
  enteredEid = "";
  post: Post;

  private mode = "create";
  isLoading = false;
  private postId: string;
  private authStatusSub: Subscription;


  constructor(public postsService: PostsService,public route: ActivatedRoute,private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            name: postData.name,
            salary: postData.salary,
            eid : postData.eid,
            deductions:postData.deductions,
            final: postData.final,
            creator: postData.creator,
           };
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }


  onSavePost(form: NgForm) {
    let msg ="";
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(form.value.name, form.value.salary,form.value.eid);
      msg = ` added `;
    } else {

      this.postsService.updatePost(
        this.postId,
        form.value.name,
        form.value.salary,
        form.value.eid,
      );
      msg = ` updated ` ;
    }
    this.dialog.open(ErrorComponent, {data: {message: `Information about ${form.value.name} updated has been ${msg}` }});
    form.resetForm();
  }
}
