import type { FocusArea } from "./types";

export const focusAreas: FocusArea[] = [
  {
    domain: "ai",
    title: { en: "AI / ML", vi: "AI / ML" },
    line: {
      en: "Locally served LLM systems that turn unstructured text into structured, validated feedback.",
      vi: "Hệ thống LLM chạy local biến văn bản phi cấu trúc thành phản hồi có cấu trúc, đã được kiểm chứng.",
    },
    target: { kind: "filter", domain: "ai" },
  },
  {
    domain: "research",
    title: { en: "R&D / Quantum Computing", vi: "R&D / Tính toán lượng tử" },
    line: {
      en: "Hybrid quantum–classical methods for chemistry, forecasting and network optimization.",
      vi: "Phương pháp lai lượng tử – cổ điển cho hoá học, dự báo và tối ưu mạng.",
    },
    target: { kind: "section", id: "research" },
  },
  {
    domain: "automation",
    title: { en: "Automation", vi: "Tự động hoá" },
    line: {
      en: "Pipelines and tools that take repetitive work off people's plates — from data collection to video localization.",
      vi: "Pipeline và công cụ giúp con người thoát khỏi việc lặp lại — từ thu thập dữ liệu đến bản địa hoá video.",
    },
    target: { kind: "filter", domain: "automation" },
  },
  {
    domain: "data",
    title: { en: "Data", vi: "Dữ liệu" },
    line: {
      en: "Collecting, cleaning and modeling data — from team-scale collection to forecasting.",
      vi: "Thu thập, làm sạch và mô hình hoá dữ liệu — từ thu thập quy mô nhóm đến dự báo.",
    },
    target: { kind: "filter", domain: "data" },
  },
  {
    domain: "seo",
    title: { en: "SEO / Marketing", vi: "SEO / Marketing" },
    line: {
      en: "Search intent, content strategy and analytics — the business side of shipping.",
      vi: "Search intent, chiến lược nội dung và phân tích — mặt kinh doanh của việc đưa sản phẩm ra thị trường.",
    },
    target: { kind: "section", id: "skills" },
  },
];
