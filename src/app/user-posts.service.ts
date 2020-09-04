import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserPostsService {
  private userPosts = [
    {
      hashtag: "#cheeselove",
      name: "Burger",
      date: "19 Sep",
      type: "image",
      icon: "image",
      likes: 43487,
      comments: 324,
      img: "../assets/Images/Burger.jpg",
    },
    {
      hashtag: "#kofluence",
      name: "Pasta",
      date: "21 Sep",
      type: "image",
      icon: "image",
      likes: 1934,
      comments: 5064,
      img: "../assets/Images/Pasta.jpg",
    },
    {
      hashtag: "#food",
      name: "Salad",
      date: "1 Sep",
      type: "image",
      icon: "image",
      likes: 21035,
      comments: 23453,
      img: "../assets/Images/Salad.jpg",
    },
    {
      hashtag: "#kofluencer",
      name: "Sandwich",
      date: "8 Aug",
      type: "image",
      icon: "image",
      likes: 11340,
      comments: 2308,
      img: "../assets/Images/Sandwich.jpg",
    }
  ];

  constructor(private http: HttpClient) {}

  getSimilarPosts(tags: Array<string>) {
    return new Promise((resolve, reject) => {
      try {
        let processedTags = [];
        let processedPosts = [];
        let products = [];
        this.http.get("../assets/db/hashtags.json").subscribe((hashData) => {
          tags.forEach((tag) => {
            if (!processedTags.includes(tag)) {
              processedTags.push(tag);
              let tagData = hashData[tag];
              this.http.get("../assets/db/posts.json").subscribe((postData) => {
                tagData.forEach((post) => {
                  if (!processedPosts.includes(post)) {
                    processedPosts.push(post);
                    products.push(postData[post]);
                  }
                });
                resolve(products);
              });
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserPosts() {
    return this.userPosts;
  }
}
