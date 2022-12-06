export const server = "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  uploadResume: `${server}/upResume/resume`,
  uploadProfileImage: `${server}/upImage/profile`,
  jobs: `${server}/api/jobs`,
  blogs: `${server}/api/blogs`,
  applications: `${server}/api/applications`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
};

export default apiList;
