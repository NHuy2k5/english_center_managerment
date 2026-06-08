import FooterComponent from "../layout/Footer/Footer";
import ListItem from "../components/ListItem";
import FormRegister from "../components/FormRegister";
import ItemComponent from "../components/ItemComponent";
import exImage from "../assets/images/momangtammat.png";
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
            descriptions={["Chứng chỉ IELTS 9.0", "Có 10+ năm kinh nghiệm"]}
            isMoreDetails={false}
          />
        </div>
      </section>
      <FooterComponent/>
    </>
  );
};
export default HomePage;
