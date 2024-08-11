### setup

#### features

- user would register with email/phone/cohortId and have to confirm with otp
  - can resend otp in case, user does not recieve otp
  - the moment user identity confirmed with otp, would be logged in immediately in the same request to avoid extra step of going to login page and then initiate the whole process
  - reset password @TODO
- user can act as job-seeker as well recruiter: post signup/login can post jobs and as well as apply for job
- user can create/edit its profile

  - profile include (actually we are mimicking resume template here)
    - projects
    - past experiences
    - educations
    - main intro section
      - name
      - socialLinks
      - intro line / tag line
      - noOfExperieces
      - skills
      - videoResume
      - currectCTC / expectedCTC range
      - workMode
      - joiningStatus
      - currentEmploymentStatus
      - address
      - preferredCity

- recruiter can create jobs

  - job post would be freezed once a job-seeker applied to it
  - job post can be deleted if no job-seeker applied to it
  - job post can be closed any time, even job-seeker applied for it or not
  - recruiter can invite job-seeker to apply on the job post created by him
  - once a job closed by recruiter,htan it would make all other applications not accepted by recruited/picked-for-interview would be markred as rejected

- job applications
  - job-seeker can apply to a job
  - recruiter would allow application for interview or skip this step and hired directly
