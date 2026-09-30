import { education } from "./education";
import type { JourneyItem } from "./types";

const neu = education[0];

/**
 * Career Journey. Add milestones freely — the timeline renders whatever is here.
 * Optional fields (responsibilities, achievements, technologies, relatedProjects)
 * are hidden when empty.
 */
export const journey: JourneyItem[] = [
  {
    id: "neu",
    type: "education",
    org: "National Economics University",
    role: { en: "IT Student", vi: "Sinh viên Công nghệ thông tin" },
    period: "2023 – 2027",
    domains: [],
    summary: {
      en: "Information Technology program — the base for everything else on this page.",
      vi: "Chương trình Công nghệ thông tin — nền tảng cho mọi thứ khác trên trang này.",
    },
    achievements: neu
      ? {
          en: neu.achievements.map((a) => a.title.en),
          vi: neu.achievements.map((a) => a.title.vi),
        }
      : undefined,
  },
  {
    id: "saltlux",
    type: "work",
    org: "Saltlux",
    role: { en: "Data Collection Team Lead", vi: "Trưởng nhóm Thu thập dữ liệu" },
    period: "2026",
    domains: ["data"],
    highlight: true,
    // TODO(content): responsibilities, achievements, technologies
  },
  {
    id: "qaaa-lab",
    type: "research",
    org: "QAAA LAB",
    role: { en: "Research Team", vi: "Nhóm nghiên cứu" },
    period: "", // TODO(content)
    domains: ["research", "ai"],
    highlight: true,
    // The lab's research directions (per FIT NEU). TODO(content): your own responsibilities.
    summary: {
      en: "Quantum Algorithms & Advanced Analytics Lab, FIT NEU — quantum algorithms, quantum ML, advanced analytics",
      vi: "Phòng thí nghiệm Thuật toán lượng tử & Phân tích tiên tiến, Khoa CNTT NEU — thuật toán lượng tử, học máy lượng tử, phân tích dữ liệu",
    },
    relatedProjects: ["dengue-forecasting"],
  },
  {
    // Source: https://fit.neu.edu.vn/en/post/qaaa-lab-giai-nhat-hackathon-luong-tu-gia-lai-2026
    id: "sea-quantathon-2026",
    type: "award",
    org: "SEA Quantathon 2026",
    role: { en: "Champion — First Prize", vi: "Vô địch — Giải Nhất" },
    period: "Jul 2026",
    domains: ["research", "ai"],
    highlight: true,
    summary: {
      en: "International Quantum Computing Hackathon · Gia Lai Quantum Year 2026",
      vi: "Hackathon quốc tế về tính toán lượng tử · Năm Lượng tử Gia Lai 2026",
    },
    achievements: {
      en: [
        "First Prize with team QAAA LAB (4 members, Vietnam & Singapore) — 26 finalist teams from 400+ applications",
        "Project: applying quantum computing to forecasting dengue fever outbreaks, under the theme Quantum Computing for Social Good",
        "One of four teams awarded incubation support worth over VND 500 million to keep developing the product",
      ],
      vi: [
        "Giải Nhất cùng đội QAAA LAB (4 thành viên, Việt Nam & Singapore) — 26 đội chung kết từ hơn 400 hồ sơ",
        "Dự án: ứng dụng tính toán lượng tử vào dự báo bùng phát dịch sốt xuất huyết, theo chủ đề Quantum Computing for Social Good",
        "Một trong bốn đội nhận hỗ trợ ươm tạo trị giá hơn 500 triệu đồng để tiếp tục phát triển sản phẩm",
      ],
    },
    technologies: ["Quantum Computing", "Forecasting"],
    relatedProjects: ["dengue-forecasting"],
    link: "https://fit.neu.edu.vn/en/post/qaaa-lab-giai-nhat-hackathon-luong-tu-gia-lai-2026",
    image: {
      src: "/images/champion_sea quantumhackathon.jpg",
      alt: {
        en: "Team QAAA LAB receiving the First Prize on stage at the quantum computing hackathon, Gia Lai 2026",
        vi: "Đội QAAA LAB nhận Giải Nhất trên sân khấu cuộc thi hackathon tính toán lượng tử, Gia Lai 2026",
      },
    },
  },
];
