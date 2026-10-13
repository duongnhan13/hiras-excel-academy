import { Level, Question } from './excelData';
import { PracticeDomain, PRACTICE_DOMAINS } from './practiceLabData';

export interface DomainVariantSpec {
  scenario: string;
  sampleTable: {
    headers: string[];
    rows: string[][];
  };
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface MultiDomainTopic {
  topicTitle: string;
  domains: Record<PracticeDomain, DomainVariantSpec>;
}

// Helper to build a rich 4-domain topic where each domain has its own table, scenario, and realistic distractors
interface ParametricDomainData {
  contextName: string;
  docHeader: string;
  docSamples: [string, string, string];
  groupHeader: string;
  groupTarget: string;
  groupOther: string;
  subGroupHeader: string;
  subGroupTarget: string;
  subGroupOther: string;
  statusHeader: string;
  statusAlert: string;
  statusNormal: string;
  ownerHeader: string;
  ownerTarget: string;
  ownerOther: string;
  amountHeader: string;
  amounts: [string, string, string];
  thresholdNum: number;
  thresholdLabel: string;
  codePrefix: string;
  codeMid: string;
  codeSuffix: string;
  masterSheet: string;
  masterKeyHeader: string;
  masterValHeader: string;
  daysHeader: string;
  dirtyNumberSample: string;
}

const DOMAIN_PROFILES: Record<PracticeDomain, ParametricDomainData> = {
  accounting: {
    contextName: 'Sổ chi tiết công nợ phải thu (TK 131)',
    docHeader: 'Số HĐ (A)',
    docSamples: ['VAT-2026-HN01', 'VAT-2026-SG02', 'VAT-2026-HN03'],
    groupHeader: 'Chi nhánh (B)',
    groupTarget: 'Hà Nội',
    groupOther: 'TP.HCM',
    subGroupHeader: 'Loại HĐ (C)',
    subGroupTarget: 'Bán buôn',
    subGroupOther: 'Bán lẻ',
    statusHeader: 'Trạng thái nợ (F)',
    statusAlert: 'Quá hạn',
    statusNormal: 'Trong hạn',
    ownerHeader: 'Kế toán phụ trách (D)',
    ownerTarget: 'Lan',
    ownerOther: 'Minh',
    amountHeader: 'Dư nợ (E)',
    amounts: ['65.000.000', '28.500.000', '84.000.000'],
    thresholdNum: 50000000,
    thresholdLabel: '50 triệu đồng',
    codePrefix: 'VAT',
    codeMid: '2026',
    codeSuffix: 'HN01',
    masterSheet: 'DM_KhachHang',
    masterKeyHeader: 'Mã KH',
    masterValHeader: 'Hạn mức nợ',
    daysHeader: 'Ngày quá hạn (G)',
    dirtyNumberSample: '65.000.000',
  },
  sales: {
    contextName: 'Báo cáo doanh số đơn hàng đa kênh',
    docHeader: 'Mã đơn (A)',
    docSamples: ['ORD-2026-MB01', 'ORD-2026-MN02', 'ORD-2026-MB03'],
    groupHeader: 'Khu vực (B)',
    groupTarget: 'Miền Bắc',
    groupOther: 'Miền Nam',
    subGroupHeader: 'Kênh bán (C)',
    subGroupTarget: 'Sàn TMĐT',
    subGroupOther: 'Showroom',
    statusHeader: 'Trạng thái đơn (F)',
    statusAlert: 'Hoàn hủy',
    statusNormal: 'Hoàn tất',
    ownerHeader: 'Sales Owner (D)',
    ownerTarget: 'Tuấn',
    ownerOther: 'Hương',
    amountHeader: 'Doanh thu (E)',
    amounts: ['42.000.000', '19.500.000', '58.000.000'],
    thresholdNum: 30000000,
    thresholdLabel: '30 triệu đồng',
    codePrefix: 'ORD',
    codeMid: '2026',
    codeSuffix: 'MB01',
    masterSheet: 'DM_BangGia',
    masterKeyHeader: 'Mã SP',
    masterValHeader: 'Đơn giá niêm yết',
    daysHeader: 'Số ngày giao (G)',
    dirtyNumberSample: '42.000.000',
  },
  inventory: {
    contextName: 'Thẻ kho Xuất - Nhập - Tồn vật tư',
    docHeader: 'Mã phiếu (A)',
    docSamples: ['PNK-2026-WH01', 'PXK-2026-WH02', 'PNK-2026-WH03'],
    groupHeader: 'Kho lưu trữ (B)',
    groupTarget: 'Kho Tổng Bắc',
    groupOther: 'Kho Tổng Nam',
    subGroupHeader: 'Nhóm vật tư (C)',
    subGroupTarget: 'Linh kiện điện',
    subGroupOther: 'Bao bì đóng gói',
    statusHeader: 'Cảnh báo tồn (F)',
    statusAlert: 'Chạm ROP',
    statusNormal: 'An toàn',
    ownerHeader: 'Thủ kho (D)',
    ownerTarget: 'Hải',
    ownerOther: 'Đức',
    amountHeader: 'Giá trị tồn (E)',
    amounts: ['120.000.000', '45.000.000', '165.000.000'],
    thresholdNum: 100000000,
    thresholdLabel: '100 triệu đồng',
    codePrefix: 'PNK',
    codeMid: '2026',
    codeSuffix: 'WH01',
    masterSheet: 'DM_VatTu',
    masterKeyHeader: 'Mã SKU',
    masterValHeader: 'Đơn giá vốn',
    daysHeader: 'Tuổi tồn kho (G)',
    dirtyNumberSample: '120.000.000',
  },
  hr_ops: {
    contextName: 'Bảng tổng hợp chấm công - lương & SLA vận hành',
    docHeader: 'Mã hồ sơ (A)',
    docSamples: ['HRO-2026-CA01', 'HRO-2026-CA02', 'HRO-2026-CA03'],
    groupHeader: 'Khối vận hành (B)',
    groupTarget: 'Khối Sản xuất',
    groupOther: 'Khối Văn phòng',
    subGroupHeader: 'Ca làm việc (C)',
    subGroupTarget: 'Ca Đêm',
    subGroupOther: 'Ca Ngày',
    statusHeader: 'Trạng thái SLA (F)',
    statusAlert: 'Trễ SLA',
    statusNormal: 'Đạt SLA',
    ownerHeader: 'Giám sát ca (D)',
    ownerTarget: 'Ngọc',
    ownerOther: 'Khoa',
    amountHeader: 'Quỹ lương/Chi phí (E)',
    amounts: ['18.500.000', '14.200.000', '22.800.000'],
    thresholdNum: 20000000,
    thresholdLabel: '20 triệu đồng',
    codePrefix: 'HRO',
    codeMid: '2026',
    codeSuffix: 'CA01',
    masterSheet: 'DM_NhanSu',
    masterKeyHeader: 'Mã NV',
    masterValHeader: 'Phụ cấp trách nhiệm',
    daysHeader: 'Số ngày xử lý (G)',
    dirtyNumberSample: '18.500.000',
  },
};

const createParametricTopic = (
  topicTitle: string,
  builder: (p: ParametricDomainData, domain: PracticeDomain) => DomainVariantSpec
): MultiDomainTopic => ({
  topicTitle,
  domains: {
    accounting: builder(DOMAIN_PROFILES.accounting, 'accounting'),
    sales: builder(DOMAIN_PROFILES.sales, 'sales'),
    inventory: builder(DOMAIN_PROFILES.inventory, 'inventory'),
    hr_ops: builder(DOMAIN_PROFILES.hr_ops, 'hr_ops'),
  },
});

// ============================================================================
// 1. NGÂN HÀNG CÂU HỎI CƠ BẢN (BASIC: 12 CHỦ ĐỀ × 4 MẢNG = 48 CÂU)
// ============================================================================
const BASIC_TOPICS: MultiDomainTopic[] = [
  // Topic 1: SUMIF 1 điều kiện (bẫy ngược đối số sum_range)
  createParametricTopic('Tổng hợp số liệu theo một điều kiện bằng SUMIF', (p) => ({
    scenario: `Trong ${p.contextName}, cần tính tổng cột \`${p.amountHeader}\` (cột E) của riêng nhóm \`"${p.groupTarget}"\` (cột B). Đâu là công thức đúng chuẩn?`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.subGroupHeader, p.ownerHeader, p.amountHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.subGroupTarget, p.ownerTarget, p.amounts[0]],
        [p.docSamples[1], p.groupOther, p.subGroupOther, p.ownerOther, p.amounts[1]],
        [p.docSamples[2], p.groupTarget, p.subGroupTarget, p.ownerTarget, p.amounts[2]],
      ],
    },
    options: [
      `=SUMIF(B2:B100, "${p.groupTarget}", E2:E100)`,
      `=SUMIF(E2:E100, "${p.groupTarget}", B2:B100)`,
      `=SUMIF(B2:B100, ${p.groupTarget}, E2:E100)`,
      `=COUNTIF(B2:B100, "${p.groupTarget}", E2:E100)`,
    ],
    correctIndex: 0,
    explanation: `Cú pháp chuẩn của \`SUMIF(range, criteria, [sum_range])\` yêu cầu đặt vùng điều kiện (\`B2:B100\`) trước, chuỗi điều kiện đặt trong ngoặc kép \`"${p.groupTarget}"\`, và vùng tính tổng (\`E2:E100\`) ở cuối. Đáp án đặt \`E2:E100\` lên đầu là bẫy nhầm sang \`SUMIFS\`.`,
  })),

  // Topic 2: COUNTIF đếm theo trạng thái cảnh báo
  createParametricTopic('Đếm số dòng cảnh báo theo điều kiện bằng COUNTIF', (p) => ({
    scenario: `Trong ${p.contextName}, bạn cần đếm xem có bao nhiêu dòng đang ở trạng thái \`"${p.statusAlert}"\` tại cột F (từ F2 đến F100).`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.ownerHeader, p.amountHeader, p.statusHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.ownerTarget, p.amounts[0], p.statusAlert],
        [p.docSamples[1], p.groupOther, p.ownerOther, p.amounts[1], p.statusNormal],
        [p.docSamples[2], p.groupTarget, p.ownerTarget, p.amounts[2], p.statusAlert],
      ],
    },
    options: [
      `=COUNTIF(F2:F100, "${p.statusAlert}")`,
      `=COUNTA(F2:F100, "${p.statusAlert}")`,
      `=COUNT(F2:F100, "${p.statusAlert}")`,
      `=SUMIF(F2:F100, "${p.statusAlert}")`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`COUNTIF(range, criteria)\` dùng để đếm số ô thỏa mãn điều kiện \`"${p.statusAlert}"\`. Hàm \`COUNTA\` chỉ đếm ô không trống (không lọc theo điều kiện), còn \`COUNT\` chỉ đếm ô chứa số.`,
  })),

  // Topic 3: VLOOKUP khóa bảng dò tuyệt đối ($) và tham số 0
  createParametricTopic('Tra cứu danh mục bằng VLOOKUP có khóa vùng tuyệt đối ($)', (p) => ({
    scenario: `Cần lấy \`${p.masterValHeader}\` (cột thứ 3 trong sheet \`${p.masterSheet}\` vùng A2:D50) dựa vào mã ở ô A2 để kéo công thức xuống toàn bộ bảng. Công thức nào không bị lệch vùng khi kéo xuống?`,
    sampleTable: {
      headers: ['Mã tra cứu (A)', p.groupHeader, `KQ: ${p.masterValHeader} (C)`, `Bảng ${p.masterSheet}!A2:D50`],
      rows: [
        ['KEY-01', p.groupTarget, '= ?', 'Cột 1: Mã | Cột 2: Tên | Cột 3: Giá trị'],
        ['KEY-02', p.groupOther, '...', 'Dữ liệu danh mục chuẩn từ dòng 2 đến 50'],
      ],
    },
    options: [
      `=VLOOKUP(A2, ${p.masterSheet}!$A$2:$D$50, 3, 0)`,
      `=VLOOKUP(A2, ${p.masterSheet}!A2:D50, 3, 0)`,
      `=VLOOKUP(A2, ${p.masterSheet}!$A$2:$D$50, 3, 1)`,
      `=VLOOKUP($A$2, ${p.masterSheet}!$A$2:$D$50, 3, 0)`,
    ],
    correctIndex: 0,
    explanation: `Khi kéo công thức xuống, ô mã cần dò \`A2\` phải để tương đối (không khóa \`$A$2\`), vùng bảng danh mục \`$A$2:$D$50\` bắt buộc phải khóa tuyệt đối bằng \`$\`, và tham số cuối phải là \`0\` (dò chính xác).`,
  })),

  // Topic 4: Làm sạch mã thừa khoảng trắng và tách chuỗi bằng RIGHT + TRIM
  createParametricTopic('Xử lý chuỗi mã bị dư khoảng trắng bằng kết hợp RIGHT và TRIM', (p) => ({
    scenario: `Cột A trong ${p.contextName} chứa mã chứng từ dạng \`"${p.codePrefix}-${p.codeMid}-${p.codeSuffix}  "\` (bị dư khoảng trắng ở cuối do xuất từ phần mềm). Cần lấy đúng 4 ký tự mã đuôi \`"${p.codeSuffix}"\`.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, 'Mã đuôi cần tách (C)'],
      rows: [
        [`${p.codePrefix}-${p.codeMid}-${p.codeSuffix}  `, p.groupTarget, `Kỳ vọng: ${p.codeSuffix}`],
        [`${p.codePrefix}-${p.codeMid}-XX02`, p.groupOther, 'Kỳ vọng: XX02'],
      ],
    },
    options: [
      `=RIGHT(TRIM(A2), 4)`,
      `=RIGHT(A2, 4)`,
      `=LEFT(TRIM(A2), 4)`,
      `=MID(A2, 4, 4)`,
    ],
    correctIndex: 0,
    explanation: `Nếu chỉ viết \`=RIGHT(A2, 4)\` khi cuối ô A2 có 2 dấu cách thừa, Excel sẽ lấy cả 2 dấu cách trắng vào kết quả (\`"01  "\`). Bắt buộc phải làm sạch khoảng trắng bằng \`TRIM(A2)\` trước khi cắt bằng \`RIGHT(..., 4)\`.`,
  })),

  // Topic 5: Tách phần năm ở giữa mã bằng MID và chuyển thành Số bằng VALUE
  createParametricTopic('Tách ký tự giữa chuỗi bằng MID và ép kiểu số bằng VALUE', (p) => ({
    scenario: `Mã tại ô A2 có cấu trúc cố định \`"${p.codePrefix}-${p.codeMid}-${p.codeSuffix}"\`. Cần tách 4 chữ số năm \`${p.codeMid}\` ở giữa chuỗi và chuyển thành kiểu Số (Number) để so sánh lớn/nhỏ.`,
    sampleTable: {
      headers: [p.docHeader, 'Vị trí ký tự', 'Năm kiểu Số (C)'],
      rows: [
        [`${p.codePrefix}-${p.codeMid}-${p.codeSuffix}`, `Ký tự 1-3: ${p.codePrefix} | Ký tự 4: "-" | Ký tự 5-8: ${p.codeMid}`, `${p.codeMid} (Number)`],
      ],
    },
    options: [
      `=VALUE(MID(A2, 5, 4))`,
      `=MID(A2, 5, 4)`,
      `=VALUE(MID(A2, 4, 4))`,
      `=TRIM(MID(A2, 5, 4))`,
    ],
    correctIndex: 0,
    explanation: `Sau 3 ký tự \`${p.codePrefix}\` và dấu gạch ngang ở vị trí thứ 4, phần năm bắt đầu từ vị trí thứ \`5\` với độ dài \`4\` ký tự. Vì hàm \`MID\` luôn trả về kiểu Text (\`"2026"\`), cần bọc \`VALUE(...)\` để chuyển sang kiểu Number.`,
  })),

  // Topic 6: Chuyển số tiền dạng Text có dấu chấm phân cách nghìn về Number
  createParametricTopic('Xử lý lỗi #VALUE! khi số tiền bị lưu dạng Text có dấu chấm', (p) => ({
    scenario: `Trong ${p.contextName}, cột E (\`${p.amountHeader}\`) copy từ web về đang lưu dạng chuỗi \`"${p.dirtyNumberSample}"\` (dùng dấu chấm phân cách hàng nghìn) nên hàm SUM trả về 0. Công thức nào đổi ô E2 về số thực?`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, `${p.amountHeader} dạng Text (E)`, 'Số tiền chuẩn (F)'],
      rows: [
        [p.docSamples[0], p.groupTarget, `"${p.dirtyNumberSample}"`, '= ?'],
      ],
    },
    options: [
      `=VALUE(SUBSTITUTE(E2, ".", ""))`,
      `=SUBSTITUTE(E2, ".", "")`,
      `=TRIM(E2)*1`,
      `=LEN(SUBSTITUTE(E2, ".", ""))`,
    ],
    correctIndex: 0,
    explanation: `Dùng \`SUBSTITUTE(E2, ".", "")\` để loại bỏ toàn bộ dấu chấm phân cách nghìn, sau đó bọc \`VALUE(...)\` để ép chuỗi số thuần túy thành kiểu Number tính toán được.`,
  })),

  // Topic 7: Tỷ trọng % có khóa mẫu số tuyệt đối ($)
  createParametricTopic('Tính tỷ trọng % từng dòng và chống lỗi trượt vùng mẫu số', (p) => ({
    scenario: `Trong ${p.contextName} (dữ liệu từ dòng 2 đến dòng 50), cần viết công thức tại ô F2 để tính tỷ trọng của \`E2\` so với tổng cột E rồi kéo xuống đến F50.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.amountHeader, 'Tỷ trọng % (F)'],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0], '= ? (Kéo từ F2 xuống F50)'],
        [p.docSamples[1], p.groupOther, p.amounts[1], '...'],
      ],
    },
    options: [
      `=E2/SUM($E$2:$E$50)`,
      `=E2/SUM(E2:E50)`,
      `=$E$2/SUM($E$2:$E$50)`,
      `=SUM($E$2:$E$50)/E2`,
    ],
    correctIndex: 0,
    explanation: `Tử số \`E2\` phải để tương đối để tự đổi thành \`E3, E4...\` khi kéo xuống, còn vùng mẫu số \`$E$2:$E$50\` bắt buộc phải khóa tuyệt đối bằng dấu \`$\` để không bị trượt vùng.`,
  })),

  // Topic 8: Hàm SUBTOTAL(109, ...) cộng vùng đang Filter
  createParametricTopic('Tính tổng chỉ các dòng đang hiển thị khi bật Filter bằng SUBTOTAL', (p) => ({
    scenario: `Khi lọc ${p.contextName} theo \`${p.groupHeader}\`, hàm \`=SUM(E2:E100)\` vẫn cộng cả những dòng đã bị ẩn. Công thức nào chỉ cộng các dòng đang hiển thị trên màn hình?`,
    sampleTable: {
      headers: [p.docHeader, `${p.groupHeader} (Đang lọc)`, p.amountHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0]],
        [p.docSamples[2], p.groupTarget, p.amounts[2]],
        ['DÒNG TỔNG HIỂN THỊ', `Chỉ cộng ${p.groupTarget}`, '= ?'],
      ],
    },
    options: [
      `=SUBTOTAL(109, E2:E100)`,
      `=SUBTOTAL(103, E2:E100)`,
      `=SUM(E2:E100)`,
      `=COUNTIF(E2:E100, ">0")`,
    ],
    correctIndex: 0,
    explanation: `Trong hàm \`SUBTOTAL\`, mã \`109\` đại diện cho phép tính \`SUM\` bỏ qua toàn bộ các dòng bị ẩn (do Filter hoặc Hide Rows). Mã \`103\` chỉ là \`COUNTA\` (đếm số dòng hiển thị).`,
  })),

  // Topic 9: Kiểm tra độ dài mã quy chuẩn kết hợp LEN và TRIM
  createParametricTopic('Kiểm soát quy cách độ dài mã bằng IF + LEN + TRIM', (p) => ({
    scenario: `Quy định nội bộ yêu cầu mã tại cột A của ${p.contextName} sau khi bỏ khoảng trắng thừa phải có đúng 13 ký tự (ví dụ \`"${p.docSamples[0]}"\`). Công thức nào kiểm tra đúng chuẩn?`,
    sampleTable: {
      headers: [p.docHeader, 'Số ký tự thực', 'Trạng thái kiểm tra (C)'],
      rows: [
        [p.docSamples[0], '13 ký tự', 'Hợp lệ'],
        [`${p.codePrefix}-26-01`, '9 ký tự', 'Sai quy cách'],
      ],
    },
    options: [
      `=IF(LEN(TRIM(A2))=13, "Hợp lệ", "Sai quy cách")`,
      `=IF(LEN(A2)="13", "Hợp lệ", "Sai quy cách")`,
      `=IF(TRIM(A2)=13, "Hợp lệ", "Sai quy cách")`,
      `=COUNTIF(A2, 13)`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`LEN(TRIM(A2))\` đo độ dài chuỗi sau khi đã loại bỏ khoảng trắng thừa và trả về kiểu Number, nên phải so sánh trực tiếp với số \`13\` (không bọc trong dấu ngoặc kép \`"13"\`).`,
  })),

  // Topic 10: Phân biệt COUNT và COUNTA khi dữ liệu lẫn chuỗi lỗi
  createParametricTopic('Kiểm tra số dòng có giá trị kiểu Số hợp lệ bằng COUNT vs COUNTA', (p) => ({
    scenario: `Trong ${p.contextName} gồm 100 dòng (từ dòng 2 đến 101), một số ô ở cột \`${p.amountHeader}\` (cột E) bị nhập nhầm chữ \`"Chưa chốt"\` hoặc \`"-"\`. Hàm nào đếm CHỈ những ô chứa số thực sự tính toán được?`,
    sampleTable: {
      headers: [p.docHeader, p.amountHeader, 'Kiểu dữ liệu thực tế'],
      rows: [
        [p.docSamples[0], p.amounts[0], 'Number (Hợp lệ)'],
        [p.docSamples[1], '"Chưa chốt"', 'Text (Làm lệch trung bình)'],
        [p.docSamples[2], p.amounts[2], 'Number (Hợp lệ)'],
      ],
    },
    options: [
      `=COUNT(E2:E101)`,
      `=COUNTA(E2:E101)`,
      `=COUNTBLANK(E2:E101)`,
      `=SUM(E2:E101)`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`COUNT\` chỉ đếm các ô chứa giá trị kiểu Số (Number/Date), bỏ qua các ô chứa chữ như \`"Chưa chốt"\`. Ngược lại, \`COUNTA\` đếm mọi ô không rỗng nên sẽ đếm luôn cả ô chứa chữ.`,
  })),

  // Topic 11: Phát hiện mã chứng từ bị nhập trùng bằng COUNTIF khóa vùng
  createParametricTopic('Phát hiện dòng nhập trùng mã chứng từ bằng COUNTIF', (p) => ({
    scenario: `Trước khi chốt số liệu ${p.contextName}, bạn cần gắn cảnh báo \`"Trùng mã"\` tại cột G nếu mã ở cột A (vùng A2:A100) xuất hiện từ 2 lần trở lên.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.amountHeader, 'Cảnh báo trùng (G)'],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0], 'Trùng mã'],
        [p.docSamples[1], p.groupOther, p.amounts[1], 'OK'],
        [p.docSamples[0], p.groupTarget, p.amounts[0], 'Trùng mã'],
      ],
    },
    options: [
      `=IF(COUNTIF($A$2:$A$100, A2)>1, "Trùng mã", "OK")`,
      `=IF(COUNTIF(A2:A100, A2)=1, "Trùng mã", "OK")`,
      `=IF(COUNTA($A$2:$A$100)>1, "Trùng mã", "OK")`,
      `=COUNTIF($A$2:$A$100, ">1")`,
    ],
    correctIndex: 0,
    explanation: `Dùng \`COUNTIF($A$2:$A$100, A2)\` (nhớ khóa tuyệt đối vùng \`$A$2:$A$100\`) để đếm số lần mã \`A2\` xuất hiện trong toàn bảng. Nếu \`> 1\` tức là mã đó bị lặp lại.`,
  })),

  // Topic 12: Gắn cờ giao dịch vượt ngưỡng bằng IF (bẫy đặt số trong ngoặc kép)
  createParametricTopic('Gắn cờ kiểm soát các dòng vượt ngưỡng giá trị bằng hàm IF', (p) => ({
    scenario: `Trong ${p.contextName}, quy chế kiểm soát yêu cầu gắn nhãn \`"Cần duyệt kỹ"\` nếu cột \`${p.amountHeader}\` (ô E2) từ ${p.thresholdLabel} (${p.thresholdNum}) trở lên, ngược lại ghi \`"Bình thường"\`.`,
    sampleTable: {
      headers: [p.docHeader, p.ownerHeader, p.amountHeader, 'Kiểm soát (F)'],
      rows: [
        [p.docSamples[0], p.ownerTarget, p.amounts[0], 'Cần duyệt kỹ'],
        [p.docSamples[1], p.ownerOther, p.amounts[1], 'Bình thường'],
      ],
    },
    options: [
      `=IF(E2>=${p.thresholdNum}, "Cần duyệt kỹ", "Bình thường")`,
      `=IF(E2>="${p.thresholdNum}", "Cần duyệt kỹ", "Bình thường")`,
      `=IF(E2>=${p.dirtyNumberSample}, "Cần duyệt kỹ", "Bình thường")`,
      `=SUMIF(E2:E100, ">=${p.thresholdNum}")`,
    ],
    correctIndex: 0,
    explanation: `Trong biểu thức so sánh trực tiếp của \`IF\`, số \`${p.thresholdNum}\` phải viết liền không có dấu chấm phân cách nghìn và KHÔNG được đặt trong dấu ngoặc kép \`"${p.thresholdNum}"\` (vì chuỗi luôn lớn hơn mọi con số trong Excel!).`,
  })),
];

// ============================================================================
// 2. NGÂN HÀNG CÂU HỎI TRUNG CẤP (INTERMEDIATE: 20 CHỦ ĐỀ × 4 MẢNG = 80 CÂU)
// ============================================================================
const INTERMEDIATE_TOPICS: MultiDomainTopic[] = [
  // Topic 1: SUMIFS đa điều kiện (bẫy vị trí sum_range)
  createParametricTopic('Tổng hợp đa điều kiện bằng SUMIFS (vị trí vùng tính tổng)', (p) => ({
    scenario: `Trong ${p.contextName}, cần tính tổng \`${p.amountHeader}\` (cột E) của các dòng vừa thuộc \`"${p.groupTarget}"\` (cột B) vừa thuộc \`"${p.subGroupTarget}"\` (cột C).`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.subGroupHeader, p.ownerHeader, p.amountHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.subGroupTarget, p.ownerTarget, p.amounts[0]],
        [p.docSamples[1], p.groupTarget, p.subGroupOther, p.ownerOther, p.amounts[1]],
        [p.docSamples[2], p.groupTarget, p.subGroupTarget, p.ownerTarget, p.amounts[2]],
      ],
    },
    options: [
      `=SUMIFS(E2:E100, B2:B100, "${p.groupTarget}", C2:C100, "${p.subGroupTarget}")`,
      `=SUMIFS(B2:B100, "${p.groupTarget}", C2:C100, "${p.subGroupTarget}", E2:E100)`,
      `=SUMIF(E2:E100, B2:B100, "${p.groupTarget}", C2:C100, "${p.subGroupTarget}")`,
      `=SUMIFS(E2:E100, B2:B100="${p.groupTarget}", C2:C100="${p.subGroupTarget}")`,
    ],
    correctIndex: 0,
    explanation: `Khác với \`SUMIF\`, hàm \`SUMIFS(sum_range, criteria_range1, criteria1, ...)\` bắt buộc phải đặt vùng cần tính tổng (\`E2:E100\`) ở vị trí ĐẦU TIÊN, sau đó mới đến từng cặp vùng điều kiện và điều kiện.`,
  })),

  // Topic 2: COUNTIFS kết hợp điều kiện chữ và điều kiện so sánh số ">30"
  createParametricTopic('Đếm dòng rủi ro kết hợp điều kiện chữ và ngưỡng số bằng COUNTIFS', (p) => ({
    scenario: `Trong ${p.contextName}, cần đếm số dòng vừa có \`${p.statusHeader}\` (cột F) là \`"${p.statusAlert}"\`, vừa có \`${p.daysHeader}\` (cột G) lớn hơn 30.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.statusHeader, p.daysHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.statusAlert, '45'],
        [p.docSamples[1], p.groupOther, p.statusAlert, '15'],
        [p.docSamples[2], p.groupTarget, p.statusNormal, '0'],
      ],
    },
    options: [
      `=COUNTIFS(F2:F100, "${p.statusAlert}", G2:G100, ">30")`,
      `=COUNTIFS(F2:F100, "${p.statusAlert}", G2:G100, >30)`,
      `=COUNTIF(F2:F100, "${p.statusAlert}", G2:G100, ">30")`,
      `=SUMIFS(G2:G100, F2:F100, "${p.statusAlert}", G2:G100, ">30")`,
    ],
    correctIndex: 0,
    explanation: `Trong \`COUNTIFS\` / \`SUMIFS\`, điều kiện so sánh có toán tử (\`>30\`) bắt buộc phải đặt trong dấu ngoặc kép \`">30"\`. Nếu viết rời \`, >30\` Excel sẽ báo lỗi cú pháp công thức ngay lập tức.`,
  })),

  // Topic 3: AVERAGEIFS tính trung bình có điều kiện và loại trừ dòng bằng 0
  createParametricTopic('Tính giá trị trung bình có điều kiện bằng AVERAGEIFS', (p) => ({
    scenario: `Cần tính trung bình cộng cột \`${p.amountHeader}\` (cột E) của riêng nhóm \`"${p.groupTarget}"\` (cột B) nhưng chỉ tính các dòng có trạng thái \`"${p.statusNormal}"\` (cột F).`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.amountHeader, p.statusHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0], p.statusNormal],
        [p.docSamples[1], p.groupTarget, p.amounts[1], p.statusAlert],
        [p.docSamples[2], p.groupTarget, p.amounts[2], p.statusNormal],
      ],
    },
    options: [
      `=AVERAGEIFS(E2:E100, B2:B100, "${p.groupTarget}", F2:F100, "${p.statusNormal}")`,
      `=AVERAGEIF(B2:B100, "${p.groupTarget}", F2:F100, "${p.statusNormal}", E2:E100)`,
      `=AVERAGE(E2:E100)/COUNTIFS(B2:B100, "${p.groupTarget}", F2:F100, "${p.statusNormal}")`,
      `=SUMIFS(E2:E100, B2:B100, "${p.groupTarget}")/COUNTA(E2:E100)`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`AVERAGEIFS(average_range, criteria_range1, criteria1, ...)\` đặt vùng cần tính trung bình (\`E2:E100\`) ở đầu tiên, sau đó lọc chính xác theo cả 2 điều kiện cột B và cột F.`,
  })),

  // Topic 4: XLOOKUP tra cứu ngược (cột kết quả nằm bên trái cột khóa) + if_not_found
  createParametricTopic('Tra cứu ngược từ phải sang trái và xử lý mã mới bằng XLOOKUP', (p) => ({
    scenario: `Trong bảng danh mục \`${p.masterSheet}\`, cột \`${p.masterValHeader}\` nằm ở cột A còn cột khóa \`${p.masterKeyHeader}\` lại nằm ở cột C (bên phải). Cần tra cứu mã tại ô A2 và trả về \`"Chưa khai báo"\` nếu không tìm thấy.`,
    sampleTable: {
      headers: [`${p.masterSheet}!Cột A (${p.masterValHeader})`, `${p.masterSheet}!Cột B (Mô tả)`, `${p.masterSheet}!Cột C (${p.masterKeyHeader})`],
      rows: [
        [p.amounts[0], p.subGroupTarget, 'KEY-101'],
        [p.amounts[1], p.subGroupOther, 'KEY-102'],
      ],
    },
    options: [
      `=XLOOKUP(A2, ${p.masterSheet}!$C$2:$C$50, ${p.masterSheet}!$A$2:$A$50, "Chưa khai báo")`,
      `=VLOOKUP(A2, ${p.masterSheet}!$A$2:$C$50, 1, 0)`,
      `=XLOOKUP(A2, ${p.masterSheet}!$A$2:$A$50, ${p.masterSheet}!$C$2:$C$50, "Chưa khai báo")`,
      `=VLOOKUP(A2, ${p.masterSheet}!$C$2:$A$50, -3, 0)`,
    ],
    correctIndex: 0,
    explanation: `\`VLOOKUP\` không thể tra cứu từ phải sang trái (khi cột khóa ở cột C còn cột kết quả ở cột A). \`XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])\` truyền riêng cột dò \`$C$2:$C$50\` và cột trả về \`$A$2:$A$50\` nên tra cứu ngược rất dễ dàng.`,
  })),

  // Topic 5: INDEX + MATCH cho các phiên bản Excel không có XLOOKUP
  createParametricTopic('Tra cứu linh hoạt trong file Excel phiên bản cũ bằng INDEX + MATCH', (p) => ({
    scenario: `Khi làm việc trên máy tính chưa có Excel 365 (không có XLOOKUP), cần dò mã \`A2\` trong cột \`${p.masterSheet}!$C$2:$C$50\` để lấy giá trị tương ứng ở cột \`${p.masterSheet}!$A$2:$A$50\`.`,
    sampleTable: {
      headers: ['Ô mã cần tìm', 'Vùng dò vị trí dòng (MATCH)', 'Vùng lấy kết quả (INDEX)'],
      rows: [
        ['A2', `${p.masterSheet}!$C$2:$C$50`, `${p.masterSheet}!$A$2:$A$50`],
      ],
    },
    options: [
      `=INDEX(${p.masterSheet}!$A$2:$A$50, MATCH(A2, ${p.masterSheet}!$C$2:$C$50, 0))`,
      `=INDEX(${p.masterSheet}!$C$2:$C$50, MATCH(A2, ${p.masterSheet}!$A$2:$A$50, 0))`,
      `=MATCH(A2, INDEX(${p.masterSheet}!$A$2:$A$50, 0), 0)`,
      `=INDEX(${p.masterSheet}!$A$2:$A$50, MATCH(A2, ${p.masterSheet}!$C$2:$C$50, 1))`,
    ],
    correctIndex: 0,
    explanation: `Trong cặp \`INDEX(return_range, MATCH(lookup_value, lookup_range, 0))\`, vùng đặt trong \`INDEX\` luôn là vùng chứa kết quả muốn lấy ra (\`$A$2:$A$50\`), còn \`MATCH(..., 0)\` tìm số thứ tự dòng trong cột khóa (\`$C$2:$C$50\`).`,
  })),

  // Topic 6: IFS phân tầng nhiều mức (bẫy thứ tự từ thấp lên cao)
  createParametricTopic('Phân loại bậc thang bằng hàm IFS (bẫy thứ tự xét điều kiện)', (p) => ({
    scenario: `Trong ${p.contextName}, cần phân nhóm theo cột \`${p.daysHeader}\` (ô G2): Nếu \`> 60\` là \`"Mức Cao"\`, từ \`31 đến 60\` là \`"Mức Trung bình"\`, còn lại \`<= 30\` là \`"Mức Thấp"\`. Công thức nào đúng?`,
    sampleTable: {
      headers: [p.docHeader, p.daysHeader, 'Phân nhóm rủi ro/ưu tiên (H)'],
      rows: [
        [p.docSamples[0], '75', 'Mức Cao (> 60)'],
        [p.docSamples[1], '45', 'Mức Trung bình (31 - 60)'],
        [p.docSamples[2], '12', 'Mức Thấp (<= 30)'],
      ],
    },
    options: [
      `=IFS(G2>60, "Mức Cao", G2>30, "Mức Trung bình", TRUE, "Mức Thấp")`,
      `=IFS(G2>30, "Mức Trung bình", G2>60, "Mức Cao", TRUE, "Mức Thấp")`,
      `=IFS(G2>60, "Mức Cao", G2>30, "Mức Trung bình", "Mức Thấp")`,
      `=IF(G2>60, "Mức Cao", G2>30, "Mức Trung bình", "Mức Thấp")`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`IFS\` kiểm tra tuần tự từ trái sang phải và dừng ngay ở điều kiện ĐẦU TIÊN đúng. Nếu đặt \`G2>30\` trước \`G2>60\`, thì giá trị \`75\` (vốn \`>30\`) sẽ bị nhận nhầm thành \`"Mức Trung bình"\` ngay lập tức! Ngoài ra nhánh mặc định cuối cùng của \`IFS\` phải đi kèm điều kiện \`TRUE\`.`,
  })),

  // Topic 7: Kết hợp IF + AND + OR trong kiểm soát nghiệp vụ phức tạp
  createParametricTopic('Kiểm soát điều kiện kép kết hợp IF, AND và OR', (p) => ({
    scenario: `Trong ${p.contextName}, cần gắn nhãn \`"Ưu tiên xử lý"\` nếu dòng dữ liệu thuộc \`"${p.groupTarget}"\` HOẶC \`"${p.groupOther}"\` (cột B), ĐỒNG THỜI phải có trạng thái \`"${p.statusAlert}"\` (cột F).`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.statusHeader, 'Kết quả phân luồng (H)'],
      rows: [
        [p.docSamples[0], p.groupTarget, p.statusAlert, 'Ưu tiên xử lý'],
        [p.docSamples[1], p.groupOther, p.statusNormal, 'Theo dõi thường'],
      ],
    },
    options: [
      `=IF(AND(OR(B2="${p.groupTarget}", B2="${p.groupOther}"), F2="${p.statusAlert}"), "Ưu tiên xử lý", "Theo dõi thường")`,
      `=IF(OR(AND(B2="${p.groupTarget}", B2="${p.groupOther}"), F2="${p.statusAlert}"), "Ưu tiên xử lý", "Theo dõi thường")`,
      `=IF(AND(B2="${p.groupTarget}", B2="${p.groupOther}", F2="${p.statusAlert}"), "Ưu tiên xử lý", "Theo dõi thường")`,
      `=IF(OR(B2="${p.groupTarget}", B2="${p.groupOther}", F2="${p.statusAlert}"), "Ưu tiên xử lý", "Theo dõi thường")`,
    ],
    correctIndex: 0,
    explanation: `Một ô \`B2\` không thể vừa là \`"${p.groupTarget}"\` vừa là \`"${p.groupOther}"\` cùng lúc, nên điều kiện cột B phải dùng \`OR(B2="...", B2="...")\`, sau đó bọc trong \`AND(..., F2="${p.statusAlert}")\` để bắt buộc thỏa mãn trạng thái cảnh báo.`,
  })),

  // Topic 8: EOMONTH tính ngày chốt sổ cuối tháng
  createParametricTopic('Xác định ngày khóa sổ cuối tháng bằng hàm EOMONTH', (p) => ({
    scenario: `Ngày phát sinh chứng từ của ${p.contextName} nằm tại ô B2. Cần tính ngày cuối cùng của chính tháng phát sinh đó để chốt kỳ báo cáo.`,
    sampleTable: {
      headers: [p.docHeader, 'Ngày phát sinh (B)', 'Ngày khóa sổ cuối tháng (C)'],
      rows: [
        [p.docSamples[0], '2026-02-14', '2026-02-28'],
        [p.docSamples[1], '2026-05-10', '2026-05-31'],
      ],
    },
    options: [
      `=EOMONTH(B2, 0)`,
      `=EOMONTH(B2, 1)`,
      `=EDATE(B2, 0)`,
      `=DATE(YEAR(B2), MONTH(B2), 30)`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`EOMONTH(start_date, months)\` với tham số \`months = 0\` trả về ngày cuối cùng của chính tháng đó (tự động biết tháng 2 có 28/29 ngày, tháng 4 có 30 ngày, tháng 5 có 31 ngày). Tham số \`1\` là cuối tháng kế tiếp.`,
  })),

  // Topic 9: NETWORKDAYS tính ngày làm việc có trừ danh sách ngày lễ
  createParametricTopic('Tính số ngày làm việc thực tế trừ cuối tuần và nghỉ lễ bằng NETWORKDAYS', (p) => ({
    scenario: `Trong ${p.contextName}, cần tính số ngày làm việc (thứ Hai đến thứ Sáu) từ Ngày bắt đầu (\`B2\`) đến Ngày hoàn tất (\`C2\`), đồng thời trừ đi danh sách Ngày nghỉ lễ nằm ở vùng \`$I$2:$I$10\`.`,
    sampleTable: {
      headers: [p.docHeader, 'Ngày bắt đầu (B)', 'Ngày hoàn tất (C)', 'Vùng Ngày lễ ($I$2:$I$10)', 'Số ngày làm việc (D)'],
      rows: [
        [p.docSamples[0], '2026-04-29', '2026-05-05', '30/04/2026, 01/05/2026', '3 ngày'],
      ],
    },
    options: [
      `=NETWORKDAYS(B2, C2, $I$2:$I$10)`,
      `=NETWORKDAYS(B2, C2) - COUNTA($I$2:$I$10)`,
      `=DATEDIF(B2, C2, "d")`,
      `=WORKDAY(B2, C2, $I$2:$I$10)`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`NETWORKDAYS(start_date, end_date, [holidays])\` chỉ trừ những ngày lễ nào thực sự nằm trong khoảng từ \`B2\` đến \`C2\`. Nếu tự trừ \`COUNTA($I$2:$I$10)\` ở ngoài sẽ bị trừ oan cả các ngày lễ Tết của tháng khác!`,
  })),

  // Topic 10: DATEDIF tính số tháng chênh lệch tròn (bẫy thứ tự ngày)
  createParametricTopic('Tính số tháng hiệu lực bằng DATEDIF (bẫy lỗi #NUM!)', (p) => ({
    scenario: `Cần tính tổng số tháng tròn từ Ngày hiệu lực (\`B2\`) đến Ngày hết hạn (\`C2\`) trong ${p.contextName}. Công thức nào tránh được lỗi \`#NUM!\` và trả về tổng số tháng đúng?`,
    sampleTable: {
      headers: [p.docHeader, 'Ngày hiệu lực (B)', 'Ngày hết hạn (C)', 'Tổng số tháng (D)'],
      rows: [
        [p.docSamples[0], '2024-11-15', '2026-05-15', '18 tháng'],
      ],
    },
    options: [
      `=DATEDIF(B2, C2, "m")`,
      `=DATEDIF(C2, B2, "m")`,
      `=DATEDIF(B2, C2, "ym")`,
      `=MONTH(C2) - MONTH(B2)`,
    ],
    correctIndex: 0,
    explanation: `Trong \`DATEDIF(start_date, end_date, unit)\`, ngày nhỏ hơn (\`B2\`) bắt buộc đứng trước ngày lớn hơn (\`C2\`), nếu đảo ngược sẽ báo lỗi \`#NUM!\`. Đơn vị \`"m"\` trả về tổng số tháng tròn (18 tháng), trong khi \`"ym"\` chỉ trả về số tháng lẻ sau khi trừ năm (6 tháng).`,
  })),

  // Topic 11: Hàm mảng động FILTER với nhiều điều kiện (nhân * vs cộng +)
  createParametricTopic('Lọc bảng dữ liệu động nhiều điều kiện bằng hàm FILTER (Excel 365)', (p) => ({
    scenario: `Trong ${p.contextName}, cần trích xuất tự động toàn bộ các dòng thuộc \`"${p.groupTarget}"\` (cột B) VÀ có trạng thái \`"${p.statusAlert}"\` (cột F) từ vùng \`A2:G100\`.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.amountHeader, p.statusHeader],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0], p.statusAlert],
        [p.docSamples[1], p.groupOther, p.amounts[1], p.statusAlert],
        [p.docSamples[2], p.groupTarget, p.amounts[2], p.statusNormal],
      ],
    },
    options: [
      `=FILTER(A2:G100, (B2:B100="${p.groupTarget}")*(F2:F100="${p.statusAlert}"), "Không có dữ liệu")`,
      `=FILTER(A2:G100, AND(B2:B100="${p.groupTarget}", F2:F100="${p.statusAlert}"), "Không có dữ liệu")`,
      `=FILTER(A2:G100, (B2:B100="${p.groupTarget}")+(F2:F100="${p.statusAlert}"), "Không có dữ liệu")`,
      `=FILTER(B2:B100="${p.groupTarget}", A2:G100)`,
    ],
    correctIndex: 0,
    explanation: `Bẫy rất hay gặp trong hàm mảng \`FILTER\`: Không thể dùng hàm \`AND(...)\` bên trong đối số \`include\` vì \`AND\` chỉ trả về 1 giá trị logic duy nhất thay vì mảng từng dòng! Phải dùng phép nhân \`(Điều_kiện_1)*(Điều_kiện_2)\` cho logic VÀ, còn phép cộng \`+\` là logic HOẶC.`,
  })),

  // Topic 12: Kết hợp SORT + UNIQUE tạo danh mục động
  createParametricTopic('Tạo danh sách không trùng và tự động sắp xếp A-Z bằng SORT + UNIQUE', (p) => ({
    scenario: `Từ cột \`${p.ownerHeader}\` (vùng D2:D100) trong ${p.contextName}, bạn muốn tạo một danh sách tên nhân sự duy nhất (không trùng lặp) và được sắp xếp theo thứ tự bảng chữ cái A-Z để làm nguồn cho Dropdown.`,
    sampleTable: {
      headers: [`Cột nguồn ${p.ownerHeader} (D2:D100)`, 'Danh sách đích mong muốn'],
      rows: [
        [p.ownerTarget, '1. Đã loại bỏ các tên lặp lại'],
        [p.ownerOther, '2. Tự động xếp thứ tự tăng dần A -> Z'],
        [p.ownerTarget, ''],
      ],
    },
    options: [
      `=SORT(UNIQUE(D2:D100), 1, 1)`,
      `=UNIQUE(SORT(D2:D100, 1, -1))`,
      `=FILTER(D2:D100, D2:D100<>"")`,
      `=COUNTIF(D2:D100, D2:D100)`,
    ],
    correctIndex: 0,
    explanation: `\`UNIQUE(D2:D100)\` rút gọn danh sách về các phần tử không trùng, sau đó bọc \`SORT(..., 1, 1)\` với tham số thứ ba là \`1\` (tăng dần A-Z; còn \`-1\` là giảm dần Z-A).`,
  })),

  // Topic 13: Chống lỗi tra cứu #N/A và phân biệt dữ liệu thiếu bằng IFERROR + COUNTBLANK
  createParametricTopic('Kiểm soát dòng nhập thiếu trường bắt buộc bằng COUNTBLANK', (p) => ({
    scenario: `Trên mỗi dòng của ${p.contextName}, các cột từ A đến E là thông tin bắt buộc phải nhập đủ trước khi lưu. Công thức nào tại cột H giúp phát hiện dòng bị bỏ trống bất kỳ ô nào trong vùng \`A2:E2\`?`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.subGroupHeader, p.ownerHeader, p.amountHeader, 'Kiểm tra (H)'],
      rows: [
        [p.docSamples[0], p.groupTarget, '', p.ownerTarget, p.amounts[0], 'Thiếu thông tin bắt buộc'],
        [p.docSamples[1], p.groupOther, p.subGroupOther, p.ownerOther, p.amounts[1], 'Đủ dữ liệu'],
      ],
    },
    options: [
      `=IF(COUNTBLANK(A2:E2)>0, "Thiếu thông tin bắt buộc", "Đủ dữ liệu")`,
      `=IFERROR(A2:E2, "Thiếu thông tin bắt buộc")`,
      `=IF(A2:E2="", "Thiếu thông tin bắt buộc", "Đủ dữ liệu")`,
      `=IF(COUNTA(A2:E2)=0, "Thiếu thông tin bắt buộc", "Đủ dữ liệu")`,
    ],
    correctIndex: 0,
    explanation: `\`COUNTBLANK(A2:E2)\` đếm số ô đang để trống trên dòng 2. Chỉ cần \`COUNTBLANK(A2:E2) > 0\` là biết ngay dòng đó bị thiếu ít nhất 1 trường bắt buộc (trong khi \`COUNTA(A2:E2)=0\` chỉ bắt được khi cả 5 ô đều trống).`,
  })),

  // Topic 14: Tra cứu 2 điều kiện bằng XLOOKUP ghép khóa
  createParametricTopic('Tra cứu theo tổ hợp 2 điều kiện bằng XLOOKUP ghép khóa (&)', (p) => ({
    scenario: `Trong ${p.contextName}, định mức/đơn giá phụ thuộc đồng thời vào \`${p.groupHeader}\` (\`B2\`) và \`${p.subGroupHeader}\` (\`C2\`). Bảng danh mục chuẩn nằm ở vùng \`I2:K20\` (cột I là Nhóm, cột J là Phân loại, cột K là Định mức).`,
    sampleTable: {
      headers: [p.groupHeader, p.subGroupHeader, ' | ', 'DM_Nhóm (I)', 'DM_Loại (J)', 'DM_Định mức (K)'],
      rows: [
        [p.groupTarget, p.subGroupTarget, ' | ', p.groupTarget, p.subGroupOther, p.amounts[1]],
        ['...', '...', ' | ', p.groupTarget, p.subGroupTarget, p.amounts[0]],
      ],
    },
    options: [
      `=XLOOKUP(B2&C2, $I$2:$I$20&$J$2:$J$20, $K$2:$K$20, "Chưa có định mức")`,
      `=XLOOKUP(B2, $I$2:$I$20, $K$2:$K$20, "Chưa có định mức")`,
      `=VLOOKUP(B2&C2, $I$2:$K$20, 3, 0)`,
      `=INDEX($K$2:$K$20, MATCH(B2, $I$2:$I$20, 0))`,
    ],
    correctIndex: 0,
    explanation: `Bằng cách nối khóa tìm kiếm \`B2&C2\` và nối tương ứng 2 mảng khóa \`$I$2:$I$20&$J$2:$J$20\` ngay trong \`XLOOKUP\`, Excel dò chính xác tổ hợp 2 điều kiện mà không cần chèn thêm cột phụ vào bảng danh mục (còn \`VLOOKUP\` không tự nối 2 cột mảng \`$I$2:$K$20\` được).`,
  })),

  // Topic 15: Kiểm tra trùng lặp theo tổ hợp nhiều cột bằng COUNTIFS
  createParametricTopic('Bắt lỗi nhập trùng giao dịch theo tổ hợp nhiều cột bằng COUNTIFS', (p) => ({
    scenario: `Trong ${p.contextName}, một mã chứng từ ở cột A có thể gồm nhiều dòng chi tiết thuộc các \`${p.subGroupHeader}\` (cột C) khác nhau. Chỉ khi trùng đồng thời cả Cột A lẫn Cột C trên 2 dòng mới là lỗi nhập đúp.`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.subGroupHeader, p.amountHeader, 'Cảnh báo đúp dòng (H)'],
      rows: [
        [p.docSamples[0], p.groupTarget, p.subGroupTarget, p.amounts[0], 'Lặp dòng!'],
        [p.docSamples[0], p.groupTarget, p.subGroupOther, p.amounts[1], 'Hợp lệ'],
        [p.docSamples[0], p.groupTarget, p.subGroupTarget, p.amounts[0], 'Lặp dòng!'],
      ],
    },
    options: [
      `=IF(COUNTIFS($A$2:$A$100, A2, $C$2:$C$100, C2)>1, "Lặp dòng!", "Hợp lệ")`,
      `=IF(COUNTIF($A$2:$A$100, A2)>1, "Lặp dòng!", "Hợp lệ")`,
      `=IF(AND(COUNTIF(A:A, A2)>1, COUNTIF(C:C, C2)>1), "Lặp dòng!", "Hợp lệ")`,
      `=UNIQUE(A2:C100)`,
    ],
    correctIndex: 0,
    explanation: `Nếu dùng \`AND(COUNTIF(A:A, A2)>1, COUNTIF(C:C, C2)>1)\` sẽ báo lỗi sai vì cột A và cột C có thể lặp ở các dòng không liên quan nhau. Phải dùng \`COUNTIFS($A$2:$A$100, A2, $C$2:$C$100, C2)>1\` để kiểm tra cặp giá trị \`(A2, C2)\` cùng xuất hiện trên một dòng hơn 1 lần.`,
  })),

  // Topic 16: Xếp hạng bằng RANK.EQ có khóa vùng tuyệt đối
  createParametricTopic('Xếp hạng hiệu suất từ cao xuống thấp bằng RANK.EQ', (p) => ({
    scenario: `Cần xếp hạng giá trị \`${p.amountHeader}\` tại ô E2 trong toàn bộ danh sách \`E2:E50\` của ${p.contextName} theo thứ tự giá trị lớn nhất đứng hạng 1.`,
    sampleTable: {
      headers: [p.docHeader, p.ownerHeader, p.amountHeader, 'Thứ hạng (H)'],
      rows: [
        [p.docSamples[2], p.ownerTarget, p.amounts[2], '1'],
        [p.docSamples[0], p.ownerTarget, p.amounts[0], '2'],
        [p.docSamples[1], p.ownerOther, p.amounts[1], '3'],
      ],
    },
    options: [
      `=RANK.EQ(E2, $E$2:$E$50, 0)`,
      `=RANK.EQ(E2, E2:E50, 0)`,
      `=RANK.EQ(E2, $E$2:$E$50, 1)`,
      `=SORT(E2, $E$2:$E$50, -1)`,
    ],
    correctIndex: 0,
    explanation: `Trong \`RANK.EQ(number, ref, [order])\`, vùng tham chiếu \`$E$2:$E$50\` phải khóa tuyệt đối bằng \`$\` để khi kéo xuống không bị lệch danh sách so sánh, và tham số \`order = 0\` là xếp từ lớn xuống nhỏ (còn \`1\` là từ nhỏ lên lớn).`,
  })),

  // Topic 17: Xử lý lỗi lệch kiểu Text vs Number trong mã tra cứu ("0012" vs 12)
  createParametricTopic('Xử lý lỗi #N/A khi khóa tra cứu lệch kiểu Text và Number', (p) => ({
    scenario: `Trong ${p.contextName}, cột mã ở bảng giao dịch (ô A2) đang lưu dạng số \`105\`, nhưng ở bảng danh mục \`${p.masterSheet}\` cột mã lại lưu dạng chuỗi 5 ký tự có số 0 ở đầu \`"00105"\` khiến VLOOKUP/XLOOKUP báo lỗi \`#N/A\`. Cách xử lý nào đúng?`,
    sampleTable: {
      headers: ['Mã bảng giao dịch (A2 - Number)', `Mã trong ${p.masterSheet} (Text 5 ký tự)`, 'Kết quả nếu dò thẳng'],
      rows: [
        ['105', '"00105"', '#N/A (Do 105 <> "00105")'],
      ],
    },
    options: [
      `=XLOOKUP(TEXT(A2, "00000"), ${p.masterSheet}!$A$2:$A$100, ${p.masterSheet}!$B$2:$B$100)`,
      `=XLOOKUP(TRIM(A2), ${p.masterSheet}!$A$2:$A$100, ${p.masterSheet}!$B$2:$B$100)`,
      `=XLOOKUP(VALUE(A2), ${p.masterSheet}!$A$2:$A$100, ${p.masterSheet}!$B$2:$B$100)`,
      `=IFERROR(VLOOKUP(A2, ${p.masterSheet}!$A$2:$B$100, 2, 1), "")`,
    ],
    correctIndex: 0,
    explanation: `Hàm \`TEXT(A2, "00000")\` định dạng con số \`105\` thành chuỗi 5 ký tự có số 0 đứng đầu \`"00105"\`, giúp khớp hoàn toàn về cả giá trị lẫn kiểu dữ liệu với cột mã trong \`${p.masterSheet}\`.`,
  })),

  // Topic 18: Chuyển đổi ngày tháng bị lưu dạng Text lệch chuẩn dd/mm/yyyy
  createParametricTopic('Xử lý cột Ngày tháng bị lưu dạng Text không nhóm được theo Tháng trong Pivot Table', (p) => ({
    scenario: `Khi đưa cột Ngày của ${p.contextName} vào Pivot Table, bạn thấy các ngày không thể Group theo Month/Quarter và khi kiểm tra \`=ISNUMBER(B2)\` trả về \`FALSE\` (dữ liệu đang có dạng chuỗi \`"25/05/2026"\` trên máy cài chuẩn US \`mm/dd/yyyy\`). Giải pháp nào chuẩn nhất?`,
    sampleTable: {
      headers: [p.docHeader, 'Ngày đang lưu Text (B)', 'Kiểm tra =ISNUMBER(B2)', 'Hiện tượng trong Pivot Table'],
      rows: [
        [p.docSamples[0], '"25/05/2026"', 'FALSE', 'Không thể Group by Months / Sắp xếp sai thứ tự'],
      ],
    },
    options: [
      'Dùng Data > Text to Columns (Step 3 chọn Date: DMY) hoặc đổi kiểu Date theo Locale vi-VN trong Power Query',
      'Chỉ cần nhấn Ctrl + 1 (Format Cells) rồi chọn định dạng dd/mm/yyyy',
      'Dùng hàm =TRIM(B2) để biến chuỗi ngày thành số serial ngày',
      'Bật bộ lọc AutoFilter rồi chọn Sort A to Z',
    ],
    correctIndex: 0,
    explanation: `Bẫy cực kỳ phổ biến: Đổi Format Cells (\`Ctrl + 1\`) hoàn toàn KHÔNG có tác dụng với dữ liệu đã bị lưu dưới dạng Text! Phải dùng **Text to Columns > Date (DMY)** hoặc **Power Query (Using Locale: Vietnamese)** để chuyển chuỗi thành giá trị Date (Serial Number) thực sự.`,
  })),

  // Topic 19: Pivot Table - Hiển thị tỷ trọng % of Column Total và Slicer
  createParametricTopic('Phân tích cơ cấu tỷ trọng nhanh trong Pivot Table không cần viết công thức', (p) => ({
    scenario: `Khi lập báo cáo Pivot Table từ ${p.contextName} với \`${p.groupHeader}\` ở Rows và \`${p.amountHeader}\` ở Values, sếp yêu cầu hiển thị thêm cột Tỷ trọng % đóng góp của từng nhóm trên tổng số và có nút bấm lọc nhanh theo \`${p.subGroupHeader}\`. Thao tác nào chuẩn nhất?`,
    sampleTable: {
      headers: [p.groupHeader, `Sum of ${p.amountHeader}`, 'Tỷ trọng % đóng góp'],
      rows: [
        [p.groupTarget, p.amounts[0], '% of Grand/Column Total'],
        [p.groupOther, p.amounts[1], '% of Grand/Column Total'],
      ],
    },
    options: [
      'Kéo thêm trường số tiền vào Values lần 2 > Show Values As > % of Column Total, và chèn Insert Slicer',
      'Copy bảng Pivot ra ngoài rồi tự gõ công thức chia tay từng ô và dùng AutoFilter',
      'Sửa trực tiếp bảng dữ liệu nguồn bằng cách chèn dòng Tổng cộng vào giữa bảng',
      'Đưa cột Số tiền vào vùng Rows và đưa cột Nhóm vào vùng Values',
    ],
    correctIndex: 0,
    explanation: `Trong Pivot Table, tính năng **Show Values As > % of Column Total** tự động tính tỷ trọng động ngay cả khi người dùng bấm chọn **Slicer**, hoàn toàn không cần copy ra ngoài viết công thức thủ công.`,
  })),

  // Topic 20: Thiết kế Conditional Formatting theo công thức dòng (khóa cột $F2)
  createParametricTopic('Tô màu toàn bộ dòng dữ liệu theo điều kiện bằng Conditional Formatting (khóa cột $F2)', (p) => ({
    scenario: `Trong ${p.contextName} (vùng dữ liệu \`A2:G100\`), bạn muốn tô nền màu đỏ cho **toàn bộ dòng từ cột A đến cột G** nếu ô trạng thái ở cột F của dòng đó có giá trị là \`"${p.statusAlert}"\`. Công thức trong Conditional Formatting Rule nào đúng?`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, p.amountHeader, p.statusHeader, 'Hiệu ứng mong muốn'],
      rows: [
        [p.docSamples[0], p.groupTarget, p.amounts[0], p.statusAlert, 'Tô đỏ cả dòng từ A2 đến G2'],
        [p.docSamples[1], p.groupOther, p.amounts[1], p.statusNormal, 'Giữ nguyên nền trắng'],
      ],
    },
    options: [
      `=$F2="${p.statusAlert}"`,
      `=F2="${p.statusAlert}"`,
      `=$F$2="${p.statusAlert}"`,
      `=COUNTIF($F$2:$F$100, "${p.statusAlert}")`,
    ],
    correctIndex: 0,
    explanation: `Muốn tô màu cả dòng từ cột A đến cột G dựa theo giá trị ở cột F, phải dùng tham chiếu hỗn hợp **khóa cột F nhưng thả tự do dòng 2** (\`=$F2="${p.statusAlert}"\`). Nếu viết \`=F2=...\` chỉ cột A được tô màu; nếu viết \`=$F$2=...\` cả bảng sẽ ăn theo duy nhất dòng 2!`,
  })),
];

// ============================================================================
// 3. NGÂN HÀNG CÂU HỎI NÂNG CAO (ADVANCED: 30 CHỦ ĐỀ × 4 MẢNG = 120 CÂU)
// ============================================================================
const ADVANCED_TOPICS: MultiDomainTopic[] = [
  // Topic 1: Power Query Left Anti Join tìm chênh lệch đối soát
  createParametricTopic('Power Query: Đối soát tìm dòng chênh lệch bằng Left Anti Join', (p) => ({
    scenario: `Trong quy trình đối soát ${p.contextName}, bạn có Bảng A (dữ liệu hệ thống đối tác/thực tế) và Bảng B (dữ liệu đã ghi nhận nội bộ). Cần lọc ra những dòng **chỉ có ở Bảng A nhưng chưa có ở Bảng B** để xử lý bổ sung.`,
    sampleTable: {
      headers: ['Bảng A (Nguồn đối chiếu)', 'Bảng B (Sổ nội bộ)', 'Mục tiêu trích xuất'],
      rows: [
        [p.docSamples[0], p.docSamples[0], 'Đã khớp (Bỏ qua)'],
        [p.docSamples[1], 'Không có mã này', 'Cần lấy ra để xử lý!'],
        [p.docSamples[2], p.docSamples[2], 'Đã khớp (Bỏ qua)'],
      ],
    },
    options: [
      'Merge Queries với kiểu JoinKind.LeftAnti (Left Anti Join)',
      'Merge Queries với kiểu JoinKind.Inner (Inner Join)',
      'Merge Queries với kiểu JoinKind.LeftOuter (Left Outer Join)',
      'Append Queries (Table.Combine)',
    ],
    correctIndex: 0,
    explanation: `**Left Anti Join** giữ lại duy nhất các dòng xuất hiện ở bảng bên trái (Bảng A) mà không có khóa tương ứng ở bảng bên phải (Bảng B) — đây là công cụ số 1 cho mọi bài toán đối soát sao kê, công nợ, kiểm kê kho và chấm công.`,
  })),

  // Topic 2: Power Query Left Outer Join map thông tin danh mục
  createParametricTopic('Power Query: Bổ sung thông tin từ bảng Danh mục bằng Left Outer Join', (p) => ({
    scenario: `Cần giữ nguyên 100% các dòng phát sinh của ${p.contextName} và ghép thêm cột \`${p.masterValHeader}\` từ bảng danh mục \`${p.masterSheet}\`. Phép ghép nào trong Power Query là đúng chuẩn?`,
    sampleTable: {
      headers: [`Bảng phát sinh (${p.contextName})`, `Bảng danh mục (${p.masterSheet})`, 'Bảng kết quả sau Merge'],
      rows: [
        [`Giữ nguyên mọi dòng giao dịch`, `Tra theo ${p.masterKeyHeader}`, `Có thêm cột ${p.masterValHeader}`],
      ],
    },
    options: [
      'Left Outer Join (Giữ toàn bộ bảng trái, lấy thông tin khớp từ bảng phải)',
      'Inner Join (Chỉ giữ những dòng có mặt ở cả hai bảng)',
      'Right Anti Join (Chỉ lấy những dòng danh mục chưa phát sinh giao dịch)',
      'Table.UnpivotOtherColumns',
    ],
    correctIndex: 0,
    explanation: `Khi map danh mục vào bảng giao dịch (Fact Table), luôn dùng **Left Outer Join** để đảm bảo không bị rơi mất bất kỳ giao dịch nào ngay cả khi mã mới chưa kịp khai báo trong bảng danh mục (nếu dùng Inner Join sẽ làm mất dòng giao dịch!).`,
  })),

  // Topic 3: Power Query Unpivot Other Columns chuyển bảng ngang thành dọc
  createParametricTopic('Power Query: Chuyển báo cáo nhiều cột tháng nằm ngang về bảng phẳng chuẩn bằng Unpivot', (p) => ({
    scenario: `File ${p.contextName} nhận từ các bộ phận đang thiết kế theo dạng ma trận ngang: Cột 1 là \`${p.groupHeader}\`, Cột 2 là \`${p.ownerHeader}\`, tiếp theo là 12 cột \`Tháng 01, Tháng 02... Tháng 12\`. Làm sao chuyển về bảng dọc để nạp vào Pivot/Data Model bền vững nhất khi sang tháng mới?`,
    sampleTable: {
      headers: [p.groupHeader, p.ownerHeader, 'Tháng 01', 'Tháng 02', 'Tháng 03', 'Cấu trúc đích cần có'],
      rows: [
        [p.groupTarget, p.ownerTarget, p.amounts[0], p.amounts[1], p.amounts[2], `${p.groupHeader} | ${p.ownerHeader} | Kỳ | Giá trị`],
      ],
    },
    options: [
      `Chọn 2 cột khóa (${p.groupHeader}, ${p.ownerHeader}) rồi bấm Unpivot Other Columns (Table.UnpivotOtherColumns)`,
      'Chọn đúng 3 cột Tháng 01, Tháng 02, Tháng 03 rồi bấm Unpivot Selected Columns',
      'Dùng Transpose để đảo toàn bộ dòng thành cột',
      'Dùng Group By trên từng cột tháng riêng lẻ',
    ],
    correctIndex: 0,
    explanation: `Bằng cách chọn các cột định danh cố định (\`${p.groupHeader}\`, \`${p.ownerHeader}\`) rồi chọn **Unpivot Other Columns**, khi tháng sau file nguồn có thêm cột \`Tháng 04, Tháng 05...\`, Power Query sẽ tự động xoay luôn các cột tháng mới mà không cần sửa lại query!`,
  })),

  // Topic 4: Power Query xử lý lỗi dữ liệu bẩn bằng try ... otherwise
  createParametricTopic('Power Query M: Chống gãy tiến trình Refresh bằng biểu thức try ... otherwise', (p) => ({
    scenario: `Trong query làm sạch ${p.contextName}, cột \`[${p.amountHeader}]\` đôi khi bị người dùng gõ chữ \`"Chưa có"\` hoặc \`"N/A"\` làm bước chuyển kiểu số báo lỗi \`DataFormat.Error\`. Biểu thức Custom Column nào trong ngôn ngữ M xử lý an toàn về số 0?`,
    sampleTable: {
      headers: [p.docHeader, `Cột gốc [${p.amountHeader}]`, 'Giá trị sau khi xử lý an toàn'],
      rows: [
        [p.docSamples[0], `"${p.amounts[0]}"`, p.amounts[0]],
        [p.docSamples[1], '"N/A"', '0 (Không làm dừng Query)'],
      ],
    },
    options: [
      `try Number.FromText(Text.Replace([${p.amountHeader}], ".", "")) otherwise 0`,
      `IFERROR(Number.FromText([${p.amountHeader}]), 0)`,
      `On Error Resume Next Number.FromText([${p.amountHeader}])`,
      `Text.Trim([${p.amountHeader}]) = 0`,
    ],
    correctIndex: 0,
    explanation: `Ngôn ngữ M trong Power Query không dùng \`IFERROR\` (của Excel) hay \`On Error\` (của VBA), mà sử dụng cấu trúc \`try <biểu_thức> otherwise <giá_trị_dự_phòng>\` (chữ thường toàn bộ).`,
  })),

  // Topic 5: Power Query phân biệt chữ hoa/thường khi Merge/Group (Case Sensitivity)
  createParametricTopic('Power Query M: Bẫy phân biệt chữ Hoa - Thường (Case-Sensitive) khi nối bảng', (p) => ({
    scenario: `Khi nối (Merge) bảng ${p.contextName} với bảng \`${p.masterSheet}\` trong Power Query, mã \`"key-01"\` và \`"KEY-01"\` bị coi là 2 mã hoàn toàn khác nhau khiến dữ liệu trả về \`null\` (trong khi VLOOKUP ngoài Excel vẫn khớp). Cần chuẩn hóa cột khóa bằng hàm M nào trước khi Merge?`,
    sampleTable: {
      headers: ['Khóa bảng giao dịch', `Khóa bảng ${p.masterSheet}`, 'Kết quả Merge nếu không chuẩn hóa'],
      rows: [
        ['" key-01 "', '"KEY-01"', 'null (Power Query phân biệt hoa/thường)'],
      ],
    },
    options: [
      'Text.Upper(Text.Trim([Mã khóa]))',
      'UPPER(TRIM([Mã khóa]))',
      'Table.Distinct([Mã khóa])',
      'Number.FromText([Mã khóa])',
    ],
    correctIndex: 0,
    explanation: `Khác với công thức Excel trên sheet, ngôn ngữ M trong Power Query **phân biệt tuyệt đối chữ hoa và chữ thường** (\`"hn" <> "HN"\`). Do đó trước mọi bước Merge hoặc Group By, luôn phải đồng bộ bằng \`Text.Upper(Text.Trim(...))\`.`,
  })),

  // Topic 6: Power Query Fill Down xử lý báo cáo gộp ô (Merged Cells)
  createParametricTopic('Power Query: Xử lý bảng nguồn bị Merge Cells (ô trống bên dưới tiêu đề nhóm) bằng Fill Down', (p) => ({
    scenario: `File ${p.contextName} xuất từ phần mềm kế toán/ERP bị gộp ô (Merge Cells) ở cột \`${p.groupHeader}\`: chỉ dòng đầu tiên có tên \`"${p.groupTarget}"\`, còn các dòng chi tiết bên dưới bị \`null\`. Thao tác chuẩn trong Power Query là gì?`,
    sampleTable: {
      headers: [p.groupHeader, p.docHeader, p.amountHeader],
      rows: [
        [p.groupTarget, p.docSamples[0], p.amounts[0]],
        ['null (do bỏ Merge)', p.docSamples[1], p.amounts[1]],
        ['null (do bỏ Merge)', p.docSamples[2], p.amounts[2]],
      ],
    },
    options: [
      'Transform > Fill > Down (Table.FillDown) trên cột nhóm',
      'Home > Remove Rows > Remove Blank Rows',
      'Transform > Unpivot Columns',
      'Replace Values null bằng 0',
    ],
    correctIndex: 0,
    explanation: `Nếu bấm **Remove Blank Rows** hoặc lọc bỏ \`null\`, bạn sẽ xóa mất toàn bộ các dòng giao dịch chi tiết! Phải dùng **Fill Down (\`Table.FillDown\`)** để lấp đầy tên \`"${p.groupTarget}"\` từ dòng trên xuống các dòng \`null\` phía dưới.`,
  })),

  // Topic 7: Power Query kiến trúc Staging (Raw -> Staging -> Fact -> Report)
  createParametricTopic('Power Query: Thiết kế kiến trúc Pipeline nhiều tầng chống vỡ file', (p) => ({
    scenario: `Khi xây dựng hệ thống tự động hóa cho ${p.contextName} nhận dữ liệu từ 12 file tháng và 3 bảng danh mục, cách tổ chức các Query nào giúp file dễ bảo trì và không phải sửa lại toàn bộ khi file nguồn thay đổi?`,
    sampleTable: {
      headers: ['Tầng 1 (Raw)', 'Tầng 2 (Staging)', 'Tầng 3 (Business/Fact)', 'Tầng 4 (Report)'],
      rows: [
        ['Kết nối Folder/File gốc', 'Làm sạch, chuẩn hóa kiểu dữ liệu', 'Join danh mục, tính cột nghiệp vụ', 'Đổ ra Pivot / Dashboard'],
      ],
    },
    options: [
      'Tách thành các lớp Reference: raw_ (nạp thô) -> stg_ (làm sạch) -> dim_/fact_ (nghiệp vụ) -> rpt_ (báo cáo)',
      'Nhồi toàn bộ 40 bước kết nối, làm sạch, gộp bảng và xoay bảng vào duy nhất 1 Query',
      'Load toàn bộ các bảng thô ra từng sheet Excel trước rồi dùng VLOOKUP nối lại',
      'Copy từng file tháng dán nối đuôi thủ công trước khi đưa vào Power Query',
    ],
    correctIndex: 0,
    explanation: `Phân tầng \`raw_ -> stg_ -> fact_ -> rpt_\` (đặt chế độ *Connection Only* cho các tầng trung gian) giúp cô lập lỗi: nếu nguồn thay đổi cấu trúc, bạn chỉ cần sửa duy nhất ở tầng \`stg_\` mà toàn bộ báo cáo phía sau vẫn giữ nguyên.`,
  })),

  // Topic 8: Power Query gộp nhiều Table trong cùng Workbook (tránh đệ quy chính bảng kết quả)
  createParametricTopic('Power Query M: Gộp nhiều sheet/table trong cùng Workbook và tránh lỗi tự nhân đôi', (p) => ({
    scenario: `Bạn dùng \`Excel.CurrentWorkbook()\` để gộp các bảng dữ liệu của ${p.contextName} (\`tbl_Ky1, tbl_Ky2...\`) rồi đổ kết quả ra sheet \`TongHop\` (tạo thành bảng \`rpt_TongHop\`). Tại sao mỗi lần bấm Refresh, số dòng lại bị nhân đôi gấp 2 lần và cách khắc phục là gì?`,
    sampleTable: {
      headers: ['Tên Table trong Workbook', 'Nguồn gốc', 'Hành động đúng trong Power Query'],
      rows: [
        ['tbl_Ky1, tbl_Ky2', 'Bảng dữ liệu nguồn', 'Giữ lại để gộp (Table.Combine)'],
        ['rpt_TongHop', 'Bảng kết quả do chính Query sinh ra', 'Phải lọc bỏ trước khi Combine!'],
      ],
    },
    options: [
      'Do Excel.CurrentWorkbook() đọc luôn cả bảng kết quả rpt_TongHop; cần lọc giữ các bảng bắt đầu bằng "tbl_" (Text.StartsWith([Name], "tbl_")) trước khi Table.Combine',
      'Do hàm Table.Combine bị lỗi bộ nhớ đệm, phải dùng Table.Distinct sau mỗi lần gộp',
      'Do chưa tắt Background Refresh trong Query Options',
      'Do các bảng nguồn chưa được định dạng cùng màu sắc',
    ],
    correctIndex: 0,
    explanation: `Bẫy kinh điển nhất khi dùng \`Excel.CurrentWorkbook()\`: Khi kết quả query được Load ra một Table trong chính file đó, lần Refresh tiếp theo \`Excel.CurrentWorkbook()\` sẽ đọc luôn cả bảng tổng hợp và cộng dồn vào chính nó! Bắt buộc phải thêm bước \`Table.SelectRows(Source, each Text.StartsWith([Name], "tbl_"))\`.`,
  })),

  // Topic 9: Power Query M tách chuỗi bằng Text.BeforeDelimiter / Text.AfterDelimiter
  createParametricTopic('Power Query M: Tách mã chứng từ đa tầng bằng Text.BeforeDelimiter và Text.AfterDelimiter', (p) => ({
    scenario: `Cột mã trong ${p.contextName} có dạng \`"${p.docSamples[0]}"\` (độ dài các phần trước và sau dấu \`"-"\` thay đổi linh hoạt từ 2 đến 6 ký tự). Hàm M nào lấy chính xác phần mã đứng trước dấu gạch ngang đầu tiên?`,
    sampleTable: {
      headers: ['Cột [Mã chứng từ]', 'Dấu phân tách', 'Kết quả cần tách'],
      rows: [
        [p.docSamples[0], '"-"', p.codePrefix],
        [`${p.codePrefix}LONG-${p.codeMid}-09`, '"-"', `${p.codePrefix}LONG`],
      ],
    },
    options: [
      'Text.BeforeDelimiter([Mã chứng từ], "-")',
      'Text.Range([Mã chứng từ], 0, 3)',
      'Text.AfterDelimiter([Mã chứng từ], "-")',
      'LEFT([Mã chứng từ], FIND("-", [Mã chứng từ])-1)',
    ],
    correctIndex: 0,
    explanation: `Khi độ dài tiền tố mã thay đổi linh hoạt (\`3\` hoặc \`7\` ký tự), dùng \`Text.Range\` cố định số ký tự sẽ cắt sai. Hàm M \`Text.BeforeDelimiter([Mã chứng từ], "-")\` tự động lấy toàn bộ ký tự đứng trước dấu \`"-"\` đầu tiên.`,
  })),

  // Topic 10: Power Query M chuẩn hóa độ dài mã bằng Text.PadStart
  createParametricTopic('Power Query M: Bổ sung số 0 ở đầu mã bị mất bằng Text.PadStart', (p) => ({
    scenario: `Khi import file CSV vào ${p.contextName}, cột Mã định danh bị mất các số \`0\` ở đầu (ví dụ \`"45"\` hoặc \`"128"\` thay vì chuẩn 6 ký tự \`"000045"\`, \`"000128"\`). Hàm M nào chuẩn hóa toàn bộ về đủ 6 ký tự?`,
    sampleTable: {
      headers: ['Mã bị mất số 0 đầu', 'Độ dài chuẩn', 'Mã sau khi chuẩn hóa'],
      rows: [
        ['"45"', '6 ký tự', '"000045"'],
        ['"128"', '6 ký tự', '"000128"'],
      ],
    },
    options: [
      'Text.PadStart(Text.From([Mã]), 6, "0")',
      'Text.PadEnd(Text.From([Mã]), 6, "0")',
      'Text.Combine({"000", Text.From([Mã])})',
      'Number.ToText([Mã], "0")',
    ],
    correctIndex: 0,
    explanation: `Hàm \`Text.PadStart(text, count, character)\` tự động tính số ký tự còn thiếu để chèn đúng bấy nhiêu chữ số \`"0"\` vào đầu chuỗi cho đủ độ dài \`6\` ký tự (còn \`Text.Combine\` nối cứng \`"000"\` sẽ làm các mã có độ dài lệch nhau!).`,
  })),

  // Topic 11: Power Query M Table.Group tổng hợp nhiều chỉ số cùng lúc
  createParametricTopic('Power Query M: Gom nhóm và tính tổng hợp bằng Table.Group', (p) => ({
    scenario: `Trong query xử lý ${p.contextName}, bạn cần gom nhóm theo cột \`"${p.groupHeader}"\` để tính đồng thời Tổng \`[${p.amountHeader}]\` và Số lượng dòng phát sinh. Bước biến đổi nào được sinh ra?`,
    sampleTable: {
      headers: [p.groupHeader, `Tổng ${p.amountHeader}`, 'Số dòng phát sinh'],
      rows: [
        [p.groupTarget, 'List.Sum([...])', 'Table.RowCount(_)'],
        [p.groupOther, 'List.Sum([...])', 'Table.RowCount(_)'],
      ],
    },
    options: [
      `Table.Group(Source, {"${p.groupHeader}"}, {{"Tổng tiền", each List.Sum([${p.amountHeader}]), type number}, {"Số dòng", each Table.RowCount(_), Int64.Type}})`,
      `Table.Pivot(Source, List.Distinct(Source[${p.groupHeader}]), "${p.groupHeader}", "${p.amountHeader}", List.Sum)`,
      `Table.SelectRows(Source, each [${p.groupHeader}] <> null)`,
      `Table.UnpivotOtherColumns(Source, {"${p.groupHeader}"}, "Thuộc tính", "Giá trị")`,
    ],
    correctIndex: 0,
    explanation: `\`Table.Group\` nhận danh sách các cột khóa nhóm \`{"${p.groupHeader}"}\` và danh sách các phép tổng hợp sử dụng hàm \`List.Sum\`, \`List.Average\` hoặc \`Table.RowCount(_)\`.`,
  })),

  // Topic 12: Power Query Merge 2 khóa đồng thời (Composite Key Join)
  createParametricTopic('Power Query: Chống nhân bản dòng (Cartesian Product) khi Merge bảng bằng Khóa kép', (p) => ({
    scenario: `Khi Merge bảng phát sinh ${p.contextName} với bảng Định mức theo duy nhất cột \`${p.groupHeader}\`, bạn phát hiện số dòng của bảng sau khi Expand bị phình gấp 4 lần (do mỗi \`${p.groupHeader}\` có 4 dòng \`${p.subGroupHeader}\` khác nhau trong bảng Định mức). Cách khắc phục chuẩn là gì?`,
    sampleTable: {
      headers: ['Nguyên nhân phình dòng', 'Khóa 1', 'Khóa 2', 'Kết quả sau khi chọn khóa kép'],
      rows: [
        ['Khóa bên bảng phải chưa duy nhất (1-nhiều)', p.groupHeader, p.subGroupHeader, 'Quan hệ 1-1: Giữ nguyên số dòng gốc'],
      ],
    },
    options: [
      `Giữ phím Ctrl chọn đồng thời cả 2 cột (${p.groupHeader} và ${p.subGroupHeader}) ở cả 2 bảng trong cửa sổ Merge Queries`,
      'Sau khi Expand xong thì bấm Remove Duplicates trên cột Số tiền',
      'Đổi từ Left Outer Join sang Full Outer Join',
      'Chia kết quả cột Số tiền cho 4 sau khi Merge',
    ],
    correctIndex: 0,
    explanation: `Trong Power Query, nếu khóa ở bảng danh mục không phải là khóa duy nhất (1-N), khi Expand sẽ làm nhân bản dòng giao dịch dẫn đến sai tổng tiền. Bạn phải giữ phím \`Ctrl\` chọn **khóa kép (Composite Key)** ở cả 2 bảng khi Merge.`,
  })),

  // Topic 13: VBA Tăng tốc độ chạy Macro và chống treo Excel (SafeMode Framework)
  createParametricTopic('VBA: Bộ 3 thuộc tính Application giúp tăng tốc Macro xử lý dữ liệu lớn gấp 10-20 lần', (p) => ({
    scenario: `Macro tự động hóa ${p.contextName} phải quét và ghi dữ liệu qua 5.000 dòng nhưng màn hình chớp nháy liên tục và mất tới 3 phút mới xong (do mỗi lần ghi 1 ô, Excel lại tính lại toàn bộ công thức trên Workbook). Cần tắt 3 thuộc tính nào ở đầu Macro?`,
    sampleTable: {
      headers: ['Thuộc tính Application', 'Trạng thái khi bắt đầu chạy', 'Trạng thái tại khối CleanUp cuối Sub'],
      rows: [
        ['ScreenUpdating', 'False (Tắt vẽ lại màn hình)', 'True'],
        ['Calculation', 'xlCalculationManual (Tắt tính lại công thức)', 'xlCalculationAutomatic'],
        ['EnableEvents', 'False (Tắt kích hoạt sự kiện chồng chéo)', 'True'],
      ],
    },
    options: [
      'Application.ScreenUpdating = False, Application.Calculation = xlCalculationManual, Application.EnableEvents = False',
      'Application.DisplayAlerts = True, ActiveWindow.Zoom = 50, Application.CutCopyMode = True',
      'On Error Resume Next, ActiveSheet.Select, Cells.Copy',
      'ThisWorkbook.Save, Application.Wait, DoEvents',
    ],
    correctIndex: 0,
    explanation: `Tắt bộ ba \`ScreenUpdating\`, \`Calculation\` và \`EnableEvents\` trước vòng lặp và khôi phục lại ở nhãn \`CleanExit:\` cuối thủ tục là nguyên tắc tối ưu tốc độ quan trọng nhất trong VBA thực chiến.`,
  })),

  // Topic 14: VBA Tìm dòng cuối chuẩn xác khi bảng có ô trống ở giữa
  createParametricTopic('VBA: Tìm dòng cuối thực sự của bảng động (bẫy dừng ở ô trống giữa bảng với xlDown)', (p) => ({
    scenario: `Trong sheet ${p.contextName}, cột A luôn có mã định danh liên tục còn các cột khác đôi khi có ô trống. Lệnh VBA nào tìm chính xác số thứ tự dòng cuối cùng có dữ liệu ở cột A mà không bị dừng giữa chừng?`,
    sampleTable: {
      headers: ['Dòng 1 (Header)', 'Dòng 2..150 (Dữ liệu)', 'Dòng 151..1048576 (Trống)', 'Hướng dò an toàn'],
      rows: [
        [p.docHeader, p.docSamples[0], 'Trống', 'Dò từ dòng cuối sheet (Rows.Count) ngược lên (xlUp)'],
      ],
    },
    options: [
      'lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row',
      'lastRow = ws.Range("A1").End(xlDown).Row',
      'lastRow = ws.UsedRange.Rows.Count',
      'lastRow = ActiveCell.Row',
    ],
    correctIndex: 0,
    explanation: `Dùng \`Range("A1").End(xlDown).Row\` sẽ dừng ngay tại ô trống đầu tiên giữa bảng (hoặc nhảy thẳng xuống dòng 1.048.576 nếu bảng chỉ có 1 dòng tiêu đề!). Còn \`UsedRange\` thường nhớ cả các dòng đã xóa nhưng còn định dạng. Chuẩn nhất luôn là \`ws.Cells(ws.Rows.Count, "A").End(xlUp).Row\`.`,
  })),

  // Topic 15: VBA Tránh dùng Select / Activate và gán giá trị trực tiếp
  createParametricTopic('VBA: Tối ưu lệnh copy/gán dữ liệu giữa 2 Sheet không dùng Select/Activate', (p) => ({
    scenario: `Khi chuyển dữ liệu đã xử lý của ${p.contextName} từ \`wsSource\` sang \`wsDest\`, đoạn code dùng \`wsSource.Activate -> Range(...).Select -> Selection.Copy\` rất chậm và hay báo lỗi \`1004\` nếu sheet đang ẩn. Cách viết nào chuẩn Object Model?`,
    sampleTable: {
      headers: ['Cách viết nghiệp dư (Chậm & Dễ lỗi)', 'Cách viết chuẩn Object Model (Nhanh & Chạy được cả khi Sheet ẩn)'],
      rows: [
        ['wsSource.Select : Range("A2:E100").Select : Selection.Copy', 'Tham chiếu trực tiếp qua biến đối tượng Worksheet và Range'],
      ],
    },
    options: [
      'wsDest.Range("A2:E100").Value = wsSource.Range("A2:E100").Value',
      'wsSource.Activate : ActiveSheet.Range("A2:E100").Copy : wsDest.Select : ActiveSheet.Paste',
      'Range("A2:E100").Select : Selection.Value = Selection.Value',
      'Application.Goto wsSource.Range("A2:E100")',
    ],
    correctIndex: 0,
    explanation: `Gán trực tiếp mảng giá trị \`.Value = .Value\` thông qua biến đối tượng \`wsDest\` và \`wsSource\` vừa không làm bẩn Clipboard của người dùng, vừa nhanh hơn \`Select/Copy/Paste\` hàng chục lần và hoạt động mượt ngay cả khi sheet nguồn đang ẩn.`,
  })),

  // Topic 16: VBA Xử lý lỗi an toàn với On Error GoTo và khôi phục trạng thái
  createParametricTopic('VBA: Cấu trúc bẫy lỗi On Error GoTo đảm bảo luôn bật lại Calculation khi xảy ra lỗi', (p) => ({
    scenario: `Trong Macro xử lý ${p.contextName}, bạn đã tắt \`Application.Calculation = xlCalculationManual\` ở đầu Sub. Nếu chẳng may file nguồn bị thiếu làm Macro văng lỗi giữa chừng, người dùng sẽ thấy toàn bộ Excel không tự tính công thức nữa. Cấu trúc xử lý lỗi nào giải quyết triệt để rủi ro này?`,
    sampleTable: {
      headers: ['Vấn đề khi lỗi giữa chừng', 'Giải pháp kiến trúc VBA'],
      rows: [
        ['Macro dừng đột ngột -> Calculation vẫn kẹt ở Manual', 'Dùng On Error GoTo ErrHandler và luôn đi qua nhãn CleanExit để khôi phục trạng thái'],
      ],
    },
    options: [
      'Đặt On Error GoTo ErrHandler ở đầu Sub, và trong cả CleanExit lẫn ErrHandler đều khôi phục Calculation = xlCalculationAutomatic',
      'Đặt On Error Resume Next ở dòng đầu tiên của mọi Macro để bỏ qua tất cả lỗi',
      'Không tắt Calculation nữa dù Macro chạy mất 15 phút',
      'Yêu cầu người dùng khởi động lại máy tính sau mỗi lần chạy Macro',
    ],
    correctIndex: 0,
    explanation: `Lạm dụng \`On Error Resume Next\` cho toàn bộ thủ tục sẽ làm Macro âm thầm xuất ra báo cáo sai số liệu mà không ai biết! Chuẩn mực là dùng \`On Error GoTo ErrHandler\`, thông báo rõ lỗi và luôn chạy qua khối \`CleanExit:\` để bật lại \`Calculation = xlCalculationAutomatic\`.`,
  })),

  // Topic 17: VBA Duyệt hàng loạt file trong Folder bằng hàm Dir
  createParametricTopic('VBA: Vòng lặp duyệt toàn bộ file Excel trong thư mục bằng hàm Dir()', (p) => ({
    scenario: `Bạn viết Macro quét toàn bộ các file \`.xlsx\` của ${p.contextName} trong thư mục \`folderPath\`. Trong vòng lặp \`Do While fileName <> ""\`, nếu quên viết dòng lệnh \`fileName = Dir\` ở cuối vòng lặp thì điều gì sẽ xảy ra?`,
    sampleTable: {
      headers: ['Trước vòng lặp', 'Bên trong Do While fileName <> ""', 'Cuối vòng lặp (Trước Loop)'],
      rows: [
        ['fileName = Dir(folderPath & "*.xlsx")', 'Mở và xử lý file hiện tại', 'fileName = Dir (Lấy file tiếp theo)'],
      ],
    },
    options: [
      'Vòng lặp bị treo vô tận (Infinite Loop) vì xử lý đi xử lý lại mãi file đầu tiên',
      'VBA tự động chuyển sang file tiếp theo mà không cần gọi lại hàm Dir',
      'Macro chỉ chạy đúng 1 lần rồi tự thoát',
      'VBA xóa toàn bộ các file trong thư mục',
    ],
    correctIndex: 0,
    explanation: `Trong VBA, lần gọi đầu tiên \`fileName = Dir(folderPath & "*.xlsx")\` lấy tên file thứ nhất. Ở cuối thân vòng lặp \`Do While ... Loop\`, bắt buộc phải gọi \`fileName = Dir\` (không tham số) để lấy file kế tiếp, nếu quên sẽ gây treo Excel do lặp vô hạn trên file đầu tiên!`,
  })),

  // Topic 18: VBA Tách báo cáo chỉ copy các dòng đang hiển thị sau AutoFilter (xlCellTypeVisible)
  createParametricTopic('VBA: Tách báo cáo theo từng đơn vị bằng AutoFilter và SpecialCells(xlCellTypeVisible)', (p) => ({
    scenario: `Khi viết Macro lọc ${p.contextName} theo từng \`${p.groupHeader}\` (ví dụ \`"${p.groupTarget}"\`) để tách ra từng file riêng gửi đi, lệnh nào đảm bảo chỉ copy các dòng thỏa điều kiện đang hiển thị?`,
    sampleTable: {
      headers: ['Bước 1', 'Bước 2 (Copy vùng đã lọc)', 'Bước 3'],
      rows: [
        [`AutoFilter Field:=2, Criteria1:="${p.groupTarget}"`, 'Chỉ lấy các ô hiển thị (Visible Cells)', 'Dán sang Workbook mới và SaveAs'],
      ],
    },
    options: [
      'ws.Range("A1:G" & lastRow).SpecialCells(xlCellTypeVisible).Copy',
      'ws.Range("A1:G" & lastRow).SpecialCells(xlCellTypeBlanks).Copy',
      'ws.Cells.Copy',
      'ws.Range("A1:G" & lastRow).ClearContents',
    ],
    correctIndex: 0,
    explanation: `Phương thức \`.SpecialCells(xlCellTypeVisible)\` đảm bảo chỉ lấy các dòng đang hiển thị sau khi \`AutoFilter\`, rất an toàn và chuẩn xác khi viết Macro tách báo cáo hàng loạt.`,
  })),

  // Topic 19: VBA Xuất PDF tự động và tự tạo thư mục Output
  createParametricTopic('VBA: Tự động kiểm tra tạo thư mục Output và xuất báo cáo ra PDF', (p) => ({
    scenario: `Macro chốt sổ ${p.contextName} cần xuất sheet báo cáo ra file PDF vào thư mục \`ThisWorkbook.Path & "\\Output"\`. Nếu thư mục \`Output\` chưa tồn tại mà gọi thẳng \`ExportAsFixedFormat\` thì sẽ báo lỗi. Cặp lệnh kiểm tra và xuất PDF nào đúng?`,
    sampleTable: {
      headers: ['Bước 1: Kiểm tra & Tạo Folder', 'Bước 2: Xuất Sheet hiện tại sang PDF'],
      rows: [
        ['If Dir(outPath, vbDirectory) = "" Then MkDir outPath', 'ws.ExportAsFixedFormat Type:=xlTypePDF, Filename:=...'],
      ],
    },
    options: [
      'If Dir(outPath, vbDirectory) = "" Then MkDir outPath kết hợp ws.ExportAsFixedFormat Type:=xlTypePDF, Filename:=...',
      'ws.SaveAs Filename:=outPath & "\\report.pdf", FileFormat:=xlOpenXMLWorkbook',
      'MkDir outPath mỗi lần chạy mà không cần kiểm tra Dir(..., vbDirectory)',
      'Application.PrintOut Filename:=outPath',
    ],
    correctIndex: 0,
    explanation: `Nếu gọi \`MkDir outPath\` khi thư mục đã tồn tại, VBA sẽ báo lỗi \`Run-time error 75: Path/File access error\`. Do đó phải kiểm tra \`If Dir(outPath, vbDirectory) = "" Then MkDir outPath\` trước, sau đó dùng \`ExportAsFixedFormat Type:=xlTypePDF\`.`,
  })),

  // Topic 20: VBA Gửi email Outlook tự động (kiểm thử bằng .Display trước khi .Send)
  createParametricTopic('VBA: Tự động hóa gửi báo cáo qua Outlook an toàn bằng Late Binding', (p) => ({
    scenario: `Khi viết Macro đính kèm file báo cáo ${p.contextName} gửi qua Outlook cho 20 đầu mối, thực hành nào giúp tránh gửi nhầm file hoặc gửi nhầm người nhận trong giai đoạn kiểm thử?`,
    sampleTable: {
      headers: ['Phương thức của MailItem', 'Tác dụng thực tế'],
      rows: [
        ['.Display', 'Mở cửa sổ email lên màn hình để kiểm tra người nhận, tiêu đề và file đính kèm trước khi bấm gửi'],
        ['.Send', 'Gửi thẳng email đi ngay lập tức trong nền'],
      ],
    },
    options: [
      'Khởi tạo bằng CreateObject("Outlook.Application"), kiểm tra file đính kèm tồn tại bằng Dir(filePath) <> "" và dùng .Display để kiểm duyệt trước khi đổi sang .Send',
      'Luôn chạy thẳng .Send với On Error Resume Next để nếu thiếu file đính kèm thì vẫn gửi email trống đi',
      'Dùng lệnh Application.SendKeys để giả lập gõ phím trong Outlook',
      'Gộp tất cả 20 file của 20 bộ phận vào chung 1 email gửi cho tất cả mọi người',
    ],
    correctIndex: 0,
    explanation: `Trong tự động hóa gửi báo cáo (đặc biệt là công nợ, doanh số, phiếu lương), luôn phải kiểm tra \`Dir(filePath) <> ""\` để chắc chắn file đính kèm đã xuất thành công và dùng \`.Display\` kiểm tra mẫu trước khi kích hoạt \`.Send\`.`,
  })),

  // Topic 21: Hàm mảng SUMPRODUCT tính tổng có trọng số / tích 2 cột không cần cột phụ
  createParametricTopic('Hàm mảng: Tính tổng tích hai cột có điều kiện bằng SUMPRODUCT không cần cột phụ', (p) => ({
    scenario: `Trong bảng chi tiết của ${p.contextName}, Cột B là \`${p.groupHeader}\`, Cột C là Số lượng/Khối lượng, Cột D là Đơn giá/Định mức. Không được thêm cột phụ Thành tiền, công thức nào tính trực tiếp Tổng thành tiền của riêng \`"${p.groupTarget}"\`?`,
    sampleTable: {
      headers: [p.docHeader, p.groupHeader, 'Số lượng (C)', 'Đơn giá (D)', 'Yêu cầu'],
      rows: [
        [p.docSamples[0], p.groupTarget, '100', '250.000', `Tính tổng (C*D) của riêng ${p.groupTarget}`],
        [p.docSamples[1], p.groupOther, '50', '300.000', 'Bỏ qua'],
        [p.docSamples[2], p.groupTarget, '80', '200.000', `Cộng dồn vào tổng ${p.groupTarget}`],
      ],
    },
    options: [
      `=SUMPRODUCT((B2:B100="${p.groupTarget}") * C2:C100 * D2:D100)`,
      `=SUMIFS(C2:C100 * D2:D100, B2:B100, "${p.groupTarget}")`,
      `=SUMIF(B2:B100, "${p.groupTarget}", C2:C100) * SUM(D2:D100)`,
      `=AVERAGEIFS(C2:C100, B2:B100, "${p.groupTarget}")`,
    ],
    correctIndex: 0,
    explanation: `Bẫy nâng cao: Hàm \`SUMIFS\` KHÔNG chấp nhận biểu thức mảng \`C2:C100 * D2:D100\` ở đối số \`sum_range\` (Excel sẽ báo lỗi công thức!). Ngược lại, \`=SUMPRODUCT((B2:B100="${p.groupTarget}") * C2:C100 * D2:D100)\` nhân từng dòng thỏa điều kiện rồi cộng tổng lại cực kỳ gọn gàng.`,
  })),

  // Topic 22: Tra cứu 2 chiều (Ma trận Dòng × Cột) bằng INDEX + MATCH + MATCH
  createParametricTopic('Tra cứu ma trận 2 chiều (Dòng và Cột biến động) bằng INDEX + MATCH + MATCH', (p) => ({
    scenario: `Bạn có bảng ma trận định mức của ${p.contextName} tại vùng \`$G$2:$J$10\`, trong đó cột \`$F$2:$F$10\` chứa danh sách \`${p.groupHeader}\` và dòng tiêu đề \`$G$1:$J$1\` chứa danh sách \`${p.subGroupHeader}\`. Công thức nào tra cứu chính xác theo cả ô \`B2\` (dòng) và \`C2\` (cột)?`,
    sampleTable: {
      headers: [`F1: ${p.groupHeader} \\ ${p.subGroupHeader}`, `G1: ${p.subGroupTarget}`, `H1: ${p.subGroupOther}`, 'I1: Nhóm 3', 'J1: Nhóm 4'],
      rows: [
        [`F2: ${p.groupTarget}`, p.amounts[0], p.amounts[1], '...', '...'],
        [`F3: ${p.groupOther}`, p.amounts[2], p.amounts[0], '...', '...'],
      ],
    },
    options: [
      `=INDEX($G$2:$J$10, MATCH(B2, $F$2:$F$10, 0), MATCH(C2, $G$1:$J$1, 0))`,
      `=INDEX($F$1:$J$10, MATCH(C2, $F$2:$F$10, 0), MATCH(B2, $G$1:$J$1, 0))`,
      `=VLOOKUP(B2, $F$2:$J$10, MATCH(C2, $G$1:$J$1, 1), 0)`,
      `=XLOOKUP(B2, $G$1:$J$1, $F$2:$F$10)`,
    ],
    correctIndex: 0,
    explanation: `Trong \`INDEX(array, row_num, column_num)\`, vùng dữ liệu lõi là \`$G$2:$J$10\`, tọa độ dòng được xác định bởi \`MATCH(B2, $F$2:$F$10, 0)\` và tọa độ cột được xác định bởi \`MATCH(C2, $G$1:$J$1, 0)\`.`,
  })),

  // Topic 23: Tài chính - Hàm PMT tính tiền trả định kỳ hàng tháng (quy đổi lãi suất và kỳ hạn)
  createParametricTopic('Mô hình Tài chính: Tính khoản thanh toán định kỳ hàng tháng bằng hàm PMT', (p) => ({
    scenario: `Để đầu tư nâng cấp hệ thống phục vụ ${p.contextName}, công ty vay ngân hàng Số tiền gốc tại ô \`B2\`, Lãi suất danh nghĩa theo NĂM tại ô \`C2\` (ví dụ 9,6%/năm), Thời hạn vay tính theo NĂM tại ô \`D2\` (ví dụ 5 năm), trả gốc và lãi đều hàng tháng. Công thức nào trả về số tiền phải trả mỗi tháng dưới dạng số dương?`,
    sampleTable: {
      headers: ['Khoản mục đầu tư (A)', 'Gốc vay (B2)', 'Lãi suất/năm (C2)', 'Số năm vay (D2)', 'Trả đều hàng tháng (E2)'],
      rows: [
        [p.contextName, '1.200.000.000', '9,6%', '5', '= ?'],
      ],
    },
    options: [
      `=PMT(C2/12, D2*12, -B2)`,
      `=PMT(C2, D2, -B2)`,
      `=PMT(C2/12, D2, -B2)`,
      `=PMT(C2*12, D2/12, B2)`,
    ],
    correctIndex: 0,
    explanation: `Vì kỳ thanh toán là HÀNG THÁNG, bạn bắt buộc phải quy đổi cả lãi suất năm sang lãi suất tháng (\`rate = C2/12\`) và số năm sang tổng số tháng (\`nper = D2*12\`), đồng thời đặt dấu trừ \`-B2\` để dòng tiền trả ra hiển thị dương.`,
  })),

  // Topic 24: Tài chính - Bẫy hàm NPV với vốn đầu tư Năm 0 vs XNPV
  createParametricTopic('Mô hình Tài chính: Bẫy chiết khấu dòng tiền Năm 0 trong hàm NPV của Excel', (p) => ({
    scenario: `Khi lập bảng dòng tiền dự án cho ${p.contextName} với suất chiết khấu WACC tại ô \`B1\`, vốn đầu tư ban đầu tại thời điểm t=0 nằm ở ô \`C2\` (số âm), và dòng tiền thuần từ Năm 1 đến Năm 5 nằm ở vùng \`C3:C7\`. Công thức tính NPV nào là ĐÚNG?`,
    sampleTable: {
      headers: ['Thời điểm', 'Ô dữ liệu', 'Giá trị dòng tiền'],
      rows: [
        ['Suất chiết khấu WACC', 'B1', '11,5%'],
        ['Năm 0 (Giải ngân ban đầu)', 'C2', '-800.000.000'],
        ['Năm 1 -> Năm 5', 'C3:C7', '+240tr -> +350tr'],
      ],
    },
    options: [
      `=NPV(B1, C3:C7) + C2`,
      `=NPV(B1, C2:C7)`,
      `=NPV(B1, C3:C7) - C2`,
      `=IRR(C2:C7) / B1`,
    ],
    correctIndex: 0,
    explanation: `Bẫy kinh điển nhất trong Excel Tài chính: Hàm \`NPV(rate, value1, ...)\` luôn giả định ô đầu tiên trong dãy xuất hiện ở **cuối Kỳ 1**! Nếu bạn quét \`=NPV(B1, C2:C7)\`, khoản vốn Năm 0 (\`C2\`) cũng bị chia cho \`(1+WACC)\`. Phải tính \`=NPV(B1, C3:C7) + C2\` (vì \`C2\` đã mang dấu âm).`,
  })),

  // Topic 25: Tài chính - Khi nào dùng XNPV và XIRR thay cho NPV/IRR
  createParametricTopic('Mô hình Tài chính: Đánh giá dòng tiền phát sinh không đều kỳ bằng XNPV và XIRR', (p) => ({
    scenario: `Trong thực tế vận hành ${p.contextName}, các khoản thu/chi không rơi đúng vào ngày 31/12 hàng năm mà phát sinh rải rác vào các ngày cụ thể trong năm (vùng Ngày tại \`B2:B15\`, vùng Dòng tiền tại \`C2:C15\`, lãi suất năm tại \`F1\`). Cặp hàm nào cho kết quả chính xác nhất?`,
    sampleTable: {
      headers: ['Ngày thực tế (B2:B15)', 'Dòng tiền thực tế (C2:C15)', 'Lãi suất chiết khấu năm (F1)'],
      rows: [
        ['12/01/2026', '-500.000.000', '12%'],
        ['19/04/2026', '+180.000.000', ''],
        ['05/11/2026', '+410.000.000', ''],
      ],
    },
    options: [
      `=XNPV(F1, C2:C15, B2:B15) và =XIRR(C2:C15, B2:B15)`,
      `=NPV(F1, C2:C15) và =IRR(C2:C15)`,
      `=PMT(F1, B2:B15, C2:C15)`,
      `=SUMIFS(C2:C15, B2:B15, F1)`,
    ],
    correctIndex: 0,
    explanation: `\`XNPV(rate, values, dates)\` và \`XIRR(values, dates)\` chiết khấu chính xác theo số ngày thực tế chênh lệch giữa từng dòng tiền so với ngày đầu tiên (\`(Date_i - Date_0)/365\`), khắc phục hoàn toàn sai lệch của \`NPV/IRR\` truyền thống.`,
  })),

  // Topic 26: Tài chính doanh nghiệp - Công thức dòng tiền tự do FCFF
  createParametricTopic('Phân tích Tài chính (CFA/FP&A): Xây dựng cầu nối dòng tiền tự do doanh nghiệp (FCFF)', (p) => ({
    scenario: `Khi lập mô hình tài chính dài hạn từ số liệu ${p.contextName}, biết Lợi nhuận trước lãi vay và thuế là \`EBIT\`, thuế suất TNDN là \`T\`, chi phí Khấu hao là \`D&A\`, chi đầu tư tài sản cố định là \`Capex\` và mức tăng vốn lưu động ròng là \`Delta NWC\`. Công thức tính \`FCFF\` chuẩn là gì?`,
    sampleTable: {
      headers: ['Chỉ tiêu đầu vào', 'Tác động đến dòng tiền mặt thực tế'],
      rows: [
        ['EBIT * (1 - T)', 'Lợi nhuận hoạt động sau thuế (NOPAT)'],
        ['+ Khấu hao (D&A)', 'Cộng trả lại vì khấu hao là chi phí phi tiền mặt'],
        ['- Capex - Delta NWC', 'Trừ tiền chi mua TSCĐ và tiền bị chiếm dụng thêm trong vốn lưu động'],
      ],
    },
    options: [
      'FCFF = EBIT * (1 - T) + Khấu hao - Capex - Delta NWC',
      'FCFF = EBIT + Khấu hao + Capex + Delta NWC',
      'FCFF = Doanh thu - Giá vốn - Thuế TNDN',
      'FCFF = Lợi nhuận sau thuế - Cổ tức tiền mặt',
    ],
    correctIndex: 0,
    explanation: `Công thức chuẩn mực của **Free Cash Flow to the Firm (FCFF)**: bắt đầu từ \`NOPAT = EBIT*(1-T)\`, cộng lại chi phí phi tiền mặt (\`Khấu hao\`), trừ đi chi đầu tư mở rộng (\`Capex\`) và trừ đi phần tăng thêm của vốn lưu động ròng (\`Delta NWC\`).`,
  })),

  // Topic 27: Tài chính doanh nghiệp - Công thức WACC và lá chắn thuế lãi vay
  createParametricTopic('Phân tích Tài chính (CFA/FP&A): Tính chi phí vốn bình quân gia quyền WACC và Lá chắn thuế', (p) => ({
    scenario: `Doanh nghiệp có tỷ trọng Vốn chủ sở hữu \`E/V = 60%\` với chi phí vốn chủ \`Re = 14%\` (tính từ CAPM: \`Re = Rf + Beta*(Rm - Rf)\`), tỷ trọng Nợ vay \`D/V = 40%\` với lãi suất vay trước thuế \`Rd = 9%\`, thuế suất TNDN \`T = 20%\`. Công thức tính WACC đúng trong Excel là gì?`,
    sampleTable: {
      headers: ['Nguồn vốn', 'Tỷ trọng', 'Chi phí trước thuế', 'Sau lá chắn thuế (T = 20%)'],
      rows: [
        ['Vốn chủ sở hữu (E)', '60%', 'Re = 14%', '14,0%'],
        ['Nợ vay (D)', '40%', 'Rd = 9%', '9% * (1 - 20%) = 7,2%'],
      ],
    },
    options: [
      `= 60% * 14% + 40% * 9% * (1 - 20%)  (Kết quả = 11,28%)`,
      `= 60% * 14% + 40% * 9%  (Kết quả = 12,00%)`,
      `= (60% * 14% + 40% * 9%) * (1 - 20%)`,
      `= (14% + 9%) / 2`,
    ],
    correctIndex: 0,
    explanation: `Chi phí lãi vay được khấu trừ khi tính thuế TNDN nên tạo ra **Lá chắn thuế (Tax Shield)**. Do đó phần chi phí nợ vay phải nhân với \`(1 - T)\`: \`WACC = (E/V)*Re + (D/V)*Rd*(1 - T) = 8,4% + 2,88% = 11,28%\`.`,
  })),

  // Topic 28: Kế toán quản trị - Phân tích Điểm hòa vốn (Break-Even Point & CVP)
  createParametricTopic('Kế toán Quản trị: Phân tích Chi phí - Sản lượng - Lợi nhuận (CVP) và Điểm hòa vốn', (p) => ({
    scenario: `Khi lập báo cáo quản trị cho ${p.contextName}, tổng Định phí (Fixed Cost) một tháng tại ô \`B2\` là 360 triệu đồng, Giá bán/Đơn giá bình quân tại ô \`B3\` là 250.000 đ, Biến phí đơn vị (Variable Cost per unit) tại ô \`B4\` là 160.000 đ. Công thức tính Sản lượng hòa vốn là gì?`,
    sampleTable: {
      headers: ['Chỉ tiêu CVP', 'Địa chỉ ô', 'Giá trị'],
      rows: [
        ['Tổng Định phí (Fixed Cost)', 'B2', '360.000.000'],
        ['Đơn giá (Price)', 'B3', '250.000'],
        ['Biến phí đơn vị (Unit Variable Cost)', 'B4', '160.000 (Số dư đảm phí = 90.000)'],
      ],
    },
    options: [
      `=B2 / (B3 - B4)`,
      `=B2 / B3 - B4`,
      `=(B3 - B4) / B2`,
      `=B2 / (B3 + B4)`,
    ],
    correctIndex: 0,
    explanation: `Sản lượng hòa vốn = \`Tổng Định phí / Số dư đảm phí đơn vị (Contribution Margin per Unit)\` = \`B2 / (B3 - B4) = 360.000.000 / 90.000 = 4.000 đơn vị\`. Lưu ý bẫy thiếu dấu ngoặc đơn \`=B2 / B3 - B4\` sẽ làm phép chia thực hiện trước phép trừ!`,
  })),

  // Topic 29: Phân tích DuPont 3 nhân tố và Sensitivity Data Table 2 chiều
  createParametricTopic('Phân tích Quản trị & Đầu tư: Phân rã ROE theo mô hình DuPont 3 nhân tố', (p) => ({
    scenario: `Trong gói báo cáo CFO Pack tổng hợp từ ${p.contextName}, để giải thích cho Ban Giám đốc vì sao Tỷ suất sinh lời trên vốn chủ sở hữu (\`ROE\`) biến động so với kỳ trước, mô hình DuPont 3 nhân tố tách \`ROE\` thành tích của 3 chỉ số nào?`,
    sampleTable: {
      headers: ['Thành phần 1 (Hiệu quả chi phí)', 'Thành phần 2 (Hiệu suất vận hành tài sản)', 'Thành phần 3 (Cấu trúc tài trợ)'],
      rows: [
        ['Net Profit Margin (LNST / Doanh thu)', 'Asset Turnover (Doanh thu / Tổng tài sản)', 'Equity Multiplier (Tổng tài sản / Vốn CSH)'],
      ],
    },
    options: [
      'ROE = Biên lợi nhuận ròng (LNST/Doanh thu) × Vòng quay tổng tài sản (Doanh thu/Tài sản) × Đòn bẩy tài chính (Tài sản/Vốn CSH)',
      'ROE = Biên lãi gộp × Số ngày tồn kho × Lãi suất vay ngân hàng',
      'ROE = EBITDA / Doanh thu + Nợ phải trả / Tổng tài sản',
      'ROE = Dòng tiền thuần / Vốn điều lệ × Thuế suất TNDN',
    ],
    correctIndex: 0,
    explanation: `Mô hình **DuPont 3 bước** giúp chỉ rõ gốc rễ thay đổi của ROE đến từ: (1) Khả năng kiểm soát chi phí & giá bán (\`Biên lợi nhuận ròng\`), (2) Tốc độ luân chuyển hàng tồn kho/phải thu/tài sản (\`Vòng quay tài sản\`), hay (3) Mức độ sử dụng nợ vay (\`Đòn bẩy tài chính\`).`,
  })),

  // Topic 30: Xử lý lỗi #REF! và kiểm toán công thức (Formula Auditing) trong mô hình lớn
  createParametricTopic('Kiểm soát Mô hình & Xử lý lỗi #REF!, #NAME?, #VALUE! khi bàn giao file', (p) => ({
    scenario: `Sau khi xóa một số dòng/cột thừa trong file ${p.contextName}, hàng loạt công thức tổng hợp ở sheet Báo cáo đồng loạt hiện lỗi \`#REF!\`. Nguyên nhân chính xác và cách phòng tránh bền vững nhất là gì?`,
    sampleTable: {
      headers: ['Mã lỗi Excel', 'Nguyên nhân gốc rễ'],
      rows: [
        ['#REF!', 'Ô hoặc vùng được tham chiếu trong công thức đã bị xóa (Delete Row/Column/Sheet)'],
        ['#NAME?', 'Gõ sai tên hàm (VD: =VLOOKP) hoặc dùng hàm Excel 365 trên bản Excel cũ, hoặc quên dấu ngoặc kép quanh chuỗi'],
        ['#VALUE!', 'Cộng/trừ/nhân/chia trực tiếp với ô chứa chuỗi văn bản không phải số'],
      ],
    },
    options: [
      'Lỗi #REF! xảy ra do xóa trực tiếp dòng/cột/sheet mà công thức đang tham chiếu tới; nên dùng Excel Table (Structured Reference) và hàm SUMIFS/XLOOKUP kết hợp Trace Dependents trước khi xóa',
      'Lỗi #REF! chỉ là do độ rộng cột quá hẹp không đủ chỗ hiển thị số tiền, chỉ cần kéo rộng cột ra',
      'Lỗi #REF! là do chia một số cho 0, chỉ cần bọc hàm ROUND là hết',
      'Lỗi #REF! là do chưa bật chế độ Macro trong Trust Center',
    ],
    correctIndex: 0,
    explanation: `Độ rộng cột quá hẹp sẽ hiển thị \`#####\`, chia cho 0 hiển thị \`#DIV/0!\`, còn \`#REF!\` là lỗi mất tham chiếu vật lý do xóa dòng/cột/sheet. Dùng **Trace Dependents** để kiểm tra trước khi xóa và thiết kế dữ liệu trong **Excel Table** giúp giảm tối đa rủi ro này.`,
  })),
];

const buildMultiDomainQuestionList = (
  startId: number,
  topics: MultiDomainTopic[]
): Question[] => {
  let idCounter = startId;
  const domainOrder: PracticeDomain[] = ['accounting', 'sales', 'inventory', 'hr_ops'];
  const result: Question[] = [];

  topics.forEach((topic) => {
    domainOrder.forEach((domain) => {
      const spec = topic.domains[domain];
      const domainMeta = PRACTICE_DOMAINS[domain];
      result.push({
        id: idCounter++,
        text: `${topic.topicTitle} - [${domainMeta.shortName}]`,
        topic: topic.topicTitle,
        domain,
        scenario: spec.scenario,
        sampleTable: spec.sampleTable,
        options: [...spec.options],
        correct: spec.correctIndex,
        explanation: spec.explanation,
      });
    });
  });

  return result;
};

export const MULTI_DOMAIN_EXCEL_QUESTIONS: Record<Level, Question[]> = {
  Basic: buildMultiDomainQuestionList(1000, BASIC_TOPICS),
  Intermediate: buildMultiDomainQuestionList(2000, INTERMEDIATE_TOPICS),
  Advanced: buildMultiDomainQuestionList(3000, ADVANCED_TOPICS),
};
