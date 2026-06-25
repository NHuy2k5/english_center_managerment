import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Lightbulb,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  FileCheck,
  DollarSign,
  Check,
  Send,
  Phone
} from "lucide-react";

import { HomeAlt, Phone as CustomPhoneIcon, Envelope } from "../assets/Icons";
import "../layout/Footer/Footer.css";

// Images
import thinkingPersonImg from "../assets/images/ChatGPT_Image_Jun_7__2026__04_57_59_PM.png";
import ieltsSpeedrunnerImg from "../assets/images/IMG_20260607_165623.png";
import womanImg from "../assets/images/ChatGPT_Image_Jun_7__2026__05_10_50_PM-1.png";
import teacherImg from "../assets/images/teacher_consultant.png";

function PromoBanner() {
  return (
    <div className="bg-blue-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          Giảm tới 30% cho khóa học iStarts for Kids. Nhận tư vấn ngay
        </p>
        <a href="#" className="text-white text-sm underline hover:text-blue-100 transition-colors">
          Đăng ký nhận thông tin
        </a>
      </div>
    </div>
  );
}

function NavigationBar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activePage, setActivePage] = useState("trangchu");

  const khoaHocItems = [
    "IELTS",
    "TOEIC",
    "SAT",
    "Tiếng Anh cho trẻ",
    "Tiếng Anh giao tiếp cho người đi làm",
  ];

  const thuVienItems = [
    "Tài liệu học tập",
    "Video bài giảng",
    "Đề thi thử",
    "Blog học tiếng Anh",
  ];

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-blue-600">EngPro</div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className={activePage === "trangchu" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition-colors"}
              onClick={() => setActivePage("trangchu")}
            >
              Trang chủ
            </a>

            <a
              href="#"
              className={activePage === "gioithieu" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition-colors"}
              onClick={() => setActivePage("gioithieu")}
            >
              Giới thiệu
            </a>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("khoahoc")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 ${activePage === "khoahoc" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"} transition-colors cursor-pointer`}>
                Khóa Học
                <ChevronDown className="w-4 h-4" />
              </button>

              {activeDropdown === "khoahoc" && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white shadow-lg rounded-xl py-2 min-w-[250px]">
                    {khoaHocItems.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#"
              className={activePage === "lkhgiang" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition-colors"}
              onClick={() => setActivePage("lkhgiang")}
            >
              Lịch Khai giảng
            </a>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("thuvien")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 ${activePage === "thuvien" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"} transition-colors cursor-pointer`}>
                Thư viện
                <ChevronDown className="w-4 h-4" />
              </button>

              {activeDropdown === "thuvien" && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white shadow-lg rounded-xl py-2 min-w-[200px]">
                    {thuVienItems.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#"
              className={activePage === "lienhe" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600 transition-colors"}
              onClick={() => setActivePage("lienhe")}
            >
              Liên hệ
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="bg-blue-700 text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition-colors font-medium">
            Đăng nhập
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const reasons = [
    {
      icon: Lightbulb,
      title: "5+ năm kinh nghiệm, 10.000+ học viên trên toàn cầu",
    },
    {
      icon: TrendingUp,
      title: "Môi trường học tập tương tác cao, phát triển 4 kỹ năng",
    },
    {
      icon: Users,
      title: "Lộ trình học chuẩn quốc tế, bám sát nhu cầu học viên",
    },
    {
      icon: FileCheck,
      title: "Kiểm tra và theo dõi tiến độ học tập rõ ràng",
    },
    {
      icon: Award,
      title: "Cam kết đầu ra chuẩn CEFR (hoặc IELTS 6.5+)",
    },
    {
      icon: BookOpen,
      title: "Hệ sinh thái đồng hành toàn diện, kho tài liệu học tập đa dạng",
    },
    {
      icon: CheckCircle,
      title: "100% giáo viên chuẩn Quốc tế, đào tạo 5 bước khắt khe",
    },
    {
      icon: DollarSign,
      title: "Học online linh hoạt, tiết kiệm chi phí",
    },
  ];

  return (
    <div>
      <div
        className="relative bg-gradient-to-r from-blue-50 to-cyan-50 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="min-h-[70vh] py-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-7xl mx-auto px-6 w-full"
              >
                <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
                  Vì sao chọn chúng tôi
                </h2>

                <div className="flex items-start justify-center gap-8">
                  <div className="flex flex-col gap-5 w-[380px]">
                    {reasons.slice(0, 4).map((reason, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm h-[100px] w-full">
                        <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0 shadow-sm">
                          <reason.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm leading-relaxed">{reason.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-shrink-0 flex items-start justify-center px-4">
                    <img
                      src={thinkingPersonImg}
                      alt="Thinking person"
                      className="w-auto h-[440px] object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-5 w-[380px]">
                    {reasons.slice(4, 8).map((reason, index) => (
                      <div key={index} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm h-[100px] w-full">
                        <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0 shadow-sm">
                          <reason.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm leading-relaxed">{reason.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer">
                    Nhận tư vấn ngay
                  </button>
                </div>
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-7xl mx-auto px-6 w-full h-full flex items-center"
              >
                <div className="flex items-center justify-center gap-16 w-full">
                  <div className="w-1/2 flex flex-col justify-center">
                    <h2 className="text-5xl font-bold text-blue-700 mb-6">
                      IELTS SPEEDRUNNER
                    </h2>
                    <p className="text-gray-700 text-xl mb-6 leading-relaxed font-medium">
                      Thần tốc chinh phục IELTS 6.5
                    </p>
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      Chương trình học tập chuyên sâu giúp bạn đạt IELTS 6.5 trong thời gian ngắn nhất với phương pháp học hiệu quả và đội ngũ giảng viên chuyên nghiệp.
                    </p>
                    <p className="text-gray-600 text-base mb-8 leading-relaxed">
                      - Đối tượng: Học viên đang ở mức 6.0 cần đạt 6.5 - 7.0+ trong thời gian ngắn nhất.
                    </p>
                    <div>
                      <button className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer">
                        Nhận tư vấn ngay
                      </button>
                    </div>
                  </div>

                  <div className="w-1/2 flex justify-center">
                    <img
                      src={ieltsSpeedrunnerImg}
                      alt="IELTS Speedrunner"
                      className="w-full max-w-xl h-auto object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-7xl mx-auto px-6 w-full h-full flex items-center"
              >
                <div className="flex items-start justify-center gap-16 w-full">
                  <div className="w-1/2 flex flex-col">
                    <h2 className="text-3xl font-bold text-blue-700 mb-6">
                      BỨC PHÁ TOÀN DIỆN 4 KĨ NĂNG
                    </h2>
                    <div className="flex items-stretch gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={womanImg}
                          alt="Happy woman"
                          className="w-72 h-auto object-contain"
                        />
                      </div>
                      <div className="flex flex-col justify-around flex-1">
                        {[
                          "Hơn 5 năm kinh nghiệm, đào tạo thành công 10.000+ học viên",
                          "Phương pháp giảng dạy hiện đại, học viên tiến bộ rõ rệt",
                          "Lộ trình học chuẩn quốc tế, phù hợp với nhu cầu thực tiễn",
                          "Giáo viên đạt chuẩn Quốc tế với chất lượng top đầu thị trường, giàu kinh nghiệm",
                          "Học online linh hoạt, cam kết đầu ra bằng văn bản"
                        ].map((text, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="bg-blue-200 rounded-full p-1.5 flex-shrink-0 mt-0.5">
                              <Check className="w-5 h-5 text-blue-700" />
                            </div>
                            <p className="text-gray-800 text-sm leading-relaxed font-medium">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2 flex justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md" id="consultation-form">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Đăng ký nhận tư vấn
                      </h3>
                      <form className="flex flex-col gap-4">
                        <input
                          type="text"
                          placeholder="Họ Tên"
                          className="px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="tel"
                          placeholder="Số điện thoại"
                          className="px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <label className="text-sm text-gray-700 mb-2 block">Khu vực bạn đang sinh sống</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500">
                            <option>-- Chọn khu vực --</option>
                            <option>Miền Bắc</option>
                            <option>Miền Trung</option>
                            <option>Miền Nam</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 mb-2 block">Nhu cầu học tập</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-blue-500">
                            <option>-- Chọn nhu cầu học tập --</option>
                            <option>TOEIC</option>
                            <option>IELTS</option>
                            <option>Tiếng Anh cho trẻ</option>
                            <option>Tiếng Anh cho người đi làm</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg mt-2 cursor-pointer"
                        >
                          Đăng ký ngay
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white py-6 flex justify-center">
        <div className="flex gap-3">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                currentSlide === index ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DifficultiesSection() {
  const difficulties = [
    { id: 1, text: "Mất gốc tiếng Anh, không biết bắt đầu học từ đâu", colSpan: "md:col-span-5" },
    { id: 2, text: "Thiếu động lực, mất phương hướng trong việc học", colSpan: "md:col-span-7" },
    { id: 3, text: "Không có lộ trình học rõ ràng, hiệu quả", colSpan: "md:col-span-7" },
    { id: 4, text: "Thi nhiều lần nhưng không cải thiện được điểm số", colSpan: "md:col-span-5" },
    { id: 5, text: "Nghe - Đọc tốt nhưng lại không Nói được", colSpan: "md:col-span-5" },
    { id: 6, text: "Khó khăn trong việc hiểu và sử dụng ngữ pháp", colSpan: "md:col-span-7" },
  ];

  const cardVariants = {
    default: {
      borderColor: "rgba(243, 244, 246, 1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
      scale: 1,
    },
    hover: {
      borderColor: "#2563eb",
      scale: 1.025,
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.25), 0 0 28px rgba(37, 99, 235, 0.55)",
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-blue-50/50 pt-2 pb-10 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {difficulties.map((item) => {
                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    initial="default"
                    animate="default"
                    whileHover="hover"
                    className={`col-span-12 ${item.colSpan} p-5 rounded-3xl border bg-white text-gray-800 flex items-center justify-center text-center min-h-[100px] lg:h-[115px] select-none cursor-default`}
                  >
                    <span className="font-semibold text-sm md:text-base leading-relaxed px-4">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute w-[280px] h-[280px] bg-gradient-to-tr from-blue-200/40 to-cyan-200/30 rounded-full blur-2xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src={teacherImg}
              alt="Teacher Consultant"
              className="w-full max-w-[320px] h-auto object-contain rounded-3xl drop-shadow-xl"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-10 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold">
              Đừng lo, EngPro sẽ đồng hành cùng bạn!
            </h3>
            <p className="text-blue-100 text-sm md:text-base max-w-xl">
              Chúng tôi cam kết giúp bạn vượt qua mọi rào cản và nâng tầm kỹ năng giao tiếp tiếng Anh vượt trội.
            </p>
          </div>

          <button
            onClick={() => {}}
            className="flex items-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-base cursor-pointer"
          >
            Nhận tư vấn ngay
            <Send className="w-5 h-5 text-blue-700" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function RiplMethodology() {
  const cards = [
    {
      letter: "R",
      title: "Refined Knowledge",
      subtitle: "Chắt lọc kiến thức tinh gọn",
      description: "Không dạy tất cả những gì tiếng Anh có, chỉ dạy những gì học viên cần. Tập trung tối đa vào kiến thức trọng tâm để tối ưu hóa thời gian và hiệu quả học tập.",
      bgGradient: "from-amber-400 to-yellow-300",
      textColor: "text-amber-950",
    },
    {
      letter: "I",
      title: "Inspiration",
      subtitle: "Truyền cảm hứng học tập",
      description: "Môi trường học tập tích cực, đầy năng lượng. Giáo viên đóng vai trò truyền lửa khơi dậy đam mê, giúp học viên tự giác học chủ động mà không áp lực.",
      bgGradient: "from-cyan-400 to-blue-400",
      textColor: "text-blue-950",
    },
    {
      letter: "P",
      title: "Practice",
      subtitle: "Thực hành phản xạ tối đa",
      description: "Tập trung thực hành giao tiếp phản xạ lên đến 80% thời gian học. Học viên được sử dụng tiếng Anh liên tục trên lớp để biến lý thuyết thành kỹ năng thực tế.",
      bgGradient: "from-emerald-400 to-teal-400",
      textColor: "text-emerald-950",
    },
    {
      letter: "L",
      title: "Logic",
      subtitle: "Tư duy logic chặt chẽ",
      description: "Xây dựng tư duy ngôn ngữ khoa học, hiểu rõ bản chất kiến thức. Học viên được trang bị chiến thuật và logic xử lý bài thi chặt chẽ, tối ưu điểm số.",
      bgGradient: "from-purple-400 to-indigo-400",
      textColor: "text-purple-950",
    },
  ];

  const cardVariants = {
    default: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      y: 0,
      scale: 1,
    },
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.4)",
      y: -6,
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 py-16 px-6 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl -top-32 -left-32 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -bottom-48 -right-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center flex flex-col items-center justify-center mb-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm select-none py-2 leading-relaxed">
              Phương pháp đào tạo RIPL
            </h2>
            
            <motion.div
              initial={{ rotate: -2, scale: 0.95 }}
              animate={{ rotate: -3, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white text-blue-900 font-black text-xs md:text-sm px-3.5 py-1.5 rounded-lg shadow-lg border-l-4 border-l-amber-400 transform -rotate-3 select-none flex-shrink-0"
            >
              ĐỘC QUYỀN
            </motion.div>
          </div>
          
          <h3 className="text-blue-200/80 text-base md:text-lg lg:text-xl font-medium mt-4 max-w-3xl leading-relaxed">
            Mang tới thành công cho 50000+ học viên suốt 5 năm qua.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="default"
              animate="default"
              whileHover="hover"
              className="p-6 rounded-3xl border flex flex-col justify-start relative overflow-hidden group shadow-lg backdrop-blur-md cursor-default select-none h-full min-h-[300px]"
            >
              <span className="absolute -right-4 -bottom-6 text-[120px] font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 group-hover:scale-105 transition-all duration-500">
                {card.letter}
              </span>

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.bgGradient} ${card.textColor} flex items-center justify-center text-2xl font-black mb-5 shadow-md`}>
                {card.letter}
              </div>

              <h4 className="text-white text-lg lg:text-xl font-bold mb-1">
                {card.title}
              </h4>

              <h5 className="text-amber-400 text-sm font-bold mb-4 tracking-wide uppercase">
                {card.subtitle}
              </h5>

              <p className="text-blue-100/70 text-sm leading-relaxed relative z-10">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const courseDetails = {
  tieuhoc: {
    title: "TIẾNG ANH TIỂU HỌC",
    outcomes: [
      "Phát âm chuẩn xác, tự nhiên",
      "Tự tin giao tiếp cơ bản",
      "Xây dựng vốn từ vựng nền tảng",
    ],
    hours: "48h | 60h",
    mockTest: "Đánh giá định kỳ theo format Cambridge",
    classSize: ["10", "15"],
    fee: "Từ 4.000.000 VNĐ",
  },
  thcs: {
    title: "TIẾNG ANH THCS",
    outcomes: [
      "Nắm chắc ngữ pháp nền tảng",
      "Phát triển toàn diện 4 kỹ năng",
      "Luyện thi chứng chỉ quốc tế",
    ],
    hours: "60h | 72h",
    mockTest: "Thi thử định kỳ chuẩn format mới nhất",
    classSize: ["15", "20"],
    fee: "Từ 5.500.000 VNĐ",
  },
  thpt: {
    title: "TIẾNG ANH THPT",
    outcomes: [
      "Luyện thi đại học môn Tiếng Anh",
      "Bứt phá điểm thi THPT Quốc Gia",
      "Chuẩn bị nền tảng IELTS",
    ],
    hours: "80h học cường độ cao",
    mockTest: "Thi thử hàng tuần với chuyên gia",
    classSize: ["10", "15"],
    fee: "Từ 8.000.000 VNĐ",
  },
};

function CoursesSection() {
  const [activeCourse, setActiveCourse] = useState("tieuhoc");

  const menuItems = [
    { id: "tieuhoc", label: "Tiếng Anh Tiểu học" },
    { id: "thcs", label: "Tiếng Anh THCS" },
    { id: "thpt", label: "Tiếng Anh THPT" },
  ];

  const selectedData = courseDetails[activeCourse];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          <div className="bg-white px-6 py-2.5 rounded-full font-bold text-2xl md:text-3xl text-blue-900 shadow-sm">
            Các khóa học chính tại
          </div>
          <div className="font-black text-2xl md:text-3xl text-blue-500 relative inline-block mt-2 md:mt-0">
            EngPro
            <div className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-3 left-[10%] w-[80%] h-[3px] bg-blue-300 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch">
          <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:py-10 z-10">
            {menuItems.map((item) => {
              const isActive = activeCourse === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCourse(item.id)}
                  className={`text-left pl-8 pr-12 py-5 rounded-xl lg:rounded-l-2xl lg:rounded-r-none font-bold text-base transition-all shadow-sm relative cursor-pointer ${
                    isActive 
                      ? "bg-blue-600 text-white -ml-0 lg:-ml-4 z-20" 
                      : "bg-white text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 lg:p-12 shadow-[0_0_40px_rgba(0,0,0,0.06)] relative z-20 mt-6 lg:mt-0 lg:-ml-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8 uppercase text-center lg:text-left tracking-wide">
                  {selectedData.title}
                </h3>

                <div className="mb-8">
                  <span className="text-gray-500 mb-4 block text-sm">Đầu ra:</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedData.outcomes.map((tag, idx) => (
                      <span key={idx} className="bg-[#f0f7ff] text-blue-600 px-4 py-2 rounded-full text-[13px] font-semibold border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-200 my-6"></div>

                <div className="flex flex-col gap-5 text-sm mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <span className="text-gray-500 w-28 flex-shrink-0">Giờ học chính:</span>
                    <span className="font-semibold text-gray-800">{selectedData.hours}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <span className="text-gray-500 w-28 flex-shrink-0">Thi thử:</span>
                    <span className="font-semibold text-gray-800">{selectedData.mockTest}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-gray-500 w-28 flex-shrink-0">Sỹ số:</span>
                    <div className="flex gap-2">
                      {selectedData.classSize.map((size, idx) => (
                        <span key={idx} className="bg-[#f0f7ff] text-blue-600 px-3 py-1.5 rounded-lg font-semibold text-xs border border-blue-100">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <span className="text-gray-500 w-28 flex-shrink-0">Học phí:</span>
                    <span className="font-semibold text-gray-800">{selectedData.fee}</span>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => {
                      const element = document.getElementById("consultation-form");
                      if (element) {
                         element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2.5 bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-base cursor-pointer"
                  >
                    Nhận tư vấn ngay
                    <Send className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingContactButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="Facebook Messenger"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.9 1.45 5.49 3.71 7.16v4.09l3.95-2.17c1.05.29 2.17.45 3.34.45 5.523 0 10-4.145 10-9.25S17.523 2 12 2zm1.03 12.45l-2.54-2.71-4.96 2.71 5.46-5.8 2.6 2.71 4.9-2.71-5.46 5.8z"/>
        </svg>
      </a>

      <a
        href="https://zalo.me/yourphone"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="Zalo"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.197.905 4.197 2.375 5.773L3.5 22l5.396-2.354c.994.265 2.05.404 3.104.404 5.523 0 10-4.145 10-9.25S17.523 2 12 2zm3.5 11.5h-7v-1h7v1zm0-2.5h-7v-1h7v1zm0-2.5h-7v-1h7v1z"/>
        </svg>
      </a>

      <a
        href="tel:+84123456789"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="Điện thoại"
      >
        <Phone className="w-6 h-6" />
      </a>

      <a
        href="https://facebook.com/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="Facebook"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
        </svg>
      </a>
    </div>
  );
}

function FooterComponent() {
  const addresses = [
    "VPT: Số 201 Cầu Giấy, phường Dịch Vọng, quận Cầu Giấy, TP Hà Nội",
    "Cơ sở 1: Số 169 Xuân Thủy, phường Dịch Vọng Hậu, quận Cầu Giấy, TP Hà Nội",
    "Cơ sở 2: Số 179 Trường Chinh, phường Khương Thượng, quận Thanh Xuân, TP Hà Nội",
    "Cơ sở 3: Tầng 1, Toà nhà N03-T7 Ngoại Giao Đoàn, phường Xuân Tảo, quận Bắc Từ Liêm, TP Hà Nội",
  ];
  const phones = ["0123456789", "0987654321"];
  const email = "info@masterlangpro.com";
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="brand_footer">
          <h2>MasterLangPro</h2>
          <strong>Đừng để tiếng Anh cản ngăn bạn tiến bước</strong>
          <p>
            MasterLangPro là hệ sinh thái đào tạo tiếng Anh toàn diện, bao gồm
            các chương trình: Tiếng Anh giao tiếp, luyện thi IELTS, luyện thi
            Toeic và tiếng Anh cho từng độ tuổi.
          </p>
        </div>
        <div className="about_footer">
          <h2>Về MasterLangPro</h2>
          <a href="#">Giới thiệu</a>
          <a href="#">Khoá học</a>
        </div>
        <div className="contact_footer">
          <h2>Học Tiếng Anh MasterLangPro</h2>
          {addresses.map((value, index) => {
            return (
              <div className="info" key={index}>
                {index === 0 ? (
                  <HomeAlt width={20} height={20} color={"#ffffff"} />
                ) : (
                  <div style={{ width: 20, height: 20, flexShrink: 0 }} />
                )}
                <span>{value}</span>
              </div>
            );
          })}
          <div className="info">
            <CustomPhoneIcon color={"#ffffff"} />
            <span>
              {phones.map((value, index) => {
                return index == phones.length - 1
                  ? value
                  : value.concat(" - ");
              })}
            </span>
          </div>
          <div className="info">
            <Envelope color={"#ffffff"} />
            <span>{email}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <NavigationBar />
      <HeroSlideshow />
      <DifficultiesSection />
      <RiplMethodology />
      <CoursesSection />
      <FloatingContactButtons />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
