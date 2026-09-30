import type { EducationItem } from "./types";

export const education: EducationItem[] = [
  {
    id: "neu",
    institution: "National Economics University",
    localName: "Đại học Kinh tế Quốc dân",
    short: "NEU",
    program: { en: "Information Technology", vi: "Công nghệ thông tin" },
    period: "2023 – 2027",
    location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" },
    gpa: null, // Only set if you want it public, e.g. "3.6 / 4.0"
    logo: null, // e.g. { src: "/images/neu-logo.png", alt: { en: "NEU logo", vi: "Logo NEU" } }
    achievements: [
      {
        title: {
          en: "2nd Prize — Faculty-level Student Research Competition",
          vi: "Giải Nhì — Nghiên cứu khoa học sinh viên cấp Khoa",
        },
        year: "", // TODO(content)
      },
      {
        title: {
          en: "3rd Prize — University-level Student Research Competition",
          vi: "Giải Ba — Nghiên cứu khoa học sinh viên cấp Trường",
        },
        year: "", // TODO(content)
      },
    ],
    // Source: https://fit.neu.edu.vn/post/anh-huong-chatgpt-den-tu-duy-doc-lap-sinh-vien-ha-noi
    research: {
      title: {
        en: "The impact of ChatGPT on the independent thinking of university students in Hanoi",
        vi: "Nghiên cứu sự ảnh hưởng của ChatGPT tới năng lực tư duy độc lập của sinh viên trên địa bàn Thành phố Hà Nội",
      },
      summary: {
        en: "A five-student research team built a model of how ChatGPT affects independent thinking. Used appropriately, the tool had a positive effect — at basic levels it didn't weaken thinking, and at higher levels it acted as an assistant for developing ideas rather than a replacement.",
        vi: "Nhóm nghiên cứu 5 sinh viên xây dựng mô hình đánh giá tác động của ChatGPT tới tư duy độc lập. Khi được dùng hợp lý, công cụ này có ảnh hưởng tích cực — ở cấp độ tư duy cơ bản không làm suy giảm khả năng tư duy, còn ở cấp độ cao hơn đóng vai trò trợ lý phát triển ý tưởng thay vì thay thế.",
      },
      facts: {
        en: ["Survey of 407 students across Hanoi universities", "SPSS 27.0 · AMOS 24.0", "58 thinking tests: with vs. without ChatGPT"],
        vi: ["Khảo sát 407 sinh viên các trường đại học tại Hà Nội", "SPSS 27.0 · AMOS 24.0", "58 bài kiểm tra tư duy: có và không dùng ChatGPT"],
      },
      link: "https://fit.neu.edu.vn/post/anh-huong-chatgpt-den-tu-duy-doc-lap-sinh-vien-ha-noi",
      year: "2025",
      image: {
        src: "/images/scientific_research_pic.jpg",
        alt: {
          en: "The five-member student research team at National Economics University",
          vi: "Nhóm 5 sinh viên nghiên cứu khoa học tại Đại học Kinh tế Quốc dân",
        },
      },
    },
  },
];
