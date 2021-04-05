const Post = require("../models/post");
const foo = require("./tax_calc");

exports.createPost = (req, res, next) => {
  const final = Math.round(foo(req.body.salary));
  const deductions = req.body.salary - final;

  const post = new Post({
    name: req.body.name,
    salary: req.body.salary,
    deductions: deductions,
    eid: req.body.eid,
    final: final,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost._id,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Employee creation failed" });
    });
};

exports.updatePost = (req, res, next) => {
  const final = Math.round(foo(req.body.salary));
  const deductions = req.body.salary - final;

  const post = new Post({
    _id: req.body.id,
    name: req.body.name,
    salary: req.body.salary,
    eid: req.body.eid,
    deductions: deductions,
    final: final,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldnt update employee",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching employee failed",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching employee failed",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Deleting employee failed",
      });
    });
};
