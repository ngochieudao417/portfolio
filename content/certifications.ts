import type { Credential } from "./types";

/**
 * Credentials. Everything here is transcribed from the diplomas in /public/images —
 * never invent credential IDs or URLs. Leave `url` empty until a real
 * verification link exists.
 */
export const certifications: Credential[] = [
  {
    id: "qcobalt",
    name: "QCobalt",
    issuer: "QWorld · Open Quantum Institute",
    year: "2026",
    period: "May – June 2026",
    description: {
      en: "QWorld OQI Pre-Hackathon Training Programme — intermediate tutorial on modeling and solving combinatorial optimization problems.",
      vi: "Chương trình huấn luyện trước Hackathon QWorld OQI — học phần trung cấp về mô hình hoá và giải các bài toán tối ưu tổ hợp.",
    },
    credentialId: "QCobalt10-194",
    url: "",
    image: {
      src: "/images/Qcobalt_cert.jpg",
      alt: {
        en: "QCobalt Workshop diploma issued by QWorld to Đào Ngọc Hiếu, May – June 2026",
        vi: "Văn bằng QCobalt Workshop do QWorld cấp cho Đào Ngọc Hiếu, tháng 5 – 6/2026",
      },
    },
  },
  {
    id: "qbronze",
    name: "QBronze",
    issuer: "QWorld · Open Quantum Institute",
    year: "2026",
    period: "May – June 2026",
    description: {
      en: "QWorld OQI Pre-Hackathon Training Programme — introductory tutorial Bronze-Qiskit on quantum computing and quantum programming.",
      vi: "Chương trình huấn luyện trước Hackathon QWorld OQI — học phần nhập môn Bronze-Qiskit về tính toán và lập trình lượng tử.",
    },
    credentialId: "QBronze187-32",
    url: "",
    image: {
      src: "/images/QBroze_cert.jpg",
      alt: {
        en: "QBronze (using Qiskit) diploma issued by QWorld to Đào Ngọc Hiếu, May – June 2026",
        vi: "Văn bằng QBronze (dùng Qiskit) do QWorld cấp cho Đào Ngọc Hiếu, tháng 5 – 6/2026",
      },
    },
  },
];
