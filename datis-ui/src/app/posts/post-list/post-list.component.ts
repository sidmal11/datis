import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  initialPosts: Post[] = [];
  filteredPosts: Post[] = [];
  firstname:any;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  isLoading = false;
  currentPage=1;
  totalPosts = 0;
  postsPerPage = 10;
  pageSizeOptions = [ 5, 10,25,50];
  userIsAuthenticated = false;
  userId: string;

  constructor(   public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading =true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.isLoading =false;
        this.totalPosts = postsData.postCount;
        this.posts = postsData.posts;
        this.initialPosts = postsData.posts;
        this.filteredPosts = this.initialPosts ;

      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();

  }

  Search(){
    if (this.firstname==""){
      this.posts = this.initialPosts;
    }else{
      this.posts = this.posts.filter( res=>{
        return res.name.toLocaleLowerCase().match(this.firstname.toLocaleLowerCase())
      })


    }
  }


}
