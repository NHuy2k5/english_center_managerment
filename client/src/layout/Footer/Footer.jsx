import { HomeAlt, Phone, Envelope } from "../../assets/Icons";
import "./Footer.css";
const FooterComponent = () => {
  let addresses = [
    "VPT: Số 201 Cầu Giấy, phường Dịch Vọng, quận Cầu Giấy, TP Hà Nội",
    "Cơ sở 1: Số 169 Xuân Thủy, phường Dịch Vọng Hậu, quận Cầu Giấy, TP Hà Nội",
    "Cơ sở 2: Số 179 Trường Chinh, phường Khương Thượng, quận Thanh Xuân, TP Hà Nội",
    "Cơ sở 3: Tầng 1, Toà nhà N03-T7 Ngoại Giao Đoàn, phường Xuân Tảo, quận Bắc Từ Liêm, TP Hà Nội",
  ];
  let phones = ["0123456789", "0987654321"];
  let email = "info@masterlangpro.com";
  return (
    <>
      <footer className="footer">
        <div className="footer_container">
          <div className="brand_footer">
            <h2>EngPro</h2>
            <strong>Đừng để tiếng Anh cản ngăn bạn tiến bước</strong>
            <p>
              EngPro là hệ sinh thái đào tạo tiếng Anh toàn diện, bao gồm
              các chương trình: Tiếng Anh giao tiếp, luyện thi IELTS, luyện thi
              Toeic và tiếng Anh cho từng độ tuổi.
            </p>
          </div>
          <div className="about_footer">
            <h2>Về EngPro</h2>
            <a href="#">Giới thiệu</a>
            <a href="#">Khoá học</a>
          </div>
          <div className="contact_footer">
            <h2>Học Tiếng Anh EngPro</h2>
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
              <Phone color={"#ffffff"} />
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
    </>
  );
};
export default FooterComponent;
