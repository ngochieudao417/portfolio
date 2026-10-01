import type { Domain, Project } from "./types";

/**
 * Projects.
 *
 * Rules: every claim here must be true. Sections without a `body`, `bullets`,
 * `math` or supplied visual data are "pending" — hidden in production and
 * flagged with a TODO marker in development. Fill them in as material is ready.
 *
 * Schematics are illustrative sketches of the pipeline, not measured data.
 */
export const projects: Project[] = [
  {
    slug: "ai-cv-review",
    index: "01",
    title: "AI CV Review Platform",
    featured: true,
    accent: "ai",
    domains: ["ai"],
    category: { en: "AI / ML / LLM", vi: "AI / ML / LLM" },
    summary: {
      en: "Automated CV review for software-engineering roles: a locally served, quantized LLM scores each CV on five criteria and explains why.",
      vi: "Chấm điểm và nhận xét CV tự động cho vị trí kỹ sư phần mềm: một LLM lượng tử hoá chạy local chấm CV theo 5 tiêu chí và giải thích lý do.",
    },
    tags: ["Next.js", "NestJS", "PostgreSQL", "FastAPI", "Ollama", "Python", "TypeORM", "Pydantic", "pytest"],
    schematic: {
      layout: "snake",
      nodes: ["CV + JD", "Next.js UI", "NestJS API", "FastAPI", "Ollama · Q4", "scored review"],
    },
    cover: null, // e.g. { src: "/projects/ai-cv-review/cover.jpg", alt: { en: "…", vi: "…" } }
    screenshots: [],
    metrics: [], // TODO(content): F1 and tokens/s once measured
    chart: null,
    links: { github: "", demo: "" },
    caseStudy: [
      {
        id: "problem",
        title: { en: "Problem", vi: "Vấn đề" },
        body: {
          en: "Reviewing IT resumes well takes time and domain knowledge. Feedback is often generic, and technical depth is hard to judge from a quick skim.",
          vi: "Đánh giá CV ngành IT cho tốt đòi hỏi thời gian và hiểu biết chuyên môn. Nhận xét thường chung chung, và rất khó đánh giá chiều sâu kỹ thuật chỉ qua một lần đọc lướt.",
        },
      },
      {
        id: "solution",
        title: { en: "Solution", vi: "Giải pháp" },
        body: {
          en: "The system scores a CV on five criteria — Structure, Skills, Experience, Projects and ATS, 100 points in total — and returns strengths, weaknesses, actionable suggestions and how well the CV matches a given Job Description.",
          vi: "Hệ thống chấm CV theo 5 tiêu chí — Structure, Skills, Experience, Projects và ATS, tổng 100 điểm — rồi chỉ ra điểm mạnh, điểm yếu, đề xuất cải thiện và mức độ khớp với Job Description.",
        },
      },
      {
        id: "architecture",
        title: { en: "Architecture", vi: "Kiến trúc" },
        body: {
          en: "Three services connected through a versioned API contract: a Next.js UI, a NestJS API that stores review history in PostgreSQL via TypeORM, and a FastAPI AI service.",
          vi: "Ba service giao tiếp qua API contract có version: giao diện Next.js, API NestJS lưu lịch sử chấm vào PostgreSQL qua TypeORM, và AI service viết bằng FastAPI.",
        },
        visual: "schematic",
      },
      {
        id: "pipeline",
        title: { en: "Local LLM", vi: "LLM chạy local" },
        bullets: {
          en: [
            "A 7B model served with Ollama and quantized to Q4_K_M (GGUF)",
            "Memory drops from ~14 GB to ~4.4 GB, so it runs on consumer hardware with zero API cost",
          ],
          vi: [
            "Model 7B chạy bằng Ollama, lượng tử hoá Q4_K_M (GGUF)",
            "Dung lượng giảm từ ~14GB xuống ~4.4GB, chạy được trên máy cá nhân mà không tốn chi phí API",
          ],
        },
      },
      {
        id: "decisions",
        title: { en: "Key implementation decisions", vi: "Các quyết định triển khai chính" },
        bullets: {
          en: [
            "Ports & Adapters LLM layer — the model provider is switched with a single environment variable",
            "Versioned API contract between the three services",
            "Unit and integration tests with pytest",
          ],
          vi: [
            "Tầng LLM theo Ports & Adapters — đổi provider chỉ bằng một biến môi trường",
            "API contract có version giữa ba service",
            "Unit test và integration test bằng pytest",
          ],
        },
      },
      {
        id: "evaluation",
        title: { en: "Evaluation", vi: "Đánh giá" },
        body: {
          en: "Built a golden dataset from Resume Entities for NER to benchmark entity extraction per label (precision / recall / F1), and compared quantization levels to choose the best quality/speed trade-off.",
          vi: "Tự xây golden dataset từ bộ Resume Entities for NER để đo Precision / Recall / F1 trích xuất entity theo từng nhãn, và so sánh các mức quantization để chọn điểm cân bằng giữa chất lượng và tốc độ.",
        },
        visual: "metrics",
      },
      {
        id: "challenges",
        title: { en: "Reliable output", vi: "Output đáng tin cậy" },
        body: {
          en: "LLM output isn't guaranteed to be valid JSON. A defensive parser validates and normalizes it — clamping scores, recomputing totals, validating with Pydantic — and falls back to a deterministic result when the output is broken, so the API always returns a valid schema.",
          vi: "Output của LLM không phải lúc nào cũng là JSON hợp lệ. Parser kiểm tra và chuẩn hoá nó — clamp điểm, tính lại tổng điểm, validate bằng Pydantic — và chuyển sang fallback tất định khi output lỗi, nên API luôn trả về đúng schema.",
        },
      },
      { id: "screenshots", title: { en: "Screenshots", vi: "Ảnh chụp màn hình" }, visual: "screenshots" },
    ],
  },
  {
    slug: "hybrid-ml-vqe",
    index: "02",
    title: "Hybrid ML-VQE",
    featured: true,
    accent: "research",
    domains: ["research", "ai"],
    category: { en: "Research / Quantum / ML", vi: "Nghiên cứu / Lượng tử / ML" },
    summary: {
      en: "Machine-learned warm starts for the Variational Quantum Eigensolver — 7.5–13.6× fewer energy evaluations to chemical accuracy on H₂, LiH and H₄, packaged as the VQE-PES Studio app.",
      vi: "Khởi tạo ấm bằng học máy cho VQE — giảm 7,5–13,6 lần số lần đánh giá năng lượng để đạt độ chính xác hoá học trên H₂, LiH và H₄, đóng gói thành ứng dụng VQE-PES Studio.",
    },
    tags: ["Python", "PySCF", "Qiskit", "PyTorch", "scikit-learn", "NumPy / SciPy", "Streamlit", "Plotly", "pytest", "Playwright"],
    schematic: {
      layout: "snake",
      nodes: ["geometry", "PySCF → Ĥ", "Jordan-Wigner", "ML → θ₀", "UCCSD · SPSA", "E₀ + cost"],
    },
    cover: null,
    screenshots: [],
    metrics: [
      {
        label: { en: "Fewer energy evaluations", vi: "Giảm số lần đánh giá năng lượng" },
        value: "7.5–13.6×",
        note: { en: "to chemical accuracy (1.6 mHa) on H₂, LiH, H₄", vi: "để đạt độ chính xác hoá học (1,6 mHa) trên H₂, LiH, H₄" },
      },
      {
        label: { en: "Break-even point (geometries)", vi: "Điểm hoà vốn (số hình học)" },
        value: "46–89",
      },
      {
        label: { en: "Error on sparse 2-D grids", vi: "Sai số trên lưới 2 chiều thưa" },
        value: "0.72",
        unit: "mHa",
        note: { en: "neural network, vs 3.5–10.6 mHa via latent space", vi: "mạng nơ-ron, so với 3,5–10,6 mHa qua không gian tiềm ẩn" },
      },
      { label: { en: "Automated tests", vi: "Kiểm thử tự động" }, value: "48" },
    ],
    chart: null,
    links: { paper: "", github: "" },
    research: "hybrid-ml-vqe",
    caseStudy: [
      {
        id: "question",
        title: { en: "Research question", vi: "Câu hỏi nghiên cứu" },
        body: {
          en: "Can machine learning predict good VQE starting parameters across a potential-energy-surface scan, instead of always starting from the Hartree–Fock state — and is optimizing inside an autoencoder's latent space cheaper?",
          vi: "Học máy có thể dự đoán điểm khởi tạo tốt cho VQE khi quét bề mặt thế năng, thay vì luôn bắt đầu từ trạng thái Hartree-Fock — và tối ưu trong không gian tiềm ẩn của mạng mã hoá tự động có rẻ hơn không?",
        },
      },
      {
        id: "motivation",
        title: { en: "Motivation — in plain language", vi: "Động lực — nói một cách dễ hiểu" },
        body: {
          en: "A molecule's lowest possible energy — its ground state — is the foundation of computational chemistry. VQE is the most practical quantum algorithm for it on today's hardware, but its optimization loop is expensive: every parameter update needs many circuit runs, and that cost grows with the number of circuit parameters.\n\nWhen scanning a potential-energy surface, the same problem is solved at dozens of geometries and the solution changes smoothly with geometry. So a mapping from geometry to parameters can be learned from the first few runs and used to warm-start the rest.",
          vi: "Năng lượng thấp nhất của một phân tử — trạng thái cơ bản — là bài toán nền của hoá học tính toán. VQE là thuật toán lượng tử khả thi nhất cho bài toán này trên phần cứng hiện nay, nhưng vòng lặp tối ưu của nó rất đắt: mỗi bước cập nhật tham số cần nhiều lần chạy mạch, và chi phí tăng theo số tham số của mạch.\n\nKhi quét bề mặt thế năng, ta giải cùng một bài toán ở hàng chục hình học khác nhau và nghiệm biến thiên trơn theo hình học. Vậy có thể học ánh xạ hình học → tham số từ vài lần chạy đầu, rồi dùng nó để khởi tạo cho các hình học sau.",
        },
      },
      {
        id: "methodology",
        title: { en: "Methodology", vi: "Phương pháp" },
        bullets: {
          en: [
            "Hand-built chain from molecular geometry to qubit Hamiltonian — Jordan–Wigner mapping, UCCSD circuit with sparse-matrix simulation, SPSA optimizer — without an off-the-shelf VQE framework, to control every energy evaluation",
            "A cost ledger counts every circuit run, stage by stage",
          ],
          vi: [
            "Tự cài đặt chuỗi tính toán từ hình học phân tử tới Hamiltonian qubit — ánh xạ Jordan-Wigner, mạch UCCSD mô phỏng bằng ma trận thưa, bộ tối ưu SPSA — không dùng khung VQE dựng sẵn, để kiểm soát từng lần đánh giá năng lượng",
            "Một \"sổ chi phí\" đếm mọi lần chạy mạch theo từng giai đoạn",
          ],
        },
      },
      { id: "pipeline", title: { en: "Hybrid ML + VQE pipeline", vi: "Pipeline lai ML + VQE" }, visual: "schematic" },
      {
        id: "setup",
        title: { en: "Experimental setup", vi: "Thiết lập thí nghiệm" },
        body: {
          en: "A controlled matrix of 9 initialization methods × 5 geometry families × 5 seeds. Every branch shares one optimization function and differs only in its starting point — a constraint enforced by the code architecture, not by a promise in the write-up.",
          vi: "Ma trận thí nghiệm có kiểm soát: 9 phương pháp khởi tạo × 5 họ hình học × 5 seed. Mọi nhánh dùng chung một hàm tối ưu, chỉ khác điểm xuất phát — ràng buộc nằm trong kiến trúc code chứ không phải lời hứa trong văn bản.",
        },
        bullets: {
          en: ["Methods: Hartree–Fock, random, autoencoder, PCA, nearest neighbour, mean, polynomial regression, neural network, latent-space optimization"],
          vi: ["Phương pháp: Hartree-Fock, ngẫu nhiên, mạng mã hoá tự động, PCA, láng giềng gần nhất, trung bình, hồi quy đa thức, mạng nơ-ron, tối ưu trong không gian tiềm ẩn"],
        },
      },
      {
        id: "results",
        title: { en: "Results", vi: "Kết quả" },
        bullets: {
          en: [
            "7.5–13.6× fewer energy evaluations to reach chemical accuracy (1.6 mHa) on H₂, LiH and H₄, with break-even at 46–89 geometries",
            "The original hypothesis was refuted experimentally: optimizing in an autoencoder's latent space is not cheaper. With SPSA the cost per iteration doesn't depend on dimensionality, so compression only costs accuracy — ML should generate starting points, not constrain the search space",
            "On sparse two-dimensional grids a neural network reached 0.72 mHa error, vs 3.5–10.6 mHa for latent-space methods",
          ],
          vi: [
            "Giảm 7,5–13,6 lần số lần đánh giá năng lượng để đạt độ chính xác hoá học (1,6 mHa) trên H₂, LiH và H₄; điểm hoà vốn 46–89 hình học",
            "Bác bỏ giả thuyết ban đầu bằng thực nghiệm: tối ưu trong không gian tiềm ẩn không rẻ hơn. Với SPSA, chi phí mỗi vòng lặp không phụ thuộc số chiều, nên nén chỉ làm giảm độ chính xác — học máy nên dùng để sinh điểm khởi tạo, không phải để ràng buộc không gian tối ưu",
            "Trên lưới hai chiều thưa, mạng nơ-ron đạt sai số 0,72 mHa so với 3,5–10,6 mHa của các phương pháp qua không gian tiềm ẩn",
          ],
        },
        visual: "metrics",
      },
      {
        id: "studio",
        title: { en: "VQE-PES Studio", vi: "VQE-PES Studio" },
        body: {
          en: "A Streamlit app that scans potential-energy curves with three initialization modes, compares against exact solutions, fits spectroscopic constants (Morse fit), converts quantum cost to USD using Amazon Braket / IBM Quantum pricing, and keeps an anchor-data store so cost amortizes across runs. 48 automated tests cover the properties the experimental conclusions depend on.",
          vi: "Ứng dụng Streamlit quét đường thế năng theo 3 chế độ khởi tạo, so sánh với nghiệm chính xác, tính hằng số phổ (Morse fit), quy đổi chi phí lượng tử ra USD theo bảng giá Amazon Braket / IBM Quantum, và có kho dữ liệu neo để khấu hao chi phí qua nhiều lần dùng. 48 kiểm thử tự động bao phủ các tính chất mà kết luận thực nghiệm phụ thuộc vào.",
        },
      },
      {
        id: "diagnostics",
        title: { en: "Methodological bugs found", vi: "Lỗi phương pháp phát hiện qua chẩn đoán" },
        bullets: {
          en: [
            "Molecular-orbital signs returned by the library flipped erratically between neighbouring geometries, breaking the smoothness of the training data: transfer error 69–206 mHa, down to 0.26–0.95 mHa after sign normalization",
            "A mis-set SPSA step-size calibration pushes the solution away at the very first step",
          ],
          vi: [
            "Dấu orbital phân tử do thư viện trả về thay đổi thất thường giữa các hình học lân cận, làm hỏng tính trơn của dữ liệu huấn luyện: sai số chuyển giao 69–206 mHa, còn 0,26–0,95 mHa sau khi chuẩn hoá dấu",
            "Điểm hiệu chỉnh độ dài bước của SPSA nếu đặt sai sẽ đẩy nghiệm ra xa ngay ở bước đầu tiên",
          ],
        },
      },
      {
        id: "limitations",
        title: { en: "Limitations", vi: "Hạn chế" },
        body: {
          en: "On dense one-dimensional scans the autoencoder does not beat a simple nearest-neighbour lookup; the difference only appears on sparse two-dimensional grids.",
          vi: "Trên dữ liệu một chiều dày, mạng mã hoá tự động không thắng nổi phép tra cứu láng giềng gần nhất; khác biệt chỉ lộ ra trên lưới hai chiều thưa.",
        },
      },
      { id: "future", title: { en: "Future work", vi: "Hướng phát triển" } },
    ],
  },
  {
    slug: "dengue-forecasting",
    index: "03",
    title: "Dengue Forecasting",
    featured: true,
    accent: "data",
    domains: ["research", "data"],
    category: { en: "Research / Quantum / Data", vi: "Nghiên cứu / Lượng tử / Dữ liệu" },
    summary: {
      en: "Quantum-enhanced dengue outbreak forecasting that combines quantum and classical forecasting approaches.",
      vi: "Dự báo bùng phát sốt xuất huyết có tăng cường lượng tử, kết hợp phương pháp dự báo lượng tử và cổ điển.",
    },
    highlight: { en: "First Prize · SEA Quantathon 2026", vi: "Giải Nhất · SEA Quantathon 2026" },
    tags: ["Time-series Forecasting", "Quantum ML", "Epidemiology", "Data"],
    schematic: {
      layout: "branch",
      nodes: ["time series", "classical", "quantum", "forecast"],
    },
    cover: null,
    screenshots: [],
    metrics: [],
    // Only real, supplied results. Shape: { title, xLabel, yLabel, series: [{ name, points: [[x, y], …] }] }
    chart: null,
    links: {
      paper: "",
      github: "",
      article: "https://fit.neu.edu.vn/en/post/qaaa-lab-giai-nhat-hackathon-luong-tu-gia-lai-2026",
    },
    research: "dengue-forecasting",
    caseStudy: [
      {
        id: "problem",
        title: { en: "Problem", vi: "Vấn đề" },
        body: {
          en: "Dengue is a mosquito-borne disease whose outbreaks are seasonal and sensitive to climate. Forecasting cases ahead of time gives health authorities room to plan prevention and hospital capacity.",
          vi: "Sốt xuất huyết là bệnh lây qua muỗi, bùng phát theo mùa và nhạy cảm với khí hậu. Dự báo số ca trước một khoảng thời gian giúp cơ quan y tế có thêm thời gian chuẩn bị phòng chống và năng lực điều trị.",
        },
      },
      { id: "dataset", title: { en: "Dataset", vi: "Dữ liệu" } },
      {
        id: "approach",
        title: { en: "Forecasting approach", vi: "Cách tiếp cận dự báo" },
        body: {
          en: "Quantum and classical forecasting approaches are combined in one pipeline rather than treated as competitors.",
          vi: "Phương pháp dự báo lượng tử và cổ điển được kết hợp trong cùng một pipeline thay vì đặt đối đầu nhau.",
        },
        visual: "schematic",
      },
      { id: "quantum", title: { en: "Quantum component", vi: "Thành phần lượng tử" } },
      { id: "classical", title: { en: "Classical component", vi: "Thành phần cổ điển" } },
      { id: "results", title: { en: "Experimental results", vi: "Kết quả thực nghiệm" }, visual: "chart" },
      { id: "metrics", title: { en: "Metrics", vi: "Chỉ số" }, visual: "metrics" },
      {
        id: "recognition",
        title: { en: "Recognition", vi: "Ghi nhận" },
        body: {
          en: "Won First Prize at SEA Quantathon 2026 — the International Quantum Computing Hackathon at Gia Lai Quantum Year 2026 (theme: Quantum Computing for Social Good) — with team QAAA LAB, out of 26 finalist teams and 400+ applications. The team was one of four to receive incubation support worth over VND 500 million to keep developing the product.",
          vi: "Giành Giải Nhất tại SEA Quantathon 2026 — Hackathon quốc tế về tính toán lượng tử trong khuôn khổ Năm Lượng tử Gia Lai 2026 (chủ đề: Quantum Computing for Social Good) — cùng đội QAAA LAB, giữa 26 đội chung kết và hơn 400 hồ sơ. Đội là một trong bốn đội nhận hỗ trợ ươm tạo trị giá hơn 500 triệu đồng để tiếp tục phát triển sản phẩm.",
        },
        image: {
          src: "/images/champion_sea quantumhackathon.jpg",
          alt: {
            en: "Team QAAA LAB receiving the First Prize on stage, Gia Lai 2026",
            vi: "Đội QAAA LAB nhận Giải Nhất trên sân khấu, Gia Lai 2026",
          },
        },
      },
      { id: "limitations", title: { en: "Limitations", vi: "Hạn chế" } },
      { id: "future", title: { en: "Future research", vi: "Hướng nghiên cứu tiếp theo" } },
    ],
  },
  {
    slug: "meo-ai-studio",
    index: "04",
    title: "Meo AI Studio",
    featured: true,
    accent: "automation",
    domains: ["automation", "ai", "data"],
    category: { en: "Automation / AI / Content", vi: "Tự động hoá / AI / Nội dung" },
    summary: {
      en: "A Windows desktop app in Python that automates short-form video production and localization — collection, transcription, translation, dubbing and rendering. A non-commercial learning project.",
      vi: "Ứng dụng desktop Windows viết bằng Python, tự động hoá sản xuất và bản địa hoá video ngắn — thu thập, nhận dạng giọng nói, dịch, lồng tiếng và render. Dự án học tập, phi thương mại.",
    },
    tags: ["Python", "FFmpeg", "Whisper", "Demucs", "PyTorch / CUDA", "OCR", "TTS / Voice cloning", "SQLite", "Playwright", "Web UI"],
    schematic: {
      layout: "snake",
      nodes: ["collect", "Whisper ASR", "Demucs split", "translate", "TTS dub", "FFmpeg render"],
    },
    cover: null,
    screenshots: [],
    metrics: [],
    chart: null,
    links: { github: "", demo: "" },
    caseStudy: [
      {
        id: "context",
        title: { en: "Why I built it", vi: "Vì sao tôi làm" },
        body: {
          en: "I built Meo AI Studio as a hands-on way to learn video and audio processing and applied AI. It is a learning project and is not used commercially.",
          vi: "Tôi làm Meo AI Studio để học và thực hành xử lý video, âm thanh và AI. Đây là dự án học tập, không dùng cho mục đích thương mại.",
        },
      },
      {
        id: "workflow",
        title: { en: "Workflow", vi: "Quy trình" },
        body: {
          en: "From a keyword, a link or a channel to a finished, localized short video.",
          vi: "Từ một từ khoá, một link hay một kênh đến video ngắn hoàn chỉnh đã được bản địa hoá.",
        },
        visual: "schematic",
      },
      {
        id: "collection",
        title: { en: "Content collection", vi: "Thu thập nội dung" },
        body: {
          en: "Downloads videos and images from Douyin, Bilibili, Xiaohongshu and Weibo by keyword, link or whole channel. It filters trending videos by like count and time window, translates search keywords into Simplified and Traditional Chinese, suggests channels ranked by follower count and monitors chosen channels on a schedule. This part builds on the open-source MediaCrawler project.",
          vi: "Tải video và ảnh từ Douyin, Bilibili, Xiaohongshu và Weibo theo từ khoá, link hoặc cả kênh. Lọc video hot theo lượt like và khoảng thời gian, dịch từ khoá sang tiếng Trung giản thể/phồn thể, gợi ý kênh theo lượt follow và theo dõi kênh định kỳ. Phần này dựa trên mã nguồn mở MediaCrawler.",
        },
      },
      {
        id: "processing",
        title: { en: "AI processing & localization", vi: "Xử lý & bản địa hoá bằng AI" },
        bullets: {
          en: [
            "Speech recognition with Whisper; vocals and background music separated with Demucs; hard-coded subtitles extracted with OCR",
            "Automatic watermark removal and machine translation into Vietnamese or English",
            "Dubbing with TTS and voice cloning (OmniVoice, Piper, CapCut TTS, ElevenLabs), with speaker gender and pitch detection to give each character a fitting voice",
            "Subtitles, intros/outros and titles, rendered with FFmpeg and GPU acceleration",
          ],
          vi: [
            "Nhận dạng giọng nói bằng Whisper; tách giọng và nhạc nền bằng Demucs; OCR phụ đề cứng",
            "Tự động xoá watermark và dịch sang tiếng Việt hoặc tiếng Anh",
            "Lồng tiếng bằng TTS và clone giọng (OmniVoice, Piper, CapCut TTS, ElevenLabs), nhận diện giới tính và cao độ giọng để gán giọng phù hợp cho từng nhân vật",
            "Tạo phụ đề, ghép đầu/cuối, chèn tiêu đề và render bằng FFmpeg có tăng tốc GPU",
          ],
        },
      },
      {
        id: "creation",
        title: { en: "Short video creation", vi: "Tạo short video" },
        body: {
          en: "Besides reworking existing footage, the app creates new short videos from images, captions and AI-generated narration, ready to post on social platforms.",
          vi: "Ngoài việc làm lại video có sẵn, ứng dụng còn tạo short video mới từ ảnh, caption và giọng đọc AI để đăng lên mạng xã hội.",
        },
      },
      {
        id: "in-progress",
        title: { en: "In progress", vi: "Đang phát triển" },
        body: {
          en: "A script-to-video feature: the user writes a detailed, scene-by-scene script and the system assembles it into a complete video.",
          vi: "Tính năng tạo video từ kịch bản (script-to-video): người dùng nhập kịch bản theo từng cảnh và hệ thống tự dựng thành video hoàn chỉnh.",
        },
      },
      {
        id: "infrastructure",
        title: { en: "Infrastructure & UX", vi: "Hạ tầng & trải nghiệm" },
        body: {
          en: "A desktop GUI and a local Web UI with multi-language support; GPU and environment diagnostics, log analysis, and one-click install and update scripts; a licensing and customer-management system; and encrypted local storage for API keys.",
          vi: "Giao diện đồ hoạ và Web UI cục bộ, hỗ trợ đa ngôn ngữ; công cụ chẩn đoán và sửa lỗi GPU/môi trường, phân tích log, cài đặt và cập nhật bằng một cú nhấp; hệ thống license và quản lý khách hàng; mã hoá API key lưu cục bộ.",
        },
      },
      { id: "screenshots", title: { en: "Screenshots", vi: "Ảnh chụp màn hình" }, visual: "screenshots" },
    ],
  },

  // ── More Projects ─────────────────────────────────────────────────────────
  {
    // Phrasing follows the author's guidance: parameter count is stated as a fact only —
    // no "same performance", "quantum advantage", "large-scale" or "more stable" claims.
    slug: "quantum-hrl-offloading",
    title: "Quantum-Enhanced Hierarchical RL for Vehicular Edge Offloading",
    featured: false,
    accent: "ai",
    domains: ["research", "ai"],
    category: { en: "Research / Quantum / RL", vi: "Nghiên cứu / Lượng tử / RL" },
    summary: {
      en: "Hybrid quantum–classical controller that decides where connected vehicles offload computation across a four-tier ground-to-space network.",
      vi: "Bộ điều khiển lai lượng tử – cổ điển quyết định nơi xe kết nối offload tác vụ tính toán trong mạng 4 tầng từ mặt đất lên không gian.",
    },
    progress: { value: 70, label: { en: "Manuscript complete", vi: "Đã hoàn thành bản thảo" } },
    tags: ["Python", "NumPy", "PyTorch", "PennyLane", "scikit-learn", "SUMO", "Perceval (Quandela)", "LaTeX"],
    schematic: {
      layout: "snake",
      nodes: ["task", "tier · VQC 4q", "node · QAOA-XY", "ratio · VQC 3q", "RSU/UAV/HAP/LEO", "reward"],
    },
    cover: null,
    screenshots: [],
    metrics: [
      {
        label: { en: "Trainable parameters", vi: "Tham số huấn luyện" },
        value: "32",
        note: { en: "15,744 in the classical baseline", vi: "baseline cổ điển: 15.744" },
      },
      {
        label: { en: "Median latency, both learned controllers", vi: "Độ trễ trung vị, cả hai mô hình học" },
        value: "0.43–0.48",
        unit: "s",
        note: {
          en: "vs 1.31 s distance heuristic, 5 s local-only (4 s deadline)",
          vi: "so với 1,31 s heuristic Distance, 5 s xử lý tại xe (deadline 4 s)",
        },
      },
      {
        label: { en: "Exact node selection, XY mixer", vi: "Chọn đúng node, XY mixer" },
        value: "94",
        unit: "%",
        note: { en: "vs 63–74% with a QUBO penalty", vi: "so với 63–74% khi dùng QUBO penalty" },
      },
      {
        label: { en: "Valid outcomes on Quandela Belenos", vi: "Outcome hợp lệ trên Quandela Belenos" },
        value: "99.93",
        unit: "%",
        note: {
          en: "matches noiseless simulation on 11 of 12 instances",
          vi: "khớp mô phỏng không nhiễu ở 11/12 instance",
        },
      },
    ],
    chart: null,
    links: { paper: "", github: "" },
    research: "quantum-hrl-offloading",
    caseStudy: [
      {
        id: "problem",
        title: { en: "Problem", vi: "Bài toán" },
        body: {
          en: "Connected vehicles offload computation across a four-tier terrestrial / non-terrestrial network — roadside units (RSU), UAVs, high-altitude platforms (HAP) and LEO satellites. Every decision picks a tier, a node and an offloading ratio α, while meeting a 4-second deadline plus sojourn and energy constraints.",
          vi: "Xe tự hành offload tác vụ tính toán sang mạng 4 tầng: RSU (mặt đất), UAV, HAP (tầng bình lưu) và vệ tinh LEO. Mỗi lần phải chọn tầng nào, node nào và tỉ lệ offload α, đồng thời thoả deadline 4 giây, ràng buộc sojourn và năng lượng.",
        },
      },
      {
        id: "baseline",
        title: { en: "Baseline", vi: "Baseline" },
        body: {
          en: "I reimplemented a published hierarchical-DQN baseline (Shinde & Tarchi, IEEE TMLCN 2024): three chained DQNs — tier → node → ratio — with 15,744 parameters in total.",
          vi: "Tôi cài đặt lại baseline hierarchical-DQN đã công bố (Shinde & Tarchi, IEEE TMLCN 2024): 3 DQN nối tiếp — tier → node → ratio — tổng 15.744 tham số.",
        },
      },
      {
        id: "approach",
        title: { en: "Quantum replacement, module for module", vi: "Thay thế bằng lượng tử, từng module" },
        bullets: {
          en: [
            "Tier: a 4-qubit variational circuit with angle encoding",
            "Ratio: a 3-qubit Born-rule circuit with basis encoding",
            "Node: QAOA (p = 2) with a constraint-preserving XY mixer, so the one-hot constraint lives in the circuit structure itself",
          ],
          vi: [
            "Tier: mạch biến phân 4 qubit, angle encoding",
            "Ratio: mạch 3 qubit, basis encoding, Born policy",
            "Node: QAOA (p = 2) với XY mixer, ràng buộc one-hot được giữ ngay trong cấu trúc mạch",
          ],
        },
        visual: "schematic",
      },
      {
        id: "training",
        title: { en: "Training", vi: "Huấn luyện" },
        body: {
          en: "REINFORCE with exact parameter-shift policy gradients; the QAOA angles are tuned by Bayesian optimisation (Gaussian process, Matérn-5/2 kernel, expected improvement). 32 trainable parameters in total.",
          vi: "REINFORCE với gradient parameter-shift chính xác; góc QAOA được tune bằng Bayesian Optimization (GP Matérn-5/2, EI). Tổng 32 tham số huấn luyện.",
        },
      },
      {
        id: "results",
        title: { en: "Results", vi: "Kết quả" },
        bullets: {
          en: [
            "Both learned controllers — quantum and DQN — reach ~0.43–0.48 s median latency, against 1.31 s for the distance heuristic and 5 s for local-only processing",
            "XY mixer vs QUBO penalty: exact node selection rose from 63–74% to 94%, with no infeasible outputs",
            "The node selector ran on real photonic hardware (Quandela Belenos): 99.93% valid outcomes, matching noiseless simulation on 11 of 12 instances",
          ],
          vi: [
            "Cả hai mô hình học được — lượng tử và DQN — đạt độ trễ trung vị khoảng 0,43–0,48 s, so với 1,31 s của heuristic Distance và 5 s nếu xử lý toàn bộ tại xe",
            "XY mixer so với QUBO penalty: tỉ lệ chọn đúng node tăng từ 63–74% lên 94%, không có output bất khả thi",
            "Chạy mạch chọn node trên QPU photonic thật (Quandela Belenos): 99,93% outcome hợp lệ, khớp mô phỏng không nhiễu ở 11/12 instance",
          ],
        },
        visual: "metrics",
      },
      {
        id: "negative",
        title: { en: "Negative results, reported", vi: "Kết quả âm, được công bố" },
        body: {
          en: "Bayesian optimisation's +66% gain in the noiseless setting disappears under readout noise (10 seeds).",
          vi: "Bayesian Optimization giúp +66% khi không nhiễu, nhưng lợi ích này mất đi khi có readout noise (10 seed).",
        },
      },
      {
        id: "audit",
        title: { en: "Baseline audit", vi: "Kiểm tra lại baseline" },
        body: {
          en: "Found a bug in the baseline's released code: its channel model made link gain grow with distance, giving LEO 160× the gain of a roadside unit. I also corrected its parameter accounting.",
          vi: "Phát hiện bug kênh truyền trong code gốc của baseline: gain tăng theo khoảng cách, khiến LEO có gain gấp 160 lần RSU. Tôi cũng sửa lại cách đếm tham số của baseline.",
        },
      },
      {
        id: "built",
        title: { en: "Built from scratch", vi: "Tự xây dựng từ đầu" },
        bullets: {
          en: [
            "The simulator",
            "NumPy statevector kernels, cross-checked against PennyLane to 1e-16",
            "SUMO / LuST mobility traces",
            "An invariant test suite",
          ],
          vi: [
            "Bộ mô phỏng",
            "Kernel statevector bằng NumPy, đối chiếu với PennyLane tới sai số 1e-16",
            "Dữ liệu di chuyển SUMO / LuST",
            "Bộ kiểm thử bất biến (invariant tests)",
          ],
        },
      },
      {
        id: "status",
        title: { en: "Status", vi: "Trạng thái" },
        body: { en: "Manuscript complete.", vi: "Đã hoàn thành bản thảo." },
      },
    ],
  },

  /*
   * ── Template for more projects ────────────────────────────────────────────
   * Smaller builds, experiments, prototypes and coursework:
   *
   * {
   *   slug: "my-tool",
   *   title: "My Tool",
   *   featured: false,
   *   accent: "automation",
   *   domains: ["automation"],
   *   category: { en: "Automation", vi: "Tự động hoá" },
   *   summary: { en: "One sentence.", vi: "Một câu." },
   *   tags: ["Python"],
   *   year: "2025",
   *   schematic: { layout: "linear", nodes: ["input", "process", "output"] },
   *   cover: null,
   *   screenshots: [],
   *   metrics: [],
   *   chart: null,
   *   links: { github: "https://github.com/…" },
   *   caseStudy: [],
   * },
   */
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsInDomain(domain: Domain): Project[] {
  return projects.filter((p) => p.domains.includes(domain));
}
