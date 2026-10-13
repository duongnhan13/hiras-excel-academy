import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  ChevronRight, 
  Award, 
  CheckCircle2,
  Lock,
  UserCircle2,
  LogOut,
  FileSpreadsheet,
  AlertCircle,
  LayoutGrid,
  FunctionSquare,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Database,
  BookOpen,
  Terminal,
  Zap,
  Monitor,
  ChevronLeft,
  Trophy,
  Medal,
  Users,
  LayoutDashboard,
  Trash2,
  Settings,
  UserCheck,
  GraduationCap,
  Search,
  Download,
  Flag,
  Printer,
  Zap as ZapIcon
} from 'lucide-react';
import { EXCEL_QUESTIONS, STUDY_CHAPTERS, Level, LevelLabels, Question, StudyChapter, StudySection } from './data/excelData';
import {
  PRACTICE_DOMAINS,
  DOMAIN_LIST,
  PracticeDomain,
  FORMULA_LAB_EXERCISES,
  DOMAIN_STUDY_EXERCISES,
  evaluateFormulaSubmission,
  FormulaExercise,
} from './data/practiceLabData';

import { DB, User, QuizSettings, QuizResult } from './data/mockDB';

const TOTAL_STUDY_SECTIONS = STUDY_CHAPTERS.reduce((count, chapter) => count + chapter.sections.length, 0);
const STUDY_CHAPTERS_BY_LEVEL = {
  Basic: STUDY_CHAPTERS.filter((chapter) => chapter.level === 'Basic'),
  Intermediate: STUDY_CHAPTERS.filter((chapter) => chapter.level === 'Intermediate'),
  Advanced: STUDY_CHAPTERS.filter((chapter) => chapter.level === 'Advanced'),
} as const;

const getSectionsForLevel = (level: Level) => STUDY_CHAPTERS_BY_LEVEL[level].flatMap((chapter) => chapter.sections);
const getMissingSections = (progress: string[], level: Level) =>
  getSectionsForLevel(level).filter((section) => !progress.includes(section.id));
const getQuizSessionKey = (userId: string, level: Level, domain: PracticeDomain | 'all' = 'all') =>
  `quiz_session_${userId}_${level}_${domain}`;
const getStudySectionKey = (userId: string) => `activeSection_${userId}`;
const isStudyLevelUnlocked = (user: User, level: Level) => {
  if (user.role === 'admin') return true;
  if (level === 'Basic') return true;
  if (level === 'Intermediate') return user.permissions.canTakeIntermediate;
  return user.permissions.canTakeAdvanced;
};
const getActiveQuizLockUntil = (user: User, level: Level) => {
  const expiresAt = user.lockOuts?.[level];
  if (!expiresAt) return null;
  return new Date(expiresAt).getTime() > Date.now() ? expiresAt : null;
};
const formatLockUntil = (expiresAt: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(expiresAt));

// --- Components ---

