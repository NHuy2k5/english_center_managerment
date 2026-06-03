import ListItem from "./ListItem";
import FormRegister from "./FormRegister";
import { HomeAlt, Phone, Envelope } from "@boxicons/react";
import ItemComponent from "./ItemComponent";
import exImage from "../../public/momangtammat.png";
const HomePage = () => {
  // prettier-ignore
  return (
    <>
      <nav>
        <ul>
          <ListItem>
            <a title="MasterLangPro" href="#">
              MasterLangPro
            </a>
          </ListItem>
          <ListItem>
            <a title="Giới thiệu" href="#">
              Giới thiệu
            </a>
          </ListItem>
          <ListItem>
            <a title="Khóa học" href="#">
              Khóa học
            </a>
          </ListItem>
          <ListItem>
            <a title="Tài khoản" href="#">
              Tài khoản
            </a>
          </ListItem>
        </ul>
      </nav>
      <section>
        <div className="form_register_container">
          <FormRegister />
        </div>
        <div className="reasons_container">
          <ItemComponent
            image={exImage}
            className={"item_component reason_componemt"}
            title="Thêm trải nghiệm mới"
            descriptions={["Trải nghiệm cùng với các bạn trong lớp"]}
            isMoreDetails={false}
          />
        </div>
        <div className="list_courses_container">
          <ItemComponent
            image={exImage}
            className={"item_component course_componemt"}
            title="Lớp Toeic Xuất phát 01"
            descriptions={["Lớp học toeic cho người mới bắt đầu"]}
            isMoreDetails={true}
          />
        </div>
        <div className="list_teachers_container">
          <ItemComponent
            image={exImage}
              className={"item_component teacher_componemt"}
            title="Nguyễn Văn A"
            descriptions={["Chứng chỉ IELTS 9.0","Có 10+ năm kinh nghiệm"]}
            isMoreDetails={false}
          />
        </div>
      </section>
      <footer>
        <div className="footer_about">
          <h2>MasterLangPro</h2>
          <h3>Đừng để tiếng Anh cản ngăn bạn tiến bước</h3>
          <p>
            MasterLangPro là hệ sinh thái đào tạo tiếng Anh toàn diện, bao gồm
            các chương trình: Tiếng Anh giao tiếp, luyện thi IELTS, luyện thi
            Toeic và tiếng Anh cho từng độ tuổi.
          </p>
        </div>
        <div className="footer_about">
          <h2>Về MasterLangPro</h2>
          <a href="#">Giới thiệu</a>
        </div>
        <div className="footer_about">
          <h2>Học Tiếng Anh MasterLangPro</h2>
          <div className="info">
            <span className="icon">
              <HomeAlt />
            </span>
            <p>
              VPT: VPT: Số 201 Cầu Giấy, phường Dịch Vọng, quận Cầu Giấy, TP Hà
              Nội
            </p>
          </div>
          <div className="info">
            <span className="icon">
              <Phone />
            </span>
            <p>0123456789-0987654321</p>
          </div>
          <div className="info">
            <span className="icon">
              <Envelope />
            </span>
            <p>info@masterlangpro.com</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default HomePage;
