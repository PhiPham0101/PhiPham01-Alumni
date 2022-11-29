const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Rating = require("../db/Rating");
const Blog = require("../db/Blog");

const router = express.Router();

// To add new job
router.post("/jobs", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền thêm bài đăng!",
    });
    return;
  }

  const data = req.body;

  let job = new Job({
    userId: user._id,
    title: data.title,
    companyname: data.companyname,
    linkwebsite: data.linkwebsite,
    postname: data.postname,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    dateOfPosting: data.dateOfPosting,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobType: data.jobType,
    salary: data.salary,
    info: data.info,
  });

  job
    .save()
    .then(() => {
      res.json({ message: "Thêm bài đăng thành công" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs", jwtAuth, (req, res) => {
  let user = req.user;

  let findParams = {};
  let sortParams = {};

  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q, "i"),
      },
    };
  }

  if (req.query.companyname) {
    findParams = {
      ...findParams,
      companyname: {
        $regex: new RegExp(req.query.companyname, "i"),
      },
    };
  }
  
  if (req.query.linkwebsite) {
    findParams = {
      ...findParams,
      linkwebsite: {
        $regex: new RegExp(req.query.linkwebsite, "i"),
      },
    };
  }

  if (req.query.postname) {
    findParams = {
      ...findParams,
      postname: {
        $regex: new RegExp(req.query.postname, "i"),
      },
    };
  }

  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }

  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  if (req.query.info) {
    findParams = {
      ...findParams,
      info: {
        $regex: new RegExp(req.query.info, "i"),
      },
    };
  }

  console.log(findParams);
  console.log(sortParams);

  // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
  // .skip(skip)
  // .limit(limit)

  let arr = [
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  console.log(arr);

  Job.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "Không tìm thấy bài đăng",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get info about a particular job
router.get("/jobs/:id", jwtAuth, (req, res) => {
  Job.findOne({ _id: req.params.id })
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Bài đăng không tồn tại",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to update info of a particular job
router.put("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền cập nhật bài đăng",
    });
    return;
  }
  Job.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Bài đăng không tồn tại",
        });
        return;
      }
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Cập nhật bài đăng thành công",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to delete a job
router.delete("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xóa bài đăng",
    });
    return;
  }
  Job.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa bài đăng",
        });
        return;
      }
      res.json({
        message: "Xóa bài đăng thành công",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "Người dùng không tồn tại",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "Người dùng không tồn tại",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update user details
router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.code) {
          recruiter.code = data.code;
        }
        if (data.course) {
          recruiter.course = data.course;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "Cập nhật thông tin người dùng thành công",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "Người dùng không tồn tại",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        if (data.profile) {
          jobApplicant.profile = data.profile;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "Cập nhật thông tin người dùng thành công",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// apply for a job [todo: test: done]
router.post("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "applicant") {
    res.status(401).json({
      message: "Bạn không có quyền nộp đơn ứng tuyển",
    });
    return;
  }
  const data = req.body;
  const jobId = req.params.id;

  // check whether applied previously
  // find job
  // check count of active applications < limit
  // check user had < 10 active applications && check if user is not having any accepted jobs (user id)
  // store the data in applications

  Application.findOne({
    userId: user._id,
    jobId: jobId,
    status: {
      $nin: ["deleted", "accepted", "cancelled"],
    },
  })
    .then((appliedApplication) => {
      console.log(appliedApplication);
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "Bạn đã ứng tuyển cho bài đăng này",
        });
        return;
      }

      Job.findOne({ _id: jobId })
        .then((job) => {
          if (job === null) {
            res.status(404).json({
              message: "Bài đăng không tồn tại",
            });
            return;
          }
          Application.countDocuments({
            jobId: jobId,
            status: {
              $nin: ["rejected", "deleted", "cancelled", "finished"],
            },
          })
            .then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxApplicants) {
                Application.countDocuments({
                  userId: user._id,
                  status: {
                    $nin: ["rejected", "deleted", "cancelled", "finished"],
                  },
                })
                  .then((myActiveApplicationCount) => {
                    if (myActiveApplicationCount < 10000) {
                      Application.countDocuments({
                        userId: user._id,
                        status: "accepted",
                      }).then((acceptedJobs) => {
                        if (acceptedJobs < 10000) {
                          const application = new Application({
                            userId: user._id,
                            recruiterId: job.userId,
                            jobId: job._id,
                            status: "applied",
                            sop: data.sop,
                          });
                          application
                            .save()
                            .then(() => {
                              res.json({
                                message: "Ứng tuyển thành công",
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.status(400).json({
                            message:
                              "Bạn không thể ứng tuyển.",
                          });
                        }
                      });
                    } else {
                      res.status(400).json({
                        message:
                          "Bạn không thể ứng tuyển.",
                      });
                    }
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Đã đạt đến giới hạn ứng tuyển",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.json(400).json(err);
    });
});

// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xem đơn ứng tuyển",
    });
    return;
  }
  const jobId = req.params.id;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  if (user.type === "recruiter") {
    if (status === "accepted") {

      Application.findOne({
        _id: id,
        recruiterId: user._id,
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Không tìm thấy ứng viên",
            });
            return;
          }

          Job.findOne({
            _id: application.jobId,
            userId: user._id,
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Bài đăng không tồn tại",
              });
              return;
            }

            Application.countDocuments({
              recruiterId: user._id,
              jobId: job._id,
              status: "accepted",
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application.status = status;
                application.dateOfJoining = req.body.dateOfJoining;
                application
                  .save()
                  .then(() => {
                    Application.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [
                            "rejected",
                            "deleted",
                            "cancelled",
                            "accepted",
                            "finished",
                          ],
                        },
                      },
                      {
                        $set: {
                          status: "cancelled",
                        },
                      },
                      { multi: true }
                    )
                      .then(() => {
                        if (status === "accepted") {
                          Job.findOneAndUpdate(
                            {
                              _id: job._id,
                              userId: user._id,
                            },
                            {
                              $set: {
                                acceptedCandidates: activeApplicationCount + 1,
                              },
                            }
                          )
                            .then(() => {
                              res.json({
                                message: `Application ${status} successfully`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Application ${status} successfully`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "Tất cả các vị trí cho công việc này đã được lấp đầy",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Application status cannot be updated",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "You don't have permissions to update job status",
      });
    }
  }
});

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recruiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

// to add or update a rating [todo: test]
// router.put("/rating", jwtAuth, (req, res) => {
//   const user = req.user;
//   const data = req.body;
//   if (user.type === "recruiter") {
//     // can rate applicant
//     Rating.findOne({
//       senderId: user._id,
//       receiverId: data.applicantId,
//       category: "applicant",
//     })
//       .then((rating) => {
//         if (rating === null) {
//           console.log("new rating");
//           Application.countDocuments({
//             userId: data.applicantId,
//             recruiterId: user._id,
//             status: {
//               $in: ["accepted", "finished"],
//             },
//           })
//             .then((acceptedApplicant) => {
//               if (acceptedApplicant > 0) {
//                 // add a new rating

//                 rating = new Rating({
//                   category: "applicant",
//                   receiverId: data.applicantId,
//                   senderId: user._id,
//                   rating: data.rating,
//                 });

//                 rating
//                   .save()
//                   .then(() => {
//                     // get the average of ratings
//                     Rating.aggregate([
//                       {
//                         $match: {
//                           receiverId: mongoose.Types.ObjectId(data.applicantId),
//                           category: "applicant",
//                         },
//                       },
//                       {
//                         $group: {
//                           _id: {},
//                           average: { $avg: "$rating" },
//                         },
//                       },
//                     ])
//                       .then((result) => {
//                         // update the user's rating
//                         if (result === null) {
//                           res.status(400).json({
//                             message: "Error while calculating rating",
//                           });
//                           return;
//                         }
//                         const avg = result[0].average;

//                         JobApplicant.findOneAndUpdate(
//                           {
//                             userId: data.applicantId,
//                           },
//                           {
//                             $set: {
//                               rating: avg,
//                             },
//                           }
//                         )
//                           .then((applicant) => {
//                             if (applicant === null) {
//                               res.status(400).json({
//                                 message:
//                                   "Error while updating applicant's average rating",
//                               });
//                               return;
//                             }
//                             res.json({
//                               message: "Rating added successfully",
//                             });
//                           })
//                           .catch((err) => {
//                             res.status(400).json(err);
//                           });
//                       })
//                       .catch((err) => {
//                         res.status(400).json(err);
//                       });
//                   })
//                   .catch((err) => {
//                     res.status(400).json(err);
//                   });
//               } else {
//                 // you cannot rate
//                 res.status(400).json({
//                   message:
//                     "Applicant didn't worked under you. Hence you cannot give a rating.",
//                 });
//               }
//             })
//             .catch((err) => {
//               res.status(400).json(err);
//             });
//         } else {
//           rating.rating = data.rating;
//           rating
//             .save()
//             .then(() => {
//               // get the average of ratings
//               Rating.aggregate([
//                 {
//                   $match: {
//                     receiverId: mongoose.Types.ObjectId(data.applicantId),
//                     category: "applicant",
//                   },
//                 },
//                 {
//                   $group: {
//                     _id: {},
//                     average: { $avg: "$rating" },
//                   },
//                 },
//               ])
//                 .then((result) => {
//                   // update the user's rating
//                   if (result === null) {
//                     res.status(400).json({
//                       message: "Error while calculating rating",
//                     });
//                     return;
//                   }
//                   const avg = result[0].average;
//                   JobApplicant.findOneAndUpdate(
//                     {
//                       userId: data.applicantId,
//                     },
//                     {
//                       $set: {
//                         rating: avg,
//                       },
//                     }
//                   )
//                     .then((applicant) => {
//                       if (applicant === null) {
//                         res.status(400).json({
//                           message:
//                             "Error while updating applicant's average rating",
//                         });
//                         return;
//                       }
//                       res.json({
//                         message: "Rating updated successfully",
//                       });
//                     })
//                     .catch((err) => {
//                       res.status(400).json(err);
//                     });
//                 })
//                 .catch((err) => {
//                   res.status(400).json(err);
//                 });
//             })
//             .catch((err) => {
//               res.status(400).json(err);
//             });
//         }
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } else {
//     // applicant can rate job
//     Rating.findOne({
//       senderId: user._id,
//       receiverId: data.jobId,
//       category: "job",
//     })
//       .then((rating) => {
//         console.log(user._id);
//         console.log(data.jobId);
//         console.log(rating);
//         if (rating === null) {
//           console.log(rating);
//           Application.countDocuments({
//             userId: user._id,
//             jobId: data.jobId,
//             status: {
//               $in: ["accepted", "finished"],
//             },
//           })
//             .then((acceptedApplicant) => {
//               if (acceptedApplicant > 0) {
//                 // add a new rating

//                 rating = new Rating({
//                   category: "job",
//                   receiverId: data.jobId,
//                   senderId: user._id,
//                   rating: data.rating,
//                 });

//                 rating
//                   .save()
//                   .then(() => {
//                     // get the average of ratings
//                     Rating.aggregate([
//                       {
//                         $match: {
//                           receiverId: mongoose.Types.ObjectId(data.jobId),
//                           category: "job",
//                         },
//                       },
//                       {
//                         $group: {
//                           _id: {},
//                           average: { $avg: "$rating" },
//                         },
//                       },
//                     ])
//                       .then((result) => {
//                         if (result === null) {
//                           res.status(400).json({
//                             message: "Error while calculating rating",
//                           });
//                           return;
//                         }
//                         const avg = result[0].average;
//                         Job.findOneAndUpdate(
//                           {
//                             _id: data.jobId,
//                           },
//                           {
//                             $set: {
//                               rating: avg,
//                             },
//                           }
//                         )
//                           .then((foundJob) => {
//                             if (foundJob === null) {
//                               res.status(400).json({
//                                 message:
//                                   "Error while updating job's average rating",
//                               });
//                               return;
//                             }
//                             res.json({
//                               message: "Rating added successfully",
//                             });
//                           })
//                           .catch((err) => {
//                             res.status(400).json(err);
//                           });
//                       })
//                       .catch((err) => {
//                         res.status(400).json(err);
//                       });
//                   })
//                   .catch((err) => {
//                     res.status(400).json(err);
//                   });
//               } else {
//                 // you cannot rate
//                 res.status(400).json({
//                   message:
//                     "You haven't worked for this job. Hence you cannot give a rating.",
//                 });
//               }
//             })
//             .catch((err) => {
//               res.status(400).json(err);
//             });
//         } else {
//           // update the rating
//           rating.rating = data.rating;
//           rating
//             .save()
//             .then(() => {
//               // get the average of ratings
//               Rating.aggregate([
//                 {
//                   $match: {
//                     receiverId: mongoose.Types.ObjectId(data.jobId),
//                     category: "job",
//                   },
//                 },
//                 {
//                   $group: {
//                     _id: {},
//                     average: { $avg: "$rating" },
//                   },
//                 },
//               ])
//                 .then((result) => {
//                   if (result === null) {
//                     res.status(400).json({
//                       message: "Error while calculating rating",
//                     });
//                     return;
//                   }
//                   const avg = result[0].average;
//                   console.log(avg);

//                   Job.findOneAndUpdate(
//                     {
//                       _id: data.jobId,
//                     },
//                     {
//                       $set: {
//                         rating: avg,
//                       },
//                     }
//                   )
//                     .then((foundJob) => {
//                       if (foundJob === null) {
//                         res.status(400).json({
//                           message: "Error while updating job's average rating",
//                         });
//                         return;
//                       }
//                       res.json({
//                         message: "Rating added successfully",
//                       });
//                     })
//                     .catch((err) => {
//                       res.status(400).json(err);
//                     });
//                 })
//                 .catch((err) => {
//                   res.status(400).json(err);
//                 });
//             })
//             .catch((err) => {
//               res.status(400).json(err);
//             });
//         }
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   }
// });

// // get personal rating
// router.get("/rating", jwtAuth, (req, res) => {
//   const user = req.user;
//   Rating.findOne({
//     senderId: user._id,
//     receiverId: req.query.id,
//     category: user.type === "recruiter" ? "applicant" : "job",
//   }).then((rating) => {
//     if (rating === null) {
//       res.json({
//         rating: -1,
//       });
//       return;
//     }
//     res.json({
//       rating: rating.rating,
//     });
//   });
// });

//to add new blog
router.post("/blogs", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền thêm bài viết!",
    });
    return;
  }

  const data = req.body;

  let blog = new Blog({
    userId: user._id,
    title: data.title,
    content: data.content,
    likecount: data.likecount,
  });

  blog
    .save()
    .then(() => {
      res.json({ message: "Thêm bài viết thành công" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/blogs", jwtAuth, (req, res) => {
  let user = req.user;

  let findParams = {};
  let sortParams = {};
  
  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myblogs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q, "i"),
      },
    };
  }

  if (req.query.companyname) {
    findParams = {
      ...findParams,
      content: {
        $regex: new RegExp(req.query.content, "i"),
      },
    };
  }
  
  if (req.query.linkwebsite) {
    findParams = {
      ...findParams,
      likecount: {
        $regex: new RegExp(req.query.likecount, "i"),
      },
    };
  }

  console.log(findParams);
  console.log(sortParams);

  let arr = [
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  console.log(arr);

  Blog.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "Không tìm thấy bài đăng",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get info about a particular blog
router.get("/blogs", jwtAuth, (req, res) => {
  Blog.findOne({ _id: req.params.id })
    .then((blog) => {
      if (blog == null) {
        res.status(400).json({
          message: "Bài viết không tồn tại",
        });
        return;
      }
      res.json(blog);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//update blog
router.put("/blogs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền cập nhật bài viết",
    });
    return;
  }
  Blog.findOne({
    _id: req.params.id,
    userId: user.id,
  })
  .then((blog) => {
    if (blog == null) {
      res.status(404).json({
        message: "Bài viết không tồn tại",
      });
      return;
    }
    const data = req.body;
    if (data.maxApplicants) {
      blog.content = data.content;
    }
    blog
      .save()
      .then(() => {
        res.json({
          message: "Cập nhật bài viết thành công",
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  })
  .catch((err) => {
    res.status(400).json(err);
  });

});

// to delete a blog
router.delete("/blogs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "Bạn không có quyền xóa bài đăng",
    });
    return;
  }
  Blog.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((blog) => {
      if (blog === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa bài đăng",
        });
        return;
      }
      res.json({
        message: "Xóa bài đăng thành công",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
