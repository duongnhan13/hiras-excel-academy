import { Level } from './excelData';

export type PracticeDomain = 'accounting' | 'sales' | 'inventory' | 'hr_ops';

export interface DomainMeta {
  id: PracticeDomain;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  color: string;
  badgeColor: string;
  bgLight: string;
  borderLight: string;
  roles: string[];
}

export const PRACTICE_DOMAINS: Record<PracticeDomain, DomainMeta> = {
  accounting: {
    id: 'accounting',
    name: 'Kế toán & Tài chính',
    shortName: 'Kế toán - Tài chính',
    description: 'Công nợ phải thu/phải trả, đối soát sao kê ngân hàng, thuế GTGT/TNDN, giá thành, dòng tiền & mô hình DCF/WACC.',
    badge: '📊',
    color: '#0f766e',
    badgeColor: '#0f766e',
    bgLight: '#f0fdfa',
    borderLight: '#99f6e4',
    roles: ['Kế toán công nợ', 'Kế toán tổng hợp', 'Kế toán thuế', 'Chuyên viên Tài chính (FP&A)'],
  },
  sales: {
    id: 'sales',
    name: 'Sales Admin & Kinh doanh',
    shortName: 'Sales & Kinh doanh',
    description: 'Doanh số đa kênh (Retail, Online, Đại lý, Sàn TMĐT), hoa hồng bậc thang, chiết khấu thương mại, KPI & kiểm soát đơn trùng.',
    badge: '🛒',
    color: '#1d4ed8',
    badgeColor: '#1d4ed8',
    bgLight: '#eff6ff',
    borderLight: '#bfdbfe',
    roles: ['Sales Admin', 'Trưởng nhóm Kinh doanh', 'Chuyên viên Quản trị Đơn hàng', 'Trade Marketing'],
  },
  inventory: {
    id: 'inventory',
    name: 'Kho vận & Mua hàng',
    shortName: 'Kho vận & Mua hàng',
    description: 'Báo cáo Xuất - Nhập - Tồn (XNT), tuổi hàng tồn kho (Aging Stock), điểm đặt hàng lại (ROP), tách mã SKU - Lô - Hạn dùng.',
    badge: '📦',
    color: '#b45309',
    badgeColor: '#b45309',
    bgLight: '#fffbeb',
    borderLight: '#fde68a',
    roles: ['Kế toán kho', 'Nhân viên Mua hàng (Purchasing)', 'Điều phối Kho vận', 'Quản lý Chuỗi cung ứng'],
  },
  hr_ops: {
    id: 'hr_ops',
    name: 'Nhân sự - Tiền lương & Vận hành',
    shortName: 'Nhân sự & Vận hành',
    description: 'Chấm công ca kíp, tính ngày công chuẩn, bảng lương - BHXH - thuế TNCN, theo dõi hạn hợp đồng & kiểm soát SLA ticket.',
    badge: '👥',
    color: '#7e22ce',
    badgeColor: '#7e22ce',
    bgLight: '#faf5ff',
    borderLight: '#e9d5ff',
    roles: ['Chuyên viên C&B (Lương thưởng)', 'HR Admin', 'Giám sát Vận hành (Ops)', 'Chăm sóc Khách hàng (CS)'],
  },
};

export const DOMAIN_LIST: DomainMeta[] = [
  PRACTICE_DOMAINS.accounting,
  PRACTICE_DOMAINS.sales,
  PRACTICE_DOMAINS.inventory,
  PRACTICE_DOMAINS.hr_ops,
];

export interface FormulaMistakeRule {
  pattern: RegExp;
  feedback: string;
}

export interface FormulaExercise {
  id: string;
  domain: PracticeDomain;
  level: Level;
  title: string;
  businessContext: string;
  taskPrompt: string;
  targetCell: string;
  targetColumnIndex: number; // 0-based index in headers
  targetRowIndex: number; // 0-based index in rows (Excel row = targetRowIndex + 2)
  headers: string[]; // Column A, B, C, D...
  rows: string[][]; // Data rows starting from Excel Row 2
  expectedDisplayValue: string;
  acceptedFormulas: string[];
  canonicalFormula: string;
  hints: string[];
  commonMistakes: FormulaMistakeRule[];
  explanation: string;
}

export interface DomainStudyExercise {
  domain: PracticeDomain;
  level: Level;
  title: string;
  scenario: string;
  sampleHeaders: string[];
  sampleRows: string[][];
  tiers: {
    basic: string;
    advanced: string;
    realWorldTrap: string;
  };
  solutionFormulas: {
    label: string;
    formula: string;
    note: string;
  }[];
}

// Helper to normalize Excel formulas so user can use ',' or ';', spaces, lowercase, etc.
export const normalizeFormulaInput = (raw: string): string => {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),;=<>*+/&-])\s*/g, '$1')
    .replace(/;/g, ',')
    .replace(/[“”]/g, '"')
    .toUpperCase();
};

