import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Post } from "./post.model";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/posts/";
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                name: post.name,
                salary: post.salary,
                eid: post.eid,
                deductions: post.deductions,
                final:post.final,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {

    return this.http.get<{
      _id: string;
      name: string;
      salary: number;
      eid: number;
      deductions: number;
      final: number;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(name: string, salary: number, eid: number) {


    const post: Post = { id: null, name:name ,eid:eid, salary: salary,creator:null, deductions: null,final:null };
    this.http
      .post<{ message: string, postId: string }>(BACKEND_URL, post)
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });


  }


  updatePost(id: string, name: string, salary: number, eid:number) {

    let postData: Post | FormData;
    postData = {
        id: id,
        name: name,
        salary: salary,
        eid:eid,
        deductions:null,
        final:null,
        creator: null
      };
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }
}
