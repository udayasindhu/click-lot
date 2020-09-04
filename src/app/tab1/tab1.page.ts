import { Component, ViewEncapsulation } from "@angular/core";
import { UserPostsService } from "../user-posts.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Page {
  form: FormGroup;

  // Suggested tags
  tags: string[] = ["#food", "#kofluencer", "#milk", "#egg", "#healthy"];

  // Default searched tags
  defaultTags: string[] = ["#cheeselove", "#kofluence"];

  // Tags searched by user
  searchedTags: Array<string>;

  // Data related to similar/suggested posts
  similarPosts: any = [];

  // Data related to user's posts
  userPosts: any = [];
  showScroll: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userPostsService: UserPostsService
  ) {}

  async ngOnInit() {
    var el = document.querySelector(".search");
    el.addEventListener("keyup", this.handleEv);
    el.addEventListener("blur", this.handleEv);

    this.form = this.formBuilder.group({
      tag: new FormControl(),
    });
    this.searchedTags = this.defaultTags;
    this.form.controls.tag.setValue(this.defaultTags.join(","));
    this.similarPosts = await this.userPostsService.getSimilarPosts(
      this.searchedTags
    );
    this.userPosts = this.userPostsService.getUserPosts();

    // Transforming number with K suffix for similar posts
    this.similarPosts.forEach((similar) => {
      similar.likes = this.getNumberFormat(similar.likes);
      similar.comments = this.getNumberFormat(similar.comments);
    });

    // Transforming number with K suffix for users' posts
    this.userPosts.forEach((userData) => {
      userData.likes = this.getNumberFormat(userData.likes);
      userData.comments = this.getNumberFormat(userData.comments);
    });
  }

  ngDoCheck(){
    this.similarPosts.forEach((post, index) => {
      this.similarPosts[index].likes = this.getNumberFormat(post.likes);
      this.similarPosts[index].comments = this.getNumberFormat(post.comments);
    });
  }

  /**
   * This will make sure that the default values are not removed from search bar.
   * @param event
   */
  handleEv(event) {
    var thisObj = event.currentTarget;
    var fixedValue = thisObj.getAttribute("data-fixedvalue");
    if (thisObj.value.indexOf(fixedValue) != 0) {
      event.preventDefault();
      thisObj.value = fixedValue;
    }
  }

  /**
   * This will call loadSimilarPost() on clikcing entering along with some data.
   * This will call removeTag() on clikcing backspace when there is some data.
   * @param event
   */
  onKeyUp(event: KeyboardEvent) {
    let inputValue = this.form.controls.tag.value;
    if (event.code === "Backspace" && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === "Enter") {
        this.loadSimliarPosts(inputValue);
      }
    }
  }

  /**
   * This will get related results on clicking enter in search bar
   * @param tag
   */
  async loadSimliarPosts(tag: string) {
    if (tag && tag.length > 0 && !this.tags.includes(tag)) {
      this.searchedTags = tag.split(",");
      this.similarPosts = await this.userPostsService.getSimilarPosts(this.searchedTags);
    }
  }

  /**
   * This will push a suggested tag to searched tags.
   * @param tag
   */
  async pushTag(tag: string) {
    let currentValue = this.form.controls.tag.value;
    if (tag && !currentValue.includes(tag)) {
      currentValue = currentValue ? currentValue + "," + tag : tag;
      this.form.controls.tag.setValue(currentValue);
      await this.loadSimliarPosts(currentValue);
      this.removeTag(tag);
    }
  }

  /**
   * This will remove a tag under suggested tags
   * @param tag
   */
  removeTag(tag?: string): void {
    if (this.tags.includes(tag)) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    }
  }

  /**
   * This method will transform number with K suffix when number exceeds 1000
   * @param number
   * @returns transformed number
   */
  getNumberFormat(number) {
    if (number === 0) {
      return 0;
    } else {
      if (number <= 999) {
        return number;
      } else if (number >= 1000 && number <= 999999) {
        return number / 1000 + "K";
      } else return number;
    }
  }
}
