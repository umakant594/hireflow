import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding HireFlow database...");

  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  /* ---------- USERS ---------- */

  const hashedPassword = await bcrypt.hash(
    "demo_password",
    10
  );

  await prisma.user.create({
    data: {
      name: "HireFlow Admin",
      email: "admin@hireflow.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  /* ---------- JOBS ---------- */

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "Frontend Developer",
        department: "Engineering",
        location: "Bengaluru",
        employment: "Full-time",
        salary: "₹6–10 LPA",
        description: "Build modern React applications.",
      },
    }),

    prisma.job.create({
      data: {
        title: "Data Analyst",
        department: "Analytics",
        location: "Bengaluru",
        employment: "Full-time",
        salary: "₹5–8 LPA",
        description:
          "Analyze business data and create dashboards.",
      },
    }),

    prisma.job.create({
      data: {
        title: "Backend Developer",
        department: "Engineering",
        location: "Remote",
        employment: "Full-time",
        salary: "₹7–12 LPA",
        description: "Build scalable backend APIs.",
      },
    }),

    prisma.job.create({
      data: {
        title: "HR Analyst",
        department: "Human Resources",
        location: "Bengaluru",
        employment: "Full-time",
        salary: "₹4–7 LPA",
        description:
          "Support workforce analytics and HR operations.",
      },
    }),

    prisma.job.create({
      data: {
        title: "UI/UX Designer",
        department: "Design",
        location: "Hybrid",
        employment: "Full-time",
        salary: "₹5–9 LPA",
        description:
          "Design intuitive digital experiences.",
      },
    }),

    prisma.job.create({
      data: {
        title: "Full Stack Developer",
        department: "Engineering",
        location: "Pune",
        employment: "Full-time",
        salary: "₹8–14 LPA",
        description:
          "Develop full-stack web applications.",
      },
    }),
  ]);

  /* ---------- CANDIDATES ---------- */

  const candidateData = [
    [
      "Rahul Kumar",
      "rahul.kumar@email.com",
      "Frontend Developer",
      "2 years",
      "Bengaluru",
      "React, TypeScript, JavaScript",
      "Interview",
    ],
    [
      "Priya Sharma",
      "priya.sharma@email.com",
      "Data Analyst",
      "1 year",
      "Bengaluru",
      "SQL, Python, Power BI",
      "Screening",
    ],
    [
      "Arjun Rao",
      "arjun.rao@email.com",
      "Backend Developer",
      "3 years",
      "Hyderabad",
      "Node.js, Python, PostgreSQL",
      "Applied",
    ],
    [
      "Sneha N",
      "sneha.n@email.com",
      "HR Analyst",
      "2 years",
      "Bengaluru",
      "Excel, Power BI, HR Analytics",
      "Offer",
    ],
    [
      "Vikram Singh",
      "vikram.singh@email.com",
      "Full Stack Developer",
      "2 years",
      "Pune",
      "React, Node.js, MongoDB",
      "Screening",
    ],
    [
      "Ananya Reddy",
      "ananya.reddy@email.com",
      "UI/UX Designer",
      "1 year",
      "Bengaluru",
      "Figma, UX Research, Prototyping",
      "Applied",
    ],
    [
      "Karthik Rao",
      "karthik.rao@email.com",
      "Frontend Developer",
      "3 years",
      "Bengaluru",
      "React, Next.js, TypeScript",
      "Interview",
    ],
    [
      "Neha Patel",
      "neha.patel@email.com",
      "Data Analyst",
      "2 years",
      "Mumbai",
      "SQL, Excel, Tableau",
      "Screening",
    ],
    [
      "Aditya Verma",
      "aditya.verma@email.com",
      "Backend Developer",
      "4 years",
      "Delhi",
      "Node.js, Express, PostgreSQL",
      "Applied",
    ],
    [
      "Meera Iyer",
      "meera.iyer@email.com",
      "HR Analyst",
      "2 years",
      "Chennai",
      "Excel, SQL, Power BI",
      "Offer",
    ],
    [
      "Rohan Das",
      "rohan.das@email.com",
      "Full Stack Developer",
      "3 years",
      "Bengaluru",
      "React, Node.js, AWS",
      "Interview",
    ],
    [
      "Divya Menon",
      "divya.menon@email.com",
      "UI/UX Designer",
      "2 years",
      "Kochi",
      "Figma, UI Design, Research",
      "Screening",
    ],
    [
      "Sanjay Kumar",
      "sanjay.kumar@email.com",
      "Frontend Developer",
      "1 year",
      "Bengaluru",
      "React, JavaScript, CSS",
      "Applied",
    ],
    [
      "Aishwarya Rao",
      "aishwarya.rao@email.com",
      "Data Analyst",
      "3 years",
      "Mysuru",
      "Python, SQL, Power BI",
      "Interview",
    ],
    [
      "Manish Shah",
      "manish.shah@email.com",
      "Backend Developer",
      "2 years",
      "Ahmedabad",
      "Java, Spring Boot, SQL",
      "Screening",
    ],
    [
      "Pooja N",
      "pooja.n@email.com",
      "HR Analyst",
      "1 year",
      "Bengaluru",
      "HRIS, Excel, Analytics",
      "Applied",
    ],
    [
      "Nikhil Jain",
      "nikhil.jain@email.com",
      "Full Stack Developer",
      "4 years",
      "Bengaluru",
      "React, Node.js, PostgreSQL",
      "Offer",
    ],
    [
      "Shreya Rao",
      "shreya.rao@email.com",
      "UI/UX Designer",
      "2 years",
      "Bengaluru",
      "Figma, Prototyping, UX",
      "Interview",
    ],
    [
      "Abhishek R",
      "abhishek.r@email.com",
      "Data Analyst",
      "2 years",
      "Bengaluru",
      "SQL, Python, Power BI",
      "Applied",
    ],
    [
      "Tanvi Shah",
      "tanvi.shah@email.com",
      "Frontend Developer",
      "1 year",
      "Pune",
      "React, JavaScript, Tailwind",
      "Screening",
    ],
  ];

  const candidates = [];

  for (const candidate of candidateData) {
    const created = await prisma.candidate.create({
      data: {
        name: candidate[0],
        email: candidate[1],
        experience: candidate[3],
        location: candidate[4],
        skills: candidate[5],
        status: candidate[6],
      },
    });

    candidates.push(created);
  }

  /* ---------- APPLICATIONS ---------- */

  const stages = [
    "Applied",
    "Applied",
    "Applied",
    "Screening",
    "Screening",
    "Screening",
    "Interview",
    "Interview",
    "Interview",
    "Offer",
    "Applied",
    "Screening",
    "Applied",
    "Interview",
    "Screening",
    "Offer",
    "Applied",
    "Interview",
    "Screening",
    "Applied",
  ];

  for (let i = 0; i < candidates.length; i++) {
    await prisma.application.create({
      data: {
        candidateId: candidates[i].id,
        jobId: jobs[i % jobs.length].id,
        stage: stages[i],
        status: "Active",
      },
    });
  }

  /* ---------- INTERVIEWS ---------- */

  const interviewCandidates = candidates.filter(
    (candidate) =>
      candidate.status === "Interview" ||
      candidate.status === "Offer"
  );

  for (
    let i = 0;
    i < interviewCandidates.length;
    i++
  ) {
    const date = new Date();

    date.setDate(date.getDate() + i + 1);
    date.setHours(
      10 + (i % 6),
      0,
      0,
      0
    );

    await prisma.interview.create({
      data: {
        candidateId:
          interviewCandidates[i].id,

        jobId:
          jobs[i % jobs.length].id,

        interviewer:
          i % 2 === 0
            ? "Mrunal Rao"
            : "Venkatesh R",

        type:
          i % 3 === 0
            ? "HR"
            : "Technical",

        mode:
          i % 4 === 0
            ? "In-person"
            : "Video",

        scheduledAt: date,

        status: "Scheduled",
      },
    });
  }

  /* ---------- RESULT ---------- */

  console.log(
    "✅ HireFlow database seeded successfully!"
  );

  console.log(`Jobs: ${jobs.length}`);

  console.log(
    `Candidates: ${candidates.length}`
  );

  console.log(
    `Applications: ${candidates.length}`
  );

  console.log(
    `Interviews: ${interviewCandidates.length}`
  );
}

main()
  .catch((error) => {
    console.error(
      "❌ Seed failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });