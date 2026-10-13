export type Level = 'Basic' | 'Intermediate' | 'Advanced';

export const LevelLabels: Record<Level, string> = {
  Basic: 'Cơ bản',
  Intermediate: 'Trung cấp',
  Advanced: 'Nâng cao',
};

export interface QuestionSampleTable {
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: number;
  text: string;
  topic?: string;
  domain?: 'accounting' | 'sales' | 'inventory' | 'hr_ops';
  scenario?: string;
  sampleTable?: QuestionSampleTable;
  options: string[];
  correct: number;
  explanation: string;
}

export interface StudySection {
  id: string;
  title: string;
  content: string;
}

export interface StudyChapter {
  id: string;
  title: string;
  iconName: string;
  level: Level;
  sections: StudySection[];
}

const joinLines = (...lines: string[]) => lines.join('\n');

const basicChapters: StudyChapter[] = [
  {
    id: 'basic-1',
    title: 'Nền tảng dữ liệu và thao tác nhanh',
    iconName: 'LayoutGrid',
    level: 'Basic',
    sections: [
      {
        id: 'basic-1-1',
        title: 'Bài 1.1: Tư duy dữ liệu dạng bảng',
        content: joinLines(
          '[TÓM TẮT]',
          'Excel mạnh nhất khi dữ liệu được tổ chức theo dạng bảng phẳng: mỗi dòng là một giao dịch, mỗi cột là một thuộc tính.',
          '',
          '[CHI TIẾT]',
          '- Không merge cell trong vùng dữ liệu nguồn.',
          '- Không chèn dòng tổng cộng vào giữa bảng dữ liệu gốc.',
          '- Một cột chỉ chứa một loại thông tin: ngày, mã, số tiền, phòng ban.',
          '- Tiêu đề cột phải rõ nghĩa, không trùng lặp và không để trống.',
          '',
          '[VÍ DỤ THỰC TẾ]',
          '| Chứng từ | Ngày | Mã KH | Doanh thu | Chi nhánh |',
          '|---|---|---|---:|---|',
          '| PX001 | 2026-01-03 | KH001 | 12.000.000 | Hà Nội |',
          '| PX002 | 2026-01-04 | KH002 | 8.500.000 | TP.HCM |',
          '',
          '[MẸO]',
          'Nếu file dùng cho SUMIFS, Pivot Table, Power Query hoặc VBA thì cấu trúc bảng phẳng là điều kiện bắt buộc.'
        ),
      },
      {
        id: 'basic-1-2',
        title: 'Bài 1.2: Table, Filter và Freeze Panes',
        content: joinLines(
          '[TÓM TẮT]',
          'Hầu hết file vận hành nên bắt đầu bằng Excel Table để công thức ổn định và dễ mở rộng.',
          '',
          '[CHI TIẾT]',
          '- `Ctrl + T` biến vùng dữ liệu thành Table.',
          '- Table tự mở rộng công thức, định dạng và vùng tham chiếu.',
          '- Filter và Sort an toàn hơn khi đi kèm Table.',
          '- Freeze Panes giúp đọc file dài mà không mất tiêu đề.',
          '',
          '[CÚ PHÁP]',
          '`=SUM(tbl_BanHang[Doanh thu])`',
          '`=COUNTIF(tbl_CongNo[Trạng thái], "Quá hạn")`',
          '',
          '[THỰC HÀNH]',
          '1. Chọn bảng dữ liệu > `Ctrl + T`.',
          '2. Đặt tên Table theo quy tắc `tbl_`.',
          '3. Bật Filter và Freeze Panes.',
          '4. Thử nhập thêm 3 dòng mới để kiểm tra vùng tự mở rộng.'
        ),
      },
      {
        id: 'basic-1-3',
        title: 'Bài 1.3: Phím tắt giúp tăng tốc thao tác',
        content: joinLines(
          '[TÓM TẮT]',
          'Người làm Excel nhanh không gõ nhiều hơn, mà thao tác chính xác và tận dụng bàn phím tốt hơn.',
          '',
          '[CHI TIẾT]',
          '- `Ctrl + D`: copy xuống.',
          '- `Ctrl + R`: copy sang phải.',
          '- `Ctrl + Shift + L`: bật/tắt Filter.',
          '- `Alt + =`: chèn SUM nhanh.',
          '- `Ctrl + 1`: mở Format Cells.',
          '- `F4`: lặp lại thao tác vừa thực hiện.',
          '',
          '[BÀI TẬP]',
          'Tạo bảng chấm công 30 dòng và dùng phím tắt để điền ngày, mã bộ phận, trạng thái và dòng tổng.',
          '',
          '[MẸO]',
          'Kết hợp `Ctrl + mũi tên`, `Ctrl + Shift + mũi tên` và `Ctrl + Space` để chọn vùng cực nhanh.'
        ),
      },
    ],
  },
  {
    id: 'basic-2',
    title: 'Hàm cơ bản và làm sạch dữ liệu',
    iconName: 'FunctionSquare',
    level: 'Basic',
    sections: [
      {
        id: 'basic-2-1',
        title: 'Bài 2.1: SUM, COUNTA, AVERAGE, MAX, MIN',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là nhóm hàm nền để tính tổng, đếm dữ liệu và đọc nhanh sức khỏe của một bảng số liệu.',
          '',
          '[CÚ PHÁP]',
          '`=SUM(E:E)`',
          '`=COUNTA(A:A)`',
          '`=AVERAGE(F2:F100)`',
          '`=MAX(tbl_Sales[Doanh thu])`',
          '`=MIN(tbl_Sales[Doanh thu])`',
          '',
          '[ỨNG DỤNG]',
          'Tìm doanh thu lớn nhất trong tuần, số giao dịch đã phát sinh, số hóa đơn có dữ liệu và giá trị đơn hàng trung bình.',
          '',
          '[BÀI TẬP]',
          'Lập bảng 20 đơn hàng giả lập, tính tổng doanh thu, số đơn, giá trị trung bình, doanh thu lớn nhất và nhỏ nhất.'
        ),
      },
      {
        id: 'basic-2-2',
        title: 'Bài 2.2: LEFT, RIGHT, MID, LEN, TRIM, SUBSTITUTE',
        content: joinLines(
          '[TÓM TẮT]',
          'Dữ liệu thực tế luôn có rác: dấu cách thừa, mã ghép, định dạng text sai chuẩn.',
          '',
          '[CHI TIẾT]',
          '- `TRIM`: xóa khoảng trắng thừa.',
          '- `LEFT`, `RIGHT`, `MID`: tách mã, chi nhánh, năm, nhóm sản phẩm.',
          '- `SUBSTITUTE`: thay ký tự cũ bằng ký tự mới.',
          '- `LEN`: đo độ dài chuỗi để kiểm tra quy cách mã.',
          '',
          '[VÍ DỤ]',
          '`=TRIM(A2)` để làm sạch mã khách hàng copy từ hệ thống.',
          '`=RIGHT(B2, 3)` để lấy mã chi nhánh từ chuỗi `HD-2026-HCM`.',
          '`=SUBSTITUTE(C2, ".", "")` để bỏ dấu chấm ngăn cách nghìn trước khi đổi về số.',
          '',
          '[BÀI TẬP]',
          'Cho 10 mã hóa đơn dạng `PX-YYYY-CHINHANH`, hãy tách năm, ký hiệu và chi nhánh ra 3 cột riêng.'
        ),
      },
      {
        id: 'basic-2-3',
        title: 'Bài 2.3: Data Validation và Conditional Formatting',
        content: joinLines(
          '[TÓM TẮT]',
          'Nhập đúng ngay từ đầu luôn rẻ hơn sửa lỗi cuối kỳ.',
          '',
          '[QUY TRÌNH]',
          '1. Tạo danh mục phòng ban hoặc trạng thái ở một sheet riêng.',
          '2. Data > Data Validation > List.',
          '3. Chọn nguồn danh mục và khóa việc nhập tự do.',
          '4. Dùng Conditional Formatting để tô màu dữ liệu lỗi.',
          '',
          '[TÌNH HUỐNG]',
          'Tô đỏ các hóa đơn quá hạn 30 ngày, tô vàng các dòng thiếu Mã KH, và tạo dropdown cho cột `Trạng thái`.',
          '',
          '[BÀI TẬP]',
          'Tạo form nhập công nợ có dropdown `Mới`, `Đang thu`, `Quá hạn`, `Đã thu`; tô màu đỏ cho các dòng `Quá hạn`.'
        ),
      },
    ],
  },
  {
    id: 'basic-3',
    title: 'Tra cứu và tổng hợp một điều kiện',
    iconName: 'Database',
    level: 'Basic',
    sections: [
      {
        id: 'basic-3-1',
        title: 'Bài 3.1: VLOOKUP và nguyên tắc tra cứu đúng',
        content: joinLines(
          '[TÓM TẮT]',
          'VLOOKUP vẫn rất phổ biến trong file kế toán và vận hành cũ, nên phải hiểu đúng để tránh sai số âm thầm.',
          '',
          '[CÚ PHÁP]',
          '`=VLOOKUP(A2, DanhMuc!A:D, 3, 0)`',
          '',
          '[LƯU Ý QUAN TRỌNG]',
          '- Luôn dùng tham số cuối là `0` để tra cứu chính xác.',
          '- Cột khóa phải nằm bên trái vùng tra cứu.',
          '- Khi ra `#N/A`, kiểm tra `TRIM`, định dạng text/number và mã có trùng không.',
          '',
          '[BÀI TẬP]',
          'Dùng Mã vật tư để lấy Tên vật tư, Đơn vị tính và Đơn giá từ bảng danh mục.'
        ),
      },
      {
        id: 'basic-3-2',
        title: 'Bài 3.2: SUMIF, COUNTIF và nhóm bài tổng hợp nhanh',
        content: joinLines(
          '[TÓM TẮT]',
          'SUMIF và COUNTIF là cặp đôi cần có để tổng hợp nhanh theo 1 điều kiện.',
          '',
          '[CÚ PHÁP]',
          '`=SUMIF(B:B, "HN", E:E)`',
          '`=COUNTIF(F:F, "Quá hạn")`',
          '',
          '[ỨNG DỤNG]',
          'Tính tổng doanh thu chi nhánh Hà Nội, đếm số hóa đơn quá hạn, đếm số đơn của một nhân viên cụ thể.',
          '',
          '[BÀI TẬP]',
          'Từ bảng bán hàng 50 dòng, tính tổng doanh thu theo từng chi nhánh và đếm số đơn theo từng kênh bán.'
        ),
      },
      {
        id: 'basic-3-3',
        title: 'Bài 3.3: Bài tập tổng hợp cơ bản',
        content: joinLines(
          '[BÀI TOÁN]',
          'Bạn nhận được một file doanh thu tháng gồm 5 cột chính: Ngày, Mã KH, Chi nhánh, Trạng thái và Doanh thu.',
          '',
          '[YÊU CẦU]',
          '1. Chuyển vùng dữ liệu thành Table.',
          '2. Kiểm tra dòng trống và mã bị thừa khoảng trắng.',
          '3. Tính tổng doanh thu theo chi nhánh.',
          '4. Đếm số đơn quá hạn thanh toán.',
          '5. Tô màu cảnh báo các giao dịch trên 50 triệu.',
          '',
          '[KẾT QUẢ]',
          'Sau bài này, người học có thể tự dựng lại một bộ file thao tác cơ bản cho công việc hằng ngày.'
        ),
      },
    ],
  },
  {
    id: 'basic-4',
    title: 'Báo cáo cơ bản và tư duy kiểm soát',
    iconName: 'PieChart',
    level: 'Basic',
    sections: [
      {
        id: 'basic-4-1',
        title: 'Bài 4.1: Sắp xếp, lọc và kiểm soát sai lệch thủ công',
        content: joinLines(
          '[TÓM TẮT]',
          'Trước khi lên level trung cấp, người học phải làm chủ việc nhìn ra dữ liệu xấu bằng mắt và bằng bộ lọc.',
          '',
          '[CHI TIẾT]',
          '- Sort theo ngày để kiểm tra chứng từ outlier.',
          '- Filter theo trạng thái để tìm công nợ quá hạn.',
          '- Filter blank để tìm dòng thiếu dữ liệu bắt buộc.',
          '- Dùng Top 10 Filter để soi giao dịch lớn bất thường.',
          '',
          '[BÀI TẬP]',
          'Từ bảng 100 giao dịch, lọc ra 10 giao dịch lớn nhất, tất cả dòng thiếu Mã KH, và toàn bộ dòng `Quá hạn`.'
        ),
      },
      {
        id: 'basic-4-2',
        title: 'Bài 4.2: Nguyên tắc bố cục file dễ bàn giao',
        content: joinLines(
          '[TÓM TẮT]',
          'Một file dùng được không chỉ là file tính đúng, mà còn là file người khác có thể đọc và tiếp quản.',
          '',
          '[CHI TIẾT]',
          '- Tách sheet `Input`, `Master`, `Calc`, `Report`.',
          '- Không nhập tay đè lên vùng công thức.',
          '- Dùng màu nền khác nhau cho vùng nhập liệu và vùng tính toán.',
          '- Ghi chú ngắn cho các cột quan trọng hoặc giả định nghiệp vụ.',
          '',
          '[BÀI TẬP]',
          'Tổ chức lại file bán hàng 1 tháng theo cấu trúc 4 sheet chuẩn.'
        ),
      },
      {
        id: 'basic-4-3',
        title: 'Bài 4.3: Checklist cuối ngày cho file vận hành',
        content: joinLines(
          '[CHECKLIST]',
          '1. Có dòng trống trong bảng hay không?',
          '2. Có mã nào bị thừa khoảng trắng hoặc sai độ dài không?',
          '3. Có giao dịch nào âm hoặc lớn bất thường không?',
          '4. Công thức có bị kéo sai vùng không?',
          '5. Dòng tổng ở cuối đã đúng sau khi thêm dữ liệu mới chưa?',
          '',
          '[MỤC TIÊU]',
          'Tạo thói quen kiểm soát file trước khi gửi báo cáo hoặc dùng làm nguồn cho các bước phân tích cao hơn.'
        ),
      },
    ],
  },
];

const intermediateChapters: StudyChapter[] = [
  {
    id: 'inter-1',
    title: 'Hàm nhiều điều kiện và tra cứu hiện đại',
    iconName: 'TrendingUp',
    level: 'Intermediate',
    sections: [
      {
        id: 'inter-1-1',
        title: 'Bài 5.1: SUMIFS, COUNTIFS, AVERAGEIFS',
        content: joinLines(
          '[TÓM TẮT]',
          'Khi file bắt đầu cần phân tích theo nhiều tiêu chí, SUMIFS/COUNTIFS sẽ thay SUMIF/COUNTIF.',
          '',
          '[CÚ PHÁP]',
          '`=SUMIFS(E:E, B:B, "HN", C:C, "Online")`',
          '`=COUNTIFS(F:F, "Quá hạn", G:G, ">30")`',
          '`=AVERAGEIFS(E:E, B:B, "HN", C:C, "Retail")`',
          '',
          '[TÌNH HUỐNG]',
          'Tính tổng doanh thu kênh Online tại HN, đếm số công nợ quá hạn trên 30 ngày, và tính doanh thu trung bình theo nhân viên.',
          '',
          '[BÀI TẬP]',
          'Cho bảng 100 dòng dữ liệu, tạo 5 chỉ số quản trị bằng SUMIFS và COUNTIFS.'
        ),
      },
      {
        id: 'inter-1-2',
        title: 'Bài 5.2: XLOOKUP, INDEX MATCH và cách chọn đúng công cụ',
        content: joinLines(
          '[TÓM TẮT]',
          'XLOOKUP là bản nâng cấp của VLOOKUP; INDEX MATCH hữu ích khi cần tra cứu linh hoạt và tương thích file cũ.',
          '',
          '[CÚ PHÁP]',
          '`=XLOOKUP(A2, DanhMuc[Ma], DanhMuc[Đơn giá], "Không tìm thấy")`',
          '`=INDEX(C:C, MATCH(A2, A:A, 0))`',
          '',
          '[SO SÁNH ĐỂ CHỌN NHANH]',
          '- XLOOKUP: dễ đọc, tra trái/phải đều được.',
          '- INDEX MATCH: linh hoạt, dùng tốt trong file cũ.',
          '- VLOOKUP: vẫn dùng được nhưng khó mở rộng.',
          '',
          '[BÀI TẬP]',
          'Tra cứu Mã KH để lấy Nhóm KH, Hạn mức nợ và Nhân viên phụ trách bằng 2 cách: XLOOKUP và INDEX MATCH.'
        ),
      },
      {
        id: 'inter-1-3',
        title: 'Bài 5.3: FILTER, SORT, UNIQUE cho Excel 365',
        content: joinLines(
          '[TÓM TẮT]',
          'Bộ hàm động này giảm rất nhiều cột phụ và giúp làm báo cáo mini rất nhanh.',
          '',
          '[CÚ PHÁP]',
          '`=FILTER(A2:E100, C2:C100="HN")`',
          '`=UNIQUE(B2:B100)`',
          '`=SORT(A2:E100, 5, -1)`',
          '',
          '[ỨNG DỤNG]',
          'Tạo danh sách khách hàng không trùng, lọc giao dịch của một chi nhánh, sắp xếp top doanh thu giảm dần.',
          '',
          '[BÀI TẬP]',
          'Tạo một dashboard mini chỉ bằng FILTER + UNIQUE + SORT để xem top 10 giao dịch.'
        ),
      },
    ],
  },
  {
    id: 'inter-2',
    title: 'Ngày tháng, logic và điều kiện nghiệp vụ',
    iconName: 'ShieldCheck',
    level: 'Intermediate',
    sections: [
      {
        id: 'inter-2-1',
        title: 'Bài 6.1: IF, IFS, AND, OR',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là lớp hàm ra quyết định để tự động hóa chính sách và kiểm tra tính hợp lệ.',
          '',
          '[VÍ DỤ]',
          '`=IF(D2>=100000000, "Đạt", "Cần bổ sung")`',
          '`=IFS(E2>90, "A", E2>75, "B", TRUE, "C")`',
          '`=IF(AND(F2="Quá hạn", G2>30), "Cần thu gấp", "Theo dõi")`',
          '`=IF(OR(B2="HN", B2="HCM"), "Thị trường trọng điểm", "Khác")`',
          '',
          '[BÀI TẬP]',
          'Xếp loại doanh thu nhân viên, cảnh báo công nợ, và phân nhóm khách hàng theo giá trị mua.'
        ),
      },
      {
        id: 'inter-2-2',
        title: 'Bài 6.2: EOMONTH, TODAY, NETWORKDAYS, DATEDIF',
        content: joinLines(
          '[TÓM TẮT]',
          'Ngày tháng trong kế toán và vận hành không chỉ là định dạng, mà là logic nghiệp vụ.',
          '',
          '[CÚ PHÁP]',
          '`=EOMONTH(A2, 0)`',
          '`=TODAY()`',
          '`=NETWORKDAYS(B2, C2)`',
          '`=DATEDIF(B2, C2, "m")`',
          '',
          '[ỨNG DỤNG]',
          'Tính ngày đến hạn, đếm số ngày làm việc, số tháng còn bảo hành, và cảnh báo giao dịch chậm thanh toán.',
          '',
          '[BÀI TẬP]',
          'Từ bảng hợp đồng, tính ngày kết thúc, số ngày còn lại, số ngày làm việc và trạng thái hợp đồng.'
        ),
      },
      {
        id: 'inter-2-3',
        title: 'Bài 6.3: IFERROR, COUNTBLANK và kiểm tra file chống vỡ',
        content: joinLines(
          '[TÓM TẮT]',
          'File vận hành tốt không chỉ tính đúng mà còn phải chống vỡ khi dữ liệu xấu xuất hiện.',
          '',
          '[CÚ PHÁP]',
          '`=IFERROR(VLOOKUP(A2, DanhMuc!A:D, 2, 0), "")`',
          '`=IF(COUNTBLANK(A2:D2)>0, "Thiếu dữ liệu", "Hợp lệ")`',
          '',
          '[TÌNH HUỐNG]',
          'Dùng IFERROR cho tra cứu, COUNTBLANK để bắt cột thiếu, và quy tắc cảnh báo để người nhập liệu tự sửa.',
          '',
          '[BÀI TẬP]',
          'Tạo cột `Trạng thái dữ liệu` đánh dấu dòng thiếu thông tin, trùng mã, hoặc tra cứu thất bại.'
        ),
      },
    ],
  },
  {
    id: 'inter-3',
    title: 'Pivot Table, dashboard và bố cục báo cáo',
    iconName: 'PieChart',
    level: 'Intermediate',
    sections: [
      {
        id: 'inter-3-1',
        title: 'Bài 7.1: Pivot Table để trả lời câu hỏi quản trị nhanh',
        content: joinLines(
          '[TÓM TẮT]',
          'Pivot Table là công cụ phân tích nhanh nhất để trả lời câu hỏi của sếp trong vài phút.',
          '',
          '[QUY TRÌNH]',
          '1. Chuyển dữ liệu thành Table.',
          '2. Insert > Pivot Table.',
          '3. Đưa Chi nhánh vào Rows, Doanh thu vào Values, Kênh bán vào Columns.',
          '4. Chèn Slicer cho Tháng, Nhân viên, Chi nhánh.',
          '',
          '[BÀI TẬP]',
          'Dùng một bảng doanh thu để tạo 2 Pivot Table và 1 biểu đồ phục vụ họp doanh số.'
        ),
      },
      {
        id: 'inter-3-2',
        title: 'Bài 7.2: Thiết kế dashboard nội bộ dễ đọc',
        content: joinLines(
          '[TÓM TẮT]',
          'Dashboard nội bộ tốt phải đi từ tổng quan đến chi tiết, không nhồi tất cả lên một màn hình.',
          '',
          '[BỐ CỤC ĐỀ NGHỊ]',
          '- Hàng 1: KPI tổng quan.',
          '- Hàng 2: Phân tích theo chi nhánh / bộ phận / nhân viên.',
          '- Hàng 3: Bảng chi tiết để drill-down.',
          '',
          '[MẸO]',
          'Dùng cùng một quy ước màu: xanh cho tốt, vàng cho cần theo dõi, đỏ cho rủi ro.',
          '',
          '[BÀI TẬP]',
          'Thiết kế một dashboard doanh thu tháng với 4 KPI, 2 biểu đồ và 1 bảng chi tiết.'
        ),
      },
      {
        id: 'inter-3-3',
        title: 'Bài 7.3: Named Range và cách đọc file người khác',
        content: joinLines(
          '[TÓM TẮT]',
          'Muốn bảo trì file lâu dài thì phải đọc được file của người khác và viết file để người sau đọc được.',
          '',
          '[CHI TIẾT]',
          '- Đặt tên cho vùng danh mục, vùng tham số, vùng tổng hợp.',
          '- Dùng Trace Precedents/Dependents để lần theo công thức.',
          '- Gom sheet theo vai trò: `Input`, `Master`, `Calc`, `Report`.',
          '',
          '[BÀI TẬP]',
          'Tổ chức lại một file giả lập theo 4 sheet chuẩn và đặt tên cho 5 vùng dữ liệu quan trọng.'
        ),
      },
    ],
  },
  {
    id: 'inter-4',
    title: 'Case study vận hành và sales admin',
    iconName: 'Monitor',
    level: 'Intermediate',
    sections: [
      {
        id: 'inter-4-1',
        title: 'Case study: Sales admin chốt báo cáo doanh thu',
        content: joinLines(
          '[BÀI TOÁN]',
          'Sales admin nhận file đơn hàng từ 3 kênh: retail, online, đại lý. Dữ liệu lệch định dạng và trùng mã đơn.',
          '',
          '[YÊU CẦU]',
          '1. Làm sạch mã đơn và mã khách hàng.',
          '2. Dùng XLOOKUP lấy nhóm khách hàng.',
          '3. Dùng SUMIFS tính doanh thu theo kênh.',
          '4. Tạo Pivot Table theo chi nhánh và nhân viên.',
          '',
          '[MỤC TIÊU]',
          'Rèn khả năng xử lý dữ liệu đầu vào lộn xộn và đóng báo cáo nhanh cuối ngày.'
        ),
      },
      {
        id: 'inter-4-2',
        title: 'Case study: Vận hành kiểm soát SLA',
        content: joinLines(
          '[BÀI TOÁN]',
          'Bộ phận vận hành cần theo dõi ticket xử lý trong ngày, số ticket quá SLA và hiệu suất theo ca.',
          '',
          '[YÊU CẦU]',
          '1. Dùng TODAY và NETWORKDAYS để tính số ngày xử lý.',
          '2. Dùng IF/IFS để phân nhóm `Đúng SLA`, `Cảnh báo`, `Quá SLA`.',
          '3. Tạo dashboard theo ca trực và nhóm xử lý.',
          '',
          '[MỤC TIÊU]',
          'Biết tổ chức dữ liệu dịch vụ/vận hành theo logic dễ báo cáo.'
        ),
      },
      {
        id: 'inter-4-3',
        title: 'Case study: Kế toán công nợ nội bộ',
        content: joinLines(
          '[BÀI TOÁN]',
          'Kế toán công nợ cần theo dõi hạn mức, số ngày quá hạn và mức độ rủi ro theo khách hàng.',
          '',
          '[YÊU CẦU]',
          '1. Dùng XLOOKUP lấy hạn mức và nhóm khách hàng.',
          '2. Dùng SUMIFS tổng hợp dư nợ.',
          '3. Dùng EOMONTH/TODAY để tính số ngày quá hạn.',
          '4. Dùng Pivot Table và Conditional Formatting để làm báo cáo thu hồi nợ.',
          '',
          '[MỤC TIÊU]',
          'Tạo được bộ file theo dõi công nợ nội bộ ở mức trung cấp.'
        ),
      },
    ],
  },
];

const advancedChapters: StudyChapter[] = [
  {
    id: 'adv-1',
    title: 'Power Query nền tảng',
    iconName: 'Database',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-1-1',
        title: 'Bài 8.1: Tư duy staging và luồng xử lý chuẩn',
        content: joinLines(
          '[TÓM TẮT]',
          'Power Query phù hợp cho công việc lặp lại: nhận file, làm sạch, chuẩn hóa, tổng hợp và refresh định kỳ.',
          '',
          '[QUY TRÌNH CHUẨN]',
          '1. `Raw`: nhận dữ liệu thô từ Excel, CSV, Folder, SharePoint.',
          '2. `Staging`: chuẩn hóa tên cột, kiểu dữ liệu, bỏ dòng rác.',
          '3. `Business`: join danh mục, tính cột nghiệp vụ, phân nhóm.',
          '4. `Report`: xuất bảng cuối cho Pivot, dashboard hoặc Data Model.',
          '',
          '[MẸO]',
          'Dùng tên query theo cấu trúc: `stg_`, `dim_`, `fact_`, `rpt_` để người khác nhìn là hiểu ngay.'
        ),
      },
      {
        id: 'adv-1-2',
        title: 'Bài 8.2: Những thao tác Power Query dùng nhiều nhất',
        content: joinLines(
          '[CHI TIẾT]',
          '- Use First Row as Headers',
          '- Remove Blank Rows',
          '- Trim / Clean',
          '- Split Column by Delimiter',
          '- Replace Values',
          '- Fill Down',
          '- Group By',
          '- Unpivot Columns',
          '',
          '[TÌNH HUỐNG]',
          'Nhận 3 file CSV có cột `Chi nhánh`, `Ngày`, `Số tiền` đang ở dạng text. Hãy làm sạch và đưa về một bảng chuẩn có kiểu dữ liệu đúng.',
          '',
          '[BÀI TẬP]',
          'Tạo một query `stg_BanHang` và một query `rpt_BanHang` từ cùng nguồn dữ liệu để hiểu rõ staging/report.'
        ),
      },
      {
        id: 'adv-1-3',
        title: 'Bài 8.3: Bộ hàm M cơ bản cần nắm',
        content: joinLines(
          '[POWER QUERY]',
          '| Hàm M | Công dụng |',
          '|---|---|',
          '| `Text.Trim` | xóa khoảng trắng đầu/cuối |',
          '| `Text.Upper` | chuẩn hóa mã in hoa |',
          '| `Date.From` | đổi text thành date |',
          '| `Number.FromText` | đổi text thành number |',
          '| `Table.SelectRows` | lọc dòng |',
          '| `Table.TransformColumnTypes` | đổi kiểu dữ liệu |',
          '',
          '[VÍ DỤ]',
          '`Text.Trim([MãKH])`',
          '`Date.From([Ngày hóa đơn])`',
          '`Number.FromText([Doanh thu])`'
        ),
      },
    ],
  },
  {
    id: 'adv-2',
    title: 'Power Query chuyên sâu cho đối soát',
    iconName: 'Monitor',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-2-1',
        title: 'Bài 9.1: Gộp file từ Folder và quản trị file nguồn',
        content: joinLines(
          '[TÓM TẮT]',
          'Khi nhận file theo tháng, dùng Folder query sẽ bền và nhanh hơn thao tác tay.',
          '',
          '[QUY TRÌNH]',
          '1. Data > Get Data > From Folder.',
          '2. Chọn file mẫu có cấu trúc đúng.',
          '3. Tạo query `stg_BanHang_Raw` để làm sạch.',
          '4. Tạo query `fact_BanHang` để sử dụng cho báo cáo.',
          '5. Lưu quy ước tên file nguồn và kiểm soát tiêu đề cột thống nhất.',
          '',
          '[LƯU Ý QUAN TRỌNG]',
          'Không transform trực tiếp trên query cuối nếu muốn dễ bảo trì. Tách rõ `Raw -> Clean -> Report`.'
        ),
      },
      {
        id: 'adv-2-2',
        title: 'Bài 9.2: Merge, Left Anti, Left Outer và đối chiếu sai lệch',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là nhóm thao tác cực mạnh để đối chiếu sao kê, đối chiếu công nợ, đối chiếu kho.',
          '',
          '[SO SÁNH]',
          '- Left Outer: lấy bảng trái và map thêm thông tin bên phải.',
          '- Left Anti: tìm dòng chỉ có ở bảng trái, không có ở bảng phải.',
          '- Inner: chỉ lấy phần trùng khớp giữa 2 bảng.',
          '',
          '[TÌNH HUỐNG THỰC TẾ]',
          'Dùng Left Anti để tìm giao dịch có trên sao kê nhưng chưa hạch toán.',
          'Dùng Left Outer để map tài khoản từ bảng danh mục vào bảng phát sinh.',
          '',
          '[BÀI TẬP]',
          'Tạo 2 query: 1 query map danh mục vật tư, 1 query tìm giao dịch chưa có ở sổ kế toán.'
        ),
      },
      {
        id: 'adv-2-3',
        title: 'Bài 9.3: Unpivot, Group By và tạo bảng báo cáo chuẩn',
        content: joinLines(
          '[TÓM TẮT]',
          'Dữ liệu nhận từ các bộ phận khác thường đang nằm ngang; phân tích thì cần dữ liệu dạng dọc.',
          '',
          '[QUY TRÌNH]',
          '1. Giữ lại cột khóa như Mã NV, Bộ phận.',
          '2. Chọn các cột tháng và dùng `Unpivot Other Columns`.',
          '3. Đổi tên `Attribute` thành `Kỳ` và `Value` thành `Số tiền`.',
          '4. Group By để tổng hợp lại nếu cần.',
          '',
          '[KẾT QUẢ]',
          'Bảng sau Unpivot là nền tảng cho Pivot, SUMIFS, Data Model và dashboard.'
        ),
      },
      {
        id: 'adv-2-4',
        title: 'Bài 9.4: Gộp nhiều sheet cùng cấu trúc bằng Power Query',
        content: joinLines(
          '[TÓM TẮT]',
          'Khi dữ liệu nằm rải trên nhiều sheet theo tháng hoặc theo chi nhánh, có thể gom về một bảng chuẩn bằng Power Query thay vì copy thủ công.',
          '',
          '[QUY TRÌNH]',
          '1. Chuẩn hóa các sheet nguồn về cùng số cột và cùng tiêu đề.',
          '2. Chuyển từng vùng dữ liệu thành Table và đặt tên có quy ước như `tbl_T1`, `tbl_T2`, `tbl_T3`.',
          '3. Data > Get Data > From Other Sources > Blank Query.',
          '4. Dùng `Excel.CurrentWorkbook()` để đọc toàn bộ table trong file hiện tại.',
          '5. Lọc các table bắt đầu bằng `tbl_` rồi dùng `Table.Combine` để append.',
          '',
          '[POWER QUERY]',
          '```m',
          'let',
          '    Source = Excel.CurrentWorkbook(),',
          '    KeepTables = Table.SelectRows(Source, each Text.StartsWith([Name], "tbl_")),',
          '    Combined = Table.Combine(KeepTables[Content])',
          'in',
          '    Combined',
          '```',
          '',
          '[LƯU Ý QUAN TRỌNG]',
          'Chỉ nên gộp khi các sheet thật sự cùng cấu trúc. Nếu một sheet thiếu cột hoặc đổi tên cột, kết quả append sẽ khó kiểm soát.'
        ),
      },
    ],
  },
  {
    id: 'adv-3',
    title: 'Power Query M functions chuyên sâu',
    iconName: 'Zap',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-3-1',
        title: 'Bài 10.1: Text functions hay dùng trong M',
        content: joinLines(
          '[POWER QUERY]',
          '| Hàm | Công dụng |',
          '|---|---|',
          '| `Text.BeforeDelimiter` | lấy phần trước dấu phân tách |',
          '| `Text.AfterDelimiter` | lấy phần sau dấu phân tách |',
          '| `Text.Range` | lấy chuỗi con |',
          '| `Text.PadStart` | thêm ký tự ở đầu cho đủ độ dài |',
          '| `Text.Combine` | ghép chuỗi |',
          '',
          '[VÍ DỤ]',
          '`Text.BeforeDelimiter([Mã đơn], "-")`',
          '`Text.AfterDelimiter([Mã đơn], "-")`',
          '`Text.PadStart(Text.From([Mã NV]), 5, "0")`'
        ),
      },
      {
        id: 'adv-3-2',
        title: 'Bài 10.2: Table functions và cột tính toán trong M',
        content: joinLines(
          '[POWER QUERY]',
          '| Hàm | Công dụng |',
          '|---|---|',
          '| `Table.AddColumn` | thêm cột mới |',
          '| `Table.RemoveColumns` | bỏ cột không cần |',
          '| `Table.RenameColumns` | đổi tên cột |',
          '| `Table.Group` | nhóm dữ liệu và tổng hợp |',
          '| `Table.NestedJoin` | join 2 bảng |',
          '| `Table.ExpandTableColumn` | mở rộng bảng sau join |',
          '',
          '[VÍ DỤ]',
          '`Table.AddColumn(Source, "Kỳ", each Date.StartOfMonth([Ngày]))`',
          '`Table.Group(Source, {"Chi nhánh"}, {{"Doanh thu", each List.Sum([Doanh thu]), type number}})`'
        ),
      },
      {
        id: 'adv-3-3',
        title: 'Bài 10.3: Xử lý lỗi an toàn với try ... otherwise',
        content: joinLines(
          '[TÓM TẮT]',
          'Trong dữ liệu thực tế luôn có dòng bẩn. Query bền phải biết tự xử lý lỗi thay vì đổ vỡ toàn bộ.',
          '',
          '[CÚ PHÁP]',
          '`try Number.FromText([Số tiền]) otherwise 0`',
          '`try Date.From([Ngày]) otherwise null`',
          '',
          '[ỨNG DỤNG]',
          'Khi cột số tiền đôi lúc chứa chữ `N/A`, khi cột ngày có định dạng lẫn lộn, hoặc khi mã đơn bị thiếu delimiter.',
          '',
          '[BÀI TẬP]',
          'Tạo một query xử lý lỗi cho 3 cột `Ngày`, `Số tiền`, `Mã đơn` mà không làm query dừng.'
        ),
      },
    ],
  },
  {
    id: 'adv-4',
    title: 'VBA nền tảng và khung macro dùng lại',
    iconName: 'Terminal',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-4-1',
        title: 'Bài 11.1: Khung macro an toàn cần có',
        content: joinLines(
          '[TÓM TẮT]',
          'VBA dùng để giải quyết những việc Power Query không làm: tạo file mới, gửi mail, in ấn, thao tác với workbook và người dùng.',
          '',
          '[VBA]',
          '```vb',
          'Sub SafeModeStart()',
          '    Application.ScreenUpdating = False',
          '    Application.EnableEvents = False',
          '    Application.Calculation = xlCalculationManual',
          'End Sub',
          '',
          'Sub SafeModeEnd()',
          '    Application.ScreenUpdating = True',
          '    Application.EnableEvents = True',
          '    Application.Calculation = xlCalculationAutomatic',
          'End Sub',
          '```',
          '',
          '[LƯU Ý]',
          'Bật/tắt bộ ba ScreenUpdating, EnableEvents, Calculation sẽ tăng tốc macro rõ rệt.'
        ),
      },
      {
        id: 'adv-4-2',
        title: 'Bài 11.2: Hàm tìm dòng cuối, cột cuối và vùng dữ liệu',
        content: joinLines(
          '[VBA]',
          '```vb',
          'Function LastRow(ws As Worksheet, colLetter As String) As Long',
          '    LastRow = ws.Cells(ws.Rows.Count, colLetter).End(xlUp).Row',
          'End Function',
          '```',
          '',
          '```vb',
          'Function LastCol(ws As Worksheet, rowNumber As Long) As Long',
          '    LastCol = ws.Cells(rowNumber, ws.Columns.Count).End(xlToLeft).Column',
          'End Function',
          '```',
          '',
          '[ỨNG DỤNG]',
          'Dùng khi cần copy vùng động, đổ dữ liệu cuối bảng, hoặc quét toàn bộ sheet theo số cột thay đổi.'
        ),
      },
      {
        id: 'adv-4-3',
        title: 'Bài 11.3: Mẫu refresh và export báo cáo',
        content: joinLines(
          '[VBA]',
          '```vb',
          'Sub RefreshAllData()',
          '    ThisWorkbook.RefreshAll',
          'End Sub',
          '```',
          '',
          '```vb',
          'Sub ExportCurrentSheetPdf()',
          '    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, _',
          '        Filename:=ThisWorkbook.Path & "\\report.pdf"',
          'End Sub',
          '```',
          '',
          '[THỰC TẾ]',
          'Bộ macro này thường được gắn nút bấm để người dùng refresh dữ liệu và xuất PDF cuối ngày hoặc cuối tháng.'
        ),
      },
    ],
  },
  {
    id: 'adv-5',
    title: 'VBA tự động hóa quy trình',
    iconName: 'ShieldCheck',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-5-1',
        title: 'Bài 12.1: Duyệt file trong folder và gom dữ liệu',
        content: joinLines(
          '[VBA]',
          '```vb',
          'Sub ImportFilesFromFolder()',
          '    Dim folderPath As String, fileName As String',
          '    folderPath = ThisWorkbook.Path & "\\input\\"',
          '    fileName = Dir(folderPath & "*.xlsx")',
          '',
          '    Do While fileName <> ""',
          '        Debug.Print fileName',
          "        ' Mở file, copy dữ liệu, đóng file",
          '        fileName = Dir',
          '    Loop',
          'End Sub',
          '```',
          '',
          '[THỰC TẾ]',
          'Dùng khi cần cắt 200 file phiếu lương, tạo workbook riêng cho từng nhân viên, hoặc đổi tên file hàng loạt.'
        ),
      },
      {
        id: 'adv-5-2',
        title: 'Bài 12.2: Tạo báo cáo theo nút bấm cho người dùng cuối',
        content: joinLines(
          '[TÓM TẮT]',
          'Khi bàn giao file cho người không rành Excel, nút bấm macro giúp giảm lỗi thao tác rất nhiều.',
          '',
          '[QUY TRÌNH]',
          '1. Tạo macro refresh dữ liệu.',
          '2. Tạo macro kiểm tra đầu vào tối thiểu.',
          '3. Tạo macro export PDF hoặc copy báo cáo sang file mới.',
          '4. Gắn macro vào shape/button với nhãn rõ ràng.',
          '',
          '[BÀI TẬP]',
          'Tạo một màn hình điều khiển nhỏ gồm 3 nút: `Refresh`, `Kiểm tra dữ liệu`, `Xuất PDF`.'
        ),
      },
      {
        id: 'adv-5-3',
        title: 'Bài 12.3: Các lỗi VBA phổ biến và cách tránh',
        content: joinLines(
          '[LỖI PHỔ BIẾN]',
          '- Dùng `Select` / `Activate` quá nhiều làm macro chậm và dễ lỗi.',
          '- Không xử lý workbook đang mở sai file.',
          '- Không bọc lỗi bằng kiểm tra hoặc `On Error` hợp lý.',
          '- Quên bật lại Calculation/ScreenUpdating sau khi macro dừng.',
          '',
          '[NGUYÊN TẮC]',
          'Viết VBA theo hướng tham chiếu đối tượng rõ ràng (`ws.Cells(...)`) thay vì phụ thuộc `ActiveSheet` càng nhiều càng tốt.'
        ),
      },
      {
        id: 'adv-5-4',
        title: 'Bài 12.4: Gộp nhiều sheet trong cùng workbook bằng VBA',
        content: joinLines(
          '[TÓM TẮT]',
          'Khi mỗi sheet là một chi nhánh hoặc một tháng, VBA có thể quét toàn bộ sheet và gom dữ liệu về một sheet tổng hợp chỉ bằng một nút bấm.',
          '',
          '[VBA]',
          '```vb',
          'Sub MergeSheetsToMaster()',
          '    Dim ws As Worksheet',
          '    Dim wsMaster As Worksheet',
          '    Dim lastRow As Long, targetRow As Long',
          '',
          '    Set wsMaster = ThisWorkbook.Worksheets("TongHop")',
          '    wsMaster.Cells.ClearContents',
          '    targetRow = 1',
          '',
          '    For Each ws In ThisWorkbook.Worksheets',
          '        If ws.Name <> wsMaster.Name Then',
          '            lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row',
          '            If lastRow >= 2 Then',
          '                If targetRow = 1 Then',
          '                    ws.Range("A1:D" & lastRow).Copy wsMaster.Range("A1")',
          '                    targetRow = wsMaster.Cells(wsMaster.Rows.Count, "A").End(xlUp).Row + 1',
          '                Else',
          '                    ws.Range("A2:D" & lastRow).Copy wsMaster.Range("A" & targetRow)',
          '                    targetRow = wsMaster.Cells(wsMaster.Rows.Count, "A").End(xlUp).Row + 1',
          '                End If',
          '            End If',
          '        End If',
          '    Next ws',
          'End Sub',
          '```',
          '',
          '[THỰC TẾ]',
          'Macro này phù hợp khi các sheet con đều có cùng cấu trúc như `Ngày`, `Mã đơn`, `Chi nhánh`, `Doanh thu`.'
        ),
      },
      {
        id: 'adv-5-5',
        title: 'Bài 12.5: Tách báo cáo thành nhiều file theo chi nhánh hoặc nhân viên',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là nhóm macro rất hay dùng khi cần gửi báo cáo riêng cho từng chi nhánh, từng nhân viên hoặc từng khách hàng mà không muốn lọc và lưu tay nhiều lần.',
          '',
          '[VBA]',
          '```vb',
          'Sub SplitReportByBranch()',
          '    Dim wsData As Worksheet, wsTemp As Worksheet',
          '    Dim lastRow As Long, uniqueRange As Range, cell As Range',
          '    Dim branchName As String',
          '',
          '    Set wsData = ThisWorkbook.Worksheets("Data")',
          '    lastRow = wsData.Cells(wsData.Rows.Count, "B").End(xlUp).Row',
          '',
          '    wsData.Range("B1:B" & lastRow).AdvancedFilter _',
          '        Action:=xlFilterCopy, CopyToRange:=wsData.Range("H1"), Unique:=True',
          '',
          '    Set uniqueRange = wsData.Range("H2:H" & wsData.Cells(wsData.Rows.Count, "H").End(xlUp).Row)',
          '',
          '    For Each cell In uniqueRange',
          '        branchName = cell.Value',
          '        wsData.Range("A1:E" & lastRow).AutoFilter Field:=2, Criteria1:=branchName',
          '        Workbooks.Add',
          '        wsData.Range("A1:E" & lastRow).SpecialCells(xlCellTypeVisible).Copy ActiveSheet.Range("A1")',
          '        ActiveWorkbook.SaveAs ThisWorkbook.Path & "\\" & branchName & ".xlsx"',
          '        ActiveWorkbook.Close False',
          '    Next cell',
          '',
          '    wsData.AutoFilterMode = False',
          'End Sub',
          '```',
          '',
          '[ỨNG DỤNG]',
          'Phù hợp cho gửi bảng lương theo nhân viên, gửi doanh số theo sales, hoặc phát hành báo cáo riêng cho từng chi nhánh.'
        ),
      },
      {
        id: 'adv-5-6',
        title: 'Bài 12.6: Đổi tên file hàng loạt theo quy ước',
        content: joinLines(
          '[TÓM TẮT]',
          'Đổi tên file hàng loạt là nhu cầu rất thường gặp khi nhận file từ nhiều bộ phận nhưng tên file lộn xộn, khó tìm và khó lưu trữ.',
          '',
          '[VBA]',
          '```vb',
          'Sub RenameFilesInFolder()',
          '    Dim folderPath As String, fileName As String',
          '    Dim oldPath As String, newPath As String',
          '    Dim counter As Long',
          '',
          '    folderPath = ThisWorkbook.Path & "\\input\\"',
          '    fileName = Dir(folderPath & "*.xlsx")',
          '    counter = 1',
          '',
          '    Do While fileName <> ""',
          '        oldPath = folderPath & fileName',
          '        newPath = folderPath & "BaoCao_" & Format(counter, "000") & ".xlsx"',
          '        Name oldPath As newPath',
          '        counter = counter + 1',
          '        fileName = Dir',
          '    Loop',
          'End Sub',
          '```',
          '',
          '[THỰC TẾ]',
          'Hay dùng khi chuẩn hóa file upload từ chi nhánh, đổi tên phiếu lương, hoặc ép toàn bộ file đầu vào về cùng mẫu tên để dễ gộp.',
          '',
          '[BÀI TẬP]',
          'Tạo một thư mục có 10 file tên lộn xộn và đổi toàn bộ sang mẫu `DoanhThu_001`, `DoanhThu_002`... rồi kiểm tra thứ tự sau khi đổi tên.'
        ),
      },
      {
        id: 'adv-5-7',
        title: 'Bài 12.7: Tạo thư mục output và xuất nhiều PDF tự động',
        content: joinLines(
          '[TÓM TẮT]',
          'Thay vì xuất từng PDF bằng tay, VBA có thể tự tạo thư mục đầu ra và xuất toàn bộ báo cáo cần gửi chỉ trong một lần chạy.',
          '',
          '[VBA]',
          '```vb',
          'Sub ExportAllSheetsToPdf()',
          '    Dim ws As Worksheet',
          '    Dim outputFolder As String',
          '',
          '    outputFolder = ThisWorkbook.Path & "\\output"',
          '    If Dir(outputFolder, vbDirectory) = "" Then MkDir outputFolder',
          '',
          '    For Each ws In ThisWorkbook.Worksheets',
          '        If ws.Visible = xlSheetVisible And ws.Name <> "Input" Then',
          '            ws.ExportAsFixedFormat Type:=xlTypePDF, _',
          '                Filename:=outputFolder & "\\" & ws.Name & ".pdf"',
          '        End If',
          '    Next ws',
          'End Sub',
          '```',
          '',
          '[ỨNG DỤNG]',
          'Phù hợp khi cần xuất báo cáo tháng cho từng chi nhánh, từng phòng ban hoặc từng nhóm chỉ tiêu trước khi gửi nội bộ.',
          '',
          '[BÀI TẬP]',
          'Chuẩn bị 5 sheet báo cáo và viết macro để tạo thư mục `output`, sau đó xuất 5 file PDF tương ứng theo đúng tên sheet.'
        ),
      },
      {
        id: 'adv-5-8',
        title: 'Bài 12.8: Gửi mail Outlook kèm file báo cáo bằng VBA',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là dạng tự động hóa rất hữu ích khi phải gửi báo cáo định kỳ cho nhiều người nhận nhưng không muốn thao tác lặp đi lặp lại mỗi ngày.',
          '',
          '[VBA]',
          '```vb',
          'Sub SendMailWithAttachment()',
          '    Dim OutlookApp As Object',
          '    Dim OutlookMail As Object',
          '    Dim filePath As String',
          '',
          '    filePath = ThisWorkbook.Path & "\\output\\TongHop.pdf"',
          '    Set OutlookApp = CreateObject("Outlook.Application")',
          '    Set OutlookMail = OutlookApp.CreateItem(0)',
          '',
          '    With OutlookMail',
          '        .To = "team@example.com"',
          '        .CC = ""',
          '        .Subject = "Báo cáo ngày"',
          '        .Body = "Anh/chị vui lòng xem báo cáo đính kèm."',
          '        .Attachments.Add filePath',
          '        .Send',
          '    End With',
          'End Sub',
          '```',
          '',
          '[LƯU Ý QUAN TRỌNG]',
          'Nên thử bằng `.Display` trước khi dùng `.Send` để kiểm tra người nhận, tiêu đề và file đính kèm.',
          '',
          '[BÀI TẬP]',
          'Xuất trước một file PDF báo cáo, sau đó viết macro tạo mail Outlook với tiêu đề, nội dung và file đính kèm đúng chuẩn gửi nội bộ.'
        ),
      },
    ],
  },
  {
    id: 'adv-6',
    title: 'Case study theo vai trò công việc',
    iconName: 'Monitor',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-6-1',
        title: 'Case study: Kế toán tổng hợp và đối soát ngân hàng',
        content: joinLines(
          '[BÀI TOÁN]',
          'Kế toán nhận sao kê ngân hàng, sổ phát sinh nội bộ và danh mục tài khoản. Mục tiêu là tìm giao dịch chênh lệch và map đúng tài khoản.',
          '',
          '[YÊU CẦU]',
          '1. Dùng Power Query gộp sao kê theo ngày.',
          '2. Dùng Left Anti để tìm giao dịch có trên sao kê nhưng chưa hạch toán.',
          '3. Dùng Left Outer để map tài khoản từ danh mục.',
          '4. Tạo Pivot Table tổng hợp chênh lệch theo ngân hàng và theo người xử lý.',
          '5. Nếu cần, tạo macro export biên bản đối soát ra PDF.',
          '',
          '[MỤC TIÊU]',
          'Đây là một workflow sát thực tế cho kế toán nội bộ và kế toán tổng hợp.'
        ),
      },
      {
        id: 'adv-6-2',
        title: 'Case study: Vận hành và kiểm soát SLA đa ca',
        content: joinLines(
          '[BÀI TOÁN]',
          'Dữ liệu ticket đến từ nhiều nguồn: hệ thống nội bộ, form nhập tay và file upload của đối tác. Cần tính SLA, khối lượng theo ca và backlog cuối ngày.',
          '',
          '[YÊU CẦU]',
          '1. Làm sạch dữ liệu bằng Power Query.',
          '2. Dùng công thức ngày tháng để tính SLA.',
          '3. Dùng Pivot Table và dashboard để theo dõi theo ca trực.',
          '4. Tạo macro refresh + export báo cáo cuối ngày.',
          '',
          '[MỤC TIÊU]',
          'Giúp người học hiểu rõ cách ghép Excel + Power Query + VBA vào vận hành dịch vụ.'
        ),
      },
      {
        id: 'adv-6-3',
        title: 'Case study: Sales admin, tài chính và CFO pack',
        content: joinLines(
          '[BÀI TOÁN]',
          'Sales admin cần chốt doanh thu, finance cần mô hình lợi nhuận, CFO cần bộ KPI tháng và waterfall nguyên nhân lệch kế hoạch.',
          '',
          '[YÊU CẦU]',
          '1. Chuẩn hóa dữ liệu doanh thu theo chi nhánh, kênh và sales owner.',
          '2. Lập bảng bridge từ doanh thu -> giá vốn -> lãi gộp -> EBITDA.',
          '3. Tạo 3 tầng báo cáo: vận hành, tài chính quản trị, gói trình ban điều hành.',
          '4. Bổ sung sensitivity cho giá bán, sản lượng và biên lợi nhuận.',
          '',
          '[MỤC TIÊU]',
          'Đây là cầu nối giữa báo cáo vận hành và mô hình tài chính quản trị.'
        ),
      },
    ],
  },
  {
    id: 'adv-7',
    title: 'Mô hình tài chính, Finance và các dạng gần CFA',
    iconName: 'TrendingUp',
    level: 'Advanced',
    sections: [
      {
        id: 'adv-7-1',
        title: 'Bài 13.1: PMT, NPV, IRR, XNPV, XIRR',
        content: joinLines(
          '[TÓM TẮT]',
          'Phần tài chính và mô hình được chuyển xuống cuối để người học có nền dữ liệu, tư duy công thức và luồng xử lý trước khi chạm vào mô hình sâu hơn.',
          '',
          '[CÚ PHÁP]',
          '`=PMT(rate/12, số_tháng, -giá_trị_vay)`',
          '`=NPV(rate, dòng_tiền_năm1:nămN) - vốn_đầu_tư`',
          '`=IRR(vùng_dòng_tiền)`',
          '`=XNPV(rate, values, dates)`',
          '`=XIRR(values, dates)`',
          '',
          '[KHI NÀO DÙNG]',
          '- PMT: tính tiền trả định kỳ cho khoản vay.',
          '- NPV/IRR: dự án có kỳ đều.',
          '- XNPV/XIRR: dự án có dòng tiền theo ngày thực tế, không đều nhau.',
          '',
          '[BÀI TẬP]',
          'Lập bảng dòng tiền 5 năm cho một dự án mini và tính PMT, NPV, IRR, XNPV, XIRR.'
        ),
      },
      {
        id: 'adv-7-2',
        title: 'Bài 13.2: DCF, FCFF, FCFE, WACC, CAPM',
        content: joinLines(
          '[TÓM TẮT]',
          'Đây là cụm kiến thức gần CFA và corporate finance mà người làm tài chính quản trị hoặc phân tích đầu tư nên nắm.',
          '',
          '[KHÁI NIỆM CỐT LÕI]',
          '- FCFF: dòng tiền tự do cho toàn doanh nghiệp.',
          '- FCFE: dòng tiền tự do cho cổ đông.',
          '- WACC: suất chiết khấu bình quân gia quyền.',
          '- CAPM: ước tính cost of equity từ beta, risk-free rate và market premium.',
          '',
          '[CÔNG THỨC GỢI Ý]',
          '`FCFF = EBIT(1-T) + Khấu hao - Capex - Delta NWC`',
          '`WACC = E/V * Re + D/V * Rd * (1-T)`',
          '`Re = Rf + Beta * (Rm - Rf)`',
          '',
          '[BÀI TẬP]',
          'Xây một mô hình DCF mini gồm forecast doanh thu, EBIT margin, capex, working capital, FCFF và terminal value.'
        ),
      },
      {
        id: 'adv-7-3',
        title: 'Bài 13.3: Trái phiếu, duration, ratio và sensitivity',
        content: joinLines(
          '[TÓM TẮT]',
          'Ngoài DCF, nên hiểu thêm cấu trúc trái phiếu, duration, và các ratio cốt lõi theo phong cách phân tích đầu tư/CFA.',
          '',
          '[CHỦ ĐỀ NÊN HỌC]',
          '- Yield to Maturity (YTM).',
          '- Macaulay Duration và Modified Duration.',
          '- DuPont Analysis: biên lợi nhuận, vòng quay tài sản, đòn bẩy.',
          '- Sensitivity / Scenario Analysis cho doanh thu, margin, WACC, terminal growth.',
          '',
          '[BÀI TẬP]',
          '1. Tạo bảng sensitivity 2 chiều cho WACC và terminal growth.',
          '2. Tính nhanh duration cho trái phiếu coupon cố định.',
          '3. Dùng DuPont để phân rã ROE thành 3 phần.',
          '',
          '[MỤC TIÊU]',
          'Đưa người học từ mức làm file Excel tốt lên mức hiểu logic của phân tích tài chính và đầu tư.'
        ),
      },
    ],
  },
];

const studySectionExampleAppendix: Partial<Record<string, string>> = {
  'basic-1-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: bộ phận bán hàng gửi file đơn hàng mỗi ngày, có thêm 15 đến 30 dòng mới sau 17h.',
    '',
    '| Mã đơn | Ngày | Nhân viên | Doanh thu | Trạng thái |',
    '|---|---|---|---|---|',
    '| SO001 | 07/05/2026 | Lan | 12.500.000 | Đã giao |',
    '| SO002 | 07/05/2026 | Minh | 8.400.000 | Chờ giao |',
    '',
    '[THỰC HIỆN]',
    '1. Đổi vùng dữ liệu thành Table để công thức và định dạng tự mở rộng.',
    '2. Bật Filter để lọc nhanh đơn `Chờ giao` hoặc đơn của từng nhân viên.',
    '3. Freeze Panes để kéo xuống cuối file vẫn nhìn thấy tiêu đề cột.',
    '',
    '[KẾT QUẢ]',
    'Khi có dữ liệu mới, người học không phải kéo lại công thức hay tô lại màu bằng tay.'
  ),
  'basic-1-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: bạn phải nhập nhanh bảng chấm công nội bộ trước giờ họp sáng.',
    '',
    '[THỰC HIỆN]',
    'Dùng `Ctrl + D` để fill trạng thái xuống dưới, `Alt + =` để cộng tổng nhanh, `Ctrl + Shift + L` để bật Filter kiểm tra người đi muộn.',
    '',
    '[KẾT QUẢ]',
    'Phần này giúp người học hiểu phím tắt không phải để nhớ mẹo, mà để rút thời gian thao tác lặp lại hằng ngày.'
  ),
  'basic-2-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Chỉ số cần xem | Hàm phù hợp | Ý nghĩa |',
    '|---|---|---|',
    '| Tổng doanh thu ngày | `SUM` | Tổng số tiền bán được |',
    '| Số đơn phát sinh | `COUNTA` | Có bao nhiêu giao dịch |',
    '| Giá trị đơn trung bình | `AVERAGE` | Mỗi đơn trung bình bao nhiêu |',
    '| Đơn lớn nhất | `MAX` | Đơn nào cần xem lại hoặc ghi nhận |',
    '| Đơn nhỏ nhất | `MIN` | Phát hiện đơn bất thường quá thấp |',
    '',
    '[KẾT QUẢ]',
    'Người học sẽ thấy nhóm hàm cơ bản chính là bộ chỉ số đầu tiên để đọc sức khỏe một bảng dữ liệu.'
  ),
  'basic-2-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: kế toán công nợ nhập trạng thái thu tiền mỗi ngày nhưng hay gõ sai như `qua han`, `QH`, `quá hạn`.',
    '',
    '[THỰC HIỆN]',
    '1. Tạo dropdown chuẩn chỉ cho phép `Mới`, `Đang thu`, `Quá hạn`, `Đã thu`.',
    '2. Tô đỏ dòng `Quá hạn`, tô vàng dòng thiếu `Mã KH`.',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ Data Validation giúp chặn lỗi từ đầu, còn Conditional Formatting giúp nhìn lỗi ngay bằng mắt.'
  ),
  'basic-3-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã vật tư | Tên vật tư | Đơn vị | Đơn giá |',
    '|---|---|---|---|',
    '| VT001 | Giấy A4 | Ream | 78.000 |',
    '| VT002 | Mực in | Hộp | 245.000 |',
    '',
    '[THỰC HIỆN]',
    'Khi người nhập chỉ biết `Mã vật tư`, VLOOKUP sẽ lấy ra tên hàng và đơn giá để tránh nhập tay lặp lại.',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Nếu mã ở bảng nguồn có khoảng trắng thừa hoặc lệch kiểu text/number, kết quả sẽ dễ ra `#N/A` dù mắt nhìn tưởng giống nhau.'
  ),
  'basic-3-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: trưởng nhóm cần biết ngay hôm nay Hà Nội bán được bao nhiêu và có bao nhiêu đơn `Quá hạn`.',
    '',
    '[THỰC HIỆN]',
    '1. Dùng `SUMIF` để tính nhanh tổng doanh thu của chi nhánh Hà Nội.',
    '2. Dùng `COUNTIF` để đếm số hóa đơn đang ở trạng thái `Quá hạn`.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu nhóm hàm một điều kiện phù hợp cho báo cáo nhanh đầu ngày hoặc cuối ngày.'
  ),
  'basic-3-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Dữ liệu đầu vào | Ví dụ giá trị |',
    '|---|---|',
    '| Ngày | 07/05/2026 |',
    '| Mã KH | KH001 |',
    '| Chi nhánh | Hà Nội |',
    '| Trạng thái | Quá hạn |',
    '| Doanh thu | 52.000.000 |',
    '',
    '[KẾT QUẢ]',
    'Đây là dạng bài gần với công việc thật: dữ liệu ít cột nhưng đủ để luyện Table, SUMIF, COUNTIF và cảnh báo.'
  ),
  'basic-4-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: cuối ngày bạn phải rà một bảng 100 dòng trước khi gửi trưởng nhóm.',
    '',
    '[THỰC HIỆN]',
    '1. Sort theo ngày để xem có dòng nào lệch tháng hoặc nhập nhầm năm.',
    '2. Filter `Quá hạn` để rà những khoản phải thu gấp.',
    '3. Filter blank ở `Mã KH` để tìm dòng thiếu dữ liệu bắt buộc.',
    '4. Dùng Top 10 để soi nhanh các giao dịch lớn bất thường.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu kiểm soát thủ công là bước bắt buộc trước khi dùng công thức hay lên báo cáo.'
  ),
  'basic-4-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Sheet | Dùng để làm gì |',
    '|---|---|',
    '| Input | Dán dữ liệu gốc từ hệ thống |',
    '| Master | Danh mục mã khách hàng, chi nhánh, trạng thái |',
    '| Calc | Tính toán trung gian |',
    '| Report | Trình bày số cuối cùng để gửi |',
    '',
    '[KẾT QUẢ]',
    'Người học thấy bố cục file không chỉ để đẹp, mà để người khác tiếp quản mà không sợ nhập sai vào vùng công thức.'
  ),
  'basic-4-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Tình huống: 17h30 phải gửi báo cáo cho quản lý, nhưng file vừa được cập nhật thêm dữ liệu lúc 17h15.',
    '',
    '[THỰC HIỆN]',
    'Chạy checklist cuối ngày theo thứ tự: kiểm tra dòng trống, kiểm tra mã lỗi, xem giao dịch bất thường, rà công thức, đối chiếu tổng cuối bảng.',
    '',
    '[KẾT QUẢ]',
    'Phần này giúp người học hình thành thói quen tự soát file trước khi gửi, thay vì gửi xong mới phát hiện sai.'
  ),
  'inter-1-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Chi nhánh | Kênh | Trạng thái | Doanh thu |',
    '|---|---|---|---|',
    '| HN | Online | Đã thu | 12000000 |',
    '| HN | Retail | Quá hạn | 8000000 |',
    '| HCM | Online | Quá hạn | 15000000 |',
    '',
    '[THỰC HIỆN]',
    '1. Tính doanh thu Online tại HN: `=SUMIFS(D:D, A:A, "HN", B:B, "Online")`.',
    '2. Đếm số dòng quá hạn tại HN: `=COUNTIFS(A:A, "HN", C:C, "Quá hạn")`.',
    '3. Tính doanh thu trung bình của kênh Retail tại HN: `=AVERAGEIFS(D:D, A:A, "HN", B:B, "Retail")`.',
    '',
    '[KẾT QUẢ]',
    'Cùng một bảng dữ liệu, bạn trả lời được nhiều câu hỏi quản trị khác nhau mà không cần thêm cột phụ.'
  ),
  'inter-1-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã KH | Nhóm KH | Hạn mức nợ | NV phụ trách |',
    '|---|---|---|---|',
    '| KH001 | Đại lý | 50000000 | Lan |',
    '| KH002 | Retail | 12000000 | Minh |',
    '| KH003 | Online | 8000000 | Huy |',
    '',
    '[THỰC HIỆN]',
    'Tra cứu `KH002` để lấy hạn mức nợ bằng XLOOKUP: `=XLOOKUP("KH002", A:A, C:C, "Không thấy")`.',
    'Tra cứu cùng kết quả bằng INDEX MATCH: `=INDEX(C:C, MATCH("KH002", A:A, 0))`.',
    '',
    '[SO SÁNH ĐỂ HIỂU RÕ]',
    'Nếu cần kéo nhiều cột trả về, XLOOKUP thường dễ đọc hơn.',
    'Nếu file cũ hoặc máy chưa có Excel 365, INDEX MATCH là phương án an toàn hơn.'
  ),
  'inter-1-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã đơn | Chi nhánh | Sales | Doanh thu |',
    '|---|---|---|---|',
    '| SO001 | HN | Lan | 9000000 |',
    '| SO002 | HN | Lan | 15000000 |',
    '| SO003 | HCM | Minh | 7000000 |',
    '| SO004 | HN | Huy | 22000000 |',
    '',
    '[THỰC HIỆN]',
    '1. Lọc riêng giao dịch HN: `=FILTER(A2:D5, B2:B5="HN")`.',
    '2. Lấy danh sách sales không trùng: `=UNIQUE(C2:C5)`.',
    '3. Sắp xếp doanh thu giảm dần: `=SORT(A2:D5, 4, -1)`.',
    '',
    '[ỨNG DỤNG THỰC TẾ]',
    'Nếu team làm trên Google Sheets hoặc cần chia sẻ file online nhiều người cùng xem, có thể dùng thêm `QUERY` để tạo bảng tổng hợp ngay trên sheet mà không cần Pivot.',
    '',
    '[QUERY HAY DÙNG VÀ TÁC DỤNG]',
    "`=QUERY(A1:D5, \"select B, sum(D) where B is not null group by B label sum(D) 'Tổng doanh thu'\", 1)`",
    'Tác dụng: gom doanh thu theo từng chi nhánh để ra bảng tổng hợp nhanh.',
    "`=QUERY(A1:D5, \"select C, count(A) where B = 'HN' group by C label count(A) 'Số đơn HN'\", 1)`",
    'Tác dụng: đếm số đơn của từng sales trong riêng chi nhánh HN.',
    "`=QUERY(A1:D5, \"select * where D >= 10000000 order by D desc\", 1)`",
    'Tác dụng: lọc các đơn giá trị lớn và sắp xếp giảm dần để soi giao dịch nổi bật.',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    '`QUERY` là cú pháp mạnh trong Google Sheets. Nếu làm trên Excel desktop, bài toán tương đương thường nên giải bằng FILTER, Pivot Table, SUMIFS hoặc Power Query.',
    '',
    '[KẾT QUẢ]',
    'Người học sẽ thấy rõ bộ hàm động thay cho cách copy filter thủ công hoặc tạo cột phụ.'
  ),
  'inter-2-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Hóa đơn | Doanh thu | Trạng thái | Ngày quá hạn |',
    '|---|---|---|---|',
    '| HD001 | 120000000 | Quá hạn | 35 |',
    '| HD002 | 70000000 | Đã thu | 0 |',
    '| HD003 | 95000000 | Quá hạn | 12 |',
    '',
    '[THỰC HIỆN]',
    '1. Xếp loại doanh thu: `=IF(B2>=100000000, "Đạt", "Cần bổ sung")`.',
    '2. Cảnh báo thu gấp: `=IF(AND(C2="Quá hạn", D2>30), "Cần thu gấp", "Theo dõi")`.',
    '3. Gom thị trường trọng điểm: `=IF(OR(A2="HD001", A2="HD003"), "Ưu tiên", "Khác")`.',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ IF xử lý một quyết định, AND siết nhiều điều kiện, OR dùng cho nhiều trường hợp thay thế.'
  ),
  'inter-2-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Hợp đồng | Ngày bắt đầu | Ngày kết thúc |',
    '|---|---|---|',
    '| HD-A | 01/04/2026 | 30/06/2026 |',
    '| HD-B | 15/04/2026 | 14/07/2026 |',
    '',
    '[THỰC HIỆN]',
    '1. Lấy ngày cuối tháng của ngày bắt đầu: `=EOMONTH(B2, 0)`.',
    '2. Đếm số ngày làm việc từ bắt đầu đến kết thúc: `=NETWORKDAYS(B2, C2)`.',
    '3. Tính số tháng hiệu lực: `=DATEDIF(B2, C2, "m")`.',
    '4. So với hôm nay để biết còn hiệu lực hay không: `=IF(C2>=TODAY(), "Còn hạn", "Hết hạn")`.',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Nhiều lỗi nghiệp vụ xuất phát từ việc nhìn ngày tháng như text thay vì một giá trị logic có thể tính toán.'
  ),
  'inter-2-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã KH | Số hóa đơn | Mã nhóm | Kết quả tra cứu |',
    '|---|---|---|---|',
    '| KH001 | HD001 | DL | Có dữ liệu |',
    '| KH002 |  | RT | Thiếu dữ liệu |',
    '| KH999 | HD003 |  | Không tìm thấy |',
    '',
    '[THỰC HIỆN]',
    '1. Chống vỡ công thức tra cứu: `=IFERROR(VLOOKUP(A2, DanhMuc!A:D, 2, 0), "Không tìm thấy")`.',
    '2. Bắt dòng thiếu dữ liệu: `=IF(COUNTBLANK(A2:C2)>0, "Thiếu dữ liệu", "Hợp lệ")`.',
    '',
    '[KẾT QUẢ]',
    'Người nhập liệu biết ngay dòng nào cần sửa thay vì nhìn lỗi `#N/A` hoặc để file sai âm thầm.'
  ),
  'inter-3-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Trường dữ liệu | Kéo vào đâu | Ý nghĩa |',
    '|---|---|---|',
    '| Chi nhánh | Rows | Nhìn doanh thu theo từng nơi |',
    '| Kênh bán | Columns | So sánh Online và Retail |',
    '| Doanh thu | Values | Tổng hợp số tiền |',
    '| Tháng | Filter hoặc Slicer | Chuyển nhanh kỳ báo cáo |',
    '',
    '[THỰC HIỆN]',
    '1. Tạo Pivot doanh thu theo chi nhánh.',
    '2. Thêm Kênh bán vào Columns để nhìn cơ cấu.',
    '3. Thêm Slicer tháng để đổi góc nhìn chỉ bằng một cú click.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu Pivot không phải công cụ kỹ thuật khó, mà là cách trả lời nhanh các câu hỏi lặp đi lặp lại.'
  ),
  'inter-3-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Khu vực dashboard | Nội dung nên đặt |',
    '|---|---|',
    '| Dòng trên cùng | 4 KPI: Doanh thu, Lợi nhuận, Tỷ lệ hoàn thành, Công nợ quá hạn |',
    '| Khu giữa | 2 biểu đồ: theo chi nhánh và theo kênh |',
    '| Khu dưới | Bảng chi tiết giao dịch để soi nguyên nhân |',
    '',
    '[THỰC HIỆN]',
    'Khi người xem mở file, họ phải thấy tổng quan trong 5 giây đầu rồi mới kéo xuống chi tiết.',
    'Nếu phải kéo ngang nhiều hoặc đọc quá nhiều chữ, dashboard đang bị thiết kế sai mục tiêu.'
  ),
  'inter-3-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Sheet | Vai trò | Nội dung |',
    '|---|---|---|',
    '| Input | Nạp dữ liệu | File dump hoặc dữ liệu copy từ hệ thống |',
    '| Master | Danh mục | Mã KH, mã NV, hạn mức, mapping |',
    '| Calc | Tính toán | XLOOKUP, SUMIFS, cột kiểm tra |',
    '| Report | Báo cáo | Pivot, KPI, dashboard |',
    '',
    '[THỰC HIỆN]',
    'Đặt Named Range như `rng_customer_master`, `rng_sales_input`, `rng_report_month` để công thức dễ đọc và bàn giao dễ hơn.'
  ),
  'inter-4-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Ba file kênh bán có thể lệch nhau như sau:',
    '| Kênh | Lỗi thường gặp |',
    '|---|---|',
    '| Retail | Mã đơn có khoảng trắng cuối |',
    '| Online | Cột doanh thu đang là text |',
    '| Đại lý | Trùng mã đơn do nhập lại |',
    '',
    '[THỰC HIỆN]',
    '1. Chuẩn hóa mã đơn bằng `TRIM` hoặc Power Query Trim.',
    '2. Đổi doanh thu sang number trước khi tổng hợp.',
    '3. Dùng XLOOKUP lấy nhóm khách.',
    '4. Dùng SUMIFS và Pivot để ra báo cáo chốt ngày.',
    '',
    '[KẾT QUẢ]',
    'Người học nhìn thấy rõ chuỗi xử lý: làm sạch trước, tra cứu sau, báo cáo cuối cùng.'
  ),
  'inter-4-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Ticket | Ngày nhận | Ngày đóng | SLA chuẩn |',
    '|---|---|---|---|',
    '| TK001 | 01/05/2026 | 01/05/2026 | Trong ngày |',
    '| TK002 | 01/05/2026 | 05/05/2026 | 2 ngày làm việc |',
    '',
    '[THỰC HIỆN]',
    'Tính số ngày làm việc bằng `NETWORKDAYS` rồi gắn nhãn `Đúng SLA`, `Cảnh báo`, `Quá SLA` bằng `IFS`.',
    'Sau đó đưa Ca trực vào Rows và Trạng thái SLA vào Columns để tạo Pivot kiểm soát theo ca.'
  ),
  'inter-4-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Khách hàng | Dư nợ | Hạn mức | Ngày đến hạn |',
    '|---|---|---|---|',
    '| KH001 | 45000000 | 50000000 | 20/04/2026 |',
    '| KH002 | 18000000 | 12000000 | 15/04/2026 |',
    '',
    '[THỰC HIỆN]',
    '1. Dùng XLOOKUP để gọi hạn mức và nhóm khách hàng.',
    '2. Dùng `=IF(B2>C2, "Vượt hạn mức", "Trong hạn")` để cảnh báo.',
    '3. Dùng `=TODAY()-D2` để tính số ngày quá hạn rồi tô màu theo mức rủi ro.',
    '',
    '[KẾT QUẢ]',
    'Phần ví dụ này giúp người học hiểu vì sao công nợ không chỉ là tổng số tiền mà là sự kết hợp của hạn mức, tuổi nợ và mức độ ưu tiên.'
  ),
  'adv-1-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Tầng query | Tên gợi ý | Việc cần làm |',
    '|---|---|---|',
    '| Raw | `raw_SaoKe_2026_05` | Nạp nguyên dữ liệu từ file nguồn |',
    '| Staging | `stg_SaoKe` | Xóa dòng rác, sửa kiểu dữ liệu, chuẩn hóa cột |',
    '| Business | `fact_ThuChi` | Gắn mã tài khoản, gắn nhóm nghiệp vụ |',
    '| Report | `rpt_DoiSoatNgay` | Xuất bảng cuối cho Pivot hoặc dashboard |',
    '',
    '[KẾT QUẢ]',
    'Người học thấy Power Query không phải một query duy nhất, mà là một pipeline nhiều lớp để dễ bảo trì.'
  ),
  'adv-1-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Một file CSV bán hàng thường lỗi theo thứ tự: tiêu đề không đều, có dòng trống, mã có khoảng trắng, doanh thu đang là text.',
    '',
    '[DÙNG ĐỂ LÀM GÌ]',
    'Phần 8.2 dùng để làm sạch dữ liệu đầu vào trước khi cộng, lọc, nối bảng hoặc lên báo cáo. Đây là nhóm thao tác người dùng sẽ dùng lặp lại nhiều nhất trong Power Query.',
    '',
    '[ACTION HAY DÙNG VÀ TÁC DỤNG]',
    '| Action | Tác dụng | Khi nào dùng |',
    '|---|---|---|',
    '| Use First Row as Headers | Biến dòng đầu thành tên cột chuẩn | Khi file nguồn đang để tiêu đề nằm ở dòng 1 nhưng Power Query chưa nhận đúng |',
    '| Remove Blank Rows | Xóa các dòng rỗng gây nhiễu | Khi dữ liệu bị chèn dòng trống ở giữa bảng hoặc cuối file |',
    '| Trim / Clean | Xóa khoảng trắng và ký tự rác | Khi mã khách hàng, mã đơn, mã hàng nhìn giống nhau nhưng tra cứu bị lệch |',
    '| Split Column | Tách một cột thành nhiều phần | Khi một cột đang chứa cả mã, khu vực hoặc ngày tháng chung một ô |',
    '| Replace Values | Chuẩn hóa giá trị nhập không đồng nhất | Khi cùng một trạng thái nhưng bị nhập khác nhau như `done`, `Done`, `đã xong` |',
    '| Change Type | Đổi dữ liệu về đúng kiểu số, ngày, text | Khi cột doanh thu chưa cộng được hoặc cột ngày chưa lọc được theo tháng |',
    '| Fill Down | Điền giá trị từ trên xuống | Khi file nguồn chỉ ghi tên nhóm ở dòng đầu, các dòng dưới để trống |',
    '| Group By | Tổng hợp theo nhóm | Khi cần cộng doanh thu theo chi nhánh, đếm đơn theo sales hoặc tổng hợp công nợ theo khách hàng |',
    '| Unpivot | Chuyển dữ liệu ngang thành dọc | Khi file báo cáo có nhiều cột tháng nhưng muốn đưa về cấu trúc chuẩn để làm Pivot |',
    '',
    '[ĐẦU RA MONG ĐỢI]',
    'Một bảng staging sạch, đúng kiểu dữ liệu và có cấu trúc chuẩn để dùng tiếp cho XLOOKUP, Pivot, dashboard hoặc các bước gộp dữ liệu sau đó.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu mỗi action dùng để xử lý lỗi gì, thay vì chỉ nhớ tên nút mà không biết áp dụng ở đâu.'
  ),
  'adv-1-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Dữ liệu bẩn | Hàm M nên dùng | Kết quả |',
    '|---|---|---|',
    '| ` KH001 ` | `Text.Trim` | `KH001` |',
    '| `15/05/2026` dạng text | `Date.From` | ngày hợp lệ |',
    '| `12,500,000` dạng text | `Number.FromText` | số để cộng được |',
    '',
    '[DÙNG ĐỂ LÀM GÌ]',
    'Phần 8.3 giúp người học đọc hiểu các hàm M cơ bản đứng phía sau Power Query. Mục tiêu không phải học code nặng, mà biết hàm nào xử lý đúng vấn đề dữ liệu nào.',
    '',
    '[HÀM HAY DÙNG VÀ TÁC DỤNG]',
    '| Hàm M | Tác dụng | Khi nào dùng |',
    '|---|---|---|',
    '| `Text.Trim` | Xóa khoảng trắng đầu cuối | Khi mã khách hàng hoặc mã đơn nhìn giống nhau nhưng join không khớp |',
    '| `Text.Upper` | Chuẩn hóa chữ hoa | Khi cùng một mã nhưng có nơi nhập `hn`, nơi nhập `HN` |',
    '| `Date.From` | Chuyển text sang kiểu ngày | Khi cột ngày đang là chuỗi nên chưa lọc, chưa tính được |',
    '| `Number.FromText` | Chuyển text sang số | Khi cột tiền đang là text nên không cộng hoặc không so sánh được |',
    '| `Table.SelectRows` | Lọc dòng theo điều kiện | Khi chỉ muốn giữ giao dịch hợp lệ, đã duyệt hoặc thuộc một chi nhánh cụ thể |',
    '| `Table.AddColumn` | Tạo cột logic mới | Khi cần thêm cột phân loại như nhóm doanh thu, trạng thái nợ, mức ưu tiên |',
    '| `Table.RenameColumns` | Đổi tên cột rõ nghĩa | Khi dữ liệu nguồn đặt tên cột khó hiểu hoặc thay đổi theo từng file |',
    '| `Table.RemoveColumns` | Bỏ cột không cần thiết | Khi file nguồn có nhiều cột rác không phục vụ phân tích |',
    '| `Table.Combine` | Gộp nhiều bảng cùng cấu trúc | Khi cần gộp nhiều sheet hoặc nhiều file cùng layout vào một bảng tổng |',
    '',
    '[CÔNG THỨC MẪU NGẮN]',
    '`Text.Trim([MãKH])` dùng khi mã bị thừa khoảng trắng đầu cuối.',
    '`Number.FromText([Doanh thu])` dùng khi số tiền đang là text nên chưa cộng được.',
    '`Table.SelectRows(Source, each [Trạng thái] = "Đã duyệt")` dùng khi chỉ muốn giữ lại dòng hợp lệ cho báo cáo.',
    '',
    '[KẾT QUẢ]',
    'Người học nhìn vào là biết từng hàm phục vụ bước làm sạch, lọc, chuẩn hóa hay gộp dữ liệu nào trong quy trình Power Query.'
  ),
  'adv-2-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| File nguồn | Quy ước đúng | Rủi ro nếu sai |',
    '|---|---|---|',
    '| `sales_2026_01.xlsx` | Cùng số cột và cùng tiêu đề | Query gộp ổn định |',
    '| `sales_final_new.xlsx` | Tên tùy hứng, thiếu cột | Query dễ gãy khi refresh |',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Folder query mạnh khi cấu trúc file nguồn đồng nhất. Nếu mỗi tháng sửa tiêu đề một lần thì Power Query sẽ trở thành nơi sửa lỗi thay cho nơi tự động hóa.'
  ),
  'adv-2-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Bảng sao kê | Số tiền |',
    '|---|---|',
    '| GD001 | 5000000 |',
    '| GD002 | 7000000 |',
    '| GD003 | 9000000 |',
    '',
    '| Bảng hạch toán | Số tiền |',
    '|---|---|',
    '| GD001 | 5000000 |',
    '| GD003 | 9000000 |',
    '',
    '[THỰC HIỆN]',
    'Dùng Left Anti trên bảng sao kê để tìm `GD002`, tức giao dịch có ở ngân hàng nhưng chưa có ở sổ.',
    'Dùng Left Outer khi muốn giữ toàn bộ bảng phát sinh và map thêm tài khoản hoặc loại giao dịch từ bảng danh mục.'
  ),
  'adv-2-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã NV | Bộ phận | T1 | T2 | T3 |',
    '|---|---|---|---|---|',
    '| NV01 | Sales | 12 | 15 | 14 |',
    '| NV02 | Ops | 20 | 18 | 19 |',
    '',
    '[THỰC HIỆN]',
    'Sau khi Unpivot, bảng sẽ thành các cột `Mã NV`, `Bộ phận`, `Kỳ`, `Giá trị`.',
    'Đây là dạng dữ liệu đúng để làm Pivot, SUMIFS, hoặc nạp lên Data Model.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu vì sao dữ liệu nhìn đẹp cho mắt người chưa chắc đã đúng cho phân tích.'
  ),
  'adv-2-4': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Một workbook có 3 table: `tbl_T1`, `tbl_T2`, `tbl_T3`, mỗi table đều có các cột `Ngày`, `Mã đơn`, `Chi nhánh`, `Doanh thu`.',
    '',
    '[THỰC HIỆN]',
    'Dùng `Excel.CurrentWorkbook()` để đọc toàn bộ table trong file, lọc những table có tên bắt đầu bằng `tbl_`, sau đó append lại bằng `Table.Combine`.',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ Power Query không chỉ gộp file từ folder mà còn rất mạnh khi cần gộp nhiều sheet hoặc nhiều table trong cùng workbook.'
  ),
  'adv-3-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Mã đơn gốc | Mục tiêu | Hàm M |',
    '|---|---|---|',
    '| `HN-ONLINE-0001` | Lấy chi nhánh | `Text.BeforeDelimiter` |',
    '| `HN-ONLINE-0001` | Lấy phần sau dấu đầu tiên | `Text.AfterDelimiter` |',
    '| `27` | Thành `00027` | `Text.PadStart` |',
    '',
    '[KẾT QUẢ]',
    'Ví dụ này giúp người học thấy nhóm hàm text trong M chính là phiên bản xử lý chuỗi hàng loạt, sạch hơn việc làm trực tiếp trên sheet.'
  ),
  'adv-3-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Từ bảng giao dịch có cột `Ngày`, `Chi nhánh`, `Doanh thu`:',
    '',
    '[THỰC HIỆN]',
    '1. Dùng `Table.AddColumn` để tạo cột `Kỳ` theo đầu tháng từ cột `Ngày`.',
    '2. Dùng `Table.Group` để tổng hợp doanh thu theo `Chi nhánh` và `Kỳ`.',
    '3. Dùng `Table.RenameColumns` để đặt tên cột đầu ra dễ hiểu hơn cho người nhận báo cáo.',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ Table functions là cách xây cả pipeline biến đổi dữ liệu, không chỉ thêm từng cột đơn lẻ.'
  ),
  'adv-3-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Dữ liệu gốc | Rủi ro | Cách xử lý |',
    '|---|---|---|',
    '| `N/A` ở cột tiền | Đổi số bị lỗi | `try Number.FromText([Số tiền]) otherwise 0` |',
    '| `31-02-2026` | Ngày không hợp lệ | `try Date.From([Ngày]) otherwise null` |',
    '',
    '[KẾT QUẢ]',
    'Thay vì query dừng toàn bộ, dữ liệu bẩn được khoanh đúng vị trí để người vận hành xử lý tiếp.'
  ),
  'adv-4-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Một macro export báo cáo tháng thường chạy theo thứ tự:',
    '1. SafeModeStart để tăng tốc.',
    '2. Refresh dữ liệu hoặc tính toán.',
    '3. Xuất báo cáo hoặc tạo file đích.',
    '4. SafeModeEnd để trả Excel về trạng thái bình thường.',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Nếu macro lỗi giữa chừng mà không bật lại `EnableEvents` hoặc `Calculation`, người dùng sẽ thấy Excel hoạt động bất thường sau đó.'
  ),
  'adv-4-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Sau khi import dữ liệu vào sheet `Input`, cột A có thể dài 500 dòng hôm nay nhưng 1200 dòng ngày mai.',
    'Hàm `LastRow(ws, "A")` giúp macro luôn biết dòng cuối thực sự để copy hoặc kiểm tra dữ liệu.',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu ngay vì sao macro không nên hard-code kiểu `Range("A2:D500")` nếu file là dữ liệu vận hành hàng ngày.'
  ),
  'adv-4-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Nút bấm | Việc người dùng mong đợi | Macro cần làm |',
    '|---|---|---|',
    '| Refresh | Cập nhật số mới nhất | `ThisWorkbook.RefreshAll` |',
    '| Xuất PDF | Chốt báo cáo gửi đi | Export sheet hiện tại ra PDF |',
    '',
    '[KẾT QUẢ]',
    'Ví dụ này biến VBA từ khái niệm kỹ thuật sang một nút bấm rất cụ thể trong quy trình bàn giao báo cáo.'
  ),
  'adv-5-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Folder `input` chứa 30 file lương theo từng chi nhánh.',
    'Macro duyệt từng file, mở ra, lấy sheet `Data`, copy xuống workbook tổng hợp rồi đóng file nguồn.',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Khi đọc ví dụ này, người học sẽ dễ hình dung bài toán thật hơn nhiều so với việc chỉ nhớ cú pháp `Dir`.'
  ),
  'adv-5-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Nút trên màn hình | Ý nghĩa với người dùng cuối |',
    '|---|---|',
    '| Refresh | Lấy dữ liệu mới nhất |',
    '| Kiểm tra dữ liệu | Báo dòng thiếu hoặc sai mã |',
    '| Xuất PDF | Tạo báo cáo để gửi ngay |',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ mục tiêu của VBA trong bàn giao không phải viết code cho đẹp, mà là giảm số bước thao tác tay của người dùng.'
  ),
  'adv-5-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Lỗi | Biểu hiện | Cách tránh |',
    '|---|---|---|',
    '| Dùng `Select` nhiều | Macro chậm, dễ nhảy sai sheet | Tham chiếu trực tiếp `ws.Cells(...)` |',
    '| Quên bật lại Calculation | Công thức không cập nhật | Gói trong `SafeModeStart` và `SafeModeEnd` |',
    '| Phụ thuộc `ActiveWorkbook` | Chạy nhầm file đang mở | Luôn gán biến workbook rõ ràng |',
    '',
    '[KẾT QUẢ]',
    'Người học không chỉ biết lỗi gì hay xảy ra, mà còn biết dấu hiệu nhận diện và cách phòng tránh ngay từ đầu.'
  ),
  'adv-5-4': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Sheet nguồn | Nội dung |',
    '|---|---|',
    '| `CN_HN` | Doanh thu Hà Nội |',
    '| `CN_HCM` | Doanh thu TP.HCM |',
    '| `CN_DN` | Doanh thu Đà Nẵng |',
    '| `TongHop` | Sheet đích để gom dữ liệu |',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Cần thống nhất cấu trúc các sheet nguồn. Nếu một sheet lệch cột, macro vẫn chạy nhưng bảng tổng hợp sẽ rất dễ lệch dữ liệu.'
  ),
  'adv-5-5': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Chi nhánh | Số dòng dữ liệu | File đầu ra |',
    '|---|---:|---|',
    '| Hà Nội | 120 | `Ha Noi.xlsx` |',
    '| TP.HCM | 95 | `TP HCM.xlsx` |',
    '| Đà Nẵng | 48 | `Da Nang.xlsx` |',
    '',
    '[KẾT QUẢ]',
    'Người học hiểu đây là dạng macro bàn giao cực hữu ích khi phải gửi báo cáo riêng cho nhiều đầu mối trong thời gian ngắn.'
  ),
  'adv-5-6': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Tên file cũ | Tên file mới mong muốn |',
    '|---|---|',
    '| `final_hn.xlsx` | `BaoCao_001.xlsx` |',
    '| `abc_new.xlsx` | `BaoCao_002.xlsx` |',
    '| `data1.xlsx` | `BaoCao_003.xlsx` |',
    '',
    '[KẾT QUẢ]',
    'Người học thấy rõ macro đổi tên file không phục vụ mục đích kỹ thuật đơn thuần, mà để chuẩn hóa thư mục đầu vào cho các bước gộp và đối soát sau đó.'
  ),
  'adv-5-7': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Sheet báo cáo | File PDF đầu ra |',
    '|---|---|',
    '| `ChiNhanh_HN` | `ChiNhanh_HN.pdf` |',
    '| `ChiNhanh_HCM` | `ChiNhanh_HCM.pdf` |',
    '| `TongHop` | `TongHop.pdf` |',
    '',
    '[LƯU Ý QUAN TRỌNG]',
    'Nên tách riêng thư mục `output` để người dùng không lẫn file xuất với file nguồn. Đây là thói quen rất hữu ích khi bàn giao báo cáo định kỳ.'
  ),
  'adv-5-8': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Người nhận | File đính kèm | Mục đích |',
    '|---|---|---|',
    '| `sales@example.com` | `DoanhSo.pdf` | Gửi báo cáo bán hàng cuối ngày |',
    '| `finance@example.com` | `CongNo.pdf` | Gửi báo cáo công nợ |',
    '| `ops@example.com` | `SLA.pdf` | Gửi báo cáo vận hành |',
    '',
    '[KẾT QUẢ]',
    'Người học hình dung rõ chuỗi tự động hóa hoàn chỉnh: xuất file trước, sau đó tạo mail đúng người nhận và đúng tài liệu cần gửi.'
  ),
  'adv-6-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Luồng xử lý điển hình:',
    '1. Nạp sao kê ngân hàng và sổ phát sinh vào Power Query.',
    '2. Chuẩn hóa cột ngày, diễn giải, số tiền.',
    '3. Dùng Left Anti để lôi ra các giao dịch chưa hạch toán.',
    '4. Dùng Pivot tổng hợp chênh lệch theo ngân hàng hoặc theo người xử lý.',
    '',
    '[KẾT QUẢ]',
    'Ví dụ này giúp người học thấy đây là một quy trình đối soát đầu cuối, không phải các kỹ thuật rời rạc.'
  ),
  'adv-6-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Nguồn ticket | Dạng lỗi thường gặp |',
    '|---|---|',
    '| Form nhập tay | Thiếu giờ đóng ticket |',
    '| File đối tác | Sai tên cột hoặc thiếu mã ca |',
    '| Hệ thống nội bộ | Dư dữ liệu kỹ thuật không cần báo cáo |',
    '',
    '[THỰC HIỆN]',
    'Làm sạch bằng Power Query, tính SLA bằng công thức ngày tháng, rồi refresh và export báo cáo cuối ngày bằng macro.'
  ),
  'adv-6-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Tầng báo cáo | Người dùng chính | Câu hỏi cần trả lời |',
    '|---|---|---|',
    '| Vận hành | Sales admin | Hôm nay bán bao nhiêu, kênh nào tốt |',
    '| Tài chính quản trị | Finance | Lãi gộp và EBITDA biến động vì đâu |',
    '| Điều hành | CFO | Kế hoạch lệch thực tế do giá, sản lượng hay mix |',
    '',
    '[KẾT QUẢ]',
    'Người học thấy một bộ dữ liệu có thể phục vụ nhiều lớp báo cáo nếu chuẩn hóa đúng từ đầu.'
  ),
  'adv-7-1': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Năm | Dòng tiền |',
    '|---|---|',
    '| 0 | -500000000 |',
    '| 1 | 140000000 |',
    '| 2 | 160000000 |',
    '| 3 | 180000000 |',
    '| 4 | 190000000 |',
    '| 5 | 210000000 |',
    '',
    '[THỰC HIỆN]',
    'Nếu dòng tiền theo năm đều nhau, bắt đầu bằng NPV và IRR.',
    'Nếu dòng tiền phát sinh theo ngày thực tế khác nhau, chuyển sang XNPV và XIRR để tránh sai lệch.'
  ),
  'adv-7-2': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    'Một DCF mini có thể đi theo cầu nối trực quan:',
    'Doanh thu -> EBIT -> EBIT sau thuế -> cộng khấu hao -> trừ Capex -> trừ Delta NWC -> ra FCFF.',
    '',
    '[KẾT QUẢ]',
    'Người học tài chính sẽ bớt ngợp vì nhìn được đường đi của mô hình thay vì chỉ thấy một loạt công thức rời rạc.'
  ),
  'adv-7-3': joinLines(
    '[VÍ DỤ THỰC TẾ]',
    '| Terminal growth \\ WACC | 11% | 12% | 13% |',
    '|---|---|---|---|',
    '| 2% | 980 | 920 | 865 |',
    '| 3% | 1040 | 975 | 910 |',
    '| 4% | 1115 | 1035 | 960 |',
    '',
    '[THỰC HIỆN]',
    'Bảng sensitivity này cho thấy chỉ cần WACC đổi 1 điểm phần trăm thì định giá có thể đổi rất mạnh.',
    'Đây là ví dụ trực quan để người học hiểu vì sao phần giả định trong mô hình tài chính quan trọng hơn việc bấm ra một con số đẹp.'
  ),
};

const buildPracticeBlock = (items: string[], output: string, hint?: string) =>
  [
    '[BÀI TẬP THEO MỨC]',
    ...items.map((item, index) => `${index + 1}. ${item}`),
    ...(hint ? ['', '[GỢI Ý LÀM]', hint] : []),
    '',
    '[ĐẦU RA MONG ĐỢI]',
    output,
  ].join('\n');

const buildDetailedPracticeBlock = (
  scenario: string,
  columns: Array<[string, string]>,
  items: string[],
  output: string,
  hint?: string
) =>
  [
    '[BÀI TẬP THEO MỨC]',
    `Tình huống: ${scenario}`,
    '',
    'Bảng hoặc cột nên có:',
    '| Cột | Dùng để làm gì |',
    '|---|---|',
    ...columns.map(([name, purpose]) => `| ${name} | ${purpose} |`),
    '',
    ...items.map((item, index) => `Mức ${index + 1}: ${item}`),
    ...(hint ? ['', '[GỢI Ý LÀM]', hint] : []),
    '',
    '[ĐẦU RA MONG ĐỢI]',
    output,
  ].join('\n');

const studySectionDetailedPracticeAppendix: Partial<Record<string, string>> = {
  'basic-1-2': buildDetailedPracticeBlock(
    'Bạn nhận một file bán hàng cuối ngày từ team vận hành và cần lọc nhanh đơn theo chi nhánh, theo trạng thái và kiểm tra các đơn giá trị lớn.',
    [
      ['Ngày', 'Lọc theo ngày báo cáo'],
      ['Mã đơn', 'Định danh từng giao dịch'],
      ['Chi nhánh', 'Lọc theo khu vực hoặc cửa hàng'],
      ['Kênh bán', 'So sánh Retail, Online, Đại lý'],
      ['Sales', 'Theo dõi người phụ trách'],
      ['Doanh thu', 'Tính tổng và tìm đơn lớn'],
      ['Trạng thái', 'Lọc đơn hoàn tất, hủy, chờ xử lý'],
    ],
    [
      'Tạo Table cho toàn bộ vùng dữ liệu và đặt tên dễ hiểu.',
      'Lọc riêng các đơn của một chi nhánh trong ngày hôm nay.',
      'Sắp xếp giảm dần theo doanh thu để lấy 5 đơn lớn nhất.',
    ],
    'Có một bảng dữ liệu đã vào Table, lọc được theo điều kiện và truy ra nhanh các đơn cần kiểm tra.'
  ),
  'basic-3-1': buildDetailedPracticeBlock(
    'Bạn có một bảng đơn hàng và một bảng danh mục khách hàng, cần tra cứu nhóm khách hàng và hạn mức nợ về bảng chính.',
    [
      ['Bảng đơn hàng: Mã KH', 'Khóa để tra cứu'],
      ['Bảng đơn hàng: Doanh thu', 'Dùng cho báo cáo cuối'],
      ['Danh mục: Mã KH', 'Khóa chính của bảng master'],
      ['Danh mục: Nhóm KH', 'Thông tin cần gọi về'],
      ['Danh mục: Hạn mức nợ', 'Thông tin cần gọi về'],
    ],
    [
      'Tra cứu Nhóm KH bằng VLOOKUP hoặc XLOOKUP.',
      'Tra cứu Hạn mức nợ và kiểm tra các dòng không tìm thấy.',
      'Tô màu những dòng tra cứu lỗi để người nhập biết cần bổ sung danh mục.',
    ],
    'Bảng đơn hàng có thêm đủ thông tin master để phục vụ phân loại và kiểm soát công nợ.'
  ),
  'inter-1-1': buildDetailedPracticeBlock(
    'Bạn nhận file doanh thu tháng và cần tổng hợp theo chi nhánh, kênh bán và sales owner để làm KPI nhanh.',
    [
      ['Ngày', 'Lọc theo kỳ báo cáo'],
      ['Chi nhánh', 'Điều kiện tổng hợp chính'],
      ['Kênh bán', 'Điều kiện tổng hợp phụ'],
      ['Sales owner', 'Phân tích theo người phụ trách'],
      ['Doanh thu', 'Cột dùng cho SUMIFS, AVERAGEIFS'],
      ['Trạng thái', 'Có thể lọc thêm đơn hoàn tất hoặc quá hạn'],
    ],
    [
      'Tính tổng doanh thu theo 2 điều kiện Chi nhánh và Kênh bán.',
      'Đếm số giao dịch quá hạn trên 30 ngày theo từng chi nhánh.',
      'Tạo bảng KPI gồm doanh thu, số đơn và doanh thu trung bình theo sales owner.',
    ],
    'Có một bảng tổng hợp ít nhất 3 chỉ số và người xem đọc là hiểu được hiệu suất của từng nhóm.'
  ),
  'inter-1-2': buildDetailedPracticeBlock(
    'Bạn có một bảng đơn hàng và một bảng master khách hàng, cần gọi nhiều thông tin về để phân loại báo cáo.',
    [
      ['Bảng đơn hàng: Mã KH', 'Khóa tra cứu'],
      ['Bảng master: Mã KH', 'Khóa đối chiếu'],
      ['Nhóm KH', 'Dùng để phân loại khách hàng'],
      ['Hạn mức nợ', 'Dùng để kiểm soát rủi ro'],
      ['NV phụ trách', 'Dùng để giao việc hoặc truy người quản lý'],
    ],
    [
      'Tra cứu 1 cột thông tin khách hàng bằng XLOOKUP.',
      'Tra cứu 3 cột liên tiếp gồm Nhóm KH, Hạn mức nợ, NV phụ trách.',
      'Làm lại cùng bài bằng INDEX MATCH và ghi rõ khi nào nên chọn mỗi cách.',
    ],
    'Có bảng đối chiếu 2 cách tra cứu và người học hiểu được cách nào phù hợp hơn với file thực tế.'
  ),
  'inter-1-3': buildDetailedPracticeBlock(
    'Bạn cần tạo một mini report động để trưởng nhóm lọc nhanh giao dịch theo chi nhánh, sales và mức doanh thu.',
    [
      ['Mã đơn', 'Định danh giao dịch'],
      ['Chi nhánh', 'Điều kiện FILTER'],
      ['Sales', 'Tạo danh sách UNIQUE hoặc nhóm QUERY'],
      ['Doanh thu', 'Sắp xếp, lọc top giao dịch'],
      ['Ngày', 'Lọc theo kỳ hoặc theo ngày chốt'],
    ],
    [
      'Dùng FILTER để tách riêng giao dịch của một chi nhánh.',
      'Dùng UNIQUE để tạo danh sách sales hoặc khách hàng không trùng.',
      'Kết hợp FILTER + SORT hoặc QUERY để tạo top giao dịch giá trị cao theo điều kiện.',
    ],
    'Có một mini report thay đổi theo điều kiện lọc mà không cần copy paste dữ liệu thủ công.'
  ),
  'inter-3-1': buildDetailedPracticeBlock(
    'Bạn chuẩn bị buổi họp doanh số và cần một Pivot Table trả lời nhanh theo chi nhánh, kênh và tháng.',
    [
      ['Ngày', 'Nhóm hoặc lọc theo tháng'],
      ['Chi nhánh', 'Đưa vào Rows'],
      ['Kênh bán', 'Đưa vào Columns'],
      ['Sales', 'Dùng cho slicer hoặc phân tích sâu'],
      ['Doanh thu', 'Dùng ở Values'],
      ['Mã đơn', 'Dùng để đếm số đơn'],
    ],
    [
      'Tạo Pivot doanh thu theo chi nhánh.',
      'Thêm Columns theo kênh bán và đổi Values giữa Sum và Count.',
      'Gắn Slicer tháng và nhân viên để mô phỏng một buổi họp doanh số.',
    ],
    'Có một Pivot Table trả lời được câu hỏi bán ở đâu, qua kênh nào, trong kỳ nào.'
  ),
  'inter-4-1': buildDetailedPracticeBlock(
    'Bạn là sales admin, mỗi ngày nhận 3 file bán hàng từ Retail, Online và Đại lý để chốt báo cáo doanh thu cuối ngày.',
    [
      ['Mã đơn', 'Kiểm tra trùng và chuẩn hóa'],
      ['Mã KH', 'Tra cứu nhóm khách hàng'],
      ['Chi nhánh', 'Nhóm doanh thu'],
      ['Kênh bán', 'Phân loại nguồn doanh thu'],
      ['Doanh thu', 'Tổng hợp cuối ngày'],
      ['Ngày bán', 'Chốt đúng kỳ'],
    ],
    [
      'Làm sạch mã đơn và mã khách hàng của 3 kênh bán.',
      'Tìm đơn trùng và đơn sai định dạng trước khi tổng hợp.',
      'Chốt báo cáo cuối ngày có tổng doanh thu theo kênh và top 5 đơn lớn nhất.',
    ],
    'Có quy trình chốt báo cáo từ dữ liệu lộn xộn mà vẫn truy nguyên được lỗi ở từng bước.'
  ),
  'adv-1-2': buildDetailedPracticeBlock(
    'Bạn nhận file CSV doanh thu mỗi ngày từ hệ thống, cấu trúc lặp lại nhưng luôn có dòng trống, cột text và tiêu đề chưa chuẩn.',
    [
      ['Ngày bán', 'Đổi đúng kiểu ngày'],
      ['Mã đơn', 'Làm sạch mã'],
      ['Chi nhánh', 'Phân tích theo nơi bán'],
      ['Kênh bán', 'Phân loại nguồn doanh thu'],
      ['Doanh thu', 'Đổi từ text sang number'],
    ],
    [
      'Làm sạch một file CSV có dòng trống và cột doanh thu đang ở dạng text.',
      'Tách query staging và report từ cùng một nguồn dữ liệu.',
      'Refresh lại với một file mới và kiểm tra query có bền hay không.',
    ],
    'Có 2 query rõ vai trò, refresh được với file mới mà không phải sửa tay từng bước.'
  ),
  'adv-2-4': buildDetailedPracticeBlock(
    'Bạn có một workbook chứa nhiều sheet hoặc table tháng T1, T2, T3 cùng cấu trúc và cần gộp thành một bảng master để làm Pivot.',
    [
      ['Ngày', 'Giữ nguyên để phân tích theo kỳ'],
      ['Mã đơn', 'Tránh trùng khi gộp'],
      ['Chi nhánh', 'Phân tích theo nơi bán'],
      ['Doanh thu', 'Tổng hợp báo cáo'],
      ['Tên bảng hoặc tên sheet', 'Có thể giữ lại để truy nguồn'],
    ],
    [
      'Dùng Power Query để đọc toàn bộ table có cùng tiền tố tên.',
      'Gộp tất cả lại thành một bảng master duy nhất bằng Table.Combine.',
      'Kiểm tra lại số dòng sau khi gộp và đối chiếu với số dòng từng tháng.',
    ],
    'Có một bảng master duy nhất, sẵn sàng cho Pivot hoặc dashboard mà không cần copy thủ công từng sheet.'
  ),
};

const buildCaseStudyBlock = (
  title: string,
  input: string[],
  sampleData: string[],
  process: string[],
  output: string[],
  scoring: string[]
) =>
  [
    '[CASE STUDY THỰC CHIẾN]',
    title,
    '',
    '[ĐẦU VÀO]',
    ...input.map((item, index) => `${index + 1}. ${item}`),
    '',
    '[BẢNG SỐ LIỆU MẪU]',
    ...sampleData,
    '',
    '[QUY TRÌNH XỬ LÝ]',
    ...process.map((item, index) => `${index + 1}. ${item}`),
    '',
    '[ĐẦU RA CUỐI CÙNG]',
    ...output.map((item, index) => `${index + 1}. ${item}`),
    '',
    '[TIÊU CHÍ TỰ CHẤM]',
    ...scoring.map((item, index) => `${index + 1}. ${item}`),
  ].join('\n');

const studySectionPracticeAppendix: Partial<Record<string, string>> = {
  'basic-1-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Nhận một bảng theo dõi chi phí đang bị gộp ô (Merge Cells) ở cột Phòng ban và có chèn 3 dòng "Tổng cộng tháng" nằm xen giữa dữ liệu; hãy tháo bỏ toàn bộ Merge Cells và xóa các dòng tổng trung gian.',
      'Mức 2 (Nâng cao): Chuẩn hóa lại cấu trúc bảng phẳng 6 cột chuẩn: `Số chứng từ`, `Ngày hạch toán`, `Mã đối tượng`, `Bộ phận`, `Khoản mục`, `Số tiền`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kiểm tra xem có cột nào đang chứa 2 thông tin gộp chung (ví dụ `"KH001 - Công ty Minh Anh"`) thì tách thành 2 cột riêng biệt để sẵn sàng chạy SUMIFS/Pivot.',
    ],
    'Có một bảng phẳng (Flat Table) chuẩn 100%, không còn ô Merge, không có dòng trống hay dòng tổng cộng xen giữa dữ liệu gốc.',
    'Nguyên tắc vàng: Dữ liệu nguồn (Input/Raw) chỉ dùng để lưu giao dịch theo dòng; mọi phép cộng tổng phải tách sang khu vực Báo cáo hoặc dòng Total của Excel Table.'
  ),
  'basic-1-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `Ctrl + Mũi tên` để di chuyển đến dòng cuối cùng của bảng 500 dòng và dùng `Ctrl + Shift + L` bật/tắt bộ lọc trong 1 giây.',
      'Mức 2 (Nâng cao): Chọn nhanh toàn bộ cột dữ liệu bằng `Ctrl + Shift + Mũi tên xuống`, điền nhanh công thức từ dòng đầu xuống bằng `Ctrl + D` và chèn dòng tổng cộng nhanh bằng `Alt + =`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Phát hiện bẫy đứt quãng khi bấm `Ctrl + Shift + Xuống` trên cột có ô trống ở giữa bảng — thay vào đó hãy di chuyển xuống đáy bảng rồi chọn ngược lên hoặc dùng Excel Table (`Ctrl + Space`).',
    ],
    'Hoàn thành thao tác định dạng, điền công thức và tính tổng bảng 500 dòng trong dưới 30 giây mà không cần dùng chuột kéo thủ công.',
    'Khi bảng có ô trống giữa chừng, phím `Ctrl + Mũi tên` sẽ dừng ngay tại ô trống đó để giúp bạn phát hiện luôn dòng thiếu dữ liệu!'
  ),
  'basic-2-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Lập bảng tổng quan 5 chỉ số sức khỏe dữ liệu: Tổng số tiền (`SUM`), Số dòng giao dịch (`COUNTA`), Giá trị trung bình (`AVERAGE`), Giao dịch lớn nhất (`MAX`) và nhỏ nhất (`MIN`).',
      'Mức 2 (Nâng cao): Phân biệt `COUNT(E2:E100)` và `COUNTA(E2:E100)` để tìm ra có bao nhiêu dòng trong cột Số tiền bị nhập nhầm chữ (`=COUNTA(E2:E100) - COUNT(E2:E100)`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Xử lý bẫy hàm `AVERAGE` bị lệch khi các dòng chưa phát sinh bị gõ số `0` thay vì để trống, hoặc khi cột Số tiền có dòng đang lưu dạng Text.',
    ],
    'Có bảng 5 chỉ số KPI tổng quan kèm dòng kiểm tra chênh lệch giữa tổng số dòng và số dòng kiểu Số hợp lệ.',
    'Nếu `COUNTA` lớn hơn `COUNT` trên cột Số tiền, chắc chắn có dòng đang bị lưu dưới dạng Text khiến `SUM` và `AVERAGE` bị sai lệch!'
  ),
  'basic-2-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `TRIM(A2)` xóa khoảng trắng thừa của mã khách hàng/SKU và dùng `LEN(TRIM(A2))` kiểm tra độ dài mã quy chuẩn.',
      'Mức 2 (Nâng cao): Từ chuỗi mã chứng từ `PXK-2026-WH01`, dùng `LEFT(A2, 3)` lấy loại phiếu, `MID(A2, 5, 4)` lấy năm và `RIGHT(A2, 4)` lấy mã kho.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Xử lý cột Số tiền bị lưu dạng chuỗi có dấu chấm phân cách nghìn (`"18.500.000"`) bằng công thức `=VALUE(SUBSTITUTE(C2, ".", ""))`.',
    ],
    'Tách được đầy đủ các thành phần mã ra từng cột riêng và chuyển đổi sạch các chuỗi số bẩn về kiểu Number tính toán được.',
    'Lưu ý: Kết quả của `LEFT`, `MID`, `RIGHT`, `SUBSTITUTE` luôn là kiểu Text; nếu muốn so sánh số học hoặc cộng trừ thì nhớ bọc hàm `VALUE(...)` ở ngoài.'
  ),
  'basic-2-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tạo danh mục chuẩn ở sheet `Master` và thiết lập Data Validation (List) cho cột `Trạng thái` và `Chi nhánh` để khóa việc gõ tay tự do.',
      'Mức 2 (Nâng cao): Thiết lập Conditional Formatting tô màu đỏ cho các ô có trạng thái `"Quá hạn"` hoặc `"Trễ SLA"`, tô màu vàng cho các giao dịch vượt ngưỡng 50 triệu.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Viết quy tắc Conditional Formatting bằng công thức `=$F2="Quá hạn"` (khóa cột `$F`, thả dòng `2`) để tô đỏ toàn bộ dòng từ cột A đến cột G khi trạng thái ở cột F là Quá hạn.',
    ],
    'Biểu mẫu nhập liệu chặn hoàn toàn lỗi gõ sai chính tả trạng thái và tự động bật sáng cả dòng dữ liệu rủi ro.',
    'Data Validation chỉ chặn khi người dùng gõ trực tiếp; nếu họ Copy-Paste đè vào ô thì vẫn lọt dữ liệu bẩn nên cần kết hợp Conditional Formatting để giám sát.'
  ),
  'basic-3-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `SUMIF` tính tổng doanh thu/dư nợ/giá trị tồn theo từng Chi nhánh/Kho và dùng `COUNTIF` đếm số lượng giao dịch tương ứng.',
      'Mức 2 (Nâng cao): Thay vì gõ cứng chuỗi `"Hà Nội"` vào công thức, hãy tham chiếu động tới ô tiêu đề bảng tổng hợp `=SUMIF($B$2:$B$100, H2, $E$2:$E$100)` để kéo công thức cho 10 chi nhánh cùng lúc.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Đặt dòng kiểm tra chéo (Cross-check): Tổng của bảng `SUMIF` theo toàn bộ chi nhánh phải khớp 100% với `SUM` của bảng gốc; nếu lệch là do có dòng thừa dấu cách hoặc thiếu tên chi nhánh.',
    ],
    'Có bảng tổng hợp tự động theo danh mục kèm ô kiểm tra chênh lệch `=SUM(Bảng_Tổng_Hợp) - SUM(Bảng_Gốc) = 0`.',
    'Luôn khóa tuyệt đối vùng điều kiện `$B$2:$B$100` và vùng tính tổng `$E$2:$E$100` bằng phím F4 trước khi kéo công thức xuống.'
  ),
  'basic-3-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Đổi vùng dữ liệu thô thành Excel Table (`Ctrl + T`), làm sạch mã bị dư khoảng trắng và kiểm tra các ô trống.',
      'Mức 2 (Nâng cao): Lập bảng tổng hợp nhanh theo Chi nhánh (`SUMIF`), theo Trạng thái (`COUNTIF`) và tính tỷ trọng % đóng góp (`=E2/SUM($E$2:$E$100)`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Bổ sung dòng tổng động ở đầu bảng bằng `=SUBTOTAL(109, [Doanh thu])` để khi quản lý lọc bất kỳ chi nhánh nào cũng thấy ngay tổng tiền đang hiển thị.',
    ],
    'Một file báo cáo vận hành hoàn chỉnh từ dữ liệu sạch -> bảng tổng hợp -> cảnh báo màu sắc, sẵn sàng gửi quản lý.',
    'Thực hiện đúng trình tự 3 bước: (1) Làm sạch & kiểm tra kiểu dữ liệu -> (2) Viết công thức tổng hợp -> (3) Đối chiếu tổng kiểm tra.'
  ),
  'basic-4-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng Sort & Filter tìm nhanh 10 giao dịch có giá trị lớn nhất (Top 10 Items) và lọc toàn bộ các dòng đang bị bỏ trống Mã khách hàng/Mã vật tư.',
      'Mức 2 (Nâng cao): Dùng Filter by Date/Number để soi các giao dịch nhập nhầm năm (ví dụ năm 2025 hoặc 2027 lẫn trong báo cáo tháng 05/2026) hoặc có số tiền âm bất thường.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kết hợp công thức `=COUNTIF($A$2:$A$100, A2)>1` để lọc ra toàn bộ các chứng từ bị nhập trùng trước khi khóa sổ.',
    ],
    'Danh sách các dòng dữ liệu bất thường (Outliers, dòng trống, dòng trùng mã, dòng sai kỳ) được tách riêng kèm ghi chú xử lý.',
    '5 phút rà soát dữ liệu bằng bộ lọc trước khi viết công thức sẽ giúp bạn tránh được 90% sai sót báo cáo cuối ngày.'
  ),
  'basic-4-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tách một file đang nhồi chung dữ liệu và báo cáo trên 1 sheet thành 4 sheet chuẩn: `Input` (Dữ liệu gốc), `Master` (Danh mục), `Calc` (Tính toán), `Report` (Báo cáo).',
      'Mức 2 (Nâng cao): Quy hoạch màu sắc rõ ràng: Ô nền xanh nhạt cho vùng người dùng được phép nhập tay/thay đổi tham số; ô nền xám/trắng khóa công thức.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thiết lập bảng kiểm soát đối chiếu (Control Check) ở góc trên sheet `Report` để tự động cảnh báo `"LỆCH SỐ LIỆU!"` nếu tổng báo cáo khác tổng sheet `Input`.',
    ],
    'Một workbook có cấu trúc 4 phân khu rõ ràng, đồng nghiệp mới mở file trong 30 giây hiểu ngay luồng chạy số liệu.',
    'Tuyệt đối không bao giờ gõ số chết (hard-code) đè lên một vài ô nằm giữa cột đang chạy công thức!'
  ),
  'basic-4-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Thực hành rà soát 5 điểm trong Checklist cuối ngày trên một bảng dữ liệu 100 dòng vừa cập nhật lúc 17h15.',
      'Mức 2 (Nâng cao): Tạo một khu vực `Mini Audit Box` tự động đếm: Số dòng thiếu mã (`COUNTBLANK`), Số mã trùng (`COUNTIF`), Số dòng lỗi công thức (`COUNTIF` lỗi `#N/A`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kiểm tra vùng tham chiếu của toàn bộ công thức tổng hợp xem đã bao phủ hết các dòng mới vừa thêm vào cuối ngày hay chưa.',
    ],
    'Bảng Checklist tự động hiện `"OK - SẴN SÀNG GỬI"` khi toàn bộ 5 chỉ tiêu kiểm soát đều bằng 0 lỗi.',
    'Nếu dùng Excel Table (`Ctrl + T`) ngay từ đầu, bạn sẽ loại bỏ hoàn toàn rủi ro công thức quên quét các dòng mới thêm cuối ngày.'
  ),
  'inter-1-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tính tổng doanh thu/chi phí theo 2 điều kiện (`Chi nhánh` và `Kênh bán`/`Bộ phận`) bằng `SUMIFS`.',
      'Mức 2 (Nâng cao): Đếm số giao dịch `Quá hạn` trên `30` ngày bằng `COUNTIFS` và tính giá trị trung bình theo nhân viên phụ trách bằng `AVERAGEIFS`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Tạo bảng ma trận tổng hợp 2 chiều bằng `SUMIFS` có kết hợp tham chiếu hỗn hợp (`$G2` khóa cột dòng tiêu đề và `H$1` khóa dòng tiêu đề cột) để chỉ viết 1 công thức duy nhất rồi kéo cho cả bảng.',
    ],
    'Có bảng tổng hợp ma trận đa chiều hoạt động chính xác kèm dòng kiểm tra tổng ngang và tổng dọc.',
    'Người học nên vẽ trước cấu trúc bảng kết quả cần có, sau đó mới viết công thức `SUMIFS` và kiểm tra kỹ dấu `$` ở từng vùng.'
  ),
  'inter-1-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tra cứu thông tin danh mục bằng `XLOOKUP` có khai báo tham số thứ 4 (`if_not_found = "Chưa có mã"`) để thay thế hoàn toàn `IFERROR(VLOOKUP(...))`.',
      'Mức 2 (Nâng cao): Thực hiện bài toán tra cứu ngược (cột kết quả nằm bên trái cột khóa) bằng cả 2 cách: `XLOOKUP` và `INDEX + MATCH`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Giải quyết bài toán tra cứu theo 2 điều kiện đồng thời (ví dụ `Mã SKU` + `Kho vùng` hoặc `Mã SP` + `Hạng đại lý`) bằng kỹ thuật ghép khóa `=XLOOKUP(A2&B2, Master[Ma]&Master[Kho], Master[Gia])`.',
    ],
    'Có bảng đối chiếu kết quả tra cứu 1 chiều, tra cứu ngược và tra cứu đa điều kiện không cần cột phụ.',
    'Nếu kết quả tra cứu trả về lỗi hoặc không tìm thấy, hãy kiểm tra ngay `LEN` và `ISTEXT`/`ISNUMBER` của khóa ở 2 bảng trước khi sửa công thức.'
  ),
  'inter-1-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `UNIQUE` trích xuất danh sách nhân viên/khách hàng/mã vật tư không trùng và kết hợp `SORT` để xếp thứ tự A-Z.',
      'Mức 2 (Nâng cao): Dùng `FILTER` trích xuất động toàn bộ giao dịch của một chi nhánh có giá trị lớn hơn 30 triệu bằng phép nhân điều kiện `(B2:B100="Hà Nội")*(E2:E100>30000000)`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kết hợp `SORT(FILTER(...), 5, -1)` để tạo báo cáo Top giao dịch tự động co giãn theo ô chọn Dropdown mà không bị lỗi `#CALC!` khi không có dòng thỏa mãn.',
    ],
    'Có một Mini Dashboard động tự cập nhật danh sách chi tiết ngay khi đổi tên Chi nhánh hoặc Ngưỡng số tiền ở ô điều kiện.',
    'Trong hàm `FILTER`, tuyệt đối không dùng `AND(...)` hay `OR(...)` cho mảng mà phải dùng phép nhân `*` (VÀ) và phép cộng `+` (HOẶC).'
  ),
  'inter-2-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Phân loại kết quả thành 3 mức (`Đạt`, `Theo dõi`, `Cần bổ sung`) bằng hàm `IFS` với thứ tự xét từ ngưỡng cao nhất xuống thấp nhất.',
      'Mức 2 (Nâng cao): Tạo cột cảnh báo rủi ro công nợ/tồn kho bằng `IF` kết hợp `AND` (vừa quá hạn > 30 ngày vừa có giá trị >= 50 triệu).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kết hợp `IF(AND(OR(B2="Hà Nội", B2="TP.HCM"), F2="Quá hạn"), ...)` để lọc đúng nhóm thị trường trọng điểm đang gặp sự cố.',
    ],
    'Bộ quy tắc nghiệp vụ được tự động hóa 100% bằng công thức logic, mỗi dòng dữ liệu đều ra một trạng thái hành động rõ ràng.',
    'Khi dùng `IFS`, luôn nhớ đặt điều kiện `TRUE, "Giá trị mặc định"` ở cuối cùng để tránh lỗi `#N/A` khi dữ liệu rơi ngoài các ngưỡng dự kiến.'
  ),
  'inter-2-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `EOMONTH(A2, 0)` và `EOMONTH(A2, 1)` để tính ngày khóa sổ cuối tháng hiện tại và ngày đáo hạn thanh toán cuối tháng kế tiếp.',
      'Mức 2 (Nâng cao): Dùng `NETWORKDAYS(B2, C2, DanhSachLe)` tính số ngày làm việc thực tế xử lý đơn hàng/ticket và dùng `DATEDIF(B2, C2, "m")` tính số tháng thâm niên/hiệu lực hợp đồng.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Xử lý các hồ sơ/ticket chưa có ngày kết thúc (ô `C2` đang trống) bằng `=NETWORKDAYS(B2, IF(C2="", TODAY(), C2), DanhSachLe)` để tránh lỗi số âm hàng chục nghìn ngày.',
    ],
    'Bảng theo dõi thời hạn hợp đồng, tuổi nợ và SLA vận hành tính toán chính xác theo lịch làm việc thực tế của doanh nghiệp.',
    'Dùng `EDATE(NgaySX, SoThang)` khi cần giữ nguyên ngày trong tháng (hạn sử dụng lô hàng) và dùng `EOMONTH` khi cần chốt vào ngày cuối tháng.'
  ),
  'inter-2-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Bắt các dòng nhập thiếu thông tin bắt buộc trên 5 cột chính bằng `=IF(COUNTBLANK(A2:E2)>0, "Thiếu dữ liệu", "Đủ")`.',
      'Mức 2 (Nâng cao): Bọc `IFERROR` cho các công thức tra cứu/chia tỷ lệ và phân biệt rõ nguyên nhân lỗi thay vì chỉ trả về chuỗi rỗng `""` làm ẩn mất lỗi nghiệp vụ.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Xây dựng cột `Kiểm soát chất lượng dữ liệu (Data QC)` tổng hợp: Kiểm tra đồng thời thiếu ô (`COUNTBLANK`), trùng khóa (`COUNTIFS > 1`), và mã chưa khai báo danh mục (`ISNA`).',
    ],
    'Cột trạng thái kiểm soát tự động chỉ rõ dòng nào lỗi và lỗi vì nguyên nhân gì để người nhập liệu tự sửa ngay.',
    'Đừng lạm dụng `IFERROR(..., 0)` hoặc `IFERROR(..., "")` một cách mù quáng vì nó có thể che giấu các mã khách hàng/vật tư mới chưa được cập nhật vào bảng Danh mục!'
  ),
  'inter-3-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Từ bảng dữ liệu chuẩn (Excel Table), tạo Pivot Table tổng hợp theo Chi nhánh (Rows) và Kênh bán/Bộ phận (Columns).',
      'Mức 2 (Nâng cao): Kéo trường Số tiền vào vùng Values lần thứ 2 và chọn `Show Values As > % of Column Total` để hiển thị song song cả Số tuyệt đối lẫn Tỷ trọng %.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Chèn Slicer cho `Tháng` và `Nhân sự phụ trách`, sau đó kết nối 1 Slicer điều khiển đồng thời 2 Pivot Table thông qua `Report Connections`.',
    ],
    'Một bộ Pivot Table tương tác trả lời tức thì các câu hỏi quản trị theo khu vực, kênh, nhân sự và kỳ báo cáo.',
    'Nếu cột Ngày không thể Group theo Month/Quarter trong Pivot Table, hãy kiểm tra ngay xem có ô trống hoặc ô ngày đang lưu dạng Text trong cột nguồn hay không.'
  ),
  'inter-3-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Thiết kế tầng trên cùng của Dashboard gồm 4 thẻ KPI: Tổng doanh thu/giá trị, Tỷ lệ hoàn thành kế hoạch, Số lượng giao dịch và Giá trị/Tỷ lệ rủi ro.',
      'Mức 2 (Nâng cao): Bố trí tầng giữa gồm 2 biểu đồ trực quan (Biểu đồ cột so sánh theo Chi nhánh và Biểu đồ đường/cột chồng theo Kỳ hoặc Kênh).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Đặt bảng chi tiết các trường hợp cần xử lý gấp (Top công nợ quá hạn / Lô hàng cận date / Ticket trễ SLA) ở tầng dưới để quản lý xem xong KPI là có ngay danh sách hành động.',
    ],
    'Một Dashboard nội bộ gọn trên 1 màn hình (không phải cuộn ngang), tuân thủ quy ước màu Xanh (Đạt) - Vàng (Cảnh báo) - Đỏ (Rủi ro).',
    'Dashboard tốt không phải là nhiều màu sắc nhất, mà là giúp người quản lý nhận diện vấn đề trong 5 giây đầu tiên.'
  ),
  'inter-3-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tổ chức lại workbook theo chuẩn 4 phân khu: `Input`, `Master`, `Calc`, `Report` và đặt màu tab sheet theo từng nhóm.',
      'Mức 2 (Nâng cao): Đặt Named Range rõ nghĩa (`rng_BangGia`, `rng_NgayLe`, `par_CongChuan`) trong Name Manager để công thức dễ đọc như ngôn ngữ tự nhiên.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Dùng `Formulas > Trace Precedents / Trace Dependents` để kiểm toán đường đi của số liệu trước khi xóa bất kỳ dòng/cột nào nhằm tránh lỗi `#REF!`.',
    ],
    'File Excel chuẩn hóa đạt tiêu chuẩn bàn giao doanh nghiệp, có bảng hướng dẫn sử dụng ngắn gọn và không phát sinh lỗi `#REF!` hay `#NAME?`.',
    'Trước khi xóa một cột trung gian, luôn bấm `Trace Dependents` để chắc chắn không có báo cáo hay Pivot nào đang lấy số từ cột đó.'
  ),
  'inter-4-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Làm sạch mã đơn và mã khách hàng từ 3 kênh bán (`Retail`, `Online`, `Đại lý`) bằng `TRIM` và đồng bộ định dạng cột Doanh thu về kiểu Number.',
      'Mức 2 (Nâng cao): Dùng `COUNTIFS` phát hiện các đơn hàng bị đẩy đúp từ sàn TMĐT và dùng `XLOOKUP` ghép thêm Nhóm khách hàng, Nhân viên phụ trách.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Lập báo cáo chốt ngày bằng `SUMIFS` và `Pivot Table`, đối chiếu tổng doanh thu sau xử lý với tổng 3 file gốc để giải trình chênh lệch do đơn trùng/đơn hủy.',
    ],
    'Quy trình chốt doanh số đa kênh cuối ngày hoàn chỉnh, tách bạch rõ Doanh thu gộp, Đơn hủy, Đơn trùng và Doanh thu thuần.',
    'Luôn làm sạch và khử trùng lặp dữ liệu trước khi tổng hợp; nếu cộng trước rồi mới lọc trùng thì số báo cáo gửi sếp sẽ bị ảo.'
  ),
  'inter-4-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tính thời gian xử lý thực tế của từng ticket vận hành bằng `NETWORKDAYS` (có trừ danh sách ngày lễ).',
      'Mức 2 (Nâng cao): Dùng `IFS` phân loại trạng thái `Đạt SLA`, `Cảnh báo sát hạn`, `Vi phạm SLA` và `Đang xử lý` (cho các ticket chưa có ngày đóng).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Lập bảng tổng hợp tỷ lệ % đạt SLA theo từng Ca trực và từng Nhóm xử lý để tìm ra ca trực đang bị quá tải backlog.',
    ],
    'Báo cáo kiểm soát SLA đa ca chỉ rõ tổng số ticket phát sinh, tỷ lệ đúng hạn và danh sách ticket quá hạn cần ưu tiên giải quyết.',
    'Chú ý xử lý các dòng chưa có Ngày đóng ticket bằng `IF(NgayDong="", TODAY(), NgayDong)` để đo lường chính xác tuổi tồn đọng của ticket đang mở.'
  ),
  'inter-4-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `XLOOKUP` kéo `Hạn mức tín dụng` và `Điều khoản thanh toán (số ngày nợ)` từ bảng Danh mục khách hàng sang bảng Công nợ.',
      'Mức 2 (Nâng cao): Tính `Số ngày quá hạn = MAX(0, TODAY() - NgayDaoHan)` và phân loại nhóm tuổi nợ (`Trong hạn`, `Quá hạn 1-30 ngày`, `Quá hạn 31-60 ngày`, `Quá hạn >60 ngày`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kiểm tra rủi ro vượt hạn mức lũy kế bằng `=IF(SUMIFS(DuNo, MaKH, B2) > HanMuc, "Chặn xuất đơn mới", "Cho phép")` để tránh trường hợp khách chia nhỏ nhiều hóa đơn lách hạn mức.',
    ],
    'Báo cáo quản trị công nợ phải thu phân tầng theo cả Tuổi nợ lẫn Hạn mức tín dụng lũy kế, kèm danh sách ưu tiên thu hồi nợ.',
    'Rủi ro công nợ thực tế nằm ở TỔNG dư nợ của khách hàng đó chứ không chỉ nằm ở từng hóa đơn đơn lẻ.'
  ),
  'adv-1-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Thiết kế sơ đồ luồng dữ liệu 4 tầng trong Power Query: `raw_` (Dữ liệu thô) -> `stg_` (Làm sạch & Chuẩn kiểu) -> `fact_`/`dim_` (Nghiệp vụ) -> `rpt_` (Báo cáo).',
      'Mức 2 (Nâng cao): Thiết lập chế độ `Only Create Connection` cho các tầng `raw_` và `stg_` để file Excel nhẹ, chỉ Load bảng `rpt_` ra Sheet hoặc Pivot Cache.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Mô phỏng tình huống hệ thống ERP đổi tên 1 cột trong file xuất ra và thực hành sửa duy nhất tại tầng `stg_` để toàn bộ các báo cáo phía sau tự cập nhật không lỗi.',
    ],
    'Một kiến trúc Power Query phân tầng chuyên nghiệp, gọn nhẹ và dễ dàng bảo trì khi bàn giao cho đồng nghiệp.',
    'Không bao giờ thực hiện vừa kết nối Folder, vừa làm sạch 20 bước, vừa Merge, vừa Group By chung trong một Query duy nhất.'
  ),
  'adv-1-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Nạp file CSV/Excel bẩn vào Power Query, thực hiện chuỗi thao tác chuẩn: `Use First Row as Headers` -> `Remove Blank Rows` -> `Trim & Clean` -> `Change Type`.',
      'Mức 2 (Nâng cao): Dùng `Split Column by Delimiter` để tách cột mã ghép và dùng `Replace Values` chuẩn hóa các trạng thái nhập lộn xộn về chuẩn thống nhất.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Đổi kiểu dữ liệu cột Ngày và Số tiền bằng `Change Type > Using Locale...` (chọn `Vietnamese` hoặc `English US` đúng theo định dạng gốc của file CSV) để chống lỗi đảo Ngày/Tháng.',
    ],
    'Bảng dữ liệu đầu ra sạch hoàn toàn, đúng kiểu Date/Number/Text và tự động chạy lại toàn bộ các bước chỉ bằng 1 nút Refresh.',
    'Khi xử lý file CSV nước ngoài hoặc hệ thống xuất ngày dạng `dd/mm/yyyy`, luôn dùng `Change Type with Locale` thay vì `Change Type` mặc định.'
  ),
  'adv-1-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Sử dụng cặp hàm `Text.Upper(Text.Trim([Mã]))` trong Custom Column để chuẩn hóa tuyệt đối cột khóa trước khi nối bảng.',
      'Mức 2 (Nâng cao): Sử dụng `Date.From`, `Number.FromText` và `Table.SelectRows` để lọc và ép kiểu dữ liệu có kiểm soát.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Phát hiện và xử lý bẫy phân biệt chữ hoa/thường (Case-sensitivity) của ngôn ngữ M làm cho `"hn"` và `"HN"` bị tách thành 2 dòng riêng khi Group By hoặc bị trượt khi Merge.',
    ],
    'Nắm vững bộ hàm M cốt lõi để đọc hiểu thanh công thức trong Power Query và chủ động tùy biến các bước làm sạch nâng cao.',
    'Hãy bật thanh `Formula Bar` trong thẻ `View` của Power Query Editor để quan sát đoạn code M được sinh ra sau mỗi thao tác chuột.'
  ),
  'adv-2-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `Get Data > From Folder` để gộp tự động 6 file báo cáo tháng có cùng cấu trúc nằm trong thư mục `Input_Thang`.',
      'Mức 2 (Nâng cao): Trong bước lọc file của Folder Query, thêm điều kiện lọc bỏ các file tạm của Excel (`not Text.StartsWith([Name], "~$")`) và chỉ giữ đúng định dạng `.xlsx`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Giữ lại cột `Source.Name` để tách ra cột `Kỳ báo cáo` / `Chi nhánh nguồn`, giúp truy vết ngay dòng số liệu sai đến từ file gốc nào.',
    ],
    'Hệ thống gộp file tự động theo thư mục: mỗi tháng chỉ cần thả file mới vào Folder và bấm `Refresh All` là báo cáo cập nhật.',
    'Nếu không lọc bỏ tiền tố `"~$"` trong Folder Query, mỗi khi bạn đang mở 1 file con trong thư mục đó và bấm Refresh, Power Query sẽ báo lỗi không đọc được file tạm!'
  ),
  'adv-2-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `Left Outer Join` để ghép thông tin từ bảng Danh mục (`Mã KH`, `Mã SKU`, `Tài khoản`) vào bảng phát sinh giao dịch.',
      'Mức 2 (Nâng cao): Dùng `Left Anti Join` và `Right Anti Join` để thực hiện đối soát 2 chiều giữa Sao kê ngân hàng và Sổ kế toán (hoặc giữa Tồn kho ERP và Kiểm kê thực tế).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thực hiện Merge bằng **Khóa kép (Composite Key)** (giữ phím `Ctrl` chọn đồng thời `Mã đơn` + `Mã SKU`, hoặc `Mã VT` + `Mã Kho`) để chống lỗi nhân bản dòng (Cartesian Product).',
    ],
    'Hai bảng báo cáo đối soát tự động: Bảng dữ liệu đã khớp đầy đủ danh mục và Bảng danh sách chênh lệch phục vụ điều tra nguyên nhân.',
    'Sau mỗi bước `Expand` của phép Merge, hãy luôn kiểm tra tổng số dòng trước và sau khi Merge xem có bị phình dòng do trùng khóa bên bảng danh mục hay không!'
  ),
  'adv-2-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Nhận một bảng kế hoạch/ngân sách hoặc bảng chấm công có 12 cột tháng nằm ngang, chọn các cột định danh rồi bấm `Unpivot Other Columns`.',
      'Mức 2 (Nâng cao): Đổi tên cột `Attribute` thành `Kỳ` (hoặc `Ngày`), cột `Value` thành `Số tiền` và chuẩn hóa kiểu dữ liệu.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kết hợp `Fill Down` trước khi `Unpivot` cho các bảng báo cáo vừa bị gộp ô dọc ở cột Bộ phận vừa trải ngang theo các cột Tháng.',
    ],
    'Chuyển đổi mượt mà các bảng báo cáo trình bày ngang phức tạp về cấu trúc bảng dọc chuẩn Fact Table để nạp vào Pivot Table.',
    'Luôn chọn cột khóa cố định rồi bấm `Unpivot Other Columns` thay vì chọn cột tháng rồi bấm `Unpivot Columns`, để khi có thêm tháng mới Query tự động nhận diện.'
  ),
  'adv-2-4': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Chuẩn hóa dữ liệu trên 3 sheet `Thang01`, `Thang02`, `Thang03` thành các Excel Table có tiền tố `tbl_` và gộp lại bằng `Excel.CurrentWorkbook()`.',
      'Mức 2 (Nâng cao): Giữ lại cột `[Name]` của từng Table trước khi Expand để biết mỗi dòng dữ liệu thuộc bảng/tháng nào.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thiết lập bộ lọc `Text.StartsWith([Name], "tbl_")` trước khi `Table.Combine` để chặn triệt để lỗi tự gộp lại chính bảng kết quả (`rpt_TongHop`) gây nhân đôi số liệu sau mỗi lần Refresh.',
    ],
    'Một bảng tổng hợp Master tự động gom dữ liệu từ mọi Table con trong cùng Workbook mà không bị lặp dòng khi Refresh nhiều lần.',
    'Lỗi nhân đôi số liệu sau mỗi lần bấm Refresh là lỗi kinh điển nhất khi dùng `Excel.CurrentWorkbook()` mà quên lọc bỏ tên bảng đích!'
  ),
  'adv-3-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `Text.BeforeDelimiter` và `Text.AfterDelimiter` để tách chuỗi mã đơn hàng/mã chứng từ có độ dài biến động.',
      'Mức 2 (Nâng cao): Dùng `Text.PadStart(Text.From([Mã]), 6, "0")` để khôi phục các chữ số `0` ở đầu mã nhân viên/mã SKU bị mất khi mở qua file CSV.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Dùng `Text.Combine({Text.Upper(Text.Trim([Chi nhánh])), [Mã đơn]}, "-")` để tạo khóa ghép sạch phục vụ đối soát liên bảng.',
    ],
    'Bộ cột mã định danh được tách, đệm số 0 và ghép khóa đồng nhất hoàn toàn bằng hàm M trước khi đưa vào mô hình.',
    '`Text.PadStart` an toàn hơn nối chuỗi `"00"` thủ công vì nó luôn đảm bảo tổng độ dài chuỗi đầu ra cố định đúng số ký tự quy định.'
  ),
  'adv-3-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `Table.AddColumn` tạo cột `Đầu tháng = Date.StartOfMonth([Ngày])` và cột `Thành tiền = [Số lượng] * [Đơn giá]` có khai báo kiểu `type number`.',
      'Mức 2 (Nâng cao): Dùng `Table.Group` để gom tổng doanh thu, số lượng đơn và đơn hàng lớn nhất theo từng `Chi nhánh` và `Đầu tháng`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Trong `Table.RemoveColumns`, bổ sung tham số thứ ba `MissingField.Ignore` để query không bị báo lỗi dừng đột ngột nếu tháng sau file nguồn không còn cột phụ đó.',
    ],
    'Pipeline biến đổi bảng gọn nhẹ, có khai báo kiểu dữ liệu ngay trong bước thêm cột và chống lỗi mất cột phụ.',
    'Khi viết `Table.AddColumn(Source, "Tên cột", each ..., type number)`, việc thêm `type number` ở tham số thứ 4 giúp bạn tiết kiệm được 1 bước `Change Type` rời phía sau.'
  ),
  'adv-3-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `try Number.FromText([Số tiền]) otherwise 0` để xử lý các dòng chứa chữ `"N/A"`, `"-"`, `"Chờ duyệt"` trong cột số tiền.',
      'Mức 2 (Nâng cao): Dùng `try Date.From([Ngày]) otherwise null` để cô lập các dòng nhập ngày sai quy cách (ví dụ `31/02/2026`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thay vì chỉ đổi lỗi về `0` làm trôi mất giao dịch lỗi, hãy tạo thêm cột `Cờ kiểm tra = if (try Number.FromText([Số tiền]))[HasError] then "Lỗi dữ liệu gốc" else "Hợp lệ"` để tách riêng danh sách dòng lỗi gửi bộ phận nhập liệu sửa.',
    ],
    'Query vận hành bền bỉ 100% không bao giờ bị gãy giữa chừng khi gặp dữ liệu rác, đồng thời tự động xuất ra bảng danh sách các dòng lỗi cần sửa.',
    'Một hệ thống tự động hóa tốt vừa phải không bị treo khi có rác, vừa phải chỉ điểm chính xác dòng rác nằm ở đâu.'
  ),
  'adv-4-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết bộ khung thủ tục `SafeModeStart` và `SafeModeEnd` bật/tắt 3 thuộc tính: `ScreenUpdating`, `EnableEvents`, và `Calculation`.',
      'Mức 2 (Nâng cao): Gắn cấu trúc `On Error GoTo ErrHandler` và nhãn `CleanExit:` vào một Macro thực tế để đảm bảo dù code gặp lỗi ở dòng nào thì `SafeModeEnd` vẫn luôn được gọi.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Bổ sung dòng thông báo `Application.StatusBar = "Đang xử lý dữ liệu..."` ở đầu và `Application.StatusBar = False` ở cuối để người dùng biết tiến độ chạy.',
    ],
    'Khung template VBA chuẩn doanh nghiệp có thể tái sử dụng cho mọi dự án tự động hóa, tăng tốc độ chạy gấp 10-20 lần và không bao giờ làm kẹt chế độ Manual Calculation.',
    'Không bao giờ viết `End` đơn độc giữa chừng trong Macro có tắt `Calculation`, hãy luôn dùng `GoTo CleanExit`!'
  ),
  'adv-4-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết hàm `LastRow(ws As Worksheet, colLetter As String) As Long` dùng `ws.Cells(ws.Rows.Count, colLetter).End(xlUp).Row`.',
      'Mức 2 (Nâng cao): Viết hàm `LastCol(ws As Worksheet, rowNum As Long) As Long` dùng `ws.Cells(rowNum, ws.Columns.Count).End(xlToLeft).Column`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thêm bước kiểm tra `If lastRow < 2 Then Exit Sub` trước khi copy hoặc chạy vòng lặp để chống lỗi quét nhầm dòng tiêu đề (dòng 1) khi bảng dữ liệu đang trống.',
    ],
    'Bộ hàm xác định vùng dữ liệu động chính xác tuyệt đối, xử lý an toàn cả trường hợp bảng có 1 dòng lẫn bảng có 100.000 dòng.',
    'Bẫy thường gặp: Khi bảng dữ liệu trống hoàn toàn (chỉ có dòng tiêu đề ở dòng 1), `lastRow` sẽ trả về `1`. Nếu không kiểm tra `If lastRow >= 2` mà chạy `Range("A2:E" & lastRow)` thì VBA sẽ quét nhầm ngược lên `A1:E2`!'
  ),
  'adv-4-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết Macro `RefreshAllData` gọi `ThisWorkbook.RefreshAll` và ghi thời điểm cập nhật mới nhất vào ô `Report!B2` bằng `Now`.',
      'Mức 2 (Nâng cao): Viết Macro `ExportReportPDF` xuất sheet báo cáo ra file PDF có gắn kèm ngày tháng tự động trong tên file (`"BaoCao_" & Format(Date, "yyyymmdd") & ".pdf"`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Lưu ý khi kết hợp `ThisWorkbook.RefreshAll` và `ExportAsFixedFormat` trong cùng 1 Macro: phải tắt thuộc tính `Enable background refresh` của các Power Query để VBA đợi Query tải xong 100% số mới rồi mới xuất PDF!',
    ],
    'Tổ hợp nút bấm 1-Click vừa làm mới toàn bộ Power Query/Pivot Table, vừa đóng dấu thời gian cập nhật, vừa xuất file PDF chuẩn tên theo ngày.',
    'Nếu để `Background Refresh = True` (mặc định), VBA sẽ xuất PDF ngay lập tức khi Power Query còn chưa kịp tải xong dữ liệu mới!'
  ),
  'adv-5-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết vòng lặp `Dir(folderPath & "*.xlsx")` để duyệt và in danh sách toàn bộ file Excel trong thư mục `input` ra cửa sổ Immediate (`Debug.Print`).',
      'Mức 2 (Nâng cao): Trong vòng lặp, mở từng workbook (`Set wb = Workbooks.Open(folderPath & fileName, ReadOnly:=True)`), copy vùng dữ liệu động sang sheet tổng hợp rồi đóng file (`wb.Close SaveChanges:=False`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thêm điều kiện bỏ qua nếu `fileName = ThisWorkbook.Name` hoặc `Left(fileName, 2) = "~$"` và luôn nhớ đặt `fileName = Dir` ở cuối vòng lặp để tránh treo máy do lặp vô tận.',
    ],
    'Macro tự động gom dữ liệu từ hàng chục file Excel rời rạc trong thư mục về bảng tổng hợp kèm ghi nhận tên file nguồn.',
    'Mở file nguồn với tham số `ReadOnly:=True` và đóng với `SaveChanges:=False` giúp Macro chạy cực nhanh và không làm thay đổi ngày sửa đổi của file gốc.'
  ),
  'adv-5-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Thiết kế thanh điều khiển 3 nút bấm (Shapes/Buttons) trên sheet `Report`: `1. Cập nhật dữ liệu`, `2. Kiểm tra lỗi`, `3. Xuất báo cáo PDF`.',
      'Mức 2 (Nâng cao): Trong Macro `Kiểm tra lỗi`, nếu phát hiện ô kiểm soát lỗi `> 0` thì hiện `MsgBox` cảnh báo rõ số dòng lỗi và chặn không cho chạy tiếp bước Xuất PDF.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Khóa bảo vệ vùng công thức của sheet `Report` (`ws.Protect UserInterfaceOnly:=True`) để người dùng cuối không xóa nhầm công thức nhưng Macro vẫn ghi dữ liệu bình thường.',
    ],
    'Giao diện điều khiển thân thiện như phần mềm chuyên nghiệp, người không biết công thức hay VBA chỉ cần bấm theo thứ tự 1 -> 2 -> 3.',
    'Tham số `UserInterfaceOnly:=True` khi gọi `ws.Protect` là bí quyết cực hay: khóa tay người dùng nhưng cho phép code VBA chỉnh sửa sheet thoải mái mà không cần Unprotect/Protect liên tục!'
  ),
  'adv-5-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Refactor (viết lại) một đoạn code Macro được thu bằng Macro Recorder: xóa bỏ toàn bộ `.Select`, `.Activate`, `Selection` và thay bằng tham chiếu trực tiếp `ws.Range(...)`.',
      'Mức 2 (Nâng cao): Thay thế mọi chỗ dùng `ActiveSheet` và `ActiveWorkbook` bằng biến đối tượng cụ thể (`Dim wb As Workbook: Set wb = ThisWorkbook`).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Viết hàm kiểm tra sheet tồn tại (`WorksheetExists`) và kiểm tra file tồn tại (`Dir(filePath) <> ""`) trước khi thao tác để Macro không bao giờ văng lỗi `Subscript out of range (Error 9)`.',
    ],
    'Đoạn code VBA sạch, ngắn gọn bằng 1/3 code gốc của Macro Recorder, tốc độ chạy nhanh gấp 10 lần và không bị lỗi khi người dùng bấm sang cửa sổ khác.',
    '90% lỗi `Run-time error 9` và `Run-time error 1004` trong thực tế đều xuất phát từ việc phụ thuộc vào `ActiveWorkbook` / `ActiveSheet` và `.Select`.'
  ),
  'adv-5-4': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết vòng lặp `For Each ws In ThisWorkbook.Worksheets` để quét qua các sheet chi nhánh và copy dữ liệu về sheet `TongHop`.',
      'Mức 2 (Nâng cao): Chỉ lấy tiêu đề (dòng 1) ở sheet đầu tiên, từ các sheet thứ 2 trở đi chỉ copy phần dữ liệu (`A2:E & lastRow`) nối tiếp vào dòng trống cuối cùng của sheet `TongHop`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Loại trừ các sheet hệ thống (`If ws.Name <> "TongHop" And ws.Name <> "Master" And ws.Name <> "Report"`) và ghi thêm tên sheet nguồn (`ws.Name`) vào cột F để truy vết dữ liệu.',
    ],
    'Macro gộp 20 sheet chi nhánh/tháng về 1 sheet Master chỉ trong 1 giây kèm cột đánh dấu nguồn gốc từng dòng.',
    'Dùng `wsMaster.Range("A" & targetRow).Resize(rowCount, colCount).Value = ws.Range("A2:E" & lastRow).Value` sẽ nhanh và sạch định dạng hơn `.Copy` rất nhiều!'
  ),
  'adv-5-5': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng `AdvancedFilter` (`Unique:=True`) để trích xuất danh sách các Chi nhánh / Nhân viên duy nhất từ bảng dữ liệu tổng.',
      'Mức 2 (Nâng cao): Lặp qua từng tên Chi nhánh, dùng `AutoFilter` lọc bảng tổng và copy vùng hiển thị (`.SpecialCells(xlCellTypeVisible)`) sang một Workbook mới rồi lưu theo tên Chi nhánh.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Làm sạch các ký tự cấm trong tên file Windows (`/ \ : * ? " < > |`) khỏi tên Chi nhánh/Khách hàng trước khi gọi `SaveAs` để chống lỗi gãy Macro khi lưu file.',
    ],
    'Tự động tách 1 bảng dữ liệu tổng thành 30 file Excel riêng biệt cho 30 chi nhánh/nhân sự chỉ với 1 cú click chuột.',
    'Nếu tên chi nhánh hoặc khách hàng có dấu gạch chéo (ví dụ `"Chi nhánh Q1/Q3"`), lệnh `SaveAs` sẽ báo lỗi đường dẫn ngay lập tức nếu bạn không dùng `Replace(branchName, "/", "-")`!'
  ),
  'adv-5-6': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết Macro duyệt thư mục và đổi tên hàng loạt các file báo cáo theo quy ước chuẩn `BaoCao_001.xlsx`, `BaoCao_002.xlsx` bằng lệnh `Name oldPath As newPath`.',
      'Mức 2 (Nâng cao): Đọc danh sách ánh xạ 2 cột trên sheet Excel (Cột A: `Tên file cũ`, Cột B: `Tên file mới chuẩn`) để đổi tên hàng loạt theo đúng bảng phân공.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Kiểm tra `If Dir(oldPath) <> "" And Dir(newPath) = ""` trước khi chạy lệnh `Name ... As ...` để tránh lỗi file nguồn không tồn tại hoặc tên file mới bị trùng.',
    ],
    'Công cụ đổi tên hàng trăm file chứng từ/báo cáo/phiếu lương ngay từ bảng điều khiển Excel kèm cột ghi nhận trạng thái `"Đã đổi tên"` / `"Không tìm thấy file"`.',
    'Khi đổi tên file trực tiếp trong vòng lặp `Dir()`, tốt nhất nên đọc toàn bộ danh sách tên file vào một mảng (Array/Collection) trước rồi mới chạy lệnh `Name` để tránh làm乱 thứ tự duyệt của `Dir()`!'
  ),
  'adv-5-7': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết Macro kiểm tra và tự động tạo thư mục `ThisWorkbook.Path & "\\output"` bằng `If Dir(outputFolder, vbDirectory) = "" Then MkDir outputFolder`.',
      'Mức 2 (Nâng cao): Quét qua tất cả các sheet báo cáo đang hiển thị (`ws.Visible = xlSheetVisible`) và xuất từng sheet thành 1 file PDF riêng trong thư mục `output`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Thiết lập tự động `PageSetup` (`FitToPagesWide = 1`, `FitToPagesTall = False`, `Orientation = xlLandscape`) bằng VBA trước khi xuất PDF để báo cáo không bao giờ bị cắt rớt cột sang trang sau.',
    ],
    'Toàn bộ các sheet báo cáo được căn chỉnh vừa khít 1 trang ngang và xuất hàng loạt ra thư mục `output` dưới định dạng PDF chuẩn đẹp.',
    'Rất nhiều báo cáo xuất PDF tự động bị cắt mất cột cuối cùng sang trang 2; thêm 3 dòng `With ws.PageSetup: .Zoom = False: .FitToPagesWide = 1: .FitToPagesTall = False: End With` sẽ giải quyết triệt để!'
  ),
  'adv-5-8': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Viết Macro khởi tạo Outlook bằng `CreateObject("Outlook.Application")` và tạo email đính kèm file PDF báo cáo với chế độ `.Display`.',
      'Mức 2 (Nâng cao): Thiết lập bảng danh sách gửi mail trên sheet Excel gồm 4 cột: `Tên đơn vị`, `Email To`, `Email CC`, `Đường dẫn File đính kèm` để vòng lặp tự động tạo 20 email cá nhân hóa.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Bắt buộc kiểm tra `If Dir(attachmentPath) <> ""` và `If InStr(emailTo, "@") > 0` trước khi tạo mail; nếu thiếu file đính kèm thì ghi log cảnh báo đỏ thay vì gửi mail trống.',
    ],
    'Hệ thống phát hành báo cáo & phiếu lương tự động qua Outlook cho hàng chục đầu mối kèm bảng Log kiểm soát trạng thái gửi.',
    'Luôn để tùy chọn trên sheet điều khiển cho phép người dùng chọn giữa 2 chế độ: `Xem trước (.Display)` và `Gửi ngay (.Send)`.'
  ),
  'adv-6-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng Power Query nạp Sao kê ngân hàng và Sổ chi tiết TK 112, chuẩn hóa cột Ngày, Số tham chiếu và Số tiền.',
      'Mức 2 (Nâng cao): Dùng `Left Anti Join` tìm giao dịch có trên Sao kê nhưng chưa hạch toán (lãi tiền gửi, phí ngân hàng, khách chuyển khoản chưa rõ nội dung) và ngược lại (UNC đã lập nhưng ngân hàng chưa trừ tiền).',
      'Mức 3 (Thực chiến & Bẫy lỗi): Dùng `Left Outer Join` kết hợp điều kiện kiểm tra các giao dịch cùng Mã tham chiếu nhưng lệch số tiền (`[Số tiền Sao kê] <> [Số tiền Sổ]`) do kế toán gõ đảo chữ số, sau đó xuất Biên bản đối soát ra PDF.',
    ],
    'Bộ file đối soát ngân hàng tự động hoàn chỉnh: tìm ra cả giao dịch thiếu lẫn giao dịch lệch số tiền trong vài giây.',
    'Đối soát thực tế không chỉ có giao dịch "Có ở bảng A mà không có ở bảng B", mà còn có bẫy "Có mặt ở cả 2 bảng nhưng lệch số tiền"!'
  ),
  'adv-6-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Dùng Power Query hợp nhất dữ liệu ticket từ 3 nguồn (Hệ thống CRM, Form nhập tay, File đối tác) về một bảng phẳng chuẩn.',
      'Mức 2 (Nâng cao): Tính thời gian xử lý theo ngày/giờ làm việc, phân loại trạng thái SLA và dựng Pivot Dashboard theo Ca trực & Nhóm phụ trách.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Gắn nút bấm VBA để Giám sát ca cuối ngày chỉ cần bấm 1 nút là hệ thống Refresh toàn bộ nguồn, kiểm tra ticket tồn đọng và xuất PDF gửi báo cáo giao ca.',
    ],
    'Một hệ thống báo cáo vận hành khép kín kết hợp trọn vẹn sức mạnh của Power Query (ETL) + Công thức Excel (Logic SLA) + Pivot (Dashboard) + VBA (Xuất & Gửi báo cáo).',
    'Hãy phân rõ trách nhiệm từng công cụ: Power Query làm sạch và gộp dữ liệu; Excel Formula/Pivot tính toán và hiển thị; VBA điều phối nút bấm và xuất file.'
  ),
  'adv-6-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Chuẩn hóa bảng dữ liệu Doanh thu & Giá vốn chi tiết theo Chi nhánh, Kênh bán và Nhóm sản phẩm.',
      'Mức 2 (Nâng cao): Xây dựng bảng cầu nối (P&L Bridge) từ `Doanh thu gộp -> Giảm trừ/Chiết khấu -> Doanh thu thuần -> Giá vốn -> Lãi gộp -> Chi phí vận hành -> EBITDA`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Phân tích chênh lệch Kế hoạch vs Thực tế (Variance Analysis) tách rõ nguyên nhân lệch do Sản lượng (Volume Effect), do Giá bán (Price Effect) hay do Cơ cấu mặt hàng (Mix Effect).',
    ],
    'Bộ báo cáo quản trị 3 tầng (Sales Admin - FP&A - CFO Pack) liên kết từ cùng một nguồn dữ liệu gốc duy nhất (Single Source of Truth).',
    'Khi trình bày cho CFO, con số tổng chỉ là điểm bắt đầu; giá trị thực sự nằm ở bảng giải thích vì sao thực tế lệch so với ngân sách.'
  ),
  'adv-7-1': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Lập lịch trả nợ vay ngân hàng bằng hàm `PMT(rate/12, nper*12, -pv)` và tách phần Gốc/Lãi từng kỳ.',
      'Mức 2 (Nâng cao): Lập bảng dòng tiền dự án đầu tư 5 năm, tính `NPV = NPV(WACC, DongTien_Nam1_Nam5) + DongTien_Nam0` và tính tỷ suất hoàn vốn nội bộ `IRR`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Khi dự án giải ngân và thu tiền vào các ngày không đều nhau trong năm, dùng `XNPV` và `XIRR` để tính toán chính xác và so sánh độ lệch so với `NPV`/`IRR` thông thường.',
    ],
    'Mô hình thẩm định dự án đầu tư chuẩn xác, tránh được hoàn toàn bẫy chiết khấu nhầm Năm 0 của hàm `NPV` và bẫy lệch kỳ hạn của `PMT`.',
    'Luôn kiểm tra kỹ đơn vị thời gian của lãi suất (`năm` hay `tháng`) và thời điểm phát sinh dòng tiền đầu tiên (`t=0` hay `t=1`).'
  ),
  'adv-7-2': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Tính chi phí vốn chủ sở hữu theo mô hình CAPM (`Re = Rf + Beta * ERP`) và tính chi phí vốn bình quân gia quyền `WACC = (E/V)*Re + (D/V)*Rd*(1 - T)`.',
      'Mức 2 (Nâng cao): Dự phóng báo cáo kết quả kinh doanh 5 năm và tính dòng tiền tự do doanh nghiệp `FCFF = EBIT*(1 - T) + Khấu hao - Capex - Delta NWC`.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Tính giá trị cuối kỳ (Terminal Value) theo mô hình tăng trưởng đều Gordon (`TV = FCFF_5 * (1 + g) / (WACC - g)`), chiết khấu về hiện tại để xác định Enterprise Value và kiểm tra điều kiện tiên quyết `WACC > g`.',
    ],
    'Một mô hình định giá DCF 5 năm hoàn chỉnh có cấu trúc tách biệt rõ Khối giả định (Assumptions) -> Khối dự phóng FCFF -> Khối tính WACC & Định giá.',
    'Trong công thức Terminal Value, tuyệt đối không quên nhân `(1 + g)` cho dòng tiền năm cuối `FCFF_5`, và phải chiết khấu `TV` từ cuối năm 5 về năm 0 bằng `(1 + WACC)^5`!'
  ),
  'adv-7-3': buildPracticeBlock(
    [
      'Mức 1 (Cơ bản): Phân rã chỉ số `ROE` của doanh nghiệp theo mô hình DuPont 3 nhân tố (`Biên lợi nhuận ròng × Vòng quay tài sản × Đòn bẩy tài chính`) qua 3 năm liên tiếp.',
      'Mức 2 (Nâng cao): Xây dựng bảng phân tích độ nhạy 2 chiều (2-Way Sensitivity Table) đánh giá sự thay đổi của Giá trị doanh nghiệp khi `WACC` và `Terminal Growth (g)` biến động.',
      'Mức 3 (Thực chiến & Bẫy lỗi): Tính Macaulay Duration và Modified Duration cho một trái phiếu trả lãi định kỳ và ước tính % biến động giá trái phiếu khi lãi suất thị trường tăng thêm 1% (`+100 bps`).',
    ],
    'Bộ mô hình phân tích tài chính nâng cao kết hợp DuPont, Sensitivity Matrix và quản trị rủi ro lãi suất trái phiếu theo chuẩn CFA.',
    'Một mô hình tài chính tốt không bao giờ chỉ đưa ra 1 con số định giá duy nhất, mà luôn đi kèm bảng Sensitivity để thấy vùng giá trị hợp lý theo các kịch bản.'
  ),
};

const studySectionCaseStudyAppendix: Partial<Record<string, string>> = {
  'basic-3-3': buildCaseStudyBlock(
    'Case 1: Chốt nhanh báo cáo doanh thu ngày cho cửa hàng',
    [
      'Một bảng 60 dòng gồm các cột `Ngày`, `Mã KH`, `Chi nhánh`, `Trạng thái`, `Doanh thu`.',
      'Trong dữ liệu có vài dòng thừa khoảng trắng ở `Mã KH` và có 3 dòng `Quá hạn` cần được nhìn ra ngay.',
    ],
    [
      '| Ngày | Mã KH | Chi nhánh | Trạng thái | Doanh thu |',
      '|---|---|---|---|---:|',
      '| 07/05/2026 | KH001 | Hà Nội | Đã thu | 12.500.000 |',
      '| 07/05/2026 |  KH002  | Hà Nội | Quá hạn | 8.400.000 |',
      '| 07/05/2026 | KH003 | TP.HCM | Đang thu | 15.700.000 |',
      '| 07/05/2026 | KH004 | TP.HCM | Quá hạn | 52.000.000 |',
      '| 07/05/2026 | KH005 | Hà Nội | Quá hạn | 61.500.000 |',
    ],
    [
      'Đổi vùng dữ liệu thành Table để dễ lọc và tính toán.',
      'Dùng `TRIM` hoặc kiểm tra thủ công để làm sạch `Mã KH`.',
      'Dùng `SUMIF` tính tổng doanh thu theo từng chi nhánh.',
      'Dùng `COUNTIF` đếm số đơn `Quá hạn`.',
      'Dùng Conditional Formatting tô màu các giao dịch trên 50 triệu.',
    ],
    [
      'Một bảng tổng hợp nhỏ gồm: doanh thu Hà Nội, doanh thu TP.HCM, số đơn quá hạn.',
      'Một danh sách giao dịch nổi bật đã được tô màu để người quản lý kiểm tra nhanh.',
    ],
    [
      'Người học phải tìm đúng các dòng lỗi cơ bản trước khi tính báo cáo.',
      'Bảng kết quả phải đủ số liệu để một quản lý đọc trong dưới 1 phút.',
    ]
  ),
  'basic-4-1': buildCaseStudyBlock(
    'Case 2: Rà soát file công nợ trước khi gửi cuối ngày',
    [
      'Một file công nợ 100 dòng với các cột `Ngày đến hạn`, `Mã KH`, `Nhân viên`, `Trạng thái`, `Số tiền`.',
      'Trong file có dòng thiếu `Mã KH`, có khoản đã quá hạn hơn 30 ngày và có vài giao dịch lớn bất thường.',
    ],
    [
      '| Ngày đến hạn | Mã KH | Nhân viên | Trạng thái | Số tiền |',
      '|---|---|---|---|---:|',
      '| 01/04/2026 | KH101 | Lan | Quá hạn | 18.000.000 |',
      '| 15/04/2026 |  | Minh | Đang thu | 6.500.000 |',
      '| 20/04/2026 | KH103 | Huy | Quá hạn | 82.000.000 |',
      '| 25/05/2026 | KH104 | Lan | Mới | 7.800.000 |',
      '| 28/03/2026 | KH105 | Minh | Quá hạn | 125.000.000 |',
    ],
    [
      'Sort theo `Ngày đến hạn` để nhìn khoản nào cũ nhất.',
      'Filter `Trạng thái = Quá hạn` để tách danh sách cần xử lý gấp.',
      'Filter blank ở `Mã KH` để tìm dòng thiếu dữ liệu.',
      'Dùng Top 10 Filter hoặc sắp xếp giảm dần theo `Số tiền` để soi outlier.',
      'Ghi chú 3 rủi ro chính trước khi gửi file.',
    ],
    [
      'Một danh sách ngắn các khoản cần thu gấp.',
      'Một danh sách các dòng thiếu dữ liệu cần bổ sung.',
      'Một ghi chú cuối ngày nêu rõ giao dịch nào cần quản lý xem ngay.',
    ],
    [
      'Không bỏ sót dòng trống hoặc dòng thiếu mã.',
      'Người học phải chứng minh được vì sao một giao dịch được coi là bất thường.',
    ]
  ),
  'inter-4-1': buildCaseStudyBlock(
    'Case 3: Sales admin chốt doanh thu từ ba kênh bán',
    [
      'Ba file nguồn từ `Retail`, `Online`, `Đại lý` có cấu trúc gần giống nhau nhưng lệch định dạng.',
      'Một bảng danh mục khách hàng có `Mã KH`, `Nhóm KH`, `Nhân viên phụ trách`.',
    ],
    [
      'Bảng đơn hàng:',
      '| Mã đơn | Kênh | Mã KH | Chi nhánh | Doanh thu |',
      '|---|---|---|---|---:|',
      '| RT001 | Retail | KH001 | Hà Nội | 9.500.000 |',
      '| ON001 | Online |  KH002  | Hà Nội | 12.400.000 |',
      '| DL001 | Đại lý | KH003 | Đà Nẵng | 28.700.000 |',
      '| ON002 | Online | KH004 | TP.HCM | 14.900.000 |',
      '',
      'Bảng danh mục khách hàng:',
      '| Mã KH | Nhóm KH | Nhân viên phụ trách |',
      '|---|---|---|',
      '| KH001 | Retail | Lan |',
      '| KH002 | Online | Minh |',
      '| KH003 | Đại lý | Huy |',
      '| KH004 | Online | Trang |',
    ],
    [
      'Chuẩn hóa mã đơn và mã khách hàng bằng `TRIM` hoặc Power Query Trim.',
      'Đổi cột doanh thu về dạng số trước khi tổng hợp.',
      'Dùng XLOOKUP lấy `Nhóm KH` và `Nhân viên phụ trách`.',
      'Dùng SUMIFS tính doanh thu theo kênh và theo chi nhánh.',
      'Tạo Pivot Table theo chi nhánh và nhân viên để chuẩn bị họp chốt ngày.',
    ],
    [
      'Một bảng KPI gồm doanh thu theo kênh, theo chi nhánh và số đơn theo nhân viên.',
      'Một Pivot Table đủ để trả lời: hôm nay bán ở đâu tốt nhất, kênh nào yếu nhất.',
    ],
    [
      'Không được tổng hợp doanh thu khi cột doanh thu còn là text.',
      'Kết quả phải truy ngược được từ báo cáo về từng file nguồn nếu bị hỏi lại.',
    ]
  ),
  'inter-4-3': buildCaseStudyBlock(
    'Case 4: Theo dõi công nợ nội bộ theo tuổi nợ và hạn mức',
    [
      'Một bảng phát sinh công nợ có `Mã KH`, `Ngày đến hạn`, `Dư nợ`, `Nhân viên phụ trách`.',
      'Một bảng danh mục khách hàng có `Hạn mức`, `Nhóm khách hàng`, `Vùng phụ trách`.',
    ],
    [
      'Bảng phát sinh công nợ:',
      '| Mã KH | Ngày đến hạn | Dư nợ | Nhân viên phụ trách |',
      '|---|---|---:|---|',
      '| KH201 | 15/04/2026 | 45.000.000 | Lan |',
      '| KH202 | 05/05/2026 | 12.500.000 | Minh |',
      '| KH203 | 20/03/2026 | 66.000.000 | Huy |',
      '',
      'Bảng danh mục khách hàng:',
      '| Mã KH | Hạn mức | Nhóm khách hàng | Vùng phụ trách |',
      '|---|---:|---|---|',
      '| KH201 | 50.000.000 | Đại lý | Bắc |',
      '| KH202 | 10.000.000 | Retail | Nam |',
      '| KH203 | 60.000.000 | Đại lý | Trung |',
    ],
    [
      'Dùng XLOOKUP để kéo `Hạn mức` và `Nhóm khách hàng` vào bảng phát sinh.',
      'Dùng `TODAY()` hoặc `EOMONTH()` để tính số ngày quá hạn.',
      'Dùng `IF` hoặc `IFS` để gắn nhãn `Trong hạn`, `Quá hạn nhẹ`, `Quá hạn nặng`, `Vượt hạn mức`.',
      'Dùng SUMIFS tổng hợp dư nợ theo nhóm khách hàng và theo nhân viên.',
      'Dùng Conditional Formatting tô màu vùng rủi ro cao.',
    ],
    [
      'Một bảng thu nợ ưu tiên theo mức rủi ro.',
      'Một bảng tổng hợp dư nợ theo nhân viên và nhóm khách hàng.',
    ],
    [
      'Người học phải phân biệt được khách rủi ro do tuổi nợ và khách rủi ro do vượt hạn mức.',
      'Bảng đầu ra phải giúp người quản lý biết ai cần gọi trước trong ngày mai.',
    ]
  ),
  'adv-6-1': buildCaseStudyBlock(
    'Case 5: Kế toán tổng hợp đối soát sao kê ngân hàng với sổ nội bộ',
    [
      'Một file sao kê ngân hàng theo ngày.',
      'Một file sổ phát sinh nội bộ đã hạch toán.',
      'Một bảng danh mục tài khoản để map loại giao dịch.',
    ],
    [
      'Bảng sao kê ngân hàng:',
      '| Mã GD | Ngày | Diễn giải | Số tiền |',
      '|---|---|---|---:|',
      '| GD001 | 06/05/2026 | Thu khách hàng KH301 | 25.000.000 |',
      '| GD002 | 06/05/2026 | Phí ngân hàng | -220.000 |',
      '| GD003 | 07/05/2026 | Chi NCC A | -14.500.000 |',
      '',
      'Bảng sổ nội bộ:',
      '| Mã GD | Ngày | Diễn giải | Số tiền |',
      '|---|---|---|---:|',
      '| GD001 | 06/05/2026 | Thu khách hàng KH301 | 25.000.000 |',
      '| GD003 | 07/05/2026 | Chi NCC A | -14.500.000 |',
      '',
      'Bảng danh mục tài khoản:',
      '| Từ khóa diễn giải | Loại giao dịch | Tài khoản |',
      '|---|---|---|',
      '| Thu khách hàng | Thu tiền | 131 |',
      '| Phí ngân hàng | Phí dịch vụ | 635 |',
      '| Chi NCC | Thanh toán nhà cung cấp | 331 |',
    ],
    [
      'Nạp hai file vào Power Query và chuẩn hóa cột ngày, diễn giải, số tiền.',
      'Dùng Left Outer để map loại giao dịch hoặc tài khoản từ bảng danh mục.',
      'Dùng Left Anti để tìm giao dịch có trên sao kê nhưng chưa có ở sổ nội bộ.',
      'Group By theo ngân hàng hoặc người xử lý để tổng hợp số lượng giao dịch chênh lệch.',
      'Xuất bảng cuối sang Pivot hoặc dashboard để trình bày số chênh lệch.',
    ],
    [
      'Một danh sách giao dịch treo cần hạch toán bổ sung.',
      'Một bảng tổng hợp chênh lệch theo ngân hàng, theo người phụ trách và theo ngày.',
      'Nếu cần, một file PDF biên bản đối soát cuối ngày.',
    ],
    [
      'Query phải refresh lại được khi thay file tháng mới.',
      'Người học phải giải thích được vì sao một giao dịch nằm trong danh sách chênh lệch.',
    ]
  ),
  'adv-6-3': buildCaseStudyBlock(
    'Case 6: Từ doanh thu vận hành lên bộ báo cáo quản trị cho CFO',
    [
      'Một bảng doanh thu theo `Chi nhánh`, `Kênh`, `Sales owner`, `Doanh thu`, `Giá vốn`.',
      'Một bảng giả định kế hoạch tháng và một bảng chi phí vận hành.',
    ],
    [
      'Bảng doanh thu thực tế:',
      '| Chi nhánh | Kênh | Sales owner | Doanh thu | Giá vốn |',
      '|---|---|---|---:|---:|',
      '| Hà Nội | Online | Lan | 320.000.000 | 210.000.000 |',
      '| Hà Nội | Retail | Minh | 180.000.000 | 122.000.000 |',
      '| TP.HCM | Online | Huy | 270.000.000 | 176.000.000 |',
      '',
      'Bảng kế hoạch tháng:',
      '| Chi nhánh | Kế hoạch doanh thu | Kế hoạch biên gộp |',
      '|---|---:|---:|',
      '| Hà Nội | 550.000.000 | 31% |',
      '| TP.HCM | 300.000.000 | 34% |',
      '',
      'Bảng chi phí vận hành:',
      '| Khoản mục | Số tiền |',
      '|---|---:|',
      '| Lương | 95.000.000 |',
      '| Marketing | 42.000.000 |',
      '| Văn phòng | 18.000.000 |',
    ],
    [
      'Chuẩn hóa dữ liệu doanh thu để mọi chi nhánh và kênh dùng cùng quy ước.',
      'Tạo cầu nối `Doanh thu -> Giá vốn -> Lãi gộp -> EBITDA`.',
      'Dùng SUMIFS hoặc Pivot để tổng hợp theo chi nhánh, kênh và sales owner.',
      'Tạo tầng báo cáo vận hành cho sales admin, tầng tài chính quản trị cho finance và tầng trình bày cho CFO.',
      'Bổ sung bảng sensitivity đơn giản cho giá bán hoặc biên lợi nhuận nếu doanh nghiệp hỏi sâu hơn.',
    ],
    [
      'Một dashboard vận hành đọc nhanh trong ngày.',
      'Một bảng bridge giải thích biến động từ doanh thu đến EBITDA.',
      'Một trang tóm tắt cho CFO nêu điểm lệch chính giữa kế hoạch và thực tế.',
    ],
    [
      'Ba tầng báo cáo phải dùng chung một nguồn dữ liệu sự thật.',
      'Người học phải chỉ ra rõ phần nào là dữ liệu gốc, phần nào là tính toán và phần nào là trình bày.',
    ]
  ),
  'adv-7-2': buildCaseStudyBlock(
    'Case 7: Dựng mô hình DCF mini cho một dự án mở điểm bán mới',
    [
      'Giả định doanh thu 5 năm, biên EBIT, Capex ban đầu, vốn lưu động và thuế suất.',
      'Một bảng giả định WACC với `Rf`, `Beta`, `Market premium`, chi phí nợ.',
    ],
    [
      'Bảng giả định vận hành:',
      '| Năm | Doanh thu | Biên EBIT | Khấu hao | Capex | Delta NWC |',
      '|---|---:|---:|---:|---:|---:|',
      '| 1 | 8.000.000.000 | 14% | 200.000.000 | 500.000.000 | 120.000.000 |',
      '| 2 | 8.800.000.000 | 15% | 220.000.000 | 250.000.000 | 80.000.000 |',
      '| 3 | 9.600.000.000 | 16% | 240.000.000 | 250.000.000 | 90.000.000 |',
      '',
      'Bảng giả định WACC:',
      '| Chỉ tiêu | Giá trị |',
      '|---|---:|',
      '| Rf | 4,5% |',
      '| Beta | 1,1 |',
      '| Market premium | 8,0% |',
      '| Cost of debt trước thuế | 9,5% |',
      '| Thuế suất | 20% |',
    ],
    [
      'Forecast doanh thu và EBIT theo từng năm.',
      'Tính FCFF từ EBIT sau thuế, cộng khấu hao, trừ Capex và trừ Delta NWC.',
      'Tính cost of equity theo CAPM, sau đó tính WACC.',
      'Chiết khấu FCFF về hiện tại để ra Enterprise Value.',
      'Làm thêm bảng sensitivity giữa WACC và terminal growth.',
    ],
    [
      'Một mô hình DCF mini 5 năm có thể đọc được từ giả định đến kết quả.',
      'Một bảng sensitivity cho thấy định giá thay đổi như thế nào khi giả định thay đổi.',
    ],
    [
      'Người học phải tách rõ khu giả định, khu tính toán và khu kết quả.',
      'Không được nhảy thẳng vào định giá nếu FCFF chưa được tính đúng và nhất quán.',
    ]
  ),
};

const appendStudySectionExamples = (chapters: StudyChapter[]): StudyChapter[] =>
  chapters.map((chapter) => ({
    ...chapter,
    sections: chapter.sections.map((section) => {
      const appendices = [
        studySectionExampleAppendix[section.id],
        studySectionDetailedPracticeAppendix[section.id] || studySectionPracticeAppendix[section.id],
        studySectionCaseStudyAppendix[section.id],
      ].filter(Boolean) as string[];

      return appendices.length > 0
        ? { ...section, content: joinLines(section.content, ...appendices.flatMap((appendix) => ['', appendix])) }
        : section;
    }),
  }));

export const STUDY_CHAPTERS: StudyChapter[] = [
  ...appendStudySectionExamples([
    ...basicChapters,
    ...intermediateChapters,
    ...advancedChapters,
  ]),
];

import { MULTI_DOMAIN_EXCEL_QUESTIONS } from './questionBankData';

export const EXCEL_QUESTIONS: Record<Level, Question[]> = MULTI_DOMAIN_EXCEL_QUESTIONS;