const Navbar = ({
  onNav,
  user,
  activeDomain,
  currentView,
  systemName = 'Excel Academy',
  onLogout,
}: {
  onNav: (view: any) => void;
  user: User | null;
  activeDomain?: PracticeDomain;
  currentView?: string;
  systemName?: string;
  onLogout: () => void;
}) => {
  const domMeta = activeDomain ? PRACTICE_DOMAINS[activeDomain] : null;
  const navTabStyle = (target: string, activeColor = 'var(--primary)') => ({
    background: currentView === target ? '#ecfdf5' : 'none',
    border: currentView === target ? '1px solid #a7f3d0' : '1px solid transparent',
    padding: '0.38rem 0.75rem',
    borderRadius: '0.6rem',
    fontWeight: currentView === target ? 700 : 600,
    cursor: 'pointer',
    color: currentView === target ? activeColor : 'inherit',
    transition: 'all 0.15s',
  });

  return (
    <nav className="glass-card" style={{ 
      margin: '1.5rem', 
      padding: '0.9rem 1.75rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '1.5rem',
      zIndex: 100,
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }} onClick={() => onNav('home')}>
        <div style={{ 
          background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', 
          padding: '0.55rem', 
          borderRadius: '0.8rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 14px rgba(5, 150, 105, 0.25)'
        }}>
          <GraduationCap size={25} />
        </div>
        <h2 style={{ fontSize: '1.3rem', margin: 0, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.01em' }}>
          {systemName || 'Excel Academy'}
        </h2>
      </div>
      
      {user && (
        <div style={{ display: 'flex', gap: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', alignItems: 'center', flexWrap: 'wrap' }}>
          {domMeta && (
            <button
              onClick={() => onNav('home')}
              title="Nhánh chuyên ngành đang theo học xuyên suốt (Bấm để xem lộ trình hoặc đổi nhánh)"
              style={{
                background: `${domMeta.color}12`,
                border: `1.5px solid ${domMeta.color}`,
                color: domMeta.color,
                padding: '0.36rem 0.85rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>{domMeta.badge}</span>
              <span>Nhánh: {domMeta.shortName}</span>
            </button>
          )}
          <button onClick={() => onNav('home')} style={navTabStyle('home')}>Lộ trình</button>
          <button onClick={() => onNav('study')} style={navTabStyle('study')}>Giáo trình</button>
          <button onClick={() => onNav('lab')} style={{ background: currentView === 'lab' ? '#059669' : '#ecfdf5', border: '1px solid #10b981', padding: '0.38rem 0.85rem', borderRadius: '0.6rem', fontWeight: 700, cursor: 'pointer', color: currentView === 'lab' ? 'white' : '#059669', display: 'flex', alignItems: 'center', gap: '0.38rem' }}>
            <Terminal size={15} /> Phòng Lab
          </button>
          <button onClick={() => onNav('lessons')} style={navTabStyle('lessons')}>Sát hạch</button>
          <button onClick={() => onNav('profile')} style={navTabStyle('profile')}>Chứng nhận</button>
          <button onClick={() => onNav('leaderboard')} style={{ ...navTabStyle('leaderboard', '#d97706'), color: currentView === 'leaderboard' ? '#b45309' : '#f59e0b' }}>
            🏆 Xếp hạng
          </button>
          
          {user.role === 'admin' && (
            <button onClick={() => onNav('admin')} style={{ ...navTabStyle('admin', 'var(--secondary)'), color: 'var(--secondary)' }}>
              Quản trị
            </button>
          )}

          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)' }}>
            <UserCircle2 size={20} />
            <span style={{ fontSize: '0.92rem' }}>{user.name} ({user.id})</span>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.25rem' }} title="Đăng xuất">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Mã đăng nhập và Mật khẩu.');
      return;
    }
    await DB.refresh();

    if (isRegister) {
      if (!fullName.trim()) {
        setError('Vui lòng nhập Họ Tên.');
        return;
      }
      const existingUser = DB.getUser(username.trim());
      if (existingUser) {
        setError('Mã đăng nhập đã tồn tại!');
        return;
      }
      const newUser: User = {
        id: username.trim(),
        name: fullName.trim(),
        role: 'user',
        status: 'pending',
        createdAt: new Date().toISOString(),
        permissions: { canTakeBasic: true, canTakeIntermediate: false, canTakeAdvanced: false },
        progress: [],
        password: password
      };
      await DB.addUser(newUser);
      setIsRegister(false);
      setPassword('');
      setSuccessMsg(
        `✅ Đăng ký tài khoản "${newUser.id}" thành công! Tài khoản đang ở trạng thái CHỜ DUYỆT. Bạn cần được Quản trị viên (Admin) phê duyệt trước khi có thể đăng nhập.`
      );
    } else {
      const authResult = DB.authenticate(username.trim(), password);
      if (authResult.ok && authResult.user) {
        setError('');
        onLogin(authResult.user);
      } else if (authResult.reason === 'pending') {
        setError('⏳ Tài khoản của bạn đang CHỜ PHÊ DUYỆT. Vui lòng liên hệ Quản trị viên (Admin) duyệt tài khoản trước khi sử dụng.');
      } else if (authResult.reason === 'rejected') {
        setError('⛔ Tài khoản của bạn đã bị từ chối hoặc tạm khóa quyền truy cập. Vui lòng liên hệ Quản trị viên.');
      } else {
        setError('Mã nhân viên hoặc mật khẩu không chính xác.');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', color: 'white', width: '68px', height: '68px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)' }}>
          <GraduationCap size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isRegister ? 'Đăng Ký Tài Khoản Học & Thi' : 'Đăng nhập Hệ thống'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
          {isRegister
            ? 'Tài khoản sau khi đăng ký sẽ được gửi tới Quản trị viên (Admin) phê duyệt trước khi kích hoạt.'
            : 'Đăng nhập bằng tài khoản đã được Quản trị viên phê duyệt để tiếp tục.'}
        </p>
        
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '0.65rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, textAlign: 'left' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.9rem 1rem', borderRadius: '0.65rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.55, textAlign: 'left' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Họ và Tên (VD: Nguyễn Văn A)" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
            />
          )}
          <input 
            type="text" 
            placeholder="Mã NV / Tên đăng nhập" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isRegister ? 'Gửi yêu cầu Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký mới'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const IconMap: Record<string, any> = {
  LayoutGrid, FunctionSquare, TrendingUp, ShieldCheck, PieChart, Database, Zap, Monitor,
  Cpu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>,
  Network: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>,
  GitCompare: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/><polyline points="15 9 18 6 21 9"/><polyline points="9 15 6 18 3 15"/></svg>,
  Package: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Palette: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  Sparkles: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
};

const RichContent = React.memo(({ content }: { content: string }) => <>{parseContent(content)}</>);

const renderInlineScenarioText = (text: string) =>
  text.split(/(`[^`]+`)/g).filter(Boolean).map((part, index) => (
    part.startsWith('`') && part.endsWith('`')
      ? (
        <code
          key={`${part}-${index}`}
          style={{
            background: '#0f172a',
            color: '#dcfce7',
            padding: '0.15rem 0.45rem',
            borderRadius: '0.4rem',
            fontSize: '0.92em',
            fontWeight: 700,
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  ));

type QuizPromptSection = {
  label: string;
  content: string;
};

const normalizeQuestionTitle = (text: string) => {
  const withoutBracket = text.replace(/\s*-\s*\[[^\]]+\]$/, '');
  const match = withoutBracket.match(/^(.*)\s-\s.+\(\d+\)$/);
  return (match ? match[1] : withoutBracket).trim();
};

const getQuizDisplayTitle = (text: string) => {
  const baseTitle = normalizeQuestionTitle(text);
  const titleMap: Record<string, string> = {
    'Tra cứu đơn giá bằng VLOOKUP': 'Tra cứu đơn giá',
    'Tổng hợp nhiều điều kiện bằng SUMIFS': 'Tổng hợp nhiều điều kiện',
    'Đếm công nợ quá hạn bằng COUNTIFS': 'Đếm công nợ quá hạn',
    'Tính trung bình có điều kiện bằng AVERAGEIFS': 'Tính trung bình có điều kiện',
    'Tra cứu hiện đại bằng XLOOKUP': 'Tra cứu dữ liệu từ danh mục',
    'INDEX MATCH trong file cũ': 'Tra cứu dữ liệu trong file cũ',
    'Phân nhóm bằng IF': 'Phân nhóm kết quả',
    'Phân nhóm nhiều mức bằng IFS': 'Phân nhóm nhiều mức',
    'Lọc dữ liệu động bằng FILTER': 'Lọc dữ liệu động',
    'Tạo danh sách không trùng bằng UNIQUE': 'Tạo danh sách không trùng',
    'Sắp xếp bảng động bằng SORT': 'Sắp xếp bảng dữ liệu',
    'Chống lỗi tra cứu bằng IFERROR': 'Chống lỗi tra cứu',
  };

  return titleMap[baseTitle] || baseTitle;
};

const getQuestionMode = (question: Question) => {
  const optionText = question.options.join(' | ');
  if (/Ctrl|Alt|Shift/i.test(optionText)) return 'shortcut';
  if (/Pivot Table|Power Query|Conditional Formatting|Data Validation|From Folder|Join|Dashboard|Table|Date conversion|Text to Columns/i.test(optionText)) return 'tool';
  if (/^=|PMT\(|XNPV|XIRR|NPV|FCFF|WACC|CAPM|Duration|Định phí/i.test(optionText)) return 'formula';
  return 'concept';
};

const buildFormulaDescription = (question: Question, level: Level) => {
  const scenario = (question.scenario || '').trim();
  if (question.sampleTable) {
    return scenario;
  }
  return level === 'Basic'
    ? `${scenario} Dữ liệu theo form thường có các cột cơ bản như \`Mã đơn\`, \`Ngày\`, \`Chi nhánh\`, \`Trạng thái\`, \`Doanh thu\`.`
    : level === 'Intermediate'
      ? `${scenario} Dữ liệu theo form thường có các cột như \`Ngày\`, \`Chi nhánh\`, \`Kênh bán\`, \`Sales owner\`, \`Trạng thái\`, \`Doanh thu\`.`
      : `${scenario} Dữ liệu theo form thường có các cột như \`Ngày\`, \`Mã giao dịch\`, \`Chi nhánh\`, \`Số tiền\`, \`Trạng thái\`.`;
};

const buildQuizPromptSectionsSimple = (question: Question, level: Level): QuizPromptSection[] => {
  const mode = getQuestionMode(question);
  const rawScenario = (question.scenario || '').trim();
  const description = mode === 'formula' ? buildFormulaDescription(question, level) : rawScenario;

  const prompt =
    mode === 'formula'
      ? 'Đâu là công thức đúng nhất cho yêu cầu trên?'
      : mode === 'shortcut' || mode === 'tool'
        ? 'Đâu là thao tác hoặc công cụ phù hợp nhất cho mô tả trên?'
        : 'Đâu là đáp án đúng nhất cho mô tả trên?';

  return [
    { label: 'BỐI CẢNH & YÊU CẦU NGHIỆP VỤ', content: description },
    { label: 'CÂU HỎI', content: prompt },
  ];
};

const QuizScenarioDetails = ({ question, level }: { question: Question; level: Level }) => {
  const sections = buildQuizPromptSectionsSimple(question, level);
  const domainInfo = question.domain ? PRACTICE_DOMAINS[question.domain] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      {domainInfo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: `${domainInfo.color}15`,
              color: domainInfo.color,
              border: `1px solid ${domainInfo.color}40`,
            }}
          >
            <span>{domainInfo.badge}</span>
            <span>Mảng nghiệp vụ: {domainInfo.name}</span>
          </span>
          {question.topic && (
            <span
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: '#f1f5f9',
                color: '#475569',
              }}
            >
              Chủ đề: {question.topic}
            </span>
          )}
        </div>
      )}

      {sections.map((section, index) => (
        <div
          key={`${section.label}-${index}`}
          style={{
            lineHeight: 1.7,
            color: '#334155',
            fontSize: '0.98rem',
            padding: '1rem',
            background: index === 0 ? 'white' : '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f766e', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
            {section.label}
          </div>
          <div>{renderInlineScenarioText(section.content)}</div>
        </div>
      ))}

      {question.sampleTable && (
        <div
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '0.85rem',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div
            style={{
              background: '#f1f5f9',
              padding: '0.55rem 1rem',
              borderBottom: '1px solid #cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>📋 BẢNG DỮ LIỆU MẪU TRÊN EXCEL (Dòng 1 là tiêu đề cột)</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Sheet: DuLieuNguon</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.35rem 0.6rem', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', textAlign: 'center', width: '38px', fontWeight: 700 }}>
                    #
                  </th>
                  {question.sampleTable.headers.map((_, colIdx) => (
                    <th
                      key={`col-letter-${colIdx}`}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRight: '1px solid #cbd5e1',
                        borderBottom: '1px solid #cbd5e1',
                        textAlign: 'center',
                        fontWeight: 800,
                        color: '#1e293b',
                      }}
                    >
                      {String.fromCharCode(65 + colIdx)}
                    </th>
                  ))}
                </tr>
                <tr style={{ background: '#0f766e', color: 'white' }}>
                  <td style={{ padding: '0.45rem 0.6rem', borderRight: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, background: '#e2e8f0', color: '#475569' }}>
                    1
                  </td>
                  {question.sampleTable.headers.map((header, colIdx) => (
                    <th
                      key={`header-${colIdx}`}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'left',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header.replace(/\s*\([A-Z]+\)$/, '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.sampleTable.rows.map((row, rowIdx) => (
                  <tr key={`row-${rowIdx}`} style={{ background: rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <td
                      style={{
                        padding: '0.45rem 0.6rem',
                        borderRight: '1px solid #cbd5e1',
                        textAlign: 'center',
                        fontWeight: 700,
                        background: '#f1f5f9',
                        color: '#64748b',
                      }}
                    >
                      {rowIdx + 2}
                    </td>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={`cell-${rowIdx}-${cellIdx}`}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRight: '1px solid #e2e8f0',
                          color: cell.includes('?') ? '#059669' : '#334155',
                          fontWeight: cell.includes('?') ? 800 : 500,
                          background: cell.includes('?') ? '#ecfdf5' : 'transparent',
                          fontFamily: /^=|^\d/.test(cell) ? "'Fira Code', monospace" : 'inherit',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// --- RICH CONTENT RENDERER ---
const parseContent = (content: string) => {
  const TAG_CONFIG: Record<string, { bg: string; border: string; titleColor: string; icon: React.ReactNode }> = {
    'TÓM TẮT':          { bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1d4ed8', icon: <AlertCircle size={18}/> },
    'CHI TIẾT':         { bg: 'white',   border: 'var(--border)', titleColor: 'var(--text-main)', icon: <LayoutGrid size={18}/> },
    'CÚ PHÁP':          { bg: '#f0fdf4', border: '#bbf7d0', titleColor: '#15803d', icon: <Terminal size={18}/> },
    'LƯU Ý':            { bg: '#fffbeb', border: '#fde68a', titleColor: '#b45309', icon: <ShieldCheck size={18}/> },
    'VÍ DỤ':            { bg: '#fdf4ff', border: '#e9d5ff', titleColor: '#7e22ce', icon: <BookOpen size={18}/> },
    'VÍ DỤ THỰC TẾ':    { bg: '#fdf4ff', border: '#e9d5ff', titleColor: '#7e22ce', icon: <BookOpen size={18}/> },
    'QUY TRÌNH':        { bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46', icon: <CheckCircle2 size={18}/> },
    'QUY TRÌNH CHI TIẾT': { bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46', icon: <CheckCircle2 size={18}/> },
    'DÙNG ĐỂ LÀM GÌ':   { bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1d4ed8', icon: <BookOpen size={18}/> },
    'KHI NÀO NÊN DÙNG': { bg: '#f8fafc', border: '#cbd5e1', titleColor: '#334155', icon: <Monitor size={18}/> },
    'MẸO':              { bg: '#fff7ed', border: '#fed7aa', titleColor: '#c2410c', icon: <Zap size={18}/> },
    'MẸO KẾ TOÁN':      { bg: '#fff7ed', border: '#fed7aa', titleColor: '#c2410c', icon: <Zap size={18}/> },
    'TÌNH HUỐNG':       { bg: '#f0f9ff', border: '#bae6fd', titleColor: '#0369a1', icon: <Monitor size={18}/> },
    'BẢNG QUYẾT ĐỊNH THỰC TẾ': { bg: '#f8fafc', border: 'var(--border)', titleColor: '#334155', icon: <Database size={18}/> },
    'CÔNG THỨC LỰA CHỌN ĐƠN GIẢN': { bg: '#fef9c3', border: '#fde047', titleColor: '#713f12', icon: <Zap size={18}/> },
    'BÀI TOÁN':         { bg: '#f0f9ff', border: '#bae6fd', titleColor: '#0369a1', icon: <Monitor size={18}/> },
    'BÀI TOÁN THỰC TẾ': { bg: '#f0f9ff', border: '#bae6fd', titleColor: '#0369a1', icon: <Monitor size={18}/> },
    'THỰC HIỆN':        { bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46', icon: <CheckCircle2 size={18}/> },
    'BÀI TẬP THEO MỨC': { bg: '#fff7ed', border: '#fed7aa', titleColor: '#c2410c', icon: <Zap size={18}/> },
    'GỢI Ý LÀM':        { bg: '#eff6ff', border: '#bfdbfe', titleColor: '#1d4ed8', icon: <BookOpen size={18}/> },
    'ĐẦU RA MONG ĐỢI':  { bg: '#f0fdf4', border: '#bbf7d0', titleColor: '#15803d', icon: <CheckCircle2 size={18}/> },
    'CASE STUDY THỰC CHIẾN': { bg: '#fff1f2', border: '#fecdd3', titleColor: '#be123c', icon: <Monitor size={18}/> },
    'ĐẦU VÀO':          { bg: '#f8fafc', border: '#cbd5e1', titleColor: '#334155', icon: <Database size={18}/> },
    'BẢNG SỐ LIỆU MẪU': { bg: '#eef2ff', border: '#c7d2fe', titleColor: '#4338ca', icon: <LayoutGrid size={18}/> },
    'ĐẦU RA CUỐI CÙNG': { bg: '#ecfdf5', border: '#86efac', titleColor: '#166534', icon: <CheckCircle2 size={18}/> },
    'TIÊU CHÍ TỰ CHẤM': { bg: '#fefce8', border: '#fde68a', titleColor: '#854d0e', icon: <ShieldCheck size={18}/> },
    'SƠ ĐỒ LIÊN KẾT':  { bg: '#f8fafc', border: '#94a3b8', titleColor: '#334155', icon: <Database size={18}/> },
    'KẾT QUẢ':          { bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46', icon: <CheckCircle2 size={18}/> },
    'LƯU Ý QUAN TRỌNG': { bg: '#fff1f2', border: '#fecdd3', titleColor: '#be123c', icon: <AlertCircle size={18}/> },
    'SO SÁNH ĐỂ HIỂU RÕ': { bg: '#f5f3ff', border: '#ddd6fe', titleColor: '#6d28d9', icon: <Database size={18}/> },
    'ỨNG DỤNG THỰC TẾ': { bg: '#fdf4ff', border: '#e9d5ff', titleColor: '#7e22ce', icon: <BookOpen size={18}/> },
    'ƯU ĐIỂM':          { bg: '#ecfdf5', border: '#a7f3d0', titleColor: '#065f46', icon: <CheckCircle2 size={18}/> },
    'NHƯỢC ĐIỂM':       { bg: '#fff1f2', border: '#fecdd3', titleColor: '#be123c', icon: <AlertCircle size={18}/> },
    'DEFAULT': { bg: '#f8fafc', border: 'var(--border)', titleColor: 'var(--text-main)', icon: <BookOpen size={18}/> },
  };

  const renderInlineText = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-main);font-weight:700;">$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#1e293b;color:#86efac;padding:3px 8px;border-radius:5px;font-family:\'Fira Code\',monospace;font-size:0.88em;letter-spacing:0.02em;">$1</code>')
      // Improved formula highlight: look for capitalized words followed by ( and matching )
      .replace(/(?<![A-Za-z0-9])([A-Z][A-Z0-9_.]+\s*\(.*?\))/g, (match) => {
        const openCount = (match.match(/\(/g) || []).length;
        const closeCount = (match.match(/\)/g) || []).length;
        if (openCount === closeCount) {
          return `<code style="background:#1e293b;color:#86efac;padding:2px 6px;border-radius:4px;font-family:'Fira Code',monospace;font-size:0.9em;">${match}</code>`;
        }
        return match;
      });
  };

  const renderLines = (textLines: string[]): string => {
    const result: string[] = [];
    let i = 0;
    let inTable = false;
    let tableHtml = '';

    while (i < textLines.length) {
      const raw = textLines[i];
      const line = raw.trim();

      // Table detection
      if (line.startsWith('|') && line.endsWith('|')) {
        if (line.replace(/\|/g, '').trim().replace(/-/g, '').trim() === '') { i++; continue; }
        if (!inTable) {
          inTable = true;
          tableHtml = '<div style="overflow-x:auto;margin:0.75rem 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)"><table style="width:100%;border-collapse:collapse;">';
          const cells = line.split('|').slice(1,-1).map(c => c.trim());
          tableHtml += '<thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);">';
          cells.forEach(c => tableHtml += `<th style="padding:0.65rem 1rem;text-align:left;font-weight:700;color:white;font-size:0.88rem;white-space:nowrap;">${renderInlineText(c)}</th>`);
          tableHtml += '</tr></thead><tbody>';
        } else {
          const cells = line.split('|').slice(1,-1).map(c => c.trim());
          const rowIdx = result.filter(r => r.includes('<tr')).length;
          const bg = rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
          tableHtml += `<tr style="background:${bg};border-bottom:1px solid #e2e8f0;">`;
          cells.forEach(c => tableHtml += `<td style="padding:0.6rem 1rem;color:#475569;font-size:0.9rem;">${renderInlineText(c)}</td>`);
          tableHtml += '</tr>';
        }
        i++; continue;
      } else if (inTable) {
        tableHtml += '</tbody></table></div>';
        result.push(tableHtml);
        tableHtml = '';
        inTable = false;
      }

      if (!line) { result.push('<div style="height:0.5rem"></div>'); i++; continue; }

      // Code blocks (multi-line)
      if (line.startsWith('```')) {
        let codeContent = '';
        i++;
        while(i < textLines.length && !textLines[i].trim().startsWith('```')) {
          codeContent += textLines[i] + '\n';
          i++;
        }
        result.push(`<div style="margin:0.75rem 0;padding:1rem;background:#0f172a;border-radius:10px;border-left:4px solid var(--primary);font-family:'Fira Code',monospace;font-size:0.88rem;color:#f8fafc;overflow-x:auto;line-height:1.6;white-space:pre;">${codeContent.trim()}</div>`);
        i++; continue;
      }

      // Numbered list
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        result.push(`<div style="display:flex;gap:0.75rem;margin:0.35rem 0;align-items:flex-start;">
          <span style="min-width:1.6rem;height:1.6rem;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;flex-shrink:0;">${numMatch[1]}</span>
          <span style="line-height:1.7;color:var(--text-muted);">${renderInlineText(numMatch[2])}</span>
        </div>`);
        i++; continue;
      }

      // Special items
      if (/^[★✓✗⚠💡✅⛔🟡🟠🔴]/.test(line)) {
        result.push(`<div style="display:flex;gap:0.5rem;margin:0.3rem 0;align-items:flex-start;padding:0.4rem 0.6rem;border-radius:6px;background:rgba(0,0,0,0.02);">
          <span style="line-height:1.7;color:var(--text-muted);">${renderInlineText(line)}</span>
        </div>`);
        i++; continue;
      }

      if (line.startsWith('→')) {
        result.push(`<div style="margin:0.25rem 0 0.25rem 1.5rem;color:#64748b;font-size:0.93rem;">${renderInlineText(line)}</div>`);
        i++; continue;
      }

      if (line.startsWith('- ')) {
        result.push(`<div style="display:flex;gap:0.6rem;margin:0.25rem 0;align-items:flex-start;">
          <span style="color:var(--primary);font-weight:700;margin-top:0.1rem;flex-shrink:0;">•</span>
          <span style="line-height:1.7;color:var(--text-muted);">${renderInlineText(line.slice(2))}</span>
        </div>`);
        i++; continue;
      }

      // Standalone formulas
      if (line.startsWith('=') && !line.startsWith('=>')) {
        result.push(`<div style="margin:0.5rem 0;padding:0.6rem 1rem;background:#0f172a;border-radius:8px;border-left:3px solid #22d3ee;font-family:'Fira Code',monospace;font-size:0.9em;color:#86efac;overflow-x:auto;white-space:pre;">${line}</div>`);
        i++; continue;
      }

      // Default paragraph
      result.push(`<div style="margin:0.2rem 0;line-height:1.75;color:var(--text-muted);">${renderInlineText(line)}</div>`);
      i++;
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      result.push(tableHtml);
    }

    return result.join('');
  };

  // Grouping lines into sections by [TAG] on own line
  const lines = content.split('\n');
  const sections: { tag: string; bodyLines: string[] }[] = [];
  let currentSec: { tag: string; bodyLines: string[] } = { tag: 'CHI TIẾT', bodyLines: [] };

  lines.forEach(line => {
    const trimmed = line.trim();
    const tagMatch = trimmed.match(/^\[([^\]]+)\]$/);
    
    if (tagMatch) {
      const tagName = tagMatch[1];
      if (TAG_CONFIG[tagName] || (tagName === tagName.toUpperCase() && tagName.length > 2)) {
        if (currentSec.bodyLines.length > 0 || currentSec.tag !== 'CHI TIẾT') {
          sections.push(currentSec);
        }
        currentSec = { tag: tagName, bodyLines: [] };
        return;
      }
    }
    currentSec.bodyLines.push(line);
  });
  sections.push(currentSec);

  return sections.map((sec, idx) => {
    const cfg = TAG_CONFIG[sec.tag] || TAG_CONFIG['DEFAULT'];
    return (
      <div key={idx} style={{ 
        background: cfg.bg, 
        border: `1.5px solid ${cfg.border}`, 
        borderRadius: '12px', 
        padding: '1.25rem 1.5rem', 
        marginBottom: '1.25rem', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.65rem', 
          marginBottom: '1rem', 
          color: cfg.titleColor, 
          fontWeight: 700, 
          fontSize: '0.9rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {cfg.icon}
          <span>{sec.tag}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: renderLines(sec.bodyLines) }} />
      </div>
    );
  });
};



const StudyView = ({
  user,
  activeDomain,
  onSelectDomain,
  onToggleProgress,
  onGoToQuiz,
  onOpenFormulaLab,
}: {
  user: User;
  activeDomain: PracticeDomain;
  onSelectDomain: (domain: PracticeDomain) => void;
  onToggleProgress: (sectionId: string) => void;
  onGoToQuiz: () => void;
  onOpenFormulaLab: (domain: PracticeDomain, level: Level) => void;
}) => {
  const unlockedChapters = STUDY_CHAPTERS.filter((chapter) => isStudyLevelUnlocked(user, chapter.level));
  const fallbackSection = unlockedChapters[0]?.sections[0]?.id || STUDY_CHAPTERS[0].sections[0].id;
  const sectionStorageKey = getStudySectionKey(user.id);
  const [activeSection, setActiveSection] = useState<string>(() => localStorage.getItem(sectionStorageKey) || fallbackSection);
  const [selectedPracticeDomain, setSelectedPracticeDomain] = useState<PracticeDomain>(activeDomain);
  const [showDomainSolutions, setShowDomainSolutions] = useState(false);
  const [studySearch, setStudySearch] = useState('');

  useEffect(() => {
    setSelectedPracticeDomain(activeDomain);
  }, [activeDomain]);

  useEffect(() => {
    localStorage.setItem(sectionStorageKey, activeSection);
    setShowDomainSolutions(false);
  }, [activeSection, sectionStorageKey]);

  useEffect(() => {
    const activeChapter = STUDY_CHAPTERS.find((chapter) => chapter.sections.some((section) => section.id === activeSection));
    if (!activeChapter || !isStudyLevelUnlocked(user, activeChapter.level)) {
      setActiveSection(fallbackSection);
    }
  }, [activeSection, fallbackSection, user]);

  const activeChap = STUDY_CHAPTERS.find(c => c.sections.some(s => s.id === activeSection));
  const activeSec = activeChap?.sections.find(s => s.id === activeSection);
  const userProgress = user.progress || [];
  const completedSections = userProgress.length;
  const progressPercent = TOTAL_STUDY_SECTIONS === 0 ? 0 : Math.round((completedSections / TOTAL_STUDY_SECTIONS) * 100);
  const activeLevelMissingSections = activeChap ? getMissingSections(userProgress, activeChap.level) : [];
  const canStartActiveLevelQuiz = Boolean(activeChap) && (user.id === 'admin' || activeLevelMissingSections.length === 0);
  const currentDomainExercise = activeChap
    ? DOMAIN_STUDY_EXERCISES.find((ex) => ex.domain === selectedPracticeDomain && ex.level === activeChap.level) || null
    : null;
  const activeDomainMeta = PRACTICE_DOMAINS[selectedPracticeDomain];
  const normalizedSearch = studySearch.trim().toLocaleLowerCase('vi-VN');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2rem 0', display: 'flex', gap: '2rem', minHeight: '80vh', alignItems: 'flex-start' }}>
      <div className="glass-card" style={{ width: '350px', padding: '1.5rem', position: 'sticky', top: '100px', flexShrink: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={22} color="var(--primary)" />
          Giáo trình & Tra cứu Hàm
        </h3>
        
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            <span>Tiến độ hoàn thành</span>
            <span style={{ color: 'var(--primary)' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} style={{ height: '100%', background: 'var(--primary)' }} />
          </div>
        </div>

        {/* Ô tìm kiếm nhanh hàm & tình huống */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={studySearch}
            onChange={(e) => setStudySearch(e.target.value)}
            placeholder="Tìm hàm / chủ đề (VD: XLOOKUP, SUMIFS...)"
            style={{
              width: '100%',
              padding: '0.65rem 2rem 0.65rem 2.35rem',
              borderRadius: '0.65rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.86rem',
              outline: 'none',
              background: '#f8fafc',
            }}
          />
          {studySearch && (
            <button
              onClick={() => setStudySearch('')}
              style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 800 }}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {STUDY_CHAPTERS.map(chap => {
            const IconComponent = IconMap[chap.iconName] || LayoutGrid;
            const isChapLocked = !isStudyLevelUnlocked(user, chap.level);
            const matchingSections = normalizedSearch
              ? chap.sections.filter(
                  (sec) =>
                    sec.title.toLocaleLowerCase('vi-VN').includes(normalizedSearch) ||
                    sec.content.toLocaleLowerCase('vi-VN').includes(normalizedSearch)
                )
              : chap.sections;

            if (normalizedSearch && matchingSections.length === 0) return null;

            return (
              <div key={chap.id} style={{ opacity: isChapLocked ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '0.92rem', textTransform: 'uppercase' }}>
                  {isChapLocked ? <Lock size={18} /> : <IconComponent size={18} />}
                  {chap.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.65rem', paddingLeft: '1.5rem' }}>
                  [{LevelLabels[chap.level]}] {isChapLocked ? ' - Yêu cầu Đạt cấp độ trước' : ''}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {matchingSections.map(sec => {
                    const isDone = userProgress.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        disabled={isChapLocked}
                        onClick={() => !isChapLocked && setActiveSection(sec.id)}
                        style={{
                          textAlign: 'left', padding: '0.7rem 0.95rem', borderRadius: '0.5rem', border: 'none',
                          background: activeSection === sec.id ? 'var(--primary)' : 'transparent',
                          color: activeSection === sec.id ? 'white' : 'var(--text-muted)',
                          fontWeight: activeSection === sec.id ? 600 : 500,
                          cursor: isChapLocked ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '0.88rem',
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem'
                        }}
                      >
                        <span style={{ flex: 1, lineHeight: '1.4' }}>{sec.title}</span>
                        {isDone && <CheckCircle2 size={16} color={activeSection === sec.id ? 'white' : 'var(--primary)'} style={{ flexShrink: 0, marginTop: '0.15rem' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {activeSec && (
            <motion.div key={activeSec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{activeChap?.title}</span>
                <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0' }}>{activeSec.title}</h1>
              </div>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <RichContent content={activeSec.content} />

                {activeChap && currentDomainExercise && (
                  <div
                    style={{
                      marginTop: '2.5rem',
                      padding: '2rem',
                      borderRadius: '1rem',
                      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                      border: `2px solid ${activeDomainMeta.color}40`,
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: activeDomainMeta.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                          🎯 NHÁNH ÔN LUYỆN XUYÊN SUỐT: {activeDomainMeta.name.toUpperCase()} — CẤP ĐỘ {LevelLabels[activeChap.level].toUpperCase()}
                        </div>
                        <h3 style={{ fontSize: '1.35rem', margin: 0, color: '#0f172a' }}>
                          Bài tập tình huống thực tế của nhánh {activeDomainMeta.shortName}
                        </h3>
                      </div>
                      <button
                        onClick={() => onOpenFormulaLab(selectedPracticeDomain, activeChap.level)}
                        className="btn btn-primary"
                        style={{
                          background: activeDomainMeta.color,
                          padding: '0.65rem 1.2rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <Terminal size={16} /> Mở Phòng Lab gõ công thức ({activeDomainMeta.shortName}) →
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {DOMAIN_LIST.map((dom) => {
                        const isSelected = dom.id === selectedPracticeDomain;
                        return (
                          <button
                            key={dom.id}
                            onClick={() => {
                              setSelectedPracticeDomain(dom.id);
                              onSelectDomain(dom.id);
                              setShowDomainSolutions(false);
                            }}
                            style={{
                              padding: '0.85rem 1rem',
                              borderRadius: '0.75rem',
                              border: isSelected ? `2px solid ${dom.color}` : '1px solid #cbd5e1',
                              background: isSelected ? `${dom.color}12` : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? dom.color : '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span>{dom.badge}</span>
                              <span>{dom.shortName}</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.35 }}>
                              {dom.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem', color: activeDomainMeta.color, marginBottom: '0.5rem' }}>
                        {activeDomainMeta.badge} {currentDomainExercise.title}
                      </div>
                      <p style={{ color: '#334155', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                        {currentDomainExercise.scenario}
                      </p>

                      <div style={{ overflowX: 'auto', marginBottom: '1.5rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ background: activeDomainMeta.color, color: 'white' }}>
                              {currentDomainExercise.sampleHeaders.map((h: string, idx: number) => (
                                <th key={idx} style={{ padding: '0.6rem 0.85rem', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentDomainExercise.sampleRows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'white' : '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                {row.map((cell: string, cIdx: number) => (
                                  <td
                                    key={cIdx}
                                    style={{
                                      padding: '0.55rem 0.85rem',
                                      borderRight: '1px solid #e2e8f0',
                                      color: cell === '?' ? activeDomainMeta.color : '#334155',
                                      fontWeight: cell === '?' ? 800 : 500,
                                      background: cell === '?' ? `${activeDomainMeta.color}12` : 'transparent',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ display: 'grid', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ padding: '0.9rem 1.1rem', borderRadius: '0.65rem', background: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#15803d', marginBottom: '0.25rem' }}>🟢 MỨC 1 — YÊU CẦU CƠ BẢN</div>
                          <div style={{ color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.6 }}>{currentDomainExercise.tiers.basic}</div>
                        </div>
                        <div style={{ padding: '0.9rem 1.1rem', borderRadius: '0.65rem', background: '#eff6ff', borderLeft: '4px solid #2563eb' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1d4ed8', marginBottom: '0.25rem' }}>🔵 MỨC 2 — TỔNG HỢP & TRA CỨU NÂNG CAO</div>
                          <div style={{ color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.6 }}>{currentDomainExercise.tiers.advanced}</div>
                        </div>
                        <div style={{ padding: '0.9rem 1.1rem', borderRadius: '0.65rem', background: '#fff1f2', borderLeft: '4px solid #e11d48' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#be123c', marginBottom: '0.25rem' }}>🔴 MỨC 3 — BẪY DỮ LIỆU THỰC TẾ & KIỂM SOÁT LỖI</div>
                          <div style={{ color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.6 }}>{currentDomainExercise.tiers.realWorldTrap}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowDomainSolutions((prev) => !prev)}
                        className="btn"
                        style={{
                          border: `1px solid ${activeDomainMeta.color}`,
                          color: activeDomainMeta.color,
                          background: 'white',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '0.6rem',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {showDomainSolutions ? 'Ẩn Đáp án & Công thức mẫu ▲' : 'Xem Đáp án & Công thức mẫu (3 mức) ▼'}
                      </button>

                      {showDomainSolutions && (
                        <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#0f172a', color: '#86efac', fontFamily: "'Fira Code', monospace", fontSize: '0.88rem', lineHeight: 1.75 }}>
                          {currentDomainExercise.solutionFormulas.map((sol, sIdx) => (
                            <div key={sIdx} style={{ marginBottom: sIdx < currentDomainExercise.solutionFormulas.length - 1 ? '0.65rem' : 0 }}>
                              <div style={{ color: '#38bdf8', fontWeight: 700 }}>• {sol.label}: <span style={{ color: '#86efac' }}>{sol.formula}</span></div>
                              <div style={{ color: '#cbd5e1', fontSize: '0.82rem', fontFamily: 'sans-serif', paddingLeft: '1rem' }}>→ {sol.note}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <button className="btn" onClick={() => onToggleProgress(activeSec.id)}
                      style={{ 
                          background: userProgress.includes(activeSec.id) ? '#ecfdf5' : 'white', 
                          color: userProgress.includes(activeSec.id) ? '#059669' : 'var(--text-main)',
                          border: `2px solid ${userProgress.includes(activeSec.id) ? '#10b981' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', fontWeight: 600, fontSize: '1.1rem', borderRadius: '1rem', transition: 'all 0.2s', cursor: 'pointer'
                      }}
                  >
                      {userProgress.includes(activeSec.id) ? <CheckCircle2 size={24} /> : <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid currentColor' }} />}
                      {user.progress?.includes(activeSec.id) ? 'Đã Học & Thực hành xong' : 'Đánh dấu Đã hoàn thành'}
                  </button>
                  {activeChap && canStartActiveLevelQuiz ? (
                    <button className="btn btn-primary" onClick={onGoToQuiz} style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={20} /> Làm bài thi {LevelLabels[activeChap.level]} ({activeDomainMeta.shortName}) →
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- INTERACTIVE FORMULA LAB VIEW ---
const FormulaLabView = ({
  initialDomain = 'accounting',
  initialLevel = 'Basic',
  onSelectDomain,
}: {
  initialDomain?: PracticeDomain;
  initialLevel?: Level;
  onSelectDomain?: (domain: PracticeDomain) => void;
}) => {
  const [selectedDomain, setSelectedDomain] = useState<PracticeDomain>(initialDomain);
  const [selectedLevel, setSelectedLevel] = useState<Level>(initialLevel);
  const [activeExerciseId, setActiveExerciseId] = useState<string>('');
  const [formulaInput, setFormulaInput] = useState<string>('=');
  const [hintStep, setHintStep] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [labSearch, setLabSearch] = useState<string>('');
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hiras_formula_lab_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setSelectedDomain(initialDomain);
    setSelectedLevel(initialLevel);
  }, [initialDomain, initialLevel]);

  const normalizedLabSearch = labSearch.trim().toLocaleLowerCase('vi-VN');

  const filteredExercises = FORMULA_LAB_EXERCISES.filter((ex) => {
    if (normalizedLabSearch) {
      return (
        ex.domain === selectedDomain &&
        (ex.title.toLocaleLowerCase('vi-VN').includes(normalizedLabSearch) ||
          ex.businessContext.toLocaleLowerCase('vi-VN').includes(normalizedLabSearch) ||
          ex.taskPrompt.toLocaleLowerCase('vi-VN').includes(normalizedLabSearch) ||
          ex.acceptedFormulas.some((f) => f.toLocaleLowerCase('vi-VN').includes(normalizedLabSearch)))
      );
    }
    return ex.domain === selectedDomain && ex.level === selectedLevel;
  });

  const activeExercise: FormulaExercise =
    filteredExercises.find((ex) => ex.id === activeExerciseId) ||
    filteredExercises[0] ||
    FORMULA_LAB_EXERCISES.find((ex) => ex.domain === selectedDomain) ||
    FORMULA_LAB_EXERCISES[0];

  useEffect(() => {
    if (activeExercise) {
      setActiveExerciseId(activeExercise.id);
      setFormulaInput('=');
      setHintStep(0);
      setShowSolution(false);
      setEvaluation(null);
    }
  }, [selectedDomain, selectedLevel, activeExercise?.id]);

  const handleCheckFormula = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = evaluateFormulaSubmission(formulaInput, activeExercise);
    setEvaluation(res);
    if (res.isCorrect) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      if (!completedIds.includes(activeExercise.id)) {
        const nextCompleted = [...completedIds, activeExercise.id];
        setCompletedIds(nextCompleted);
        localStorage.setItem('hiras_formula_lab_completed', JSON.stringify(nextCompleted));
      }
    }
  };

  const domainMeta = PRACTICE_DOMAINS[selectedDomain];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: domainMeta.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            ⚡ PHÒNG LAB CÔNG THỨC — NHÁNH XUYÊN SUỐT: {domainMeta.name.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '2.25rem', margin: 0 }}>Mô phỏng Bảng tính Excel ({domainMeta.shortName})</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: 0 }}>
            Thực hành gõ công thức từ Cơ bản đến Nâng cao theo nhánh <strong>{domainMeta.name}</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={labSearch}
              onChange={(e) => setLabSearch(e.target.value)}
              placeholder={`Tìm hàm / bài Lab trong ${domainMeta.shortName}...`}
              style={{
                width: '100%',
                padding: '0.7rem 2rem 0.7rem 2.35rem',
                borderRadius: '0.75rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: 'white',
              }}
            />
            {labSearch && (
              <button
                onClick={() => setLabSearch('')}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 800 }}
              >
                ✕
              </button>
            )}
          </div>
          <div className="glass-card" style={{ padding: '0.75rem 1.2rem', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>Đã hoàn thành</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
              {completedIds.length} / {FORMULA_LAB_EXERCISES.length} bài Lab
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {DOMAIN_LIST.map((dom) => {
          const isSelected = dom.id === selectedDomain;
          return (
            <button
              key={dom.id}
              onClick={() => {
                setSelectedDomain(dom.id);
                if (onSelectDomain) onSelectDomain(dom.id);
              }}
              className="glass-card"
              style={{
                padding: '1.1rem 1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                border: isSelected ? `2.5px solid ${dom.color}` : '1px solid var(--border)',
                background: isSelected ? `${dom.color}10` : 'white',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{dom.badge}</span>
                {isSelected && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px', background: dom.color, color: 'white' }}>
                    NHÁNH ĐANG CHỌN
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.02rem', color: isSelected ? dom.color : '#0f172a' }}>{dom.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem', lineHeight: 1.4 }}>{dom.description}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(['Basic', 'Intermediate', 'Advanced'] as Level[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setLabSearch('');
              }}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.75rem',
                border: !normalizedLabSearch && selectedLevel === lvl ? `2px solid ${domainMeta.color}` : '1px solid #cbd5e1',
                background: !normalizedLabSearch && selectedLevel === lvl ? domainMeta.color : 'white',
                color: !normalizedLabSearch && selectedLevel === lvl ? 'white' : '#334155',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cấp độ: {LevelLabels[lvl]}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {filteredExercises.map((ex, idx) => {
            const isDone = completedIds.includes(ex.id);
            const isActive = ex.id === activeExercise.id;
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseId(ex.id)}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '0.75rem',
                  border: isActive ? '2px solid #0f172a' : '1px solid #cbd5e1',
                  background: isActive ? '#0f172a' : isDone ? '#ecfdf5' : 'white',
                  color: isActive ? 'white' : isDone ? '#059669' : '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {isDone && <CheckCircle2 size={16} />}
                <span>Bài #{idx + 1}: {ex.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', borderTop: `5px solid ${domainMeta.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: domainMeta.color, textTransform: 'uppercase' }}>
              {domainMeta.badge} {domainMeta.name} • {LevelLabels[activeExercise.level]}
            </span>
            <h2 style={{ fontSize: '1.6rem', margin: '0.3rem 0 0 0' }}>{activeExercise.title}</h2>
          </div>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '0.65rem', background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', fontWeight: 800, fontSize: '0.9rem' }}>
            🎯 Ô cần lập công thức: <code>{activeExercise.targetCell}</code> ({activeExercise.headers[activeExercise.targetColumnIndex] || activeExercise.targetCell})
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              📌 BỐI CẢNH NGHIỆP VỤ
            </div>
            <div style={{ color: '#1e293b', lineHeight: 1.6, fontSize: '0.95rem' }}>{activeExercise.businessContext}</div>
          </div>
          <div style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              📝 YÊU CẦU CÔNG THỨC TẠI Ô {activeExercise.targetCell}
            </div>
            <div style={{ color: '#1e3a8a', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 600 }}>{activeExercise.taskPrompt}</div>
          </div>
        </div>

        <form onSubmit={handleCheckFormula} style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              border: '2px solid #94a3b8',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              style={{
                padding: '0.85rem 1.1rem',
                background: '#e2e8f0',
                fontWeight: 800,
                color: '#1e293b',
                borderRight: '1px solid #cbd5e1',
                fontFamily: "'Fira Code', monospace",
                minWidth: '70px',
                textAlign: 'center',
              }}
            >
              {activeExercise.targetCell}
            </div>
            <div
              style={{
                padding: '0.85rem 0.9rem',
                color: '#0f766e',
                fontWeight: 900,
                fontStyle: 'italic',
                fontFamily: 'serif',
                fontSize: '1.15rem',
                borderRight: '1px solid #cbd5e1',
                background: '#f8fafc',
              }}
            >
              fx
            </div>
            <input
              type="text"
              value={formulaInput}
              onChange={(e) => setFormulaInput(e.target.value)}
              placeholder="Gõ công thức Excel tại đây (VD: =SUMIFS(E2:E5, B2:B5, ...))"
              style={{
                flex: 1,
                padding: '0.85rem 1rem',
                border: 'none',
                outline: 'none',
                fontSize: '1.02rem',
                fontFamily: "'Fira Code', monospace",
                fontWeight: 600,
                color: '#0f172a',
                background: 'white',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                borderRadius: 0,
                padding: '0.9rem 1.75rem',
                fontWeight: 800,
                background: domainMeta.color,
              }}
            >
              Kiểm tra Công thức ✓
            </button>
          </div>
        </form>

        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.15rem 1.5rem',
              borderRadius: '0.85rem',
              marginBottom: '1.5rem',
              background: evaluation.isCorrect ? '#ecfdf5' : '#fef2f2',
              border: `2px solid ${evaluation.isCorrect ? '#10b981' : '#ef4444'}`,
              color: evaluation.isCorrect ? '#065f46' : '#991b1b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.02rem', marginBottom: '0.35rem' }}>
              {evaluation.isCorrect ? <CheckCircle2 size={20} color="#059669" /> : <AlertCircle size={20} color="#dc2626" />}
              <span>
                {evaluation.isCorrect
                  ? `Chính xác! Kết quả trả về tại ô ${activeExercise.targetCell}: ${activeExercise.expectedDisplayValue}`
                  : 'Công thức chưa chính xác — Phát hiện bẫy hoặc lỗi cú pháp:'}
              </span>
            </div>
            <div style={{ lineHeight: 1.65, fontSize: '0.95rem' }}>{evaluation.feedback}</div>
          </motion.div>
        )}

        <div style={{ borderRadius: '0.85rem', overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '1.5rem' }}>
          <div style={{ background: '#1e293b', color: 'white', padding: '0.6rem 1rem', fontSize: '0.82rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            <span>📊 BẢNG TÍNH MÔ PHỎNG EXCEL (Dòng 1 là tiêu đề cột, Dòng 2 trở đi là dữ liệu)</span>
            <span>Kết quả kỳ vọng tại {activeExercise.targetCell}: <strong style={{ color: '#86efac' }}>{activeExercise.expectedDisplayValue}</strong></span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#e2e8f0', color: '#334155' }}>
                  <th style={{ padding: '0.4rem 0.65rem', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', width: '42px', textAlign: 'center' }}>#</th>
                  {activeExercise.headers.map((_, colIdx) => (
                    <th key={colIdx} style={{ padding: '0.4rem 0.85rem', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800 }}>
                      {String.fromCharCode(65 + colIdx)}
                    </th>
                  ))}
                </tr>
                <tr style={{ background: '#0f766e', color: 'white' }}>
                  <td style={{ padding: '0.5rem 0.65rem', background: '#e2e8f0', color: '#475569', fontWeight: 800, textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>1</td>
                  {activeExercise.headers.map((header, colIdx) => (
                    <th key={colIdx} style={{ padding: '0.55rem 0.85rem', textAlign: 'left', fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                      {header.replace(/\s*\([A-Z]+\)$/, '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeExercise.rows.map((row, rIdx) => {
                  const excelRowNumber = rIdx + 2;
                  return (
                    <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'white' : '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.5rem 0.65rem', background: '#f1f5f9', color: '#64748b', fontWeight: 800, textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                        {excelRowNumber}
                      </td>
                      {row.map((cell, cIdx) => {
                        const cellCoord = `${String.fromCharCode(65 + cIdx)}${excelRowNumber}`;
                        const isTargetCell = cellCoord.toUpperCase() === activeExercise.targetCell.toUpperCase() || cell.includes('?');
                        return (
                          <td
                            key={cIdx}
                            style={{
                              padding: '0.55rem 0.85rem',
                              borderRight: '1px solid #e2e8f0',
                              border: isTargetCell ? `2px solid ${evaluation?.isCorrect ? '#10b981' : domainMeta.color}` : undefined,
                              background: isTargetCell ? (evaluation?.isCorrect ? '#dcfce7' : '#fef9c3') : 'transparent',
                              fontWeight: isTargetCell ? 800 : 500,
                              color: isTargetCell ? '#0f172a' : '#334155',
                              fontFamily: isTargetCell || /^=|^\d/.test(cell) ? "'Fira Code', monospace" : 'inherit',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isTargetCell
                              ? evaluation?.isCorrect
                                ? `✅ ${activeExercise.expectedDisplayValue}`
                                : formulaInput.length > 1
                                  ? formulaInput
                                  : `🎯 [${activeExercise.targetCell}] Nhập công thức`
                              : cell}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setHintStep((prev) => Math.min(activeExercise.hints.length, prev + 1))}
            className="btn"
            style={{ border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, padding: '0.6rem 1.2rem' }}
          >
            💡 Xem gợi ý ({hintStep}/{activeExercise.hints.length})
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((prev) => !prev)}
            className="btn"
            style={{ border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, padding: '0.6rem 1.2rem' }}
          >
            {showSolution ? 'Ẩn công thức mẫu ▲' : '🔑 Xem công thức chuẩn ▼'}
          </button>
          {showSolution && (
            <button
              type="button"
              onClick={() => setFormulaInput(activeExercise.acceptedFormulas[0])}
              className="btn"
              style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700, padding: '0.6rem 1.2rem' }}
            >
              Chép công thức mẫu vào thanh fx
            </button>
          )}
        </div>

        {hintStep > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#b45309', marginBottom: '0.4rem' }}>💡 GỢI Ý TỪNG BƯỚC:</div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350f', lineHeight: 1.7 }}>
              {activeExercise.hints.slice(0, hintStep).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {showSolution && (
          <div style={{ marginTop: '1rem', padding: '1.15rem 1.4rem', borderRadius: '0.75rem', background: '#0f172a', color: '#f8fafc' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              ✅ CÔNG THỨC CHUẨN ĐƯỢC CHẤP NHẬN:
            </div>
            <div style={{ fontFamily: "'Fira Code', monospace", color: '#86efac', fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              {activeExercise.acceptedFormulas.join('   hoặc   ')}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>{activeExercise.explanation}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const NUM_QUESTIONS: Record<Level, number> = { 'Basic': 10, 'Intermediate': 20, 'Advanced': 30 };

const getQuestionTopicKey = (question: Question) =>
  (question.topic || normalizeQuestionTitle(question.text)).normalize('NFC').toLocaleLowerCase('vi-VN');

const getQuestionBankStats = (level: Level) => {
  const questions = EXCEL_QUESTIONS[level];
  const topicKeys = new Set(questions.map(getQuestionTopicKey));
  const exactKeys = new Set(
    questions.map((question) =>
      [
        question.text.normalize('NFC'),
        (question.scenario || '').normalize('NFC'),
        question.options[question.correct]?.normalize('NFC') || '',
      ].join('|'),
    ),
  );

  return {
    total: questions.length,
    topics: topicKeys.size,
    exactDuplicates: questions.length - exactKeys.size,
    perTest: NUM_QUESTIONS[level],
  };
};

const shuffleArray = <T,>(items: T[]): T[] => {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
};

type QuizSessionState = {
  version: 2;
  questions: Question[];
  createdAt: string;
};

const buildQuizQuestions = (level: Level, domainFilter: PracticeDomain | 'all' = 'all'): Question[] => {
  const levelPool = EXCEL_QUESTIONS[level];
  const filteredPool =
    domainFilter === 'all'
      ? levelPool
      : levelPool.filter((q) => q.domain === domainFilter);
  const shuffledPool = shuffleArray(filteredPool.length > 0 ? filteredPool : levelPool);
  const uniqueQuestions: Question[] = [];
  const seenTopics = new Set<string>();

  for (const question of shuffledPool) {
    const baseTopic = getQuestionTopicKey(question);
    if (seenTopics.has(baseTopic)) continue;
    seenTopics.add(baseTopic);
    uniqueQuestions.push(question);
    if (uniqueQuestions.length >= NUM_QUESTIONS[level]) break;
  }

  while (uniqueQuestions.length < NUM_QUESTIONS[level] && uniqueQuestions.length < shuffledPool.length) {
    const remaining = shuffledPool.find((question) => !uniqueQuestions.includes(question));
    if (!remaining) break;
    uniqueQuestions.push(remaining);
  }

  return uniqueQuestions.map((question) => {
    const correctText = question.options[question.correct];
    const randomizedOptions = shuffleArray(question.options);
    return {
      ...question,
      scenario: question.scenario,
      options: randomizedOptions,
      correct: randomizedOptions.indexOf(correctText),
    };
  });
};

const Quiz = ({
  userId,
  level,
  domainFilter = 'all',
  onPersistResult,
  onExit,
  onCancel,
  timeLimitMinutes,
}: {
  userId: string;
  level: Level;
  domainFilter?: PracticeDomain | 'all';
  onPersistResult: (score: number, timeTaken: number) => Promise<void>;
  onExit: () => void;
  onCancel: (penalty: boolean) => void;
  timeLimitMinutes: number;
}) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isBlurred, setIsBlurred] = useState(false);
  const [violations, setViolations] = useState(0);
  const [didLockOut, setDidLockOut] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const persistedResultRef = useRef(false);

  useEffect(() => {
    const handleBlur = () => {
      setIsBlurred(true);
      setViolations(v => v + 1);
    };
    const handleFocus = () => setIsBlurred(false);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (didLockOut || violations <= 2) return;
    setDidLockOut(true);
    const lockDays = DB.lockUser(userId, level);
    alert(`Cảnh báo vi phạm: Bạn đã thoát bài thi hoặc chuyển tab quá 2 lần. Bài thi sẽ bị khóa trong ${lockDays} ngày.`);
    onCancel(true);
  }, [didLockOut, level, onCancel, userId, violations]);

  useEffect(() => {
    const sessionKey = getQuizSessionKey(userId, level, domainFilter);
    const savedSession = localStorage.getItem(sessionKey);

    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as QuizSessionState | Question[];
        const restoredQuestions = Array.isArray(parsed) ? parsed : parsed.questions;
        if (Array.isArray(restoredQuestions) && restoredQuestions.length > 0) {
          setShuffledQuestions(restoredQuestions);
          return;
        }
      } catch (error) {
        console.error('Failed to restore quiz session', error);
        localStorage.removeItem(sessionKey);
      }
    }

    const qs = buildQuizQuestions(level, domainFilter);
    setShuffledQuestions(qs);
    const sessionState: QuizSessionState = {
      version: 2,
      questions: qs,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionState));
  }, [domainFilter, level, userId]);

  useEffect(() => {
    if (showResult || timeLeft <= 0 || shuffledQuestions.length === 0) return;
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [showResult, timeLeft, shuffledQuestions.length]);

  useEffect(() => {
    if (timeLeft <= 0 && !showResult && shuffledQuestions.length > 0) {
      let finalScore = 0;
      shuffledQuestions.forEach((q, idx) => { if (answers[idx] === q.correct) finalScore++; });
      setScore(finalScore); setShowResult(true);
      void persistResult(finalScore, timeLimitMinutes * 60);
    }
  }, [timeLeft, showResult, shuffledQuestions, answers]);

  useEffect(() => {
    if (showResult && score >= shuffledQuestions.length * 0.8) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [showResult, score, shuffledQuestions.length]);

  const persistResult = async (finalScore: number, timeTaken: number) => {
    if (persistedResultRef.current) return;
    persistedResultRef.current = true;
    setIsSavingResult(true);
    try {
      await onPersistResult(finalScore, timeTaken);
    } catch (error) {
      console.error('Failed to persist quiz result', error);
      persistedResultRef.current = false;
      window.alert('Không lưu được kết quả bài thi. Vui lòng thử lại.');
    } finally {
      setIsSavingResult(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = Math.max(0, shuffledQuestions.length - answeredCount);

  const handleSubmit = () => {
    const confirmMessage = unansweredCount > 0
      ? `Bạn còn ${unansweredCount} câu hỏi CHƯA CHỌN ĐÁP ÁN!\nBạn có chắc chắn muốn nộp bài bây giờ không?`
      : 'Bạn có chắc chắn muốn nộp bài sát hạch?';

    if (window.confirm(confirmMessage)) {
      let finalScore = 0;
      shuffledQuestions.forEach((q, idx) => { if (answers[idx] === q.correct) finalScore++; });
      setScore(finalScore); setShowResult(true);
      void persistResult(finalScore, timeLimitMinutes * 60 - timeLeft);
    }
  };

  const handleAnswer = (index: number) => setAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  const toggleFlag = () => setFlaggedQuestions(prev => ({ ...prev, [currentQuestion]: !prev[currentQuestion] }));
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (shuffledQuestions.length === 0) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
      Đang tải bộ câu hỏi...
    </motion.div>
  );

  if (showResult && !showReview) {
    const passed = score >= shuffledQuestions.length * 0.8;
    const pct = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ background: passed ? 'var(--primary)' : 'orange', color: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          {passed ? <CheckCircle2 size={40} /> : <Award size={40} />}
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{passed ? 'Đạt Yêu Cầu!' : 'Cần Ôn Tập Thêm!'}</h2>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: passed ? 'var(--primary)' : 'orange', marginBottom: '0.5rem' }}>{pct}%</div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Trả lời đúng <strong>{score}/{shuffledQuestions.length}</strong> câu — Cấp độ: {LevelLabels[level]}</p>
        {isSavingResult && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Đang lưu kết quả...</p>}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onExit} disabled={isSavingResult}>Xem hồ sơ kết quả</button>
          <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setShowReview(true)} disabled={isSavingResult}>Xem lại đáp án & Giải thích</button>
        </div>
      </motion.div>
    );
  }

  if (showReview) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2rem 0', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Phân tích Kết quả Bài thi</h2>
          <button className="btn btn-primary" onClick={onExit} disabled={isSavingResult}>Đóng Review →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {shuffledQuestions.map((q, idx) => {
            const userAns = answers[idx]; const isCorrect = userAns === q.correct;
            return (
              <div key={idx} className="glass-card" style={{ padding: '2rem', borderLeft: `6px solid ${isCorrect ? 'var(--primary)' : '#ef4444'}` }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isCorrect ? 'var(--primary)' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{idx + 1}</div>
                   <h4 style={{ fontSize: '1.15rem', lineHeight: '1.4' }}>{getQuizDisplayTitle(q.text)}</h4>
                </div>
                {q.scenario && (
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                     <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tình huống/Dữ liệu nguồn:</div>
                     <QuizScenarioDetails question={q} level={level} />
                  </div>
                )}
                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {q.options.map((opt: string, i: number) => {
                    let border = '1px solid var(--border)'; let bg = 'white'; let icon = null;
                    if (i === q.correct) { border = '2px solid var(--primary)'; bg = '#ecfdf5'; icon = <CheckCircle2 size={18} color="var(--primary)" />; }
                    else if (i === userAns) { border = '2px solid #ef4444'; bg = '#fef2f2'; icon = <AlertCircle size={18} color="#ef4444" />; }
                    return (
                      <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', border, background: bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: i === q.correct || i === userAns ? 600 : 400 }}>{String.fromCharCode(65 + i)}. {opt}</span>
                        {icon}
                      </div>
                    );
                  })}
                </div>
                <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#1e40af', fontWeight: 700 }}><Zap size={18} /> GIẢI THÍCH CHI TIẾT</div>
                  <div style={{ color: '#1e3a8a', lineHeight: '1.6' }}>{q.explanation}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} onClick={onExit} disabled={isSavingResult}>Kết thúc xem lại</button>
      </motion.div>
    );
  }

  const q = shuffledQuestions[currentQuestion];
  const isCurrentFlagged = Boolean(flaggedQuestions[currentQuestion]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`glass-card quiz-container-secure ${isBlurred ? 'is-blurred' : ''}`}
      style={{ padding: '2.5rem', maxWidth: '880px', margin: '2rem auto', userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
      onCopy={(e: any) => e.preventDefault()}
      onContextMenu={(e: any) => e.preventDefault()}
    >
      {/* Header làm bài & Timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1.35rem' }}>Câu hỏi {currentQuestion + 1} / {shuffledQuestions.length}</h3>
          <button
            onClick={toggleFlag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.55rem',
              border: isCurrentFlagged ? '1.5px solid #f59e0b' : '1px solid #cbd5e1',
              background: isCurrentFlagged ? '#fef3c7' : 'white',
              color: isCurrentFlagged ? '#b45309' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Flag size={14} fill={isCurrentFlagged ? '#f59e0b' : 'none'} color={isCurrentFlagged ? '#f59e0b' : '#64748b'} />
            <span>{isCurrentFlagged ? 'Đang phân vân (🚩)' : 'Đánh dấu phân vân'}</span>
          </button>
        </div>
        <div style={{ background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--primary)" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Navigator (1..N) */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.85rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>BẢNG ĐIỀU HƯỚNG CÂU HỎI (Bấm số để nhảy câu)</span>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <span style={{ color: '#166534' }}>✓ Đã làm: {answeredCount}/{shuffledQuestions.length}</span>
            <span style={{ color: '#b45309' }}>🚩 Phân vân: {flaggedCount}</span>
            <span style={{ color: '#64748b' }}>○ Chưa làm: {unansweredCount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {shuffledQuestions.map((_, idx) => {
            const isAns = answers[idx] !== undefined;
            const isFlg = Boolean(flaggedQuestions[idx]);
            const isCur = idx === currentQuestion;

            let bg = '#ffffff';
            let color = '#475569';
            let border = '1px solid #cbd5e1';

            if (isCur) {
              border = '2px solid #0f172a';
            }
            if (isFlg) {
              bg = '#fef3c7';
              color = '#b45309';
              border = isCur ? '2px solid #b45309' : '1px solid #f59e0b';
            } else if (isAns) {
              bg = '#dcfce7';
              color = '#166534';
              border = isCur ? '2px solid #166534' : '1px solid #86efac';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.45rem',
                  border,
                  background: bg,
                  color,
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  boxShadow: isCur ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                }}
                title={`Câu ${idx + 1}${isFlg ? ' (Đang phân vân)' : ''}${isAns ? ' (Đã chọn đáp án)' : ' (Chưa làm)'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
      
      {q.scenario && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 700 }}>
            <Database size={20} /> TÌNH HUỐNG / DỮ LIỆU NGUỒN:
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <QuizScenarioDetails question={q} level={level} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {q.options.map((opt: string, i: number) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(i)} 
            style={{ 
              padding: '1.25rem', borderRadius: '0.75rem', textAlign: 'left', 
              background: answers[currentQuestion] === i ? '#eff6ff' : 'white', 
              border: answers[currentQuestion] === i ? '2px solid var(--primary)' : '1px solid var(--border)', 
              cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.05rem',
              display: 'flex', gap: '1rem', alignItems: 'center',
              boxShadow: answers[currentQuestion] === i ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: answers[currentQuestion] === i ? 'var(--primary)' : '#f1f5f9', color: answers[currentQuestion] === i ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              {String.fromCharCode(65 + i)}
            </div>
            <span style={{ fontWeight: answers[currentQuestion] === i ? 600 : 400 }}>{opt}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(c => c - 1)} style={{ padding: '0.75rem 2rem' }}>← Quay lại</button>
        {currentQuestion < shuffledQuestions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrentQuestion(c => c + 1)} style={{ padding: '0.75rem 3rem' }}>Tiếp theo →</button>
        ) : (
          <button className="btn btn-primary" style={{ background: '#10b981', padding: '0.75rem 3rem' }} onClick={handleSubmit}>Nộp bài ✓</button>
        )}
      </div>
    </motion.div>
  );
};

const CertificateModal = ({
  user,
  domain,
  domResults,
  systemName,
  onClose,
}: {
  user: User;
  domain: PracticeDomain;
  domResults: QuizResult[];
  systemName: string;
  onClose: () => void;
}) => {
  const domMeta = PRACTICE_DOMAINS[domain];
  const levels: Level[] = ['Basic', 'Intermediate', 'Advanced'];
  const bestByLevel = levels.map((lvl) => {
    const best = domResults
      .filter((r) => r.level === lvl)
      .sort((a, b) => b.score - a.score || (a.timeTaken || 0) - (b.timeTaken || 0))[0];
    const total = NUM_QUESTIONS[lvl];
    return {
      level: lvl,
      score: best?.score || 0,
      total,
      pct: best ? Math.round((best.score / total) * 100) : 0,
      date: best?.date,
    };
  });

  const totalScore = bestByLevel.reduce((acc, item) => acc + item.score, 0);
  const totalPossible = bestByLevel.reduce((acc, item) => acc + item.total, 0);
  const overallPct = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
  const issueDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());
  const certCode = `CERT-${domain.toUpperCase()}-${user.id.toUpperCase()}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '820px',
          width: '100%',
          padding: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div
          style={{
            border: `4px double ${domMeta.color}`,
            borderRadius: '0.9rem',
            padding: '2.75rem 2.5rem',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 35%, #f0fdf4 100%)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: '999px', background: '#064e3b', color: '#fde68a', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <GraduationCap size={18} /> {systemName || 'Excel Academy'}
          </div>

          <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Chứng Nhận Hoàn Thành Chuyên Ngành
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.75rem 0' }}>
            Ghi nhận năng lực ứng dụng công thức & xử lý dữ liệu bảng tính chuyên sâu
          </p>

          <div style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '0.35rem' }}>Trân trọng trao tặng học viên:</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#059669', marginBottom: '0.25rem' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginBottom: '1.5rem' }}>
            Mã định danh: <code>{user.id}</code>
          </div>

          <p style={{ color: '#334155', fontSize: '1rem', maxWidth: '620px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
            Đã hoàn thành xuất sắc toàn bộ <strong>3/3 cấp độ Sát hạch (Cơ bản • Trung cấp • Nâng cao)</strong> thuộc nhánh nghiệp vụ xuyên suốt:
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 1.5rem',
              borderRadius: '0.85rem',
              background: `${domMeta.color}15`,
              border: `2px solid ${domMeta.color}`,
              color: domMeta.color,
              fontWeight: 900,
              fontSize: '1.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <span>{domMeta.badge}</span>
            <span>Chuyên ngành: {domMeta.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', maxWidth: '680px', margin: '0 auto 2rem' }}>
            {bestByLevel.map((item) => (
              <div key={item.level} style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '0.65rem', padding: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Cấp {LevelLabels[item.level]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                  {item.score}/{item.total} ({item.pct}%)
                </div>
              </div>
            ))}
            <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '0.65rem', padding: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 800 }}>Tổng kết Nhánh</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
                Đạt {overallPct}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', fontSize: '0.84rem', color: '#475569', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div>Mã chứng nhận: <strong>{certCode}</strong></div>
              <div>Ngày cấp: <strong>{issueDate}</strong></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#064e3b' }}>HỘI ĐỒNG ĐÀO TẠO & SÁT HẠCH</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Xác thực điện tử trên hệ thống {systemName}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#059669', padding: '0.65rem 1.35rem' }}
          >
            <Printer size={17} /> In / Lưu PDF Chứng nhận
          </button>
          <button onClick={onClose} className="btn" style={{ border: '1px solid #cbd5e1', padding: '0.65rem 1.25rem' }}>
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfileView = ({
  user,
  stats,
  activeDomain,
  systemName,
  onSelectDomain,
}: {
  user: User;
  stats: QuizResult[];
  activeDomain: PracticeDomain;
  systemName: string;
  onSelectDomain: (dom: PracticeDomain) => void;
}) => {
  const [certDomain, setCertDomain] = useState<PracticeDomain | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '3.5rem 0' }}>
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.85rem', fontWeight: 800 }}>
              {user.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{user.name}</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Mã NV: <strong>{user.id}</strong> • Nhánh đang theo học xuyên suốt:{' '}
                <strong style={{ color: PRACTICE_DOMAINS[activeDomain].color }}>
                  {PRACTICE_DOMAINS[activeDomain].badge} {PRACTICE_DOMAINS[activeDomain].name}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '0.6rem', fontSize: '1.25rem' }}>
          🎯 Lộ Trình & Chứng Nhận Từng Nhánh Chuyên Ngành (4 Nhánh)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          Hoàn thành đạt ≥ 80% đủ 3 cấp độ (Cơ bản → Trung cấp → Nâng cao) của nhánh nào sẽ được cấp <strong>Chứng nhận Hoàn thành Chuyên ngành</strong> của nhánh đó trước khi chuyển sang chinh phục nhánh tiếp theo.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {DOMAIN_LIST.map((dom) => {
            const isCurrent = dom.id === activeDomain;
            const domResults = stats.filter((s) => (s.domain || 'accounting') === dom.id);
            const levels: Level[] = ['Basic', 'Intermediate', 'Advanced'];
            const passedLevels = levels.filter((lvl) =>
              domResults.some((r) => r.level === lvl && r.score >= NUM_QUESTIONS[lvl] * 0.8)
            );
            const isBranchCompleted = passedLevels.length === 3;

            return (
              <div
                key={dom.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  border: isCurrent ? `2.5px solid ${dom.color}` : '1px solid var(--border)',
                  background: isBranchCompleted ? '#f0fdf4' : isCurrent ? `${dom.color}08` : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{dom.badge}</span>
                    {isBranchCompleted ? (
                      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', background: '#16a34a', color: 'white', fontSize: '0.72rem', fontWeight: 800 }}>
                        🏆 ĐÃ HOÀN THÀNH NHÁNH
                      </span>
                    ) : isCurrent ? (
                      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', background: dom.color, color: 'white', fontSize: '0.72rem', fontWeight: 800 }}>
                        ĐANG THEO HỌC
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                        {passedLevels.length}/3 cấp độ
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.08rem', color: dom.color, marginBottom: '0.75rem' }}>
                    {dom.name}
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem', marginBottom: '1.25rem' }}>
                    {levels.map((lvl) => {
                      const lvlRes = domResults
                        .filter((r) => r.level === lvl)
                        .sort((a, b) => b.score - a.score || (a.timeTaken || 0) - (b.timeTaken || 0))[0];
                      const total = NUM_QUESTIONS[lvl];
                      const passed = lvlRes && lvlRes.score >= total * 0.8;
                      return (
                        <div
                          key={lvl}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.45rem 0.7rem',
                            borderRadius: '0.5rem',
                            background: passed ? '#dcfce7' : '#f8fafc',
                            fontSize: '0.84rem',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: passed ? '#166534' : '#475569' }}>
                            {passed ? '✓ ' : '○ '}Excel {LevelLabels[lvl]}
                          </span>
                          <strong style={{ color: passed ? '#15803d' : '#64748b' }}>
                            {lvlRes ? `${lvlRes.score}/${total} điểm` : 'Chưa thi'}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(isBranchCompleted || user.role === 'admin') && (
                    <button
                      onClick={() => setCertDomain(dom.id)}
                      className="btn"
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
                        color: '#fde68a',
                        border: 'none',
                      }}
                    >
                      🎓 Xem & In Chứng Nhận Nhánh
                    </button>
                  )}
                  <button
                    onClick={() => onSelectDomain(dom.id)}
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: isCurrent ? dom.color : '#f1f5f9',
                      color: isCurrent ? 'white' : '#334155',
                    }}
                  >
                    {isCurrent ? '✓ Đang là nhánh xuyên suốt' : 'Chọn học nhánh này →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {certDomain && (
        <CertificateModal
          user={user}
          domain={certDomain}
          domResults={stats.filter((s) => (s.domain || 'accounting') === certDomain)}
          systemName={systemName}
          onClose={() => setCertDomain(null)}
        />
      )}
    </motion.div>
  );
};

const Leaderboard = ({ currentUserId }: { currentUserId: string }) => {
  const [selectedBranch, setSelectedBranch] = useState<'all' | PracticeDomain>('all');
  const [ranked, setRanked] = useState<any[]>([]);

  useEffect(() => {
    const allUsers = DB.getUsers().filter((u) => u.role === 'admin' || !u.status || u.status === 'approved');
    const allResults = DB.getResults();
    const levels: Level[] = ['Basic', 'Intermediate', 'Advanced'];
    const singleBranchMax = NUM_QUESTIONS['Basic'] + NUM_QUESTIONS['Intermediate'] + NUM_QUESTIONS['Advanced'];

    const list = allUsers
      .map((u) => {
        const uRes = allResults.filter((r) => r.userId === u.id);

        // Tính số nhánh đã hoàn thành (3/3 cấp độ đạt >= 80%)
        const completedBranches = DOMAIN_LIST.filter((dom) => {
          const domRes = uRes.filter((r) => (r.domain || 'accounting') === dom.id);
          return levels.every((lvl) =>
            domRes.some((r) => r.level === lvl && r.score >= NUM_QUESTIONS[lvl] * 0.8)
          );
        });

        const scopedRes =
          selectedBranch === 'all'
            ? uRes
            : uRes.filter((r) => (r.domain || 'accounting') === selectedBranch);

        const bScore = Math.max(0, ...scopedRes.filter((r) => r.level === 'Basic').map((r) => r.score));
        const iScore = Math.max(0, ...scopedRes.filter((r) => r.level === 'Intermediate').map((r) => r.score));
        const aScore = Math.max(0, ...scopedRes.filter((r) => r.level === 'Advanced').map((r) => r.score));

        const bTime = scopedRes.filter((r) => r.level === 'Basic' && r.score === bScore).sort((a, b) => (a.timeTaken || 0) - (b.timeTaken || 0))[0]?.timeTaken || 0;
        const iTime = scopedRes.filter((r) => r.level === 'Intermediate' && r.score === iScore).sort((a, b) => (a.timeTaken || 0) - (b.timeTaken || 0))[0]?.timeTaken || 0;
        const aTime = scopedRes.filter((r) => r.level === 'Advanced' && r.score === aScore).sort((a, b) => (a.timeTaken || 0) - (b.timeTaken || 0))[0]?.timeTaken || 0;

        const totalScore = bScore + iScore + aScore;
        const totalTime = bTime + iTime + aTime;
        const lastSubmission = scopedRes.length > 0 ? Math.min(...scopedRes.map((r) => new Date(r.date).getTime())) : Infinity;

        return {
          u,
          totalScore,
          totalTime,
          lastSubmission,
          completedBranches,
          pct: Math.round((totalScore / singleBranchMax) * 100),
        };
      })
      .sort(
        (a, b) =>
          (selectedBranch === 'all' ? b.completedBranches.length - a.completedBranches.length : 0) ||
          b.totalScore - a.totalScore ||
          a.totalTime - b.totalTime ||
          a.lastSubmission - b.lastSubmission
      );

    setRanked(list);
  }, [selectedBranch]);

  return (
    <div className="container" style={{ padding: '3.5rem 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.6rem', fontSize: '2.2rem' }}>🏆 Bảng Xếp Hạng Năng Lực</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
        Vinh danh các học viên có số nhánh hoàn thành nhiều nhất và điểm sát hạch cao nhất theo từng mảng chuyên môn.
      </p>

      {/* Bộ lọc theo nhánh */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button
          onClick={() => setSelectedBranch('all')}
          className="btn"
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '999px',
            background: selectedBranch === 'all' ? '#0f172a' : 'white',
            color: selectedBranch === 'all' ? 'white' : '#334155',
            border: '1px solid #cbd5e1',
            fontWeight: 800,
            fontSize: '0.88rem',
          }}
        >
          🌐 Toàn Hệ Thống (4 Nhánh)
        </button>
        {DOMAIN_LIST.map((dom) => {
          const isSel = selectedBranch === dom.id;
          return (
            <button
              key={dom.id}
              onClick={() => setSelectedBranch(dom.id)}
              className="btn"
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '999px',
                background: isSel ? dom.color : 'white',
                color: isSel ? 'white' : '#334155',
                border: isSel ? `1.5px solid ${dom.color}` : '1px solid #cbd5e1',
                fontWeight: 800,
                fontSize: '0.88rem',
              }}
            >
              {dom.badge} Nhánh {dom.shortName}
            </button>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {ranked.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            key={item.u.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1.35rem 2rem',
              background: item.u.id === currentUserId ? 'linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%)' : 'white',
              borderBottom: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
              {idx === 0 ? <Trophy size={28} color="#fbbf24" /> :
               idx === 1 ? <Medal size={28} color="#94a3b8" /> :
               idx === 2 ? <Award size={28} color="#b45309" /> :
               <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{idx + 1}</span>}
            </div>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid var(--border)' }}>
              {item.u.name.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.08rem' }}>{item.u.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({item.u.id})</span>
                {item.completedBranches.length > 0 && (
                  <span style={{ padding: '0.18rem 0.6rem', borderRadius: '999px', background: '#dcfce7', color: '#166534', fontSize: '0.74rem', fontWeight: 800 }}>
                    🎓 Hoàn thành {item.completedBranches.length}/4 nhánh
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span><Zap size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {item.totalScore} điểm</span>
                <span>⏱ {Math.floor(item.totalTime / 60)}m {item.totalTime % 60}s</span>
                {item.completedBranches.length > 0 && (
                  <span style={{ display: 'inline-flex', gap: '0.3rem' }}>
                    {item.completedBranches.map((b: any) => (
                      <span key={b.id} title={`Đã hoàn thành nhánh ${b.name}`} style={{ fontSize: '0.82rem' }}>{b.badge}</span>
                    ))}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)' }}>{item.pct}%</div>
              <div style={{ width: '100px', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: 'var(--primary)' }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ onSystemNameUpdated }: { onSystemNameUpdated?: (name: string) => void }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [quizSettings, setQuizSettings] = useState<QuizSettings>(DB.getSettings());
    const [systemNameDraft, setSystemNameDraft] = useState<string>(DB.getSettings().systemName || 'Excel Academy');
    const [isSettingsDirty, setIsSettingsDirty] = useState(false);
    const isSettingsDirtyRef = useRef(false);
    const [quizTimeDrafts, setQuizTimeDrafts] = useState<Record<Level, string>>({
        Basic: String(DB.getSettings().timeLimit.Basic ?? 15),
        Intermediate: String(DB.getSettings().timeLimit.Intermediate ?? 30),
        Advanced: String(DB.getSettings().timeLimit.Advanced ?? 45),
    });
    const [newUserId, setNewUserId] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserError, setNewUserError] = useState('');

    const fetchData = async (forceSettingsRefresh = false) => {
        await DB.refresh();
        setUsers(DB.getUsers());
        setResults(DB.getResults());
        if (forceSettingsRefresh || !isSettingsDirtyRef.current) {
            const latestSettings = DB.getSettings();
            setQuizSettings(latestSettings);
            setSystemNameDraft(latestSettings.systemName || 'Excel Academy');
            if (onSystemNameUpdated && latestSettings.systemName) {
              onSystemNameUpdated(latestSettings.systemName);
            }
            setQuizTimeDrafts({
                Basic: String(latestSettings.timeLimit.Basic ?? 15),
                Intermediate: String(latestSettings.timeLimit.Intermediate ?? 30),
                Advanced: String(latestSettings.timeLimit.Advanced ?? 45),
            });
            setIsSettingsDirty(false);
        }
    };

    useEffect(() => {
        isSettingsDirtyRef.current = isSettingsDirty;
    }, [isSettingsDirty]);
    useEffect(() => {
        void fetchData(true);

        const handleWindowFocus = () => {
            void fetchData();
        };

        window.addEventListener('focus', handleWindowFocus);
        return () => {
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, []);

    const handleAddUser = async () => {
        const id = newUserId.trim();
        const name = newUserName.trim().replace(/\s+/g, ' ');

        if (!id || !name) {
            setNewUserError('Vui lòng nhập đủ Mã NV và Họ Tên.');
            return;
        }

        const normalizedId = id.toLocaleLowerCase('vi-VN');
        if (users.some((item) => item.id.toLocaleLowerCase('vi-VN') === normalizedId)) {
            setNewUserError('Mã NV đã tồn tại, không thêm trùng.');
            return;
        }

        const addedUser = await DB.addUser({ id, name, password: '123', role: 'user', status: 'approved', createdAt: new Date().toISOString(), permissions: { canTakeBasic: true, canTakeIntermediate: false, canTakeAdvanced: false }, progress: [], lockOuts: {}, lockOutCounts: {} });
        if (!addedUser) {
            setNewUserError('Không thêm được nhân viên vì mã đã tồn tại trong database.');
            await fetchData();
            return;
        }

        setNewUserError('');
        setNewUserId('');
        setNewUserName('');
        await fetchData();
    };

    const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
        await DB.updateUserStatus(id, status);
        await fetchData();
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Xóa nhân viên?')) {
            await DB.deleteUser(id);
            (['Basic', 'Intermediate', 'Advanced'] as Level[]).forEach((level) => {
                localStorage.removeItem(getQuizSessionKey(id, level));
            });
            localStorage.removeItem(getStudySectionKey(id));

            const savedUser = localStorage.getItem('hiras_current_user');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser) as User;
                    if (parsed.id === id) {
                        localStorage.removeItem('hiras_current_user');
                        localStorage.removeItem('hiras_current_view');
                    }
                } catch (error) {
                    console.error('Không đọc được phiên người dùng đã lưu', error);
                }
            }

            await fetchData();
        }
    };
    const handleReset = async (id: string) => {
        if (window.confirm('Reset trạng thái bài thi của tài khoản này?')) {
            await DB.resetUserQuizState(id);
            (['Basic', 'Intermediate', 'Advanced'] as Level[]).forEach((level) => {
                localStorage.removeItem(getQuizSessionKey(id, level));
            });
            await fetchData();
        }
    };

    const handleTimeLimitChange = (level: Level, value: string) => {
        const sanitizedValue = value.replace(/[^\d]/g, '');
        setIsSettingsDirty(true);
        setQuizTimeDrafts((prev) => ({
            ...prev,
            [level]: sanitizedValue,
        }));
        const fallbackValue = quizSettings.timeLimit[level] || 1;
        const parsedCandidate = Number(sanitizedValue);
        const parsedValue = Number.isFinite(parsedCandidate) && sanitizedValue.trim() !== ''
          ? Math.max(1, Math.round(parsedCandidate))
          : fallbackValue;
        setQuizSettings((prev) => ({
            ...prev,
            timeLimit: {
                ...prev.timeLimit,
                [level]: parsedValue,
            },
        }));
    };
    const hasInvalidTimeDraft = (['Basic', 'Intermediate', 'Advanced'] as Level[]).some((level) => {
        const value = quizTimeDrafts[level];
        return !value || !/^\d+$/.test(value) || Number(value) < 1;
    });
    const handleSaveQuizSettings = async () => {
        if (hasInvalidTimeDraft) {
            window.alert('Thời gian thi phải là số nguyên lớn hơn hoặc bằng 1 phút.');
            return;
        }

        const cleanName = systemNameDraft.trim() || 'Excel Academy';
        const nextSettings: QuizSettings = {
            systemName: cleanName,
            timeLimit: {
                Basic: Math.max(1, Number(quizTimeDrafts.Basic)),
                Intermediate: Math.max(1, Number(quizTimeDrafts.Intermediate)),
                Advanced: Math.max(1, Number(quizTimeDrafts.Advanced)),
            },
        };

        setQuizSettings(nextSettings);
        setSystemNameDraft(cleanName);
        if (onSystemNameUpdated) onSystemNameUpdated(cleanName);
        isSettingsDirtyRef.current = false;
        await DB.updateSettings(nextSettings);
        setIsSettingsDirty(false);
        await fetchData(true);
        window.alert('Đã lưu Tên hệ thống và Cấu hình thời gian thi!');
    };

    const handleExportExcelCsv = () => {
        const headers = [
            'Mã NV',
            'Họ và Tên',
            'Vai trò',
            'Trạng thái',
            'Nhánh đang học',
            'Tiến độ Giáo trình (%)',
            'Số nhánh Hoàn thành (trên 4)',
            'Điểm Kế toán (Basic/Inter/Adv)',
            'Điểm Sales (Basic/Inter/Adv)',
            'Điểm Kho vận (Basic/Inter/Adv)',
            'Điểm Nhân sự (Basic/Inter/Adv)',
            'Tổng số lần dự thi',
            'Ngày thi gần nhất',
        ];

        const levels: Level[] = ['Basic', 'Intermediate', 'Advanced'];
        const escapeCsv = (val: string | number) => `"${String(val ?? '').replace(/"/g, '""')}"`;

        const rows = users.map((u) => {
            const uRes = results.filter((r) => r.userId === u.id);
            const progPct = TOTAL_STUDY_SECTIONS === 0 ? 0 : Math.round(((u.progress || []).length / TOTAL_STUDY_SECTIONS) * 100);

            const getBranchSummary = (domId: PracticeDomain) => {
                const dRes = uRes.filter((r) => (r.domain || 'accounting') === domId);
                const scores = levels.map((lvl) => {
                    const maxScore = Math.max(0, ...dRes.filter((r) => r.level === lvl).map((r) => r.score));
                    return `${maxScore}/${NUM_QUESTIONS[lvl]}`;
                });
                return scores.join(' - ');
            };

            const completedBranchesCount = DOMAIN_LIST.filter((dom) => {
                const dRes = uRes.filter((r) => (r.domain || 'accounting') === dom.id);
                return levels.every((lvl) => dRes.some((r) => r.level === lvl && r.score >= NUM_QUESTIONS[lvl] * 0.8));
            }).length;

            const latestDate = uRes.length > 0
                ? new Date(Math.max(...uRes.map((r) => new Date(r.date).getTime()))).toLocaleString('vi-VN')
                : 'Chưa thi';

            const statusLabel = u.role === 'admin' ? 'Đã duyệt' : u.status === 'pending' ? 'Chờ duyệt' : u.status === 'rejected' ? 'Đã khóa' : 'Đã duyệt';
            const activeDomName = u.activeDomain ? PRACTICE_DOMAINS[u.activeDomain].shortName : 'Chưa chọn';

            return [
                u.id,
                u.name,
                u.role === 'admin' ? 'Quản trị viên' : 'Học viên',
                statusLabel,
                activeDomName,
                `${progPct}%`,
                `${completedBranchesCount}/4`,
                getBranchSummary('accounting'),
                getBranchSummary('sales'),
                getBranchSummary('inventory'),
                getBranchSummary('hr_ops'),
                uRes.length,
                latestDate,
            ].map(escapeCsv).join(',');
        });

        const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const today = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.setAttribute('download', `Bao_Cao_Ket_Qua_Dao_Tao_Excel_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const pendingUsers = users.filter((u) => u.role !== 'admin' && u.status === 'pending');

    const stats = {
      total: users.length,
      pending: pendingUsers.length,
      passedBasic: results.filter(r => r.level === 'Basic' && r.score >= NUM_QUESTIONS['Basic'] * 0.8).length,
      passedIntermediate: results.filter(r => r.level === 'Intermediate' && r.score >= NUM_QUESTIONS['Intermediate'] * 0.8).length,
      passedAdvanced: results.filter(r => r.level === 'Advanced' && r.score >= NUM_QUESTIONS['Advanced'] * 0.8).length,
    };
    const questionBankStats = (['Basic', 'Intermediate', 'Advanced'] as Level[]).map((level) => ({
      level,
      ...getQuestionBankStats(level),
    }));

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '2.5rem' }}>Quản trị Hệ thống</h2>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ background: '#059669', display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}
                  onClick={handleExportExcelCsv}
                >
                  <Download size={17} /> Xuất Báo cáo Excel (.CSV)
                </button>
                <button className="btn" style={{ border: '1px solid var(--border)', whiteSpace: 'nowrap' }} onClick={() => void fetchData(true)}>
                  Làm mới
                </button>
                <div className="glass-card" style={{ padding: '0.9rem 1.3rem', background: stats.pending > 0 ? '#fef3c7' : '#f8fafc', border: stats.pending > 0 ? '2px solid #f59e0b' : '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: stats.pending > 0 ? '#b45309' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Chờ duyệt</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stats.pending > 0 ? '#d97706' : 'var(--text-main)' }}>{stats.pending}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.9rem 1.3rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Nhân sự</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.total}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.9rem 1.3rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Đạt Basic</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.passedBasic}</div>
                </div>
                <div className="glass-card" style={{ padding: '0.9rem 1.3rem', background: '#fff7ed', border: '1px solid #fed7aa' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>Đạt Advanced</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.passedAdvanced}</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', border: pendingUsers.length > 0 ? '2px solid #f59e0b' : '1px solid var(--border)', background: pendingUsers.length > 0 ? '#fffbeb' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: pendingUsers.length > 0 ? '#b45309' : 'var(--text-main)' }}>
                            <UserCheck size={22} color={pendingUsers.length > 0 ? '#d97706' : 'var(--primary)'} />
                            Duyệt tài khoản đăng ký mới ({pendingUsers.length})
                        </h3>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Người dùng tự đăng ký trên web sẽ ở trạng thái <strong>Chờ duyệt</strong> và chỉ có thể đăng nhập học & thi sau khi bạn bấm <strong>Duyệt</strong>.
                        </div>
                    </div>
                </div>
                {pendingUsers.length === 0 ? (
                    <div style={{ padding: '1rem 1.25rem', borderRadius: '0.75rem', background: '#f8fafc', color: 'var(--text-muted)', fontSize: '0.92rem', border: '1px dashed var(--border)' }}>
                        Hiện không có tài khoản nào đang chờ phê duyệt.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {pendingUsers.map((u) => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem', borderRadius: '0.85rem', background: '#ffffff', border: '1px solid #fde68a', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                                        {u.name} <span style={{ fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', fontSize: '0.88rem', marginLeft: '0.4rem' }}>{u.id}</span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        Đăng ký lúc: {u.createdAt ? new Date(u.createdAt).toLocaleString('vi-VN') : 'Vừa xong'} • Mật khẩu ĐK: <code style={{ fontWeight: 700 }}>{u.password || 'N/A'}</code>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => void handleUpdateStatus(u.id, 'approved')}
                                        className="btn btn-primary"
                                        style={{ padding: '0.55rem 1rem', background: '#16a34a' }}
                                    >
                                        ✓ Duyệt cho phép học & thi
                                    </button>
                                    <button
                                        onClick={() => void handleUpdateStatus(u.id, 'rejected')}
                                        className="btn"
                                        style={{ padding: '0.55rem 1rem', background: '#fee2e2', color: '#dc2626' }}
                                    >
                                        ✕ Từ chối / Khóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={20} color="var(--primary)" />
                            Kho bài tập & lưu trữ
                        </h3>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Database chỉ lưu tài khoản, kết quả và cấu hình thi; ngân hàng câu hỏi sinh từ template UTF-8 trong source để dễ rà soát.
                        </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'right' }}>
                        Cloud/DB: {users.length} nhân sự, {results.length} kết quả
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
                    {questionBankStats.map((item) => (
                        <div key={item.level} style={{ border: '1px solid var(--border)', borderRadius: '0.9rem', padding: '1rem', background: '#f8fafc' }}>
                            <div style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Excel {LevelLabels[item.level]}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.35rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Câu sinh ra</span>
                                <strong>{item.total}</strong>
                                <span style={{ color: 'var(--text-muted)' }}>Dạng bài không trùng</span>
                                <strong>{item.topics}</strong>
                                <span style={{ color: 'var(--text-muted)' }}>Câu mỗi đề</span>
                                <strong>{item.perTest}</strong>
                                <span style={{ color: 'var(--text-muted)' }}>Trùng tuyệt đối</span>
                                <strong style={{ color: item.exactDuplicates === 0 ? '#059669' : '#dc2626' }}>{item.exactDuplicates}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Thêm Nhân viên mới (Duyệt sẵn)</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    Tài khoản do Admin tạo trực tiếp tại đây sẽ được kích hoạt trạng thái <strong>Đã duyệt</strong> ngay lập tức (mật khẩu mặc định: <code>123</code>).
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Mã NV" value={newUserId} onChange={e => { setNewUserId(e.target.value); setNewUserError(''); }} style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', flex: '1 1 160px', minWidth: 0 }} />
                    <input type="text" placeholder="Họ Tên" value={newUserName} onChange={e => { setNewUserName(e.target.value); setNewUserError(''); }} style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', flex: '2 1 260px', minWidth: 0 }} />
                    <button className="btn btn-primary" onClick={handleAddUser}>Thêm & Duyệt ngay</button>
                </div>
                {newUserError && <div style={{ marginTop: '0.75rem', color: '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>{newUserError}</div>}
            </div>
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.35rem' }}>Cấu hình Tên Hệ Thống & Thời gian thi</h3>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Tùy chỉnh tên thương hiệu hiển thị trên thanh điều hướng, tiêu đề trang và chứng nhận.
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleSaveQuizSettings}>Lưu Cấu Hình</button>
                </div>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.85rem', background: '#f8fafc', border: '1px solid var(--border)' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                        Tên Hệ Thống / Đơn Vị Đào Tạo:
                    </label>
                    <input
                        type="text"
                        value={systemNameDraft}
                        onChange={(e) => {
                            setIsSettingsDirty(true);
                            setSystemNameDraft(e.target.value);
                        }}
                        placeholder="VD: Excel Academy, Học Viện Nội Bộ Công Ty..."
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', fontWeight: 600 }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {(['Basic', 'Intermediate', 'Advanced'] as Level[]).map((level) => (
                        <div key={level} style={{ border: '1px solid var(--border)', borderRadius: '0.9rem', padding: '1rem', background: '#f8fafc' }}>
                            <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Excel {LevelLabels[level]}</div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                                Số phút làm bài
                            </label>
                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={quizTimeDrafts[level] ?? String(quizSettings.timeLimit[level] ?? 1)}
                                onChange={(e) => handleTimeLimitChange(level, e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Mã NV</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Họ Tên</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Nhánh đang học</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Trạng thái</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Mật khẩu</th>
                            <th style={{ padding: '1rem' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const status = u.role === 'admin' ? 'approved' : (u.status || 'approved');
                            const domInfo = u.activeDomain ? PRACTICE_DOMAINS[u.activeDomain] : null;
                            return (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 700 }}>{u.id}</td>
                                    <td style={{ padding: '1rem' }}>{u.name} {u.role === 'admin' ? '(Admin)' : ''}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {domInfo ? (
                                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: domInfo.color }}>
                                                {domInfo.badge} {domInfo.shortName}
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Chưa chọn</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {status === 'approved' && (
                                            <span style={{ display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: '#dcfce7', color: '#166534' }}>
                                                ✓ Đã duyệt
                                            </span>
                                        )}
                                        {status === 'pending' && (
                                            <span style={{ display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: '#fef3c7', color: '#b45309' }}>
                                                ⏳ Chờ duyệt
                                            </span>
                                        )}
                                        {status === 'rejected' && (
                                            <span style={{ display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: '#fee2e2', color: '#991b1b' }}>
                                                ✕ Đã khóa / Từ chối
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{u.password || 'N/A'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {u.role !== 'admin' && status !== 'approved' && (
                                            <button
                                                onClick={() => void handleUpdateStatus(u.id, 'approved')}
                                                className="btn"
                                                style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: '#dcfce7', color: '#166534', fontWeight: 700 }}
                                            >
                                                Duyệt TK
                                            </button>
                                        )}
                                        {u.role !== 'admin' && status === 'approved' && (
                                            <button
                                                onClick={() => void handleUpdateStatus(u.id, 'rejected')}
                                                className="btn"
                                                style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: '#fef3c7', color: '#b45309' }}
                                            >
                                                Khóa TK
                                            </button>
                                        )}
                                        <button onClick={async () => {
                                            const newPass = window.prompt('Nhập mật khẩu mới cho ' + u.id, u.password || '');
                                            if (newPass) {
                                                await DB.updateUserPassword(u.id, newPass);
                                                await fetchData();
                                            }
                                        }} className="btn" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: '#e0f2fe', color: '#0284c7' }}>Đổi MK</button>
                                        <button onClick={() => handleReset(u.id)} className="btn" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem' }}>Reset thi</button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="btn" style={{ background: '#fee2e2', color: '#dc2626', padding: '0.4rem 0.8rem' }} disabled={u.role === 'admin'}>Xóa</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dbReady, setDbReady] = useState(false);
  const [systemName, setSystemName] = useState<string>('Excel Academy');
  const [view, setView] = useState<'home' | 'study' | 'lab' | 'lessons' | 'quiz' | 'profile' | 'admin' | 'leaderboard'>('home');
  const [currentQuizLevel, setCurrentQuizLevel] = useState<Level | null>(null);
  const [activeDomain, setActiveDomain] = useState<PracticeDomain>('accounting');
  const [selectedQuizDomain, setSelectedQuizDomain] = useState<PracticeDomain | 'all'>('accounting');
  const [labConfig, setLabConfig] = useState<{ domain: PracticeDomain; level: Level }>({
    domain: 'accounting',
    level: 'Basic',
  });
  const clearStoredSession = () => {
    localStorage.removeItem('hiras_current_user');
    localStorage.removeItem('hiras_current_view');
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && systemName) {
      document.title = systemName;
    }
  }, [systemName]);

  const syncDomainState = (dom: PracticeDomain) => {
    setActiveDomain(dom);
    setSelectedQuizDomain(dom);
    setLabConfig((prev) => ({ ...prev, domain: dom }));
  };

  const handleSelectDomain = async (dom: PracticeDomain, navigateTo?: 'home' | 'study' | 'lab' | 'lessons') => {
    syncDomainState(dom);
    if (user) {
      const updated = await DB.updateUserDomain(user.id, dom);
      const nextUser = updated || { ...user, activeDomain: dom };
      setUser(nextUser);
      localStorage.setItem('hiras_current_user', JSON.stringify(nextUser));
    }
    if (navigateTo) {
      setView(navigateTo);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      await DB.ready();
      if (!isMounted) return;

      const latestSettings = DB.getSettings();
      if (latestSettings.systemName) {
        setSystemName(latestSettings.systemName);
      }

      const savedUser = localStorage.getItem('hiras_current_user');
      if (savedUser) {
          const uLocal = JSON.parse(savedUser) as User;
          const u = DB.getUser(uLocal.id);
          if (!u || (u.role !== 'admin' && u.status && u.status !== 'approved')) {
              clearStoredSession();
              if (isMounted) {
                setUser(null);
                setView('home');
              }
              setDbReady(true);
              return;
          }
          if (u.activeDomain) {
            syncDomainState(u.activeDomain);
          }
          const results = DB.getUserResults(u.id);
          
          const hasPassedBasic = results.some(r => r.level === 'Basic' && r.score >= NUM_QUESTIONS['Basic'] * 0.8);
          const hasPassedIntermediate = results.some(r => r.level === 'Intermediate' && r.score >= NUM_QUESTIONS['Intermediate'] * 0.8);

          const newPerms = u.role === 'admin'
            ? { canTakeBasic: true, canTakeIntermediate: true, canTakeAdvanced: true }
            : {
                canTakeBasic: true,
                canTakeIntermediate: hasPassedBasic,
                canTakeAdvanced: hasPassedIntermediate,
              };
          const changed = JSON.stringify(newPerms) !== JSON.stringify(u.permissions);

          if (changed) {
              await DB.updateUserPermissions(u.id, newPerms);
              const updatedUser = { ...u, permissions: newPerms };
              if (!isMounted) return;
              setUser(updatedUser);
              localStorage.setItem('hiras_current_user', JSON.stringify(updatedUser));
          } else {
              setUser(u);
              localStorage.setItem('hiras_current_user', JSON.stringify(u));
          }

          const savedView = localStorage.getItem('hiras_current_view');
          if (savedView) setView(savedView as any);
      }

      setDbReady(true);
    };

    void initializeApp();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hiras_current_view', view);
    }
    window.scrollTo(0, 0);
  }, [view, user]);

  useEffect(() => {
    if (!user) return;

    const validateCurrentSession = async () => {
      await DB.refresh();
      const latestSettings = DB.getSettings();
      if (latestSettings.systemName) {
        setSystemName(latestSettings.systemName);
      }
      const latestUser = DB.getUser(user.id);
      if (!latestUser || (latestUser.role !== 'admin' && latestUser.status && latestUser.status !== 'approved')) {
        setUser(null);
        setCurrentQuizLevel(null);
        setView('home');
        clearStoredSession();
      }
    };

    const handleWindowFocus = () => {
      void validateCurrentSession();
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [user]);

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.activeDomain) {
      syncDomainState(u.activeDomain);
    }
    setView(u.role === 'admin' ? 'admin' : 'home');
    localStorage.setItem('hiras_current_user', JSON.stringify(u));
  };
  const handleLogout = () => { setUser(null); setCurrentQuizLevel(null); setView('home'); clearStoredSession(); };
  const handleToggleProgress = async (id: string) => {
    if (user) {
        await DB.refresh();
        const currentUser = DB.getUser(user.id);
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.status && currentUser.status !== 'approved')) {
            handleLogout();
            return;
        }
        const updatedUser = DB.toggleProgress(user.id, id) || DB.getUser(user.id) || null;
        setUser(updatedUser);
        if (updatedUser) {
            localStorage.setItem('hiras_current_user', JSON.stringify(updatedUser));
        }
    }
  };

  const persistQuizResult = async (score: number, time: number) => {
    if (user && currentQuizLevel) {
        await DB.refresh();
        if (!DB.getUser(user.id)) {
            handleLogout();
            return;
        }
        const total = NUM_QUESTIONS[currentQuizLevel];
        const passed = score >= total * 0.8;
        const quizDom: PracticeDomain = selectedQuizDomain === 'all' ? activeDomain : selectedQuizDomain;
        
        await DB.saveResult({
          id: Date.now().toString(),
          userId: user.id,
          level: currentQuizLevel,
          domain: quizDom,
          score,
          total,
          date: new Date().toISOString(),
          timeTaken: time,
        });
        localStorage.removeItem(getQuizSessionKey(user.id, currentQuizLevel, selectedQuizDomain));

        if (passed) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#f59e0b']
          });
        }

        // Tự động mở khóa cấp độ tiếp theo nếu đạt >= 80%
        if (passed && user.role !== 'admin') {
            const newPermissions = { ...user.permissions };
            let updated = false;

            if (currentQuizLevel === 'Basic') {
                newPermissions.canTakeIntermediate = true;
                updated = true;
            } else if (currentQuizLevel === 'Intermediate') {
                newPermissions.canTakeAdvanced = true;
                updated = true;
            }

            if (updated) {
                await DB.updateUserPermissions(user.id, newPermissions);
                const updatedUser = { ...user, permissions: newPermissions };
                setUser(updatedUser);
                localStorage.setItem('hiras_current_user', JSON.stringify(updatedUser));
            }
        }
    }
  };

  const exitQuizToProfile = () => {
    setCurrentQuizLevel(null);
    setView('profile');
  };

  if (!dbReady) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Navbar onNav={() => {}} user={null} systemName={systemName} onLogout={() => {}} />
        <div className="container" style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            Đang tải dữ liệu hệ thống...
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <div style={{ minHeight: '100vh', position: 'relative' }}><Navbar onNav={()=>{}} user={null} systemName={systemName} onLogout={()=>{}} /><LoginView onLogin={handleLogin} /></div>;

  const userStats = DB.getUserResults(user.id);
  const currentDomMeta = PRACTICE_DOMAINS[activeDomain];

  // Nếu học viên mới chưa chọn nhánh chuyên ngành xuyên suốt -> hiện màn hình Chọn Nhánh Khởi Đầu
  if (user.role !== 'admin' && !user.activeDomain) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Navbar onNav={setView} user={user} systemName={systemName} onLogout={handleLogout} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ padding: '3.5rem 0', maxWidth: '980px' }}>
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', borderRadius: '999px', background: '#ecfdf5', color: '#059669', fontWeight: 800, fontSize: '0.82rem', marginBottom: '1rem' }}>
              <GraduationCap size={18} /> BƯỚC KHỞI ĐẦU LỘ TRÌNH HỌC & SÁT HẠCH
            </div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
              Chọn Nhánh Nghiệp Vụ Để Đi Xuyên Suốt
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto 2.25rem', lineHeight: 1.6 }}>
              Khi bạn chọn một nhánh chuyên ngành dưới đây, toàn bộ <strong>Giáo trình Case Study</strong>, <strong>Phòng Lab Công thức</strong> và <strong>Đề Thi Sát Hạch (Cơ bản → Trung cấp → Nâng cao)</strong> sẽ đi xuyên suốt theo nhánh đó. Sau khi hoàn thành 1 nhánh, bạn có thể chuyển sang chinh phục các nhánh tiếp theo!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
              {DOMAIN_LIST.map((dom) => (
                <div
                  key={dom.id}
                  onClick={() => void handleSelectDomain(dom.id, 'study')}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    borderTop: `5px solid ${dom.color}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{dom.badge}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: dom.color, marginBottom: '0.5rem' }}>{dom.name}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.5rem' }}>{dom.description}</div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', background: dom.color, padding: '0.75rem', fontWeight: 800 }}
                  >
                    Chọn nhánh {dom.shortName} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar onNav={setView} user={user} activeDomain={activeDomain} currentView={view} systemName={systemName} onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '3.5rem 0' }}>
            {/* Banner Nhánh Đang Theo Học Xuyên Suốt */}
            <div
              className="glass-card"
              style={{
                padding: '2.5rem',
                marginBottom: '2.5rem',
                borderTop: `5px solid ${currentDomMeta.color}`,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ maxWidth: '680px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: `${currentDomMeta.color}15`, color: currentDomMeta.color, fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                    <span>{currentDomMeta.badge}</span>
                    <span>NHÁNH ÔN LUYỆN XUYÊN SUỐT HIỆN TẠI</span>
                  </div>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '0.6rem', color: '#0f172a' }}>
                    Lộ Trình Chuyên Ngành: <span style={{ color: currentDomMeta.color }}>{currentDomMeta.name}</span>
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                    {currentDomMeta.description} Đi xuyên suốt 3 bước dưới đây để hoàn thành trọn vẹn chứng nhận nhánh <strong>{currentDomMeta.shortName}</strong> trước khi mở rộng sang nhánh khác.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary"
                      style={{ background: currentDomMeta.color, padding: '0.85rem 1.5rem', fontWeight: 800 }}
                      onClick={() => setView('study')}
                    >
                      1. Học Giáo trình ({currentDomMeta.shortName})
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#ecfdf5', color: '#059669', border: '2px solid #10b981', fontWeight: 800, padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                      onClick={() => {
                        setLabConfig({ domain: activeDomain, level: 'Basic' });
                        setView('lab');
                      }}
                    >
                      <Terminal size={18} /> 2. Phòng Lab ({currentDomMeta.shortName})
                    </button>
                    <button
                      className="btn"
                      style={{ background: '#0f172a', color: 'white', padding: '0.85rem 1.5rem', fontWeight: 800 }}
                      onClick={() => {
                        setSelectedQuizDomain(activeDomain);
                        setView('lessons');
                      }}
                    >
                      3. Thi Sát hạch ({currentDomMeta.shortName}) →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Danh Sách 4 Nhánh Chuyên Ngành (Hoàn thành từng nhánh)</h2>
                <p style={{ color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontSize: '0.95rem' }}>
                  Bấm chọn nhánh bất kỳ để chuyển toàn bộ nội dung Giáo trình, Phòng Lab và Bài Thi đi xuyên suốt theo nhánh đó.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
              {DOMAIN_LIST.map((dom) => {
                const isSelected = dom.id === activeDomain;
                const domResults = userStats.filter((r) => (r.domain || 'accounting') === dom.id);
                const levels: Level[] = ['Basic', 'Intermediate', 'Advanced'];
                const passedCount = levels.filter((lvl) =>
                  domResults.some((r) => r.level === lvl && r.score >= NUM_QUESTIONS[lvl] * 0.8)
                ).length;
                const isCompleted = passedCount === 3;

                return (
                  <div
                    key={dom.id}
                    className="glass-card"
                    style={{
                      padding: '1.6rem',
                      borderTop: `5px solid ${dom.color}`,
                      border: isSelected ? `2.5px solid ${dom.color}` : undefined,
                      background: isCompleted ? '#f0fdf4' : isSelected ? `${dom.color}08` : 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '1.85rem' }}>{dom.badge}</span>
                        {isCompleted ? (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#16a34a', color: 'white', fontSize: '0.72rem', fontWeight: 800 }}>
                            🏆 HOÀN THÀNH (3/3)
                          </span>
                        ) : isSelected ? (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: dom.color, color: 'white', fontSize: '0.72rem', fontWeight: 800 }}>
                            ĐANG HỌC XUYÊN SUỐT
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                            Đạt {passedCount}/3 cấp độ
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: dom.color, marginBottom: '0.4rem' }}>{dom.name}</div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.25rem' }}>{dom.description}</div>
                    </div>
                    <button
                      onClick={() => void handleSelectDomain(dom.id)}
                      className="btn"
                      style={{
                        width: '100%',
                        background: isSelected ? dom.color : '#f1f5f9',
                        color: isSelected ? 'white' : '#1e293b',
                        fontWeight: 800,
                        padding: '0.65rem',
                      }}
                    >
                      {isSelected ? `✓ Đang đi theo nhánh ${dom.shortName}` : `Chọn đi xuyên suốt nhánh ${dom.shortName}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
        {view === 'study' && (
          <StudyView
            user={user}
            activeDomain={activeDomain}
            onSelectDomain={(dom) => void handleSelectDomain(dom)}
            onToggleProgress={handleToggleProgress}
            onGoToQuiz={() => {
              setSelectedQuizDomain(activeDomain);
              setView('lessons');
            }}
            onOpenFormulaLab={(domain, level) => {
              void handleSelectDomain(domain);
              setLabConfig({ domain, level });
              setView('lab');
            }}
          />
        )}
        {view === 'lab' && (
          <FormulaLabView
            initialDomain={activeDomain}
            initialLevel={labConfig.level}
            onSelectDomain={(dom) => void handleSelectDomain(dom)}
          />
        )}
        {view === 'lessons' && (
          <div className="container" style={{ padding: '3.5rem 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.25rem' }}>
              Sát Hạch Theo Nhánh: <span style={{ color: currentDomMeta.color }}>{currentDomMeta.badge} {currentDomMeta.name}</span>
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 2rem' }}>
              Đề thi đi xuyên suốt theo nhánh <strong>{currentDomMeta.name}</strong> từ Cơ bản → Trung cấp → Nâng cao. Hoàn thành đạt ≥ 80% từng cấp độ để mở khóa cấp độ tiếp theo trong nhánh.
            </p>

            {/* Bộ chuyển nhánh nếu muốn đổi sang nhánh khác */}
            <div style={{ maxWidth: '900px', margin: '0 auto 2.5rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                Nhánh chuyên ngành đang thi (bấm để chuyển sang nhánh khác nếu cần):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.75rem' }}>
                {DOMAIN_LIST.map((dom) => {
                  const isSelected = activeDomain === dom.id;
                  return (
                    <button
                      key={dom.id}
                      onClick={() => void handleSelectDomain(dom.id)}
                      className="glass-card"
                      style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        border: isSelected ? `2.5px solid ${dom.color}` : '1px solid var(--border)',
                        background: isSelected ? `${dom.color}12` : 'white',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.98rem', color: isSelected ? dom.color : '#0f172a' }}>
                        {dom.badge} {dom.shortName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {dom.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
              {(['Basic', 'Intermediate', 'Advanced'] as Level[]).map(lvl => {
                const levelChapters = STUDY_CHAPTERS_BY_LEVEL[lvl];
                const isReady = levelChapters.every(ch => ch.sections.every(s => (user.progress || []).includes(s.id)));
                const lockUntil = getActiveQuizLockUntil(user, lvl);
                const domResults = userStats.filter((r) => (r.domain || 'accounting') === activeDomain);
                const passedDomBasic = domResults.some((r) => r.level === 'Basic' && r.score >= NUM_QUESTIONS['Basic'] * 0.8);
                const passedDomInter = domResults.some((r) => r.level === 'Intermediate' && r.score >= NUM_QUESTIONS['Intermediate'] * 0.8);
                const passedThisLevel = domResults.some((r) => r.level === lvl && r.score >= NUM_QUESTIONS[lvl] * 0.8);

                const isPermissionLocked =
                  user.role !== 'admin' &&
                  ((lvl === 'Intermediate' && !passedDomBasic && !user.permissions.canTakeIntermediate) ||
                    (lvl === 'Advanced' && !passedDomInter && !user.permissions.canTakeAdvanced));
                const isProgressLocked = user.role !== 'admin' && !isReady;
                const isExamLocked = Boolean(lockUntil);
                const isLocked = isPermissionLocked || isProgressLocked || isExamLocked;
                const domainLabel = currentDomMeta.name;
                return (
                  <div key={lvl} className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', opacity: isLocked ? 0.5 : 1, borderLeft: passedThisLevel ? '5px solid #16a34a' : `5px solid ${currentDomMeta.color}` }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {isLocked && <Lock size={18} />}
                          Excel {LevelLabels[lvl]}
                          <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.65rem', borderRadius: '999px', background: `${currentDomMeta.color}15`, color: currentDomMeta.color, fontWeight: 800 }}>
                            {currentDomMeta.badge} {domainLabel}
                          </span>
                          {passedThisLevel && (
                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#dcfce7', color: '#166534', fontWeight: 800 }}>
                              ✓ ĐÃ ĐẠT NHÁNH NÀY
                            </span>
                          )}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                          {NUM_QUESTIONS[lvl]} câu hỏi chuyên sâu nhánh {currentDomMeta.shortName} — {isExamLocked ? '🔒 Đang bị khóa thi' : (isPermissionLocked ? '🔒 Cần đạt cấp độ trước của nhánh' : (isReady ? '✅ Sẵn sàng thi' : '🔒 Chưa hoàn thành tiến độ học'))}
                        </p>
                        {isExamLocked && lockUntil && (
                          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                            Khóa đến: {formatLockUntil(lockUntil)}
                          </div>
                        )}
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ background: currentDomMeta.color }}
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedQuizDomain(activeDomain);
                        setCurrentQuizLevel(lvl);
                        setView('quiz');
                      }}
                    >
                      {passedThisLevel ? 'Thi lại cải thiện điểm →' : 'Bắt đầu thi →'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {view === 'quiz' && currentQuizLevel && (
          <Quiz 
            userId={user.id}
            level={currentQuizLevel}
            domainFilter={activeDomain}
            timeLimitMinutes={DB.getSettings().timeLimit[currentQuizLevel] || 30} 
            onPersistResult={persistQuizResult}
            onExit={exitQuizToProfile}
            onCancel={() => {
              localStorage.removeItem(getQuizSessionKey(user.id, currentQuizLevel, activeDomain));
              setCurrentQuizLevel(null);
              setView('lessons');
            }} 
          />
        )}
        {view === 'profile' && (
          <ProfileView
            user={user}
            stats={userStats}
            activeDomain={activeDomain}
            systemName={systemName}
            onSelectDomain={(dom) => void handleSelectDomain(dom, 'study')}
          />
        )}
        {view === 'leaderboard' && <Leaderboard currentUserId={user.id} />}
        {view === 'admin' && user.role === 'admin' && (
          <AdminDashboard onSystemNameUpdated={(name) => setSystemName(name)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
