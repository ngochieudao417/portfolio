import type { ResearchEntry } from "./types";

/**
 * Research Lab.
 *
 * Layer 1 (overview) = title, abstract, role, status, venue, key result, links.
 * Layer 2 (notebook) = the `notebook` cells, revealed on demand.
 *
 * `role`, `status`, `venue` and `keyResult` are null until real information is
 * supplied. All numbers (metrics, chart) must come from actual project data.
 */
export const research: ResearchEntry[] = [
  {
    // Author's guidance: state the parameter count as a fact only — no "same performance",
    // "quantum advantage", "large-scale" or "more stable" claims until Phase 2 results exist.
    slug: "quantum-hrl-offloading",
    code: "R-01",
    project: "quantum-hrl-offloading",
    accent: "ai",
    domains: ["research", "ai"],
    title: {
      en: "Quantum-Enhanced Hierarchical RL for Vehicular Edge Offloading",
      vi: "Học tăng cường phân cấp tăng cường lượng tử cho offload tác vụ của xe tự hành",
    },
    abstract: {
      en: "A hybrid quantum–classical controller that decides where connected vehicles offload computation across roadside units, UAVs, high-altitude platforms and LEO satellites — replacing a published hierarchical-DQN baseline module for module with variational circuits and QAOA.",
      vi: "Bộ điều khiển lai lượng tử – cổ điển quyết định nơi xe kết nối offload tác vụ tính toán giữa RSU, UAV, HAP và vệ tinh LEO — thay từng module của baseline hierarchical-DQN đã công bố bằng mạch biến phân và QAOA.",
    },
    role: null, // TODO(content)
    status: { en: "Manuscript complete", vi: "Đã hoàn thành bản thảo" },
    venue: null,
    keyResult: {
      en: "Node selector on Quandela Belenos photonic QPU: 99.93% valid outcomes, matching simulation on 11 of 12 instances",
      vi: "Mạch chọn node trên QPU photonic Quandela Belenos: 99,93% outcome hợp lệ, khớp mô phỏng ở 11/12 instance",
    },
    links: { paper: "", repo: "" },
    schematic: {
      layout: "snake",
      nodes: ["task", "tier · VQC 4q", "node · QAOA-XY", "ratio · VQC 3q", "RSU/UAV/HAP/LEO", "reward"],
    },
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
        note: { en: "vs 1.31 s heuristic, 5 s local-only", vi: "so với 1,31 s heuristic, 5 s tại xe" },
      },
      {
        label: { en: "Exact node selection, XY mixer", vi: "Chọn đúng node, XY mixer" },
        value: "94",
        unit: "%",
        note: { en: "vs 63–74% with a QUBO penalty", vi: "so với 63–74% với QUBO penalty" },
      },
      {
        label: { en: "Valid outcomes on photonic QPU", vi: "Outcome hợp lệ trên QPU photonic" },
        value: "99.93",
        unit: "%",
      },
    ],
    chart: null,
    notebook: [
      {
        id: "question",
        title: { en: "Research question", vi: "Câu hỏi nghiên cứu" },
        body: {
          en: "Keeping the hierarchical decomposition of a published DQN baseline (tier → node → ratio), what happens when each module's solver is replaced by a quantum circuit?",
          vi: "Giữ nguyên cách phân rã phân cấp của baseline DQN đã công bố (tier → node → ratio), điều gì xảy ra khi thay bộ giải của từng module bằng một mạch lượng tử?",
        },
      },
      {
        id: "problem",
        title: { en: "Problem setting", vi: "Bài toán" },
        body: {
          en: "Connected vehicles offload computation across a four-tier network — roadside units, UAVs, high-altitude platforms and LEO satellites. Each decision picks a tier, a node and an offloading ratio α under a 4-second deadline plus sojourn and energy constraints.",
          vi: "Xe kết nối offload tác vụ sang mạng 4 tầng — RSU, UAV, HAP và vệ tinh LEO. Mỗi quyết định chọn tầng, node và tỉ lệ offload α, thoả deadline 4 giây cùng ràng buộc sojourn và năng lượng.",
        },
      },
      {
        id: "model",
        title: { en: "Model details", vi: "Chi tiết mô hình" },
        bullets: {
          en: [
            "Tier: 4-qubit variational circuit, angle encoding",
            "Ratio: 3-qubit circuit, basis encoding, Born-rule policy",
            "Node: QAOA, p = 2, with an XY mixer that keeps the one-hot constraint inside the circuit",
            "Training: REINFORCE with exact parameter-shift gradients; QAOA angles tuned by Bayesian optimisation (GP, Matérn-5/2, expected improvement)",
          ],
          vi: [
            "Tier: mạch biến phân 4 qubit, angle encoding",
            "Ratio: mạch 3 qubit, basis encoding, Born policy",
            "Node: QAOA p = 2 với XY mixer, giữ ràng buộc one-hot ngay trong mạch",
            "Huấn luyện: REINFORCE với gradient parameter-shift chính xác; góc QAOA tune bằng Bayesian Optimization (GP Matérn-5/2, EI)",
          ],
        },
      },
      { id: "architecture", title: { en: "Architecture", vi: "Kiến trúc" }, visual: "schematic" },
      {
        id: "experiment",
        title: { en: "Experiment design", vi: "Thiết kế thí nghiệm" },
        body: {
          en: "Compared against the reimplemented hierarchical-DQN baseline (Shinde & Tarchi, IEEE TMLCN 2024), a distance heuristic and local-only processing, on SUMO / LuST mobility traces. The node-selection circuit was also run on Quandela's Belenos photonic QPU.",
          vi: "So sánh với baseline hierarchical-DQN được cài đặt lại (Shinde & Tarchi, IEEE TMLCN 2024), heuristic Distance và xử lý toàn bộ tại xe, trên dữ liệu di chuyển SUMO / LuST. Mạch chọn node còn được chạy trên QPU photonic Belenos của Quandela.",
        },
      },
      { id: "metrics", title: { en: "Metrics", vi: "Chỉ số" }, visual: "metrics" },
      {
        id: "results",
        title: { en: "Results", vi: "Kết quả" },
        bullets: {
          en: [
            "Both learned controllers reach ~0.43–0.48 s median latency, vs 1.31 s for the distance heuristic and 5 s for local-only processing",
            "XY mixer vs QUBO penalty: exact node selection 63–74% → 94%, with no infeasible outputs",
            "Photonic hardware: 99.93% valid outcomes, matching noiseless simulation on 11 of 12 instances",
            "Negative result: Bayesian optimisation's +66% noiseless gain disappears under readout noise (10 seeds)",
            "Baseline audit: its released channel model made gain grow with distance (LEO 160× an RSU); parameter accounting corrected",
          ],
          vi: [
            "Cả hai mô hình học đạt độ trễ trung vị ~0,43–0,48 s, so với 1,31 s của heuristic Distance và 5 s khi xử lý tại xe",
            "XY mixer so với QUBO penalty: chọn đúng node 63–74% → 94%, không có output bất khả thi",
            "Phần cứng photonic: 99,93% outcome hợp lệ, khớp mô phỏng không nhiễu ở 11/12 instance",
            "Kết quả âm: lợi ích +66% của Bayesian Optimization khi không nhiễu mất đi khi có readout noise (10 seed)",
            "Kiểm tra baseline: mô hình kênh trong code gốc làm gain tăng theo khoảng cách (LEO gấp 160 lần RSU); đã sửa cách đếm tham số",
          ],
        },
      },
      {
        id: "engineering",
        title: { en: "Built from scratch", vi: "Tự xây dựng từ đầu" },
        body: {
          en: "Simulator, NumPy statevector kernels cross-checked against PennyLane to 1e-16, SUMO / LuST mobility traces, and an invariant test suite.",
          vi: "Bộ mô phỏng, kernel statevector bằng NumPy đối chiếu với PennyLane tới 1e-16, dữ liệu di chuyển SUMO / LuST, và bộ kiểm thử bất biến.",
        },
      },
      { id: "limitations", title: { en: "Limitations", vi: "Hạn chế" } },
      { id: "future", title: { en: "Future work", vi: "Hướng phát triển" } },
    ],
  },
  {
    slug: "hybrid-ml-vqe",
    code: "R-02",
    project: "hybrid-ml-vqe",
    accent: "research",
    domains: ["research", "ai"],
    title: {
      en: "Hybrid ML-VQE: Machine-Learned Warm Starts for Molecular Ground-State Energy",
      vi: "Hybrid ML-VQE: Khởi tạo ấm bằng học máy cho bài toán năng lượng trạng thái cơ bản",
    },
    abstract: {
      en: "Tests whether machine learning can predict starting points for the Variational Quantum Eigensolver across a potential-energy-surface scan instead of always starting from Hartree–Fock — with a hand-built quantum chemistry pipeline, a controlled 9 × 5 × 5 experiment matrix, and the VQE-PES Studio web app.",
      vi: "Kiểm định giả thuyết: dùng học máy dự đoán điểm khởi tạo cho VQE khi quét bề mặt thế năng thay vì luôn bắt đầu từ Hartree-Fock — với chuỗi tính toán tự cài đặt, ma trận thí nghiệm có kiểm soát 9 × 5 × 5, và ứng dụng web VQE-PES Studio.",
    },
    role: null, // TODO(content)
    status: null, // TODO(content)
    venue: null,
    keyResult: {
      en: "7.5–13.6× fewer energy evaluations to chemical accuracy (1.6 mHa) on H₂, LiH and H₄",
      vi: "Giảm 7,5–13,6 lần số lần đánh giá năng lượng để đạt độ chính xác hoá học (1,6 mHa) trên H₂, LiH và H₄",
    },
    links: { paper: "", repo: "" },
    schematic: {
      layout: "snake",
      nodes: ["geometry", "PySCF → Ĥ", "Jordan-Wigner", "ML → θ₀", "UCCSD · SPSA", "E₀ + cost"],
    },
    metrics: [
      {
        label: { en: "Fewer energy evaluations", vi: "Giảm số lần đánh giá năng lượng" },
        value: "7.5–13.6×",
        note: { en: "to 1.6 mHa on H₂, LiH, H₄", vi: "để đạt 1,6 mHa trên H₂, LiH, H₄" },
      },
      { label: { en: "Break-even point (geometries)", vi: "Điểm hoà vốn (số hình học)" }, value: "46–89" },
      {
        label: { en: "Error on sparse 2-D grids", vi: "Sai số trên lưới 2 chiều thưa" },
        value: "0.72",
        unit: "mHa",
        note: { en: "vs 3.5–10.6 mHa via latent space", vi: "so với 3,5–10,6 mHa qua không gian tiềm ẩn" },
      },
      { label: { en: "Automated tests", vi: "Kiểm thử tự động" }, value: "48" },
    ],
    chart: null,
    notebook: [
      {
        id: "question",
        title: { en: "Research question", vi: "Câu hỏi nghiên cứu" },
        body: {
          en: "Can machine learning predict good VQE starting parameters across a potential-energy-surface scan — and is optimizing inside an autoencoder's latent space cheaper?",
          vi: "Học máy có dự đoán được điểm khởi tạo tốt cho VQE khi quét bề mặt thế năng không — và tối ưu trong không gian tiềm ẩn của mạng mã hoá tự động có rẻ hơn không?",
        },
      },
      {
        id: "background",
        title: { en: "Background: the variational principle", vi: "Nền tảng: nguyên lý biến phân" },
        body: {
          en: "The molecular Hamiltonian Ĥ is mapped to a weighted sum of Pauli strings that a quantum device can measure. For any trial state |ψ(θ)⟩ prepared by a parameterized circuit, the measured energy is an upper bound on the true ground-state energy E₀ — so minimizing it over θ approaches E₀ from above. Each optimizer step costs many circuit runs, which is why a good starting θ matters.",
          vi: "Hamiltonian Ĥ của phân tử được ánh xạ thành tổng có trọng số của các chuỗi Pauli mà thiết bị lượng tử đo được. Với mọi trạng thái thử |ψ(θ)⟩ do mạch có tham số tạo ra, năng lượng đo được luôn là cận trên của E₀ — nên cực tiểu hoá theo θ sẽ tiến về E₀ từ phía trên. Mỗi bước tối ưu tốn nhiều lần chạy mạch, vì vậy điểm khởi tạo θ tốt rất quan trọng.",
        },
        math: ["Ĥ = Σᵢ cᵢ Pᵢ", "E(θ) = ⟨ψ(θ)| Ĥ |ψ(θ)⟩ ≥ E₀", "θ* = argmin_θ E(θ),   θ₀ = f_ML(geometry)"],
      },
      {
        id: "methodology",
        title: { en: "Methodology", vi: "Phương pháp" },
        bullets: {
          en: [
            "Hand-built pipeline: molecular geometry → PySCF → Jordan–Wigner qubit Hamiltonian → UCCSD circuit (sparse-matrix simulation) → SPSA optimizer",
            "No off-the-shelf VQE framework, so every energy evaluation is under control",
            "A cost ledger counts every circuit run, stage by stage",
          ],
          vi: [
            "Chuỗi tự cài đặt: hình học phân tử → PySCF → Hamiltonian qubit (Jordan-Wigner) → mạch UCCSD (mô phỏng ma trận thưa) → bộ tối ưu SPSA",
            "Không dùng khung VQE dựng sẵn, để kiểm soát từng lần đánh giá năng lượng",
            "Một sổ chi phí đếm mọi lần chạy mạch theo từng giai đoạn",
          ],
        },
      },
      { id: "architecture", title: { en: "Architecture", vi: "Kiến trúc" }, visual: "schematic" },
      {
        id: "experiment",
        title: { en: "Experiment design", vi: "Thiết kế thí nghiệm" },
        body: {
          en: "9 initialization methods × 5 geometry families × 5 seeds. Every branch shares one optimization function and differs only in its starting point — enforced by the code architecture. Methods: Hartree–Fock, random, autoencoder, PCA, nearest neighbour, mean, polynomial regression, neural network, latent-space optimization.",
          vi: "9 phương pháp khởi tạo × 5 họ hình học × 5 seed. Mọi nhánh dùng chung một hàm tối ưu, chỉ khác điểm xuất phát — được đảm bảo bằng kiến trúc code. Các phương pháp: Hartree-Fock, ngẫu nhiên, mạng mã hoá tự động, PCA, láng giềng gần nhất, trung bình, hồi quy đa thức, mạng nơ-ron, tối ưu trong không gian tiềm ẩn.",
        },
      },
      {
        id: "dataset",
        title: { en: "Molecules", vi: "Phân tử" },
        body: { en: "H₂, LiH and H₄ across five geometry families.", vi: "H₂, LiH và H₄ trên 5 họ hình học." },
      },
      { id: "metrics", title: { en: "Metrics", vi: "Chỉ số" }, visual: "metrics" },
      {
        id: "results",
        title: { en: "Results", vi: "Kết quả" },
        bullets: {
          en: [
            "7.5–13.6× fewer energy evaluations to chemical accuracy (1.6 mHa); break-even at 46–89 geometries",
            "Hypothesis refuted: with SPSA the cost per iteration doesn't depend on dimensionality, so latent-space compression only costs accuracy — ML should generate starting points, not constrain the search space",
            "Sparse 2-D grids: neural network 0.72 mHa vs 3.5–10.6 mHa for latent-space methods",
            "Diagnosed two methodological bugs: molecular-orbital sign flips between neighbouring geometries (transfer error 69–206 mHa → 0.26–0.95 mHa after sign normalization) and a mis-set SPSA step-size calibration",
          ],
          vi: [
            "Giảm 7,5–13,6 lần số lần đánh giá năng lượng để đạt độ chính xác hoá học (1,6 mHa); điểm hoà vốn 46–89 hình học",
            "Bác bỏ giả thuyết: với SPSA, chi phí mỗi vòng lặp không phụ thuộc số chiều, nên nén qua không gian tiềm ẩn chỉ làm giảm độ chính xác — học máy nên sinh điểm khởi tạo, không ràng buộc không gian tối ưu",
            "Lưới 2 chiều thưa: mạng nơ-ron 0,72 mHa so với 3,5–10,6 mHa của phương pháp qua không gian tiềm ẩn",
            "Chẩn đoán hai lỗi phương pháp: dấu orbital phân tử đổi thất thường giữa các hình học lân cận (sai số chuyển giao 69–206 mHa → 0,26–0,95 mHa sau chuẩn hoá dấu) và điểm hiệu chỉnh bước SPSA đặt sai",
          ],
        },
      },
      {
        id: "limitations",
        title: { en: "Limitations", vi: "Hạn chế" },
        body: {
          en: "On dense one-dimensional scans the autoencoder does not beat a simple nearest-neighbour lookup; the difference only shows on sparse two-dimensional grids.",
          vi: "Trên dữ liệu một chiều dày, mạng mã hoá tự động không thắng nổi phép tra cứu láng giềng gần nhất; khác biệt chỉ lộ ra trên lưới hai chiều thưa.",
        },
      },
      { id: "future", title: { en: "Future work", vi: "Hướng phát triển" } },
    ],
  },
  {
    slug: "dengue-forecasting",
    code: "R-03",
    project: "dengue-forecasting",
    accent: "data",
    domains: ["research", "data"],
    title: {
      en: "Quantum-Enhanced Dengue Outbreak Forecasting",
      vi: "Dự báo bùng phát sốt xuất huyết có tăng cường lượng tử",
    },
    abstract: {
      en: "Forecasts dengue outbreaks by combining quantum and classical forecasting approaches in a single pipeline.",
      vi: "Dự báo bùng phát sốt xuất huyết bằng cách kết hợp phương pháp dự báo lượng tử và cổ điển trong cùng một pipeline.",
    },
    role: null, // TODO(content): your role in team QAAA LAB
    status: {
      en: "Awarded incubation support to continue development",
      vi: "Được hỗ trợ ươm tạo để tiếp tục phát triển",
    },
    venue: {
      en: "SEA Quantathon 2026 — International Quantum Computing Hackathon, Gia Lai Quantum Year 2026",
      vi: "SEA Quantathon 2026 — Hackathon quốc tế về tính toán lượng tử, Năm Lượng tử Gia Lai 2026",
    },
    keyResult: {
      en: "First Prize, team QAAA LAB — 26 finalist teams, 400+ applications",
      vi: "Giải Nhất, đội QAAA LAB — 26 đội chung kết, hơn 400 hồ sơ",
    },
    // Status, venue and key result come from the FIT NEU announcement in links.article.
    links: {
      paper: "",
      repo: "",
      article: "https://fit.neu.edu.vn/en/post/qaaa-lab-giai-nhat-hackathon-luong-tu-gia-lai-2026",
    },
    schematic: {
      layout: "branch",
      nodes: ["time series", "classical", "quantum", "forecast"],
    },
    metrics: [],
    chart: null,
    notebook: [
      {
        id: "question",
        title: { en: "Research question", vi: "Câu hỏi nghiên cứu" },
        body: {
          en: "Can combining quantum and classical forecasting approaches help predict dengue outbreaks?",
          vi: "Việc kết hợp phương pháp dự báo lượng tử và cổ điển có giúp dự đoán bùng phát sốt xuất huyết không?",
        },
      },
      {
        id: "formulation",
        title: { en: "Problem formulation", vi: "Phát biểu bài toán" },
        body: {
          en: "Framed as time-series forecasting: predict the case count h steps ahead from a window of past observations.",
          vi: "Bài toán được phát biểu dưới dạng dự báo chuỗi thời gian: dự đoán số ca ở h bước tiếp theo từ một cửa sổ quan sát trong quá khứ.",
        },
        math: ["ŷ(t+h) = f( y(t−k), …, y(t) )"],
      },
      { id: "dataset", title: { en: "Dataset", vi: "Dữ liệu" } },
      { id: "methodology", title: { en: "Methodology", vi: "Phương pháp" } },
      { id: "architecture", title: { en: "Architecture", vi: "Kiến trúc" }, visual: "schematic" },
      { id: "experiment", title: { en: "Experiment design", vi: "Thiết kế thí nghiệm" } },
      { id: "metrics", title: { en: "Metrics", vi: "Chỉ số" }, visual: "metrics" },
      { id: "results", title: { en: "Results", vi: "Kết quả" }, visual: "chart" },
      { id: "limitations", title: { en: "Limitations", vi: "Hạn chế" } },
      { id: "future", title: { en: "Future research", vi: "Hướng nghiên cứu tiếp theo" } },
    ],
  },
  {
    // Source: https://fit.neu.edu.vn/post/anh-huong-chatgpt-den-tu-duy-doc-lap-sinh-vien-ha-noi
    slug: "chatgpt-independent-thinking",
    code: "R-04",
    accent: "research",
    domains: ["research", "data"],
    title: {
      en: "The Impact of ChatGPT on Students' Independent Thinking",
      vi: "Ảnh hưởng của ChatGPT tới năng lực tư duy độc lập của sinh viên Hà Nội",
    },
    abstract: {
      en: "Student research on how ChatGPT affects the independent thinking of university students in Hanoi — a survey of 407 students modeled with SPSS and AMOS, plus 58 thinking tests comparing students with and without ChatGPT.",
      vi: "Nghiên cứu khoa học sinh viên về ảnh hưởng của ChatGPT tới tư duy độc lập của sinh viên các trường đại học tại Hà Nội — khảo sát 407 sinh viên, phân tích bằng SPSS và AMOS, cùng 58 bài kiểm tra tư duy so sánh nhóm có và không dùng ChatGPT.",
    },
    role: { en: "Member of a five-student research team", vi: "Thành viên nhóm nghiên cứu 5 sinh viên" },
    status: { en: "Completed · 2025", vi: "Đã hoàn thành · 2025" },
    venue: {
      en: "Student Research, Faculty of IT — National Economics University",
      vi: "Nghiên cứu khoa học sinh viên, Khoa CNTT — Đại học Kinh tế Quốc dân",
    },
    keyResult: {
      en: "Used appropriately, ChatGPT had a positive effect on independent thinking",
      vi: "Khi được dùng hợp lý, ChatGPT có ảnh hưởng tích cực tới tư duy độc lập",
    },
    links: { article: "https://fit.neu.edu.vn/post/anh-huong-chatgpt-den-tu-duy-doc-lap-sinh-vien-ha-noi" },
    schematic: {
      layout: "linear",
      nodes: ["survey n=407", "SPSS 27", "AMOS 24", "findings"],
    },
    metrics: [
      { label: { en: "Survey respondents", vi: "Sinh viên khảo sát" }, value: "407" },
      { label: { en: "Thinking tests compared", vi: "Bài kiểm tra tư duy" }, value: "58" },
    ],
    chart: null,
    notebook: [
      {
        id: "question",
        title: { en: "Research question", vi: "Câu hỏi nghiên cứu" },
        body: {
          en: "How does ChatGPT affect the independent-thinking ability of university students in Hanoi?",
          vi: "ChatGPT ảnh hưởng thế nào tới năng lực tư duy độc lập của sinh viên các trường đại học tại Hà Nội?",
        },
      },
      {
        id: "motivation",
        title: { en: "Motivation", vi: "Động lực" },
        body: {
          en: "ChatGPT changed how students reach knowledge: what used to take minutes or hours of searching now takes a few prompts. That convenience carries a risk of over-reliance — students leaning on the tool instead of studying and researching themselves — which challenges independent thinking.",
          vi: "ChatGPT đã thay đổi cách sinh viên tiếp cận tri thức: việc tra cứu từng mất nhiều phút, thậm chí hàng giờ, nay chỉ cần vài dòng lệnh. Sự tiện lợi đó đi kèm nguy cơ lạm dụng — sinh viên dựa dẫm vào công cụ thay vì tự học và nghiên cứu — đặt ra thách thức cho năng lực tư duy độc lập.",
        },
      },
      {
        id: "methodology",
        title: { en: "Methodology", vi: "Phương pháp" },
        bullets: {
          en: [
            "Built a research model of ChatGPT's impact on independent thinking from prior foundational studies",
            "Surveyed 407 students from universities across Hanoi",
            "Analyzed the data with SPSS 27.0 and AMOS 24.0",
            "Compared 58 thinking tests between a group supported by ChatGPT and a group without it",
          ],
          vi: [
            "Xây dựng mô hình đánh giá tác động của ChatGPT tới tư duy độc lập dựa trên các nghiên cứu nền tảng",
            "Khảo sát 407 sinh viên từ nhiều trường đại học tại Hà Nội",
            "Phân tích dữ liệu bằng SPSS 27.0 và AMOS 24.0",
            "So sánh 58 bài kiểm tra tư duy giữa nhóm có ChatGPT hỗ trợ và nhóm không dùng",
          ],
        },
      },
      { id: "architecture", title: { en: "Pipeline", vi: "Quy trình" }, visual: "schematic" },
      { id: "metrics", title: { en: "Scale", vi: "Quy mô" }, visual: "metrics" },
      {
        id: "results",
        title: { en: "Findings", vi: "Kết quả" },
        bullets: {
          en: [
            "Acceptance intention and usage behavior had a positive effect on independent thinking when students used ChatGPT appropriately",
            "At the basic level of thinking, ChatGPT did not weaken thinking ability and helped students access information more effectively",
            "At higher levels of thinking, ChatGPT acted as an assistant for developing ideas — supporting the creative process rather than replacing it",
          ],
          vi: [
            "Ý định chấp nhận và hành vi sử dụng ChatGPT có ảnh hưởng tích cực tới tư duy độc lập khi người học sử dụng hợp lý",
            "Ở cấp độ tư duy cơ bản, ChatGPT không làm suy giảm khả năng tư duy mà còn giúp tiếp cận thông tin hiệu quả hơn",
            "Ở cấp độ tư duy cao hơn, ChatGPT đóng vai trò trợ lý phát triển ý tưởng — hỗ trợ quá trình sáng tạo thay vì thay thế nó",
          ],
        },
      },
      { id: "limitations", title: { en: "Limitations", vi: "Hạn chế" } },
    ],
  },
];

export function getResearch(slug: string): ResearchEntry | undefined {
  return research.find((r) => r.slug === slug);
}