export const evaluateFormulaSubmission = (
  userInput: string,
  exercise: FormulaExercise
): {
  isCorrect: boolean;
  feedback: string;
  matchedMistake?: string;
} => {
  const trimmed = userInput.trim();
  if (!trimmed) {
    return {
      isCorrect: false,
      feedback: 'Vui lòng nhập công thức Excel vào thanh fx (bắt đầu bằng dấu =).',
    };
  }

  if (!trimmed.startsWith('=')) {
    return {
      isCorrect: false,
      feedback: 'Bẫy cơ bản: Mọi công thức trong Excel đều phải bắt đầu bằng dấu bằng (`=`). Nếu thiếu dấu `=`, Excel sẽ hiểu đây là chuỗi văn bản thuần túy.',
    };
  }

  const normalizedUser = normalizeFormulaInput(trimmed);
  const isAccepted = exercise.acceptedFormulas.some(
    (candidate) => normalizeFormulaInput(candidate) === normalizedUser
  );

  if (isAccepted) {
    return {
      isCorrect: true,
      feedback: exercise.explanation,
    };
  }

  for (const mistake of exercise.commonMistakes) {
    if (mistake.pattern.test(normalizedUser) || mistake.pattern.test(trimmed)) {
      return {
        isCorrect: false,
        feedback: mistake.feedback,
        matchedMistake: mistake.feedback,
      };
    }
  }

  // Generic structural diagnostics
  const openParens = (trimmed.match(/\(/g) || []).length;
  const closeParens = (trimmed.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return {
      isCorrect: false,
      feedback: `Công thức đang bị lệch dấu ngoặc đơn: có ${openParens} dấu mở ngoặc \`(\` nhưng có ${closeParens} dấu đóng ngoặc \`)\`.`,
    };
  }

  return {
    isCorrect: false,
    feedback: 'Công thức chưa khớp với yêu cầu nghiệp vụ hoặc sai địa chỉ vùng dữ liệu trên bảng. Hãy kiểm tra lại tên hàm, vùng tham chiếu (cột A, B, C...) và mở phần Gợi ý nếu cần!',
  };
};

export const FORMULA_LAB_EXERCISES: FormulaExercise[] = [
  // ==========================================
  // 1. KẾ TOÁN & TÀI CHÍNH (ACCOUNTING)
  // ==========================================
  {
    id: 'lab-acc-b1',
    domain: 'accounting',
    level: 'Basic',
    title: 'Tính tổng công nợ phải thu quá hạn theo chi nhánh',
    businessContext: 'Kế toán công nợ đang rà soát sổ chi tiết phải thu khách hàng (TK 131) cuối ngày để báo cáo tổng dư nợ của riêng chi nhánh Hà Nội.',
    taskPrompt: 'Hãy viết công thức tại ô F2 để tính tổng Dư nợ (Cột E, từ E2:E6) của các hóa đơn thuộc chi nhánh "Hà Nội" (Cột B, từ B2:B6).',
    targetCell: 'F2',
    targetColumnIndex: 5,
    targetRowIndex: 0,
    headers: ['Số HĐ (A)', 'Chi nhánh (B)', 'Mã KH (C)', 'Trạng thái (D)', 'Dư nợ (E)', 'Tổng nợ HN (F)'],
    rows: [
      ['HD001', 'Hà Nội', 'KH101', 'Quá hạn', '45000000', '?'],
      ['HD002', 'TP.HCM', 'KH102', 'Trong hạn', '32000000', ''],
      ['HD003', 'Hà Nội', 'KH103', 'Trong hạn', '28000000', ''],
      ['HD004', 'Đà Nẵng', 'KH104', 'Quá hạn', '19000000', ''],
      ['HD005', 'Hà Nội', 'KH105', 'Quá hạn', '52000000', ''],
    ],
    expectedDisplayValue: '125.000.000',
    canonicalFormula: '=SUMIF(B2:B6, "Hà Nội", E2:E6)',
    acceptedFormulas: [
      '=SUMIF(B2:B6, "Hà Nội", E2:E6)',
      '=SUMIF($B$2:$B$6, "Hà Nội", $E$2:$E$6)',
      '=SUMIF(B:B, "Hà Nội", E:E)',
      '=SUMIF($B:$B, "Hà Nội", $E:$E)',
      '=SUMIFS(E2:E6, B2:B6, "Hà Nội")',
      '=SUMIFS($E$2:$E$6, $B$2:$B$6, "Hà Nội")',
      '=SUMIFS(E:E, B:B, "Hà Nội")',
    ],
    hints: [
      'Dùng hàm SUMIF(range, criteria, [sum_range]) khi cần cộng theo 1 điều kiện.',
      'Vùng điều kiện là cột Chi nhánh (B2:B6 hoặc B:B), điều kiện là "Hà Nội", vùng tính tổng là cột Dư nợ (E2:E6 hoặc E:E).',
    ],
    commonMistakes: [
      {
        pattern: /^=SUMIF\(E/i,
        feedback: 'Bẫy ngược tham số: Trong hàm `SUMIF(range, criteria, sum_range)`, vùng điều kiện `B2:B6` phải đặt TRƯỚC, còn vùng tính tổng `E2:E6` đặt ở CUỐI (ngược với SUMIFS).',
      },
      {
        pattern: /^=COUNTIF/i,
        feedback: 'Nhầm hàm: `COUNTIF` chỉ đếm số lượng hóa đơn (ra 3 hóa đơn), không tính tổng số tiền dư nợ. Bạn cần dùng `SUMIF`.',
      },
      {
        pattern: /HÀ NỘI/i,
        feedback: 'Kiểm tra dấu ngoặc kép quanh chuỗi `"Hà Nội"` hoặc vùng tham chiếu.',
      },
    ],
    explanation: 'Chuẩn xác! `SUMIF(B2:B6, "Hà Nội", E2:E6)` dò cột B tìm các dòng `"Hà Nội"` (HD001, HD003, HD005) và cộng tương ứng ở cột E: 45tr + 28tr + 52tr = 125.000.000 đ.',
  },
  {
    id: 'lab-acc-b2',
    domain: 'accounting',
    level: 'Basic',
    title: 'Làm sạch số tiền từ sao kê ngân hàng bị lưu dạng Text có dấu chấm',
    businessContext: 'Khi tải file CSV sao kê ngân hàng về Excel, cột Số tiền (Cột C) bị lưu dưới dạng chuỗi văn bản có dấu chấm ngăn cách hàng nghìn (ví dụ "18.500.000") khiến hàm SUM trả về 0.',
    taskPrompt: 'Tại ô D2, hãy dùng hàm VALUE kết hợp SUBSTITUTE để xóa toàn bộ dấu chấm "." trong ô C2 và chuyển thành kiểu Số (Number) tính toán được.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã GD (A)', 'Nội dung sao kê (B)', 'Số tiền Text (C)', 'Số tiền Chuẩn (D)'],
    rows: [
      ['UNC01', 'TT tien hang HD01', '18.500.000', '?'],
      ['UNC02', 'Thu cong no KH08', '42.000.000', '42000000'],
      ['UNC03', 'Phi duy tri TK', '110.000', '110000'],
    ],
    expectedDisplayValue: '18500000',
    canonicalFormula: '=VALUE(SUBSTITUTE(C2, ".", ""))',
    acceptedFormulas: [
      '=VALUE(SUBSTITUTE(C2, ".", ""))',
      '=--SUBSTITUTE(C2, ".", "")',
      '=SUBSTITUTE(C2, ".", "")*1',
      '=SUBSTITUTE(C2, ".", "")+0',
      '=NUMBERVALUE(C2, ",", ".")',
    ],
    hints: [
      'Dùng `SUBSTITUTE(C2, ".", "")` để thay thế dấu chấm "." bằng chuỗi rỗng "".',
      'Bọc bên ngoài bằng hàm `VALUE(...)` hoặc nhân với `1` (`*1`) / dùng `--` để ép kiểu Text sang Number.',
    ],
    commonMistakes: [
      {
        pattern: /^=SUBSTITUTE\(C2,"\.",""\)$/i,
        feedback: 'Gần đúng! `=SUBSTITUTE(C2, ".", "")` mới trả về chuỗi `"18500000"` (kiểu Text) nên khi đưa vào hàm `SUM()` vẫn bị bỏ qua. Hãy bọc thêm `VALUE(...)` hoặc `--` ở đầu để ép sang kiểu Số.',
      },
      {
        pattern: /TRIM/i,
        feedback: '`TRIM` chỉ xóa khoảng trắng thừa, không xóa được dấu chấm phân cách nghìn `"."`. Hãy dùng `SUBSTITUTE`.',
      },
    ],
    explanation: 'Tuyệt vời! `=VALUE(SUBSTITUTE(C2, ".", ""))` (hoặc `=--SUBSTITUTE(C2, ".", "")`) loại bỏ toàn bộ dấu chấm phân cách hàng nghìn và ép kết quả về kiểu Number thực sự để cộng trừ được.',
  },
  {
    id: 'lab-acc-i1',
    domain: 'accounting',
    level: 'Intermediate',
    title: 'Tính ngày đáo hạn thanh toán cuối tháng tiếp theo bằng EOMONTH',
    businessContext: 'Chính sách tín dụng của công ty cho phép khách hàng B2B thanh toán vào ngày cuối cùng của tháng kế tiếp sau tháng xuất hóa đơn (Net EOM+1).',
    taskPrompt: 'Tại ô D2, hãy viết công thức tính Ngày đáo hạn (ngày cuối cùng của tháng kế tiếp so với Ngày hóa đơn tại ô B2).',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Số HĐ (A)', 'Ngày HĐ (B)', 'Giá trị HĐ (C)', 'Ngày đáo hạn (D)'],
    rows: [
      ['VAT-101', '2026-04-12', '85.000.000', '?'],
      ['VAT-102', '2026-04-28', '120.000.000', '2026-05-31'],
      ['VAT-103', '2026-05-05', '64.000.000', '2026-06-30'],
    ],
    expectedDisplayValue: '2026-05-31',
    canonicalFormula: '=EOMONTH(B2, 1)',
    acceptedFormulas: [
      '=EOMONTH(B2, 1)',
    ],
    hints: [
      'Hàm `EOMONTH(start_date, months)` trả về ngày cuối tháng cách `start_date` số tháng là `months`.',
      'Nếu `months = 0` là cuối tháng hiện tại; `months = 1` là cuối tháng kế tiếp.',
    ],
    commonMistakes: [
      {
        pattern: /^=EOMONTH\(B2,0\)$/i,
        feedback: 'Bẫy tham số `months`: `EOMONTH(B2, 0)` trả về ngày cuối cùng của CHÍNH tháng xuất hóa đơn (30/04/2026). Để lấy ngày cuối của tháng KẾ TIẾP, tham số thứ hai phải là `1`.',
      },
      {
        pattern: /B2\+30/i,
        feedback: 'Cộng 30 ngày (`B2+30`) chỉ ra ngày 12/05/2026, không phải ngày cuối cùng của tháng kế tiếp (31/05/2026). Hãy dùng `EOMONTH(B2, 1)`.',
      },
    ],
    explanation: 'Chính xác! `=EOMONTH(B2, 1)` tự động xử lý các tháng có 28, 29, 30 hay 31 ngày và trả về đúng ngày 31/05/2026.',
  },
  {
    id: 'lab-acc-i2',
    domain: 'accounting',
    level: 'Intermediate',
    title: 'Phân loại rủi ro công nợ kết hợp IF và AND',
    businessContext: 'Kế toán trưởng yêu cầu gắn cờ "Khoanh nợ xấu" cho những khoản công nợ thỏa mãn ĐỒNG THỜI 2 điều kiện: Số ngày quá hạn (Cột C) > 60 ngày VÀ Dư nợ (Cột D) >= 50.000.000. Các trường hợp còn lại ghi "Theo dõi".',
    taskPrompt: 'Hãy viết công thức tại ô E2 để phân loại rủi ro cho dòng đầu tiên.',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Mã KH (A)', 'Tên khách hàng (B)', 'Ngày quá hạn (C)', 'Dư nợ (D)', 'Cảnh báo (E)'],
    rows: [
      ['KH201', 'Công ty Minh Phú', '75', '68000000', '?'],
      ['KH202', 'Đại lý Hoàng Gia', '45', '90000000', 'Theo dõi'],
      ['KH203', 'Cửa hàng An Tâm', '80', '15000000', 'Theo dõi'],
    ],
    expectedDisplayValue: 'Khoanh nợ xấu',
    canonicalFormula: '=IF(AND(C2>60, D2>=50000000), "Khoanh nợ xấu", "Theo dõi")',
    acceptedFormulas: [
      '=IF(AND(C2>60, D2>=50000000), "Khoanh nợ xấu", "Theo dõi")',
      '=IF(AND(D2>=50000000, C2>60), "Khoanh nợ xấu", "Theo dõi")',
    ],
    hints: [
      'Dùng `AND(C2>60, D2>=50000000)` làm biểu thức điều kiện trong hàm `IF`.',
      'Chú ý không đặt số `50000000` trong dấu ngoặc kép (nếu viết `"50000000"` Excel sẽ so sánh kiểu chuỗi rất nguy hiểm).',
    ],
    commonMistakes: [
      {
        pattern: /OR\(/i,
        feedback: 'Sai logic nghiệp vụ: Dùng `OR` sẽ gắn cờ cả những khách hàng mới quá hạn 45 ngày nhưng nợ trên 50 triệu. Yêu cầu đòi hỏi ĐỒNG THỜI cả 2 điều kiện nên phải dùng `AND`.',
      },
      {
        pattern: /"50000000"|"60"/i,
        feedback: 'Bẫy kiểu dữ liệu: Không được bọc số `60` hay `50000000` trong dấu ngoặc kép `"..."` vì trong Excel, chuỗi luôn lớn hơn số nên kết quả so sánh sẽ sai hoàn toàn!',
      },
      {
        pattern: /50\.000\.000/i,
        feedback: 'Trong công thức Excel không được gõ dấu chấm phân cách hàng nghìn `50.000.000`. Hãy gõ liền `50000000`.',
      },
    ],
    explanation: 'Hoàn hảo! `=IF(AND(C2>60, D2>=50000000), "Khoanh nợ xấu", "Theo dõi")` kiểm tra chặt chẽ cả tuổi nợ lẫn quy mô dư nợ.',
  },
  {
    id: 'lab-acc-a1',
    domain: 'accounting',
    level: 'Advanced',
    title: 'Tính NPV chuẩn xác cho dự án đầu tư có vốn bỏ ra ở Năm 0',
    businessContext: 'Chuyên viên phân tích tài chính đang thẩm định dự án mở nhà máy mới. Lãi suất chiết khấu (WACC) ở ô B1 là 12%. Vốn đầu tư ban đầu tại thời điểm t=0 (ô B2) là -500 triệu, và dòng tiền thuần từ Năm 1 đến Năm 4 nằm ở vùng B3:B6.',
    taskPrompt: 'Hãy viết công thức tính NPV chuẩn của dự án tại ô C2. Lưu ý bẫy kinh điển của hàm NPV trong Excel với dòng tiền Năm 0!',
    targetCell: 'C2',
    targetColumnIndex: 2,
    targetRowIndex: 0,
    headers: ['Kỳ dòng tiền (A)', 'Dòng tiền / Tham số (B)', 'Kết quả NPV (C)'],
    rows: [
      ['Năm 0 (Đầu tư gốc - B2)', '-500000000', '?'],
      ['Năm 1 (B3)', '160000000', 'Lãi suất WACC = 12% (ô G1)'],
      ['Năm 2 (B4)', '190000000', ''],
      ['Năm 3 (B5)', '220000000', ''],
      ['Năm 4 (B6)', '250000000', ''],
    ],
    expectedDisplayValue: '108.434.855',
    canonicalFormula: '=NPV(12%, B3:B6) + B2',
    acceptedFormulas: [
      '=NPV(12%, B3:B6) + B2',
      '=NPV(0.12, B3:B6) + B2',
      '=B2 + NPV(12%, B3:B6)',
      '=B2 + NPV(0.12, B3:B6)',
      '=NPV(G1, B3:B6) + B2',
      '=NPV($G$1, B3:B6) + B2',
    ],
    hints: [
      'Hàm `NPV(rate, value1, ...)` của Excel giả định đối số đầu tiên trong vùng `value` phát sinh ở CUỐI kỳ 1.',
      'Do đó chỉ đưa dòng tiền từ Năm 1 đến Năm 4 (`B3:B6`) vào trong `NPV(12%, B3:B6)`, sau đó cộng riêng dòng tiền Năm 0 (`+ B2`) ở bên ngoài!',
    ],
    commonMistakes: [
      {
        pattern: /NPV\([^,]+,B2:B6\)/i,
        feedback: 'Bẫy kinh điển nhất trong Excel Tài chính! Nếu bạn viết `=NPV(12%, B2:B6)`, Excel sẽ chiết khấu luôn cả khoản đầu tư Năm 0 (`B2`) về 1 năm trước đó! Phải tách `B2` ra ngoài: `=NPV(12%, B3:B6) + B2`.',
      },
      {
        pattern: /-B2$/i,
        feedback: 'Cẩn thận dấu âm! Giá trị tại ô `B2` đã là số âm (`-500000000`). Nếu bạn viết `- B2` thì trừ với trừ thành cộng (+500 triệu)! Bạn phải viết `+ B2`.',
      },
    ],
    explanation: 'Đẳng cấp CFA/FP&A! Hàm `NPV` trong Excel luôn chiết khấu giá trị đầu tiên trong dãy ngay 1 kỳ, nên công thức đúng bắt buộc phải là `=NPV(12%, B3:B6) + B2`.',
  },
  {
    id: 'lab-acc-a2',
    domain: 'accounting',
    level: 'Advanced',
    title: 'Tính số tiền trả góp hàng tháng (Gốc + Lãi) cho khoản vay bằng hàm PMT',
    businessContext: 'Doanh nghiệp vay ngân hàng mua dây chuyền sản xuất với Số tiền vay gốc tại ô B2 là 2.400.000.000 đ, Lãi suất năm tại ôC2 là 9%/năm, Thời hạn vay tại ô D2 là 5 năm, trả đều hàng tháng.',
    taskPrompt: 'Tại ô E2, hãy viết công thức PMT tính số tiền phải trả hàng tháng (đổi dấu thành số dương bằng cách đặt dấu trừ trước khoản vay -B2). Chú ý quy đổi lãi suất năm và số năm sang kỳ hạn THÁNG!',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Khoản vay (A)', 'Số tiền vay (B)', 'Lãi suất/năm (C)', 'Số năm vay (D)', 'Trả hàng tháng (E)'],
    rows: [
      ['Vay mua máy CNC', '2400000000', '9%', '5', '?'],
      ['Vay mua xe tải', '900000000', '8,5%', '4', '22.183.470'],
    ],
    expectedDisplayValue: '49.820.053',
    canonicalFormula: '=PMT(C2/12, D2*12, -B2)',
    acceptedFormulas: [
      '=PMT(C2/12, D2*12, -B2)',
      '=-PMT(C2/12, D2*12, B2)',
      '=ABS(PMT(C2/12, D2*12, B2))',
    ],
    hints: [
      'Cú pháp `PMT(rate, nper, pv)`: vì trả theo THÁNG nên `rate` phải là `C2/12` (lãi suất tháng) và `nper` phải là `D2*12` (tổng số tháng).',
      'Đặt `-B2` ở tham số thứ 3 để kết quả dòng tiền trả ra hiển thị là số dương.',
    ],
    commonMistakes: [
      {
        pattern: /PMT\(C2,D2/i,
        feedback: 'Bẫy lệch kỳ hạn! Ô `C2` là lãi suất NĂM và `D2` là số NĂM, nhưng khoản vay trả HÀNG THÁNG. Bạn bắt buộc phải chia lãi suất cho 12 (`C2/12`) và nhân số năm với 12 (`D2*12`)!',
      },
      {
        pattern: /PMT\(C2\/12,D2,/i,
        feedback: 'Bạn đã chia lãi suất cho 12 (`C2/12`) nhưng quên nhân số năm vay `D2` với 12 (`D2*12`) để ra tổng số kỳ trả góp (60 tháng).',
      },
    ],
    explanation: 'Chuẩn mực Tài chính! Khi trả góp hàng tháng, cả `rate` (`C2/12`) lẫn `nper` (`D2*12`) đều phải quy về đơn vị tháng: `=PMT(C2/12, D2*12, -B2)`.',
  },

  // ==========================================
  // 2. SALES ADMIN & KINH DOANH (SALES)
  // ==========================================
  {
    id: 'lab-sal-b1',
    domain: 'sales',
    level: 'Basic',
    title: 'Tính tỷ trọng doanh thu từng cửa hàng có khóa địa chỉ tuyệt đối ($)',
    businessContext: 'Sales Admin đang lập bảng cơ cấu doanh thu theo cửa hàng để kéo công thức từ dòng đầu tiên (F2) xuống hết danh sách (F5).',
    taskPrompt: 'Tại ô F2, hãy viết công thức tính Tỷ trọng doanh thu của cửa hàng dòng 2 (= Doanh thu E2 chia cho Tổng doanh thu vùng E2:E5), đảm bảo cố định vùng mẫu số bằng dấu $ để khi kéo xuống không bị lệch vùng!',
    targetCell: 'F2',
    targetColumnIndex: 5,
    targetRowIndex: 0,
    headers: ['Mã CH (A)', 'Tên cửa hàng (B)', 'Khu vực (C)', 'Số đơn (D)', 'Doanh thu (E)', 'Tỷ trọng (F)'],
    rows: [
      ['CH01', 'Showroom Cầu Giấy', 'Miền Bắc', '142', '450000000', '?'],
      ['CH02', 'Showroom Quận 1', 'Miền Nam', '198', '650000000', '36,1%'],
      ['CH03', 'Showroom Hải Châu', 'Miền Trung', '85', '280000000', '15,6%'],
      ['CH04', 'Showroom Thủ Đức', 'Miền Nam', '120', '420000000', '23,3%'],
    ],
    expectedDisplayValue: '25,0%',
    canonicalFormula: '=E2/SUM($E$2:$E$5)',
    acceptedFormulas: [
      '=E2/SUM($E$2:$E$5)',
      '=E2/SUM($E:$E)',
      '=$E2/SUM($E$2:$E$5)',
    ],
    hints: [
      'Tỷ trọng = Giá trị dòng hiện tại (`E2`) chia cho tổng của toàn bộ cột (`SUM($E$2:$E$5)`).',
      'Nhấn F4 hoặc thêm dấu `$` vào `$E$2:$E$5` để khi copy công thức xuống dòng 3, 4, 5 vùng tổng không bị trượt thành `E3:E6`.',
    ],
    commonMistakes: [
      {
        pattern: /^=E2\/SUM\(E2:E5\)$/i,
        feedback: 'Bẫy quên khóa địa chỉ tuyệt đối (`$`)! Nếu viết `=E2/SUM(E2:E5)`, khi kéo công thức xuống ô F3 nó sẽ tự trượt thành `=E3/SUM(E3:E6)` làm mẫu số bị sai lệch hoàn toàn. Hãy khóa thành `$E$2:$E$5`.',
      },
      {
        pattern: /^=\(?\$E\$2\)?\/SUM/i,
        feedback: 'Cẩn thận! Tử số `E2` KHÔNG được khóa dòng (`$E$2`), vì khi kéo xuống dòng 3 tử số phải đổi thành `E3`. Chỉ khóa vùng mẫu số `$E$2:$E$5`.',
      },
    ],
    explanation: 'Chính xác! `=E2/SUM($E$2:$E$5)` giữ tử số `E2` tương đối để chạy theo từng dòng, đồng thời khóa chặt mẫu số `$E$2:$E$5` (1,8 tỷ) khi kéo xuống.',
  },
  {
    id: 'lab-sal-b2',
    domain: 'sales',
    level: 'Basic',
    title: 'Tách Mã Khu vực từ đuôi Mã đơn hàng đa kênh bằng RIGHT & TRIM',
    businessContext: 'Hệ thống CRM xuất Mã đơn hàng (Cột A) có dạng "SO-2026-HN", "SO-2026-SG", nhưng đôi khi nhân viên nhập dư khoảng trắng ở cuối chuỗi.',
    taskPrompt: 'Tại ô D2, hãy dùng hàm RIGHT kết hợp TRIM(A2) để tách lấy 2 ký tự Mã khu vực ở cuối Mã đơn hàng.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã đơn CRM (A)', 'Khách hàng (B)', 'Giá trị đơn (C)', 'Mã Khu vực (D)'],
    rows: [
      ['SO-2026-HN  ', 'Công ty Ánh Dương', '24.500.000', '?'],
      ['SO-2026-SG', 'Siêu thị Minh Châu', '56.000.000', 'SG'],
      ['SO-2026-DN', 'Đại lý Hòa Bình', '18.200.000', 'DN'],
    ],
    expectedDisplayValue: 'HN',
    canonicalFormula: '=RIGHT(TRIM(A2), 2)',
    acceptedFormulas: [
      '=RIGHT(TRIM(A2), 2)',
      '=TRIM(RIGHT(TRIM(A2), 2))',
    ],
    hints: [
      'Nếu không `TRIM(A2)` trước, 2 ký tự cuối của `"SO-2026-HN  "` sẽ là 2 dấu cách trắng!',
      'Bọc `TRIM(A2)` bên trong hàm `RIGHT(..., 2)`.',
    ],
    commonMistakes: [
      {
        pattern: /^=RIGHT\(A2,2\)$/i,
        feedback: 'Bẫy khoảng trắng cuối chuỗi! Ô `A2` đang có 2 dấu cách thừa ở cuối (`"SO-2026-HN  "`). Nếu viết `=RIGHT(A2, 2)`, kết quả trả về sẽ là `"  "` (2 dấu cách trắng) chứ không phải `"HN"`! Phải dùng `=RIGHT(TRIM(A2), 2)`.',
      },
    ],
    explanation: 'Rất tinh tế! Luôn bọc `TRIM(A2)` bên trong `RIGHT` hoặc `LEFT` khi cắt mã từ CRM/ERP để tránh cắt nhầm khoảng trắng thừa.',
  },
  {
    id: 'lab-sal-i1',
    domain: 'sales',
    level: 'Intermediate',
    title: 'Tổng hợp doanh số đa điều kiện bằng SUMIFS (Kênh bán & Trạng thái)',
    businessContext: 'Cuối ngày, Trưởng phòng Kinh doanh cần biết doanh thu thực thu (chỉ tính các đơn có Trạng thái = "Hoàn tất") của riêng kênh "Sàn TMĐT" tại khu vực "TP.HCM".',
    taskPrompt: 'Hãy viết công thức tại ô F2 dùng hàm SUMIFS để tính tổng Doanh thu (E2:E6) thỏa mãn: Khu vực (B2:B6) là "TP.HCM", Kênh bán (C2:C6) là "Sàn TMĐT" và Trạng thái (D2:D6) là "Hoàn tất".',
    targetCell: 'F2',
    targetColumnIndex: 5,
    targetRowIndex: 0,
    headers: ['Mã đơn (A)', 'Khu vực (B)', 'Kênh bán (C)', 'Trạng thái (D)', 'Doanh thu (E)', 'KQ Lọc (F)'],
    rows: [
      ['SO-101', 'TP.HCM', 'Sàn TMĐT', 'Hoàn tất', '15000000', '?'],
      ['SO-102', 'TP.HCM', 'Sàn TMĐT', 'Đã hủy', '8500000', ''],
      ['SO-103', 'Hà Nội', 'Sàn TMĐT', 'Hoàn tất', '22000000', ''],
      ['SO-104', 'TP.HCM', 'Retail', 'Hoàn tất', '31000000', ''],
      ['SO-105', 'TP.HCM', 'Sàn TMĐT', 'Hoàn tất', '19000000', ''],
    ],
    expectedDisplayValue: '34.000.000',
    canonicalFormula: '=SUMIFS(E2:E6, B2:B6, "TP.HCM", C2:C6, "Sàn TMĐT", D2:D6, "Hoàn tất")',
    acceptedFormulas: [
      '=SUMIFS(E2:E6, B2:B6, "TP.HCM", C2:C6, "Sàn TMĐT", D2:D6, "Hoàn tất")',
      '=SUMIFS($E$2:$E$6, $B$2:$B$6, "TP.HCM", $C$2:$C$6, "Sàn TMĐT", $D$2:$D$6, "Hoàn tất")',
      '=SUMIFS(E:E, B:B, "TP.HCM", C:C, "Sàn TMĐT", D:D, "Hoàn tất")',
    ],
    hints: [
      'Cú pháp `SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)` luôn đặt vùng cần tính tổng (`E2:E6`) ở ĐẦU TIÊN.',
      'Sau đó lần lượt truyền 3 cặp điều kiện: Cột B = `"TP.HCM"`, Cột C = `"Sàn TMĐT"`, Cột D = `"Hoàn tất"`.',
    ],
    commonMistakes: [
      {
        pattern: /^=SUMIFS\(B/i,
        feedback: 'Bẫy thứ tự đối số: Khác với `SUMIF`, hàm `SUMIFS` bắt buộc phải đặt vùng tính tổng (`E2:E6` hoặc `E:E`) làm đối số ĐẦU TIÊN!',
      },
      {
        pattern: /^=SUMIF\(/i,
        feedback: 'Hàm `SUMIF` chỉ nhận tối đa 1 điều kiện. Ở đây có 3 điều kiện (Khu vực, Kênh bán, Trạng thái) nên bắt buộc phải dùng `SUMIFS`.',
      },
    ],
    explanation: 'Xuất sắc! `=SUMIFS(E2:E6, B2:B6, "TP.HCM", C2:C6, "Sàn TMĐT", D2:D6, "Hoàn tất")` loại bỏ đơn đã hủy SO-102 và cộng đúng SO-101 + SO-105 = 34.000.000 đ.',
  },
  {
    id: 'lab-sal-i2',
    domain: 'sales',
    level: 'Intermediate',
    title: 'Tính mức chiết khấu bậc thang cho Đại lý bằng hàm IFS',
    businessContext: 'Chính sách chiết khấu tháng cho đại lý quy định theo Doanh số (Cột C): Nếu Doanh số >= 500 triệu thì thưởng 8%; nếu >= 200 triệu thì thưởng 5%; còn lại dưới 200 triệu thì thưởng 2%.',
    taskPrompt: 'Tại ô D2, hãy dùng hàm IFS để trả về tỷ lệ chiết khấu (8%, 5% hoặc 2%) tương ứng với doanh số tại ô C2.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã ĐL (A)', 'Tên Đại lý (B)', 'Doanh số (C)', 'Mức CK (D)'],
    rows: [
      ['DL01', 'Nhà phân phối Á Châu', '340000000', '?'],
      ['DL02', 'Đại lý Thành Công', '620000000', '8%'],
      ['DL03', 'Cửa hàng Minh Anh', '145000000', '2%'],
    ],
    expectedDisplayValue: '5%',
    canonicalFormula: '=IFS(C2>=500000000, 8%, C2>=200000000, 5%, TRUE, 2%)',
    acceptedFormulas: [
      '=IFS(C2>=500000000, 8%, C2>=200000000, 5%, TRUE, 2%)',
      '=IFS(C2>=500000000, 0.08, C2>=200000000, 0.05, TRUE, 0.02)',
      '=IFS(C2>=500000000, "8%", C2>=200000000, "5%", TRUE, "2%")',
      '=IFS(C2>=500000000, 8%, C2>=200000000, 5%, C2<200000000, 2%)',
      '=IF(C2>=500000000, 8%, IF(C2>=200000000, 5%, 2%))',
    ],
    hints: [
      'Khi dùng `IFS` cho bài toán bậc thang từ cao xuống thấp, luôn kiểm tra ngưỡng lớn nhất (`C2>=500000000`) trước, rồi đến `C2>=200000000`, và cuối cùng là `TRUE, 2%`.',
    ],
    commonMistakes: [
      {
        pattern: /IFS\(C2>=200000000/i,
        feedback: 'Bẫy thứ tự bậc thang cực kỳ nguy hiểm! Trong hàm `IFS`, Excel dừng ngay ở điều kiện ĐẦU TIÊN đúng. Nếu bạn đặt `C2>=200000000` lên trước `C2>=500000000`, thì đại lý đạt 620 triệu cũng bị nhận nhầm mức 5%! Phải xét từ mốc cao nhất xuống thấp nhất.',
      },
    ],
    explanation: 'Chuẩn xác! Khi xét bậc thang giảm dần trong `IFS`, phải đặt mốc `>=500000000` trước rồi mới đến `>=200000000` và nhánh mặc định `TRUE, 2%`.',
  },
  {
    id: 'lab-sal-a1',
    domain: 'sales',
    level: 'Advanced',
    title: 'Phát hiện đơn hàng đẩy trùng từ Sàn TMĐT bằng COUNTIFS đa khóa',
    businessContext: 'Khi đồng bộ đơn hàng từ Shopee/TikTok Shop về ERP, đôi khi cùng một Mã đơn (Cột A) và cùng Mã SKU (Cột C) bị đẩy lặp 2 dòng làm nhân đôi doanh số.',
    taskPrompt: 'Tại ô E2, hãy viết công thức kiểm tra: nếu tổ hợp Mã đơn (Cột A) và Mã SKU (Cột C) của dòng 2 xuất hiện nhiều hơn 1 lần trong bảng (A2:A6 và C2:C6) thì trả về "Trùng dòng", ngược lại trả về "Hợp lệ".',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Mã đơn (A)', 'Ngày đặt (B)', 'Mã SKU (C)', 'Thành tiền (D)', 'Kiểm soát trùng (E)'],
    rows: [
      ['SP-8801', '2026-05-10', 'SKU-A1', '450000', '?'],
      ['SP-8801', '2026-05-10', 'SKU-B2', '320000', 'Hợp lệ'],
      ['SP-8801', '2026-05-10', 'SKU-A1', '450000', 'Trùng dòng'],
      ['SP-8802', '2026-05-10', 'SKU-A1', '450000', 'Hợp lệ'],
      ['SP-8803', '2026-05-11', 'SKU-C3', '890000', 'Hợp lệ'],
    ],
    expectedDisplayValue: 'Trùng dòng',
    canonicalFormula: '=IF(COUNTIFS($A$2:$A$6, A2, $C$2:$C$6, C2)>1, "Trùng dòng", "Hợp lệ")',
    acceptedFormulas: [
      '=IF(COUNTIFS($A$2:$A$6, A2, $C$2:$C$6, C2)>1, "Trùng dòng", "Hợp lệ")',
      '=IF(COUNTIFS(A2:A6, A2, C2:C6, C2)>1, "Trùng dòng", "Hợp lệ")',
      '=IF(COUNTIFS(A:A, A2, C:C, C2)>1, "Trùng dòng", "Hợp lệ")',
      '=IF(COUNTIFS($A:$A, A2, $C:$C, C2)>1, "Trùng dòng", "Hợp lệ")',
    ],
    hints: [
      'Một đơn hàng có thể mua nhiều SKU khác nhau (như SP-8801 mua cả SKU-A1 và SKU-B2 là bình thường). Chỉ khi trùng CẢ Mã đơn lẫn Mã SKU (`COUNTIFS(...) > 1`) mới là lỗi lặp dòng.',
    ],
    commonMistakes: [
      {
        pattern: /COUNTIF\(/i,
        feedback: 'Bẫy thực tế: Nếu chỉ dùng `COUNTIF(A:A, A2)>1` theo Mã đơn, bạn sẽ báo lỗi nhầm cả những đơn hàng khách mua 2 sản phẩm khác nhau (`SKU-A1` và `SKU-B2`)! Phải dùng `COUNTIFS` kết hợp cả cột A (Mã đơn) và cột C (Mã SKU).',
      },
    ],
    explanation: 'Rất thực chiến! Trong dữ liệu thương mại điện tử, một đơn hàng có nhiều dòng chi tiết sản phẩm (Order Line Items), nên kiểm tra trùng bắt buộc phải dùng `COUNTIFS` trên cặp khóa `(Mã đơn + Mã SKU)`.',
  },
  {
    id: 'lab-sal-a2',
    domain: 'sales',
    level: 'Advanced',
    title: 'Tra cứu Đơn giá bán theo 2 điều kiện (Mã SP & Hạng Đại lý) bằng XLOOKUP ghép khóa',
    businessContext: 'Cùng một Mã sản phẩm nhưng bán cho đại lý hạng "VIP" có giá ưu đãi hơn hạng "Thường". Bảng giá chuẩn nằm ở vùng F2:H5 (Cột F là Mã SP, Cột G là Hạng ĐL, Cột H là Đơn giá).',
    taskPrompt: 'Tại ô D2, hãy dùng hàm XLOOKUP với kỹ thuật ghép khóa (A2&B2) để dò trong vùng ($F$2:$F$5&$G$2:$G$5) và trả về Đơn giá tại vùng $H$2:$H$5.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã SP (A)', 'Hạng ĐL (B)', 'SL (C)', 'Đơn giá (D)', ' | ', 'DM_SP (F)', 'DM_Hạng (G)', 'DM_Giá (H)'],
    rows: [
      ['SP-01', 'VIP', '50', '?', ' | ', 'SP-01', 'Thường', '250000'],
      ['SP-01', 'Thường', '20', '250000', ' | ', 'SP-01', 'VIP', '220000'],
      ['SP-02', 'VIP', '30', '310000', ' | ', 'SP-02', 'Thường', '340000'],
      ['', '', '', '', ' | ', 'SP-02', 'VIP', '310000'],
    ],
    expectedDisplayValue: '220000',
    canonicalFormula: '=XLOOKUP(A2&B2, $F$2:$F$5&$G$2:$G$5, $H$2:$H$5)',
    acceptedFormulas: [
      '=XLOOKUP(A2&B2, $F$2:$F$5&$G$2:$G$5, $H$2:$H$5)',
      '=XLOOKUP(A2&B2, F2:F5&G2:G5, H2:H5)',
      '=SUMIFS($H$2:$H$5, $F$2:$F$5, A2, $G$2:$G$5, B2)',
      '=SUMIFS(H2:H5, F2:F5, A2, G2:G5, B2)',
    ],
    hints: [
      'Nối khóa cần tìm bằng `A2&B2` (tạo thành `"SP-01VIP"`).',
      'Nối 2 cột khóa của bảng danh mục bằng `$F$2:$F$5&$G$2:$G$5` và lấy kết quả ở `$H$2:$H$5`.',
    ],
    commonMistakes: [
      {
        pattern: /XLOOKUP\(A2,/i,
        feedback: 'Nếu chỉ dò theo 1 khóa `A2` (`"SP-01"`), `XLOOKUP` sẽ dừng ngay ở dòng đầu tiên là hạng `"Thường"` (250.000) chứ không lấy đúng giá hạng `"VIP"` (220.000)! Phải ghép khóa `A2&B2`.',
      },
    ],
    explanation: 'Đỉnh cao! `=XLOOKUP(A2&B2, $F$2:$F$5&$G$2:$G$5, $H$2:$H$5)` cho phép tra cứu chính xác trên tổ hợp nhiều điều kiện mà không cần tạo thêm cột phụ trong bảng danh mục.',
  },

  // ==========================================
  // 3. KHO VẬN & MUA HÀNG (INVENTORY)
  // ==========================================
  {
    id: 'lab-inv-b1',
    domain: 'inventory',
    level: 'Basic',
    title: 'Tách mã Kho lưu trữ ở giữa mã Lô hàng (SKU-KHO-LOT) bằng hàm MID',
    businessContext: 'Hệ thống quản lý kho quy định Mã kiện hàng (Cột A) có cấu trúc cố định: 4 ký tự đầu là Nhóm hàng, dấu gạch ngang, 3 ký tự tiếp theo là Mã Kho (ví dụ WH1, WH2), dấu gạch ngang, và số Lô.',
    taskPrompt: 'Tại ô D2, hãy dùng hàm MID để tách lấy 3 ký tự Mã Kho (bắt đầu từ vị trí ký tự thứ 6) từ chuỗi Mã kiện hàng tại ô A2.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã kiện hàng (A)', 'Tên vật tư (B)', 'Số lượng (C)', 'Mã Kho (D)'],
    rows: [
      ['ELEC-WH1-202605', 'Bo mạch nguồn 24V', '150', '?'],
      ['MECH-WH2-202605', 'Trục bi thép 12mm', '320', 'WH2'],
      ['PACK-WH1-202606', 'Thùng carton 5 lớp', '1000', 'WH1'],
    ],
    expectedDisplayValue: 'WH1',
    canonicalFormula: '=MID(A2, 6, 3)',
    acceptedFormulas: [
      '=MID(A2, 6, 3)',
    ],
    hints: [
      'Chuỗi `ELEC-WH1-202605`: `E(1) L(2) E(3) C(4) -(5) W(6) H(7) 1(8)`.',
      'Hàm `MID(text, start_num, num_chars)` lấy từ vị trí `6` với độ dài `3` ký tự.',
    ],
    commonMistakes: [
      {
        pattern: /^=MID\(A2,5,3\)$/i,
        feedback: 'Sai vị trí bắt đầu (`start_num`): Ký tự thứ 5 là dấu gạch ngang `"-"`, nên `MID(A2, 5, 3)` sẽ trả về `"-WH"`. Vị trí chữ `W` là ký tự thứ `6`.',
      },
      {
        pattern: /LEFT|RIGHT/i,
        feedback: '`LEFT` chỉ lấy từ đầu chuỗi, `RIGHT` lấy từ cuối chuỗi. Để lấy phần nằm giữa chuỗi có vị trí cố định, hãy dùng `MID(A2, 6, 3)`.',
      },
    ],
    explanation: 'Chính xác! `=MID(A2, 6, 3)` trích xuất đúng 3 ký tự từ vị trí số 6 là `"WH1"`.',
  },
  {
    id: 'lab-inv-b2',
    domain: 'inventory',
    level: 'Basic',
    title: 'Tính Tồn cuối kỳ và cảnh báo hàng dưới Định mức tồn tối thiểu (ROP)',
    businessContext: 'Kế toán kho theo dõi bảng Xuất - Nhập - Tồn vật tư. Nếu Tồn cuối (= Tồn đầu + Nhập - Xuất) nhỏ hơn hoặc bằng Định mức tối thiểu (Cột E), cần báo "Đặt hàng ngay", ngược lại báo "Đủ tồn".',
    taskPrompt: 'Tại ô F2, hãy viết công thức IF kiểm tra nếu Tồn cuối (B2 + C2 - D2) <= Định mức tối thiểu (E2) thì trả về "Đặt hàng ngay", ngược lại "Đủ tồn".',
    targetCell: 'F2',
    targetColumnIndex: 5,
    targetRowIndex: 0,
    headers: ['Mã VT (A)', 'Tồn đầu (B)', 'Nhập (C)', 'Xuất (D)', 'Định mức Min (E)', 'Trạng thái đặt hàng (F)'],
    rows: [
      ['VT-01', '120', '50', '140', '40', '?'],
      ['VT-02', '300', '100', '180', '80', 'Đủ tồn'],
      ['VT-03', '90', '0', '65', '30', 'Đặt hàng ngay'],
    ],
    expectedDisplayValue: 'Đặt hàng ngay',
    canonicalFormula: '=IF(B2+C2-D2<=E2, "Đặt hàng ngay", "Đủ tồn")',
    acceptedFormulas: [
      '=IF(B2+C2-D2<=E2, "Đặt hàng ngay", "Đủ tồn")',
      '=IF((B2+C2-D2)<=E2, "Đặt hàng ngay", "Đủ tồn")',
      '=IF(B2+C2-D2>E2, "Đủ tồn", "Đặt hàng ngay")',
    ],
    hints: [
      'Công thức tính Tồn cuối kỳ chuẩn của kho: `Tồn đầu (B2) + Nhập trong kỳ (C2) - Xuất trong kỳ (D2)`.',
      'So sánh `B2+C2-D2 <= E2` trong hàm `IF`.',
    ],
    commonMistakes: [
      {
        pattern: /B2-C2\+D2/i,
        feedback: 'Sai công thức Xuất-Nhập-Tồn! Tồn cuối kỳ phải bằng `Tồn đầu (B2) + Nhập (C2) - Xuất (D2)`.',
      },
      {
        pattern: /B2\+C2-D2<E2/i,
        feedback: 'Đề bài yêu cầu nhỏ hơn HOẶC BẰNG (`<=`) định mức tối thiểu đều phải đặt hàng ngay.',
      },
    ],
    explanation: 'Chuẩn nghiệp vụ kho! Với VT-01: Tồn cuối = 120 + 50 - 140 = 30 <= Định mức Min (40), nên hệ thống cảnh báo `"Đặt hàng ngay"`.',
  },
  {
    id: 'lab-inv-i1',
    domain: 'inventory',
    level: 'Intermediate',
    title: 'Tra cứu Đơn giá nhập kho có bẫy khoảng trắng thừa và chống lỗi #N/A',
    businessContext: 'Nhân viên kho quét mã vạch Mã SKU vào cột A nhưng máy quét bị dính khoảng trắng thừa ở cuối (ví dụ `"SKU01 "`), làm hàm VLOOKUP dò vào bảng DanhMuc ($F$2:$G$5) bị lỗi #N/A. Ngoài ra những mã mới chưa có trong danh mục cần hiện `"Chưa có giá"`.',
    taskPrompt: 'Tại ô C2, hãy viết công thức kết hợp IFERROR, VLOOKUP và TRIM(A2) để lấy Đơn giá (cột thứ 2 của vùng $F$2:$G$5, dò chính xác), nếu không tìm thấy trả về "Chưa có giá".',
    targetCell: 'C2',
    targetColumnIndex: 2,
    targetRowIndex: 0,
    headers: ['Mã quét (A)', 'Số lượng (B)', 'Đơn giá (C)', 'Trống (D)', 'Trống (E)', 'DM_Mã (F)', 'DM_Giá (G)'],
    rows: [
      ['SKU01  ', '50', '?', '', '', 'SKU01', '125000'],
      ['SKU02', '30', '89000', '', '', 'SKU02', '89000'],
      ['SKU99', '10', 'Chưa có giá', '', '', 'SKU03', '210000'],
    ],
    expectedDisplayValue: '125000',
    canonicalFormula: '=IFERROR(VLOOKUP(TRIM(A2), $F$2:$G$5, 2, 0), "Chưa có giá")',
    acceptedFormulas: [
      '=IFERROR(VLOOKUP(TRIM(A2), $F$2:$G$5, 2, 0), "Chưa có giá")',
      '=IFERROR(VLOOKUP(TRIM(A2), F2:G5, 2, 0), "Chưa có giá")',
      '=IFERROR(VLOOKUP(TRIM(A2), F:G, 2, 0), "Chưa có giá")',
      '=IFERROR(VLOOKUP(TRIM(A2), $F:$G, 2, 0), "Chưa có giá")',
      '=XLOOKUP(TRIM(A2), $F$2:$F$5, $G$2:$G$5, "Chưa có giá")',
      '=XLOOKUP(TRIM(A2), F2:F5, G2:G5, "Chưa có giá")',
    ],
    hints: [
      'Làm sạch khóa tra cứu ngay bên trong hàm bằng `TRIM(A2)`.',
      'Dùng `VLOOKUP(TRIM(A2), $F$2:$G$5, 2, 0)` rồi bọc ngoài bằng `IFERROR(..., "Chưa có giá")` (hoặc dùng `XLOOKUP` có sẵn tham số thứ 4).',
    ],
    commonMistakes: [
      {
        pattern: /VLOOKUP\(A2/i,
        feedback: 'Bẫy dữ liệu bẩn! Ô `A2` đang chứa khoảng trắng thừa (`"SKU01  "`). Nếu truyền thẳng `A2` vào `VLOOKUP` mà không bọc `TRIM(A2)`, hàm sẽ không khớp với `"SKU01"` và rơi vào nhánh lỗi `"Chưa có giá"`!',
      },
      {
        pattern: /,2,1\)/i,
        feedback: 'Bẫy tham số cuối của VLOOKUP: Dùng `1` (dò xấp xỉ) khi tra cứu Mã SKU sẽ trả về giá của mã khác hoàn toàn! Bắt buộc phải dùng `0` (hoặc `FALSE`).',
      },
    ],
    explanation: 'Quá chuẩn! Kết hợp `TRIM(A2)` ngay trong `VLOOKUP` + `IFERROR` (hoặc `XLOOKUP`) là mẫu công thức bắt buộc phải biết khi xử lý dữ liệu nhập kho thực tế.',
  },
  {
    id: 'lab-inv-i2',
    domain: 'inventory',
    level: 'Intermediate',
    title: 'Tính Ngày hết hạn Lô hàng (Shelf-life) bằng hàm EDATE',
    businessContext: 'Kho hàng FMCG quản lý hạn sử dụng theo từng lô. Biết Ngày sản xuất tại cột B và Thời hạn sử dụng (tính bằng số tháng) tại cột C. Cần tính chính xác Ngày hết hạn tại cột D.',
    taskPrompt: 'Tại ô D2, hãy dùng hàm EDATE để tính Ngày hết hạn từ Ngày sản xuất (B2) và Số tháng hạn dùng (C2).',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã Lô (A)', 'Ngày SX (B)', 'Hạn dùng - Tháng (C)', 'Ngày hết hạn (D)'],
    rows: [
      ['LOT-2025-08', '2025-08-15', '18', '?'],
      ['LOT-2025-11', '2025-11-20', '12', '2026-11-20'],
      ['LOT-2026-01', '2026-01-31', '6', '2026-07-31'],
    ],
    expectedDisplayValue: '2027-02-15',
    canonicalFormula: '=EDATE(B2, C2)',
    acceptedFormulas: [
      '=EDATE(B2, C2)',
    ],
    hints: [
      'Hàm `EDATE(start_date, months)` trả về ngày cùng ngày trong tháng sau `months` tháng.',
      'Khác với `EOMONTH` (luôn đẩy về ngày cuối tháng), `EDATE` giữ nguyên ngày sản xuất (15/08/2025 + 18 tháng -> 15/02/2027).',
    ],
    commonMistakes: [
      {
        pattern: /EOMONTH/i,
        feedback: 'Phân biệt `EDATE` và `EOMONTH`: `EOMONTH(B2, C2)` sẽ đẩy ngày hết hạn về ngày cuối cùng của tháng (28/02/2027), còn hạn sử dụng in trên bao bì phải giữ đúng ngày sản xuất bằng `=EDATE(B2, C2)` (15/02/2027).',
      },
      {
        pattern: /B2\+C2\*30/i,
        feedback: 'Cộng `C2*30` ngày sẽ bị lệch 4-5 ngày do có các tháng 31 ngày và tháng 2 có 28 ngày. Hãy dùng `=EDATE(B2, C2)`.',
      },
    ],
    explanation: 'Chính xác! `=EDATE(B2, C2)` cộng chuẩn xác 18 tháng lịch vào ngày 15/08/2025 để ra ngày hết hạn 15/02/2027.',
  },
  {
    id: 'lab-inv-a1',
    domain: 'inventory',
    level: 'Advanced',
    title: 'Tra cứu 2 chiều (Mã SKU & Kho vùng) bằng INDEX + MATCH hoặc XLOOKUP',
    businessContext: 'Giá vốn định mức của cùng một Mã vật tư nhưng nằm ở các Kho vùng khác nhau (Kho Bắc, Kho Trung, Kho Nam) sẽ khác nhau do chi phí vận chuyển nội bộ.',
    taskPrompt: 'Tại ô D2, hãy dùng INDEX kết hợp 2 hàm MATCH (dòng là A2 dò trong $F$2:$F$4, cột là B2 dò trong $G$1:$I$1) trên vùng giá $G$2:$I$4 để lấy Đơn giá kho tương ứng.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã VT (A)', 'Kho xuất (B)', 'SL (C)', 'Đơn giá vùng (D)', ' | ', 'DM Mã (F)', 'Kho Bắc (G)', 'Kho Trung (H)', 'Kho Nam (I)'],
    rows: [
      ['VT-A', 'Kho Nam', '100', '?', ' | ', 'VT-A', '50000', '52000', '55000'],
      ['VT-B', 'Kho Bắc', '200', '78000', ' | ', 'VT-B', '78000', '80000', '83000'],
      ['VT-C', 'Kho Trung', '150', '115000', ' | ', 'VT-C', '112000', '115000', '118000'],
    ],
    expectedDisplayValue: '55000',
    canonicalFormula: '=INDEX($G$2:$I$4, MATCH(A2, $F$2:$F$4, 0), MATCH(B2, $G$1:$I$1, 0))',
    acceptedFormulas: [
      '=INDEX($G$2:$I$4, MATCH(A2, $F$2:$F$4, 0), MATCH(B2, $G$1:$I$1, 0))',
      '=INDEX(G2:I4, MATCH(A2, F2:F4, 0), MATCH(B2, G1:I1, 0))',
      '=XLOOKUP(A2, $F$2:$F$4, XLOOKUP(B2, $G$1:$I$1, $G$2:$I$4))',
      '=XLOOKUP(A2, F2:F4, XLOOKUP(B2, G1:I1, G2:I4))',
    ],
    hints: [
      'Cú pháp `INDEX(array, row_num, column_num)` nhận vùng dữ liệu lõi là `$G$2:$I$4`.',
      'Số dòng `row_num` tìm bằng `MATCH(A2, $F$2:$F$4, 0)`; số cột `column_num` tìm bằng `MATCH(B2, $G$1:$I$1, 0)`.',
    ],
    commonMistakes: [
      {
        pattern: /MATCH\([^,]+,[^,]+,1\)/i,
        feedback: 'Trong cả 2 hàm `MATCH`, tham số thứ 3 bắt buộc phải là `0` (dò chính xác tuyệt đối).',
      },
      {
        pattern: /INDEX\(\$?F/i,
        feedback: 'Lưu ý: Nếu vùng `array` của `INDEX` bắt đầu từ cột `G` (`$G$2:$I$4`), thì `MATCH` theo cột cũng phải bắt đầu từ `G1:I1` để khớp số thứ tự cột (Kho Nam là cột số 3 trong vùng G:I).',
      },
    ],
    explanation: 'Xuất sắc! `=INDEX($G$2:$I$4, MATCH(A2, $F$2:$F$4, 0), MATCH(B2, $G$1:$I$1, 0))` (hoặc `XLOOKUP` lồng nhau) giải quyết gọn gàng bài toán bảng giá ma trận 2 chiều.',
  },
  {
    id: 'lab-inv-a2',
    domain: 'inventory',
    level: 'Advanced',
    title: 'Tính tổng Giá trị Tồn kho (Số lượng × Đơn giá) không cần cột phụ bằng SUMPRODUCT',
    businessContext: 'Kế toán kho cần tính nhanh Tổng giá trị tồn kho của toàn bộ các mặt hàng (= Tổng của Số lượng tồn × Đơn giá vốn tương ứng từng dòng) ngay tại một ô duy nhất E2 mà không được phép chèn thêm cột Thành tiền.',
    taskPrompt: 'Tại ô E2, hãy dùng hàm SUMPRODUCT để nhân từng cặp Số lượng tồn (C2:C5) với Đơn giá vốn (D2:D5) rồi cộng tổng lại.',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Mã SKU (A)', 'Tên vật tư (B)', 'SL Tồn (C)', 'Đơn giá vốn (D)', 'Tổng Giá trị Kho (E)'],
    rows: [
      ['SKU-01', 'Vòng bi SKF 6205', '200', '85000', '?'],
      ['SKU-02', 'Dây curoa B52', '150', '60000', ''],
      ['SKU-03', 'Phớt chắn dầu', '400', '25000', ''],
      ['SKU-04', 'Mỡ chịu nhiệt', '80', '150000', ''],
    ],
    expectedDisplayValue: '48.000.000',
    canonicalFormula: '=SUMPRODUCT(C2:C5, D2:D5)',
    acceptedFormulas: [
      '=SUMPRODUCT(C2:C5, D2:D5)',
      '=SUMPRODUCT($C$2:$C$5, $D$2:$D$5)',
      '=SUMPRODUCT(C2:C5*D2:D5)',
      '=SUM(C2:C5*D2:D5)',
    ],
    hints: [
      'Hàm `SUMPRODUCT(array1, array2)` tự động nhân từng phần tử tương ứng giữa 2 vùng `C2:C5` và `D2:D5` rồi cộng toàn bộ tích lại.',
    ],
    commonMistakes: [
      {
        pattern: /^=SUM\(C2:C5\)\*SUM\(D2:D5\)$/i,
        feedback: 'Sai bản chất toán học! `SUM(C2:C5)*SUM(D2:D5)` lấy tổng số lượng (830) nhân với tổng đơn giá (320.000) ra 265,6 triệu (sai hoàn toàn so với 48 triệu). Phải nhân từng dòng rồi mới cộng bằng `=SUMPRODUCT(C2:C5, D2:D5)`.',
      },
    ],
    explanation: 'Tuyệt vời! `=SUMPRODUCT(C2:C5, D2:D5)` tính chính xác `200×85k + 150×60k + 400×25k + 80×150k = 48.000.000 đ` mà không tốn thêm cột phụ.',
  },

  // ==========================================
  // 4. NHÂN SỰ - TIỀN LƯƠNG & VẬN HÀNH (HR & OPS)
  // ==========================================
  {
    id: 'lab-hro-b1',
    domain: 'hr_ops',
    level: 'Basic',
    title: 'Kiểm tra quy cách Mã chấm công nhân viên bằng hàm LEN',
    businessContext: 'Trước khi import bảng chấm công vào phần mềm tính lương, HR Admin cần kiểm tra toàn bộ Mã nhân viên (Cột A) phải có đúng 6 ký tự chuẩn (ví dụ NV0105). Nếu lệch độ dài sẽ bị hệ thống từ chối.',
    taskPrompt: 'Tại ô D2, hãy viết công thức IF kết hợp LEN để kiểm tra: nếu độ dài ô A2 bằng 6 thì trả về "Chuẩn", ngược lại trả về "Sai mã".',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã NV (A)', 'Họ và tên (B)', 'Bộ phận (C)', 'Kiểm tra mã (D)'],
    rows: [
      ['NV015', 'Nguyễn Văn Hùng', 'Vận hành', '?'],
      ['NV0102', 'Trần Thị Mai', 'Kế toán', 'Chuẩn'],
      ['NV0108', 'Lê Hoàng Nam', 'Kinh doanh', 'Chuẩn'],
    ],
    expectedDisplayValue: 'Sai mã',
    canonicalFormula: '=IF(LEN(A2)=6, "Chuẩn", "Sai mã")',
    acceptedFormulas: [
      '=IF(LEN(A2)=6, "Chuẩn", "Sai mã")',
      '=IF(LEN(A2)<>6, "Sai mã", "Chuẩn")',
    ],
    hints: [
      'Dùng `LEN(A2)` để lấy số ký tự của mã nhân viên tại ô A2.',
      'Đặt `LEN(A2)=6` vào điều kiện của hàm `IF`.',
    ],
    commonMistakes: [
      {
        pattern: /"6"/i,
        feedback: 'Hàm `LEN(A2)` trả về một con số (Number). Không được so sánh với chuỗi `"6"` trong ngoặc kép, hãy viết `LEN(A2)=6`.',
      },
    ],
    explanation: 'Chính xác! Mã `"NV015"` chỉ có 5 ký tự (thiếu 1 số 0) nên `=IF(LEN(A2)=6, "Chuẩn", "Sai mã")` phát hiện ngay dòng lỗi `"Sai mã"`.',
  },
  {
    id: 'lab-hro-b2',
    domain: 'hr_ops',
    level: 'Basic',
    title: 'Tính Lương thời gian theo Ngày công chuẩn có khóa ô tham số ($)',
    businessContext: 'Chuyên viên C&B tính Lương theo ngày công cho nhân viên: Lương công = Lương cơ bản (Cột C) chia cho Ngày công chuẩn của tháng (ô cố định F2 = 22 công) rồi nhân với Ngày công thực tế (Cột D).',
    taskPrompt: 'Tại ô E2, hãy viết công thức tính Lương ngày công cho dòng 2 (= C2 / $F$2 * D2), nhớ cố định ô Ngày công chuẩn $F$2 để kéo công thức xuống!',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Mã NV (A)', 'Họ tên (B)', 'Lương CB (C)', 'Công thực tế (D)', 'Lương ngày công (E)', 'Công chuẩn (F)'],
    rows: [
      ['NV101', 'Phạm Văn Khoa', '15400000', '20', '?', '22'],
      ['NV102', 'Lê Thu Thảo', '13200000', '22', '13.200.000', ''],
      ['NV103', 'Đỗ Minh Quân', '17600000', '19', '15.200.000', ''],
    ],
    expectedDisplayValue: '14.000.000',
    canonicalFormula: '=C2/$F$2*D2',
    acceptedFormulas: [
      '=C2/$F$2*D2',
      '=(C2/$F$2)*D2',
      '=C2*D2/$F$2',
      '=(C2*D2)/$F$2',
      '=C2/F$2*D2',
    ],
    hints: [
      'Công chuẩn của toàn công ty đặt tại một ô duy nhất là `F2` (dòng 3, 4 ở cột F đang trống).',
      'Nếu không khóa `$F$2`, khi kéo xuống dòng 3 công thức sẽ chia cho `F3` (ô trống = 0) và gây lỗi `#DIV/0!` ngay lập tức!',
    ],
    commonMistakes: [
      {
        pattern: /\/F2/i,
        feedback: 'Bẫy lỗi `#DIV/0!` kinh điển khi làm bảng lương! Ô công chuẩn `F2` chỉ nằm ở dòng 2. Nếu bạn viết `C2/F2*D2` mà không khóa `$F$2`, khi kéo xuống dòng 3 nó sẽ chia cho `F3` (ô trống = 0) và báo lỗi `#DIV/0!` toàn bộ bảng lương!',
      },
    ],
    explanation: 'Chuẩn C&B! Luôn khóa tuyệt đối ô tham số dùng chung (`$F$2`) để tránh lỗi `#DIV/0!` khi sao chép công thức xuống hàng trăm nhân viên.',
  },
  {
    id: 'lab-hro-i1',
    domain: 'hr_ops',
    level: 'Intermediate',
    title: 'Tính số ngày làm việc thực tế (trừ cuối tuần & nghỉ lễ) bằng NETWORKDAYS',
    businessContext: 'Bộ phận Vận hành & Nhân sự cần tính thời gian xử lý hồ sơ tuyển dụng/ticket (tính theo ngày làm việc chuẩn từ thứ Hai đến thứ Sáu, trừ thêm danh sách ngày nghỉ lễ Quốc gia nằm ở vùng $G$2:$G$3).',
    taskPrompt: 'Tại ô D2, hãy dùng hàm NETWORKDAYS để tính số ngày làm việc từ Ngày nhận (B2) đến Ngày hoàn tất (C2), có loại trừ vùng ngày nghỉ lễ $G$2:$G$3.',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã Ticket (A)', 'Ngày nhận (B)', 'Ngày xong (C)', 'Ngày công xử lý (D)', ' | ', 'Ngày Lễ (G)'],
    rows: [
      ['TK-501', '2026-04-29', '2026-05-05', '?', ' | ', '2026-04-30'],
      ['TK-502', '2026-05-04', '2026-05-06', '3', ' | ', '2026-05-01'],
    ],
    expectedDisplayValue: '3',
    canonicalFormula: '=NETWORKDAYS(B2, C2, $G$2:$G$3)',
    acceptedFormulas: [
      '=NETWORKDAYS(B2, C2, $G$2:$G$3)',
      '=NETWORKDAYS(B2, C2, G2:G3)',
    ],
    hints: [
      'Cú pháp: `=NETWORKDAYS(start_date, end_date, [holidays])`.',
      'Truyền `B2` là ngày bắt đầu, `C2` là ngày kết thúc, và `$G$2:$G$3` là danh sách ngày lễ 30/4 - 1/5.',
    ],
    commonMistakes: [
      {
        pattern: /^=NETWORKDAYS\(B2,C2\)$/i,
        feedback: 'Bẫy thiếu ngày nghỉ lễ! Nếu chỉ viết `=NETWORKDAYS(B2, C2)`, Excel chỉ trừ Thứ Bảy & Chủ Nhật mà quên trừ 2 ngày nghỉ lễ 30/4 và 1/5 tại vùng `$G$2:$G$3` (kết quả sẽ bị đội lên 5 ngày thay vì 3 ngày).',
      },
      {
        pattern: /^=C2-B2/i,
        feedback: 'Phép trừ `C2-B2` tính cả Thứ Bảy, Chủ Nhật và ngày nghỉ lễ nên làm sai lệch SLA của nhân viên.',
      },
    ],
    explanation: 'Chuẩn xác! Từ 29/04 đến 05/05 có 7 ngày lịch, trừ 2 ngày cuối tuần (02-03/05) và trừ 2 ngày lễ (30/04, 01/05 tại `$G$2:$G$3`), còn đúng 3 ngày làm việc.',
  },
  {
    id: 'lab-hro-i2',
    domain: 'hr_ops',
    level: 'Intermediate',
    title: 'Tính thâm niên làm việc (số tháng tròn) bằng hàm DATEDIF',
    businessContext: 'Chuyên viên C&B đang rà soát danh sách nhân sự để xét thưởng thâm niên. Cần tính số tháng làm việc tròn từ Ngày vào làm (B2) đến Ngày chốt báo cáo (C2).',
    taskPrompt: 'Tại ô D2, hãy dùng hàm DATEDIF để tính số tháng chênh lệch tròn giữa Ngày vào làm (B2) và Ngày chốt (C2).',
    targetCell: 'D2',
    targetColumnIndex: 3,
    targetRowIndex: 0,
    headers: ['Mã NV (A)', 'Ngày vào làm (B)', 'Ngày chốt (C)', 'Số tháng thâm niên (D)'],
    rows: [
      ['NV201', '2024-08-15', '2026-05-15', '?'],
      ['NV202', '2025-11-01', '2026-05-15', '6'],
    ],
    expectedDisplayValue: '21',
    canonicalFormula: '=DATEDIF(B2, C2, "m")',
    acceptedFormulas: [
      '=DATEDIF(B2, C2, "m")',
    ],
    hints: [
      'Cú pháp hàm: `=DATEDIF(start_date, end_date, unit)`.',
      'Tham số `unit` để lấy tổng số tháng tròn là `"m"` (nếu lấy số năm là `"y"`, lấy số ngày là `"d"`).',
    ],
    commonMistakes: [
      {
        pattern: /DATEDIF\(C2,B2/i,
        feedback: 'Bẫy ngược thứ tự ngày: Trong hàm `DATEDIF(start_date, end_date, unit)`, ngày bắt đầu (`B2` - nhỏ hơn) bắt buộc phải đứng TRƯỚC ngày kết thúc (`C2` - lớn hơn). Nếu đảo ngược sẽ gây lỗi `#NUM!`.',
      },
      {
        pattern: /"ym"/i,
        feedback: 'Lưu ý: `"ym"` chỉ lấy số tháng lẻ sau khi đã trừ số năm (ra 9 tháng). Để lấy TỔNG số tháng thâm niên (21 tháng), hãy dùng `"m"`.',
      },
    ],
    explanation: 'Chính xác! `=DATEDIF(B2, C2, "m")` tính chính xác 21 tháng thâm niên từ 15/08/2024 đến 15/05/2026.',
  },
  {
    id: 'lab-hro-a1',
    domain: 'hr_ops',
    level: 'Advanced',
    title: 'Tính tổng quỹ lương thực lĩnh đang hiển thị khi lọc bảng bằng SUBTOTAL',
    businessContext: 'Trưởng phòng Nhân sự thường xuyên bật Filter lọc theo từng Phòng ban (Kế toán, Vận hành, Kinh doanh) trên bảng lương. Nếu dùng hàm SUM thông thường ở dòng Tổng cộng, nó vẫn cộng cả các dòng nhân viên đang bị ẩn do Filter.',
    taskPrompt: 'Tại ô E6, hãy dùng hàm SUBTOTAL với mã hàm 109 để chỉ tính tổng Thực lĩnh (E2:E5) của các dòng đang hiển thị trên màn hình sau khi Filter.',
    targetCell: 'E6',
    targetColumnIndex: 4,
    targetRowIndex: 4,
    headers: ['Mã NV (A)', 'Họ tên (B)', 'Phòng ban (C)', 'Ngày công (D)', 'Thực lĩnh (E)'],
    rows: [
      ['NV01', 'Lê Minh', 'Vận hành', '22', '16500000'],
      ['NV02', 'Trần Hoa', 'Vận hành', '21', '15800000'],
      ['NV03', 'Phạm Tuấn', 'Kinh doanh (Đang ẩn)', '22', '24000000'],
      ['NV04', 'Hoàng Lan', 'Vận hành', '22', '17200000'],
      ['TỔNG ĐANG LỌC', '', 'Đang lọc: Vận hành', '', '?'],
    ],
    expectedDisplayValue: '49.500.000',
    canonicalFormula: '=SUBTOTAL(109, E2:E5)',
    acceptedFormulas: [
      '=SUBTOTAL(109, E2:E5)',
      '=SUBTOTAL(9, E2:E5)',
      '=SUBTOTAL(109, $E$2:$E$5)',
    ],
    hints: [
      'Cú pháp: `=SUBTOTAL(function_num, ref1)`.',
      'Mã `109` (hoặc `9`) đại diện cho phép `SUM` bỏ qua các dòng đang bị ẩn bởi Filter.',
    ],
    commonMistakes: [
      {
        pattern: /^=SUM\(/i,
        feedback: 'Bẫy báo cáo động: Hàm `SUM(E2:E5)` sẽ cộng luôn cả dòng NV03 đang bị ẩn bởi Filter (ra 73,5 triệu thay vì 49,5 triệu của riêng phòng Vận hành). Hãy dùng `=SUBTOTAL(109, E2:E5)`.',
      },
      {
        pattern: /SUBTOTAL\(103/i,
        feedback: 'Mã `103` là `COUNTA` (đếm số dòng hiển thị). Để tính tổng số tiền (`SUM`), hãy dùng mã `109`.',
      },
    ],
    explanation: 'Tuyệt vời! `=SUBTOTAL(109, E2:E5)` bỏ qua toàn bộ dòng bị ẩn (cả ẩn do Filter lẫn Hide Rows) và cộng đúng 3 nhân sự phòng Vận hành: 16,5tr + 15,8tr + 17,2tr = 49.500.000 đ.',
  },
  {
    id: 'lab-hro-a2',
    domain: 'hr_ops',
    level: 'Advanced',
    title: 'Tính Thu nhập tính thuế TNCN không âm bằng hàm MAX(0, ...)',
    businessContext: 'Khi tính Thuế TNCN hàng tháng, Thu nhập tính thuế = Tổng thu nhập chịu thuế (Cột C) trừ Giảm trừ bản thân 11 triệu (F2 = 11.000.000) trừ Số người phụ thuộc (Cột D) × 4,4 triệu (G2 = 4.400.000). Nếu kết quả âm thì Thu nhập tính thuế phải bằng 0 (không được âm!).',
    taskPrompt: 'Tại ô E2, hãy dùng hàm MAX(0, ...) để tính Thu nhập tính thuế (= C2 - $F$2 - D2*$G$2, nếu nhỏ hơn 0 thì lấy 0).',
    targetCell: 'E2',
    targetColumnIndex: 4,
    targetRowIndex: 0,
    headers: ['Mã NV (A)', 'Họ tên (B)', 'TN chịu thuế (C)', 'Số NPT (D)', 'TN tính thuế (E)', 'GT Bản thân (F)', 'GT 1 NPT (G)'],
    rows: [
      ['NV01', 'Trần Quốc Bảo', '16000000', '2', '?', '11000000', '4400000'],
      ['NV02', 'Lê Thị Hồng', '28000000', '1', '12.600.000', '', ''],
    ],
    expectedDisplayValue: '0',
    canonicalFormula: '=MAX(0, C2-$F$2-D2*$G$2)',
    acceptedFormulas: [
      '=MAX(0, C2-$F$2-D2*$G$2)',
      '=MAX(0, C2-F2-D2*G2)',
      '=IF(C2-$F$2-D2*$G$2>0, C2-$F$2-D2*$G$2, 0)',
      '=IF(C2-$F$2-D2*$G$2<=0, 0, C2-$F$2-D2*$G$2)',
    ],
    hints: [
      'Với NV01: Tổng giảm trừ = `11tr + 2 × 4,4tr = 19,8 triệu > 16 triệu` nên hiệu số là `-3.800.000`.',
      'Thay vì viết hàm `IF` dài dòng, người làm bảng lương chuyên nghiệp luôn dùng `=MAX(0, C2-$F$2-D2*$G$2)` để chặn sàn tại 0!',
    ],
    commonMistakes: [
      {
        pattern: /^=C2-\$?F\$?2-D2\*\$?G\$?2$/i,
        feedback: 'Bẫy âm thuế! Nếu không bọc `MAX(0, ...)` (hoặc `IF`), kết quả của NV01 sẽ ra `-3.800.000` dẫn đến tiền thuế TNCN bị tính âm (công ty bù tiền thuế sai quy định)!',
      },
      {
        pattern: /MIN\(0/i,
        feedback: 'Nhầm `MIN` và `MAX`: Để chặn giá trị sàn không nhỏ hơn 0 (nếu âm thì lấy 0, nếu dương thì lấy số dương), phải dùng `MAX(0, biểu_thức)`.',
      },
    ],
    explanation: 'Kỹ thuật C&B kinh điển! Dùng `=MAX(0, C2-$F$2-D2*$G$2)` vừa ngắn hơn hàm `IF` một nửa, vừa chặn hoàn toàn rủi ro phát sinh số âm trong bảng lương.',
  },
];

// ============================================================================
// BỘ BÀI TẬP THỰC HÀNH 4 MẢNG NGHIỆP VỤ TRONG TÀI LIỆU ÔN LUYỆN
// ============================================================================
export const DOMAIN_STUDY_EXERCISES: DomainStudyExercise[] = [
  // --- BASIC ---
  {
    domain: 'accounting',
    level: 'Basic',
    title: 'Chuẩn hóa Sổ theo dõi Công nợ & Hóa đơn đầu ra',
    scenario: 'Kế toán công nợ nhận file theo dõi hóa đơn bán ra từ phần mềm xuất sang Excel. Dữ liệu có mã khách hàng bị dư khoảng trắng, số tiền một số dòng bị lưu dạng chuỗi và cần tổng hợp nhanh công nợ theo trạng thái.',
    sampleHeaders: ['Số HĐ (A)', 'Ngày HĐ (B)', 'Mã KH (C)', 'Chi nhánh (D)', 'Trạng thái (E)', 'Số tiền (F)'],
    sampleRows: [
      ['HD-2026-001', '02/05/2026', ' KH001 ', 'Hà Nội', 'Quá hạn', '45.000.000'],
      ['HD-2026-002', '03/05/2026', 'KH002', 'TP.HCM', 'Đã thu', '18.500.000'],
      ['HD-2026-003', '04/05/2026', 'KH001', 'Hà Nội', 'Đang thu', '62.000.000'],
      ['HD-2026-004', '05/05/2026', '', 'Đà Nẵng', 'Quá hạn', '29.000.000'],
    ],
    tiers: {
      basic: 'Chuyển bảng thành Excel Table (`Ctrl + T`), dùng `COUNTA(A2:A5)` đếm tổng số hóa đơn và `IF(C2="", "Thiếu Mã KH", "Hợp lệ")` để bắt dòng quên nhập mã khách.',
      advanced: 'Tách năm xuất hóa đơn từ cột Số HĐ bằng `MID(A2, 4, 4)` và tính tổng công nợ đang ở trạng thái `"Quá hạn"` bằng `SUMIF(E:E, "Quá hạn", F:F)`.',
      realWorldTrap: 'Xử lý bẫy thực tế: Ô `C2` có khoảng trắng thừa (`" KH001 "`) khiến `SUMIF` theo mã khách hàng bị thiếu số tiền. Hãy tạo cột phụ `=UPPER(TRIM(C2))` và ép cột Số tiền bị lưu dạng text có dấu chấm về số bằng `=VALUE(SUBSTITUTE(F2, ".", ""))`.',
    },
    solutionFormulas: [
      { label: 'Làm sạch Mã KH', formula: '=UPPER(TRIM(C2))', note: 'Xóa khoảng trắng đầu/cuối và đồng bộ chữ in hoa' },
      { label: 'Bắt dòng thiếu Mã KH', formula: '=IF(TRIM(C2)="", "Thiếu Mã KH", "Đủ thông tin")', note: 'Chặn cả trường hợp ô chỉ chứa dấu cách' },
      { label: 'Tổng nợ Quá hạn', formula: '=SUMIF(E2:E100, "Quá hạn", F2:F100)', note: 'Chỉ cộng các dòng có trạng thái Quá hạn' },
    ],
  },
  {
    domain: 'sales',
    level: 'Basic',
    title: 'Quản lý Đơn hàng Đa kênh & Hiệu suất Sales',
    scenario: 'Sales Admin tổng hợp danh sách đơn hàng ngày từ 3 kênh (Showroom, Online, Đại lý). Cần kiểm tra đơn giá trị lớn, tra cứu đơn giá niêm yết và tính tỷ trọng doanh số từng nhân viên.',
    sampleHeaders: ['Mã đơn (A)', 'Kênh bán (B)', 'Mã SP (C)', 'Sales (D)', 'Số lượng (E)', 'Thành tiền (F)'],
    sampleRows: [
      ['ON-2026-101', 'Online', 'SP01', 'Minh', '10', '25.000.000'],
      ['SR-2026-102', 'Showroom', 'SP02', 'Lan', '25', '68.000.000'],
      ['DL-2026-103', 'Đại lý', 'SP01', 'Minh', '50', '115.000.000'],
      ['ON-2026-104', 'Online', 'SP03', 'Huy', '5', '12.000.000'],
    ],
    tiers: {
      basic: 'Dùng `LEFT(A2, 2)` để tách Mã kênh (`ON`, `SR`, `DL`), dùng `MAX(F2:F5)` và `AVERAGE(F2:F5)` để tìm đơn hàng kỷ lục và giá trị đơn trung bình (AOV).',
      advanced: 'Dùng `VLOOKUP(C2, DanhMuc!$A$2:$C$20, 3, 0)` để lấy Đơn giá chuẩn của sản phẩm và tính tổng doanh thu của nhân viên `"Minh"` bằng `SUMIF(D:D, "Minh", F:F)`.',
      realWorldTrap: 'Xử lý bẫy thực tế: Khi tính tỷ trọng doanh thu từng đơn `=F2/SUM($F$2:$F$5)`, nếu quên cố định `$F$2:$F$5` thì khi kéo công thức xuống các dòng dưới mẫu số bị trượt dẫn đến tổng tỷ trọng khác 100%.',
    },
    solutionFormulas: [
      { label: 'Tra cứu Đơn giá chuẩn', formula: '=VLOOKUP(C2, DanhMuc!$A$2:$C$20, 3, 0)', note: 'Khóa chặt vùng bảng danh mục bằng F4 ($)' },
      { label: 'Tỷ trọng doanh thu đơn', formula: '=F2/SUM($F$2:$F$100)', note: 'Giữ tử số tương đối, khóa mẫu số tuyệt đối' },
      { label: 'Đếm số đơn kênh Online', formula: '=COUNTIF(B2:B100, "Online")', note: 'Đếm số giao dịch phát sinh trên kênh Online' },
    ],
  },
  {
    domain: 'inventory',
    level: 'Basic',
    title: 'Kiểm soát Nhập - Xuất - Tồn & Chuẩn hóa Mã Vật tư (SKU)',
    scenario: 'Thủ kho cập nhật bảng theo dõi vật tư hàng ngày. Mã lô hàng đang ghép chung Nhóm hàng - Kho - Năm nhập, một số mã vật tư bị nhập lặp cần phát hiện trước khi khóa sổ kho.',
    sampleHeaders: ['Mã Lô SKU (A)', 'Tên vật tư (B)', 'Tồn đầu (C)', 'Nhập (D)', 'Xuất (E)', 'Định mức Min (F)'],
    sampleRows: [
      ['RAW-WH1-2026', 'Hạt nhựa nguyên sinh', '500', '200', '620', '100'],
      ['PKG-WH2-2026', 'Màng co PE cuộn', '150', '300', '180', '120'],
      ['RAW-WH1-2026', 'Hạt nhựa nguyên sinh (Trùng)', '500', '50', '0', '100'],
      ['CHM-WH3-2025', 'Phụ gia chống ẩm', '80', '0', '75', '30'],
    ],
    tiers: {
      basic: 'Tính cột Tồn cuối kỳ `=C2+D2-E2` và dùng `IF(C2+D2-E2<=F2, "Cần mua hàng", "An toàn")` để cảnh báo vật tư chạm đáy tồn kho tối thiểu.',
      advanced: 'Tách Mã nhóm vật tư (3 ký tự đầu) bằng `LEFT(A2, 3)`, Mã kho (3 ký tự giữa) bằng `MID(A2, 5, 3)` và Năm nhập lô (4 ký tự cuối) bằng `RIGHT(A2, 4)`.',
      realWorldTrap: 'Xử lý bẫy thực tế: Phát hiện mã lô bị nhập trùng bằng `=IF(COUNTIF($A$2:$A$100, A2)>1, "Mã bị lặp!", "OK")`. Lưu ý hàm `RIGHT(A2, 4)` trả về năm `"2025"` ở dạng Text, nên nếu so sánh `< 2026` phải viết `=VALUE(RIGHT(A2, 4))<2026`.',
    },
    solutionFormulas: [
      { label: 'Cảnh báo chạm ROP (Min)', formula: '=IF((C2+D2-E2)<=F2, "Cần mua hàng", "An toàn")', note: 'Tồn cuối = Tồn đầu + Nhập - Xuất' },
      { label: 'Tách Mã Kho ở giữa', formula: '=MID(A2, 5, 3)', note: 'Lấy 3 ký tự bắt đầu từ vị trí thứ 5' },
      { label: 'Kiểm tra Lô sản xuất cũ', formula: '=IF(VALUE(RIGHT(A2, 4))<2026, "Hàng tồn năm cũ", "Lô mới")', note: 'Dùng VALUE chuyển kết quả hàm RIGHT sang số' },
    ],
  },
  {
    domain: 'hr_ops',
    level: 'Basic',
    title: 'Rà soát Bảng chấm công & Danh sách Nhân sự',
    scenario: 'HR Admin nhận bảng chấm công tổng hợp từ các trưởng ca gửi về. Cần kiểm tra mã nhân viên nhập sai quy cách, đếm tổng số nhân sự đi làm và tính tổng quỹ công khi lọc theo bộ phận.',
    sampleHeaders: ['Mã NV (A)', 'Họ và tên (B)', 'Bộ phận (C)', 'Ca làm việc (D)', 'Ngày công (E)', 'Giờ tăng ca (F)'],
    sampleRows: [
      ['NV0012', 'Nguyễn Văn An', 'Sản xuất', 'Ca 1', '26', '14'],
      ['NV08', 'Lê Thị Bình', 'KCS', 'Ca 2', '24', '8'],
      ['NV0019', 'Phạm Quốc Cường', 'Sản xuất', 'Ca 1', '22', '0'],
      ['NV0025', 'Hoàng Thanh Dung', 'Kho vận', 'Hành chính', '26', '6'],
    ],
    tiers: {
      basic: 'Dùng `COUNTA(A2:A5)` đếm tổng quân số, `SUM(F2:F5)` tính tổng giờ tăng ca (OT) và tạo khóa ghép `Mã NV - Bộ phận` bằng `=A2&" - "&C2`.',
      advanced: 'Kiểm tra quy cách Mã NV bắt buộc đủ 6 ký tự bằng `=IF(LEN(TRIM(A2))=6, "Hợp lệ", "Sai quy cách mã")` và tính tổng giờ OT của bộ phận `"Sản xuất"` bằng `SUMIF`.',
      realWorldTrap: 'Xử lý bẫy thực tế: Khi bật Filter lọc riêng `"Ca 1"`, hàm `=SUM(E2:E100)` vẫn cộng cả ngày công của Ca 2 và Hành chính đang bị ẩn. Phải dùng `=SUBTOTAL(109, E2:E100)` để chỉ cộng các dòng đang hiển thị.',
    },
    solutionFormulas: [
      { label: 'Kiểm tra độ dài Mã NV', formula: '=IF(LEN(TRIM(A2))=6, "Hợp lệ", "Sai quy cách mã")', note: 'Kết hợp TRIM để tránh đếm nhầm dấu cách thừa' },
      { label: 'Tổng ngày công theo Bộ phận', formula: '=SUMIF(C2:C100, "Sản xuất", E2:E100)', note: 'Cộng cột Ngày công theo điều kiện Bộ phận' },
      { label: 'Tổng động khi bật Filter', formula: '=SUBTOTAL(109, E2:E100)', note: 'Mã 109 bỏ qua toàn bộ dòng bị ẩn khi lọc' },
    ],
  },

  // --- INTERMEDIATE ---
  {
    domain: 'accounting',
    level: 'Intermediate',
    title: 'Phân tích Tuổi nợ (Aging Schedule) & Kiểm soát Hạn mức Tín dụng',
    scenario: 'Kế toán công nợ phải lập báo cáo phân tích tuổi nợ cuối kỳ. Cần tra cứu hạn mức tín dụng của từng khách hàng, tính số ngày quá hạn thực tế và phân nhóm tỷ lệ trích lập dự phòng phải thu khó đòi.',
    sampleHeaders: ['Số HĐ (A)', 'Mã KH (B)', 'Ngày xuất HĐ (C)', 'Ngày đáo hạn (D)', 'Dư nợ (E)', 'Hạn mức KH (F)'],
    sampleRows: [
      ['VAT-01', 'KH101', '15/01/2026', '28/02/2026', '180.000.000', '150.000.000'],
      ['VAT-02', 'KH102', '10/03/2026', '30/04/2026', '65.000.000', '100.000.000'],
      ['VAT-03', 'KH103', '20/04/2026', '31/05/2026', '92.000.000', '80.000.000'],
      ['VAT-04', 'KH101', '05/04/2026', '31/05/2026', '40.000.000', '150.000.000'],
    ],
    tiers: {
      basic: 'Dùng `EOMONTH(C2, 1)` tính Ngày đáo hạn (cuối tháng kế tiếp) và dùng `XLOOKUP(B2, MasterKH[MaKH], MasterKH[HanMuc], 0)` lấy Hạn mức tín dụng.',
      advanced: 'Tính số ngày quá hạn so với ngày khóa sổ (`$H$1`) bằng `=MAX(0, $H$1 - D2)`, sau đó dùng `IFS` phân nhóm tuổi nợ: `>90` ngày ("Nợ nhóm 4"), `>30` ngày ("Nợ nhóm 3"), `>0` ngày ("Quá hạn nhẹ"), còn lại `"Trong hạn"`.',
      realWorldTrap: 'Bẫy kiểm soát hạn mức tổng: Một khách hàng (`KH101`) có nhiều hóa đơn chưa thanh toán. Nếu chỉ so sánh từng hóa đơn `E2 > F2` sẽ bỏ sót trường hợp mỗi hóa đơn đều nhỏ hơn hạn mức nhưng TỔNG dư nợ của khách đó vượt hạn mức! Phải dùng `=IF(SUMIFS($E$2:$E$100, $B$2:$B$100, B2) > F2, "Vượt tổng hạn mức!", "Trong hạn mức")`.',
    },
    solutionFormulas: [
      { label: 'Tính số ngày quá hạn', formula: '=MAX(0, TODAY() - D2)', note: 'Hàm MAX(0, ...) giúp các hóa đơn chưa đến hạn trả về 0 thay vì số âm' },
      { label: 'Phân nhóm tuổi nợ bằng IFS', formula: '=IFS(G2>90, "Quá hạn >90N", G2>30, "Quá hạn 31-90N", G2>0, "Quá hạn 1-30N", TRUE, "Trong hạn")', note: 'Luôn xét từ mốc số ngày lớn nhất xuống nhỏ nhất' },
      { label: 'Kiểm tra Vượt tổng hạn mức KH', formula: '=IF(SUMIFS($E$2:$E$100, $B$2:$B$100, B2)>F2, "Chặn xuất hàng", "Cho phép")', note: 'Cộng dồn toàn bộ dư nợ của Mã KH tại B2 trước khi so với hạn mức F2' },
    ],
  },
  {
    domain: 'sales',
    level: 'Intermediate',
    title: 'Tính Hoa hồng Bậc thang, Xếp hạng Sales & Dashboard Động 365',
    scenario: 'Trưởng phòng Kinh doanh cần chốt bảng thưởng doanh số tháng cho đội ngũ Sales theo khu vực và kênh bán, đồng thời tạo bảng trích xuất tự động các giao dịch vượt 50 triệu.',
    sampleHeaders: ['Mã đơn (A)', 'Khu vực (B)', 'Kênh bán (C)', 'Sales Owner (D)', 'Doanh thu (E)', 'Tỷ lệ đạt KPI (F)'],
    sampleRows: [
      ['SO-501', 'Miền Bắc', 'B2B', 'Lan', '145.000.000', '118%'],
      ['SO-502', 'Miền Nam', 'Online', 'Minh', '62.000.000', '94%'],
      ['SO-503', 'Miền Bắc', 'B2B', 'Lan', '88.000.000', '118%'],
      ['SO-504', 'Miền Trung', 'Đại lý', 'Huy', '195.000.000', '135%'],
    ],
    tiers: {
      basic: 'Dùng `SUMIFS` tính doanh thu của từng Sales theo từng Kênh bán, và dùng `RANK.EQ(E2, $E$2:$E$100, 0)` để xếp hạng giá trị đơn hàng từ cao xuống thấp.',
      advanced: 'Dùng hàm mảng động `=SORT(FILTER(A2:F100, (B2:B100="Miền Bắc")*(E2:E100>=50000000), "Không có đơn"), 5, -1)` để trích xuất và sắp xếp giảm dần các đơn lớn tại Miền Bắc.',
      realWorldTrap: 'Bẫy tra cứu giá theo 2 điều kiện (Mã SP + Kênh bán): Khi bảng giá quy định kênh B2B và kênh Online có giá khác nhau cho cùng 1 sản phẩm, dùng `VLOOKUP` 1 khóa sẽ lấy sai giá. Hãy dùng `=XLOOKUP(A2&C2, BangGia[MaSP]&BangGia[Kenh], BangGia[DonGia])`.',
    },
    solutionFormulas: [
      { label: 'Lọc & Sắp xếp Top đơn hàng', formula: '=SORT(FILTER(A2:F100, (B2:B100="Miền Bắc")*(E2:E100>=50000000), "Trống"), 5, -1)', note: 'Dùng dấu nhân (*) đại diện cho điều kiện AND trong hàm FILTER' },
      { label: 'Xếp loại thưởng KPI bằng IFS', formula: '=IFS(F2>=120%, "Thưởng 150%", F2>=100%, "Thưởng 100%", F2>=85%, "Thưởng 50%", TRUE, "Không thưởng")', note: 'Phân tầng mức thưởng rõ ràng không cần IF lồng nhau' },
      { label: 'Xếp hạng doanh số', formula: '=RANK.EQ(E2, $E$2:$E$100, 0)', note: 'Cố định vùng $E$2:$E$100 và dùng tham số 0 (giảm dần)' },
    ],
  },
  {
    domain: 'inventory',
    level: 'Intermediate',
    title: 'Kiểm soát Hạn sử dụng (FEFO), Tuổi hàng tồn kho & Đa kho',
    scenario: 'Quản lý kho dược phẩm/FMCG cần theo dõi hạn sử dụng (Shelf-life) của từng lô hàng theo nguyên tắc FEFO (First Expired, First Out - Hết hạn trước xuất trước) và tra cứu giá vốn theo kho vùng.',
    sampleHeaders: ['Mã SKU (A)', 'Số Lô (B)', 'Ngày SX (C)', 'Hạn dùng - tháng (D)', 'Ngày hết hạn (E)', 'Tồn kho (F)'],
    sampleRows: [
      ['SKU-MILK01', 'LOT-01', '15/06/2025', '12', '15/06/2026', '450'],
      ['SKU-MILK01', 'LOT-02', '20/11/2025', '12', '20/11/2026', '800'],
      ['SKU-VITC05', 'LOT-09', '10/05/2024', '24', '10/05/2026', '120'],
      ['SKU-OATS02', 'LOT-04', '01/03/2025', '18', '01/09/2026', '310'],
    ],
    tiers: {
      basic: 'Dùng `EDATE(C2, D2)` để tính chính xác Ngày hết hạn (cộng thêm số tháng hạn dùng vào Ngày sản xuất) và tính số ngày còn lại bằng `=E2 - TODAY()`.',
      advanced: 'Phân loại trạng thái Lô hàng bằng `IFS`: Nếu `E2 <= TODAY()` là `"Hết hạn - Khóa xuất"`, nếu `E2 - TODAY() <= 45` là `"Cận date - Ưu tiên xả"`, còn lại `"Bình thường"`.',
      realWorldTrap: 'Bẫy chất lượng dữ liệu kiểm kê: Trước khi chốt báo cáo tồn kho, dùng `=IF(COUNTBLANK(A2:F2)>0, "Thiếu thông tin lô", IF(F2<0, "Lỗi âm kho!", "Hợp lệ"))` để bắt ngay các dòng quên nhập hạn dùng hoặc xuất khống dẫn đến tồn kho âm.',
    },
    solutionFormulas: [
      { label: 'Tính Ngày hết hạn chuẩn', formula: '=EDATE(C2, D2)', note: 'EDATE cộng chính xác số tháng D2 vào ngày sản xuất C2' },
      { label: 'Cảnh báo hàng Cận Date (FEFO)', formula: '=IFS(E2<=TODAY(), "Hết hạn - Khóa lô", E2-TODAY()<=45, "Cận date (<45N)", TRUE, "Đạt chuẩn")', note: 'Giúp kho ưu tiên xuất lô sắp hết hạn trước' },
      { label: 'Lọc danh sách lô Cận Date', formula: '=FILTER(A2:F100, (E2:E100-TODAY()<=45)*(F2:F100>0), "Không có lô cận date")', note: 'Chỉ lọc các lô còn tồn kho (>0) và còn dưới 45 ngày hạn dùng' },
    ],
  },
  {
    domain: 'hr_ops',
    level: 'Intermediate',
    title: 'Kiểm soát SLA Vận hành Đa ca & Theo dõi Hợp đồng Lao động',
    scenario: 'Giám sát Vận hành & HR cần đo lường tỷ lệ xử lý ticket đúng cam kết SLA (không tính ngày nghỉ cuối tuần/lễ) và tự động cảnh báo các hợp đồng lao động sắp hết hạn trong vòng 30 ngày tới.',
    sampleHeaders: ['Mã HS/Ticket (A)', 'Nhân sự/Owner (B)', 'Ca trực (C)', 'Ngày bắt đầu (D)', 'Ngày kết thúc (E)', 'Định mức SLA (F)'],
    sampleRows: [
      ['TK-9001', 'Ngọc Lan', 'Ca Sáng', '28/04/2026', '04/05/2026', '3'],
      ['TK-9002', 'Minh Tuấn', 'Ca Chiều', '04/05/2026', '08/05/2026', '3'],
      ['TK-9003', 'Hoàng Hải', 'Ca Đêm', '05/05/2026', '06/05/2026', '2'],
      ['TK-9004', 'Ngọc Lan', 'Ca Sáng', '06/05/2026', '', '2'],
    ],
    tiers: {
      basic: 'Dùng `NETWORKDAYS(D2, E2, DanhSachLe)` tính số ngày làm việc thực tế của các ticket đã đóng và dùng `COUNTIFS` đếm số ticket theo từng Ca trực.',
      advanced: 'Với các ticket chưa đóng (ô `E2` đang trống), dùng `=NETWORKDAYS(D2, IF(E2="", TODAY(), E2), DanhSachLe)` để tính số ngày ngâm hồ sơ tính đến hôm nay và gắn nhãn `"Đúng SLA"` / `"Quá hạn SLA"`.',
      realWorldTrap: 'Bẫy bỏ trống ngày hoàn tất: Nếu viết thẳng `=NETWORKDAYS(D2, E2)` khi ô `E2` đang trống (ticket chưa xong), Excel sẽ coi `E2` là ngày `00/01/1900` và trả về số âm hàng chục nghìn ngày! Bắt buộc phải bọc `IF(E2="", TODAY(), E2)`.',
    },
    solutionFormulas: [
      { label: 'Tính ngày xử lý (kể cả ticket mở)', formula: '=NETWORKDAYS(D2, IF(E2="", TODAY(), E2), $H$2:$H$10)', note: 'Nếu E2 trống thì lấy TODAY() để đo thời gian tồn đọng hiện tại' },
      { label: 'Đánh giá trạng thái SLA', formula: '=IFS(E2="", "Đang xử lý", G2<=F2, "Đạt SLA", TRUE, "Vi phạm SLA")', note: 'Phân biệt rõ ticket đang mở, đạt SLA và trễ SLA' },
      { label: 'Cảnh báo Hợp đồng sắp hết hạn', formula: '=IF(AND(E2>=TODAY(), E2-TODAY()<=30), "Cần tái ký (<30N)", "Bình thường")', note: 'Nhắc HR chuẩn bị đánh giá tái ký hợp đồng trước 30 ngày' },
    ],
  },

  // --- ADVANCED ---
  {
    domain: 'accounting',
    level: 'Advanced',
    title: 'Đối soát Sao kê Ngân hàng bằng Power Query & Mô hình Định giá DCF/WACC',
    scenario: 'Kế toán tổng hợp cần tự động hóa việc đối chiếu 10.000 dòng sao kê ngân hàng với sổ cái TK 112 mỗi tháng bằng Power Query, đồng thời bộ phận Tài chính cần dựng mô hình DCF và bảng độ nhạy WACC.',
    sampleHeaders: ['Mã Tham chiếu (A)', 'Ngày GD (B)', 'Số tiền Sao kê (C)', 'Số tiền Sổ cái (D)', 'Chênh lệch (E)', 'Trạng thái Đối soát (F)'],
    sampleRows: [
      ['REF-2026-01', '05/05/2026', '125.000.000', '125.000.000', '0', 'Khớp đúng'],
      ['REF-2026-02', '05/05/2026', '-330.000', '0', '-330.000', 'Sao kê có - Sổ chưa hạch toán'],
      ['REF-2026-03', '06/05/2026', '84.500.000', '85.400.000', '-900.000', 'Lệch số tiền (Nhập đảo số)'],
      ['REF-2026-04', '06/05/2026', '0', '-15.000.000', '15.000.000', 'UNC đã lập - NH chưa trừ tiền'],
    ],
    tiers: {
      basic: 'Trong Power Query, chuẩn hóa khóa `Text.Upper(Text.Trim([Mã Tham chiếu]))`, dùng `try Number.FromText([Số tiền]) otherwise 0` xử lý dòng lỗi và dùng `Left Anti Join` tách các giao dịch ngân hàng chưa hạch toán.',
      advanced: 'Dựng dòng tiền tự do `FCFF = EBIT*(1 - Thuế suất) + Khấu hao - Capex - Delta NWC`, tính `WACC = (E/V)*Re + (D/V)*Rd*(1 - T)` và tính giá trị hiện tại ròng theo ngày thực tế bằng `=XNPV(WACC, Values, Dates)`.',
      realWorldTrap: 'Bẫy đối soát & tài chính: (1) Trong Power Query, hàm M phân biệt chữ hoa/thường (`"ref-01" <> "REF-01"`), nếu không `Text.Upper` trước khi Merge sẽ báo lệch giả. (2) Trong Excel, `NPV` chiết khấu ngay đối số đầu tiên còn `XNPV` chiết khấu theo đúng ngày đầu tiên (t=0 không bị chiết khấu).',
    },
    solutionFormulas: [
      { label: 'Power Query xử lý số tiền bẩn', formula: 'try Number.FromText(Text.Replace([Số tiền], ".", "")) otherwise 0', note: 'Chống gãy query khi sao kê lẫn dòng chữ N/A hoặc dấu chấm' },
      { label: 'Chiết khấu dòng tiền ngày thực tế', formula: '=XNPV($B$1, C2:C10, B2:B10)', note: 'Dùng XNPV thay cho NPV khi ngày giải ngân và thu hồi vốn không cách đều năm' },
      { label: 'Tính khoản trả góp vay ngân hàng', formula: '=PMT(LaiSuatNam/12, SoNam*12, -SoTienVay)', note: 'Nhớ chia lãi suất năm cho 12 và đổi số năm ra tổng số tháng' },
    ],
  },
  {
    domain: 'sales',
    level: 'Advanced',
    title: 'Gộp 12 File Doanh số Chi nhánh bằng Power Query & VBA Tách Báo cáo tự động',
    scenario: 'Sales Admin nhận 12 file Excel báo cáo doanh số từ 12 chi nhánh gửi về một thư mục chung, nhiều file đang để dữ liệu trải ngang theo 12 cột tháng. Sau khi tổng hợp xong cần tách ngược thành từng file PDF gửi riêng cho từng Giám đốc vùng.',
    sampleHeaders: ['Chi nhánh (A)', 'Kênh bán (B)', 'Tháng 01 (C)', 'Tháng 02 (D)', 'Tháng 03 (E)', 'Sau Unpivot -> Kỳ & Doanh thu (F)'],
    sampleRows: [
      ['Hà Nội', 'Online', '420.000.000', '465.000.000', '510.000.000', '3 dòng dọc chuẩn Fact Table'],
      ['TP.HCM', 'Online', '610.000.000', '590.000.000', '680.000.000', '3 dòng dọc chuẩn Fact Table'],
      ['Đà Nẵng', 'Retail', '210.000.000', '235.000.000', '260.000.000', '3 dòng dọc chuẩn Fact Table'],
    ],
    tiers: {
      basic: 'Dùng `Get Data > From Folder` để gộp tự động toàn bộ file chi nhánh, sau đó chọn cột `Chi nhánh` và `Kênh bán` rồi bấm `Unpivot Other Columns` để xoay 12 cột tháng thành 2 cột `Kỳ` và `Doanh thu`.',
      advanced: 'Viết hàm M tách chuỗi mã đơn đa tầng bằng `Text.BeforeDelimiter` / `Text.AfterDelimiter` và dùng `Table.Group` gom tổng doanh số theo `Chi nhánh` + `Kỳ`.',
      realWorldTrap: 'Bẫy gộp file thực tế: Khi một chi nhánh đang mở file hoặc đổi tên cột `"Doanh thu"` thành `"Thành tiền"`, query `From Folder` sẽ báo lỗi `Column not found`. Cần tách kiến trúc `raw_ -> stg_ -> fact_` và dùng `Table.RemoveColumns(..., MissingField.Ignore)` để chống vỡ pipeline.',
    },
    solutionFormulas: [
      { label: 'M Code xoay bảng ngang thành dọc', formula: 'Table.UnpivotOtherColumns(Source, {"Chi nhánh", "Kênh bán"}, "Kỳ", "Doanh thu")', note: 'Giữ cố định cột khóa, tự động nhận diện khi có thêm cột Tháng 04, Tháng 05...' },
      { label: 'M Code gộp mọi Table trong Workbook', formula: 'Table.Combine(Table.SelectRows(Excel.CurrentWorkbook(), each Text.StartsWith([Name], "tbl_"))[Content])', note: 'Chỉ gộp các bảng bắt đầu bằng tbl_ để tránh gộp nhầm bảng kết quả của chính Power Query' },
      { label: 'VBA xuất báo cáo PDF tự động', formula: 'ws.ExportAsFixedFormat Type:=xlTypePDF, Filename:=ThisWorkbook.Path & "\\output\\" & ws.Name & ".pdf"', note: 'Tự động xuất PDF theo tên từng sheet chi nhánh' },
    ],
  },
  {
    domain: 'inventory',
    level: 'Advanced',
    title: 'Đối soát Kiểm kê Kho bằng Power Query Merge & Tự động hóa Thẻ kho VBA',
    scenario: 'Cuối quý, bộ phận Kho vận phải đối chiếu Tồn kho trên phần mềm ERP với Biên bản kiểm kê thực tế tại 5 kho vùng để tìm mã hàng thừa/thiếu, đồng thời dùng VBA tự động xuất biên bản kiểm kê từng kho.',
    sampleHeaders: ['Mã SKU (A)', 'Mã Kho (B)', 'Tồn ERP (C)', 'Kiểm kê Thực tế (D)', 'Chênh lệch (E)', 'Phân tích Nguyên nhân (F)'],
    sampleRows: [
      ['SKU-101', 'WH-HN', '500', '492', '-8', 'Thiếu hàng (Hao hụt / Xuất chưa lập phiếu)'],
      ['SKU-102', 'WH-HN', '0', '25', '+25', 'Có thực tế nhưng chưa nhập ERP (Right Anti)'],
      ['SKU-103', 'WH-HCM', '1.200', '1.200', '0', 'Khớp hoàn toàn (Inner Join)'],
      ['SKU-104', 'WH-DN', '80', '0', '-80', 'Có trên ERP nhưng kho thực tế = 0 (Left Anti)'],
    ],
    tiers: {
      basic: 'Trong Power Query, chuẩn hóa `Mã SKU` + `Mã Kho` ở cả 2 bảng, sau đó dùng `Merge Queries` với khóa kép `{"Mã SKU", "Mã Kho"}` để đối chiếu số lượng.',
      advanced: 'Sử dụng `Full Outer Join` để lấy toàn bộ mặt hàng có trên ERP hoặc có tại kho thực tế, thay thế `null` bằng `0` và tính cột `Chênh lệch = [Kiểm kê Thực tế] - [Tồn ERP]`.',
      realWorldTrap: 'Bẫy Merge khóa đơn: Nếu chỉ Merge theo một cột `Mã SKU` mà quên chọn đồng thời cột `Mã Kho`, mỗi dòng SKU ở Kho Hà Nội sẽ bị nhân bản (Cartesian product) với Kho TP.HCM và Đà Nẵng làm tổng tồn kho bị phình gấp 3 lần!',
    },
    solutionFormulas: [
      { label: 'M Code chuẩn hóa Mã SKU đủ 6 ký tự', formula: 'Text.PadStart(Text.Trim(Text.From([Mã SKU])), 6, "0")', note: 'Biến mã "105" bị mất số 0 đầu thành "000105" trước khi đối soát' },
      { label: 'M Code Join khóa kép (SKU + Kho)', formula: 'Table.NestedJoin(stg_ERP, {"Mã SKU", "Mã Kho"}, stg_KiemKe, {"Mã SKU", "Mã Kho"}, "KiemKe", JoinKind.FullOuter)', note: 'Ghép đồng thời theo cả Mã SKU và Mã Kho để chống nhân bản dòng' },
      { label: 'VBA tìm dòng cuối bảng động', formula: 'lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row', note: 'Luôn quét từ đáy sheet ngược lên để không bị dừng ở dòng trống giữa bảng' },
    ],
  },
  {
    domain: 'hr_ops',
    level: 'Advanced',
    title: 'Làm sạch Bảng chấm công Máy vân tay bằng Power Query & VBA Gửi Phiếu lương',
    scenario: 'Máy chấm công vân tay xuất ra file dữ liệu thô bị gộp tên bộ phận thành từng cụm dòng trống bên dưới, giờ vào/ra bị lẫn chữ "Nghỉ phép" và cuối tháng HR cần tách 200 phiếu lương gửi email Outlook tự động.',
    sampleHeaders: ['Bộ phận - cần Fill Down (A)', 'Mã NV (B)', 'Ngày chấm (C)', 'Giờ Vào - Ra (D)', 'Số công quy đổi (E)', 'Trạng thái xử lý (F)'],
    sampleRows: [
      ['Khối Sản xuất', 'NV001', '02/05/2026', '07:55 - 17:05', '1.0', 'Đã chuẩn hóa'],
      ['null (cần Fill Down)', 'NV002', '02/05/2026', 'Nghỉ phép', '1.0 (Công phép)', 'Xử lý try...otherwise'],
      ['Khối Vận hành', 'NV003', '02/05/2026', '08:25 - 17:00', '0.85', 'Đi muộn 25 phút'],
    ],
    tiers: {
      basic: 'Dùng `Table.FillDown` trong Power Query để lấp đầy tên Bộ phận cho các dòng `null` bên dưới, và dùng `Split Column by Delimiter (" - ")` để tách Giờ vào và Giờ ra.',
      advanced: 'Dùng `try Time.FromText([Giờ Vào]) otherwise null` để không bị gãy query khi gặp chữ `"Nghỉ phép"` hoặc `"Công tác"`, sau đó dùng `Table.Group` tổng hợp tổng công và tổng phút đi muộn theo từng `Mã NV`.',
      realWorldTrap: 'Bẫy VBA gửi phiếu lương: Khi viết macro tách file và gửi Outlook hàng loạt, nếu quên bọc `SafeModeStart` (`ScreenUpdating = False`, `Calculation = xlCalculationManual`) và quên dùng `.Display` kiểm thử trước khi `.Send`, macro vừa chạy cực chậm vừa có nguy cơ gửi nhầm phiếu lương của người A sang email người B!',
    },
    solutionFormulas: [
      { label: 'M Code lấp đầy tên Bộ phận', formula: 'Table.FillDown(Source, {"Bộ phận"})', note: 'Điền giá trị Bộ phận từ dòng tiêu đề nhóm xuống các dòng null phía dưới' },
      { label: 'M Code bắt lỗi giờ chấm công', formula: 'try Time.FromText([Giờ Vào]) otherwise null', note: 'Giúp dòng ghi chữ "Nghỉ phép" trả về null an toàn thay vì báo DataFormat.Error' },
      { label: 'VBA tăng tốc & khóa màn hình', formula: 'Application.ScreenUpdating = False : Application.Calculation = xlCalculationManual', note: 'Tăng tốc độ chạy macro tách 200 phiếu lương lên gấp 10-20 lần' },
    ],
  },
];
