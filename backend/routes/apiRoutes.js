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
const Comment = require("../db/Comment");

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
      res.status(400).json({ message: "Vui lòng nhập các trường bắt buộc, số lượng cần tuyển > 0 và hạn đăng ký > thời gian hiện tại" });
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
    .sort({ dateOfPosting: -1 })
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

//////////////////////////////////////////////////User//////////////////////////////////////

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


router.get("/userroute/:id", (req, res) => {
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


router.get("/userpublic/:id", (req, res) => {
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
        if (data.resume) {
          jobApplicant.resume = data.resume;
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


//////////////////////////////////////////////Nộp đơn ứng tuyển///////////////////////////////////////////////

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
      $nin: ["accepted", "cancelled"],
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
              $nin: ["cancelled", "finished"],
            },
          })
            .then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxApplicants) {
                Application.countDocuments({
                  userId: user._id,
                  status: {
                    $nin: ["cancelled", "finished"],
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
  const sopcancel = req.body.sopcancel;

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

                console.log(sopcancel);
                console.log('hgffgggffg');
                application.dateOfJoining = req.body.dateOfJoining;
                application.sopcancel = sopcancel;

                application
                  .save()
                  .then(() => {
                    console.log('bbbbbbbbbbbbbbbbbbb');

                    Application.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [
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
                        console.log('aaaaaaaaaaaaaaaaaa');

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
                                message: `Hồ sơ ứng tuyển đã được duyệt thành công`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Hồ sơ ứng tuyển đã được xóa`,
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
                  message: "LỖI!",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      console.log('gffffffffffff');
      //In lý do từ chối
      console.log(sopcancel);


      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["cancelled"],
          },
        },
        {
          $set: {
            status: status,
            sopcancel: sopcancel,
          },
        }
      )
        .then((application) => {
          console.log('qqqqqqqqqqqqqqqqqq');

          if (application === null) {
            res.status(400).json({
              message: "Không thể cập nhật trạng thái!",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Hồ sơ ứng tuyển đã được xóa khỏi danh sách ứng viên`,
            });
          } else {
            res.json({
              message: `Hồ sơ ứng tuyển đã được xóa khỏi danh sách ứng viên`,
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
      console.log('sopcancelrrrrrrr2');

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
            message: `Hồ sơ đã bị hủy`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "Bạn không có quyền cập nhật công việc",
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
            message: "Không tìm thấy ứng viên nào trong danh sách!",
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
      message: "Bạn không được phép truy cập danh sách ứng viên!",
    });
  }
});


////////////////////////////////BLOGS//////////////////////////////////////////////////////////////////

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
    postname: data.postname,
    avatar: data.avatar,
  });

  blog
    .save()
    .then(() => {
      res.json({ message: "Thêm bài viết thành công" });
    })
    .catch((err) => {
      res.status(400).json({ message: "Vui lòng nhập đầy đủ tất cả các thông tin!" });
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
      postname: {
        $regex: new RegExp(req.query.postname, "i"),
      },
    };
  }

  if (req.query.linkwebsite) {
    findParams = {
      ...findParams,
      avatar: {
        $regex: new RegExp(req.query.avatar, "i"),
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
    .sort({ dateOfPosting: -1 })
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
router.get("/blogs/:id", (req, res) => {
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

router.put("/blogs/:id", jwtAuth, (req, res) => {
  const id = req.params.id;
  if (id !== null) {
    const user = req.user;
    if (user.type != "recruiter") {
      res.status(401).json({
        message: "Bạn không có quyền cập nhật bài viết",
      });
    } else {
      Blog.findOne({
        _id: req.params.id,
        userId: user.id,
      }).then((blog) => {
        if (blog == null) {
          res.status(404).json({
            message: "Bài viết không tồn tại",
          });
        } else {
          const data = req.body;
          if (data.title) {
            blog.title = data.title;
          }
          if (data.postname) {
            blog.postname = data.postname;
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
        }
      })
    }
  } else {
    res.status(401).json({
      message: "Khong co id",
    });
  }
})


//update blog
// router.put("/blogs/:id", jwtAuth, (req, res) => {
//   const user = req.user;
//   if (user.type != "recruiter") {
//     res.status(401).json({
//       message: "Bạn không có quyền cập nhật bài viết",
//     });
//     return;
//   }
//   Blog.findOne({
//     _id: req.params.id,
//     userId: user.id,
//   })
//   .then((blog) => {
//     if (blog == null) {
//       res.status(404).json({
//         message: "Bài viết không tồn tại",
//       });
//       return;
//     }
//     const data = req.body;
//     if (data.title) {
//       blog.title = data.title;
//     }
//     if (data.postname) {
//       blog.postname = data.postname;
//     }
//     blog
//       .save()
//       .then(() => {
//         res.json({
//           message: "Cập nhật bài viết thành công",
//         });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   })
//   .catch((err) => {
//     res.status(400).json(err);
//   });

// });

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




//////////////////////////////////////////////////
//add comment
router.post("/comments", jwtAuth, (req, res) => {
  const user = req.user;

  const data = req.body;

  let comment = new Comment({
    userId: user._id,
    commentcontent: data.commentcontent,
  });

  comment
    .save()
    .then(() => {
      res.json({ message: "Thêm bài viết thành công" });
    })
    .catch((err) => {
      res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắc buộc!" });
    });
});

// router.get("/comments", jwtAuth, (req, res) => {
//   let user = req.user;

//   let findParams = {};
//   let sortParams = {};

//   // to list down jobs posted by a particular recruiter
//   if (user.type === "recruiter" && req.query.myblogs) {
//     findParams = {
//       ...findParams,
//       userId: user._id,
//     };
//   }

//   if (req.query.q) {
//     findParams = {
//       ...findParams,
//       title: {
//         $regex: new RegExp(req.query.q, "i"),
//       },
//     };
//   }

//   if (req.query.companyname) {
//     findParams = {
//       ...findParams,
//       postname: {
//         $regex: new RegExp(req.query.postname, "i"),
//       },
//     };
//   }

//   if (req.query.linkwebsite) {
//     findParams = {
//       ...findParams,
//       avatar: {
//         $regex: new RegExp(req.query.avatar, "i"),
//       },
//     };
//   }

//   console.log(findParams);
//   console.log(sortParams);

//   let arr = [
//     {
//       $lookup: {
//         from: "recruiterinfos",
//         localField: "userId",
//         foreignField: "userId",
//         as: "recruiter",
//       },
//     },
//     { $unwind: "$recruiter" },
//     { $match: findParams },
//   ];

//   if (Object.keys(sortParams).length > 0) {
//     arr = [
//       {
//         $lookup: {
//           from: "recruiterinfos",
//           localField: "userId",
//           foreignField: "userId",
//           as: "recruiter",
//         },
//       },
//       { $unwind: "$recruiter" },
//       { $match: findParams },
//       {
//         $sort: sortParams,
//       },
//     ];
//   }

//   console.log(arr);

//   Blog.aggregate(arr)
//     .sort({ dateOfPosting: -1 })
//     .then((posts) => {
//       if (posts == null) {
//         res.status(404).json({
//           message: "Không tìm thấy bài đăng",
//         });
//         return;
//       }
//       res.json(posts);
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

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

// //update blog
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
      if (data.title) {
        blog.title = data.title;
      }
      if (data.postname) {
        blog.postname = data.postname;
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






/////////////////////////////////////Comment////////////////////////////////////////////
//add
router.post("/binhluans", (req, res) => {
  

  const data = req.body;

  let binhluan = new Comment({
    userId: data.userId,
    blogId: data.blogId,
    commentcontent: data.commentcontent,
  });

  binhluan
    .save()
    .then(() => {
      res.json({ message: "Thêm bình luận thành công" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


router.get('/getbinhluan/:idbaidang', (req, res) => {
  
  try {
    Comment.find({blogId: req.params.idbaidang}).then((data)=>{
    res.json(data);
    })
  } catch (error) {
    console.log(error)
  }
})

router.delete('/deletebinhluan/:iddelete', (req, res) => {
  
  try {
    Comment.find({_id: req.params.iddelete}).remove().exec()
    res.json("success");
  } catch (error) {
    console.log(error)
  }

})






router.get("/binhluans", jwtAuth, (req, res) => {
  let user = req.user;
  let blog = req.blog;


  let findParams = {};
  let sortParams = {};

  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && user.type === "applicant") {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (blog.type === "recruiter" && blog.type === "applicant") {
    findParams = {
      ...findParams,
      blogId: blog._id,
    };
  }

  if (req.query.companyname) {
    findParams = {
      ...findParams,
      commentcontent: {
        $regex: new RegExp(req.query.commentcontent, "i"),
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
        // localField: "blogId",
        foreignField: "userId",
        // foreignField: "blogId",
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
          // localField: "blogId",
          foreignField: "userId",
          // foreignField: "blogId",
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

  Comment.aggregate(arr)
    //.sort({ dateOfPosting: -1 })
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



router.get("/binhluans/:id", (req, res) => {
  Comment.findOne({ _id: req.params.id })
    .then((binhluan) => {
      if (binhluan == null) {
        res.status(400).json({
          message: "Không có bình luận nào",
        });
        return;
      }
      res.json(binhluan);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/binhluans/:id", jwtAuth, (req, res) => {
  const user = req.user;
  Comment.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((binhluan) => {
      if (binhluan === null) {
        res.status(401).json({
          message: "Bạn không có quyền xóa bình luận",
        });
        return;
      }
      res.json({
        message: "Xóa bình luận thành công",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// router.get("/nhanxet", (req, res) => {

//   const data = req.body;
//   const date = new Date();
//   console.log(data)

//   // let nhanxet = new Comment({
//   //   userId: data._id,
//   //   blogId: data.title,
//   //   commentcontent: data.postname,
//   //   dateOfPosting: date,
//   // });

//   nhanxet
//     .save()
//     .then(() => {
//       res.json({ message: "Thêm bài viết thành công" });
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });



/////////////////////////////////admin///////////////////////
// get user's personal details
// router.get("/user",  (req, res) => {
//   const user = req.user;
//   if (user.type === "recruiter") {
//     Recruiter.findOne({ userId: user._id })
//       .then((recruiter) => {
//         if (recruiter == null) {
//           res.status(404).json({
//             message: "Người dùng không tồn tại",
//           });
//           return;
//         }
//         res.json(recruiter);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } else {
//     JobApplicant.findOne({ userId: user._id })
//       .then((jobApplicant) => {
//         if (jobApplicant == null) {
//           res.status(404).json({
//             message: "Người dùng không tồn tại",
//           });
//           return;
//         }
//         res.json(jobApplicant);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   }
// });



//////////Đổ dữ liệu từ API vào bảng
router.get('/RecruiterInfo', (req, res) => {
  try {
    User.find({}).then((data)=>{
    res.json(data);
    })
  } catch (error) {
    console.log(error)
  }
})
 // khoa quyen
 router.post('/blockUser', async (req, res) => {
  const idUser = req.body.idUser
  console.log(idUser)
  try {
    let status = true;
    await User.find({_id: idUser}).then((data)=>{
      status = !data[0].status
    })
    console.log(status)
    await User.updateOne({_id: idUser}, {
      status :status
    })
    res.status(200).json(status)
  } catch (error) {
    console.log(error)
  }
})




module.exports = router;
