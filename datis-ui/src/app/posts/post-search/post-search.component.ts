import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, startWith, map, switchMap } from 'rxjs/operators';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-book',
  templateUrl: './post-search.component.html',
  styleUrls: ['./post-search.component.css'],
})
export class PostSearchComponent implements OnInit {
  allBooks= new Subject <Post[]>();
  filteredBooks= new Subject<Post[]>();

  constructor(private formBuilder: FormBuilder, private postService: PostsService) { }

  ngOnInit() {
    this.$allBooks = this.bookService.getAllBooks();
    this.$filteredBooks = this.book.valueChanges
      .pipe(
        startWith(''),
        switchMap(value => this.filterBooks(value))
      );
  }
  private filterBooks(value: string | Book) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.$allBooks.pipe(
        map(books => books.filter(book => book.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.$allBooks;
    }
  }
  private displayFn(book?: Book): string | undefined {
    return book ? book.name : undefined;
  }
  bookForm = this.formBuilder.group({
    book: [null, Validators.required]
  });
  get book() {
    return this.bookForm.get('book');
  }
  onFormSubmit() {
    this.bookService.saveBook(this.bookForm.value);
    this.resetForm();
  }
  resetForm() {
    this.bookForm.reset();
  }
}
